# Security and privacy

AI Render is a **code-only local workbench** for read-only queries against public
GraphQL endpoints. Run it on `127.0.0.1` using the provided local commands. Its API
is unauthenticated, so keep it on loopback. This repository has no deployment
automation or supported hosted-service workflow. `GRAPHQL_ALLOWED_ENDPOINTS`
restricts outbound targets; it does not authenticate users.

## Implemented boundaries

- HTTP(S) only; URL credentials and fragments rejected. Every resolved A/AAAA
  address must be ordinary public unicast. Loopback, private, link-local,
  metadata, CGNAT, reserved, mapped/tunnel and special-use ranges are rejected.
- The socket connects to one validated **literal IP**, retaining the original
  Host header and TLS server name/certificate verification. There is no second
  DNS resolution, proxy-environment fallback or pooled connection. All redirects
  are rejected. Dual-stack endpoints with any private result fail closed.
- Both API routes use this transport. Caller cookies, authorization and arbitrary
  headers are not forwarded. Response headers are not relayed; output is JSON
  with `no-store`. Browser requests from a different origin are rejected.
- Read-only GraphQL operations only, no batching/mutations/subscriptions. Request
  body: 256 KiB; query: 64 KiB/10,000 parsed tokens; upstream JSON: 2 MiB; upstream
  headers: 16 KiB. Compressed responses are refused. One 15-second deadline covers
  upload, DNS, connection and response. Client cancellation aborts the transport.
- Eight concurrent proxy requests per server process. This is a local resource
  bound, **not a distributed rate limit**. Pagination/cardinality and upstream
  resolver costs remain the endpoint operator's responsibility. A GraphQL query
  can still be expensive or have side effects in a poorly designed upstream API.

DNS lookup cancellation stops this app's operation and prevents a later connection;
the operating system's underlying lookup may finish in the background. No network
boundary can protect against privileged host routing changes or a malicious
allowed public service. Keep local dependencies current.

## Data flow and retention

The browser sends endpoint/query/variables through this Next.js server to the
selected public GraphQL API. The server buffers bounded requests/results in memory
and does not intentionally write them to disk or log them. Local development tools
and the external APIs you contact may maintain separate logs.

With AI chat configured, submitting a message sends chat content, endpoint/schema,
query, variables and a result excerpt to the configured Tambo service and its model
provider. AI tools can query the connected endpoint and return additional data to
that service. The SDK/provider may retain conversations; check its retention and
deletion controls. Use synthetic or already-public data, never customer secrets.

GraphiQL persistence is disabled. App query/result state is in memory. Theme
preference may be stored by next-themes. Each mounted AI conversation uses a new
random grouping key instead of a shared default identity; **this is not an
authenticated user identity**.
Reloading/disconnecting clears local context, not provider-side history.

`NEXT_PUBLIC_TAMBO_API_KEY` and `NEXT_PUBLIC_TAMBO_URL` are visible in browser code.
Use only credentials explicitly intended for browser use, provider restrictions
and spending caps. Never put a secret service credential in `NEXT_PUBLIC_*`.

## Reporting

For a vulnerability, use the repository's GitHub **Security → Report a vulnerability**
option when enabled. If unavailable, ask the maintainer for a private reporting
channel without including exploit details, sensitive endpoints, data or credentials
in a public issue. There is no promised response SLA for this experimental project.

Tests cover address/URL denial, mixed DNS results, pinning/TLS options, redirect
refusal, malformed/oversized bodies, deadlines/cancellation, concurrency and normal
query routing. Browser tests use synthetic GraphQL and AI fixtures; they do not
certify a paid provider's uptime, output quality, authorization or retention.
