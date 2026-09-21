import { parse, print, type DocumentNode } from "graphql";

export function parseQuery(source: string): DocumentNode {
  return parse(source);
}

export function printQuery(ast: DocumentNode): string {
  return print(ast);
}

export function getOperationName(source: string): string | null {
  try {
    const document = parse(source);
    for (const definition of document.definitions) {
      if (definition.kind === "OperationDefinition") {
        return definition.name?.value ?? null;
      }
    }
    return null;
  } catch {
    return null;
  }
}
