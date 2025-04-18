import { Hono } from "hono";
import { sendStatus } from "../handlers/game_handler.js";
import {
  disturbuteCards,
  getPlayerDetails,
  getAllPlayersStatus
} from "../handlers/game_handlers.js";
const createGameRoute = () => {
  const gameApp = new Hono();

  gameApp.get("/status", sendStatus);
  gameApp.get("/info", getPlayerDetails);
  gameApp.get("/cards", disturbuteCards);
  gameApp.get("/all-players-ready", getAllPlayersStatus);
  return gameApp;
};

export { createGameRoute };
