import { assertEquals } from "assert";
import { describe, it } from "test/bdd";
import { createApp } from "../src/app.ts";
import type { Hono } from "hono";

describe("Testing the server", () => {
  it("Fetch server/test", async () => {
    const app: Hono = createApp();
    const res: Response = await app.request("/test");
    assertEquals(await res.text(), "Welcome to 7 wonders!");
  });
});
