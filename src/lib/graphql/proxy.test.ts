// @vitest-environment node
import { EventEmitter } from "node:events";
import { PassThrough } from "node:stream";
import type { IncomingMessage, ClientRequest, RequestOptions } from "node:http";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MAX_REQUEST_BYTES, MAX_RESPONSE_BYTES, readRequestJson, requestPublicGraphQL, withAbort } from "./proxy";
import { checkEndpointAllowlist, isPublicAddress, parseEndpoint } from "./url-validation";

const mocks = vi.hoisted(() => ({ lookup: vi.fn(), request: vi.fn() }));
vi.mock("node:dns/promises", () => ({ lookup: mocks.lookup }));
vi.mock("node:http", () => ({ request: mocks.request }));
vi.mock("node:https", () => ({ request: mocks.request }));
const publicIp = "93.184.216.34";
const signal = () => new AbortController().signal;
const body = JSON.stringify({ query: "{ countries { name } }" });

function upstream({ status = 200, headers = {}, chunks = ['{"data":{"countries":[]}}'] }:
  { status?: number; headers?: Record<string, string>; chunks?: (string | Buffer)[] } = {}) {
  const response = Object.assign(new PassThrough(), { statusCode: status, headers: { "content-type": "application/json", ...headers } });
  const destroy = vi.spyOn(response, "destroy");
  mocks.request.mockImplementation((options: RequestOptions, callback: (response: IncomingMessage) => void) => {
    const req = new EventEmitter() as ClientRequest;
    req.end = vi.fn(() => {
      queueMicrotask(() => {
        callback(response as unknown as IncomingMessage);
        if (!response.destroyed) { chunks.forEach((chunk) => response.write(chunk)); response.end(); }
      });
      return req;
    }) as ClientRequest["end"];
    options.signal?.addEventListener("abort", () => req.emit("error", new Error("aborted")), { once: true });
    return req;
  });
  return { response, destroy };
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.unstubAllEnvs();
  mocks.lookup.mockResolvedValue([{ address: publicIp, family: 4 }]);
  upstream();
});

describe("endpoint and address policy", () => {
  it.each([
    "0.0.0.0", "0.1.2.3", "127.0.0.1", "10.0.0.1", "172.16.0.1", "192.168.0.1",
    "169.254.169.254", "100.64.0.1", "192.0.0.1", "192.0.2.1", "198.18.0.1",
    "198.51.100.1", "203.0.113.1", "224.0.0.1", "240.0.0.1", "255.255.255.255",
    "::", "::1", "::ffff:127.0.0.1", "::ffff:8.8.8.8", "fe80::1", "fc00::1", "fd12::1",
    "fec0::1", "ff00::1", "64:ff9b::a00:1", "2002:7f00:1::", "2001:db8::1", "2001::1",
    "2001:2::1", "100::1", "3fff::1", "not-an-ip",
  ])("blocks special address %s", (address) => expect(isPublicAddress(address)).toBe(false));
  it.each([publicIp, "8.8.8.8", "2606:4700:4700::1111", "2001:4860:4860::8888"])("allows public address %s", (address) => expect(isPublicAddress(address)).toBe(true));
  it.each([
    "file:///etc/passwd", "ftp://example.com/graphql", "http://localhost/gql", "http://local/gql",
    "http://a.localhost/gql", "http://service.internal/gql", "http://127.1/gql", "http://2130706433/gql",
    "http://0x7f000001/gql", "http://[::ffff:7f00:1]/gql", "https://user:password@example.com/gql",
    "https://example.com/gql#fragment", "http://[fe80::1%25eth0]/", "https://example.com/" + "x".repeat(2048),
  ])("rejects unsafe URL %s", (url) => expect(() => parseEndpoint(url)).toThrow());
  it("uses exact canonical URLs for the optional allowlist", () => {
    vi.stubEnv("GRAPHQL_ALLOWED_ENDPOINTS", "https://example.com:443/graphql");
    expect(() => checkEndpointAllowlist(new URL("https://example.com/graphql"))).not.toThrow();
    expect(() => checkEndpointAllowlist(new URL("https://example.com/graphql?different=1"))).toThrow();
    expect(() => checkEndpointAllowlist(new URL("https://example.com.evil.org/graphql"))).toThrow();
    vi.stubEnv("GRAPHQL_ALLOWED_ENDPOINTS", "not-a-url");
    expect(() => checkEndpointAllowlist(new URL("https://example.com/graphql"))).toThrow(/misconfigured/);
  });
});

describe("pinned outbound transport", () => {
  it("resolves once, dials the checked IP, keeps Host/SNI and verifies TLS", async () => {
    mocks.lookup.mockResolvedValueOnce([{ address: publicIp, family: 4 }]).mockResolvedValue([{ address: "127.0.0.1", family: 4 }]);
    await expect(requestPublicGraphQL("https://example.com:8443/graphql?region=eu", body, signal())).resolves.toMatchObject({ status: 200 });
    expect(mocks.lookup).toHaveBeenCalledTimes(1);
    expect(mocks.request).toHaveBeenCalledTimes(1);
    expect(mocks.request.mock.calls[0][0]).toMatchObject({ hostname: publicIp, family: 4, port: "8443", servername: "example.com", rejectUnauthorized: true, agent: false, path: "/graphql?region=eu", headers: { Host: "example.com:8443", "Accept-Encoding": "identity" } });
    expect(mocks.request.mock.calls[0][0].lookup).toBeUndefined();
  });
  it("accepts literal public IPv6 without a DNS lookup", async () => {
    await requestPublicGraphQL("https://[2606:4700:4700::1111]/graphql", body, signal());
    expect(mocks.lookup).not.toHaveBeenCalled();
    expect(mocks.request.mock.calls[0][0]).toMatchObject({ hostname: "2606:4700:4700::1111", family: 6, headers: { Host: "[2606:4700:4700::1111]" } });
  });
  it.each([
    [{ address: "127.0.0.1", family: 4 }],
    [{ address: publicIp, family: 4 }, { address: "10.0.0.1", family: 4 }],
    [{ address: publicIp, family: 4 }, { address: "::ffff:a00:1", family: 6 }],
    [{ address: publicIp, family: 6 }], [],
  ])("never connects when DNS answers are unsafe: %j", async (...addresses) => {
    mocks.lookup.mockResolvedValue(addresses);
    await expect(requestPublicGraphQL("https://example.com/graphql", body, signal())).rejects.toThrow(/public/);
    expect(mocks.request).not.toHaveBeenCalled();
  });
  it.each([301, 302, 303, 307, 308])("refuses redirect %i without another request", async (status) => {
    const { destroy } = upstream({ status, headers: { location: "http://169.254.169.254/latest/meta-data" } });
    await expect(requestPublicGraphQL("https://example.com/graphql", body, signal())).rejects.toThrow(/redirects/);
    expect(mocks.request).toHaveBeenCalledTimes(1);
    expect(destroy).toHaveBeenCalled();
  });
  it("caps chunked responses even without a content-length", async () => {
    const { destroy } = upstream({ chunks: [Buffer.alloc(MAX_RESPONSE_BYTES), "x"] });
    await expect(requestPublicGraphQL("https://example.com/graphql", body, signal())).rejects.toThrow(/2 MiB/);
    expect(destroy).toHaveBeenCalled();
  });
  it.each([
    [{ "content-length": String(MAX_RESPONSE_BYTES + 1) }, /2 MiB/],
    [{ "content-encoding": "gzip" }, /uncompressed/],
    [{ "content-type": "text/html" }, /GraphQL JSON/],
  ])("rejects an unsafe upstream response %j", async (headers, message) => {
    upstream({ headers: headers as Record<string, string> });
    await expect(requestPublicGraphQL("https://example.com/graphql", body, signal())).rejects.toThrow(message);
  });
  it("returns a bounded GraphQL error without forwarding upstream headers", async () => {
    upstream({ status: 400, chunks: ['{"errors":[{"message":"Unknown field"}]}'] });
    await expect(requestPublicGraphQL("https://example.com/graphql", body, signal())).resolves.toEqual({ status: 400, data: { errors: [{ message: "Unknown field" }] } });
  });
  it("does not expose DNS details", async () => {
    mocks.lookup.mockRejectedValue(new Error("private internal resolver details"));
    await expect(requestPublicGraphQL("https://example.com/graphql", body, signal())).rejects.toThrow("The endpoint hostname could not be resolved.");
  });
  it("stops after a cancelled DNS lookup, even if DNS resolves later", async () => {
    let resolve!: (addresses: { address: string; family: number }[]) => void;
    mocks.lookup.mockReturnValue(new Promise((r) => { resolve = r; }));
    const abort = new AbortController();
    const pending = requestPublicGraphQL("https://example.com/graphql", body, abort.signal);
    abort.abort(new Error("deadline"));
    await expect(pending).rejects.toThrow("deadline");
    resolve([{ address: publicIp, family: 4 }]);
    await Promise.resolve();
    expect(mocks.request).not.toHaveBeenCalled();
  });
});

describe("incoming request bounds and cancellation", () => {
  function request(body: BodyInit, headers: Record<string, string> = {}) {
    return new Request("http://localhost/api/graphql/execute", { method: "POST", body, headers: { "content-type": "application/json", ...headers }, duplex: "half" } as RequestInit);
  }
  it("parses valid JSON", async () => expect(await readRequestJson(request(body), signal())).toEqual(JSON.parse(body)));
  it("rejects oversized streamed requests", async () => {
    const cancel = vi.fn();
    const stream = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(MAX_REQUEST_BYTES)); controller.enqueue(new Uint8Array(1)); }, cancel });
    await expect(readRequestJson(request(stream), signal())).rejects.toMatchObject({ status: 413 });
    expect(cancel).toHaveBeenCalled();
  });
  it("cancels a slow upload", async () => {
    const cancel = vi.fn();
    const abort = new AbortController();
    const pending = readRequestJson(request(new ReadableStream({ cancel })), abort.signal);
    abort.abort(new Error("deadline"));
    await expect(pending).rejects.toThrow("deadline");
    expect(cancel).toHaveBeenCalled();
  });
  it("handles an already-aborted read and consumes later promise rejection", async () => {
    const abort = new AbortController(); abort.abort(new Error("cancelled"));
    await expect(withAbort(Promise.reject(new Error("late failure")), abort.signal)).rejects.toThrow("cancelled");
    await expect(readRequestJson(request(new ReadableStream()), abort.signal)).rejects.toThrow("cancelled");
    await new Promise((resolve) => setImmediate(resolve));
  });
});
