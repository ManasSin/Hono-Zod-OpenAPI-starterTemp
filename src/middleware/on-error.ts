import type { ErrorHandler } from "hono";
import type { StatusCode } from "hono/utils/http-status";

import env from "../env.ts";
import { INTERNAL_SERVER_ERROR, OK } from "../helpers/http-status-codes.ts";
// import {
//   INTERNAL_SERVER_ERROR as INTERNAL_SERVER_ERROR_MESSAGE,
//   OK,
// } from "../helpers/http-status-phrases.ts";

export const onError: ErrorHandler = (err, c) => {
  // get the current Status of the error and then set the response status
  const currentStatus
    = "status" in err ? err.status : c.newResponse(null).status;

  // get the status code of the error
  const statusCode
    = currentStatus !== OK
      ? (currentStatus as StatusCode)
      : INTERNAL_SERVER_ERROR;

  const envIsProduction = c.env?.NODE_ENV || env?.NODE_ENV;

  return c.json(
    {
      message: err.message,
      // isDev === "production"
      //   ? INTERNAL_SERVER_ERROR_MESSAGE
      //   : `${INTERNAL_SERVER_ERROR_MESSAGE} - ${err.message}`,

      status: envIsProduction === "production" ? undefined : err.stack,
    },
    statusCode,
  );
};

// ---------------------  -----------

// import type { ErrorHandler } from "hono";
// import type { StatusCode } from "hono/utils/http-status";
//
// import { INTERNAL_SERVER_ERROR, OK } from "../helpers/http-status-codes.js";
//
// export const onError: ErrorHandler = (err, c) => {
//   const currentStatus =
//     "status" in err ? err.status : c.newResponse(null).status;
//   const statusCode =
//     currentStatus !== OK
//       ? (currentStatus as StatusCode)
//       : INTERNAL_SERVER_ERROR;
//   // eslint-disable-next-line node/prefer-global/process
//   const env = c.env?.NODE_ENV || process.env?.NODE_ENV;
//   return c.json(
//     {
//       message: err.message,
//
//       stack: env === "production" ? undefined : err.stack,
//     },
//     statusCode,
//   );
// };
//
// // export default onError;
