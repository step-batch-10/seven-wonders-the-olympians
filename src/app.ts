import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import type { Context } from "hono";

const createApp = (): Hono => {
  const app = new Hono();

  app
    .get("/", serveStatic({ path: "public/index.html" }))
    .get("/test", (ctx: Context) => {
      return ctx.text("Welcome to 7 wonders!");
    });

  return app;
};

export { createApp };
