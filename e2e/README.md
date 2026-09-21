# Browser integration tests

Run `pnpm exec playwright install chromium` once, then `pnpm test:e2e`.
The Playwright config starts its own development server on port 3174; set
`PLAYWRIGHT_PORT` to choose another unused local port. It refuses to reuse an
existing server and supplies an obviously synthetic Tambo key and `.invalid`
service URL, overriding any local credential configuration.

The tests use the real workbench, GraphiQL/Monaco editors, Tambo SDK stream
handling, component registry, and DataTable. They enter a query and variables
using keyboard input, run it, inspect the response editor, submit a chat prompt,
and check the generated table and the query context sent to the SDK. A separate
test covers an upstream GraphQL error followed by a successful retry.

Playwright intercepts GraphQL and Tambo HTTP requests. GraphQL executes against
a small synthetic schema with a real resolver, including variable filtering.
The Tambo fixture emits its normal AG-UI event stream; table rows are derived
from the app's outgoing query-result context, so a broken editor/context bridge
fails the test. Other external HTTP requests are blocked and fail the test, as
do missing app assets and browser runtime errors.

These tests exercise browser integration, not a live model's reasoning or the
server-side GraphQL proxy. Proxy validation and transport security need their
separate server tests. No paid AI calls or external API credentials are used.

To refresh the synthetic demo image at `docs/demo.png`, run
`UPDATE_DEMO_SCREENSHOT=1 pnpm test:e2e --grep "connects,"`.
Normal test runs do not change the image. The screenshot uses the actual app
after formatting the query through its editor shortcut and hides only Next.js's
development badge.
