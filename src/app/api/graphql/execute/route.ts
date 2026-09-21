import { handleGraphQLRequest } from "@/lib/graphql/route-handler";

export const runtime = "nodejs";

export function POST(request: Request) {
  return handleGraphQLRequest(request, "execute");
}
