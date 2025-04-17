import { assert, assertEquals, assertNotEquals, assertThrows } from "assert";
import { describe, it } from "test/bdd";
import { Player } from "../src/models/player.js";
import { Game } from "../src/models/game.js";

describe("Testing the Player class", () => {
  it("Two players' id should be not equal", () => {
    const p1 = new Player("Alice");
    const p2 = new Player("Bob");

    assertNotEquals(p1.playerId, p2.playerId);
  });

  it("Player name should be consistent", () => {
    const p1 = new Player("Alice");

    assertEquals(p1.userName, "Alice");
  });
});

describe("Testing the Game class", () => {
  it("Two Games' id should be not equal", () => {
    const p1 = new Player("Alice");
    const p2 = new Player("Bob");
    const g1 = new Game(4, p1);
    const g2 = new Game(5, p2);
    assertNotEquals(g1.gameID, g2.gameID);
  });

  it("Should permit to join upto the given number of players", () => {
    const p1 = new Player("Alice");
    const p2 = new Player("Bob");
    const p3 = new Player("Adam");
    const p4 = new Player("Eve");
    const g = new Game(4, p1);
    g.addPlayer(p2);
    g.addPlayer(p3);
    g.addPlayer(p4);
    assert(g.isGameFull);
  });

  it("Should permit to join upto the given number of players", () => {
    const p1 = new Player("Alice");
    const p2 = new Player("Bob");
    const p3 = new Player("Adam");
    const p4 = new Player("Eve");
    const p5 = new Player("Tom");
    const g = new Game(4, p1);
    g.addPlayer(p2);
    g.addPlayer(p3);
    g.addPlayer(p4);
    assertThrows(() => {
      g.addPlayer(p5);
    }, "Room is full!");
  });
});
