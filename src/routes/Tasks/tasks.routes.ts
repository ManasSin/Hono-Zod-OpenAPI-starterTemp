import { notFoundMessage } from "@/lib/constants.ts";
import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";

import type defaultHook from "@/hooks/default-hook-openapi.ts";

import { insertTaskSchema, selectTaskSchema } from "@/db/schema.ts";
import { createErrorsSchema, IdParamsSchema, jsonContent, oneOfJsonContent } from "@/helpers/openapi-helpers.ts";

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
      z.array(selectTaskSchema),
      "List of tasks",
    ),
  },
});

export const create = createRoute({
  tags,
  method: "post",
  path: "/tasks",
  request: {
    body: {
      content: {
        "application/json": {
          schema: insertTaskSchema,
        },
      },
      description: "Task to create",
    },
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectTaskSchema,
      "the created tasks",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorsSchema(insertTaskSchema),
      "validation error",
    ),
  },
});

export const getOne = createRoute({
  tags,
  method: "get",
  path: "/tasks/{id}",
  request: {
    params: IdParamsSchema,
    description: "Task to get",
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTaskSchema,
      "the asked tasks",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundMessage,
      "Task not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorsSchema(selectTaskSchema.pick({ id: true })),
      "Invalid id",
    ),
  },
});

export const patch = createRoute({
  tags,
  method: "patch",
  path: "/tasks/{id}",
  request: {
    params: IdParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: insertTaskSchema.partial(),
        },
      },
      description: "Task to create",
    },
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectTaskSchema,
      "Task updated Successfully",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundMessage,
      "Task that you want to update, could not be found.",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: oneOfJsonContent(
      [createErrorsSchema(insertTaskSchema.partial()), createErrorsSchema(IdParamsSchema)],
      "Validation error(s)",
    ),
  },
});

export const remove = createRoute({
  tags,
  method: "delete",
  path: "/tasks/{id}",
  request: {
    params: IdParamsSchema,
    description: "Task to get",
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Task deleted",
    ),
    // {
    //   content: {
    //     "application/json": {
    //       schema: z.object({
    //         message: z.string(),
    //       }),
    //     },
    //   },
    //   description: "Task Deleted",
    // },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundMessage,
      "Task not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: oneOfJsonContent(
      [createErrorsSchema(selectTaskSchema.partial()), createErrorsSchema(IdParamsSchema)],
      "Validation error(s)",
    ),
  },
});

export type ListTasksRoute = typeof list;
export type createTaskRoute = typeof create;
export type getOneTaskRoute = typeof getOne;
export type patchTaskRoute = typeof patch;
export type removeTaskRoute = typeof remove;
