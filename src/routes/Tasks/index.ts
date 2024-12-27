import { createRouter } from "@/lib/create-app.ts";

import * as handlers from "./tasks.handler.ts";
import * as routes from "./tasks.routes.ts";

const router = createRouter()
  .openapi(routes.list, handlers.list);

export default router;
