import {
  didAllPlayerSelectCard,
  getPlayerDetails,
  getPlayerHand,
  getPlayersStatus,
  performPlayersAction,
  sendStatus,
  updatePlayersStatus,
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

describe("updatePlayersStatus", () => {
  it("should update players status", () => {
    const ctx = {
      getCookie: (_, name) => {
        if (name === "gameID") return "game123";
        return { gameID: "game123" };
      },
    };
    const data = [];
    const gameMap = new Map();
    const game = {
      updatePlayersStatus: () => data.push("hii"),
    };
    gameMap.set("game123", game);
    ctx.get = (key) => {
      if (key === "gameMap") return gameMap;
      return null;
    };
    const result = updatePlayersStatus(ctx);
    assertEquals(result, undefined);
    assertEquals(data, ["hii"]);
  });
});

describe("getPlayerHand", () => {
  it("should return player hand data", () => {
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
      getPlayerHandData: (playerID) => {
        if (playerID === "player456") {
          return { hand: ["card1", "card2"] };
        }
        return null;
      },
    };
    gameMap.set("game123", game);
    ctx.get = (key) => {
      if (key === "gameMap") return gameMap;
      return null;
    };
    const result = getPlayerHand(ctx);
    assertEquals(result, { hand: ["card1", "card2"] });
  });
});

describe("getPlayersStatus", () => {
  it("should return players status", async () => {
    const ctx = {
      json: (data) => data,
      getCookie: () => {
        return { gameID: "game123", playerID: "player456" };
      },
    };
    const gameMap = new Map();
    const game = {
      getPlayersStatus: (playerID) => {
        if (playerID === "player456") {
          return { status: "active" };
        }
        return null;
      },
      didAllPlayerSelectCard: () => false,
    };
    gameMap.set("game123", game);
    ctx.get = (key) => {
      if (key === "gameMap") return gameMap;
      return null;
    };
    const nxt = [];
    const result = await getPlayersStatus(ctx, () => {
      nxt.push("called");
    });
    assertEquals(result, { status: "active" });
    assertEquals(nxt, []);
  });
  it("should return players status", async () => {
    const ctx = {
      json: (data) => data,
      getCookie: () => {
        return { gameID: "game123", playerID: "player456" };
      },
    };
    const gameMap = new Map();
    const game = {
      getPlayersStatus: (playerID) => {
        if (playerID === "player456") {
          return { status: "active" };
        }
        return null;
      },
      didAllPlayerSelectCard: () => true,
    };
    gameMap.set("game123", game);
    ctx.get = (key) => {
      if (key === "gameMap") return gameMap;
      return null;
    };
    const nxt = [];
    const result = await getPlayersStatus(ctx, () => {
      nxt.push("called");
    });
    assertEquals(result, { status: "active" });
    assertEquals(nxt, ["called"]);
  });
});

describe("performPlayersAction", () => {
  it("should perform players action", async () => {
    const ctx = {
      getCookie: (_, name) => {
        if (name === "gameID") return "game123";
        return { gameID: "game123" };
      },
    };
    const functionCalled = [];
    const gameMap = new Map();
    const game = {
      executeTempActs: () => {
        functionCalled.push("executeTempActs");
      },
      passHands: () => {
        functionCalled.push("passHands");
      },
    };
    gameMap.set("game123", game);
    ctx.get = (key) => {
      if (key === "gameMap") return gameMap;
      return null;
    };
    await performPlayersAction(ctx, () => {});
    assertEquals(functionCalled, ["executeTempActs", "passHands"]);
  });
});
