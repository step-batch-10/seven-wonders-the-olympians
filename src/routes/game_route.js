import { Hono } from "hono";
import {
  didAllPlayerSelectCard,
  getPlayerDetails,
  getPlayerHand,
  getPlayersStatus,
  performPlayersAction,
  sendStatus,
  updatePlayersStatus,
} from "../handlers/game_handler.js";

const createGameRoute = () => {
  const gameApp = new Hono();

  gameApp.get("/status", sendStatus);
  gameApp.get("/info", getPlayerDetails);
  gameApp.get("/cards", getPlayerHand);
  gameApp.get(
    "/players-status",
    getPlayersStatus,
    performPlayersAction,
    updatePlayersStatus,
  );
  gameApp.get("/check-all-selected", didAllPlayerSelectCard);

  return gameApp;
};

export { createGameRoute };
