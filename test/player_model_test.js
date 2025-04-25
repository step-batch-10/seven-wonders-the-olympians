import { assertEquals, assertNotEquals } from "assert";
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

describe("Testing evaluateFree", () => {
  let p, card;

  beforeEach(() => {
    p = new Player("Alice");
    card = {
      name: "Lumber Yard",
      age: 1,
      color: "brown",
      cost: [],
      produces: [{ type: "wood", count: 1 }],
      effect: null,
    };
  });

  it("should return canBuild as true and status as free", () => {
    assertEquals(p.evaluateFreeBuild(card), {
      canBuild: true,
      buildOptions: { mode: "no_cost" },
    });
  });

  it("should return canBuild as false ", () => {
    card.cost.push({ type: "coin", count: 1 });
    assertEquals(p.evaluateFreeBuild(card), {
      canBuild: false,
    });
  });
});

describe("Testing CalculateResources", () => {
  let brown, grey, yellow, wonder;

  beforeEach(() => {
    const card2 = {
      name: "Foundry",
      color: "brown",
      cost: [{ type: "coin", count: 1 }],
      produces: [{ type: "ore", count: 2 }],
    };

    const card3 = {
      name: "Sawmill",
      color: "brown",
      cost: [{ type: "coin", count: 1 }],
      produces: [{ type: "wood", count: 2 }],
    };

    brown = [, card2, card3];

    const card4 = {
      name: "Press",
      color: "grey",
      cost: [],
      produces: [{ type: "papyrus", count: 1 }],
    };

    const card5 = {
      name: "Glassworks",
      color: "grey",
      cost: [],
      produces: [{ type: "glass", count: 1 }],
    };

    grey = [card4, card5];

    const card6 = {
      name: "Forum",
      color: "yellow",
      cost: [{ type: "clay", count: 2 }],
      produces: [
        {
          type: "choice",
          options: ["glass", "papyrus", "textile"],
          count: 1,
        },
      ],
    };

    const card7 = {
      name: "Caravansery",
      color: "yellow",
      cost: [{ type: "wood", count: 2 }],
      produces: [
        {
          type: "choice",
          options: ["wood", "stone", "ore", "clay"],
          count: 1,
        },
      ],
    };

    yellow = [card6, card7];

    wonder = {
      img: "olympiaA.jpeg",
      name: "Olympia",
      resource: "wood",
      side: "A",
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
    };
  });

  it("Should return total resources from brown cards", () => {
    const w = new Wonder(wonder);
    assertEquals(w.calculateResources(brown), {
      wood: 3,
      ore: 2,
      clay: 0,
      stone: 0,
      papyrus: 0,
      glass: 0,
      textile: 0,
      loom: 0,
      choices: [],
    });
  });
  it("Should return total resources from grey cards", () => {
    const w = new Wonder(wonder);
    assertEquals(w.calculateResources(grey), {
      wood: 1,
      ore: 0,
      clay: 0,
      stone: 0,
      papyrus: 1,
      glass: 1,
      textile: 0,
      loom: 0,
      choices: [],
    });
  });
  it("Should return total resources from yellow cards with choices", () => {
    const w = new Wonder(wonder);
    assertEquals(w.calculateResources(yellow), {
      wood: 1,
      ore: 0,
      clay: 0,
      stone: 0,
      papyrus: 0,
      glass: 0,
      textile: 0,
      loom: 0,
      choices: [
        ["glass", "papyrus", "textile"],
        ["wood", "stone", "ore", "clay"],
      ],
    });
  });
});

describe("Testing EvaluateResources", () => {
  let p, card;

  beforeEach(() => {
    p = new Player("Alice");
    card = {
      name: "Lumber Yard",
      age: 1,
      color: "brown",
      cost: [],
      produces: [{ type: "wood", count: 1 }],
      effect: null,
    };
  });

  it("should return canBuild as true and status as free", () => {
    assertEquals(p.evaluateFreeBuild(card), {
      canBuild: true,
      buildOptions: { mode: "no_cost" },
    });
  });

  it("should return canBuild as false ", () => {
    card.cost.push({ type: "coin", count: 1 });
    assertEquals(p.evaluateFreeBuild(card), {
      canBuild: false,
    });
  });
});

describe("Testing CalculateResources", () => {
  let wonder, w, p;

  beforeEach(() => {
    const card1 = {
      name: "Vineyard",
      color: "yellow",
      cost: [],
      produces: [],
    };

    const card2 = {
      name: "Foundry",
      color: "brown",
      cost: [{ type: "coin", count: 1 }],
      produces: [{ type: "ore", count: 2 }],
    };

    const card3 = {
      name: "Sawmill",
      color: "brown",
      cost: [{ type: "coin", count: 1 }],
      produces: [{ type: "wood", count: 2 }],
    };

    const card4 = {
      name: "Press",
      color: "grey",
      cost: [],
      produces: [{ type: "papyrus", count: 1 }],
    };

    const card5 = {
      name: "Glassworks",
      color: "grey",
      cost: [],
      produces: [{ type: "glass", count: 1 }],
    };

    const card6 = {
      name: "Forum",
      color: "yellow",
      cost: [{ type: "clay", count: 2 }],
      produces: [
        {
          type: "choice",
          options: ["glass", "papyrus", "textile"],
          count: 1,
        },
      ],
    };

    const card7 = {
      name: "Caravansery",
      color: "yellow",
      cost: [{ type: "wood", count: 2 }],
      produces: [
        {
          type: "choice",
          options: ["wood", "stone", "ore", "clay"],
          count: 1,
        },
      ],
    };

    wonder = {
      img: "olympiaA.jpeg",
      name: "Olympia",
      resource: "wood",
      side: "A",
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
    };

    w = new Wonder(wonder);
    p = new Player("Alice");
    p.wonder = w;

    w.addToBuildings(card1);
    w.addToBuildings(card2);
    w.addToBuildings(card3);
    w.addToBuildings(card4);
    w.addToBuildings(card5);
    w.addToBuildings(card6);
    w.addToBuildings(card7);
  });

  it("should return canBuild true as there are enough resources to build a card", () => {
    const card = {
      name: "Arsenal",
      color: "red",
      cost: [
        { type: "wood", count: 2 },
        { type: "ore", count: 1 },
        { type: "papyrus", count: 1 },
      ],
      produces: [{ type: "shields", count: 3 }],
    };
    assertEquals(p.evaluateResources(card), {
      canBuild: true,
      buildOptions: { mode: "enough_resources" },
    });
  });

  it("should return canBuild true as there are enough resources to build a card", () => {
    const card = {
      name: "Arsenal",
      color: "red",
      cost: [
        { type: "wood", count: 2 },
        { type: "ore", count: 1 },
        { type: "textile", count: 1 },
      ],
      produces: [{ type: "shields", count: 3 }],
    };
    assertEquals(p.evaluateResources(card), {
      canBuild: false,
    });
  });
});
