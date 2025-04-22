import { assertEquals, assertNotEquals } from "assert";
import { describe, it } from "test/bdd";
import { Player } from "../src/models/player.js";
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
    const wonder = new Wonder({
      img: "ephesosA.jpeg",
      name: "Ephesos",
      resource: "papyrus",
      side: "A",
      stages: {
        stage1: {
          cost: [{ type: "stone", count: 2 }],
          powers: [{ type: "coins", value: 4 }],
        },
        stage2: {
          cost: [{ type: "wood", count: 2 }],
          powers: [{ type: "points", value: 2 }],
        },
        stage3: {
          cost: [{ type: "papyrus", count: 2 }],
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

    p1.wonder = wonder;
    p2.wonder = wonder;
    p3.wonder = wonder;
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
          name: "Scriptorium",
          age: 1,
          color: "green",
          min_players: 4,
          cost: [{ type: "papyrus", count: 1 }],
          produces: [{ type: "tablet", count: 1 }],
          effect: null,
          chain_from: null,
          chain_to: ["Library"],
        }),
        true,
      );
    });

    it("should return true from coin", () => {
      assertEquals(
        p1.canBuild({
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
        }),
        true,
      );
    });

    it("should return false from coin", () => {
      assertEquals(
        p1.canBuild({
          name: "Excavation",
          age: 1,
          color: "brown",
          min_players: 4,
          cost: [{ type: "coin", count: 4 }],
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
        }),
        false,
      );
    });

    it("should return true from neighbour", () => {
      assertEquals(
        p1.canBuild({
          name: "Baths",
          age: 1,
          color: "blue",
          min_players: 3,
          cost: [{ type: "stone", count: 1 }],
          produces: [{ type: "points", count: 3 }],
          chain_from: null,
          chain_to: ["Aqueduct"],
          type: "civil",
        }),
        true,
      );
    });

    it("should return false", () => {
      assertEquals(
        p1.canBuild({
          name: "Apothecary",
          age: 1,
          color: "green",
          min_players: 5,
          cost: [{ type: "textile", count: 1 }],
          produces: [{ type: "compass", count: 1 }],
          effect: null,
          chain_from: null,
          chain_to: ["Stables", "Dispensary"],
        }),
        false,
      );
    });
  });

  it("Testing get war conflicts tokens", () => {
    const p = new Player("Alice");

    assertEquals(p.warTokensObj, { negative: 0, positive: 0 });
    p.warTokens = [3, -3];
    assertEquals(p.warTokensObj, { negative: -3, positive: 3 });
  });

  it("should add coins if the card has coin benfits", () => {
    const p = new Player("Alice");
    p.addBenfits({
      produces: [{ type: "coin", count: 5 }, { type: "points" }],
    });
    assertEquals(p.coins, 5);
  });

  it("should add coins if card is discarded", () => {
    const p = new Player("Akash");
    const discardCards = [];

    p.updateHand = (card) => {
      discardCards.push(card);
    };
    p.discardCard("Heaven");

    assertEquals(p.coins, 3);
    assertEquals(...discardCards, "Heaven");
  });
  it("testing otherPlayerStatus", () => {
    const p1 = new Player("Alice");
    const p2 = new Player("Bob");
    const p3 = new Player("Clare");
    const p4 = new Player("Akash");
    p1.leftPlayer = p2;
    p4.status = "waiting";

    p2.leftPlayer = p3;
    p3.leftPlayer = p4;
    p1.rightPlayer = p4;

    assertEquals(...p1.getOtherPlayersStatus(), "waiting");
  });
});
