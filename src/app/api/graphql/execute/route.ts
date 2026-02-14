import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const endpoint = request.headers.get("x-graphql-endpoint");

  if (!endpoint) {
    return NextResponse.json(
      { errors: [{ message: "Missing x-graphql-endpoint header" }] },
      { status: 400 }
    );
  }

  let url: URL;
  try {
    url = new URL(endpoint);
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

  let body: { query?: string; variables?: Record<string, unknown>; operationName?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { errors: [{ message: "Invalid JSON body" }] },
      { status: 400 }
    );
  }

  if (!body.query) {
    return NextResponse.json(
      { errors: [{ message: "Missing query in request body" }] },
      { status: 400 }
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: body.query,
        variables: body.variables,
        operationName: body.operationName,
      }),
      signal: controller.signal,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return NextResponse.json(
        { errors: [{ message: "Request timed out after 30 seconds" }] },
        { status: 504 }
      );
    }

    const message =
      error instanceof Error ? error.message : "Failed to execute query";
    return NextResponse.json(
      { errors: [{ message }] },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
