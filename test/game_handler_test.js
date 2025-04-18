import { assertEquals } from "assert";
import { describe, it } from "test/bdd";
import { createGameRoute } from "../src/routes/game_route.js";

describe("serve static handler", () => {
  it("should return index.html content", async () => {
    const app = createGameRoute({});

    const response = await app.request("/player_wonder.html");
    const data = await response.text();
    const fileContent = await Deno.readTextFile("./public/player_wonder.html");

    assertEquals(response.status, 200);
    assertEquals(data, fileContent);
  });

  it("should return index.html content", async () => {
    const app = createGameRoute({});

    const response = await app.request("/scripts/player_wonder.js");
    const data = await response.text();
    const fileContent = await Deno.readTextFile(
      "./public/scripts/player_wonder.js",
    );

    assertEquals(response.status, 200);
    assertEquals(data, fileContent);
  });
});
