import type { Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { test, expect, endpoint, query, variables } from "./fixtures";

async function connectAndWriteQuery(page: Page) {
  await page.goto("/");
  await page.getByPlaceholder("https://countries.trevorblades.com/graphql").fill(endpoint);
  await page.getByRole("button", { name: "Connect", exact: true }).click();
  await expect(page.getByRole("button", { name: "Disconnect" })).toBeVisible();
  await expect(page.locator(".graphiql-explorer-container")).toContainText("countries");

  // Use real editor keyboard input, never mutate a Monaco model or app store.
  // GraphiQL mounts query and variables before the empty response editor.
  const editors = page.locator(".graphiql-editor .monaco-editor textarea");
  await expect(editors).toHaveCount(2);
  await editors.nth(0).focus();
  // Desktop Chrome uses a Windows user agent on every host, including macOS.
  await page.keyboard.press("Control+A");
  await page.keyboard.press("Backspace");
  await expect(editors.nth(0)).toHaveValue("");
  await page.keyboard.insertText(query);
  await expect(editors.nth(0)).toHaveValue(query);
  await editors.nth(1).focus();
  await page.keyboard.press("Control+A");
  await page.keyboard.press("Backspace");
  await expect(editors.nth(1)).toHaveValue("");
  await page.keyboard.insertText(JSON.stringify(variables));
}

async function selectResponse(page: Page, expectedContent: RegExp) {
  const response = page.getByRole("region", { name: "Result Window" })
    .getByRole("textbox", { name: "Editor content" });
  await response.focus();
  // Wait for the new result before selecting; a model update clears selection.
  await expect(response).toHaveValue(expectedContent);
  // Selecting the result exposes the whole buffer through Monaco's accessible
  // textarea, including rows outside its virtualized viewport.
  await page.keyboard.press("Control+A");
  return response;
}

test("connects, executes a filtered query, and renders its results through Tambo", async ({
  page,
  network,
}) => {
  if (process.env.UPDATE_DEMO_SCREENSHOT === "1") {
    await page.setViewportSize({ width: 1440, height: 1000 });
  }
  await connectAndWriteQuery(page);
  await page.getByRole("button", { name: "Run", exact: true }).click();

  const response = await selectResponse(page, /Aster Isles/);
  await expect(response).toHaveValue(/Aster Isles/);
  await expect(response).toHaveValue(/Birch Republic/);
  await expect(response).not.toHaveValue(/Clover Coast/);
  expect(network.graphQLQueries).toEqual([
    expect.objectContaining({ query, variables }),
  ]);

  const prompt = "Render the query results as a table";
  await page.getByPlaceholder("Ask AI to render results...").fill(prompt);
  await page.getByPlaceholder("Ask AI to render results...").press("Enter");

  const table = page.getByRole("table", { name: "Synthetic query results" });
  await expect(table).toBeVisible();
  expect(network.tamboRequests).toHaveLength(1);
  const request = network.tamboRequests[0];
  expect(request.message.content).toContainEqual({ type: "text", text: prompt });
  expect(request.availableComponents).toEqual(
    expect.arrayContaining([expect.objectContaining({ name: "DataTable" })]),
  );
  expect(request.message.additionalContext).toMatchObject({
    graphqlEndpoint: `Connected to: ${endpoint}`,
    currentQuery: `Current GraphQL query:\n${query}`,
    currentVariables: `Current query variables:\n${JSON.stringify(variables)}`,
    schemaSummary: expect.stringContaining("countries(currency: String!)"),
    queryResults: expect.stringContaining('"name": "Aster Isles"'),
  });
  await expect(table.getByRole("columnheader")).toHaveText(["Code", "Name", "Currency"]);
  await expect(table.getByRole("row")).toHaveCount(3);
  await expect(table.getByRole("cell")).toHaveText([
    "AS", "Aster Isles", "TST", "BR", "Birch Republic", "TST",
  ]);
  await expect(page.getByText("AI is thinking...", { exact: true })).toHaveCount(0);

  if (process.env.UPDATE_DEMO_SCREENSHOT === "1") {
    // Format through the real editor shortcut and clear selection for the demo.
    const queryEditor = page.locator(".graphiql-editor").first();
    await queryEditor.getByRole("textbox", { name: "Editor content" }).focus();
    await page.keyboard.press("Shift+Alt+F");
    await expect(queryEditor.getByRole("textbox", { name: "Editor content" }))
      .toHaveValue(/\{\n/);
    await queryEditor.getByRole("textbox", { name: "Editor content" }).focus();
    await page.keyboard.press("Control+Home");
    await response.focus();
    await page.keyboard.press("Control+Home");
    await page.getByText("AI Chat", { exact: true }).click();
    await mkdir("docs", { recursive: true });
    await page.screenshot({
      path: "docs/demo.png",
      fullPage: true,
      animations: "disabled",
      // Hide only the development server's badge; keep the actual app intact.
      style: "nextjs-portal { display: none; }",
    });
  }

  await page.getByRole("button", { name: "Disconnect" }).click();
  await expect(page.getByRole("button", { name: "Connect", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Run", exact: true })).toHaveCount(0);
});

test("shows a query error and recovers when the user runs again", async ({ page, network }) => {
  await connectAndWriteQuery(page);
  network.failQueries = true;
  await page.getByRole("button", { name: "Run", exact: true }).click();
  const response = await selectResponse(page, /Synthetic upstream query failure/);
  await expect(response).toHaveValue(/Synthetic upstream query failure/);
  await expect(response).not.toHaveValue(/Aster Isles/);

  network.failQueries = false;
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await selectResponse(page, /Aster Isles/);
  await expect(response).toHaveValue(/Aster Isles/);
  await expect(response).not.toHaveValue(/Synthetic upstream query failure/);
  expect(network.graphQLQueries).toHaveLength(2);
  expect(network.tamboRequests).toHaveLength(0);
});
