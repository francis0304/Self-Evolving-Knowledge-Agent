---
tags: [terraform, iac, infrastructure, patterns, cloud]
created: 2026-05-26
updated: 2026-06-05
status: active
---

# Terraform Infrastructure Patterns

Universal Infrastructure-as-Code patterns for cloud resource provisioning (AWS, Azure, GCP).

---

## Modular Job Provisioning

**What**: Reusable Terraform modules for provisioning compute jobs (AWS Glue, Databricks jobs, Cloud Functions, Lambda, etc.) with standardized configuration. Jobs are organized by data source or purpose in separate `*.tf` files, all sharing a common module for consistent settings.

**When to use**:
- Provisioning multiple similar compute jobs (ETL, ML, streaming)
- Standardizing job configuration across environments
- Using `for_each` patterns to provision many jobs from config maps
- Need consistent logging, metrics, and resource settings across jobs

**Generic Example**:
```hcl
# modules/compute_job/main.tf
variable "job_name" { type = string }
variable "script_location" { type = string }
variable "max_concurrent_runs" { type = number }
variable "worker_type" { type = string }
variable "number_of_workers" { type = number }
variable "environment_vars" { type = map(string) }

resource "aws_glue_job" "job" {
  name              = var.job_name
  role_arn          = var.execution_role_arn
  glue_version      = "5.0"
  worker_type       = var.worker_type
  number_of_workers = var.number_of_workers
  
  command {
    script_location = var.script_location
    python_version  = "3"
  }
  
  default_arguments = merge(
    {
      "--enable-metrics"            = "true"
      "--enable-continuous-cloudwatch-log" = "true"
      "--enable-spark-ui"          = "true"
      "--spark-event-logs-path"    = "s3://${var.log_bucket}/spark-logs/"
    },
    var.environment_vars
  )
  
  max_concurrent_runs = var.max_concurrent_runs
  timeout             = 2880  # 48 hours
}

# Root module: jobs_by_source.tf
locals {
  # Config-driven job definitions
  database_jobs = {
    "mysql-orders" = {
      source_db    = "orders_db"
      source_table = "orders"
      workers      = 10
    }
    "postgres-customers" = {
      source_db    = "customers_db"
      source_table = "customers"
      workers      = 5
    }
  }
}

# Use for_each to reduce duplication
module "database_etl_jobs" {
  for_each = local.database_jobs
  
  source = "./modules/compute_job"
  
  job_name            = "${var.prefix}-etl-${each.key}"
  script_location     = "s3://${var.bucket}/scripts/main.py"
  max_concurrent_runs = 1
  worker_type         = "G.1X"
  number_of_workers   = each.value.workers
  
  environment_vars = {
    "--source_db"    = each.value.source_db
    "--source_table" = each.value.source_table
    "--env"          = var.environment
  }
}
```

**Benefits**:
- Single module defines job structure
- Easy to add new jobs via config
- Consistent settings across all jobs
- `for_each` reduces duplication

**Best Practices**:
- Use naming conventions: `<PREFIX>-<SERVICE>-<PURPOSE>`
- Store scripts in versioned S3/GCS bucket
- Use environment-specific tfvars for job sizing
- Tag resources for cost tracking

---

## Multi-Environment Configuration

**What**: Multi-environment deployments (dev, staging, prod) using environment-specific `.tfvars` files. Each environment has distinct configurations for resource sizing, networking, permissions, and feature flags, with conditional logic controlled by local variables.

**When to use**:
- Deploying infrastructure to different environments
- Varying resource sizing by environment (smaller dev, full-scale prod)
- Implementing environment-specific permissions
- Using feature flags to enable/disable functionality per environment
- Testing changes in dev before promoting to production

**Generic Example**:
```hcl
# variables.tf
variable "environment" {
  type        = string
  description = "Environment name: dev, staging, prod"
}

variable "compute_config" {
  type = object({
    worker_type       = string
    number_of_workers = number
    max_capacity      = number
  })
}

variable "feature_flags" {
  type = map(bool)
  default = {}
}

# locals.tf
locals {
  env = var.environment
  
  # Conditionals based on environment
  is_prod = local.env == "prod"
  
  # Environment-specific resource naming
  prefix = "${var.global_prefix}-${upper(local.env)}"
  
  # Environment-aware configs
  retention_days = local.is_prod ? 90 : 30
  backup_enabled = local.is_prod ? true : false
}

# main.tf
resource "aws_glue_job" "etl" {
  # Conditional resources for non-prod
  count = local.is_prod ? 0 : 1
  
  name              = "${local.prefix}-DEBUG-JOB"
  number_of_workers = var.compute_config.number_of_workers
}

# Feature flags
resource "aws_lambda_function" "optional" {
  count = var.feature_flags["enable_lambda"] ? 1 : 0
  
  function_name = "${local.prefix}-OPTIONAL-FUNCTION"
  # ...
}

# conf/envs/dev.tfvars
environment = "dev"

compute_config = {
  worker_type       = "G.1X"
  number_of_workers = 2
  max_capacity      = 10
}

feature_flags = {
  enable_lambda = true
  enable_debug  = true
}

# conf/envs/prod.tfvars
environment = "prod"

compute_config = {
  worker_type       = "G.2X"
  number_of_workers = 20
  max_capacity      = 100
}

feature_flags = {
  enable_lambda = true
  enable_debug  = false
}

# Usage
terraform plan -var-file="conf/envs/dev.tfvars"
terraform apply -var-file="conf/envs/prod.tfvars"
```

**Benefits**:
- Single codebase for all environments
- Clear separation of environment config
- Safe testing in dev before prod
- Feature flags for gradual rollouts

**Best Practices**:
- Never commit secrets to tfvars (use secret managers)
- Document variable purposes in variables.tf
- Version control tfvars files
- Use consistent naming: `conf/envs/<env>.tfvars`

---

## Import and Move Workflows

**What**: Standard Terraform workflows for bringing existing resources under management (`import` blocks) and refactoring code without resource recreation (`moved` blocks). Enables surgical updates without full state refreshes.

**When to use**:
- Importing manually-created cloud resources into Terraform
- Refactoring Terraform code (moving resources to modules)
- Avoiding resource recreation during code restructuring
- Managing state migrations

**Generic Example**:
```hcl
# imports.tf - Import existing resources
import {
  to = aws_s3_bucket.data_lake
  id = "my-existing-bucket-name"
}

import {
  to = aws_iam_role.existing_role
  id = "ExistingRoleName"
}

# Workflow:
# 1. Add import block
terraform plan -generate-config-out="generated.tf"

# 2. Move generated config to appropriate file
# Edit generated.tf, copy resource to main.tf, delete generated.tf

# 3. Verify plan shows only import (no changes)
terraform plan

# 4. Apply import
terraform apply

# moved.tf - Refactoring without recreation
moved {
  from = aws_glue_job.old_location
  to   = module.compute_jobs.aws_glue_job.new_location
}

moved {
  from = aws_iam_role.standalone_role
  to   = module.iam_roles.aws_iam_role.modular_role
}

# Workflow:
# 1. Add moved block before refactoring
# 2. Run terraform plan (should show moves only, no create/destroy)
# 3. Apply moves
# 4. Remove moved blocks after successful migration
```

**Best Practices**:
- Always plan before apply
- Test imports in dev first
- Use moved blocks for all refactoring
- Run `terraform init` when adding modules
- Keep moved blocks until migration verified

---

## Targeted Apply Pattern

**What**: Using `--target` flag to apply changes to specific resources without full state refresh. Useful for surgical updates in large environments with hundreds of resources.

**When to use**:
- Updating specific resources in large state files
- Avoiding long full state refreshes
- Making IAM role permission changes
- Quick iterations during development

**Generic Example**:
```bash
# Single target
terraform apply --target=module.iam_roles.aws_iam_role.etl_role

# Multiple targets
terraform apply \
  --target=module.iam_roles.aws_iam_role.etl_role \
  --target=module.iam_roles.aws_iam_role.orchestrator_role

# Preview changes first
terraform plan --target=module.compute_jobs.aws_glue_job.mysql_etl
```

**Benefits**:
- Faster applies (seconds vs minutes)
- Limits blast radius
- Safer for production changes

**Cautions**:
- Skips full dependency graph validation
- May miss implicit dependencies
- Use full apply for major changes

---

## Implementation Reference

For a complete working implementation of these patterns, see:
- `companies/current-company/reference/Infrastructure Patterns (DP).md` - DP Terraform implementations
- Glue job provisioning with for_each
- MWAA orchestrator configuration
- Multi-environment tfvars structure

---

**Last Updated**: 2026-06-03
