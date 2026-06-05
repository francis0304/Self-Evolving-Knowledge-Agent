---
tags: [aws, iam, security, patterns, access-control]
created: 2026-05-26
updated: 2026-06-05
status: active
---

# AWS IAM Best Practices

Universal IAM patterns for role-based access control, cross-account access, and least-privilege security.

---

## Role-Based Access Pattern

**What**: Organize IAM permissions by role type rather than individual users. Create service roles (for AWS services) and console roles (for human access) with clear permission boundaries. Use tag-based access control for fine-grained resource permissions.

**When to use**:
- Managing permissions for multiple services (ETL jobs, orchestrators, analytics)
- Need consistent permissions across environments
- Want centralized credential management
- Implementing least-privilege access
- Supporting multiple user personas (analysts, engineers, admins)

**Generic Example**:
```hcl
# Service Role - ETL Job Execution
resource "aws_iam_role" "etl_job_role" {
  name = "DATA-PLATFORM-ETL-JOB-${upper(var.environment)}"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "glue.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
  
  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AWSGlueServiceRole"
  ]
}

# Service Role - Orchestrator (broader permissions)
resource "aws_iam_role" "orchestrator_role" {
  name = "DATA-PLATFORM-ORCHESTRATOR-${upper(var.environment)}"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "airflow.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

# Console Role - Data Analyst (read-only)
resource "aws_iam_role" "data_analyst" {
  name = "DATA-PLATFORM-ANALYST-${upper(var.environment)}"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        AWS = "arn:aws:iam::${var.account_id}:root"
      }
      Action = "sts:AssumeRole"
      Condition = {
        StringEquals = {
          "sts:ExternalId" = var.external_id
        }
      }
    }]
  })
}

# Console Role - Data Engineer (full access)
resource "aws_iam_role" "data_engineer" {
  name = "DATA-PLATFORM-ENGINEER-${upper(var.environment)}"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        AWS = "arn:aws:iam::${var.account_id}:root"
      }
      Action = "sts:AssumeRole"
    }]
  })
}
```

**Permission Levels**:
- **Service roles**: Scoped to specific AWS service needs
- **Console read-only**: Analysts, viewers (DESCRIBE, SELECT, GET)
- **Console full-access**: Engineers, admins (ALL, CREATE, ALTER, DROP)

**Naming Convention**:
- Service roles: `<PREFIX>-<SERVICE>-<ENV>`
- Console roles: `<PREFIX>-<PERSONA>-<ENV>`

---

## Tag-Based Access Control

**What**: Use resource tags to control access to secrets, data, and resources without hardcoding ARNs. Services check for specific tags (e.g., `ServiceAccessible=true`) to determine permissions.

**When to use**:
- Managing access to secrets in Secrets Manager
- Fine-grained data lake permissions
- Want to grant access without updating IAM policies
- Supporting dynamic resource access

**Generic Example**:
```hcl
# Secrets Manager with tag-based access
resource "aws_secretsmanager_secret" "database_creds" {
  name = "rds/database/credentials"
  
  tags = {
    EtlJobAccessible    = "true"
    OrchestratorAccessible = "true"
  }
}

# IAM Policy - Tag-based secret access
resource "aws_iam_policy" "etl_secret_access" {
  name = "etl-job-secret-access"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = "*"
        Condition = {
          StringEquals = {
            "secretsmanager:ResourceTag/EtlJobAccessible" = "true"
          }
        }
      }
    ]
  })
}

# Two-tier access: read vs write
resource "aws_secretsmanager_secret" "editable_secret" {
  name = "config/editable"
  
  tags = {
    OrchestratorAccessible = "true"
    OrchestratorEditable   = "true"
  }
}

resource "aws_iam_policy" "orchestrator_secret_write" {
  name = "orchestrator-secret-write"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = ["secretsmanager:GetSecretValue"]
        Resource = "*"
        Condition = {
          StringEquals = {
            "secretsmanager:ResourceTag/OrchestratorAccessible" = "true"
          }
        }
      },
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:PutSecretValue",
          "secretsmanager:UpdateSecret"
        ]
        Resource = "*"
        Condition = {
          StringEquals = {
            "secretsmanager:ResourceTag/OrchestratorEditable" = "true"
          }
        }
      }
    ]
  })
}
```

**Benefits**:
- No IAM policy updates when adding secrets
- Clear access boundaries via tags
- Two-tier access (read vs write)
- Scales to hundreds of secrets

---

## Cross-Account Access Pattern

**What**: Enable one AWS account to assume roles in another account for data sharing, ETL access, or service integration. Uses assume role policies with trust relationships between accounts.

**When to use**:
- Accessing production databases from ETL account
- Sharing S3 data between accounts
- Enabling external partners to access specific resources
- Debugging by assuming service roles from console roles

**Generic Example**:
```hcl
# Account A (Data Platform) - Role that can be assumed
resource "aws_iam_role" "cross_account_etl" {
  name = "CROSS-ACCOUNT-ETL-ACCESS"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        AWS = "arn:aws:iam::${var.external_account_id}:role/ETL-ORCHESTRATOR"
      }
      Action = "sts:AssumeRole"
      Condition = {
        StringEquals = {
          "sts:ExternalId" = var.external_id  # Security best practice
        }
      }
    }]
  })
}

resource "aws_iam_role_policy" "cross_account_permissions" {
  role = aws_iam_role.cross_account_etl.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::production-database-exports/*",
          "arn:aws:s3:::production-database-exports"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "rds:DescribeDBInstances",
          "rds:DescribeDBSnapshots"
        ]
        Resource = "*"
      }
    ]
  })
}

# Account B (ETL Account) - Role that assumes cross-account role
resource "aws_iam_role_policy" "orchestrator_cross_account" {
  role = aws_iam_role.orchestrator.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = "sts:AssumeRole"
      Resource = "arn:aws:iam::${var.data_account_id}:role/CROSS-ACCOUNT-ETL-ACCESS"
    }]
  })
}

# Usage in application
import boto3

# Assume cross-account role
sts = boto3.client('sts')
assumed_role = sts.assume_role(
    RoleArn='arn:aws:iam::123456789012:role/CROSS-ACCOUNT-ETL-ACCESS',
    RoleSessionName='etl-session',
    ExternalId='secure-external-id'
)

# Use temporary credentials
s3 = boto3.client(
    's3',
    aws_access_key_id=assumed_role['Credentials']['AccessKeyId'],
    aws_secret_access_key=assumed_role['Credentials']['SecretAccessKey'],
    aws_session_token=assumed_role['Credentials']['SessionToken']
)
```

**Best Practices**:
- Always use ExternalId for third-party access
- Limit assume role permissions to specific principals
- Use session tags for audit trails
- Set appropriate session duration (default 1 hour)

---

## Environment-Based Security Lockdowns

**What**: Apply stricter security controls in production while allowing relaxed permissions in dev/staging for debugging and experimentation.

**Generic Example**:
```hcl
locals {
  is_prod = var.environment == "prod"
  
  # Production: strict; Non-prod: relaxed
  console_assume_service_roles = local.is_prod ? [] : [
    aws_iam_role.data_engineer.arn
  ]
}

# Service roles allow console assume in non-prod only
resource "aws_iam_role" "etl_job_role" {
  name = "ETL-JOB-${upper(var.environment)}"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = concat(
      [{
        Effect = "Allow"
        Principal = { Service = "glue.amazonaws.com" }
        Action = "sts:AssumeRole"
      }],
      # Allow console users in non-prod for debugging
      length(local.console_assume_service_roles) > 0 ? [{
        Effect = "Allow"
        Principal = { AWS = local.console_assume_service_roles }
        Action = "sts:AssumeRole"
      }] : []
    )
  })
}

# Interns/contractors only in non-prod
resource "aws_iam_role" "data_analyst_intern" {
  count = local.is_prod ? 0 : 1
  
  name = "DATA-ANALYST-INTERN-${upper(var.environment)}"
  # Read-only permissions
}
```

**Production Restrictions**:
- No console user → service role assumption
- No intern/contractor access
- Stricter logging and audit requirements
- Longer retention periods

---

## Implementation Reference

For a complete working implementation of these patterns, see:
- `companies/current-company/reference/SRE Patterns (DP).md` - DP IAM implementation
- Complete role catalog with service and console roles
- Tag-based Secrets Manager access
- Cross-account OLTP integration

---

**Last Updated**: 2026-06-03
