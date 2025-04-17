import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import type { Context } from "hono";

const createApp = (): Hono => {
  const app = new Hono();

  app
    .get("/login", serveStatic({ path: "public/login.html" }))
    .get("/", serveStatic({ path: "public/index.html" }))
    .get("/test", (ctx: Context) => {
      return ctx.text("Welcome to 7 wonders!");
    })
    .use(serveStatic({ root: "public/" }));

  return app;
};

export { createApp };
