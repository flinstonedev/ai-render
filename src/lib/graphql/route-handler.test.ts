// @vitest-environment node
import { beforeEach, expect, it, vi } from "vitest";
import { POST as execute } from "@/app/api/graphql/execute/route";
import { POST as introspect } from "@/app/api/graphql/introspect/route";
import { requestPublicGraphQL, withAbort } from "./proxy";

vi.mock("./proxy", async (importOriginal) => ({ ...await importOriginal<typeof import("./proxy")>(), requestPublicGraphQL: vi.fn() }));
function request(body: unknown, headers: Record<string, string> = {}, signal?: AbortSignal) {
  return new Request("http://localhost/api/graphql/execute", { method: "POST", body: JSON.stringify(body), signal, headers: { "content-type": "application/json", "x-graphql-endpoint": "https://example.com/graphql", ...headers } });
}
beforeEach(() => { vi.resetAllMocks(); vi.mocked(requestPublicGraphQL).mockResolvedValue({ status: 200, data: { data: { hello: "world" } } }); });
it("handles a normal query with variables and no-store output", async () => {
  const response = await execute(request({ query: "query Q($id: ID!) { item(id: $id) { name } }", operationName: "Q", variables: { id: "one" } }));
  expect(response.status).toBe(200);
  expect(response.headers.get("cache-control")).toBe("no-store");
  expect(JSON.parse(vi.mocked(requestPublicGraphQL).mock.calls[0][1])).toMatchObject({ operationName: "Q", variables: { id: "one" } });
});
it("introspects through the same protected transport", async () => {
  expect((await introspect(request({ endpoint: "https://example.com/graphql" }))).status).toBe(200);
  expect(vi.mocked(requestPublicGraphQL).mock.calls[0][1]).toContain("IntrospectionQuery");
});
it.each([{ query: "mutation { removeAll }" }, { query: "subscription { changes }" }, { query: "{" }, { query: "{ hello }", variables: [] }, [{ query: "{ hello }" }], { query: "{ hello }", headers: { Authorization: "not-forwarded" } }])("rejects unsafe/invalid operation %j before network access", async (payload) => {
  expect((await execute(request(payload))).status).toBe(400);
  expect(requestPublicGraphQL).not.toHaveBeenCalled();
});
it("rejects cross-origin calls before network access", async () => {
  expect((await execute(request({ query: "{ hello }" }, { origin: "https://elsewhere.example" }))).status).toBe(403);
  expect(requestPublicGraphQL).not.toHaveBeenCalled();
});
it("caps concurrent requests and releases slots when cancelled", async () => {
  vi.mocked(requestPublicGraphQL).mockImplementation((_endpoint, _body, signal) => withAbort(new Promise(() => {}), signal));
  const controllers = Array.from({ length: 8 }, () => new AbortController());
  const pending = controllers.map((controller) => execute(request({ query: "{ hello }" }, {}, controller.signal)));
  expect((await execute(request({ query: "{ hello }" }))).status).toBe(429);
  controllers.forEach((controller) => controller.abort());
  expect((await Promise.all(pending)).every((response) => response.status === 408)).toBe(true);
  vi.mocked(requestPublicGraphQL).mockResolvedValue({ status: 200, data: { data: {} } });
  expect((await execute(request({ query: "{ hello }" }))).status).toBe(200);
});
