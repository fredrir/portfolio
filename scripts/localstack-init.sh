#!/bin/bash
# LocalStack ready-hook: provision the local media bucket and queues.
set -euo pipefail

BUCKET=portfolio-media-dev
QUEUE=media-processing
DLQ=media-processing-dlq

awslocal s3 mb "s3://${BUCKET}" || true

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
