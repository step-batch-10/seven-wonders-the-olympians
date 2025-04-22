import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { logger } from "hono/logger";
import { createAuthRoute } from "./routes/auth_route.js";
import { createGameRoute } from "./routes/game_route.js";
import { createPlayerRoute } from "./routes/player_route.js";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

const injectContext = (gameMap, playerMap, playerGameMap, waitingGames) => {
  return async (ctx, next) => {
    ctx.set("gameMap", gameMap);
    ctx.set("playerMap", playerMap);
    ctx.set("playerGameMap", playerGameMap);
    ctx.set("waitingGames", waitingGames);
    ctx.getCookie = getCookie;
    ctx.setCookie = setCookie;
    await next();
  };
};

export const resetCookie = () => {
  return (ctx) => {
    if (ctx.getCookie(ctx, "playerID")) {
      deleteCookie(ctx, "playerID");
    }
    if (ctx.getCookie(ctx, "gameID")) {
      deleteCookie(ctx, "gameID");
    }
    return ctx.text("Logged out. Cleared cookies");
  };
};

const createApp = () => {
  const app = new Hono();

  const gameMap = new Map();
  const playerMap = new Map();
  const playerGameMap = new Map();
  const waitingGames = new Set();

  app
    .use(logger())
    .use(injectContext(gameMap, playerMap, playerGameMap, waitingGames))
    .get("/logout", resetCookie())
    .get("/", serveStatic({ path: "public/index.html" }))
    .route("/auth", createAuthRoute())
    .route("/game", createGameRoute())
    .route("/player", createPlayerRoute())
    .use(serveStatic({ root: "public/" }));

  return app;
};

export { createApp };
