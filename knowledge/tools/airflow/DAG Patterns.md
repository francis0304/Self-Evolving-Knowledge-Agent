---
tags: [airflow, patterns, orchestration, dag-factory]
created: 2026-05-26
updated: 2026-06-05
status: active
---

# Airflow DAG Patterns

Universal Airflow orchestration patterns applicable to any data platform.

---

## DAG Factory Pattern

**What**: A creational design pattern that materializes Airflow DAGs from domain entities instead of hand-coding DAG definitions. Factories consume structured pipeline configurations (dataclasses or config objects) and emit fully-wired DAGs with task groups, dependencies, and operators. This enables declarative DAG creation, config-driven scaling, and separation between pipeline logic (domain) and orchestration (Airflow).

**When to use**:
- You have multiple similar DAGs that follow the same structural pattern
- You need to scale from a few pipelines to dozens without code duplication
- You want to centralize orchestration wiring logic in one place
- You need to generate DAGs dynamically from configuration
- You want to prevent drift between similar DAG implementations

**Generic Example**:
```python
from dataclasses import dataclass
from typing import List

@dataclass
class PipelineConfig:
    """Domain-specific pipeline configuration"""
    pipeline_id: str
    source_tables: List[str]
    target_schema: str
    schedule: str
    
class PipelineDAGFactory:
    """Factory that creates DAGs from pipeline configs"""
    
    def __init__(self, common_config):
        self.common_config = common_config
    
    def create_dag(self, pipeline_config: PipelineConfig) -> DAG:
        """Create a fully-wired DAG from config"""
        dag = DAG(
            dag_id=f"{pipeline_config.pipeline_id}_pipeline",
            schedule=pipeline_config.schedule,
            default_args=self.common_config.default_args,
        )
        
        with dag:
            # Wire up task groups based on config
            start = DummyOperator(task_id='start')
            extract_tasks = self._create_extract_tasks(pipeline_config)
            transform = self._create_transform_task(pipeline_config)
            load = self._create_load_task(pipeline_config)
            
            start >> extract_tasks >> transform >> load
        
        return dag
    
    def create_all_dags(self, configs: List[PipelineConfig]):
        """Register multiple DAGs at once"""
        for config in configs:
            dag = self.create_dag(config)
            globals()[dag.dag_id] = dag

# Usage in DAG file
factory = PipelineDAGFactory(common_config)
pipeline_configs = load_pipeline_configs()  # From YAML, database, etc.
factory.create_all_dags(pipeline_configs)
```

**Benefits**:
- Single source of truth for DAG structure
- Easy to add new pipelines without code changes
- Consistent retry/timeout/pool configuration
- Testable factory logic separate from Airflow runtime

**Trade-offs**:
- Adds abstraction layer (harder for Airflow beginners)
- Less flexible than hand-coded DAGs for unique workflows
- Config schema must be well-designed upfront

**Related Patterns**:
- Builder Pattern (for constructing complex configs)
- Strategy Pattern (for varying task creation logic)

---

## Operator Factory Pattern

**What**: Factory functions or classes that dispatch operator creation based on runtime parameters (database type, source system, etc.). Enables polymorphic DAG construction without conditional logic in the DAG factory, while custom operators encapsulate domain-specific business logic.

**When to use**:
- Need database-specific or source-specific behavior without if/else in DAG code
- Building reusable operators for domain tasks (warmup, validation, logging)
- Want type-safe operator creation with substitutability
- Need to support multiple backend types (MySQL, PostgreSQL, SQL Server, etc.)
- Implementing soft-fail behavior for non-critical tasks

**Generic Example**:
```python
from enum import Enum
from airflow.models import BaseOperator

class DatabaseType(Enum):
    MYSQL = "mysql"
    POSTGRES = "postgres"
    SQLSERVER = "sqlserver"

def create_extract_operator(
    task_id: str,
    db_type: DatabaseType,
    table_config: dict,
    **kwargs
) -> BaseOperator:
    """Factory dispatches operator by database type"""
    if db_type == DatabaseType.MYSQL:
        return MySqlExtractOperator(task_id, table_config, **kwargs)
    elif db_type == DatabaseType.POSTGRES:
        return PostgresExtractOperator(task_id, table_config, **kwargs)
    elif db_type == DatabaseType.SQLSERVER:
        return SqlServerExtractOperator(task_id, table_config, **kwargs)
    else:
        raise ValueError(f"Unsupported database type: {db_type}")

# Custom operator with soft-fail
class ValidationOperator(BaseOperator):
    """Domain-specific operator with soft-fail support"""
    
    def __init__(self, validation_config, soft_fail=False, **kwargs):
        super().__init__(**kwargs)
        self.validation_config = validation_config
        self.soft_fail = soft_fail
    
    def execute(self, context):
        try:
            result = self._run_validation()
            if not result.passed:
                raise ValueError(f"Validation failed: {result.message}")
        except Exception as e:
            if self.soft_fail:
                self.log.warning(f"Soft-fail validation: {e}")
                return None
            raise
```

**Benefits**:
- Clean separation of concerns
- Easy to add new database/source types
- Polymorphism without runtime conditionals
- Testable operator logic in isolation

**Trade-offs**:
- More classes to maintain
- Factory dispatch logic must be updated for new types

---

## Connection Management Pattern

**When to use**:
- Managing database credentials across environments
- Need centralized credential rotation (e.g., AWS Secrets Manager)
- Connecting to multiple backend types from operators
- Preventing connection pool exhaustion during parallel execution
- Implementing connection retry and timeout logic

**Generic Example**:
```python
from airflow.models.pool import Pool

class DatabaseClient:
    """Factory method for creating database clients from secrets"""
    
    @classmethod
    def from_secret(cls, secret_name: str, database: str, **kwargs):
        """Fetch credentials at runtime from secret store"""
        credentials = fetch_secret(secret_name)  # Your secret manager
        return cls(
            host=credentials['host'],
            port=credentials['port'],
            username=credentials['username'],
            password=credentials['password'],
            database=database,
            **kwargs
        )

# Use Airflow pools for connection throttling
class ExtractOperator(BaseOperator):
    def __init__(self, instance_key: str, **kwargs):
        super().__init__(
            pool=f"db_pool_{instance_key}",  # Limits concurrent tasks
            **kwargs
        )
```

**Best Practices**:
- Store credentials in secret manager, not Airflow Connections UI
- Use Airflow pools to throttle connections per database instance
- Implement connection retry with exponential backoff
- Use connection context managers for proper cleanup

---

## Implementation Reference

For a complete working implementation of these patterns, see:
- `companies/current-company/reference/Airflow Patterns (DP).md` - DP data platform implementation
- UnifiedDbDagFactory example with 5-7 layer orchestration
- RDBMS pipeline architecture with ODS, dbt, DQC layers

---

**Last Updated**: 2026-06-03
