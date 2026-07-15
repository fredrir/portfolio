terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

locals {
  media_bucket  = "${var.project}-media-${var.environment}"
  backup_bucket = "${var.project}-backups-${var.environment}"
  queue_name    = "${var.project}-media-processing-${var.environment}"
}

# ---------------------------------------------------------------- media bucket

resource "aws_s3_bucket" "media" {
  bucket = local.media_bucket
}

resource "aws_s3_bucket_versioning" "media" {
  bucket = aws_s3_bucket.media.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "media" {
  bucket = aws_s3_bucket.media.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "media" {
  bucket                  = aws_s3_bucket.media.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# The administration UI uploads originals directly to presigned S3 URLs, so
# browsers must be allowed to preflight and perform the signed PUT. Keep the
# origin list explicit at each environment root rather than allowing every
# website to use an otherwise-leaked upload URL.
resource "aws_s3_bucket_cors_configuration" "media" {
  count  = length(var.upload_allowed_origins) > 0 ? 1 : 0
  bucket = aws_s3_bucket.media.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT"]
    allowed_origins = var.upload_allowed_origins
    expose_headers  = ["ETag"]
    max_age_seconds = 3600
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "media" {
  bucket = aws_s3_bucket.media.id

  rule {
    id     = "abort-incomplete-multipart"
    status = "Enabled"
    filter {}
    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }

  rule {
    id     = "expire-noncurrent-versions"
    status = "Enabled"
    filter {}
    noncurrent_version_expiration {
      noncurrent_days = 90
    }
  }
}

resource "aws_s3_bucket_logging" "media" {
  count         = var.create_backup_bucket ? 1 : 0
  bucket        = aws_s3_bucket.media.id
  target_bucket = aws_s3_bucket.backups[0].id
  target_prefix = "s3-access-logs/media/"
}

# ------------------------------------------------------------------- queueing

resource "aws_sqs_queue" "media_dlq" {
  name                      = "${local.queue_name}-dlq"
  message_retention_seconds = 14 * 24 * 3600
  # Messages carry S3 object keys — encrypt them at rest.
  sqs_managed_sse_enabled = true
}

resource "aws_sqs_queue" "media" {
  name                       = local.queue_name
  visibility_timeout_seconds = var.visibility_timeout_seconds
  sqs_managed_sse_enabled    = true
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.media_dlq.arn
    maxReceiveCount     = var.max_receive_count
  })
}

data "aws_iam_policy_document" "s3_to_sqs" {
  statement {
    effect    = "Allow"
    actions   = ["sqs:SendMessage"]
    resources = [aws_sqs_queue.media.arn]
    principals {
      type        = "Service"
      identifiers = ["s3.amazonaws.com"]
    }
    condition {
      test     = "ArnEquals"
      variable = "aws:SourceArn"
      values   = [aws_s3_bucket.media.arn]
    }
  }
}

resource "aws_sqs_queue_policy" "media" {
  queue_url = aws_sqs_queue.media.id
  policy    = data.aws_iam_policy_document.s3_to_sqs.json
}

resource "aws_s3_bucket_notification" "media" {
  bucket = aws_s3_bucket.media.id

  queue {
    queue_arn     = aws_sqs_queue.media.arn
    events        = ["s3:ObjectCreated:*"]
    filter_prefix = "originals/"
  }

  depends_on = [aws_sqs_queue_policy.media]
}

# --------------------------------------------------------------- backup bucket

resource "aws_s3_bucket" "backups" {
  count  = var.create_backup_bucket ? 1 : 0
  bucket = local.backup_bucket
}

resource "aws_s3_bucket_versioning" "backups" {
  count  = var.create_backup_bucket ? 1 : 0
  bucket = aws_s3_bucket.backups[0].id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "backups" {
  count  = var.create_backup_bucket ? 1 : 0
  bucket = aws_s3_bucket.backups[0].id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "backups" {
  count                   = var.create_backup_bucket ? 1 : 0
  bucket                  = aws_s3_bucket.backups[0].id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "backups" {
  count  = var.create_backup_bucket ? 1 : 0
  bucket = aws_s3_bucket.backups[0].id

  rule {
    id     = "expire-old-backups"
    status = "Enabled"
    filter {
      prefix = "postgres/"
    }
    expiration {
      days = var.backup_retention_days
    }
    noncurrent_version_expiration {
      noncurrent_days = 7
    }
  }

  # WAL and base backups underpin point-in-time recovery; keep them a little
  # longer than the newest base backup they replay onto.
  rule {
    id     = "expire-old-wal"
    status = "Enabled"
    filter {
      prefix = "wal/"
    }
    expiration {
      days = var.backup_retention_days + 5
    }
  }

  rule {
    id     = "expire-old-basebackups"
    status = "Enabled"
    filter {
      prefix = "basebackups/"
    }
    expiration {
      days = var.backup_retention_days + 5
    }
  }

  rule {
    id     = "abort-incomplete-multipart"
    status = "Enabled"
    filter {}
    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}

# ------------------------------------------------------- least-privilege IAM

data "aws_iam_policy_document" "api" {
  statement {
    sid       = "PresignOriginalUploads"
    effect    = "Allow"
    actions   = ["s3:PutObject"]
    resources = ["${aws_s3_bucket.media.arn}/originals/*"]
  }
}

data "aws_iam_policy_document" "worker" {
  statement {
    sid    = "ConsumeMediaQueue"
    effect = "Allow"
    actions = [
      "sqs:ReceiveMessage",
      "sqs:ChangeMessageVisibility",
      "sqs:DeleteMessage",
      "sqs:GetQueueAttributes",
    ]
    resources = [aws_sqs_queue.media.arn]
  }
  statement {
    sid       = "ReadOriginals"
    effect    = "Allow"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.media.arn}/originals/*"]
  }
  statement {
    sid     = "WriteProcessedArtifacts"
    effect  = "Allow"
    actions = ["s3:PutObject"]
    resources = [
      "${aws_s3_bucket.media.arn}/variants/*",
      "${aws_s3_bucket.media.arn}/cv/*",
    ]
  }
}

data "aws_iam_policy_document" "media_reader" {
  statement {
    sid     = "ReadPublishedArtifacts"
    effect  = "Allow"
    actions = ["s3:GetObject"]
    resources = [
      "${aws_s3_bucket.media.arn}/variants/*",
      "${aws_s3_bucket.media.arn}/cv/*",
    ]
  }
}

data "aws_iam_policy_document" "backup_writer" {
  count = var.create_backup_bucket ? 1 : 0
  statement {
    sid     = "WriteBackups"
    effect  = "Allow"
    actions = ["s3:PutObject", "s3:GetObject"]
    resources = [
      "${aws_s3_bucket.backups[0].arn}/postgres/*",
      "${aws_s3_bucket.backups[0].arn}/wal/*",
      "${aws_s3_bucket.backups[0].arn}/basebackups/*",
    ]
  }
  # Restoration tests must find the newest dump/WAL/base backup.
  statement {
    sid       = "ListBackups"
    effect    = "Allow"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.backups[0].arn]
    condition {
      test     = "StringLike"
      variable = "s3:prefix"
      values   = ["postgres/*", "wal/*", "basebackups/*"]
    }
  }
}

resource "aws_iam_policy" "api" {
  name   = "${var.project}-api-${var.environment}"
  policy = data.aws_iam_policy_document.api.json
}

resource "aws_iam_policy" "worker" {
  name   = "${var.project}-worker-${var.environment}"
  policy = data.aws_iam_policy_document.worker.json
}

resource "aws_iam_policy" "media_reader" {
  name   = "${var.project}-media-reader-${var.environment}"
  policy = data.aws_iam_policy_document.media_reader.json
}

resource "aws_iam_policy" "backup_writer" {
  count  = var.create_backup_bucket ? 1 : 0
  name   = "${var.project}-backup-writer-${var.environment}"
  policy = data.aws_iam_policy_document.backup_writer[0].json
}

# Runtime identities for the VPS services. Access keys are created and
# rotated out-of-band so no long-lived secret enters Terraform state.
resource "aws_iam_user" "runtime" {
  for_each = var.create_iam_users ? toset(["api", "worker", "media-reader", "backup"]) : []
  name     = "${var.project}-${each.key}-${var.environment}"
}

resource "aws_iam_user_policy_attachment" "api" {
  count      = var.create_iam_users ? 1 : 0
  user       = aws_iam_user.runtime["api"].name
  policy_arn = aws_iam_policy.api.arn
}

resource "aws_iam_user_policy_attachment" "worker" {
  count      = var.create_iam_users ? 1 : 0
  user       = aws_iam_user.runtime["worker"].name
  policy_arn = aws_iam_policy.worker.arn
}

resource "aws_iam_user_policy_attachment" "media_reader" {
  count      = var.create_iam_users ? 1 : 0
  user       = aws_iam_user.runtime["media-reader"].name
  policy_arn = aws_iam_policy.media_reader.arn
}

resource "aws_iam_user_policy_attachment" "backup" {
  count      = var.create_iam_users && var.create_backup_bucket ? 1 : 0
  user       = aws_iam_user.runtime["backup"].name
  policy_arn = aws_iam_policy.backup_writer[0].arn
}
