import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import type { Context } from "hono";
import {
  auth,
  fetchUserName,
  playerReady,
  registerUser,
} from "./routes/player_route.ts";
import { getCookie, setCookie } from "hono/cookie";
import { User } from "../main.ts";
const createApp = (
  users: { [key: string]: User },
  waitQueue: string[],
): Hono => {
  const app = new Hono();
  app.use("*", async (ctx: Context, nxt) => {
    ctx.getCookie = getCookie;
    ctx.setCookie = setCookie;
    ctx.users = users;
    ctx.waitQueue = waitQueue;
    ctx.user = ctx.getCookie(ctx, "name");
    await nxt();
  });

  app.post("/login", registerUser);
  app.use("/user/*", auth);
  app.get("/user/playerReady", playerReady);
  app.get("/user/name", fetchUserName);
  app
    .get("/", serveStatic({ path: "public/index.html" }))
    .get("/test", (ctx: Context) => {
      return ctx.text("Welcome to 7 wonders!");
    })
    .use(serveStatic({ root: "public/" }));

  return app;
};

export { createApp };
