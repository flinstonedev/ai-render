# Third-party software

The root MIT license covers original AI Render contributions. It does not replace
the licenses or attribution requirements of dependencies or copied components.

- `src/components/ui/` and `src/hooks/use-mobile.ts` derive from **shadcn/ui**.
  The original MIT notice is retained in [licenses/shadcn-MIT.txt](licenses/shadcn-MIT.txt).
  AI Render adds integration wrappers and has modified the carousel subscription
  and mobile media-query hook to use React's external-store API.
- **Monaco Editor 0.52.2**, copyright Microsoft Corporation, is MIT licensed.
  [License](licenses/monaco-editor-MIT.txt) and
  [third-party notices](licenses/monaco-editor-ThirdPartyNotices.txt) are retained.
  Previously committed AMD workers were removed; `pnpm workers` reproducibly
  bundles the installed editor, JSON and GraphQL workers. Generated assets retain
  linked legal comments and copies of upstream notices in `public/workers/`.
- **monaco-graphql 1.9.0** is part of the GraphiQL project, MIT licensed;
  see [its notice](licenses/monaco-graphql-MIT.txt). GraphiQL/GraphQL and Tambo are
  dependencies, not original AI Render implementations. Their installed packages
  retain their licenses.
- Other dependencies retain their own terms, including MIT, Apache-2.0 and ISC
  licenses. Consult the exact packages in `pnpm-lock.yaml` before redistributing
  dependencies. Do not replace dependency notices with the root MIT text.

No font binaries are vendored: the app uses system fonts. The deterministic demo
image and e2e fixtures use synthetic country records and a mocked AI response;
they contain no user conversations or private endpoint data.
