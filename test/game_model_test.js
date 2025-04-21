import { assert, assertEquals, assertNotEquals, assertThrows } from "assert";
import { describe, it } from "test/bdd";
import { Player } from "../src/models/player.js";
import { Game } from "../src/models/game.js";

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

    it("Should return current players", () => {
      const p1 = new Player("Alice");
      const p2 = new Player("Bob");
      const p3 = new Player("Adam");
      const p4 = new Player("Eve");
      const g = new Game(4, p1);
      g.addPlayer(p2);
      g.addPlayer(p3);
      g.addPlayer(p4);

      const players = g.players;
      assertEquals(players, [p1, p2, p3, p4]);
    });

    it("Should add a card to discarded card", () => {
      const p1 = new Player("Alice");
      const g = new Game(4, p1);
      g.addToDiscarded("eg_card");
      assertEquals(g.discardedDeck, ["eg_card"]);
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
