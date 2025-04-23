import { Hono } from "hono";
import {
  didAllPlayerSelectCard,
  fetchAge,
  getPlayerDetails,
  getPlayerHand,
  getPlayersStatus,
  performPlayersAction,
  sendStatus,
  updatePlayersStatus,
  warHandler,
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
  gameApp.get("/age", fetchAge);
  gameApp.get("/military-conflicts", warHandler);
  return gameApp;
};

export { createGameRoute };
