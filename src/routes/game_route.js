import { Hono } from "hono";
import { sendStatus } from "../handlers/game_handler.js";
const createGameRoute = () => {
  const gameApp = new Hono();

  gameApp.get("/status", sendStatus);

  return gameApp;
};

export { createGameRoute };
