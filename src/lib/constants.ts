import { createMessageObjectSchema } from "@/helpers/openapi-helpers.ts";

import * as HttpStatusPhrases from "../helpers/http-status-phrases.ts";

export const notFoundMessage = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND);
