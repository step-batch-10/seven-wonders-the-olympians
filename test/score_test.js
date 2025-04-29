import { describe, it } from "test/bdd";
import {
  calcWonderStagePoints,
  calcTreasuryPoints,
  calcMilitaryConflictPoints,
  calcCivilStructurePoints,
  calcSciStructurePoints,
  calcComStructurePoints
} from "../src/models/score.js";
import wonderData from "./../data/wonders.json" with { type: "json" };
import { assertEquals } from "assert";
import _ from "lodash";

describe("Testing calculating points for staging wonder", () => {
  const wondersObj = _.keyBy(wonderData, "name");

  it("Should return 3, 8 and 15 for corresponding stages for Gizah", () => {
    const gizah = wondersObj.Gizah;
    assertEquals(calcWonderStagePoints([1], gizah.stages), 3);
    assertEquals(calcWonderStagePoints([1, 2], gizah.stages), 8);
    assertEquals(calcWonderStagePoints([1, 2, 3], gizah.stages), 15);
  });

  it("Should return 3, 8 and 15 for corresponding stages for Olympia", () => {
    const olympia = wondersObj.Olympia;
    assertEquals(calcWonderStagePoints([1], olympia.stages), 3);
    assertEquals(calcWonderStagePoints([1, 2], olympia.stages), 3);
    assertEquals(calcWonderStagePoints([1, 2, 3], olympia.stages), 10);
  });

  it("Should return 3, 8 and 15 for corresponding stages for Ephesos", () => {
    const ephesos = wondersObj.Ephesos;
    assertEquals(calcWonderStagePoints([1], ephesos.stages), 3);
    assertEquals(calcWonderStagePoints([1, 2], ephesos.stages), 3);
    assertEquals(calcWonderStagePoints([1, 2, 3], ephesos.stages), 10);
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
