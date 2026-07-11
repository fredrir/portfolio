output "terraform_role_arn" {
  value = aws_iam_role.terraform.arn
}

output "reader_role_arn" {
  value = aws_iam_role.reader.arn
}
