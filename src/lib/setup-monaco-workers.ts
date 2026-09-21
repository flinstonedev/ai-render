/** Generated, self-hosted worker bundles; run pnpm workers before dev/build. */
if (typeof window !== "undefined") {
  (globalThis as Record<string, unknown>).MonacoEnvironment = {
    getWorker(_moduleId: string, label: string) {
      const worker = label === "graphql" ? "graphql" : label === "json" ? "json" : "editor";
      return new Worker(`/workers/${worker}.worker.js`);
    },
  };
}
