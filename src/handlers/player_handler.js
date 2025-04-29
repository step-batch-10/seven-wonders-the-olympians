const getPlayerName = (ctx) => {
  const playerMap = ctx.get("playerMap");
  const name = playerMap.get(ctx.getCookie(ctx, "playerID")).name;

  return ctx.json({ name });
};

const getWonderImgName = (ctx) => {
  const playerMap = ctx.get("playerMap");
  const image = playerMap.get(ctx.getCookie(ctx, "playerID")).wonder.img;

  return ctx.json({ image });
};

const setPlayerAction = async (ctx) => {
  const playerMap = ctx.get("playerMap");
  const player = playerMap.get(ctx.getCookie(ctx, "playerID"));

  const playerAction = await ctx.req.json();
  player.tempAct = playerAction;
  player.updateStatus("selected");

  return ctx.json({ message: "successfully selected" });
};

const getPlayerViewStatus = (ctx) => {
  const playerMap = ctx.get("playerMap");
  const player = playerMap.get(ctx.getCookie(ctx, "playerID"));
  return ctx.json({ isUptoDate: player.isUptoDate });
};

const updateViewStatus = async (ctx) => {
  const playerMap = ctx.get("playerMap");
  const player = playerMap.get(ctx.getCookie(ctx, "playerID"));

  const { isUptoDate } = await ctx.req.json();

  player.updateViewStatus(isUptoDate);

  return ctx.json({ message: "successfully updated player view status" });
};

const resetPlayerAction = (ctx) => {
  const playerMap = ctx.get("playerMap");
  const player = playerMap.get(ctx.getCookie(ctx, "playerID"));

  player.resetTempAct();
  player.updateStatus("waiting");

  return ctx.json({ message: "now player can reselect a card" });
};

export {
  getPlayerName,
  getPlayerViewStatus,
  getWonderImgName,
  resetPlayerAction,
  setPlayerAction,
  updateViewStatus,
};
