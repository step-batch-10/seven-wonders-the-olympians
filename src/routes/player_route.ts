import type { Context } from "hono";

export const sendRedirect = (ctx: Context, url: string) => {
  return ctx.redirect(url, 303);
};

export const auth = async (ctx: Context, next: () => Promise<void>) => {
  if (ctx.getCookie(ctx, "name") === undefined) {
    return sendRedirect(ctx, "/login.html");
  }

  return await next();
};

export const fetchUserName = (ctx: Context) => {
  return ctx.text(ctx.getCookie(ctx, "name") || "Guest");
};

export const registerUser = async (ctx: Context) => {
  const name = await ctx.req.json();
  ctx.setCookie(ctx, "name", name.name);
  ctx.users[name.name] = { game: null };
  ctx.waitQueue.push(name.name);

  return sendRedirect(ctx, "/user/waiting_room.html");
};
const initGame = (ctx: Context) => {
  const player = ctx.waitQueue.pop();
  ctx.users[player].game = "hii";
};

export const playerReady = (ctx: Context) => {
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
