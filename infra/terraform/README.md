# Terraform

Provisions the AWS and Cloudflare resources from the delivery plan
(ARCHITECTURE.md §9). The shared Hetzner server is deliberately **not**
managed here (see docs/vps-audit.md).

## Layout

| Path | Purpose |
|---|---|
| `bootstrap/` | One-time, local-state: creates the S3 state bucket |
| `modules/aws-media/` | Media/backup buckets, SQS + DLQ, least-privilege IAM |
| `modules/github-oidc/` | GitHub Actions OIDC provider + scoped CI role |
| `modules/cloudflare-ingress/` | Tunnel, DNS, Access service token (VPC variant flagged) |
| `envs/prod/` | Production composition, remote state `prod/terraform.tfstate` |
| `envs/preview/` | Preview composition, remote state `preview/terraform.tfstate` |

## First-time setup

```bash
cd bootstrap && terraform init && terraform apply   # state bucket, once
cd ../envs/prod
cp terraform.tfvars.example terraform.tfvars        # fill in ids
terraform init && terraform plan
```

Credentials come from the environment: `AWS_*` (or an assumed role) and
`CLOUDFLARE_API_TOKEN`. Never commit `terraform.tfvars` or state.

## Conventions

- Providers are version-pinned; `.terraform.lock.hcl` is committed.
- State: S3 backend with native locking (`use_lockfile`), encrypted.
- No secret values as Terraform inputs. The tunnel is created as
  remotely-managed; its connector token is fetched at deploy time via the
  Cloudflare API, not stored in state outputs. IAM access keys for runtime
  users are created out-of-band (`aws iam create-access-key`) and rotated
  without Terraform.
- Production applies run only from the protected GitHub `production`
  environment through the OIDC role.
