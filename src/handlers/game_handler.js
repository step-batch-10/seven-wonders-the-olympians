const getPlayerDetails = (ctx) => {
  const gameID = ctx.getCookie(ctx, "gameID");
  const playerID = ctx.getCookie(ctx, "playerID");

  const gameMap = ctx.get("gameMap");
  const game = gameMap.get(gameID);

  return ctx.json(game.getPlayerInfo(playerID));
};

const disturbuteCards = (ctx) => {
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
    {
      name: "Stone Pit",
      canBuild: false,
      canStage: false,
    },
    {
      name: "Stone Pit",
      canBuild: false,
      canStage: false,
    },
    {
      name: "Stone Pit",
      canBuild: false,
      canStage: false,
    },
    {
      name: "Stone Pit",
      canBuild: false,
      canStage: false,
    },
    {
      name: "Stone Pit",
      canBuild: false,
      canStage: false,
    },
  ]);
};

const didAllPlayerSelectCard = (ctx) => {
  const gameMap = ctx.get("gameMap");
  const game = gameMap.get(ctx.getCookie(ctx, "gameID"));
  const status = game.didAllPlayerSelectCard();

  return ctx.json({ status });
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

const build = (card, ctx) => {
  const { playerID } = ctx.getCookie(ctx);
  const player = ctx.get("playerMap").get(playerID);

  player.buildCard(card.name);

  return ctx.json({ message: "builded successfully!" });
};

const performCardActions = async (ctx) => {
  const actionMap = { discard, build };
  const { action, card } = await ctx.req.json();

  return actionMap[action](card, ctx);
};

const passHands = (ctx) => {
  const gameMap = ctx.get("gameMap");
  const game = gameMap.get(ctx.getCookie(ctx, "gameID"));
  game.passHands();

  return ctx.json({ pass: `Cards passed Successfully!`});
};

export {
  didAllPlayerSelectCard,
  discard,
  disturbuteCards,
  getPlayerDetails,
  passHands,
  performCardActions,
  sendStatus,
};
