const extractGameData = (ctx) => {
  const gameID = ctx.getCookie(ctx, "gameID");
  const playerID = ctx.getCookie(ctx, "playerID");
  const gameMap = ctx.get("gameMap");
  const game = gameMap.get(gameID);
  const playerMap = ctx.get("playerMap");
  const player = playerMap.get(playerID);

  return { gameID, gameMap, game, playerID, playerMap, player };
};

const getPlayerDetails = (ctx) => {
  const { playerID, game } = extractGameData(ctx);
  const info = game.getPlayerInfo(playerID);

  return ctx.json(info);
};

const getPlayerHand = (ctx) => {
  const { playerID, game } = extractGameData(ctx);
  return ctx.json(game.getPlayerHandData(playerID));
};

const didAllPlayerSelectCard = (ctx) => {
  const { game } = extractGameData(ctx);
  const status = game.didAllPlayerSelectCard();

  return ctx.json({ didAllSelectCard: status });
};

const sendStatus = (ctx) => {
  const { game } = extractGameData(ctx);
  return ctx.json({ status: game.gameStatus });
};

const getPlayersStatus = async (ctx, nxt) => {
  const { playerID, game } = extractGameData(ctx);

  const playersStatus = game.getPlayersStatus(playerID);
  if (game.didAllPlayerSelectCard()) await nxt();

  return ctx.json(playersStatus);
};

const updatePlayersStatus = (ctx) => {
  const { game } = extractGameData(ctx);
  game.updatePlayersStatus();
};

const performPlayersAction = async (ctx, nxt) => {
  const { game } = extractGameData(ctx);

  game.executeTempActs();
  game.passHands();

  await nxt();
};

const fetchAge = (ctx) => {
  const { game } = extractGameData(ctx);
  return ctx.json({ age: game.currentAge });
};

const warHandler = (ctx) => {
  const { game, player } = extractGameData(ctx);

  // if (game.doesNoOneDoneWithWar()) {
  // }

  if (game.doesEveryOneDoneWithWar()) {
    game.nextAge();
    game.initAge();
  }

  return ctx.json(player.calculateWarPoints(game.currentAge));
};

const sendGameResult = (ctx) => {
  const { game } = extractGameData(ctx);
  return ctx.json(game.calculateResult());
};

export {
  didAllPlayerSelectCard,
  fetchAge,
  getPlayerDetails,
  getPlayerHand,
  getPlayersStatus,
  performPlayersAction,
  sendGameResult,
  sendStatus,
  updatePlayersStatus,
  warHandler,
};
