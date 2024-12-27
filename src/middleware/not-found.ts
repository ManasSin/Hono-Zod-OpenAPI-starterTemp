import type { NotFoundHandler } from "hono";

import { NOT_FOUND } from "../helpers/http-status-codes.ts";
import { NOT_FOUND as NOT_FOUND_MESSAGE } from "../helpers/http-status-phrases.ts";

export const notFound: NotFoundHandler = (c) => {
  return c.json({ message: `${NOT_FOUND_MESSAGE} - ${c.req.path}` }, NOT_FOUND);
};
