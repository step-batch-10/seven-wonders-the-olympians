import { Hono } from "hono";
import { getPlayerDetails } from "../handlers/game_handler.js";
import {
  getPlayerName,
  getWonderImgName,
  updatePlayerStatus,
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
    .put("/status", updatePlayerStatus)
    .get("/info", getPlayerDetails);

  return app;
};

export { createPlayerRoute };
