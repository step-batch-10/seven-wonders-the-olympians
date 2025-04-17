import { Hono } from "hono";
import { registerUser } from "../handlers/auth_handler.js";

const createAuthRoute = () => {
  const authApp = new Hono();

  authApp.post("/login", registerUser);

  return authApp;
};

export { createAuthRoute };
