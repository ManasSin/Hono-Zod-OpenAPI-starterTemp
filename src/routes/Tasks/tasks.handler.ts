import type { ZodSchema } from "zod";

import { eq } from "drizzle-orm";

import type { AppRouteHandler } from "@/lib/types.ts";

import db from "@/db/index.ts";
import { tasks } from "@/db/schema.ts";

import type {
  createTaskRoute,
  getOneTaskRoute,
  ListTasksRoute,
  patchTaskRoute,
  removeTaskRoute,
} from "./tasks.routes.ts";

import * as HttpStatusCodes from "../../helpers/http-status-codes.ts";
import * as HttpStatusPhrases from "../../helpers/http-status-phrases.ts";

export const list: AppRouteHandler<ListTasksRoute> = async (c) => {
  const tasks = await db.query.tasks.findMany();
  return c.json(tasks);
};

export const create: AppRouteHandler<createTaskRoute> = async (c) => {
  const task = c.req.valid("json");
  const [insertedValue] = await db.insert(tasks).values(task).returning();
  return c.json(insertedValue, HttpStatusCodes.CREATED);
};

export const getTask: AppRouteHandler<getOneTaskRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const task = await db.query.tasks.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!task) {
    return c.json({
      message: HttpStatusPhrases.NOT_FOUND,
    }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(task, HttpStatusCodes.OK);
};

export const updateTask: AppRouteHandler<patchTaskRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const [task] = await db.update(tasks)
    .set(updates)
    .where(eq(tasks.id, id))
    .returning();

  if (!task) {
    return c.json({
      message: HttpStatusPhrases.NOT_FOUND,
    }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(task, HttpStatusCodes.OK);
};

/**
 * Handles the PATCH /tasks/{id} route.
 *
 * Given a set of updates, attempts to update the task with the given ID.
 * If the task does not exist, it will return a 404 error.
 * If the task is successfully updated, it will return the updated task.
 */
export const deleteTask: AppRouteHandler<removeTaskRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const confirmation = await db.delete(tasks)
    .where(eq(tasks.id, id));

  if (confirmation.rowsAffected === 0) {
    return c.json({
      message: HttpStatusPhrases.NOT_FOUND,
    }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json({ message: "Deleted Successful" }, HttpStatusCodes.OK);
};
