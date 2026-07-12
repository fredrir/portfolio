#!/bin/bash
# LocalStack ready-hook: provision the local media bucket and queues.
set -euo pipefail

BUCKET=portfolio-media-dev
QUEUE=media-processing
DLQ=media-processing-dlq

# The admin UI uploads straight from the browser to the presigned S3 URL.
# LocalStack therefore needs the same CORS allowance as the production bucket.
# Ports are wildcarded because Vite selects the next free port when 3000 is in
# use (and both localhost spellings are common during development).
configure_cors() {
  awslocal s3api put-bucket-cors \
    --bucket "${BUCKET}" \
    --cors-configuration '{
      "CORSRules": [{
        "AllowedOrigins": ["http://localhost:*", "http://127.0.0.1:*"],
        "AllowedMethods": ["PUT"],
        "AllowedHeaders": ["*"],
        "ExposeHeaders": ["ETag"]
      }]
    }'
}

# `bun run dev` uses this fast path for an already-provisioned container.
if [[ "${1:-}" == "--cors-only" ]]; then
  configure_cors
  exit 0
fi

if ! awslocal s3api head-bucket --bucket "${BUCKET}" >/dev/null 2>&1; then
  awslocal s3 mb "s3://${BUCKET}"
fi

configure_cors

awslocal sqs create-queue --queue-name "${DLQ}"
DLQ_ARN=$(awslocal sqs get-queue-attributes \
  --queue-url "http://localhost:4566/000000000000/${DLQ}" \
  --attribute-names QueueArn \
  --query 'Attributes.QueueArn' --output text)

awslocal sqs create-queue --queue-name "${QUEUE}" --attributes "{
  \"VisibilityTimeout\": \"120\",
  \"RedrivePolicy\": \"{\\\"deadLetterTargetArn\\\":\\\"${DLQ_ARN}\\\",\\\"maxReceiveCount\\\":\\\"5\\\"}\"
}"
QUEUE_ARN=$(awslocal sqs get-queue-attributes \
  --queue-url "http://localhost:4566/000000000000/${QUEUE}" \
  --attribute-names QueueArn \
  --query 'Attributes.QueueArn' --output text)

awslocal s3api put-bucket-notification-configuration \
  --bucket "${BUCKET}" \
  --notification-configuration "{
    \"QueueConfigurations\": [{
      \"QueueArn\": \"${QUEUE_ARN}\",
      \"Events\": [\"s3:ObjectCreated:*\"],
      \"Filter\": {\"Key\": {\"FilterRules\": [{\"Name\": \"prefix\", \"Value\": \"originals/\"}]}}
    }]
  }"

echo "localstack init: bucket ${BUCKET}, queue ${QUEUE_ARN} (dlq ${DLQ_ARN}) ready"
