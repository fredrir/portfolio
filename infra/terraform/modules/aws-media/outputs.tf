output "media_bucket" {
  value = aws_s3_bucket.media.bucket
}

output "media_bucket_arn" {
  value = aws_s3_bucket.media.arn
}

output "backup_bucket" {
  value = var.create_backup_bucket ? aws_s3_bucket.backups[0].bucket : null
}

output "media_queue_url" {
  value = aws_sqs_queue.media.url
}

output "media_dlq_url" {
  value = aws_sqs_queue.media_dlq.url
}

output "runtime_user_names" {
  value = { for k, u in aws_iam_user.runtime : k => u.name }
}
