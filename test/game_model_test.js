import {
  assert,
  assertEquals,
  assertFalse,
  assertNotEquals,
  assertThrows,
} from "assert";
import { beforeEach, describe, it } from "test/bdd";
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
    let p1, p2, p3, p4, p5, g1;

    beforeEach(() => {
      p1 = new Player("Alice");
      p2 = new Player("Bob");
      p3 = new Player("Adam");
      p4 = new Player("Eve");
      p5 = new Player("Tom");
      g1 = new Game(4, p1);
    });

    it("Two Games' id should be not equal", () => {
      const g2 = new Game(5, p2);
      assertNotEquals(g1.gameID, g2.gameID);
    });

    it("Should permit to join upto the given number of players", () => {
      g1.addPlayer(p2);
      g1.addPlayer(p3);
      g1.addPlayer(p4);
      assert(g1.isGameFull);
    });

    it("Should permit to join upto the given number of players", () => {
      g1.addPlayer(p2);
      g1.addPlayer(p3);
      g1.addPlayer(p4);
      assertThrows(() => {
        g1.addPlayer(p5);
      }, "Room is full!");
    });

    it("Should return current players", () => {
      g1.addPlayer(p2);
      g1.addPlayer(p3);
      g1.addPlayer(p4);

      const players = g1.players;
      assertEquals(players, [p1, p2, p3, p4]);
    });

    it("Should add a card to discarded card", () => {
      g1.addToDiscarded("eg_card");
      assertEquals(g1.discardedDeck, ["eg_card"]);
    });
  });

  describe("Testing the getPlayerData", () => {
    let p1, p2, p3, p4, p5, g1;

    beforeEach(() => {
      p1 = new Player("Alice");
      p2 = new Player("Bob");
      p3 = new Player("Adam");
      p4 = new Player("Eve");
      p5 = new Player("Tom");
      g1 = new Game(4, p1, ([...arr]) => arr.sort(() => 0));
    });

    it("Should give proper player data with 4 players", () => {
      const bobID = p2.playerID;
      g1.addPlayer(p2);
      g1.addPlayer(p3);
      g1.addPlayer(p4);

      assertEquals(g1.getPlayerInfo(bobID), {
        name: "Bob",
        wonder: "Gizah",
        coins: 3,
        warTokens: { positive: 0, negative: 0 },
        stage: [],
        stages: {
          stage1: {
            cost: [{ type: "stone", count: 2 }],
            powers: [{ type: "points", value: 3 }],
          },
          stage2: {
            cost: [{ type: "wood", count: 3 }],
            powers: [{ type: "points", value: 5 }],
          },
          stage3: {
            cost: [{ type: "stone", count: 4 }],
            powers: [{ type: "points", value: 7 }],
          },
        },
        buildings: {
          brown: [],
          grey: [],
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
          stages: {
            stage1: {
              cost: [{ type: "wood", count: 2 }],
              powers: [{ type: "points", value: 3 }],
            },
            stage2: {
              cost: [{ type: "stone", count: 2 }],
              powers: [{ type: "free_card_per_age" }],
            },
            stage3: {
              cost: [{ type: "ore", count: 2 }],
              powers: [{ type: "points", value: 7 }],
            },
          },
          buildings: {
            brown: [],
            grey: [],
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
          stages: {
            stage1: {
              cost: [{ type: "stone", count: 2 }],
              powers: [{ type: "points", value: 3 }],
            },
            stage2: {
              cost: [{ type: "wood", count: 2 }],
              powers: [{ type: "coin", value: 9 }],
            },
            stage3: {
              cost: [{ type: "papyrus", count: 2 }],
              powers: [{ type: "points", value: 7 }],
            },
          },
          buildings: {
            brown: [],
            grey: [],
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
            stages: {
              stage1: {
                cost: [{ type: "stone", count: 2 }],
                powers: [{ type: "points", value: 3 }],
              },
              stage2: {
                cost: [{ type: "wood", count: 2 }],
                powers: [{ type: "wild_resource" }],
              },
              stage3: {
                cost: [{ type: "glass", count: 2 }],
                powers: [{ type: "points", value: 7 }],
              },
            },
            buildings: {
              brown: [],
              grey: [],
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
        stages: {
          stage1: {
            cost: [{ type: "clay", count: 2 }],
            powers: [{ type: "points", value: 3 }],
          },
          stage2: {
            cost: [{ type: "wood", count: 3 }],
            powers: [{ type: "play_discarded_card" }],
          },
          stage3: {
            cost: [{ type: "textile", count: 2 }],
            powers: [{ type: "points", value: 7 }],
          },
        },
        buildings: {
          brown: [],
          grey: [],
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
          stages: {
            stage1: {
              cost: [{ type: "stone", count: 2 }],
              powers: [{ type: "points", value: 3 }],
            },
            stage2: {
              cost: [{ type: "wood", count: 2 }],
              powers: [{ type: "wild_resource" }],
            },
            stage3: {
              cost: [{ type: "glass", count: 2 }],
              powers: [{ type: "points", value: 7 }],
            },
          },
          buildings: {
            brown: [],
            grey: [],
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
          stages: {
            stage1: {
              cost: [{ type: "wood", count: 2 }],
              powers: [{ type: "points", value: 3 }],
            },
            stage2: {
              cost: [{ type: "stone", count: 2 }],
              powers: [{ type: "free_card_per_age" }],
            },
            stage3: {
              cost: [{ type: "ore", count: 2 }],
              powers: [{ type: "points", value: 7 }],
            },
          },
          buildings: {
            brown: [],
            grey: [],
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
            stages: {
              stage1: {
                cost: [{ type: "stone", count: 2 }],
                powers: [{ type: "points", value: 3 }],
              },
              stage2: {
                cost: [{ type: "wood", count: 2 }],
                powers: [{ type: "coin", value: 9 }],
              },
              stage3: {
                cost: [{ type: "papyrus", count: 2 }],
                powers: [{ type: "points", value: 7 }],
              },
            },
            buildings: {
              brown: [],
              grey: [],
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
            stages: {
              stage1: {
                cost: [{ type: "stone", count: 2 }],
                powers: [{ type: "points", value: 3 }],
              },
              stage2: {
                cost: [{ type: "wood", count: 3 }],
                powers: [{ type: "points", value: 5 }],
              },
              stage3: {
                cost: [{ type: "stone", count: 4 }],
                powers: [{ type: "points", value: 7 }],
              },
            },
            buildings: {
              brown: [],
              grey: [],
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
    let p1, p2, p3, p4, g1;

    beforeEach(() => {
      p1 = new Player("Alice");
      p2 = new Player("Bob");
      p3 = new Player("Adam");
      p4 = new Player("Eve");

      g1 = new Game(4, p1, ([...arr]) => arr.sort(() => 0));
    });

    it("Should give proper player hand data with 4 players", () => {
      const bobID = p2.playerID;

      g1.addPlayer(p2);
      g1.addPlayer(p3);
      g1.addPlayer(p4);

      assertEquals(getCardsName(g1.getPlayerHandData(bobID).hand), [
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
      const aliceID = p1.playerID;
      const bobID = p2.playerID;

      g1.addPlayer(p2);
      g1.addPlayer(p3);
      g1.addPlayer(p4);

      assertEquals(getCardsName(g1.getPlayerHandData(aliceID).hand), [
        "Lumber Yard",
        "Lumber Yard",
        "Stone Pit",
        "Clay Pool",
        "Ore Vein",
        "Ore Vein",
        "Excavation",
      ]);

      assertEquals(getCardsName(g1.getPlayerHandData(bobID).hand), [
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
    let p1, p2, p3, p4, g1;

    beforeEach(() => {
      p1 = new Player("Alice");
      p2 = new Player("Bob");
      p3 = new Player("Adam");
      p4 = new Player("Eve");

      g1 = new Game(4, p1);
    });

    it("Should remove a from the hand according to the card name", () => {
      const bobID = p2.playerID;

      g1.addPlayer(p2);
      g1.addPlayer(p3);
      g1.addPlayer(p4);

      const beforeUpdateBobsHand = g1.getPlayerHandData(bobID).hand;

      p2.updateHand(beforeUpdateBobsHand[0].name);
      const afterUpdateBobsHand = g1.getPlayerHandData(bobID).hand;

      beforeUpdateBobsHand.shift();
      assertEquals(beforeUpdateBobsHand, afterUpdateBobsHand);
    });
  });

  describe("Testing pass hands", () => {
    let p1, p2, p3, p4, g1;

    beforeEach(() => {
      p1 = new Player("Alice");
      p2 = new Player("Bob");
      p3 = new Player("Adam");
      p4 = new Player("Eve");

      g1 = new Game(4, p1, ([...arr]) => arr.sort(() => 0));
    });

    describe("Testing if the passing hand works", () => {
      it("Should change player's hand after passing", () => {
        const bobID = p2.playerID;

        g1.addPlayer(p2);
        g1.addPlayer(p3);
        g1.addPlayer(p4);

        const beforePassingBobsHand = g1.getPlayerHandData(bobID).hand;
        g1.passHands();
        const afterPassingBobsHand = g1.getPlayerHandData(bobID).hand;
        testIfHandsAreNotSame(beforePassingBobsHand, afterPassingBobsHand);
      });

      it("Should change all player's hand after passing", () => {
        const aliceID = p1.playerID;
        const bobID = p2.playerID;
        const adamID = p3.playerID;
        const eveID = p4.playerID;

        g1.addPlayer(p2);
        g1.addPlayer(p3);
        g1.addPlayer(p4);

        const beforePassingAlicesHand = g1.getPlayerHandData(aliceID).hand;
        const beforePassingBobsHand = g1.getPlayerHandData(bobID).hand;
        const beforePassingAdamsHand = g1.getPlayerHandData(adamID).hand;
        const beforePassingEvesHand = g1.getPlayerHandData(eveID).hand;
        g1.passHands();
        const afterPassingAlicesHand = g1.getPlayerHandData(aliceID).hand;
        const afterPassingBobsHand = g1.getPlayerHandData(bobID).hand;
        const afterPassingAdamsHand = g1.getPlayerHandData(adamID).hand;
        const afterPassingEvesHand = g1.getPlayerHandData(eveID).hand;

        testIfHandsAreNotSame(beforePassingAlicesHand, afterPassingAlicesHand);
        testIfHandsAreNotSame(beforePassingBobsHand, afterPassingBobsHand);
        testIfHandsAreNotSame(beforePassingAdamsHand, afterPassingAdamsHand);
        testIfHandsAreNotSame(beforePassingEvesHand, afterPassingEvesHand);
      });
    });

    describe("Testing if the passing hand works for age one, i.e. pass to left", () => {
      let p1, p2, p3, p4, g1;

      beforeEach(() => {
        p1 = new Player("Alice");
        p2 = new Player("Bob");
        p3 = new Player("Adam");
        p4 = new Player("Eve");

        g1 = new Game(4, p1, ([...arr]) => arr.sort(() => 0));
      });

      it("Should pass player's hand to the left neighbour", () => {
        const aliceID = p1.playerID;
        const bobID = p2.playerID;

        g1.addPlayer(p2);
        g1.addPlayer(p3);
        g1.addPlayer(p4);

        const beforePassingBobsHand = g1.getPlayerHandData(bobID).hand;
        g1.passHands();
        const afterPassingAlicesHand = g1.getPlayerHandData(aliceID).hand;

        assertEquals(beforePassingBobsHand, afterPassingAlicesHand);
      });

      it("Should pass all player's hand to their left neighbour as it's age 1", () => {
        const aliceID = p1.playerID;
        const bobID = p2.playerID;
        const adamID = p3.playerID;
        const eveID = p4.playerID;

        g1.addPlayer(p2);
        g1.addPlayer(p3);
        g1.addPlayer(p4);

        const beforePassingAlicesHand = g1.getPlayerHandData(aliceID).hand;
        const beforePassingBobsHand = g1.getPlayerHandData(bobID).hand;
        const beforePassingAdamsHand = g1.getPlayerHandData(adamID).hand;
        const beforePassingEvesHand = g1.getPlayerHandData(eveID).hand;
        g1.passHands();
        const afterPassingAlicesHand = g1.getPlayerHandData(aliceID).hand;
        const afterPassingBobsHand = g1.getPlayerHandData(bobID).hand;
        const afterPassingAdamsHand = g1.getPlayerHandData(adamID).hand;
        const afterPassingEvesHand = g1.getPlayerHandData(eveID).hand;

        testIfHandsAreSame(beforePassingBobsHand, afterPassingAlicesHand);
        testIfHandsAreSame(beforePassingAdamsHand, afterPassingBobsHand);
        testIfHandsAreSame(beforePassingEvesHand, afterPassingAdamsHand);
        testIfHandsAreSame(beforePassingAlicesHand, afterPassingEvesHand);
      });
    });

    describe("Testing if the passing hand works for age two, i.e. pass to right", () => {
      it("Should pass player's hand to the left neighbour", () => {
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

        const beforePassingAlicesHand = g.getPlayerHandData(aliceID).hand;
        g.passHands();
        const afterPassingBobsHand = g.getPlayerHandData(bobID).hand;

        testIfHandsAreSame(beforePassingAlicesHand, afterPassingBobsHand);
      });

      it("Should pass all player's hand to their right neighbour as it's age 1", () => {
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

        const beforePassingAlicesHand = g.getPlayerHandData(aliceID).hand;
        const beforePassingBobsHand = g.getPlayerHandData(bobID).hand;
        const beforePassingAdamsHand = g.getPlayerHandData(adamID).hand;
        const beforePassingEvesHand = g.getPlayerHandData(eveID).hand;
        g.passHands();
        const afterPassingAlicesHand = g.getPlayerHandData(aliceID).hand;
        const afterPassingBobsHand = g.getPlayerHandData(bobID).hand;
        const afterPassingAdamsHand = g.getPlayerHandData(adamID).hand;
        const afterPassingEvesHand = g.getPlayerHandData(eveID).hand;

        testIfHandsAreSame(beforePassingBobsHand, afterPassingAdamsHand);
        testIfHandsAreSame(beforePassingAdamsHand, afterPassingEvesHand);
        testIfHandsAreSame(beforePassingEvesHand, afterPassingAlicesHand);
        testIfHandsAreSame(beforePassingAlicesHand, afterPassingBobsHand);
      });
    });
  });
});

describe("testing isLastRound", () => {
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

  it("isLastRound should return false for 2nd Round", () => {
    g.round = 2;
    assertFalse(g.isLastRound());
  });

  it("isLastRound should return true for 6th Round", () => {
    g.round = 6;
    assert(g.isLastRound());
  });
});

describe("testing resetRound", () => {
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

  it("resetRound should reset round to 0", () => {
    g.round = 6;
    g.resetRound();
    assertEquals(g.round, 0);
  });
});

describe("testing nextRound", () => {
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

  it("nextRound should return next round", () => {
    g.round = 4;
    g.nextRound();
    assertEquals(g.round, 5);
  });
});

describe("Testing didAllPlayersSelected", () => {
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

  it("didAllPlayersSelected should return false because not all players are selected action", () => {
    p1.status = "waiting";
    p2.status = "waiting";
    p3.status = "waiting";
    p4.status = "selected";

    assertFalse(g.didAllPlayerSelectCard());
  });

  it("didAllPlayersSelected should return true because all players are selected action", () => {
    p1.status = "selected";
    p2.status = "selected";
    p3.status = "selected";
    p4.status = "selected";

    assert(g.didAllPlayerSelectCard());
  });
});

describe("Testing gameStatus", () => {
  let p1, p2, p3, p4, g;
  beforeEach(() => {
    p1 = new Player("Alice");
    p2 = new Player("Bob");
    p3 = new Player("Adam");
    p4 = new Player("Eve");

    g = new Game(4, p1, ([...arr]) => arr.sort(() => 0));
    g.addPlayer(p2);
  });

  it("should return gameData with status as waiting if there are not much players", () => {
    assertEquals(g.gameStatus, "waiting");
  });

  it("should return gameData with status as matched if there is a match", () => {
    g.addPlayer(p3);
    g.addPlayer(p4);
    assertEquals(g.gameStatus, "matched");
  });
});

describe("Testing getPlayersStatus", () => {
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
    p1.playerID = "123";
  });

  it("should return gameStatus of current and neighbour players as waiting", () => {
    assertEquals(g.getPlayersStatus("123"), {
      leftPlayerStatus: "waiting",
      rightPlayerStatus: "waiting",
      status: "waiting",
    });
  });

  it("should return gameStatus of current and neighbour players as selected", () => {
    p1.status = "selected";
    p2.status = "selected";
    p3.status = "selected";
    p4.status = "selected";
    assertEquals(g.getPlayersStatus("123"), {
      leftPlayerStatus: "selected",
      rightPlayerStatus: "selected",
      status: "selected",
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

    it("Should return war conflict points according to age 1", () => {
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

      g.militaryConflicts();

      assertEquals(p1.warTokensObj, { positive: 1, negative: 0 });
      assertEquals(p2.warTokensObj, { positive: 1, negative: 0 });
      assertEquals(p3.warTokensObj, { positive: 0, negative: -2 });
      assertEquals(p4.warTokensObj, { positive: 1, negative: -1 });
    });

    it("Should return war conflict points according to age 2", () => {
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

      g.currentAge = 2;
      g.militaryConflicts();

      assertEquals(p1.warTokensObj, { positive: 3, negative: 0 });
      assertEquals(p2.warTokensObj, { positive: 3, negative: 0 });
      assertEquals(p3.warTokensObj, { positive: 0, negative: -2 });
      assertEquals(p4.warTokensObj, { positive: 3, negative: -1 });
    });

    it("Should return war conflict points according to age 3", () => {
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

      g.currentAge = 3;
      g.militaryConflicts();

      assertEquals(p1.warTokensObj, { positive: 5, negative: 0 });
      assertEquals(p2.warTokensObj, { positive: 5, negative: 0 });
      assertEquals(p3.warTokensObj, { positive: 0, negative: -2 });
      assertEquals(p4.warTokensObj, { positive: 5, negative: -1 });
    });

    it("Should return war conflict points according to progressive age", () => {
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

      g.militaryConflicts();
      g.currentAge = 2;

      [p1, p2, p3, p4].forEach((p) => p.toggleDoneWithConflict());

      g.militaryConflicts();
      g.currentAge = 3;

      [p1, p2, p3, p4].forEach((p) => p.toggleDoneWithConflict());

      g.militaryConflicts();

      [p1, p2, p3, p4].forEach((p) => p.toggleDoneWithConflict());

      assertEquals(p1.warTokensObj, { positive: 9, negative: 0 });
      assertEquals(p2.warTokensObj, { positive: 9, negative: 0 });
      assertEquals(p3.warTokensObj, { positive: 0, negative: -6 });
      assertEquals(p4.warTokensObj, { positive: 9, negative: -3 });
    });

    it("Should return war conflict points according to all age and progressive game", () => {
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

      g.militaryConflicts();
      g.currentAge = 2;

      [p1, p2, p3, p4].forEach((p) => p.toggleDoneWithConflict());

      p1.wonder.addMilitaryStrength({
        produces: [{ type: "shield", count: 3 }],
      });
      p1.wonder.addMilitaryStrength({
        produces: [{ type: "shield", count: 2 }],
      });
      p3.wonder.addMilitaryStrength({
        produces: [{ type: "shield", count: 2 }],
      });

      g.militaryConflicts();
      g.currentAge = 3;

      [p1, p2, p3, p4].forEach((p) => p.toggleDoneWithConflict());

      p1.wonder.addMilitaryStrength({
        produces: [{ type: "shield", count: 3 }],
      });
      p2.wonder.addMilitaryStrength({
        produces: [{ type: "shield", count: 3 }],
      });
      p2.wonder.addMilitaryStrength({
        produces: [{ type: "shield", count: 3 }],
      });

      g.militaryConflicts();

      assertEquals(p1.warTokensObj, { positive: 17, negative: 0 });
      assertEquals(p2.warTokensObj, { positive: 9, negative: -2 });
      assertEquals(p3.warTokensObj, { positive: 0, negative: -4 });
      assertEquals(p4.warTokensObj, { positive: 1, negative: -3 });
    });
  });
});
