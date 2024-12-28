// import { onError } from "stoker/middlewares";
import { OpenAPIHono } from "@hono/zod-openapi";
// import { logger } from "hono/logger";

import {
  notFound,
  onError,
  pinoLogger,
  serveEmojiFavicon,
} from "@/middleware/index.ts";

import type { AppBindings, AppOpenAPI } from "./types.ts";

import defaultHook from "../hooks/default-hook-openapi.ts";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

export default function createApp() {
  const app = createRouter();
  app.use(serveEmojiFavicon("📂"));
  app.use(pinoLogger());

  app.notFound(notFound);
  app.onError(onError);
  return app;
}

export function createTestApp(router: AppOpenAPI) {
  const testApp = createApp();

  testApp.route("/", router);
  return testApp;
}
