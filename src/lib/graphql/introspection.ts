import {
  getIntrospectionQuery,
  buildClientSchema,
  type IntrospectionQuery,
} from "graphql";

export { getIntrospectionQuery };

export function buildSchemaFromIntrospection(result: {
  data?: IntrospectionQuery;
}) {
  if (!result.data) {
    throw new Error("Introspection result is missing data");
  }

  return buildClientSchema(result.data);
}
