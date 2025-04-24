import { assertEquals, assertNotEquals } from "assert";
import { createApp } from "../src/app.js";
import { beforeEach, describe, it } from "jsr:@std/testing/bdd";

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
  let app, aliceFormData, bobFormData, adamFormData, eveFormData, tomFormData;

  beforeEach(() => {
    app = createApp();

    aliceFormData = new FormData();
    aliceFormData.set("name", "Alice");

    bobFormData = new FormData();
    bobFormData.set("name", "Bob");

    adamFormData = new FormData();
    adamFormData.set("name", "Adam");

    eveFormData = new FormData();
    eveFormData.set("name", "Eve");

    tomFormData = new FormData();
    tomFormData.set("name", "Tom");
  });

  it("Should add first two players in the same game", async () => {
    const res1 = await app.request("/auth/login", {
      method: "POST",
      body: aliceFormData,
    });

    const res2 = await app.request("/auth/login", {
      method: "POST",
      body: bobFormData,
    });

    assertEquals(parseCookies(res1).gameID, parseCookies(res2).gameID);
  });

  it("Should add first three players in the same game", async () => {
    const res1 = await app.request("/auth/login", {
      method: "POST",
      body: aliceFormData,
    });
    const res2 = await app.request("/auth/login", {
      method: "POST",
      body: bobFormData,
    });
    const res3 = await app.request("/auth/login", {
      method: "POST",
      body: adamFormData,
    });

    assertEquals(parseCookies(res1).gameID, parseCookies(res2).gameID);
    assertEquals(parseCookies(res2).gameID, parseCookies(res3).gameID);
  });

  it("Should add first four players in the same game", async () => {
    const res1 = await app.request("/auth/login", {
      method: "POST",
      body: aliceFormData,
    });

    const res2 = await app.request("/auth/login", {
      method: "POST",
      body: bobFormData,
    });

    const res3 = await app.request("/auth/login", {
      method: "POST",
      body: adamFormData,
    });

    const res4 = await app.request("/auth/login", {
      method: "POST",
      body: eveFormData,
    });

    assertEquals(parseCookies(res1).gameID, parseCookies(res2).gameID);
    assertEquals(parseCookies(res2).gameID, parseCookies(res3).gameID);
    assertEquals(parseCookies(res3).gameID, parseCookies(res4).gameID);
  });

  it("Should add fifth player to a different game rather than the first four player", async () => {
    const res1 = await app.request("/auth/login", {
      method: "POST",
      body: aliceFormData,
    });

    const res2 = await app.request("/auth/login", {
      method: "POST",
      body: bobFormData,
    });

    const res3 = await app.request("/auth/login", {
      method: "POST",
      body: adamFormData,
    });

    const res4 = await app.request("/auth/login", {
      method: "POST",
      body: eveFormData,
    });

    const res5 = await app.request("/auth/login", {
      method: "POST",
      body: tomFormData,
    });

    assertEquals(parseCookies(res1).gameID, parseCookies(res2).gameID);
    assertEquals(parseCookies(res2).gameID, parseCookies(res3).gameID);
    assertEquals(parseCookies(res3).gameID, parseCookies(res4).gameID);
    assertNotEquals(parseCookies(res4).gameID, parseCookies(res5).gameID);
  });

  it("Should redirect to waiting.html if having valid game id and player id and try to access auth route", async () => {
    const app = createApp();

    const res1 = await app.request("/auth/login", {
      method: "POST",
      body: aliceFormData,
    });

    const { gameID, playerID } = parseCookies(res1);

    const cookieHeader = `gameID=${gameID}; playerID=${playerID}`;

    const res2 = await app.request("/auth/login", {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
      },
      body: bobFormData,
    });

    assertEquals(res2.status, 302);
    assertEquals(res2.headers.get("location"), "/waiting_room.html");
  });

  it("Should access denied if having invalid game id and try to access auth route", async () => {
    const app = createApp();

    const res1 = await app.request("/auth/login", {
      method: "POST",
      body: aliceFormData,
    });
    const { playerID } = parseCookies(res1);

    const cookieHeader = `gameID=fakeGameId; playerID=${playerID}`;

    const res2 = await app.request("/auth/login", {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
      },
      body: bobFormData,
    });

    assertEquals(res2.status, 403);

    assertEquals(await res2.text(), "Access Denied!");
  });

  it("Should access denied if having invalid player id and try to access auth route", async () => {
    const app = createApp();

    const res1 = await app.request("/auth/login", {
      method: "POST",
      body: aliceFormData,
    });

    const { gameID } = parseCookies(res1);

    const cookieHeader = `gameID=${gameID}; playerID=fakePlayerID`;

    const res2 = await app.request("/auth/login", {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
      },
      body: bobFormData,
    });

    assertEquals(res2.status, 403);

    assertEquals(await res2.text(), "Access Denied!");
  });
});
