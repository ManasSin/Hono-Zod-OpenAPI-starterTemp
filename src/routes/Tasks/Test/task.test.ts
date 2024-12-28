import { testClient } from "hono/testing";
import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, describe, expect, expectTypeOf, it } from "vitest";

import * as HttpStatusPhrases from "@/helpers/http-status-phrases.ts";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants.ts";
import createApp, { createTestApp } from "@/lib/create-app.ts";

import router from "../index.ts";

const client = testClient(createApp().route("/", router));

describe("task route", () => {
  beforeAll(async () => {
    execSync("pnpm drizzle-kit push");
  });

  afterAll(async () => {
    fs.rmSync("test.db", { force: true });
  });

  const id = 1;
  const name = "Learn something";

  it("response with an array or not found", async () => {
    const testRouter = createTestApp(router);
    const response = await testRouter.request("/tasks");
    const result = await response.json();

    if (result) {
      // @ts-expect-error : result is not an array
      expectTypeOf(result).toBeArray();
    }
    else {
      expect(result).toBe([]);
    }
  });

  it("response with an array again", async () => {
    const response = await client.tasks.$get();
    const json = await response.json();

    // console.log(json);

    expectTypeOf(json).toBeArray();
  });

  // it("get one task using id param", async () => {
  //   // const response = await client.tasks.$get([":id"]);
  //   const response = await client.tasks[":id"].$get({
  //     param: {
  //       id: 1,
  //     },
  //   });

  //   const expectCode = response.status === 404 ? 404 : 200;
  //   // console.log(response.status);
  //   if (expectCode === 200) {
  //     expectTypeOf(response.json()).toBeObject();
  //   }
  //   else if (expectCode === 404) {
  //     expect(response.status).toBe(expectCode);
  //   }
  //   else {
  //     expect(response.status).toBe(422);
  //   }
  // });

  it("get /tasks/{id} validates the id param", async () => {
    const response = await client.tasks[":id"].$get({
      param: {
        // @ts-expect-error : id is not a number
        id: "wat",
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("id");
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.EXPECTED_NUMBER);
    }
  });

  it("get /tasks/{id} returns 404 when task not found", async () => {
    const response = await client.tasks[":id"].$get({
      param: {
        id: 999,
      },
    });
    expect(response.status).toBe(404);
    if (response.status === 404) {
      const json = await response.json();
      expect(json.message).toBe(HttpStatusPhrases.NOT_FOUND);
    }
  });

  it("get /tasks/{id} gets a single task", async () => {
    const response = await client.tasks[":id"].$get({
      param: {
        id,
      },
    });
    expect(response.status).toBe(200);
    if (response.status === 200) {
      const json = await response.json();
      expect(json.name).toBe(name);
      expect(json.done).toBe(false);
    }
  });

  it("validate the body when creating a task", async () => {
    const response = await client.tasks.$post({
      // @ts-expect-error : name is not present
      json: {
        done: false,
      },
    });
    expect(response.status).toBe(422);
    if (response.status === 422) {
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("name");
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.REQUIRED);
    }
  });

  it("create a task", async () => {
    const response = await client.tasks.$post({
      json: {
        name,
        done: false,
      },
    });
    expect(response.status).toBe(201);
    expectTypeOf(response.json()).toBeObject();

    if (response.status === 422) {
      expect(response.status).toBe(422);
      const json = await response.json();
      expect(json.error.issues[0].path[0]).toBe("name");
      expect(json.error.issues[0].message).toBe(ZOD_ERROR_MESSAGES.REQUIRED);
    }
  });

  it("update a task", async () => {
    const response = await client.tasks[":id"].$patch({
      param: {
        id: 2,
      },
      json: {
        name: "Learn Something else",
        done: false,
      },
    });
    expect(response.status).toBe(201);
    expectTypeOf(response.json()).toBeObject();

    if (response.status === 422) {
      expect(response.status).toBe(422);
      // const json = await response.json();
      // expect(json.error.issues[0].path[0]).toBe("name");
    }
    else {
      expect(response.status).toBe(404);
    }
  });
});
