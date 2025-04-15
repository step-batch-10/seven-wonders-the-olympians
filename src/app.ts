import { Hono } from "hono";
import type { Context } from "hono";

const createApp = (): Hono => {
  const app = new Hono();

  app.get("/", (ctx: Context) => {
    return ctx.text("Welcome to 7 wonders!");
  });

  return app;
};

export { createApp };
