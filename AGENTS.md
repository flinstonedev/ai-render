<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project policy

AI Render is a code-only local workbench. Keep development and start commands
bound to `127.0.0.1`; do not add application deployment automation or hosting
configuration. CI is for validation, repository hygiene and security checks.

Use synthetic/public examples, keep private data and credentials out of source
and test artifacts, and preserve the project license and upstream notices.
