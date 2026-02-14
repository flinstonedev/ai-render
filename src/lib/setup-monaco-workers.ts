/**
 * Setup Monaco Editor workers for Next.js 16 with Turbopack.
 *
 * GraphiQL 5 uses Monaco Editor which requires web workers. Turbopack
 * creates module workers by default, but Monaco's AMD-based workers
 * need classic workers. We use getWorker() to create Worker instances
 * with explicit { type: 'classic' }.
 *
 * MUST be imported before any @graphiql/react or monaco-editor imports.
 */

if (typeof globalThis !== "undefined" && typeof window !== "undefined") {
  (globalThis as Record<string, unknown>).MonacoEnvironment = {
    baseUrl: "/monaco-editor/min/",
    getWorker() {
      return new Worker("/monaco-editor/min/vs/base/worker/workerMain.js", {
        type: "classic",
      });
    },
  };
}
