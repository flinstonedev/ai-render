import { isIP } from "node:net";
import ipaddr from "ipaddr.js";

export class GraphQLProxyError extends Error {
  constructor(message: string, public readonly status = 400) { super(message); }
}

/** Ordinary globally routable addresses only; exclude mapped/tunnel/special ranges. */
export function isPublicAddress(address: string): boolean {
  if (!isIP(address)) return false;
  const parsed = ipaddr.parse(address);
  if (parsed.range() !== "unicast") return false;
  if (parsed.kind() === "ipv6") {
    const ipv6 = parsed as ipaddr.IPv6;
    return ipv6.match(ipaddr.IPv6.parse("2000::"), 3)
      && !ipv6.match(ipaddr.IPv6.parse("2001::"), 23);
  }
  return true;
}

export function parseEndpoint(endpoint: unknown): URL {
  if (typeof endpoint !== "string" || endpoint.length > 2048) {
    throw new GraphQLProxyError("Enter an endpoint URL of at most 2,048 characters.");
  }
  let url: URL;
  try { url = new URL(endpoint); }
  catch { throw new GraphQLProxyError("Enter a valid HTTP or HTTPS endpoint URL."); }
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.hash) {
    throw new GraphQLProxyError("Use an HTTP or HTTPS URL without credentials or a fragment.");
  }
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  if (isIP(hostname)) {
    if (!isPublicAddress(hostname)) throw new GraphQLProxyError("Only public network endpoints are allowed.", 403);
  } else if (!hostname.includes(".") || /(^|\.)(localhost|local|internal|home|test|invalid)$/i.test(hostname.replace(/\.$/, ""))) {
    throw new GraphQLProxyError("Only public network endpoints are allowed.", 403);
  }
  return url;
}

export function checkEndpointAllowlist(url: URL) {
  const configured = process.env.GRAPHQL_ALLOWED_ENDPOINTS;
  if (configured === undefined || configured.trim() === "") return;
  let endpoints: string[];
  try { endpoints = configured.split(",").map((value) => parseEndpoint(value.trim()).href); }
  catch { throw new GraphQLProxyError("The server endpoint allowlist is misconfigured.", 503); }
  if (!endpoints.includes(url.href)) throw new GraphQLProxyError("This endpoint is not enabled on this server.", 403);
}
