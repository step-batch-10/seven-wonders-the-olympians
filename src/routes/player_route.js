import { Hono } from "hono";
import { getPlayerDetails } from "../handlers/game_handler.js";

const createPlayerRoute = () => {
  const app = new Hono();

  app.get("/name", (ctx) => {
    const playerMap = ctx.get("playerMap");
    const name = playerMap.get(ctx.getCookie(ctx, "playerID")).name;
    return ctx.text(name);
  });

  app.get("/wonder", (ctx) => {
    const playerMap = ctx.get("playerMap");
    const image = playerMap.get(ctx.getCookie(ctx, "playerID")).wonder.img;

    return ctx.json({ image });
  });

  app.get("/info", getPlayerDetails);

  return app;
};

export { createPlayerRoute };
