import { apiReference } from "@scalar/hono-api-reference";

import type { AppOpenAPI } from "./types.ts";

// @ts-expect-error : import json file without explicit declaration
import packageJSON from "../../package.json";

export default function configureOpenApi(app: AppOpenAPI) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "Hono Starter Template",
    },
  });

  app.get(
    "/reference",
    apiReference({
      theme: "mars",
      layout: "classic",
      defaultHttpClient: {
        targetKey: "javascript",
        clientKey: "fetch",
      },
      spec: {
        url: "/doc",
      },
    }),
  );
}
