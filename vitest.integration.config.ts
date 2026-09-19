import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"

// Integration tests: spin up a real Postgres via Testcontainers, run against Node.
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    globals: true,
    include: ["**/*.integration.test.{ts,tsx}"],
    exclude: ["**/node_modules/**", "e2e/**"],
    testTimeout: 60_000,
    hookTimeout: 180_000,
    // Testcontainers manages a single shared Postgres per file; avoid
    // parallel workers stomping on the same container/port.
    fileParallelism: false,
  },
})
