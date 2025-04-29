import { assertEquals, assertNotEquals } from "assert";
import { beforeEach, describe, it } from "test/bdd";
import { Player } from "../src/models/player.js";
import { Game } from "../src/models/game.js";

describe("Testing the Player class", () => {
  describe("Player class miscellaneous tests", () => {
    it("Two players' id should be not equal", () => {
      const p1 = new Player("Alice");
      const p2 = new Player("Bob");

      assertNotEquals(p1.playerID, p2.playerID);
    });

    it("Player name should be consistent", () => {
      const p1 = new Player("Alice");

      assertEquals(p1.name, "Alice");
    });

    it("Should return the player's coin", () => {
      const p = new Player("Alice");
      assertEquals(p.coins, 0);
    });

    it("Should return the player's coin, after adding more coins", () => {
      const p = new Player("Alice");
      p.addCoins(3);
      assertEquals(p.coins, 3);
    });
  });
});
describe("Testing Military conflicts", () => {
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

  it("Should return total conflict value", () => {
    const p = new Player("Alice");
    p.addWarTokens(1);
    p.addWarTokens(3);
    p.addWarTokens(5);
    p.addWarTokens(-1);

    assertEquals(p.warTokensObj, { positive: 9, negative: -1 });
  });

  it("Should return total conflict value", () => {
    const p = new Player("Alice");
    p.addWarTokens(1);
    p.addWarTokens(3);
    p.addWarTokens(5);
    p.addWarTokens(-1);

    assertEquals(p.warTokensObj, { positive: 9, negative: -1 });
  });

  it("Should return war conflict points", () => {
    p1.wonder.addMilitaryStrength({
      produces: [{ type: "shield", count: 3 }],
    });
    p2.wonder.addMilitaryStrength({
      produces: [{ type: "shield", count: 3 }],
    });
    p3.wonder.addMilitaryStrength({
      produces: [{ type: "shield", count: 0 }],
    });
    p4.wonder.addMilitaryStrength({
      produces: [{ type: "shield", count: 2 }],
    });

    assertEquals(p1.calculateWarPoints(3), {
      militaryShields: 3,
      leftConflict: {
        opponentName: "Eve",
        militaryShields: 2,
        wonderName: "Alexandria",
        result: "won",
        tokens: 5,
      },
      rightConflict: {
        opponentName: "Bob",
        militaryShields: 3,
        wonderName: "Gizah",
        result: "draw",
        tokens: 0,
      },
    });

    assertEquals(p2.calculateWarPoints(2), {
      militaryShields: 3,
      leftConflict: {
        opponentName: "Alice",
        militaryShields: 3,
        wonderName: "Olympia",
        result: "draw",
        tokens: 0,
      },
      rightConflict: {
        opponentName: "Adam",
        militaryShields: 0,
        wonderName: "Ephesos",
        result: "won",
        tokens: 3,
      },
    });

    assertEquals(p3.calculateWarPoints(1), {
      militaryShields: 0,
      leftConflict: {
        opponentName: "Bob",
        militaryShields: 3,
        wonderName: "Gizah",
        result: "lose",
        tokens: -1,
      },
      rightConflict: {
        opponentName: "Eve",
        militaryShields: 2,
        wonderName: "Alexandria",
        result: "lose",
        tokens: -1,
      },
    });

    assertEquals(p4.calculateWarPoints(3), {
      militaryShields: 2,
      leftConflict: {
        opponentName: "Adam",
        militaryShields: 0,
        wonderName: "Ephesos",
        result: "won",
        tokens: 5,
      },
      rightConflict: {
        opponentName: "Alice",
        militaryShields: 3,
        wonderName: "Olympia",
        result: "lose",
        tokens: -1,
      },
    });
  });
});

describe("Testing resetPlayerAction", () => {
  it("should reset the player's tempAct", () => {
    const player = new Player("ALice");

    player.tempAct = { action: "build", card: "Gaurd Tower" };
    assertEquals(player.tempAct, { action: "build", card: "Gaurd Tower" });

    player.resetTempAct();
    assertEquals(player.tempAct, null);
  });
});
