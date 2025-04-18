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
      canBuild: true,
      canStage: false,
    },
    {
      name: "Stone Pit",
      canBuild: false,
      canStage: false,
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

const discard = (card, ctx) => {
  const { gameID, playerID } = ctx.getCookie(ctx);
  const game = ctx.get("gameMap").get(gameID);
  const player = ctx.get("playerMap").get(playerID);

  game.addToDiscarded(card);
  player.updateHand(card);
  player.addCoins(3);

  return ctx.json({ message: "discarded successfully!" });
};

const performCardActions = async (ctx) => {
  const actionMap = { discard };
  const { action, card } = await ctx.req.json();

  return actionMap[action](card, ctx);
};

export { performCardActions, sendStatus };
