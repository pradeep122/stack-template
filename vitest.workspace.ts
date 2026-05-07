// Vitest workspaces — running `vitest` at the repo root runs all package tests.
// Each app/package can still run `vitest` standalone.
export default [
  "apps/web/vitest.config.ts",
  "apps/agents/vitest.config.ts",
  "packages/lib/vitest.config.ts",
];
