import { Hono } from "hono";
import {
  getPlayerName,
  getPlayerViewStatus,
  getWonderImgName,
  setPlayerAction,
  updateViewStatus,
} from "../handlers/player_handler.js";

const evaluateCookie = () => {
  return async (ctx, next) => {
    const playerID = ctx.getCookie(ctx, "playerID");
    const gameID = ctx.getCookie(ctx, "gameID");
    const playerGameMap = ctx.get("playerGameMap");

    if (!playerID && !gameID) {
      return ctx.text("Access Denied!", 403);
    }

    if (playerID && gameID) {
      if (gameID === playerGameMap.get(playerID)) {
        await next();
      }
    }
    return ctx.text("Access Denied!", 403);
  };
};

const createPlayerRoute = () => {
  const app = new Hono();

  app
    .use(evaluateCookie())
    .get("/name", getPlayerName)
    .get("/wonder", getWonderImgName)
    .post("/action", setPlayerAction)
    .get("/view", getPlayerViewStatus)
    .put("/view", updateViewStatus);

  return app;
};

export { createPlayerRoute };
