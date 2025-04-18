export const getPlayerDetails = (ctx) => {
  return ctx.json({
    name: "Akash",
    wonder: "alexandria",
    coins: 3,
    warTokens: 0,
    stages: [],
    bonusResource: "glass",

    leftPlayer: {
      name: "Siddu",
      wonder: "olympia",
      coins: 3,
      warTokens: 0,
      noOfStages: 0,
      bonusResource: "wood",
      cards: [],
    },

    rightPlayer: {
      name: "Tom",
      wonder: "rhodos",
      coins: 3,
      warTokens: 0,
      bonusResource: "ore",
      noOfStages: 0,
      cards: [],
    },
    others: [
      {
        name: "Alice",
        wonder: "halikarnossos",
        coins: 3,
        warTokens: 0,
        noOfStages: 0,
        bonusResource: "textile",
      },
    ],
  });
};

export const disturbuteCards = (ctx) => {
  return ctx.json([
    {
      "name": "Lumber Yard",
      "cost": [],
    },
    {
      "name": "Stone Pit",
      "cost": [],
    },
  ]);
};
