export const sendRedirect = (ctx, url) => {
  return ctx.redirect(url, 303);
};

export const auth = async (ctx, next) => {
  if (ctx.getCookie(ctx, "name") === undefined) {
    return sendRedirect(ctx, "/login.html");
  }

  return await next();
};

export const fetchUserName = (ctx) => {
  return ctx.text(ctx.getCookie(ctx, "name") || "Guest");
};

export const registerUser = async (ctx) => {
  const name = await ctx.req.json();
  ctx.setCookie(ctx, "name", name.name);
  ctx.users[name.name] = { game: null };
  ctx.waitQueue.push(name.name);

  return sendRedirect(ctx, "/user/waiting_room.html");
};
const initGame = (ctx) => {
  const player = ctx.waitQueue.pop();
  ctx.users[player].game = "hii";
};

export const playerReady = (ctx) => {
  if (ctx.users[ctx.user].game) {
    return sendRedirect(ctx, "/game/");
  }

  if (ctx.waitQueue.length === 4) {
    initGame(ctx);
    initGame(ctx);
    initGame(ctx);
    return sendRedirect(ctx, "/game/");
  }

  return ctx.text("wait");
};
