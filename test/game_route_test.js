import {
  didAllPlayerSelectCard,
  discard,
  disturbuteCards,
  getPlayerDetails,
  sendStatus,
} from "../src/handlers/game_handler.js";
import { Game } from "../src/models/game.js";
import { Player } from "../src/models/player.js";
import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals } from "jsr:@std/assert/equals";
describe("getPlayerDetails", () => {
  it("should return player details", () => {
    const ctx = {
      json: (data) => data,
      getCookie: (_, name) => {
        if (name === "gameID") return "game123";
        if (name === "playerID") return "player456";
        return null;
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

describe("disturbuteCards", () => {
  it("should return distributed cards", () => {
    const ctx = {
      json: (data) => data,
    };
    const result = disturbuteCards(ctx);
    assertEquals(result, [
      {
        name: "Lumber Yard",
        canBuild: true,
        canStage: false,
      },
      {
        name: "Stone Pit",
        canBuild: false,
        canStage: false,
      },
    ]);
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
    assertEquals(result, { status: true });
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

describe("discard", () => {
  it("should discard a card and return success message", () => {
    const ctx = {
      json: (data) => data,
      getCookie: (_, name) => {
        return { name, gameID: "game123", playerID: "player456" };
      },
      get: (key) => {
        if (key === "gameMap") return gameMap;
        if (key === "playerMap") return playerMap;
        if (key === "game123") return game;
        return null;
      },
    };
    const gameMap = new Map();
    const playerMap = new Map();
    const game = new Game();
    const player = new Player("Alice");
    player.updateHand({ name: "Lumber Yard" });
    game.discardedDeck = [];

    gameMap.set("game123", game);
    playerMap.set("player456", player);
    const result = discard("Lumber Yard", ctx);
    assertEquals(result, { message: "discarded successfully!" });
    assertEquals(player.coins, 3);
    assertEquals(game.discardedDeck.length, 1);
    assertEquals(game.discardedDeck[0], "Lumber Yard");
  });
});
