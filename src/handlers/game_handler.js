const sendStatus = (ctx) => {
  const gameMap = ctx.get("gameMap");
  const game = gameMap.get(ctx.getCookie(ctx, "gameID"));
  return ctx.json(game.gameData());
};

const serverWonderDetails = (ctx) => {
  const { name } = getCookie(ctx);
  return ctx.text("Loaded something", name);
};

export { serverWonderDetails, sendStatus };
