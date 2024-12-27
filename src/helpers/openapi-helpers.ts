import { z } from "zod";

import type { ZodSchema } from "../types/index.ts";

import oneOf from "./one-of.ts";

export function jsonContent<
  T extends ZodSchema,
>(schema: T, description: string) {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
  };
}

export function oneOfJsonContent<
  T extends | z.AnyZodObject | z.ZodArray<z.AnyZodObject>,
>(schema: T[], description: string) {
  return {
    content: {
      "application/json": {
        schema: {
          oneOf: oneOf(schema),
        },
      },
    },
    description,
  };
}

export function createMessageObjectSchema(
  exampleMessage: string = "",
) {
  return z.object({
    message: z.string(),
  }).openapi({
    example: {
      message: exampleMessage,
    },
  })
  ;
}

export function createErrorsSchema<
  T extends ZodSchema,
>(schema: T) {
  const { error } = schema.safeParse(
    schema._def.typeName === z.ZodFirstPartyTypeKind.ZodArray ? [] : {},
  );

  return z.object({
    success: z.boolean().openapi({
      example: false,
    }),
    error: z.object({
      issues: z.array(
        z.object({
          code: z.string().openapi({
            example: error?.code,
          }),
          path: z.array(
            z.union([z.string(), z.number()]),
          ),
          message: z.string().openapi({
            example: error?.message,
          }),
        }),
      ),
      name: z.string(),
    }).openapi({
      example: error,
    }),
  });
}

export const IdParamsSchema = z.object({
  id: z.coerce.number().openapi({
    param: {
      name: "id",
      in: "path",
      required: true,
    },
    required: ["id"],
    example: 23,
  }),
});

// export function createMessageObjectSchema<
//   T extends ZodSchema,
// > (exampleMessage: string = "Not Found Message") {
//   return z.object({
//     message: z.string(),
//   }).openapi({
//     example: {
//       message: exampleMessage,
//     },
//   });
// }
