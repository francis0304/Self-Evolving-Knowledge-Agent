---
tags: [spark, pyspark, etl, patterns, glue]
created: 2026-05-26
updated: 2026-06-05
status: active
---

# Spark Job Patterns

Universal Apache Spark job patterns for ETL workloads (AWS Glue, Databricks, standalone Spark).

---

## Base Job Pattern

**What**: A bootstrap base class that every Spark job inherits from. Wires up SparkContext, SparkSession, and job context; parses CLI arguments; and provides environment-aware configuration. This pattern centralizes common setup logic and ensures consistent job initialization across all ETL jobs.

**When to use**:
- Building a library of reusable Spark jobs
- Need standard argument parsing across all jobs
- Want environment-aware configuration (dev/staging/prod)
- Need to inject common utilities (logging, metrics, parameter handling)
- Building on AWS Glue, Databricks, or standalone Spark

**Generic Example**:
```python
from abc import ABC, abstractmethod
from pyspark.sql import SparkSession
from argparse import ArgumentParser

class BaseSparkJob(ABC):
    """Base class for all Spark ETL jobs"""
    
    def __init__(self, app_name: str):
        self.app_name = app_name
        self.args = self._parse_args()
        self.spark = self._init_spark()
        self.env = self.args.env
        self.config = self._load_config()
    
    def _init_spark(self) -> SparkSession:
        """Initialize Spark session with common configuration"""
        return SparkSession.builder \
            .appName(self.app_name) \
            .config("spark.sql.adaptive.enabled", "true") \
            .config("spark.sql.adaptive.coalescePartitions.enabled", "true") \
            .getOrCreate()
    
    def _parse_args(self):
        """Parse CLI arguments with standard conventions"""
        parser = ArgumentParser()
        parser.add_argument('--env', required=True, choices=['dev', 'staging', 'prod'])
        parser.add_argument('--logical_date', required=True, help='ETL date (YYYY-MM-DD)')
        parser.add_argument('--mode', default='incremental', choices=['full', 'incremental'])
        return parser.parse_args()
    
    def _load_config(self) -> dict:
        """Load environment-specific configuration"""
        # Load from S3, config file, environment variables, etc.
        return {
            'dev': {'bucket': 'dev-data-lake', 'prefix': 'dev-'},
            'staging': {'bucket': 'staging-data-lake', 'prefix': 'stg-'},
            'prod': {'bucket': 'prod-data-lake', 'prefix': 'prd-'},
        }[self.env]
    
    @abstractmethod
    def execute(self):
        """Implement ETL logic in subclass"""
        pass
    
    def run(self):
        """Main entry point"""
        try:
            self.execute()
        finally:
            self.spark.stop()

# Usage
class MyETLJob(BaseSparkJob):
    def __init__(self):
        super().__init__(app_name="my_etl_job")
    
    def execute(self):
        logical_date = self.args.logical_date
        df = self.spark.read.parquet(f"s3://{self.config['bucket']}/raw/...")
        # ETL logic here

if __name__ == '__main__':
    job = MyETLJob()
    job.run()
```

**Benefits**:
- Consistent job initialization
- Centralized configuration management
- Easy to add new jobs (inherit and implement execute())
- Testable job logic separate from Spark setup

---

## Date-Partitioned Storage Pattern

**What**: Utility class for writing incremental data to S3/HDFS with date partitions and automatic schema evolution. Ensures target table exists, adds missing columns (additive-only evolution), and handles idempotent re-runs for specific dates without affecting other partitions.

**When to use**:
- Writing incremental data with date partitions
- Need automatic schema evolution when source adds columns
- Want idempotent re-runs for specific dates
- Working with heterogeneous sources (different schemas over time)

**Generic Example**:
```python
from pyspark.sql import DataFrame, SparkSession
from pyspark.sql.types import StructType, StructField, StringType

class DatePartitionedStorage:
    """Handle date-partitioned Parquet with schema evolution"""
    
    def __init__(
        self,
        spark: SparkSession,
        table_name: str,
        storage_location: str,
        logical_date: str,
        partition_column: str = 'logical_date'
    ):
        self.spark = spark
        self.table_name = table_name
        self.storage_location = storage_location
        self.logical_date = logical_date
        self.partition_column = partition_column
    
    def save(self, df: DataFrame, mode: str = 'overwrite'):
        """Save DataFrame with automatic schema evolution"""
        # Ensure table exists
        if not self._table_exists():
            self._create_table(df.schema)
        
        # Add missing columns to target (additive evolution only)
        target_schema = self._get_table_schema()
        df = self._align_schema(df, target_schema)
        
        # Add partition column
        df = df.withColumn(self.partition_column, F.lit(self.logical_date))
        
        # Write with partition overwrite
        df.write \
            .mode(mode) \
            .partitionBy(self.partition_column) \
            .parquet(self.storage_location)
    
    def _table_exists(self) -> bool:
        return self.spark.catalog.tableExists(self.table_name)
    
    def _create_table(self, schema: StructType):
        """Create external table pointing to storage location"""
        self.spark.catalog.createTable(
            self.table_name,
            path=self.storage_location,
            schema=schema,
            partitionBy=[self.partition_column]
        )
    
    def _get_table_schema(self) -> StructType:
        return self.spark.table(self.table_name).schema
    
    def _align_schema(self, df: DataFrame, target_schema: StructType) -> DataFrame:
        """Add missing columns to match target schema"""
        existing_cols = set(df.columns)
        target_cols = [field.name for field in target_schema.fields]
        
        # Add missing columns as null
        for col in target_cols:
            if col not in existing_cols:
                df = df.withColumn(col, F.lit(None).cast(StringType()))
        
        # Align column order
        return df.select(*target_cols)

# Usage
storage = DatePartitionedStorage(
    spark=spark,
    table_name="my_database.transactions",
    storage_location="s3://data-lake/transactions/",
    logical_date="2026-06-03"
)
storage.save(df)
```

**Benefits**:
- Automatic schema evolution (additive)
- Idempotent date partition writes
- No manual schema management

**Trade-offs**:
- Additive-only (can't remove or rename columns)
- All columns stored as STRING to avoid type issues

---

## RDBMS Ingestion Pattern

**What**: Standard pattern for ingesting relational database tables (MySQL, PostgreSQL, SQL Server, Oracle) into S3/HDFS as date-partitioned Parquet. Supports full and incremental modes with hash-based JDBC partitioning for parallelization.

**When to use**:
- Ingesting RDBMS tables to data lake
- Need incremental loads based on update timestamp
- Large tables (10M+ rows) requiring parallel JDBC reads
- Want consistent type casting to avoid downstream issues

**Generic Example**:
```python
class RDBMSIngestJob(BaseSparkJob):
    """Ingest RDBMS table to S3 with date partitioning"""
    
    def execute(self):
        # Parse job-specific arguments
        source_table = self.args.source_table
        mode = self.args.mode  # 'full' or 'incremental'
        
        # Build JDBC URL from config
        jdbc_url = self._get_jdbc_url()
        
        # Build WHERE clause for incremental
        where_clause = self._build_where_clause(mode)
        
        # Read with partitioning for parallelism
        df = self.spark.read \
            .format("jdbc") \
            .option("url", jdbc_url) \
            .option("dbtable", f"(SELECT * FROM {source_table} {where_clause}) AS subquery") \
            .option("partitionColumn", "id") \
            .option("lowerBound", "0") \
            .option("upperBound", "10000000") \
            .option("numPartitions", "20") \
            .load()
        
        # Cast all columns to STRING (avoid type mismatches)
        for col in df.columns:
            df = df.withColumn(col, F.col(col).cast(StringType()))
        
        # Save to date-partitioned storage
        storage = DatePartitionedStorage(
            spark=self.spark,
            table_name=f"ods.{source_table}",
            storage_location=f"s3://{self.config['bucket']}/ods/{source_table}/",
            logical_date=self.args.logical_date
        )
        storage.save(df)
    
    def _build_where_clause(self, mode: str) -> str:
        """Build incremental WHERE clause"""
        if mode == 'full':
            return ""
        
        logical_date = self.args.logical_date
        next_date = (datetime.strptime(logical_date, '%Y-%m-%d') + timedelta(days=1)).strftime('%Y-%m-%d')
        
        return f"""WHERE updated_at >= '{logical_date}' AND updated_at < '{next_date}'"""
```

**Best Practices**:
- Use `partitionColumn` and `numPartitions` for parallel reads
- Cast all columns to STRING to avoid type mismatches
- Use incremental mode with timestamp columns
- Idempotent re-runs by date partition

---

## Implementation Reference

For a complete working implementation of these patterns, see:
- `companies/current-company/reference/Glue Patterns (DP).md` - DP Spark job implementations
- BaseSparkJob with environment-aware config
- Daily partitioned Parquet with schema evolution

---

**Last Updated**: 2026-06-03
