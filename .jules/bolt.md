## 2026-03-31 - Memoize Snowball Stemmer Executions in Lunr Languages

**Learning:** Snowball stemming algorithms perform intensive charCodeAt/Among array lookup loops. Memoizing the resulting string per stemmer instance using a bounded Map cache (e.g. 2,000 entries) yields massive performance boosts (>100x speedup for repeated tokens) with minimal memory footprint.

**Action:** Ensure memoization logic in stemmers handles both raw strings and Lunr `Token` objects seamlessly using `token.update(memoizedFn)`. Always keep `terser` configuration `{ compress: false, mangle: false }` intact when minifying generated files to avoid unsafe AST mutations.
