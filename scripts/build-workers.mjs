import { build } from "esbuild";
import { mkdir, copyFile } from "node:fs/promises";

await mkdir("public/workers", { recursive: true });
await build({
  entryPoints: {
    editor: "monaco-editor/esm/vs/editor/editor.worker.js",
    json: "monaco-editor/esm/vs/language/json/json.worker.js",
    graphql: "monaco-graphql/esm/graphql.worker.js",
  },
  outdir: "public/workers", entryNames: "[name].worker",
  bundle: true, format: "iife", platform: "browser", target: "es2022",
  minify: true, legalComments: "linked",
});
for (const [from, to] of [
  ["node_modules/monaco-editor/LICENSE", "MONACO-LICENSE"],
  ["node_modules/monaco-editor/ThirdPartyNotices.txt", "MONACO-THIRD-PARTY-NOTICES.txt"],
  ["node_modules/monaco-graphql/LICENSE", "MONACO-GRAPHQL-LICENSE"],
]) await copyFile(from, `public/workers/${to}`);
