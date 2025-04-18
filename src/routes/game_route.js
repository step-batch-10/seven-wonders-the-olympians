import { Hono } from "hono";
import {
  disturbuteCards,
  getAllPlayersStatus,
  getPlayerDetails,
  performCardActions,
  sendStatus,
} from "../handlers/game_handler.js";

const createGameRoute = () => {
  const gameApp = new Hono();

  gameApp.get("/status", sendStatus);
  gameApp.get("/info", getPlayerDetails);
  gameApp.get("/cards", disturbuteCards);
  gameApp.get("/all-players-ready", getAllPlayersStatus);
  gameApp.post("/action", performCardActions);

  return gameApp;
};

export { createGameRoute };
