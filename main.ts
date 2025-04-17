import { createApp } from "./src/app.js";
import type { Hono } from "hono";
export type User = {
  game: string | null;
};

const main = () => {
  const users: { [key: string]: User } = {};
  const waitQueue: string[] = [];
  const app: Hono = createApp(users, waitQueue);
  const port = 8000;
  Deno.serve({ port }, app.fetch);
};

main();
