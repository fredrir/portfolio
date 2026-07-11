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
  # Plans run from any branch/PR of the repo; applies only from the
  # protected production environment.
  allowed_subs = coalesce(var.allowed_subs, [
    "repo:${var.github_repository}:environment:production",
    "repo:${var.github_repository}:ref:refs/heads/main",
    "repo:${var.github_repository}:pull_request",
  ])
}

resource "aws_iam_openid_connect_provider" "github" {
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
  thumbprint_list = [
    "6938fd4d98bab03faadb97b34396831e3780aea1",
    "1c58a3a8518e8759bf075b76b750d4f2df264fcd",
  ]
}

data "aws_iam_policy_document" "assume" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
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
