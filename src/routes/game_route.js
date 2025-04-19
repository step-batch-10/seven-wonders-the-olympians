import { Hono } from "hono";
import {
  didAllPlayerSelectCard,
  getPlayerDetails,
  getPlayerHand,
  passHands,
  performCardActions,
  sendStatus,
} from "../handlers/game_handler.js";

const createGameRoute = () => {
  const gameApp = new Hono();

  gameApp.get("/status", sendStatus);
  gameApp.get("/info", getPlayerDetails);
  gameApp.get("/cards", getPlayerHand);
  gameApp.get("/all-players-ready", didAllPlayerSelectCard);
  gameApp.post("/action", performCardActions);
  gameApp.post("/pass-hand", passHands);

  return gameApp;
};

export { createGameRoute };
