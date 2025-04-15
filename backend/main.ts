import { createApp } from "./src/app.ts";
import type { Hono } from "hono";

const app: Hono = createApp();

Deno.serve(app.fetch);
