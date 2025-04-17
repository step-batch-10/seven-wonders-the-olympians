import { assertEquals, assertNotEquals } from "assert";
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

describe("Testing auth route", () => {
  it("Should add first two players in the same game", async () => {
    const app = createApp();

    const res1 = await app.request("/auth/login", {
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

    assertEquals(parseCookies(res1).gameID, parseCookies(res2).gameID);
  });

  it("Should add first four players in the same game", async () => {
    const app = createApp();

    const res1 = await app.request("/auth/login", {
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
    const res3 = await app.request("/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ name: "Adam" }),
    });

    assertEquals(parseCookies(res1).gameID, parseCookies(res2).gameID);
    assertEquals(parseCookies(res2).gameID, parseCookies(res3).gameID);
  });

  it("Should add first four players in the same game", async () => {
    const app = createApp();

    const res1 = await app.request("/auth/login", {
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
    const res3 = await app.request("/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ name: "Adam" }),
    });
    const res4 = await app.request("/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ name: "Eve" }),
    });

    assertEquals(parseCookies(res1).gameID, parseCookies(res2).gameID);
    assertEquals(parseCookies(res2).gameID, parseCookies(res3).gameID);
    assertEquals(parseCookies(res3).gameID, parseCookies(res4).gameID);
  });

  it("Should add fifth player to a different game rather than the first four player", async () => {
    const app = createApp();

    const res1 = await app.request("/auth/login", {
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
    const res3 = await app.request("/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ name: "Adam" }),
    });
    const res4 = await app.request("/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ name: "Eve" }),
    });
    const res5 = await app.request("/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ name: "Tom" }),
    });

    assertEquals(parseCookies(res1).gameID, parseCookies(res2).gameID);
    assertEquals(parseCookies(res2).gameID, parseCookies(res3).gameID);
    assertEquals(parseCookies(res3).gameID, parseCookies(res4).gameID);
    assertNotEquals(parseCookies(res4).gameID, parseCookies(res5).gameID);
  });
});
