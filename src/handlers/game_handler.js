import { Game } from "../models/game.js";

export const getPlayerDetails = (ctx) => {
  const game = new Game();
  // const game = ctx.get("game");
  return ctx.json(game.getPlayerInfo());
};

export const disturbuteCards = (ctx) => {
  return ctx.json([
    {
      name: "Lumber Yard",
      cost: [],
    },
    {
      name: "Stone Pit",
      cost: [],
    },
  ]);
};

export const getAllPlayersStatus = (ctx) => {
  return ctx.text("Done");
};
const sendStatus = (ctx) => {
  const gameMap = ctx.get("gameMap");
  const game = gameMap.get(ctx.getCookie(ctx, "gameID"));
  return ctx.json(game.gameData());
};

export { sendStatus };
