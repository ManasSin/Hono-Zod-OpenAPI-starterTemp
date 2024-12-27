import { createRoute, z } from "@hono/zod-openapi";

import { createMessageObjectSchema, jsonContent } from "@/helpers/openapi-helpers.ts";
import { createRouter } from "@/lib/create-app.ts";

import * as HttpStatusCodes from "../helpers/http-status-codes.ts";

const router = createRouter().openapi(
  createRoute({
    tags: ["Index"],
    method: "get",
    path: "/",
    responses: {
      // 200: {
      //   content: {
      //     "application/json": {
      //       schema: z.object({
      //         message: z.string(),
      //       }),
      //     },
      //   },
      //   description: "Tasks api Index",
      // },
      [HttpStatusCodes.OK]: jsonContent(
        createMessageObjectSchema("greetings from tasks api"),
        "Tasks api Index",
      ),
    },
  }),
  (c) => {
    return c.json({
      message: "greetings from tasks api",
    }, HttpStatusCodes.OK);
  },
);

export default router;
