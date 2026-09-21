# Contributing

This is a code-only project. Keep development, builds and experiments local, and
keep CI limited to validation and security checks. Do not add deployment automation.

Use Node.js 22.12+ (CI uses Node 22) and pnpm 10.18.2. From a clean clone:

```sh
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm check
pnpm exec playwright install chromium
pnpm test:e2e
```

No AI account or paid credential is required for tests. Browser tests mock the
GraphQL transport and Tambo stream, execute real synthetic GraphQL operations,
and fail on unexpected outbound HTTP. See [e2e/README.md](e2e/README.md).

Keep security tests independent of public networks. Add regression tests for new
proxy behavior, preserve DNS pinning/TLS verification/redirect refusal, and never
introduce a switch that permits private-network targets in the GraphQL proxy.
Use synthetic data and placeholders; do not commit `.env.local`, screenshots of
private data, traces, credentials, `node_modules`, or generated workers.

`pnpm workers` regenerates locally served worker bundles from installed, locked
dependencies. It runs before dev/build. Include upstream licenses/notices when
changing copied components or distributed assets. Review `pnpm audit` after
dependency changes; do not suppress advisories or update major versions blindly.

Describe the behavior change, reason, tests run, and remaining limits in a PR.
Report security findings through the private process in [SECURITY.md](SECURITY.md).
