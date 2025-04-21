import { assert, assertEquals, assertNotEquals, assertThrows } from "assert";
import { describe, it } from "test/bdd";
import { Player } from "../src/models/player.js";
import { Game } from "../src/models/game.js";
import { Wonder } from "../src/models/wonder.js";

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

  describe("testing haveResources", () => {
    it("should give resources uncovered while having bonusResource for building", () => {
      const p = new Player("Alice");
      const wonder = new Wonder({
        img: "ephesosA.jpeg",
        name: "Ephesos",
        resource: "papyrus",
        side: "A",
        stages: {
          stage1: {
            resources: [{ type: "stone", count: 2 }],
            powers: [{ type: "coins", value: 4 }],
          },
          stage2: {
            resources: [{ type: "wood", count: 2 }],
            powers: [{ type: "points", value: 2 }],
          },
          stage3: {
            resources: [{ type: "papyrus", count: 2 }],
            powers: [
              { type: "coins", value: 4 },
              { type: "points", value: 3 },
            ],
          },
        },
      });

      p.wonder = wonder;

      assertEquals(p.haveResources([{ type: "papyrus", count: 1 }]), []);
      assertEquals(p.haveResources([{ type: "clay", count: 1 }]), [
        {
          type: "clay",
          count: 1,
        },
      ]);
    });

    it("should give resources uncovered while having resources", () => {
      const p = new Player("Alice");
      const wonder = new Wonder({
        img: "ephesosA.jpeg",
        name: "Ephesos",
        resource: "papyrus",
        side: "A",
        stages: {
          stage1: {
            resources: [{ type: "stone", count: 2 }],
            powers: [{ type: "coins", value: 4 }],
          },
          stage2: {
            resources: [{ type: "wood", count: 2 }],
            powers: [{ type: "points", value: 2 }],
          },
          stage3: {
            resources: [{ type: "papyrus", count: 2 }],
            powers: [
              { type: "coins", value: 4 },
              { type: "points", value: 3 },
            ],
          },
        },
      });

      const hand = [
        {
          name: "Lumber Yard",
          age: 1,
          color: "brown",
          min_players: 3,
          cost: [],
          produces: [{ type: "wood", count: 1 }],
          effect: null,
          chain_from: null,
          chain_to: [],
        },
        {
          name: "Stone Pit",
          age: 1,
          color: "brown",
          min_players: 3,
          cost: [],
          produces: [{ type: "stone", count: 1 }],
          effect: null,
          chain_from: null,
          chain_to: [],
        },
      ];

      p.wonder = wonder;
      p.assignHand(hand);
      p.buildCard("Stone Pit");
      p.buildCard("Lumber Yard");

      assertEquals(p.haveResources([{ type: "wood", count: 1 }]), []);
      assertEquals(p.haveResources([{ type: "clay", count: 1 }]), [
        {
          type: "clay",
          count: 1,
        },
      ]);
    });

    it("should give resources uncovered while having choices", () => {
      const p = new Player("Alice");
      const wonder = new Wonder({
        img: "ephesosA.jpeg",
        name: "Ephesos",
        resource: "papyrus",
        side: "A",
        stages: {
          stage1: {
            resources: [{ type: "stone", count: 2 }],
            powers: [{ type: "coins", value: 4 }],
          },
          stage2: {
            resources: [{ type: "wood", count: 2 }],
            powers: [{ type: "points", value: 2 }],
          },
          stage3: {
            resources: [{ type: "papyrus", count: 2 }],
            powers: [
              { type: "coins", value: 4 },
              { type: "points", value: 3 },
            ],
          },
        },
      });

      const hand = [
        {
          name: "Tree Farm",
          age: 1,
          color: "brown",
          min_players: 6,
          cost: [{ type: "coin", count: 1 }],
          produces: [
            {
              type: "choice",
              options: ["wood", "clay"],
              count: 1,
            },
          ],
          effect: null,
          chain_from: null,
          chain_to: [],
        },
      ];

      p.wonder = wonder;
      p.assignHand(hand);
      p.buildCard("Tree Farm");

      assertEquals(p.haveResources([{ type: "wood", count: 1 }]), []);
      assertEquals(p.haveResources([{ type: "clay", count: 1 }]), []);
      assertEquals(p.haveResources([{ type: "ore", count: 1 }]), [
        {
          type: "ore",
          count: 1,
        },
      ]);
    });

    it("should give resources uncovered while having resources and choices", () => {
      const p = new Player("Alice");
      const wonder = new Wonder({
        img: "ephesosA.jpeg",
        name: "Ephesos",
        resource: "papyrus",
        side: "A",
        stages: {
          stage1: {
            resources: [{ type: "stone", count: 2 }],
            powers: [{ type: "coins", value: 4 }],
          },
          stage2: {
            resources: [{ type: "wood", count: 2 }],
            powers: [{ type: "points", value: 2 }],
          },
          stage3: {
            resources: [{ type: "papyrus", count: 2 }],
            powers: [
              { type: "coins", value: 4 },
              { type: "points", value: 3 },
            ],
          },
        },
      });

      const hand = [
        {
          name: "Ore Vein",
          age: 1,
          color: "brown",
          min_players: 3,
          cost: [],
          produces: [{ type: "ore", count: 1 }],
          effect: null,
          chain_from: null,
          chain_to: [],
        },
        {
          name: "Press",
          age: 1,
          color: "gray",
          min_players: 3,
          cost: [],
          produces: [{ type: "papyrus", count: 1 }],
          effect: null,
          chain_from: null,
          chain_to: [],
        },
        {
          name: "Tree Farm",
          age: 1,
          color: "brown",
          min_players: 6,
          cost: [{ type: "coin", count: 1 }],
          produces: [
            {
              type: "choice",
              options: ["wood", "clay"],
              count: 1,
            },
          ],
          effect: null,
          chain_from: null,
          chain_to: [],
        },
      ];

      p.wonder = wonder;
      p.assignHand(hand);
      p.buildCard("Ore Vein");
      p.buildCard("Press");
      p.buildCard("Tree Farm");

      assertEquals(p.haveResources([{ type: "wood", count: 1 }]), []);
      assertEquals(p.haveResources([{ type: "clay", count: 1 }]), []);
      assertEquals(p.haveResources([{ type: "ore", count: 1 }]), []);
      assertEquals(p.haveResources([{ type: "textile", count: 1 }]), [
        {
          type: "textile",
          count: 1,
        },
      ]);
    });
  });

  describe("testing canBuild", () => {
    const p1 = new Player("Alice");
    const p2 = new Player("Bob");
    const p3 = new Player("Clare");
    const wonder = {
      "img": "ephesosA.jpeg",
      "name": "Ephesos",
      "resource": "papyrus",
      "side": "A",
      "stages": {
        "stage1": {
          "cost": [{ "type": "stone", "count": 2 }],
          "powers": [{ "type": "coins", "value": 4 }],
        },
        "stage2": {
          "cost": [{ "type": "wood", "count": 2 }],
          "powers": [{ "type": "points", "value": 2 }],
        },
        "stage3": {
          "cost": [{ "type": "papyrus", "count": 2 }],
          "powers": [
            { "type": "coins", "value": 4 },
            { "type": "points", "value": 3 },
          ],
        },
      },
    };

    const hand = [
      {
        "name": "Ore Vein",
        "age": 1,
        "color": "brown",
        "min_players": 3,
        "cost": [],
        "produces": [{ "type": "ore", "count": 1 }],
        "effect": null,
        "chain_from": null,
        "chain_to": [],
      },
      {
        "name": "Press",
        "age": 1,
        "color": "gray",
        "min_players": 3,
        "cost": [],
        "produces": [{ "type": "papyrus", "count": 1 }],
        "effect": null,
        "chain_from": null,
        "chain_to": [],
      },
      {
        "name": "Tree Farm",
        "age": 1,
        "color": "brown",
        "min_players": 6,
        "cost": [{ "type": "coin", "count": 1 }],
        "produces": [
          {
            "type": "choice",
            "options": ["wood", "clay"],
            "count": 1,
          },
        ],
        "effect": null,
        "chain_from": null,
        "chain_to": [],
      },
      {
        "name": "Stone Pit",
        "age": 1,
        "color": "brown",
        "min_players": 3,
        "cost": [],
        "produces": [{ "type": "stone", "count": 1 }],
        "effect": null,
        "chain_from": null,
        "chain_to": [],
      },
    ];

    p1.wonder = new Wonder(wonder);
    p2.wonder = new Wonder(wonder);
    p3.wonder = new Wonder(wonder);
    p1.assignHand(hand);
    p2.assignHand(hand);
    p3.assignHand(hand);
    p1.leftPlayer = p2;
    p1.rightPlayer = p3;
    p1.addCoins(3);
    p1.buildCard("Ore Vein");
    p1.buildCard("Press");
    p1.buildCard("Tree Farm");
    p2.buildCard("Stone Pit");

    it("should return true", () => {
      assertEquals(
        p1.canBuild({
          "name": "Scriptorium",
          "age": 1,
          "color": "green",
          "min_players": 4,
          "cost": [{ "type": "papyrus", "count": 1 }],
          "produces": [{ "type": "tablet", "count": 1 }],
          "effect": null,
          "chain_from": null,
          "chain_to": ["Library"],
        }),
        true,
      );
    });

    it("should return true from coin", () => {
      assertEquals(
        p1.canBuild({
          "name": "Excavation",
          "age": 1,
          "color": "brown",
          "min_players": 4,
          "cost": [{ "type": "coin", "count": 1 }],
          "produces": [
            {
              "type": "choice",
              "options": ["stone", "clay"],
              "count": 1,
            },
          ],
          "effect": null,
          "chain_from": null,
          "chain_to": [],
        }),
        true,
      );
    });

    it("should return false from coin", () => {
      assertEquals(
        p1.canBuild({
          "name": "Excavation",
          "age": 1,
          "color": "brown",
          "min_players": 4,
          "cost": [{ "type": "coin", "count": 4 }],
          "produces": [
            {
              "type": "choice",
              "options": ["stone", "clay"],
              "count": 1,
            },
          ],
          "effect": null,
          "chain_from": null,
          "chain_to": [],
        }),
        false,
      );
    });

    it("should return true from neighbour", () => {
      assertEquals(
        p1.canBuild({
          "name": "Baths",
          "age": 1,
          "color": "blue",
          "min_players": 3,
          "cost": [{ "type": "stone", "count": 1 }],
          "produces": [{ "type": "points", "count": 3 }],
          "chain_from": null,
          "chain_to": ["Aqueduct"],
          "type": "civil",
        }),
        true,
      );
    });

    it("should return false", () => {
      assertEquals(
        p1.canBuild({
          "name": "Apothecary",
          "age": 1,
          "color": "green",
          "min_players": 5,
          "cost": [{ "type": "textile", "count": 1 }],
          "produces": [{ "type": "compass", "count": 1 }],
          "effect": null,
          "chain_from": null,
          "chain_to": ["Stables", "Dispensary"],
        }),
        false,
      );
    });
  });
});

describe("Testing the Game class", () => {
  const getCardsName = (hand) => hand.map((card) => card.name);

  const testIfHandsAreSame = (hand1, hand2) => {
    assertEquals(getCardsName(hand1), getCardsName(hand2));
  };

  const testIfHandsAreNotSame = (hand1, hand2) => {
    assertNotEquals(getCardsName(hand1), getCardsName(hand2));
  };

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

  describe("Testing the getPlayerData", () => {
    it("Should give proper player data with 4 players", () => {
      const p1 = new Player("Alice");
      const p2 = new Player("Bob");
      const p3 = new Player("Adam");
      const p4 = new Player("Eve");

      const bobID = p2.playerID;

      const g = new Game(4, p1, ([...arr]) => arr.sort(() => 0));
      g.addPlayer(p2);
      g.addPlayer(p3);
      g.addPlayer(p4);

      assertEquals(g.getPlayerInfo(bobID), {
        name: "Bob",
        wonder: "Gizah",
        coins: 3,
        warTokens: { positive: 0, negative: 0 },
        stage: [],
        buildings: {
          brown: [],
          gray: [],
          green: [],
          yellow: [],
          blue: [],
          red: [],
          purple: [],
        },
        bonusResource: "stone",
        leftPlayerData: {
          name: "Alice",
          wonder: "Olympia",
          coins: 3,
          warTokens: { positive: 0, negative: 0 },
          stage: [],
          buildings: {
            brown: [],
            gray: [],
            green: [],
            yellow: [],
            blue: [],
            red: [],
            purple: [],
          },
          bonusResource: "wood",
        },
        rightPlayerData: {
          name: "Adam",
          wonder: "Ephesos",
          coins: 3,
          warTokens: { positive: 0, negative: 0 },
          stage: [],
          buildings: {
            brown: [],
            gray: [],
            green: [],
            yellow: [],
            blue: [],
            red: [],
            purple: [],
          },
          bonusResource: "papyrus",
        },
        others: [
          {
            name: "Eve",
            wonder: "Alexandria",
            coins: 3,
            warTokens: { positive: 0, negative: 0 },
            stage: [],
            buildings: {
              brown: [],
              gray: [],
              green: [],
              yellow: [],
              blue: [],
              red: [],
              purple: [],
            },
            bonusResource: "glass",
          },
        ],
      });
    });

    it("Should give proper player data with 5 players", () => {
      const p1 = new Player("Alice");
      const p2 = new Player("Bob");
      const p3 = new Player("Adam");
      const p4 = new Player("Eve");
      const p5 = new Player("Tom");

      const tomID = p5.playerID;

      const g = new Game(5, p1, ([...arr]) => arr.sort(() => 0));
      g.addPlayer(p2);
      g.addPlayer(p3);
      g.addPlayer(p4);
      g.addPlayer(p5);

      assertEquals(g.getPlayerInfo(tomID), {
        name: "Tom",
        wonder: "Halikarnassos",
        coins: 3,
        warTokens: { positive: 0, negative: 0 },
        stage: [],
        buildings: {
          brown: [],
          gray: [],
          green: [],
          yellow: [],
          blue: [],
          red: [],
          purple: [],
        },
        bonusResource: "textile",
        leftPlayerData: {
          name: "Eve",
          wonder: "Alexandria",
          coins: 3,
          warTokens: { positive: 0, negative: 0 },
          stage: [],
          buildings: {
            brown: [],
            gray: [],
            green: [],
            yellow: [],
            blue: [],
            red: [],
            purple: [],
          },
          bonusResource: "glass",
        },
        rightPlayerData: {
          name: "Alice",
          wonder: "Olympia",
          coins: 3,
          warTokens: { positive: 0, negative: 0 },
          stage: [],
          buildings: {
            brown: [],
            gray: [],
            green: [],
            yellow: [],
            blue: [],
            red: [],
            purple: [],
          },
          bonusResource: "wood",
        },
        others: [
          {
            name: "Adam",
            wonder: "Ephesos",
            coins: 3,
            warTokens: { positive: 0, negative: 0 },
            stage: [],
            buildings: {
              brown: [],
              gray: [],
              green: [],
              yellow: [],
              blue: [],
              red: [],
              purple: [],
            },
            bonusResource: "papyrus",
          },
          {
            name: "Bob",
            wonder: "Gizah",
            coins: 3,
            warTokens: { positive: 0, negative: 0 },
            stage: [],
            buildings: {
              brown: [],
              gray: [],
              green: [],
              yellow: [],
              blue: [],
              red: [],
              purple: [],
            },
            bonusResource: "stone",
          },
        ],
      });
    });
  });

  describe("Testing the getPlayerHandData", () => {
    it("Should give proper player hand data with 4 players", () => {
      const p1 = new Player("Alice");
      const p2 = new Player("Bob");
      const p3 = new Player("Adam");
      const p4 = new Player("Eve");
      const bobID = p2.playerID;

      const g = new Game(4, p1, ([...arr]) => arr.sort(() => 0));
      g.addPlayer(p2);
      g.addPlayer(p3);
      g.addPlayer(p4);

      console.log(getCardsName(g.getPlayerHandData(bobID)));

      assertEquals(getCardsName(g.getPlayerHandData(bobID)), [
        "Clay Pit",
        "Timber Yard",
        "Glassworks",
        "Press",
        "Loom",
        "Tavern",
        "East Trading Post",
      ]);
    });

    it("Should give proper player hand data for multiple player with 4 players", () => {
      const p1 = new Player("Alice");
      const p2 = new Player("Bob");
      const p3 = new Player("Adam");
      const p4 = new Player("Eve");

      const aliceID = p1.playerID;
      const bobID = p2.playerID;

      const g = new Game(4, p1, ([...arr]) => arr.sort(() => 0));
      g.addPlayer(p2);
      g.addPlayer(p3);
      g.addPlayer(p4);

      assertEquals(getCardsName(g.getPlayerHandData(aliceID)), [
        "Lumber Yard",
        "Lumber Yard",
        "Stone Pit",
        "Clay Pool",
        "Ore Vein",
        "Ore Vein",
        "Excavation",
      ]);

      assertEquals(getCardsName(g.getPlayerHandData(bobID)), [
        "Clay Pit",
        "Timber Yard",
        "Glassworks",
        "Press",
        "Loom",
        "Tavern",
        "East Trading Post",
      ]);
    });
  });

  describe("Testing update hand, that after a round remove a card form the hand", () => {
    it("Should remove a from the hand according to the card name", () => {
      const p1 = new Player("Alice");
      const p2 = new Player("Bob");
      const p3 = new Player("Adam");
      const p4 = new Player("Eve");

      const bobID = p2.playerID;

      const g = new Game(4, p1, ([...arr]) => arr.sort(() => 0));
      g.addPlayer(p2);
      g.addPlayer(p3);
      g.addPlayer(p4);

      const beforeUpdateBobsHand = g.getPlayerHandData(bobID);
      console.log("Card removing", beforeUpdateBobsHand[0].name);

      p2.updateHand(beforeUpdateBobsHand[0].name);
      const afterUpdateBobsHand = g.getPlayerHandData(bobID);

      beforeUpdateBobsHand.shift();
      assertEquals(beforeUpdateBobsHand, afterUpdateBobsHand);
    });
  });

  describe("Testing pass hands", () => {
    describe("Testing if the passing hand works", () => {
      it("Should change player's hand after passing", () => {
        const p1 = new Player("Alice");
        const p2 = new Player("Bob");
        const p3 = new Player("Adam");
        const p4 = new Player("Eve");

        const bobID = p2.playerID;

        const g = new Game(4, p1, ([...arr]) => arr.sort(() => 0));
        g.addPlayer(p2);
        g.addPlayer(p3);
        g.addPlayer(p4);

        const beforePassingBobsHand = g.getPlayerHandData(bobID);
        g.passHands();
        const afterPassingBobsHand = g.getPlayerHandData(bobID);
        testIfHandsAreNotSame(beforePassingBobsHand, afterPassingBobsHand);
      });

      it("Should change all player's hand after passing", () => {
        const p1 = new Player("Alice");
        const p2 = new Player("Bob");
        const p3 = new Player("Adam");
        const p4 = new Player("Eve");

        const aliceID = p1.playerID;
        const bobID = p2.playerID;
        const adamID = p3.playerID;
        const eveID = p4.playerID;

        const g = new Game(4, p1, ([...arr]) => arr.sort(() => 0));
        g.addPlayer(p2);
        g.addPlayer(p3);
        g.addPlayer(p4);

        const beforePassingAlicesHand = g.getPlayerHandData(aliceID);
        const beforePassingBobsHand = g.getPlayerHandData(bobID);
        const beforePassingAdamsHand = g.getPlayerHandData(adamID);
        const beforePassingEvesHand = g.getPlayerHandData(eveID);
        g.passHands();
        const afterPassingAlicesHand = g.getPlayerHandData(aliceID);
        const afterPassingBobsHand = g.getPlayerHandData(bobID);
        const afterPassingAdamsHand = g.getPlayerHandData(adamID);
        const afterPassingEvesHand = g.getPlayerHandData(eveID);

        console.log(getCardsName(beforePassingAlicesHand));

        testIfHandsAreNotSame(beforePassingAlicesHand, afterPassingAlicesHand);
        testIfHandsAreNotSame(beforePassingBobsHand, afterPassingBobsHand);
        testIfHandsAreNotSame(beforePassingAdamsHand, afterPassingAdamsHand);
        testIfHandsAreNotSame(beforePassingEvesHand, afterPassingEvesHand);
      });
    });

    describe("Testing if the passing hand works for age one, i.e. pass to left", () => {
      it("Should pass player's hand to the left neighbor", () => {
        const p1 = new Player("Alice");
        const p2 = new Player("Bob");
        const p3 = new Player("Adam");
        const p4 = new Player("Eve");

        const aliceID = p1.playerID;
        const bobID = p2.playerID;

        const g = new Game(4, p1, ([...arr]) => arr.sort(() => 0));
        g.addPlayer(p2);
        g.addPlayer(p3);
        g.addPlayer(p4);

        const beforePassingBobsHand = g.getPlayerHandData(bobID);
        g.passHands();
        const afterPassingAlicesHand = g.getPlayerHandData(aliceID);

        assertEquals(beforePassingBobsHand, afterPassingAlicesHand);
      });

      it("Should pass all player's hand to their left neighbor as it's age 1", () => {
        const p1 = new Player("Alice");
        const p2 = new Player("Bob");
        const p3 = new Player("Adam");
        const p4 = new Player("Eve");

        const aliceID = p1.playerID;
        const bobID = p2.playerID;
        const adamID = p3.playerID;
        const eveID = p4.playerID;

        const g = new Game(4, p1, ([...arr]) => arr.sort(() => 0));
        g.addPlayer(p2);
        g.addPlayer(p3);
        g.addPlayer(p4);

        const beforePassingAlicesHand = g.getPlayerHandData(aliceID);
        const beforePassingBobsHand = g.getPlayerHandData(bobID);
        const beforePassingAdamsHand = g.getPlayerHandData(adamID);
        const beforePassingEvesHand = g.getPlayerHandData(eveID);
        g.passHands();
        const afterPassingAlicesHand = g.getPlayerHandData(aliceID);
        const afterPassingBobsHand = g.getPlayerHandData(bobID);
        const afterPassingAdamsHand = g.getPlayerHandData(adamID);
        const afterPassingEvesHand = g.getPlayerHandData(eveID);

        testIfHandsAreSame(beforePassingBobsHand, afterPassingAlicesHand);
        testIfHandsAreSame(beforePassingAdamsHand, afterPassingBobsHand);
        testIfHandsAreSame(beforePassingEvesHand, afterPassingAdamsHand);
        testIfHandsAreSame(beforePassingAlicesHand, afterPassingEvesHand);
      });
    });

    describe("Testing if the passing hand works for age two, i.e. pass to right", () => {
      it("Should pass player's hand to the left neighbor", () => {
        const p1 = new Player("Alice");
        const p2 = new Player("Bob");
        const p3 = new Player("Adam");
        const p4 = new Player("Eve");

        const aliceID = p1.playerID;
        const bobID = p2.playerID;

        const g = new Game(4, p1, ([...arr]) => arr.sort(() => 0));
        g.addPlayer(p2);
        g.addPlayer(p3);
        g.addPlayer(p4);

        g.currentAge = 2;

        const beforePassingAlicesHand = g.getPlayerHandData(aliceID);
        g.passHands();
        const afterPassingBobsHand = g.getPlayerHandData(bobID);

        // assertEquals(beforePassingAlicesHand, afterPassingBobsHand);
        testIfHandsAreSame(beforePassingAlicesHand, afterPassingBobsHand);
      });

      it("Should pass all player's hand to their right neighbor as it's age 1", () => {
        const p1 = new Player("Alice");
        const p2 = new Player("Bob");
        const p3 = new Player("Adam");
        const p4 = new Player("Eve");

        const aliceID = p1.playerID;
        const bobID = p2.playerID;
        const adamID = p3.playerID;
        const eveID = p4.playerID;

        const g = new Game(4, p1, ([...arr]) => arr.sort(() => 0));
        g.addPlayer(p2);
        g.addPlayer(p3);
        g.addPlayer(p4);

        g.currentAge = 2;

        const beforePassingAlicesHand = g.getPlayerHandData(aliceID);
        const beforePassingBobsHand = g.getPlayerHandData(bobID);
        const beforePassingAdamsHand = g.getPlayerHandData(adamID);
        const beforePassingEvesHand = g.getPlayerHandData(eveID);
        g.passHands();
        const afterPassingAlicesHand = g.getPlayerHandData(aliceID);
        const afterPassingBobsHand = g.getPlayerHandData(bobID);
        const afterPassingAdamsHand = g.getPlayerHandData(adamID);
        const afterPassingEvesHand = g.getPlayerHandData(eveID);

        testIfHandsAreSame(beforePassingBobsHand, afterPassingAdamsHand);
        testIfHandsAreSame(beforePassingAdamsHand, afterPassingEvesHand);
        testIfHandsAreSame(beforePassingEvesHand, afterPassingAlicesHand);
        testIfHandsAreSame(beforePassingAlicesHand, afterPassingBobsHand);
      });
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
        resources: [{ type: "wood", count: 2 }],
        powers: [{ type: "points", value: 3 }],
      },
      stage2: {
        resources: [{ type: "stone", count: 2 }],
        powers: [{ type: "free_card_per_age" }],
      },
      stage3: {
        resources: [{ type: "ore", count: 2 }],
        powers: [{ type: "points", value: 7 }],
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
      cost: [{ type: "clay", count: 1 }],
      produces: [{ type: "shield", count: 1 }],
      effect: null,
      chain_from: null,
      chain_to: [],
    });

    wonder.build({
      name: "Stockade",
      age: 1,
      color: "red",
      min_players: 3,
      cost: [{ type: "wood", count: 1 }],
      produces: [{ type: "shield", count: 1 }],
      effect: null,
      chain_from: null,
      chain_to: [],
    });

    wonder.build({
      name: "Barracks",
      age: 1,
      color: "red",
      min_players: 3,
      cost: [{ type: "ore", count: 1 }],
      produces: [{ type: "shield", count: 1 }],
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
      produces: [{ type: "points", count: 2 }],
      chain_from: null,
      chain_to: ["Temple"],
      type: "civil",
    });

    wonder.build({
      name: "Baths",
      age: 1,
      color: "blue",
      min_players: 3,
      cost: [{ type: "stone", count: 1 }],
      produces: [{ type: "points", count: 3 }],
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
      produces: [{ type: "points", count: 2 }],
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
      produces: [{ type: "points", count: 3 }],
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
      produces: [{ type: "wood", count: 1 }],
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
      produces: [{ type: "stone", count: 1 }],
      effect: null,
      chain_from: null,
      chain_to: [],
    });

    wonder.build({
      name: "Clay Pit",
      age: 1,
      color: "brown",
      min_players: 3,
      cost: [{ type: "coin", count: 1 }],
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
      produces: [{ type: "glass", count: 1 }],
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
      produces: [{ type: "papyrus", count: 1 }],
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
      produces: [{ type: "textile", count: 1 }],
      effect: null,
      chain_from: null,
      chain_to: [],
    });

    wonder.build({
      name: "Scriptorium",
      age: 1,
      color: "green",
      min_players: 3,
      cost: [{ type: "papyrus", count: 1 }],
      produces: [{ type: "tablet", count: 1 }],
      effect: null,
      chain_from: null,
      chain_to: ["Library"],
    });

    wonder.build({
      name: "Apothecary",
      age: 1,
      color: "green",
      min_players: 3,
      cost: [{ type: "textile", count: 1 }],
      produces: [{ type: "compass", count: 1 }],
      effect: null,
      chain_from: null,
      chain_to: ["Stables", "Dispensary"],
    });

    wonder.build({
      name: "Workshop",
      age: 1,
      color: "green",
      min_players: 3,
      cost: [{ type: "glass", count: 1 }],
      produces: [{ type: "gear", count: 1 }],
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
          cost: [{ type: "coin", count: 1 }],
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
          cost: [{ type: "coin", count: 1 }],
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
          cost: [{ type: "coin", count: 1 }],
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

  it("should add stage benefit", () => {
    const wonder = new Wonder(olympia);

    wonder.build({
      name: "Altar",
      age: 1,
      color: "blue",
      min_players: 3,
      cost: [],
      produces: [{ type: "points", count: 2 }],
      chain_from: null,
      chain_to: ["Temple"],
      type: "civil",
    });

    wonder.build({
      name: "Baths",
      age: 1,
      color: "blue",
      min_players: 3,
      cost: [{ type: "stone", count: 1 }],
      produces: [{ type: "points", count: 3 }],
      chain_from: null,
      chain_to: ["Aqueduct"],
      type: "civil",
    });

    wonder.stageACard(
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
            cost: [{ type: "coin", count: 1 }],
            applies_to: ["left_neighbour"],
            options: ["clay", "stone", "wood", "ore"],
          },
        ],
        chain_from: null,
        chain_to: [],
      }),
    );

    const victoryPoints = wonder.victoryPoints;
    assertEquals(victoryPoints, 8);
  });
});
