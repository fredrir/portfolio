terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

data "aws_caller_identity" "current" {}
data "aws_partition" "current" {}

locals {
  # This role carries destructive AWS power (s3/sqs/iam), so only the protected
  # `production` environment may assume it. PRs must NOT be able to (a
  # pull_request or branch sub would let any same-repo PR job with id-token
  # run destructive AWS directly, bypassing the environment gate). Offline
  # `terraform validate` in CI needs no AWS credentials.
  allowed_subs = coalesce(var.allowed_subs, [
    "repo:${var.github_repository}:environment:production",
  ])
}

resource "aws_iam_openid_connect_provider" "github" {
  count          = var.create_oidc_provider ? 1 : 0
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
  thumbprint_list = [
    "6938fd4d98bab03faadb97b34396831e3780aea1",
    "1c58a3a8518e8759bf075b76b750d4f2df264fcd",
  ]
}

data "aws_iam_openid_connect_provider" "github" {
  count = var.create_oidc_provider ? 0 : 1
  url   = "https://token.actions.githubusercontent.com"
}

locals {
  oidc_provider_arn = var.create_oidc_provider ? aws_iam_openid_connect_provider.github[0].arn : data.aws_iam_openid_connect_provider.github[0].arn
}

data "aws_iam_policy_document" "assume" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [local.oidc_provider_arn]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = local.allowed_subs
    }
  }
}

# Scoped to project-prefixed resources plus the state bucket: enough for
# terraform plan/apply of this configuration, nothing account-wide.
data "aws_iam_policy_document" "terraform" {
  statement {
    sid    = "State"
    effect = "Allow"
    actions = [
      "s3:GetObject", "s3:PutObject", "s3:DeleteObject", "s3:ListBucket",
    ]
    resources = [
      "arn:${data.aws_partition.current.partition}:s3:::${var.state_bucket}",
      "arn:${data.aws_partition.current.partition}:s3:::${var.state_bucket}/*",
    ]
  }

  statement {
    sid     = "ProjectS3"
    effect  = "Allow"
    actions = ["s3:*"]
    resources = [
      "arn:${data.aws_partition.current.partition}:s3:::${var.project}-*",
      "arn:${data.aws_partition.current.partition}:s3:::${var.project}-*/*",
    ]
  }

  statement {
    sid       = "ProjectSQS"
    effect    = "Allow"
    actions   = ["sqs:*"]
    resources = ["arn:${data.aws_partition.current.partition}:sqs:*:${data.aws_caller_identity.current.account_id}:${var.project}-*"]
  }

  statement {
    sid    = "ProjectIAM"
    effect = "Allow"
    actions = [
      "iam:GetPolicy", "iam:GetPolicyVersion", "iam:ListPolicyVersions",
      "iam:CreatePolicy", "iam:CreatePolicyVersion", "iam:DeletePolicy", "iam:DeletePolicyVersion",
      "iam:TagPolicy", "iam:UntagPolicy",
      "iam:GetUser", "iam:CreateUser", "iam:DeleteUser", "iam:TagUser", "iam:UntagUser",
      "iam:ListAttachedUserPolicies", "iam:AttachUserPolicy", "iam:DetachUserPolicy",
      "iam:ListGroupsForUser", "iam:ListUserPolicies",
    ]
    resources = [
      "arn:${data.aws_partition.current.partition}:iam::${data.aws_caller_identity.current.account_id}:policy/${var.project}-*",
      "arn:${data.aws_partition.current.partition}:iam::${data.aws_caller_identity.current.account_id}:user/${var.project}-*",
    ]
  }

  statement {
    sid    = "ReadOidcProvider"
    effect = "Allow"
    actions = [
      "iam:GetOpenIDConnectProvider",
      "iam:GetRole", "iam:ListRolePolicies", "iam:ListAttachedRolePolicies", "iam:GetRolePolicy",
    ]
    resources = ["*"]
  }
}

resource "aws_iam_role" "terraform" {
  name               = "${var.project}-terraform"
  assume_role_policy = data.aws_iam_policy_document.assume.json
}

resource "aws_iam_role_policy" "terraform" {
  name   = "terraform"
  role   = aws_iam_role.terraform.id
  policy = data.aws_iam_policy_document.terraform.json
}

# Separate least-privilege role for read-only CI checks (the scheduled synthetic
# backup-freshness probe). Trusted by branch/schedule OIDC subs, NOT the
# environment — so ordinary workflows never touch the destructive terraform role.
data "aws_iam_policy_document" "reader_assume" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [local.oidc_provider_arn]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_repository}:ref:refs/heads/main"]
    }
  }
}

data "aws_iam_policy_document" "reader" {
  statement {
    sid       = "ListBackups"
    effect    = "Allow"
    actions   = ["s3:ListBucket"]
    resources = ["arn:${data.aws_partition.current.partition}:s3:::${var.project}-backups-prod"]
  }
  statement {
    sid       = "ReadBackups"
    effect    = "Allow"
    actions   = ["s3:GetObject"]
    resources = ["arn:${data.aws_partition.current.partition}:s3:::${var.project}-backups-prod/*"]
  }
}

resource "aws_iam_role" "reader" {
  name               = "${var.project}-ci-reader"
  assume_role_policy = data.aws_iam_policy_document.reader_assume.json
}

resource "aws_iam_role_policy" "reader" {
  name   = "reader"
  role   = aws_iam_role.reader.id
  policy = data.aws_iam_policy_document.reader.json
}
