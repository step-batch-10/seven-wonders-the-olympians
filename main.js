import { createApp } from "./src/app.js";

const main = () => {
  const app = createApp();
  Deno.serve(app.fetch);
};

main();
