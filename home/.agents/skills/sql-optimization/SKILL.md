---
name: sql-optimization
description: Diagnose measured SQL performance problems across database engines. Use for slow queries, execution plans, indexing, pagination, or batch performance.
---

# SQL optimization

## Establish the contract

Identify the database engine and version, schema and indexes, exact query with parameters, required result semantics, representative data distribution, concurrency, and acceptable latency. Engine-specific syntax and optimizer behavior are not portable.

Capture a baseline with the engine's execution-plan facility and runtime statistics. Use production-like cardinality and parameter shapes; a plan on empty development data is weak evidence.

## Diagnose

Read the plan from the most expensive operations outward. Check:

- estimated versus actual rows and stale or insufficient statistics;
- scans, lookups, sorts, spills, temporary structures, and join algorithms;
- predicates that prevent useful index access;
- repeated work, correlated execution, and application-level N+1 behavior;
- lock waits, I/O, memory, connection pressure, and plan instability;
- rows read and transferred compared with rows returned.

## Change one cause

Choose the smallest semantics-preserving intervention: query shape, predicate, index, statistics, batching, caching, partitioning, or schema. Before applying it:

- prove output equivalence, including nulls, duplicates, collation, case sensitivity, ordering, and transaction behavior;
- evaluate index storage and write amplification;
- keep cursor pagination ordering total and stable by including a unique tie-breaker in both predicate and `ORDER BY`;
- preserve parameterization and authorization boundaries;
- use syntax documented for the identified engine/version.

An index is a hypothesis, not a requirement. An `INNER JOIN`, `UNION ALL`, normalized comparison, or rewritten predicate can change results; do not label a rewrite an optimization until semantics match.

## Verify

Run the same workload before and after. Compare plan shape, actual rows, elapsed time distribution, I/O, CPU, memory/spills, and write cost where relevant. Test cold and warm behavior when caching matters and inspect representative parameter values for plan regressions.

Report the engine/version, baseline, bottleneck, semantic invariants, change, measured result, write/storage trade-offs, and rollback path. For PostgreSQL-specific schema and operational guidance, also use `supabase-postgres-best-practices`.
