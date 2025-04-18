import { Hono } from "hono";
import { sendStatus } from "../handlers/game_handler.js";
import { logger } from "hono/logger";

const createGameRoute = () => {
  const gameApp = new Hono();

  gameApp
    .use(logger())
    .get("/status", sendStatus);

  return gameApp;
};

export { createGameRoute };
