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

  app.put("/status", async (ctx) => {
    const playerMap = ctx.get("playerMap");
    const player = playerMap.get(ctx.getCookie(ctx, "playerID"));

    const { status } = await ctx.req.json();
    player.udpateStatus(status);

    return ctx.json({ message: "sucessfully updated" });
  });

  app.get("/info", getPlayerDetails);

  return app;
};

export { createPlayerRoute };
