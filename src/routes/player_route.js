import { Hono } from "hono";

const createPlayerRoute = () => {
  const app = new Hono();

  app.get("/name", (ctx) => {
    const playerMap = ctx.get("playerMap");
    const name = playerMap.get(ctx.getCookie(ctx, "playerID")).name;
    console.log(name);
    return ctx.text(name);
  });

  return app;
};

export { createPlayerRoute };
