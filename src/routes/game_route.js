import { Hono } from "hono";

const createGameRoute = () => {
  const gameApp = new Hono();

  return gameApp;
};

export { createGameRoute };
