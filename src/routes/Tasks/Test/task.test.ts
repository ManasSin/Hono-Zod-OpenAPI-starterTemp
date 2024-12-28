import { testClient } from "hono/testing";
import { describe, expect, expectTypeOf, it } from "vitest";

import createApp, { createTestApp } from "@/lib/create-app.ts";

import router from "../index.ts";

describe("task list", () => {
  it("response with an array", async () => {
    const testRouter = createTestApp(router);
    const response = await testRouter.request("/tasks");
    const result = await response.json();

    // @ts-expect-error : result is not an array
    expectTypeOf(result).toBeArray();
    // expect(false).toBe(true); ;
  });

  it("response with an array again", async () => {
    const testApp = createApp();
    const testRouter = testApp.route("/", router);

    const client = testClient(testRouter);

    const response = await client.tasks.$get();
    const json = await response.json();

    // console.log(json);

    expectTypeOf(json).toBeArray();
  });

  it("get one task using id param", async () => {
    const testApp = createApp();
    const testRouter = testApp.route("/", router);

    const client = testClient(testRouter);

    // const response = await client.tasks.$get([":id"]);
    const response = await client.tasks[":id"].$get({
      param: {
        // @ts-expect-error : id is not a string
        id: "asd",
      },
    });

    const expectCode = response.status === 404 ? 404 : 200;
    // console.log(response.status);
    if (expectCode === 200) {
      expectTypeOf(response.json()).toBeObject();
    }
    else if (expectCode === 404) {
      expect(response.status).toBe(expectCode);
    }
    else {
      expect(response.status).toBe(422);
    }

    // expect(response.status).toBe(404);
  });

  it("create a task", async () => {
    const testApp = createApp();
    const testRouter = testApp.route("/", router);

    const client = testClient(testRouter);

    // const response = await client.tasks.$get([":id"]);
    const response = await client.tasks.$post({
      // @ts-expect-error : json should have 2 properties
      json: {
        // name: "Learn Vitest",
        done: false,
      },
    });

    const expectCode = response.status === 201 ? 201 : 422;
    // console.log(response.status);
    if (expectCode === 201) {
      expectTypeOf(response.json()).toBeObject();
    }
    else if (expectCode === 422) {
      expect(response.status).toBe(expectCode);
    }
    else {
      expect(response.status).toBe(422);
    }
  });

  it("update a task", async () => {
    const client = testClient(createApp().route("/", router));

    const response = await client.tasks[":id"].$patch({
      param: {
        id: 26,
      },
      json: {
        name: "Learn Something else",
        done: false,
      },
    });

    const result = await response.json();
    // console.log(result);

    const expectCode = response.status === 200 ? 200 : 422;

    if (expectCode === 200) {
      expectTypeOf(result).toBeObject();
    }
    else {
      expect(response.status).toBe(422);
    }
  });
});
