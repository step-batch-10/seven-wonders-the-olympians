import { Game } from "../models/game.js";
import { Player } from "../models/player.js";

export const sendRedirect = (ctx, url) => {
  return ctx.redirect(url, 303);
};

export const registerUser = async (ctx) => {
  const waitingGames = ctx.get("waitingGames");
  const playerGameMap = ctx.get("playerGameMap");
  const gameMap = ctx.get("gameMap");
  const playerMap = ctx.get("playerMap");

  const name = await ctx.req.json();
  const player = new Player(name.name);
  let game;
  playerMap.set(player.playerID, player);

  if (waitingGames.size === 0) {
    game = new Game(4, player);
    waitingGames.add(game.gameID);
    gameMap.set(game.gameID, game);
  } else {
    game = gameMap.get(Array.from(waitingGames)[0]);
    game.addPlayer(player);
    game.isGameFull && waitingGames.clear();
  }
  playerGameMap.set(player.playerID, game.gameID);

  ctx.setCookie(ctx, "playerID", player.playerID);
  ctx.setCookie(ctx, "gameID", game.gameID);

  return sendRedirect(ctx, "/waiting_room.html");
};
