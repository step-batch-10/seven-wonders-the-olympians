import { assert, assertEquals, assertNotEquals } from "assert";
import { beforeEach, describe, it } from "test/bdd";
import { Player } from "../src/models/player.js";
import { Game } from "../src/models/game.js";
import { Wonder } from "../src/models/wonder.js";

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
          color: "grey",
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

  describe("testing addActionDetails", () => {
    it("should return the action details for the card that is free", () => {
      const p = new Player("Alice");
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
      ];

      p.assignHand(hand);
      const [refinedCard1] = p.getHandData();

      assertEquals(refinedCard1.name, "Lumber Yard");
      assertEquals(
        refinedCard1.actionDetails.buildDetails,
        "no resources required",
      );
    });

    it("should return the action details for the card that has cost type coin and player has enough coins", () => {
      const p = new Player("Alice");
      const hand = [
        {
          name: "Excavation",
          age: 1,
          color: "brown",
          min_players: 4,
          cost: [{ type: "coin", count: 1 }],
          produces: [
            {
              type: "choice",
              options: ["stone", "clay"],
              count: 1,
            },
          ],
          effect: null,
          chain_from: null,
          chain_to: [],
        },
      ];

      p.assignHand(hand);
      p.addCoins(3);
      const [refinedCard1] = p.getHandData();

      assertEquals(refinedCard1.name, "Excavation");
      assertEquals(refinedCard1.actionDetails.buildDetails, "pay bank");
    });

    it.ignore(
      "should return the action details for the card when there is no possibility to build",
      () => {
        const p1 = new Player("Alice");
        const p2 = new Player("Bob");
        const p3 = new Player("Clare");
        const p4 = new Player("Akash");
        p1.leftPlayer = p2;
        // p4.status = "waiting";

        p2.leftPlayer = p3;
        p3.leftPlayer = p4;
        p1.rightPlayer = p4;
        const hand = [
          {
            name: "Guard Tower",
            age: 1,
            color: "red",
            min_players: 3,
            cost: [{ type: "clay", count: 1 }],
            produces: [{ type: "shield", count: 1 }],
            effect: null,
            chain_from: null,
            chain_to: [],
          },
        ];
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

        p1.wonder = wonder;
        // p1.wonder.resources = { type: "papyrus", count: 1, choices: [] };
        p1.assignHand(hand);
        const [refinedCard1] = p1.getHandData();

        assertEquals(refinedCard1.name, "Guard Tower");
        assertEquals(refinedCard1.buildDetails, {});
      },
    );
  });

  it.ignore(
    "should return the action details for the card where they have enough resources",
    () => {
      const p = new Player("Alice");
      const hand = [
        {
          name: "Scriptorium",
          age: 1,
          color: "green",
          min_players: 3,
          cost: [{ type: "papyrus", count: 1 }],
          produces: [{ type: "tablet", count: 1 }],
          effect: null,
          chain_from: null,
          chain_to: ["Library"],
        },
      ];
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
      p.assignHand(hand);
      const [refinedCard1] = p.getHandData();

      assert(refinedCard1.canBuild);
      assert(refinedCard1.canDiscard);
      assertEquals(refinedCard1.name, "Guard Tower");
      assertEquals(refinedCard1.buildDetails, {});
    },
  );
});

it("should return the action details for the card where they have enough resources", () => {
  const p = new Player("Alice");
  const hand = [
    {
      name: "Scriptorium",
      age: 1,
      color: "green",
      min_players: 3,
      cost: [{ type: "papyrus", count: 1 }],
      produces: [{ type: "tablet", count: 1 }],
      effect: null,
      chain_from: null,
      chain_to: ["Library"],
    },
  ];
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
  p.assignHand(hand);
  const [refinedCard1] = p.getHandData();

  assertEquals(refinedCard1.name, "Scriptorium");
  assertEquals(refinedCard1.actionDetails.buildDetails, "had enough resources");
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
        msg: "You won against Eve <---",
      },
      rightConflict: {
        opponentName: "Bob",
        militaryShields: 3,
        wonderName: "Gizah",
        result: "draw",
        tokens: 0,
        msg: "You draw against Bob --->",
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
        msg: "You draw against Alice <---",
      },
      rightConflict: {
        opponentName: "Adam",
        militaryShields: 0,
        wonderName: "Ephesos",
        result: "won",
        tokens: 3,
        msg: "You won against Adam --->",
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
        msg: "You lose against Bob <---",
      },
      rightConflict: {
        opponentName: "Eve",
        militaryShields: 2,
        wonderName: "Alexandria",
        result: "lose",
        tokens: -1,
        msg: "You lose against Eve --->",
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
        msg: "You won against Adam <---",
      },
      rightConflict: {
        opponentName: "Alice",
        militaryShields: 3,
        wonderName: "Olympia",
        result: "lose",
        tokens: -1,
        msg: "You lose against Alice --->",
      },
    });
  });
});
