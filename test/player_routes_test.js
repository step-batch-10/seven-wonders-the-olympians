import { assert, assertEquals, assertFalse } from "assert";
import { createApp } from "../src/app.js";
import { beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { Player } from "../src/models/player.js";
import { Game } from "../src/models/game.js";
import ageOneCards from "../data/ageOneCards.json" with { type: "json" };
import ageThreeCards from "../data/ageThreeCards.json" with { type: "json" };

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

      const aliceFormData = new FormData();
      aliceFormData.set("username", "Alice");

      const res1 = await app.request("/auth/login", {
        method: "POST",
        body: aliceFormData,
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

      const aliceFormData = new FormData();
      aliceFormData.set("username", "Alice");

      await app.request("/auth/login", {
        method: "POST",
        body: aliceFormData,
      });

      const bobFormData = new FormData();
      bobFormData.set("username", "Bob");

      const res1 = await app.request("/auth/login", {
        method: "POST",
        body: bobFormData,
      });

      const bobGameID = parseCookies(res1).gameID;
      const bobID = parseCookies(res1).playerID;

      const cookieHeader = `gameID=${bobGameID}; playerID=${bobID}`;

      const res2 = await app.request("/player/name", {
        headers: {
          Cookie: cookieHeader,
        },
      });

      assertEquals(await res2.text(), "Bob");
    });
  });

  describe("Testing get wonder", () => {
    it("Should return the wonder name", async () => {
      const app = createApp();

      const formData = new FormData();
      formData.set("username", "Alice");

      await app.request("/auth/login", {
        method: "POST",
        body: formData,
      });

      formData.set("username", "Bob");

      await app.request("/auth/login", {
        method: "POST",
        body: formData,
      });

      formData.set("username", "Adam");

      await app.request("/auth/login", {
        method: "POST",
        body: formData,
      });

      const eveFormData = new FormData();
      eveFormData.set("username", "Eve");

      const res1 = await app.request("/auth/login", {
        method: "POST",
        body: eveFormData,
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

describe("Testing set player action", () => {
  it("Should set player action", async () => {
    const app = createApp();

    const aliceFormData = new FormData();
    aliceFormData.set("username", "Alice");

    const res1 = await app.request("/auth/login", {
      method: "POST",
      body: aliceFormData,
    });

    const gameID = parseCookies(res1).gameID;
    const aliceID = parseCookies(res1).playerID;

    const cookieHeader = `gameID=${gameID}; playerID=${aliceID}`;

    const res2 = await app.request("/player/action", {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
        "content-type": "application/json",
      },
      body: JSON.stringify({ action: "build" }),
    });

    assertEquals(res2.status, 200);
    assertEquals(await res2.json(), { message: "successfully selected" });
  });
});

describe("Testing get player view status", () => {
  it("Should get player view status", async () => {
    const app = createApp();

    const aliceFormData = new FormData();
    aliceFormData.set("username", "Alice");

    const res1 = await app.request("/auth/login", {
      method: "POST",
      body: aliceFormData,
    });

    const gameID = parseCookies(res1).gameID;
    const aliceID = parseCookies(res1).playerID;

    const cookieHeader = `gameID=${gameID}; playerID=${aliceID}`;
    const res2 = await app.request("/player/view", {
      headers: {
        Cookie: cookieHeader,
      },
    });

    assertEquals(res2.status, 200);
    assertEquals(await res2.json(), { isUptoDate: true });
  });
});

describe("Testing update player view status", () => {
  it("Should update player view status", async () => {
    const app = createApp();

    const aliceFormData = new FormData();
    aliceFormData.set("username", "Alice");

    const res1 = await app.request("/auth/login", {
      method: "POST",
      body: aliceFormData,
    });

    const gameID = parseCookies(res1).gameID;
    const aliceID = parseCookies(res1).playerID;

    const cookieHeader = `gameID=${gameID}; playerID=${aliceID}`;
    const res2 = await app.request("/player/view", {
      method: "PUT",
      headers: {
        Cookie: cookieHeader,
        "content-type": "application/json",
      },
      body: JSON.stringify({ status: "updated" }),
    });

    assertEquals(res2.status, 200);
    assertEquals(await res2.json(), {
      message: "successfully updated player view status",
    });
  });
});

describe("Testing isMilitaryStrength", () => {
  let p1, p2, p3, p4, g;
  beforeEach(() => {
    p1 = new Player("Alice");
    p2 = new Player("Bob");
    p3 = new Player("Adam");
    p4 = new Player("Eve");

    g = new Game(4, p1, ([...arr]) => arr.sort(() => 0));
    g.addPlayer(p2);
    g.addPlayer(p3);
    g.addPlayer(p4);
  });

  it("isMilitaryStrength with red card should return true", () => {
    const card = ageOneCards.find((card) => card.name === "Guard Tower");
    assert(p1.wonder.isMilitaryStrength(card));
  });

  it("isMilitaryStrength with blue card should return false", () => {
    const card = ageOneCards.find((card) => card.name === "Pawn Shop");
    assertFalse(p1.wonder.isMilitaryStrength(card));
  });
});

describe("Testing addMilitaryStrength", () => {
  let p1, p2, p3, p4, g;
  beforeEach(() => {
    p1 = new Player("Alice");
    p2 = new Player("Bob");
    p3 = new Player("Adam");
    p4 = new Player("Eve");

    g = new Game(4, p1, ([...arr]) => arr.sort(() => 0));
    g.addPlayer(p2);
    g.addPlayer(p3);
    g.addPlayer(p4);
  });

  it("addMilitaryStrength should add 1 point when we won a war", () => {
    const card = ageOneCards.find((card) => card.name === "Guard Tower");
    p1.wonder.addMilitaryStrength(card);
    assertEquals(p1.wonder.militaryStrength, 1);
  });

  it("addMilitaryStrength should add 3 point when we won a war in second age", () => {
    const card = ageThreeCards.find((card) => card.name === "Arsenal");
    p1.wonder.addMilitaryStrength(card);
    assertEquals(p1.wonder.militaryStrength, 3);
  });
});

describe("Testing resetPlayerAction", () => {
  it("Should reset player action", async () => {
    const app = createApp();

    const aliceFormData = new FormData();
    aliceFormData.set("username", "Alice");

    const res1 = await app.request("/auth/login", {
      method: "POST",
      body: aliceFormData,
    });

    const gameID = parseCookies(res1).gameID;
    const aliceID = parseCookies(res1).playerID;

    const cookieHeader = `gameID=${gameID}; playerID=${aliceID}`;
    const res2 = await app.request("/player/action", {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
        "content-type": "application/json",
      },
      body: JSON.stringify({ action: "discard", card: "Lumber Yard" }),
    });

    assertEquals(res2.status, 200);
    assertEquals(await res2.json(), {
      message: "successfully selected",
    });

    const res3 = await app.request("/player/action/reset", {
      method: "PATCH",
      headers: {
        Cookie: cookieHeader,
        "content-type": "application/json",
      },
    });

    assertEquals(await res3.json(), {
      message: "now player can reselect a card",
    });
  });
});
