const getPlayerName = (ctx) => {
  const playerMap = ctx.get("playerMap");
  const name = playerMap.get(ctx.getCookie(ctx, "playerID")).name;
  return ctx.text(name);
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

  return ctx.json({ view: player.view });
};

const updateViewStatus = async (ctx) => {
  const playerMap = ctx.get("playerMap");
  const player = playerMap.get(ctx.getCookie(ctx, "playerID"));

  const { status } = await ctx.req.json();

  player.updateViewStatus(status);

  return ctx.json({ message: "successfully updated player view status" });
};

export {
  getPlayerName,
  getPlayerViewStatus,
  getWonderImgName,
  setPlayerAction,
  updateViewStatus,
};
