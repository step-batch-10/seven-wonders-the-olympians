import { Hono } from "hono";
import { sendStatus } from "../handlers/game_handler.js";
import { getPlayerDetails, disturbuteCards } from "../handlers/game_handlers.js";
const createGameRoute = () => {
  const gameApp = new Hono();

  gameApp.get("/status", sendStatus);
  gameApp.get("/info", getPlayerDetails);
  gameApp.get("/cards", disturbuteCards);
  return gameApp;
};

export { createGameRoute };
