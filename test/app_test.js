import { assertEquals } from "assert";
import { describe, it } from "test/bdd";
import { createApp } from "../src/app.js";

describe("serve static handler", () => {
  it("should return index.html content", async () => {
    const app = createApp();

    const response = await app.request("/");
    const data = await response.text();
    const fileContent = await Deno.readTextFile("./public/index.html");

    assertEquals(response.status, 200);
    assertEquals(data, fileContent);
  });
});
