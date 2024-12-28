import { createMessageObjectSchema } from "@/helpers/openapi-helpers.ts";

import * as HttpStatusPhrases from "../helpers/http-status-phrases.ts";

export const ZOD_ERROR_MESSAGES = {
  REQUIRED: "Required",
  EXPECTED_NUMBER: "Expected number, received nan",
  NO_UPDATES: "No updates provided",
};

export const ZOD_ERROR_CODES = {
  INVALID_UPDATES: "invalid_updates",
};

export const notFoundMessage = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND);
