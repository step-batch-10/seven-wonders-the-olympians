import { Hono } from "hono";
import {
  didAllPlayerSelectCard,
  disturbuteCards,
  getPlayerDetails,
  performCardActions,
  sendStatus,
} from "../handlers/game_handler.js";

const createGameRoute = () => {
  const gameApp = new Hono();

  gameApp.get("/status", sendStatus);
  gameApp.get("/info", getPlayerDetails);
  gameApp.get("/cards", disturbuteCards);
  gameApp.get("/all-players-ready", didAllPlayerSelectCard);
  gameApp.post("/action", performCardActions);

  return gameApp;
};

export { createGameRoute };
