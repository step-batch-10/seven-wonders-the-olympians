import { Hono } from "hono";
import {
  didAllPlayerSelectCard,
  disturbuteCards,
  getPlayerDetails,
  performCardActions,
  sendStatus,
  passHands,
} from "../handlers/game_handler.js";

const createGameRoute = () => {
  const gameApp = new Hono();

  gameApp.get("/status", sendStatus);
  gameApp.get("/info", getPlayerDetails);
  gameApp.get("/cards", disturbuteCards);
  gameApp.get("/all-players-ready", didAllPlayerSelectCard);
  gameApp.post("/action", performCardActions);
  gameApp.post("/pass-hand", passHands);

  return gameApp;
};

export { createGameRoute };
