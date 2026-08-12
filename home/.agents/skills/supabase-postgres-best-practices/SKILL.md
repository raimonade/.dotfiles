---
name: supabase-postgres-best-practices
description: Postgres schema, migration, security, query, indexing, and connection guidance. Use for Postgres or Supabase SQL work and database diagnosis.
license: MIT
metadata:
  author: supabase
  organization: Supabase
---

# Postgres best practices

Load only the reference files relevant to the operation and pinned Postgres/Supabase version.

## Route by concern

| Concern | References |
|---|---|
| Query plans and indexes | `query-*`, `monitor-explain-analyze.md`, `monitor-pg-stat-statements.md` |
| Connections | `conn-*` |
| RLS and privileges | `security-*` |
| Schema and migrations | `schema-*` |
| Locks and concurrency | `lock-*` |
| Pagination, writes, N+1 | `data-*` |
| JSONB, text search, partitioning | `advanced-*` and the relevant schema/query rule |

Before adding an index or rewriting a query, inspect the actual plan, statistics, cardinality, and representative parameters. Preserve result semantics and evaluate write/storage cost. For general cross-engine methodology, use `sql-optimization`; these references are PostgreSQL-specific.

For schema and migration work, check lock behavior, validation cost, rollback, and deploy ordering. For RLS, test both allowed and denied users and keep server-side authorization independent of client behavior.

Official Postgres and Supabase documentation for the installed version outrank examples in this bundle when APIs or operational behavior differ.
