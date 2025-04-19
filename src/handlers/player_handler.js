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

const updatePlayerStatus = async (ctx) => {
  const playerMap = ctx.get("playerMap");
  const player = playerMap.get(ctx.getCookie(ctx, "playerID"));

  const { status } = await ctx.req.json();
  player.udpateStatus(status);

  return ctx.json({ message: "sucessfully updated" });
};

export { getPlayerName, getWonderImgName, updatePlayerStatus };
