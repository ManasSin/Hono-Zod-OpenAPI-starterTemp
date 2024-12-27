import type { AppRouteHandler } from "@/lib/types.ts";

import type { ListTasksRoute } from "./tasks.routes.ts";

const list: AppRouteHandler<ListTasksRoute> = (c) => {
  c.var.logger.info("List of tasks");
  return c.json([
    { id: "1", name: "Learn Hono", done: false },
    // { id: "2", name: "Task 2", done: false },
    // { id: "3", name: "Task 3", done: false },
  ]);
};

export { list };
