# ADR 0005 — Never Terraform-manage shared resources

Status: accepted (2026-07-11)

## Context

Two resources this platform depends on are shared with other tenants or
projects and pre-existed it: the Hetzner VPS (`llunde-parser`, which also
runs leploy's pyparser stack) and the account-wide GitHub Actions OIDC
provider in AWS IAM (one per account per issuer URL; the first prod apply
409'd on it because another project had created it).

## Decision

Terraform never owns a resource whose lifecycle it does not control
exclusively:

- The Hetzner server resource is not in any Terraform configuration; host
  changes are additive scripts (`infra/host/bootstrap.sh`, `install.sh`)
  scoped to the `portfolio` user.
- The GitHub OIDC provider is referenced via a data source
  (`create_oidc_provider = false` in prod); the module only owns the
  project-scoped role attached to it.
- Disaster-recovery rebuild exercises target a scratch server, never the
  shared host.
- ufw stays as-is (Docker's nftables chains coexist with it today); the
  firewall posture was audited, not rewritten.

## Consequences

- `terraform destroy` can never take down another project's dependency.
- The module stays reusable: standalone accounts set
  `create_oidc_provider = true`.
- Host provisioning is scripts rather than Terraform — documented and
  idempotent, formalizable as Ansible later without changing the model.
