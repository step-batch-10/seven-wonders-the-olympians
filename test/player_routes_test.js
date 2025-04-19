import { assertEquals } from "assert";
import { createApp } from "../src/app.js";
import { describe, it } from "jsr:@std/testing/bdd";

function parseCookies(res) {
  const setCookieHeader = res.headers.get("set-cookie");
  const cookies = {};

  const cookieStrings = setCookieHeader.split(/,(?=\s*\w+=)/);

  for (const cookieStr of cookieStrings) {
    const parts = cookieStr.split(";");
    const [nameValue] = parts;
    const [name, value] = nameValue.split("=");
    cookies[name.trim()] = value.trim();
  }

  return cookies;
}

describe("Testing player route", () => {
  describe("Testing get player name", () => {
    it("should deny or send auth invalid", async () => {
      const app = createApp();

      const response = await app.request("/player/name");
      assertEquals(response.status, 403);
    });

    it("Should return name if cookies are valid", async () => {
      const app = createApp();

      const res1 = await app.request("/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ name: "Alice" }),
      });

      const gameID = parseCookies(res1).gameID;
      const aliceID = parseCookies(res1).playerID;

      const cookieHeader = `gameID=${gameID}; playerID=${aliceID}`;
      const res2 = await app.request("/player/name", {
        headers: {
          Cookie: cookieHeader,
        },
      });

      const name = await res2.text();

      assertEquals(name, "Alice");
    });

    it("Should return name if cookies are valid, testing with two players", async () => {
      const app = createApp();

      await app.request("/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ name: "Alice" }),
      });

      const res2 = await app.request("/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ name: "Bob" }),
      });

      const bobGameID = parseCookies(res2).gameID;
      const bobID = parseCookies(res2).playerID;

      const cookieHeader = `gameID=${bobGameID}; playerID=${bobID}`;
      const res3 = await app.request("/player/name", {
        headers: {
          Cookie: cookieHeader,
        },
      });

      assertEquals(await res3.text(), "Bob");
    });
  });

  describe("Testing get wonder", () => {
    it("Should return the wonder name", async () => {
      const app = createApp();

      await app.request("/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ name: "Alice" }),
      });

      await app.request("/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ name: "Bob" }),
      });

      await app.request("/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ name: "Adam" }),
      });

      const res1 = await app.request("/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ name: "Eve" }),
      });

      const eveGameID = parseCookies(res1).gameID;
      const eveID = parseCookies(res1).playerID;

      const cookieHeader = `gameID=${eveGameID}; playerID=${eveID}`;
      const res2 = await app.request("/player/wonder", {
        headers: {
          Cookie: cookieHeader,
        },
      });

      assertEquals(res2.status, 200);
    });
  });
});
