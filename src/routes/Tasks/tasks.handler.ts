import type { AppRouteHandler } from "@/lib/types.ts";

import db from "@/db/index.ts";
import { tasks } from "@/db/schema.ts";

import type { ListTasksRoute } from "./tasks.routes.ts";

export const list: AppRouteHandler<ListTasksRoute> = async (c) => {
  const tasks = await db.query.tasks.findMany();
  return c.json(tasks);
};
