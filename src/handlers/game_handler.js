const getPlayerDetails = (ctx) => {
  const { gameID, playerID } = ctx.getCookie(ctx);

  const gameMap = ctx.get("gameMap");
  const game = gameMap.get(gameID);

  return ctx.json(game.getPlayerInfo(playerID));
};

const getPlayerHand = (ctx) => {
  const gameID = ctx.getCookie(ctx, "gameID");
  const playerID = ctx.getCookie(ctx, "playerID");

  const gameMap = ctx.get("gameMap");
  const game = gameMap.get(gameID);
  return ctx.json(game.getPlayerHandData(playerID));
};

const didAllPlayerSelectCard = (ctx) => {
  const gameMap = ctx.get("gameMap");
  const game = gameMap.get(ctx.getCookie(ctx, "gameID"));
  const status = game.didAllPlayerSelectCard();

  return ctx.json({ didAllSelectCard: status });
};

const sendStatus = (ctx) => {
  const gameMap = ctx.get("gameMap");
  const game = gameMap.get(ctx.getCookie(ctx, "gameID"));
  return ctx.json(game.gameData());
};

const getPlayersStatus = async (ctx, nxt) => {
  const gameMap = ctx.get("gameMap");
  const { playerID, gameID } = ctx.getCookie(ctx);

  const game = gameMap.get(gameID);
  const playersStatus = game.getPlayersStatus(playerID);

  if (game.didAllPlayerSelectCard()) await nxt();

  return ctx.json(playersStatus);
};

const updatePlayersStatus = (ctx) => {
  const gameMap = ctx.get("gameMap");
  const { gameID } = ctx.getCookie(ctx);

  const game = gameMap.get(gameID);
  game.updatePlayersStatus();
};

const performPlayersAction = async (ctx, nxt) => {
  const gameMap = ctx.get("gameMap");
  const { gameID } = ctx.getCookie(ctx);

  const game = gameMap.get(gameID);
  game.executeTempActs();
  game.passHands();

  await nxt();
};

export {
  didAllPlayerSelectCard,
  getPlayerDetails,
  getPlayerHand,
  getPlayersStatus,
  performPlayersAction,
  sendStatus,
  updatePlayersStatus,
};
