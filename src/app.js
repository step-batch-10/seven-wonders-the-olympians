import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { logger } from "hono/logger";
import { createAuthRoute } from "./routes/auth_route.js";
import { createGameRoute } from "./routes/game_route.js";
import { getPlayerDetails } from "./handlers/game_handlers.js";

const injectContext = (gameMap, playerMap, playerGameMap, waitingGames) => {
  return async (ctx, next) => {
    ctx.set("gameMap", gameMap);
    ctx.set("playerMap", playerMap);
    ctx.set("playerGameMap", playerGameMap);
    ctx.set("waitingGames", waitingGames);

    await next();
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
    .get("/", serveStatic({ path: "public/index.html" }))
    .route("/auth", createAuthRoute())
    .route("/game", createGameRoute())
    .get("/playerInfo", getPlayerDetails)
    .use(serveStatic({ root: "public/" }));

  return app;
};

export { createApp };
