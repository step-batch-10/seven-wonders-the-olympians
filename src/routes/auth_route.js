import { Hono } from "hono";
import {
  auth,
  fetchUserName,
  playerReady,
  registerUser,
} from "../handlers/auth_handler.js";
import { getCookie, setCookie } from "hono/cookie";

const createAuthRoute = () => {
  const authApp = new Hono();
  authApp.use("*", async (ctx, nxt) => {
    ctx.getCookie = getCookie;
    ctx.setCookie = setCookie;
    ctx.users = users;
    ctx.waitQueue = waitQueue;
    ctx.user = ctx.getCookie(ctx, "name");
    await nxt();
  });

  authApp.post("/login", registerUser);
  authApp.use("/user/*", auth);
  authApp.get("/user/playerReady", playerReady);
  authApp.get("/user/name", fetchUserName);

  return authApp;
};

export { createAuthRoute };
