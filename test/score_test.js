import { beforeEach, describe, it } from "test/bdd";
import {
  calcCivilStructurePoints,
  calcComStructurePoints,
  calcGuildsPoints,
  calcMilitaryConflictPoints,
  calcSciStructurePoints,
  calcTreasuryPoints,
  calcWonderStagePoints,
} from "../src/models/score.js";
import { Player } from "../src/models/player.js";
import { Game } from "../src/models/game.js";
import wonderData from "./../data/wonders.json" with { type: "json" };
import guildCards from "./../data/guildCards.json" with { type: "json" };
import ageOneCards from "./../data/ageOneCards.json" with { type: "json" };
import { assertEquals } from "assert";
import _ from "lodash";

describe("Testing calculating points for staging wonder", () => {
  const wondersObj = _.keyBy(wonderData, "name");

  it("Should return 3, 8 and 15 for corresponding stages for Gizah", () => {
    const gizah = wondersObj.Gizah;
    assertEquals(calcWonderStagePoints(1, gizah.stages), 3);
    assertEquals(calcWonderStagePoints(2, gizah.stages), 8);
    assertEquals(calcWonderStagePoints(3, gizah.stages), 15);
  });

  it("Should return 3, 8 and 15 for corresponding stages for Olympia", () => {
    const olympia = wondersObj.Olympia;
    assertEquals(calcWonderStagePoints(1, olympia.stages), 3);
    assertEquals(calcWonderStagePoints(2, olympia.stages), 3);
    assertEquals(calcWonderStagePoints(3, olympia.stages), 10);
  });

  it("Should return 3, 8 and 15 for corresponding stages for Ephesos", () => {
    const ephesos = wondersObj.Ephesos;
    assertEquals(calcWonderStagePoints(1, ephesos.stages), 3);
    assertEquals(calcWonderStagePoints(2, ephesos.stages), 3);
    assertEquals(calcWonderStagePoints(3, ephesos.stages), 10);
  });
});

describe("Testing calculating points for coins", () => {
  it("Should return 0 for coins lesser than 3", () => {
    assertEquals(calcTreasuryPoints(0), 0);
    assertEquals(calcTreasuryPoints(1), 0);
    assertEquals(calcTreasuryPoints(2), 0);
  });

  it("Should return 1 for coins lesser than 6 and more than 2", () => {
    assertEquals(calcTreasuryPoints(3), 1);
    assertEquals(calcTreasuryPoints(4), 1);
    assertEquals(calcTreasuryPoints(5), 1);
  });

  it("Should return quotient when divided by 3 for any number of coins.", () => {
    assertEquals(calcTreasuryPoints(3), 1);
    assertEquals(calcTreasuryPoints(8), 2);
    assertEquals(calcTreasuryPoints(15), 5);
    assertEquals(calcTreasuryPoints(7), 2);
  });
});

describe("Testing calculating conflict points for player", () => {
  it("should return 0 for if +ve & -ve tokens are 0", () => {
    assertEquals(calcMilitaryConflictPoints({ positive: 0, negative: 0 }), 0);
  });
  it("should return 0 if +ve and -ve are equal", () => {
    assertEquals(calcMilitaryConflictPoints({ positive: 2, negative: -2 }), 0);
  });
  it("should return +ve value of tokens when +ve tokens > -ve tokens", () => {
    assertEquals(calcMilitaryConflictPoints({ positive: 3, negative: -2 }), 1);
  });
  it("should return -ve value of tokens when +ve tokens < -ve tokens", () => {
    assertEquals(calcMilitaryConflictPoints({ positive: 3, negative: -5 }), -2);
  });
});

describe("Testing calculating points of civilian structures", () => {
  it("Should return 0 if not having any civilian structures", () => {
    const civilCards = [];
    assertEquals(calcCivilStructurePoints(civilCards), 0);
  });

  it("Should return 4 if having a civilian structures with 4 points", () => {
    const civilCards = [{ produces: [{ type: "points", count: 4 }] }];
    assertEquals(calcCivilStructurePoints(civilCards), 4);
  });

  it("Should return 9 if having two civilian structures with 4 & 5 points", () => {
    const civilCards = [
      { produces: [{ type: "points", count: 4 }] },
      { produces: [{ type: "points", count: 5 }] },
    ];
    assertEquals(calcCivilStructurePoints(civilCards), 9);
  });

  it("Should return  15 if having two civilian structures with 4, 5 & 6 points", () => {
    const civilCards = [
      { produces: [{ type: "points", count: 4 }] },
      { produces: [{ type: "points", count: 5 }] },
      { produces: [{ type: "points", count: 6 }] },
    ];
    assertEquals(calcCivilStructurePoints(civilCards), 15);
  });
});

describe("Testing calculating points of scientific structures", () => {
  it("If there is no sci structure should return zero", () => {
    const sciCards = [];
    assertEquals(calcSciStructurePoints(sciCards), 0);
  });

  it("If there is one sci structure should return one", () => {
    const sciCards = [
      {
        color: "green",
        produces: [{ type: "compass", count: 1 }],
        type: "science",
      },
    ];
    assertEquals(calcSciStructurePoints(sciCards), 1);
  });

  it("If there is two same identical products should return 4", () => {
    const sciCards = [
      {
        color: "green",
        produces: [{ type: "compass", count: 1 }],
        type: "science",
      },
      {
        color: "green",
        produces: [{ type: "compass", count: 1 }],
        type: "science",
      },
    ];
    assertEquals(calcSciStructurePoints(sciCards), 4);
  });

  it("If there is three same identical products should return 9", () => {
    const sciCards = [
      {
        color: "green",
        produces: [{ type: "compass", count: 1 }],
        type: "science",
      },
      {
        color: "green",
        produces: [{ type: "compass", count: 1 }],
        type: "science",
      },
      {
        color: "green",
        produces: [{ type: "compass", count: 1 }],
        type: "science",
      },
    ];
    assertEquals(calcSciStructurePoints(sciCards), 9);
  });

  it("If there is four same identical products should return 16", () => {
    const sciCards = [
      {
        color: "green",
        produces: [{ type: "compass", count: 1 }],
        type: "science",
      },
      {
        color: "green",
        produces: [{ type: "compass", count: 1 }],
        type: "science",
      },
      {
        color: "green",
        produces: [{ type: "compass", count: 1 }],
        type: "science",
      },
      {
        color: "green",
        produces: [{ type: "compass", count: 1 }],
        type: "science",
      },
    ];
    assertEquals(calcSciStructurePoints(sciCards), 16);
  });

  it("If there is two same identical and one diff products should return 5", () => {
    const sciCards = [
      {
        color: "green",
        produces: [{ type: "compass", count: 1 }],
        type: "science",
      },
      {
        color: "green",
        produces: [{ type: "compass", count: 1 }],
        type: "science",
      },
      {
        color: "green",
        produces: [{ type: "gear", count: 1 }],
        type: "science",
      },
    ];
    assertEquals(calcSciStructurePoints(sciCards), 5);
  });

  it("If there is two different pairs of identical products should return 8", () => {
    const sciCards = [
      {
        color: "green",
        produces: [{ type: "compass", count: 1 }],
        type: "science",
      },
      {
        color: "green",
        produces: [{ type: "compass", count: 1 }],
        type: "science",
      },
      {
        color: "green",
        produces: [{ type: "gear", count: 1 }],
        type: "science",
      },
    ];
    assertEquals(calcSciStructurePoints(sciCards), 5);
  });

  it("If there is one set of 3 different products should return 10", () => {
    const sciCards = [
      {
        color: "green",
        produces: [{ type: "compass", count: 1 }],
        type: "science",
      },
      {
        color: "green",
        produces: [{ type: "tablet", count: 1 }],
        type: "science",
      },
      {
        color: "green",
        produces: [{ type: "gear", count: 1 }],
        type: "science",
      },
    ];
    assertEquals(calcSciStructurePoints(sciCards), 10);
  });

  it("Should return 21 if there are 3 compasses, 2 tablets and 1 gear", () => {
    const sciCards = [
      {
        color: "green",
        produces: [{ type: "compass", count: 1 }],
        type: "science",
      },
      {
        color: "green",
        produces: [{ type: "compass", count: 1 }],
        type: "science",
      },
      {
        color: "green",
        produces: [{ type: "compass", count: 1 }],
        type: "science",
      },

      {
        color: "green",
        produces: [{ type: "tablet", count: 1 }],
        type: "science",
      },
      {
        color: "green",
        produces: [{ type: "tablet", count: 1 }],
        type: "science",
      },
      {
        color: "green",
        produces: [{ type: "gear", count: 1 }],
        type: "science",
      },
    ];
    assertEquals(calcSciStructurePoints(sciCards), 21);
  });

  it("Should return 31 if there are 3 compasses, 2 tablets and 2 gear", () => {
    const sciCards = [
      {
        color: "green",
        produces: [{ type: "compass", count: 1 }],
        type: "science",
      },
      {
        color: "green",
        produces: [{ type: "compass", count: 1 }],
        type: "science",
      },
      {
        color: "green",
        produces: [{ type: "compass", count: 1 }],
        type: "science",
      },

      {
        color: "green",
        produces: [{ type: "tablet", count: 1 }],
        type: "science",
      },
      {
        color: "green",
        produces: [{ type: "tablet", count: 1 }],
        type: "science",
      },
      {
        color: "green",
        produces: [{ type: "gear", count: 1 }],
        type: "science",
      },
      {
        color: "green",
        produces: [{ type: "gear", count: 1 }],
        type: "science",
      },
    ];
    assertEquals(calcSciStructurePoints(sciCards), 31);
  });
});

describe("Testing calculating points of commerce structures", () => {
  it("Should return zero if there is no commerce card", () => {
    const stagedCards = [];
    const buildings = {
      yellow: [],
    };
    assertEquals(calcComStructurePoints(buildings, stagedCards), 0);
  });
});

describe("Testing calculating points for guild structures", () => {
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

  it("Should return zero if there is no guild card", () => {
    assertEquals(calcGuildsPoints(p1), 0);
  });

  it("Should return 3 if having Guild of Builders card and self & neighbour has total of 3 staged count", () => {
    p2.wonder.build(guildCards[0]);

    p2.wonder.stage(ageOneCards[0]);
    p1.wonder.stage(ageOneCards[1]);
    p3.wonder.stage(ageOneCards[2]);

    assertEquals(calcGuildsPoints(p2), 3);
  });

  it("Should return 5 if having Guild of Builders card and s = 1, ln = 2, rn = 2", () => {
    p2.wonder.build(guildCards[0]);

    p2.wonder.stage(ageOneCards[0]);
    p1.wonder.stage(ageOneCards[1]);
    p1.wonder.stage(ageOneCards[2]);
    p3.wonder.stage(ageOneCards[3]);
    p3.wonder.stage(ageOneCards[4]);

    assertEquals(calcGuildsPoints(p2), 5);
  });

  it("Should return 10 if having Guild of Craftmens card and greyCard: ln = 2, rn = 3", () => {
    p2.wonder.build(guildCards[1]);

    p1.wonder.build(ageOneCards[15]);
    p1.wonder.build(ageOneCards[16]);
    p3.wonder.build(ageOneCards[17]);
    p3.wonder.build(ageOneCards[18]);
    p3.wonder.build(ageOneCards[19]);

    assertEquals(calcGuildsPoints(p2), 10);
  });

  it("Should return 4 if having Guild of Magistrates card and blueCard: ln = 2, rn = 2", () => {
    p2.wonder.build(guildCards[2]);

    p1.wonder.build(ageOneCards[42]);
    p1.wonder.build(ageOneCards[43]);
    p3.wonder.build(ageOneCards[44]);
    p3.wonder.build(ageOneCards[45]);

    assertEquals(calcGuildsPoints(p2), 4);
  });

  it("Should return 4 if having Guild of Philosopher card and greenCard: ln = 1, rn = 5", () => {
    p2.wonder.build(guildCards[3]);

    p1.wonder.build(ageOneCards[35]);
    p3.wonder.build(ageOneCards[36]);
    p3.wonder.build(ageOneCards[37]);
    p3.wonder.build(ageOneCards[38]);
    p3.wonder.build(ageOneCards[39]);
    p3.wonder.build(ageOneCards[40]);

    assertEquals(calcGuildsPoints(p2), 6);
  });

  it("Should return 5 if having Guild of Shipowners card and cards: b = 1, gray = 2, p = 2", () => {
    p2.wonder.build(guildCards[5]);
    p2.wonder.build(guildCards[4]);

    p2.wonder.build(ageOneCards[0]);
    p2.wonder.build(ageOneCards[14]);
    p2.wonder.build(ageOneCards[15]);

    assertEquals(calcGuildsPoints(p2), 5);
  });

  it("Should return 5 if having Guild of Spies card and red cards: ln = 3, rn = 2", () => {
    p2.wonder.build(guildCards[6]);

    p1.wonder.build(ageOneCards[29]);
    p1.wonder.build(ageOneCards[30]);
    p1.wonder.build(ageOneCards[31]);
    p3.wonder.build(ageOneCards[32]);
    p3.wonder.build(ageOneCards[33]);

    assertEquals(calcGuildsPoints(p2), 5);
  });

  it("Should return 3 if having Guild of Strategies card and red -ve: ln = 1, rn = 2", () => {
    p2.wonder.build(guildCards[7]);

    p1.addWarTokens(-1);
    p3.addWarTokens(-1);
    p3.addWarTokens(-1);

    assertEquals(calcGuildsPoints(p2), 3);
  });

  it("Should return 4 if having Guild of Traders card and yellow cards: ln = 2, rn = 2", () => {
    p2.wonder.build(guildCards[8]);

    p1.wonder.build(ageOneCards[20]);
    p1.wonder.build(ageOneCards[21]);
    p3.wonder.build(ageOneCards[22]);
    p3.wonder.build(ageOneCards[23]);

    assertEquals(calcGuildsPoints(p2), 4);
  });

  it("Should return 4 if having Guild of Workers card and brown cards: ln = 1, rn = 3", () => {
    p2.wonder.build(guildCards[9]);

    p1.wonder.build(ageOneCards[0]);
    p3.wonder.build(ageOneCards[1]);
    p3.wonder.build(ageOneCards[2]);
    p3.wonder.build(ageOneCards[3]);

    assertEquals(calcGuildsPoints(p2), 4);
  });
});
