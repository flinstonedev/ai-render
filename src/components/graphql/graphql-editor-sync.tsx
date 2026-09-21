"use client";

import { useEffect, useRef } from "react";
import { useEditorContext } from "@graphiql/react";
import { useGraphQLBridge } from "./graphql-context";

/**
 * Headless component that registers editor sync callbacks with the bridge context.
 * Must be rendered inside a GraphiQLProvider.
 * Uses Monaco editor instances directly for reliable visual updates.
 */
export function GraphQLEditorSync() {
  const editorContext = useEditorContext();
  const { registerEditorSync, setQuery, setVariables, setResults } = useGraphQLBridge();

  const queryEditorRef = useRef(editorContext.queryEditor);
  const variableEditorRef = useRef(editorContext.variableEditor);
  const responseEditorRef = useRef(editorContext.responseEditor);

  useEffect(() => {
    queryEditorRef.current = editorContext.queryEditor;
    variableEditorRef.current = editorContext.variableEditor;
    responseEditorRef.current = editorContext.responseEditor;
  }, [
    editorContext.queryEditor,
    editorContext.variableEditor,
    editorContext.responseEditor,
  ]);

  useEffect(() => {
    const query = editorContext.queryEditor;
    const variables = editorContext.variableEditor;
    const response = editorContext.responseEditor;
    const syncQuery = () => setQuery(query?.getValue() ?? "");
    const syncVariables = () => setVariables(variables?.getValue() || "{}");
    const syncResponse = () => {
      try { setResults(JSON.parse(response?.getValue() || "null")); }
      catch { setResults(null); }
    };
    syncQuery(); syncVariables(); syncResponse();
    const listeners = [
      query?.onDidChangeModelContent(syncQuery),
      variables?.onDidChangeModelContent(syncVariables),
      response?.onDidChangeModelContent(syncResponse),
    ];
    return () => listeners.forEach((listener) => listener?.dispose());
  }, [editorContext.queryEditor, editorContext.variableEditor, editorContext.responseEditor, setQuery, setVariables, setResults]);

  useEffect(() => {
    registerEditorSync({
      syncQueryToEditor: (query: string, variables?: string) => {
        queryEditorRef.current?.setValue(query);
        if (variables !== undefined) {
          variableEditorRef.current?.setValue(variables);
        }
      },
      syncResultsToEditor: (results: string) => {
        responseEditorRef.current?.setValue(results);
      },
    });

    return () => {
      registerEditorSync({
        syncQueryToEditor: () => {},
        syncResultsToEditor: () => {},
      });
    };
  }, [registerEditorSync]);

  return null;
}
