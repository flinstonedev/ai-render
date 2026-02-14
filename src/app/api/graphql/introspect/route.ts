import { NextRequest, NextResponse } from "next/server";
import { getIntrospectionQuery } from "graphql";

export async function POST(request: NextRequest) {
  let body: { endpoint?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { errors: [{ message: "Invalid JSON body" }] },
      { status: 400 }
    );
  }

  if (!body.endpoint) {
    return NextResponse.json(
      { errors: [{ message: "Missing endpoint in request body" }] },
      { status: 400 }
    );
  }

  let url: URL;
  try {
    url = new URL(body.endpoint);
  } catch {
    return NextResponse.json(
      { errors: [{ message: "Invalid endpoint URL" }] },
      { status: 400 }
    );
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return NextResponse.json(
      { errors: [{ message: "Endpoint must use http or https protocol" }] },
      { status: 400 }
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(body.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: getIntrospectionQuery() }),
      signal: controller.signal,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return NextResponse.json(
        { errors: [{ message: "Introspection timed out after 30 seconds" }] },
        { status: 504 }
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to introspect schema";
    return NextResponse.json(
      { errors: [{ message }] },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
