import {assert, assertEquals, assertNotEquals, assertThrows} from "assert";
import {describe, it} from "test/bdd";
import {Player} from "../src/models/player.js";
import {Game} from "../src/models/game.js";
import {Wonder} from "../src/models/wonder.js";

describe("Testing the Player class", () => {
  it("Two players' id should be not equal", () => {
    const p1 = new Player("Alice");
    const p2 = new Player("Bob");

    assertNotEquals(p1.playerID, p2.playerID);
  });

  it("Player name should be consistent", () => {
    const p1 = new Player("Alice");

    assertEquals(p1.name, "Alice");
  });
});

describe("Testing the Game class", () => {
  describe("Testing game consistency", () => {
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
});

describe("testing the wonders class", () => {
  const olympia = {
    img: "olympiaA.jpeg",
    name: "Olympia",
    resource: "wood",
    side: "A",
    stages: {
      stage1: {
        resources: [{type: "wood", count: 2}],
        powers: [{type: "points", value: 3}],
      },
      stage2: {
        resources: [{type: "stone", count: 2}],
        powers: [{type: "free_card_per_age"}],
      },
      stage3: {
        resources: [{type: "ore", count: 2}],
        powers: [{type: "points", value: 7}],
      },
    },
  };

  it("should give no of military points", () => {
    const wonder = new Wonder(olympia);

    wonder.build({
      name: "Guard Tower",
      age: 1,
      color: "red",
      min_players: 3,
      cost: [{type: "clay", count: 1}],
      produces: [{type: "shield", count: 1}],
      effect: null,
      chain_from: null,
      chain_to: [],
    });

    wonder.build({
      name: "Stockade",
      age: 1,
      color: "red",
      min_players: 3,
      cost: [{type: "wood", count: 1}],
      produces: [{type: "shield", count: 1}],
      effect: null,
      chain_from: null,
      chain_to: [],
    });

    wonder.build({
      name: "Barracks",
      age: 1,
      color: "red",
      min_players: 3,
      cost: [{type: "ore", count: 1}],
      produces: [{type: "shield", count: 1}],
      effect: null,
      chain_from: null,
      chain_to: ["Stables", "Walls"],
    });

    const militaryStrength = wonder.militaryStrength;

    assertEquals(militaryStrength, 3);
  });

  it("should give no of victory points", () => {
    const wonder = new Wonder(olympia);

    wonder.build({
      name: "Altar",
      age: 1,
      color: "blue",
      min_players: 3,
      cost: [],
      produces: [{type: "points", count: 2}],
      chain_from: null,
      chain_to: ["Temple"],
      type: "civil",
    });

    wonder.build({
      name: "Baths",
      age: 1,
      color: "blue",
      min_players: 3,
      cost: [{type: "stone", count: 1}],
      produces: [{type: "points", count: 3}],
      chain_from: null,
      chain_to: ["Aqueduct"],
      type: "civil",
    });

    wonder.build({
      name: "Theater",
      age: 1,
      color: "blue",
      min_players: 3,
      cost: [],
      produces: [{type: "points", count: 2}],
      chain_from: null,
      chain_to: ["Statue"],
      type: "civil",
    });

    wonder.build({
      name: "Pawn Shop",
      age: 1,
      color: "blue",
      min_players: 4,
      cost: [],
      produces: [{type: "points", count: 3}],
      chain_from: null,
      chain_to: [],
      type: "civil",
    });

    const victoryPoints = wonder.victoryPoints;

    assertEquals(victoryPoints, 10);
  });

  it("should give resources", () => {
    const wonder = new Wonder(olympia);

    wonder.build({
      name: "Lumber Yard",
      age: 1,
      color: "brown",
      min_players: 3,
      cost: [],
      produces: [{type: "wood", count: 1}],
      effect: null,
      chain_from: null,
      chain_to: [],
    });

    wonder.build({
      name: "Stone Pit",
      age: 1,
      color: "brown",
      min_players: 3,
      cost: [],
      produces: [{type: "stone", count: 1}],
      effect: null,
      chain_from: null,
      chain_to: [],
    });

    wonder.build({
      name: "Clay Pit",
      age: 1,
      color: "brown",
      min_players: 3,
      cost: [{type: "coin", count: 1}],
      produces: [
        {
          type: "choice",
          options: ["ore", "clay"],
          count: 1,
        },
      ],
      effect: null,
      chain_from: null,
      chain_to: [],
    });

    wonder.build({
      name: "Timber Yard",
      age: 1,
      color: "brown",
      min_players: 3,
      cost: [],
      produces: [
        {
          type: "choice",
          options: ["wood", "stone"],
          count: 1,
        },
      ],
      chain_from: null,
      chain_to: [],
      type: "raw_material",
    });

    wonder.build({
      name: "Glassworks",
      age: 1,
      color: "gray",
      min_players: 3,
      cost: [],
      produces: [{type: "glass", count: 1}],
      effect: null,
      chain_from: null,
      chain_to: [],
    });

    wonder.build({
      name: "Press",
      age: 1,
      color: "gray",
      min_players: 3,
      cost: [],
      produces: [{type: "papyrus", count: 1}],
      effect: null,
      chain_from: null,
      chain_to: [],
    });

    wonder.build({
      name: "Loom",
      age: 1,
      color: "gray",
      min_players: 3,
      cost: [],
      produces: [{type: "textile", count: 1}],
      effect: null,
      chain_from: null,
      chain_to: [],
    });

    wonder.build({
      name: "Scriptorium",
      age: 1,
      color: "green",
      min_players: 3,
      cost: [{type: "papyrus", count: 1}],
      produces: [{type: "tablet", count: 1}],
      effect: null,
      chain_from: null,
      chain_to: ["Library"],
    });

    wonder.build({
      name: "Apothecary",
      age: 1,
      color: "green",
      min_players: 3,
      cost: [{type: "textile", count: 1}],
      produces: [{type: "compass", count: 1}],
      effect: null,
      chain_from: null,
      chain_to: ["Stables", "Dispensary"],
    });

    wonder.build({
      name: "Workshop",
      age: 1,
      color: "green",
      min_players: 3,
      cost: [{type: "glass", count: 1}],
      produces: [{type: "gear", count: 1}],
      effect: null,
      chain_from: null,
      chain_to: ["Laboratory"],
    });

    const resources = wonder.resources;

    const choice1 = new Set(["clay", "ore"]);
    const choice2 = new Set(["stone", "wood"]);
    const result = {
      choices: [choice1, choice2],
      compass: 1,
      gear: 1,
      stone: 1,
      tablet: 1,
      wood: 2,
    };

    assertEquals(resources, result);
  });

  it("should get discounds", () => {
    const wonder = new Wonder(olympia);

    wonder.build({
      name: "East Trading Post",
      age: 1,
      color: "yellow",
      min_players: 3,
      cost: [],
      produces: [],
      effect: [
        {
          type: "resource",
          effect_type: "buy",
          cost: [{type: "coin", count: 1}],
          applies_to: ["right_neighbour"],
          options: ["clay", "stone", "wood", "ore"],
        },
      ],
      chain_from: null,
      chain_to: [],
    });

    wonder.build({
      name: "West Trading Post",
      age: 1,
      color: "yellow",
      min_players: 3,
      cost: [],
      produces: [],
      effect: [
        {
          type: "resource",
          effect_type: "buy",
          cost: [{type: "coin", count: 1}],
          applies_to: ["left_neighbour"],
          options: ["clay", "stone", "wood", "ore"],
        },
      ],
      chain_from: null,
      chain_to: [],
    });

    wonder.build({
      name: "Marketplace",
      age: 1,
      color: "yellow",
      min_players: 3,
      cost: [],
      produces: [],
      effect: [
        {
          type: "resource",
          effect_type: "buy",
          cost: [{type: "coin", count: 1}],
          applies_to: ["left_neighbour", "right_neighbour"],
          options: ["glass", "papyrus", "textile"],
        },
      ],
      chain_from: null,
      chain_to: [],
    });

    const discounts = wonder.discounts;
    const result = {
      clay: ["right_neighbour", "left_neighbour"],
      glass: ["left_neighbour", "right_neighbour"],
      ore: ["right_neighbour", "left_neighbour"],
      papyrus: ["left_neighbour", "right_neighbour"],
      stone: ["right_neighbour", "left_neighbour"],
      textile: ["left_neighbour", "right_neighbour"],
      wood: ["right_neighbour", "left_neighbour"],
    };

    assertEquals(discounts, result);
  });

  it("should add stage benifit", () => {
    const wonder = new Wonder(olympia);

    wonder.build({
      name: "Altar",
      age: 1,
      color: "blue",
      min_players: 3,
      cost: [],
      produces: [{type: "points", count: 2}],
      chain_from: null,
      chain_to: ["Temple"],
      type: "civil",
    });

    wonder.build({
      name: "Baths",
      age: 1,
      color: "blue",
      min_players: 3,
      cost: [{type: "stone", count: 1}],
      produces: [{type: "points", count: 3}],
      chain_from: null,
      chain_to: ["Aqueduct"],
      type: "civil",
    });

    wonder.stageACard(wonder.build({
      name: "West Trading Post",
      age: 1,
      color: "yellow",
      min_players: 3,
      cost: [],
      produces: [],
      effect: [
        {
          type: "resource",
          effect_type: "buy",
          cost: [{type: "coin", count: 1}],
          applies_to: ["left_neighbour"],
          options: ["clay", "stone", "wood", "ore"],
        },
      ],
      chain_from: null,
      chain_to: [],
    }));

    const victoryPoints = wonder.victoryPoints;
    assertEquals(victoryPoints, 8);

  });
});
