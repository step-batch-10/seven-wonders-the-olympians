import { Hono } from "hono";
import { registerUser } from "../handlers/auth_handler.js";
import { logger } from "hono/logger";

const evaluateCookie = () => {
  return async (ctx, next) => {
    const playerID = ctx.getCookie(ctx, "playerID");
    const gameID = ctx.getCookie(ctx, "gameID");
    const playerGameMap = ctx.get("playerGameMap");

    if (!playerID && !gameID) {
      return await next();
    }

    if (playerID && gameID) {
      if (gameID === playerGameMap.get(playerID)) {
        return ctx.redirect("/waiting_room.html");
      }
    }

    return ctx.text("Access Denied!", 403);
  };
};

const createAuthRoute = () => {
  const authApp = new Hono();

  authApp.use(logger()).use(evaluateCookie()).post("/login", registerUser);
  return authApp;
};

export { createAuthRoute };
