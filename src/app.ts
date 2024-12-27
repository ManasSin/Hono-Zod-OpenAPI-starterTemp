import configureOpenApi from "@/lib/configure-open-api.js";
import createApp from "@/lib/create-app.ts";
import index from "@/routes/index.route.ts";
import tasks from "@/routes/Tasks/index.ts";

const app = createApp();

const routes = [index, tasks];

configureOpenApi(app);

routes.forEach((route) => {
  app.route("/", route);
});

export default app;
