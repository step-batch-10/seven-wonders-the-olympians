import { assertEquals } from "assert";
import { describe, it } from "test/bdd";
import { createApp } from "../src/app.ts";
import type { Hono } from "hono";

type User = {
  game: string | null;
};
describe("Testing the server", () => {
  it("Fetch server/test", async () => {
    const users: { [key: string]: User } = {};
    const waitQueue: string[] = [];
    const app: Hono = createApp(users, waitQueue);
    const res: Response = await app.request("/test");
    assertEquals(await res.text(), "Welcome to 7 wonders!");
  });
});
