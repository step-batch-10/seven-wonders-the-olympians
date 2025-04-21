import {
  didAllPlayerSelectCard,
  getPlayerDetails,
  sendStatus,
} from "../src/handlers/game_handler.js";
import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals } from "jsr:@std/assert/equals";

describe("getPlayerDetails", () => {
  it("should return player details", () => {
    const ctx = {
      json: (data) => data,
      getCookie: (_, name) => {
        if (name === "gameID") return "game123";
        if (name === "playerID") return "player456";
        return { gameID: "game123", playerID: "player456" };
      },
    };
    const gameMap = new Map();
    const game = {
      getPlayerInfo: (playerID) => {
        if (playerID === "player456") {
          return { name: "John Doe", score: 100 };
        }
        return null;
      },
    };
    gameMap.set("game123", game);
    ctx.get = (key) => {
      if (key === "gameMap") return gameMap;
      return null;
    };
    const result = getPlayerDetails(ctx);
    assertEquals(result, { name: "John Doe", score: 100 });
  });
});

describe("didAllPlayerSelectCard", () => {
  it("should return status of all players selecting card", () => {
    const ctx = {
      json: (data) => data,
      getCookie: (_, name) => {
        if (name === "gameID") return "game123";
        return null;
      },
    };
    const gameMap = new Map();
    const game = {
      didAllPlayerSelectCard: () => true,
    };
    gameMap.set("game123", game);
    ctx.get = (key) => {
      if (key === "gameMap") return gameMap;
      return null;
    };
    const result = didAllPlayerSelectCard(ctx);
    assertEquals(result, { didAllSelectCard: true });
  });
});

describe("sendStatus", () => {
  it("should return game status", () => {
    const ctx = {
      json: (data) => data,
      getCookie: (_, name) => {
        if (name === "gameID") return "game123";
        return null;
      },
    };
    const gameMap = new Map();
    const game = {
      gameData: () => ({ status: "in progress" }),
    };
    gameMap.set("game123", game);
    ctx.get = (key) => {
      if (key === "gameMap") return gameMap;
      return null;
    };
    const result = sendStatus(ctx);
    assertEquals(result, { status: "in progress" });
  });
});
