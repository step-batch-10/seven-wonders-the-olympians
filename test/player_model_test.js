import {assertEquals, assertNotEquals} from "assert";
import {beforeEach, describe, it} from "test/bdd";
import {Player} from "../src/models/player.js";
import {Game} from "../src/models/game.js";
import {Wonder} from "../src/models/wonder.js";
import _ from "lodash";

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
            resources: [{type: "stone", count: 2}],
            powers: [{type: "coins", value: 4}],
          },
          stage2: {
            resources: [{type: "wood", count: 2}],
            powers: [{type: "points", value: 2}],
          },
          stage3: {
            resources: [{type: "papyrus", count: 2}],
            powers: [
              {type: "coins", value: 4},
              {type: "points", value: 3},
            ],
          },
        },
      });

      p.wonder = wonder;

      assertEquals(p.haveResources([{type: "papyrus", count: 1}]), []);
      assertEquals(p.haveResources([{type: "clay", count: 1}]), [
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
            resources: [{type: "stone", count: 2}],
            powers: [{type: "coins", value: 4}],
          },
          stage2: {
            resources: [{type: "wood", count: 2}],
            powers: [{type: "points", value: 2}],
          },
          stage3: {
            resources: [{type: "papyrus", count: 2}],
            powers: [
              {type: "coins", value: 4},
              {type: "points", value: 3},
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
          produces: [{type: "wood", count: 1}],
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
          produces: [{type: "stone", count: 1}],
          effect: null,
          chain_from: null,
          chain_to: [],
        },
      ];

      p.wonder = wonder;
      p.assignHand(hand);
      p.buildCard("Stone Pit");
      p.buildCard("Lumber Yard");

      assertEquals(p.haveResources([{type: "wood", count: 1}]), []);
      assertEquals(p.haveResources([{type: "clay", count: 1}]), [
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
            resources: [{type: "stone", count: 2}],
            powers: [{type: "coins", value: 4}],
          },
          stage2: {
            resources: [{type: "wood", count: 2}],
            powers: [{type: "points", value: 2}],
          },
          stage3: {
            resources: [{type: "papyrus", count: 2}],
            powers: [
              {type: "coins", value: 4},
              {type: "points", value: 3},
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
          cost: [{type: "coin", count: 1}],
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

      assertEquals(p.haveResources([{type: "wood", count: 1}]), []);
      assertEquals(p.haveResources([{type: "clay", count: 1}]), []);
      assertEquals(p.haveResources([{type: "ore", count: 1}]), [
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
            resources: [{type: "stone", count: 2}],
            powers: [{type: "coins", value: 4}],
          },
          stage2: {
            resources: [{type: "wood", count: 2}],
            powers: [{type: "points", value: 2}],
          },
          stage3: {
            resources: [{type: "papyrus", count: 2}],
            powers: [
              {type: "coins", value: 4},
              {type: "points", value: 3},
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
          produces: [{type: "ore", count: 1}],
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
          produces: [{type: "papyrus", count: 1}],
          effect: null,
          chain_from: null,
          chain_to: [],
        },
        {
          name: "Tree Farm",
          age: 1,
          color: "brown",
          min_players: 6,
          cost: [{type: "coin", count: 1}],
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

      assertEquals(p.haveResources([{type: "wood", count: 1}]), []);
      assertEquals(p.haveResources([{type: "clay", count: 1}]), []);
      assertEquals(p.haveResources([{type: "ore", count: 1}]), []);
      assertEquals(p.haveResources([{type: "textile", count: 1}]), [
        {
          type: "textile",
          count: 1,
        },
      ]);
    });
  });

  describe("testing addActionDetails", () => {
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

    it("should return the action details for the card that is free", () => {
      const [refinedCard1] = p1.getHandData();

      assertEquals(
        refinedCard1.actionDetails.buildDetails,
        "no resources required",
      );
    });

    it("should return empty action details if player already have built the card", () => {
      p1.wonder.buildingsSet.add("Lumber Yard");
      const [refinedCard1] = p1.getHandData();

      assertEquals(refinedCard1.actionDetails, {});
    });

    it("should return the action details for the card that has cost type coin and player has enough coins", () => {
      const hand = [
        {
          name: "Excavation",
          age: 1,
          color: "brown",
          min_players: 4,
          cost: [{type: "coin", count: 1}],
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
      p1.assignHand(hand);
      p1.addCoins(3);
      const [refinedCard1] = p1.getHandData();

      assertEquals(refinedCard1.name, "Excavation");
      assertEquals(refinedCard1.actionDetails.buildDetails, "pay bank");
    });
    it("should return the action details for the card when it's not posssible to build", () => {
      const p1 = new Player("Alice");
      const p2 = new Player("Bob");
      const p3 = new Player("Clare");
      const p4 = new Player("Akash");
      p1.leftPlayer = p2;

      p2.leftPlayer = p3;
      p3.leftPlayer = p4;
      p1.rightPlayer = p4;
      const hand = [
        {
          name: "Guard Tower",
          age: 1,
          color: "red",
          min_players: 3,
          cost: [{type: "clay", count: 1}],
          produces: [{type: "shield", count: 1}],
          effect: null,
          chain_from: null,
          chain_to: [],
        },
      ];
      const wonder1 = new Wonder({
        img: "ephesosA.jpeg",
        name: "Ephesos",
        resource: "papyrus",
        side: "A",
        stages: {
          stage1: {
            resources: [{type: "stone", count: 2}],
            powers: [{type: "coins", value: 4}],
          },
          stage2: {
            resources: [{type: "wood", count: 2}],
            powers: [{type: "points", value: 2}],
          },
          stage3: {
            resources: [{type: "papyrus", count: 2}],
            powers: [
              {type: "coins", value: 4},
              {type: "points", value: 3},
            ],
          },
        },
      });

      const wonder2 = new Wonder({
        img: "babylonA.jpeg",
        name: "Babylon",
        resource: "clay",
        side: "A",
        stages: {
          stage1: {
            cost: [{type: "clay", count: 2}],
            powers: [{type: "points", value: 3}],
          },
          stage2: {
            cost: [{type: "wood", count: 3}],
            powers: [{type: "extra_scientific_symbol"}],
          },
          stage3: {
            cost: [{type: "clay", count: 4}],
            powers: [{type: "points", value: 7}],
          },
        },
      });

      const wonder3 = new Wonder({
        img: "rhodosA.jpeg",
        name: "Rhodos",
        resource: "ore",
        side: "A",
        stages: {
          stage1: {
            cost: [{type: "wood", count: 2}],
            powers: [{type: "points", value: 3}],
          },
          stage2: {
            cost: [{type: "clay", count: 3}],
            powers: [{type: "military", value: 2}],
          },
          stage3: {
            cost: [{type: "ore", count: 4}],
            powers: [{type: "points", value: 7}],
          },
        },
      });

      const wonder4 = new Wonder({
        img: "halikarnassosA.jpeg",
        name: "Halikarnassos",
        resource: "textile",
        side: "A",
        stages: {
          stage1: {
            cost: [{type: "clay", count: 2}],
            powers: [{type: "points", value: 3}],
          },
          stage2: {
            cost: [{type: "wood", count: 3}],
            powers: [{type: "play_discarded_card"}],
          },
          stage3: {
            cost: [{type: "textile", count: 2}],
            powers: [{type: "points", value: 7}],
          },
        },
      });

      p1.wonder = wonder1;
      p2.wonder = wonder2;
      p3.wonder = wonder3;
      p4.wonder = wonder4;
      p1.assignHand(hand);
      p1.addCoins(3);
      const [refinedCard1] = p1.getHandData();

      assertEquals(refinedCard1.name, "Guard Tower");
      assertEquals(refinedCard1.actionDetails, {
        tradeDetails: {
          leftPlayer: [
            {
              count: 1,
              rate: 2,
              type: "clay",
            },
          ],
          rightPlayer: [
            {
              count: 0,
              rate: 2,
              type: "clay",
            },
          ],
        },
      });
    });

    it("should return the action details for the card where they have enough resources", () => {
      const p = new Player("Alice");
      const hand = [
        {
          name: "Scriptorium",
          age: 1,
          color: "green",
          min_players: 3,
          cost: [{type: "papyrus", count: 1}],
          produces: [{type: "tablet", count: 1}],
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
            resources: [{type: "stone", count: 2}],
            powers: [{type: "coins", value: 4}],
          },
          stage2: {
            resources: [{type: "wood", count: 2}],
            powers: [{type: "points", value: 2}],
          },
          stage3: {
            resources: [{type: "papyrus", count: 2}],
            powers: [
              {type: "coins", value: 4},
              {type: "points", value: 3},
            ],
          },
        },
      });

      p.wonder = wonder;
      p.assignHand(hand);
      const [refinedCard1] = p.getHandData();

      assertEquals(refinedCard1.name, "Scriptorium");
      assertEquals(
        refinedCard1.actionDetails.buildDetails,
        "had enough resources",
      );
    });

    it("should return true where player has the future free card", () => {
      const p = new Player("Alice");
      const hand1 = [
        {
          name: "Scriptorium",
          age: 1,
          color: "green",
          min_players: 3,
          cost: [{type: "papyrus", count: 1}],
          produces: [{type: "tablet", count: 1}],
          effect: null,
          chain_from: null,
          chain_to: ["Library"],
        },
      ];
      const hand2 = [
        {
          name: "Library",
          age: 2,
          color: "green",
          min_players: 3,
          cost: [
            {type: "stone", count: 2},
            {type: "textile", count: 1},
          ],
          produces: [{type: "tablet", count: 1}],
          chain_from: "Scriptorium",
          chain_to: ["Academy"],
          type: "science",
        },
      ];
      const wonder = new Wonder({
        img: "ephesosA.jpeg",
        name: "Ephesos",
        resource: "papyrus",
        side: "A",
        stages: {
          stage1: {
            resources: [{type: "stone", count: 2}],
            powers: [{type: "coins", value: 4}],
          },
          stage2: {
            resources: [{type: "wood", count: 2}],
            powers: [{type: "points", value: 2}],
          },
          stage3: {
            resources: [{type: "papyrus", count: 2}],
            powers: [
              {type: "coins", value: 4},
              {type: "points", value: 3},
            ],
          },
        },
      });

      p.wonder = wonder;
      p.assignHand(hand1);
      p.buildCard("Scriptorium");
      p.assignHand(hand2);

      const actual = _.keyBy(p.getHandData(), "name")["Library"];

      assertEquals(actual.actionDetails.buildDetails, "future free card");
    });

    it("should return actionDetails having no buildDetails", () => {
      const p1 = new Player("Alice");
      const p2 = new Player("Bob");
      const p3 = new Player("Clare");
      const p4 = new Player("Akash");

      p1.leftPlayer = p2;
      p2.leftPlayer = p3;
      p3.leftPlayer = p4;
      p1.rightPlayer = p4;

      const wonder1 = new Wonder({
        img: "ephesosA.jpeg",
        name: "Ephesos",
        resource: "papyrus",
        side: "A",
        stages: {
          stage1: {
            resources: [{type: "stone", count: 2}],
            powers: [{type: "coins", value: 4}],
          },
          stage2: {
            resources: [{type: "wood", count: 2}],
            powers: [{type: "points", value: 2}],
          },
          stage3: {
            resources: [{type: "papyrus", count: 2}],
            powers: [
              {type: "coins", value: 4},
              {type: "points", value: 3},
            ],
          },
        },
      });

      const wonder2 = new Wonder({
        img: "babylonA.jpeg",
        name: "Babylon",
        resource: "clay",
        side: "A",
        stages: {
          stage1: {
            cost: [{type: "clay", count: 2}],
            powers: [{type: "points", value: 3}],
          },
          stage2: {
            cost: [{type: "wood", count: 3}],
            powers: [{type: "extra_scientific_symbol"}],
          },
          stage3: {
            cost: [{type: "clay", count: 4}],
            powers: [{type: "points", value: 7}],
          },
        },
      });

      const wonder3 = new Wonder({
        img: "rhodosA.jpeg",
        name: "Rhodos",
        resource: "ore",
        side: "A",
        stages: {
          stage1: {
            cost: [{type: "wood", count: 2}],
            powers: [{type: "points", value: 3}],
          },
          stage2: {
            cost: [{type: "clay", count: 3}],
            powers: [{type: "military", value: 2}],
          },
          stage3: {
            cost: [{type: "ore", count: 4}],
            powers: [{type: "points", value: 7}],
          },
        },
      });

      const wonder4 = new Wonder({
        img: "halikarnassosA.jpeg",
        name: "Halikarnassos",
        resource: "textile",
        side: "A",
        stages: {
          stage1: {
            cost: [{type: "clay", count: 2}],
            powers: [{type: "points", value: 3}],
          },
          stage2: {
            cost: [{type: "wood", count: 3}],
            powers: [{type: "play_discarded_card"}],
          },
          stage3: {
            cost: [{type: "textile", count: 2}],
            powers: [{type: "points", value: 7}],
          },
        },
      });

      p1.wonder = wonder1;
      p2.wonder = wonder2;
      p3.wonder = wonder3;
      p4.wonder = wonder4;

      const hand = [
        {
          name: "Sawmill",
          age: 2,
          color: "brown",
          min_players: 3,
          cost: [{type: "coin", count: 1}],
          produces: [{type: "wood", count: 2}],
          chain_from: null,
          chain_to: [],
          type: "raw_material",
        },
      ];

      p1.assignHand(hand);
      const [handData] = p1.getHandData();

      assertEquals(handData.actionDetails, {});
    });


    describe("testing trading cards", () => {
      const wonder1 = {
        img: "olympiaA.jpeg",
        name: "Olympia",
        resource: "wood",
        side: "A",
        stages: {
          stage1: {
            cost: [{"type": "wood", "count": 2}],
            powers: [{"type": "points", "value": 3}]
          },
          stage2: {
            cost: [{"type": "stone", "count": 2}],
            powers: [{"type": "free_card_per_age"}]
          },
          stage3: {
            cost: [{"type": "ore", "count": 2}],
            powers: [{"type": "points", "value": 7}]
          }
        }
      };

      const wonder2 = {
        img: "ephesosA.jpeg",
        name: "Ephesos",
        resource: "papyrus",
        side: "A",
        stages: {
          stage1: {
            resources: [{type: "stone", count: 2}],
            powers: [{type: "coins", value: 4}],
          },
          stage2: {
            resources: [{type: "wood", count: 2}],
            powers: [{type: "points", value: 2}],
          },
          stage3: {
            resources: [{type: "papyrus", count: 2}],
            powers: [
              {type: "coins", value: 4},
              {type: "points", value: 3},
            ],
          },
        },
      };

      const wonder3 = {
        img: "rhodosA.jpeg",
        name: "Rhodos",
        resource: "ore",
        side: "A",
        stages: {
          stage1: {
            cost: [{type: "wood", count: 2}],
            powers: [{type: "points", value: 3}],
          },
          stage2: {
            cost: [{type: "clay", count: 3}],
            powers: [{type: "military", value: 2}],
          },
          stage3: {
            cost: [{type: "ore", count: 4}],
            powers: [{type: "points", value: 7}],
          },
        },
      };

      const hand1 = [
        {
          name: "West Trading Post",
          age: 1,
          color: "yellow",
          min_players: 3,
          cost: [],
          produces: [],
          effect: [
            {
              "type": "resource",
              "effect_type": "buy",
              "cost": [{"type": "coin", "count": 1}],
              "applies_to": ["left_neighbour"],
              "options": ["clay", "stone", "wood", "ore"]
            }
          ],
          chain_from: null,
          chain_to: []
        },
        {
          "name": "East Trading Post",
          "age": 1,
          "color": "yellow",
          "min_players": 7,
          "cost": [],
          "produces": [],
          "effect": [
            {
              "type": "resource",
              "effect_type": "buy",
              "cost": [{"type": "coin", "count": 1}],
              "applies_to": ["right_neighbour"],
              "options": ["clay", "stone", "wood", "ore"]
            }
          ],
          "chain_from": null,
          "chain_to": []
        },
        {
          "name": "Marketplace",
          "age": 1,
          "color": "yellow",
          "min_players": 3,
          "cost": [],
          "produces": [],
          "effect": [
            {
              "type": "resource",
              "effect_type": "buy",
              "cost": [{"type": "coin", "count": 1}],
              "applies_to": ["left_neighbour", "right_neighbour"],
              "options": ["glass", "papyrus", "textile"]
            }
          ],
          "chain_from": null,
          "chain_to": []
        }
      ];

      const hand2 = [
        {
          name: "Stone Pit",
          age: 1,
          color: "brown",
          min_players: 3,
          cost: [],
          produces: [{"type": "stone", "count": 1}],
          effect: null,
          chain_from: null,
          chain_to: []
        },
        {
          "name": "Loom",
          "age": 1,
          "color": "grey",
          "min_players": 3,
          "cost": [],
          "produces": [{"type": "textile", "count": 1}],
          "effect": null,
          "chain_from": null,
          "chain_to": []
        }
      ];

      const hand3 = [
        {
          name: "Aqueduct",
          age: 2,
          color: "blue",
          min_players: 3,
          cost: [{"type": "stone", "count": 3}],
          produces: [{"type": "points", "count": 5}],
          chain_from: "Baths",
          chain_to: [],
          type: "civil"
        }];
      const hand4 = [
        {
          name: "Study",
          age: 3,
          color: "green",
          min_players: 5,
          cost: [
            {type: "wood", "count": 1},
            {type: "papyrus", "count": 1},
            {type: "textile", "count": 1}
          ],
          produces: [{"type": "gear", "count": 1}],
          chain_from: "School",
          chain_to: [],
          type: "science"
        }
      ];

      let p1;
      let p2;
      let p3;

      beforeEach(() => {
        p1 = new Player("Alice");
        p2 = new Player("Bob");
        p3 = new Player("Clare");

        p1.leftPlayer = p2;
        p1.rightPlayer = p3;

        p1.wonder = new Wonder(wonder1);
        p2.wonder = new Wonder(wonder2);
        p3.wonder = new Wonder(wonder3);

        p1.assignHand([...hand2]);
        p1.buildCard("Stone Pit");

        p2.assignHand([...hand2]);
        p2.buildCard("Stone Pit");
        p2.assignHand([...hand2]);
        p2.buildCard("Stone Pit");

        p3.assignHand([...hand2]);
        p3.buildCard("Stone Pit");
        p3.assignHand([...hand2]);
        p3.buildCard("Stone Pit");
        p3.assignHand([...hand2]);
        p3.buildCard("Loom");
      });

      it("should return actionDetails withoout discounts", () => {
        p1.addCoins(2);
        p1.assignHand([...hand3]);

        const [handData] = p1.getHandData();
        const expected = {};

        assertEquals(handData.actionDetails, expected);
      });

      it("should return actionDetails for having West trade post", () => {
        p1.assignHand([...hand1]);
        p1.buildCard("West Trading Post");
        p1.addCoins(2);
        p1.assignHand([...hand3]);

        const [handData] = p1.getHandData();
        const expected = {
          tradeDetails: {
            leftPlayer: [
              {
                count: 2,
                rate: 1,
                type: "stone",
              },
            ],
            rightPlayer: [
              {
                count: 2,
                rate: 2,
                type: "stone",
              },
            ],
          },
        };

        assertEquals(handData.actionDetails, expected);
      });

      it("should return actionDetails for having East trade post", () => {
        p1.assignHand([...hand1]);
        p1.buildCard("East Trading Post");
        p1.addCoins(2);
        p1.assignHand([...hand3]);

        const [handData] = p1.getHandData();
        const expected = {
          tradeDetails: {
            leftPlayer: [
              {
                count: 2,
                rate: 2,
                type: "stone",
              },
            ],
            rightPlayer: [
              {
                count: 2,
                rate: 1,
                type: "stone",
              },
            ],
          },
        };

        assertEquals(handData.actionDetails, expected);
      });

      it("should return actionDetails for having MarketPlace", () => {
        p1.assignHand([...hand1]);
        p1.buildCard("Marketplace");
        p1.addCoins(2);
        p1.assignHand([...hand4]);

        const [handData] = p1.getHandData();
        const expected = {
          tradeDetails: {
            leftPlayer: [
              {
                count: 1,
                rate: 1,
                type: "papyrus",
              },
              {
                count: 0,
                rate: 1,
                type: "textile",
              }
            ],
            rightPlayer: [
              {
                count: 0,
                rate: 1,
                type: "papyrus",
              },
              {
                count: 1,
                rate: 1,
                type: "textile",
              }
            ],
          },
        };

        assertEquals(handData.actionDetails, expected);
      });
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

    assertEquals(p.warTokensObj, {positive: 9, negative: -1});
  });

  it("Should return total conflict value", () => {
    const p = new Player("Alice");
    p.addWarTokens(1);
    p.addWarTokens(3);
    p.addWarTokens(5);
    p.addWarTokens(-1);

    assertEquals(p.warTokensObj, {positive: 9, negative: -1});
  });

  it("Should return war conflict points", () => {
    p1.wonder.addMilitaryStrength({
      produces: [{type: "shield", count: 3}],
    });
    p2.wonder.addMilitaryStrength({
      produces: [{type: "shield", count: 3}],
    });
    p3.wonder.addMilitaryStrength({
      produces: [{type: "shield", count: 0}],
    });
    p4.wonder.addMilitaryStrength({
      produces: [{type: "shield", count: 2}],
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
