import { assertEquals } from "assert";
import { describe, it } from "test/bdd";
import { Wonder } from "../src/models/wonder.js";

describe("testing the wonders class", () => {
  const olympia = {
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

  it("should give no of military points", () => {
    const wonder = new Wonder(olympia);

    const card1 = {
      name: "Guard Tower",
      age: 1,
      color: "red",
      minPlayers: 3,
      cost: [{ type: "clay", count: 1 }],
      produces: [{ type: "shield", count: 1 }],
      effect: null,
      chainFrom: null,
      chainTo: [],
    };

    const card2 = {
      name: "Stockade",
      age: 1,
      color: "red",
      minPlayers: 3,
      cost: [{ type: "wood", count: 1 }],
      produces: [{ type: "shield", count: 1 }],
      effect: null,
      chainFrom: null,
      chainTo: [],
    };

    const card3 = {
      name: "Barracks",
      age: 1,
      color: "red",
      minPlayers: 3,
      cost: [{ type: "ore", count: 1 }],
      produces: [{ type: "shield", count: 1 }],
      effect: null,
      chainFrom: null,
      chainTo: ["Stables", "Walls"],
    };

    wonder.addMilitaryStrength(card1);
    wonder.addMilitaryStrength(card2);
    wonder.addMilitaryStrength(card3);
    const militaryStrength = wonder.militaryStrength;

    assertEquals(militaryStrength, 3);
  });

  it("should get futureBenefits", () => {
    const wonder = new Wonder(olympia);

    const card1 = {
      name: "Apothecary",
      age: 1,
      color: "green",
      minPlayers: 3,
      cost: [{ type: "textile", count: 1 }],
      produces: [{ type: "compass", count: 1 }],
      effect: null,
      chainFrom: null,
      chainTo: ["Stables", "Dispensary"],
    };

    const card2 = {
      name: "Baths",
      age: 1,
      color: "blue",
      minPlayers: 7,
      cost: [{ type: "stone", count: 1 }],
      produces: [{ type: "points", count: 3 }],
      chainFrom: null,
      chainTo: ["Aqueduct"],
      type: "civil",
    };

    const card3 = {
      name: "Barracks",
      age: 1,
      color: "red",
      minPlayers: 3,
      cost: [{ type: "ore", count: 1 }],
      produces: [{ type: "shield", count: 1 }],
      effect: null,
      chainFrom: null,
      chainTo: ["Stables", "Walls"],
    };

    wonder.addFutureBenefits(card1);
    wonder.addFutureBenefits(card2);
    wonder.addFutureBenefits(card3);
    const futureBenefits = wonder.futureBenefits;
    const result = new Set(["Stables", "Dispensary", "Aqueduct", "Walls"]);

    assertEquals(futureBenefits, result);
  });
});
