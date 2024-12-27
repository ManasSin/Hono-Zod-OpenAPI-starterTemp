import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";

import { jsonContent } from "@/helpers/openapi-helpers.ts";

import * as HttpStatusCodes from "../../helpers/http-status-codes.ts";

// define the tags group here
const tags = ["Tasks"];

// making a route definition that defines that this route will send a list of tasks
export const list = createRoute({
  tags,
  method: "get",
  path: "/tasks",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(z.object({ id: z.string(), name: z.string(), done: z.boolean() })),
      "List of tasks",
    ),
  },
});

export type ListTasksRoute = typeof list;