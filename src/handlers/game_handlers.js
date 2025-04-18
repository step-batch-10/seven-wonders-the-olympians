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
