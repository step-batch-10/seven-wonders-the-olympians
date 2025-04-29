import _ from "lodash";

const calcMilitaryConflictPoints = (warTokens) => {
  return warTokens.positive + warTokens.negative;
};

const calcTreasuryPoints = (coins) => {
  return Math.floor(coins / 3);
};

const totalStagingPoints = (total, stage) => {
  const [effect] = stage[1].effects;
  effect.type === "points" && (total += effect.count);
  return total;
};

const calcWonderStagePoints = (stagedCount, stages) => {
  const stagedData = Object.entries(stages).slice(0, stagedCount);

  return stagedData.reduce(totalStagingPoints, 0);
};

const calcCivilStructurePoints = (civilCards) => {
  return civilCards.reduce((total, card) => {
    const [product] = card.produces;
    return total + product.count;
  }, 0);
};

const calcIdenticalCombination = (cardGroups) => {
  return Object.values(cardGroups).reduce(
    (total, group) => total + group.length ** 2,
    0,
  );
};

const calcDiffCombination = (cardGroups) => {
  if (_.size(cardGroups) < 3) return 0;

  const combinations = _.min(
    Object.values(cardGroups).map((group) => group.length),
  );

  return combinations * 7;
};

const calcSciStructurePoints = (sciCards) => {
  const cardGroups = Object.groupBy(sciCards, (card) => card.produces[0].type);
  const pointsFromIdenticalGroups = calcIdenticalCombination(cardGroups);
  const pointsForDifferentCombination = calcDiffCombination(cardGroups);
  return pointsFromIdenticalGroups + pointsForDifferentCombination;
};

const commEffect = (buildings, stagedCount) => {
  return (total, effect) => {
    if (effect.effectType === "card") {
      return total + buildings[effect.cardColor].length * effect.count;
    }

    return total + stagedCount * effect.count;
  };
};

const calcComStructurePoints = (buildings, stagedCount) => {
  const effects = buildings.yellow
    .flatMap((card) => card.effect)
    .filter((effect) => effect?.type === "points");

  return effects.reduce(commEffect(buildings, stagedCount), 0);
};

const guildPointsForWarToken = (...neighbors) => {
  return (
    neighbors.reduce((total, { warTokens }) => total + warTokens.negative, 0) *
    -1
  );
};

const calculateStagedCardPoints = (...playersData) => {
  return playersData.reduce((total, { stagedCount }) => total + stagedCount, 0);
};

const guildPointsForCard = (playersData, effect) => {
  const { appliesTo, cardColor, count } = effect;

  return (
    appliesTo.reduce(
      (total, player) =>
        playersData[player].buildings[cardColor].length + total,
      0,
    ) * count
  );
};

const calculatePoint = {
  war: ({ leftNeighbour, rightNeighbour }) =>
    guildPointsForWarToken(leftNeighbour, rightNeighbour),

  stage: ({ self, leftNeighbour, rightNeighbour }) =>
    calculateStagedCardPoints(self, leftNeighbour, rightNeighbour),

  card: (playersData, effect) => guildPointsForCard(playersData, effect),
};

const guildEffect = (playersData) => {
  return (total, effect) => {
    const points = calculatePoint[effect.effectType](playersData, effect);
    return total + points;
  };
};

const calcGuildsPoints = (player) => {
  const playerData = player.scoringData();

  const effects = playerData.buildings.purple
    .flatMap((card) => card.effect)
    .filter((effect) => effect?.type === "points");

  const leftNeighbour = player.leftPlayer.scoringData();
  const rightNeighbour = player.rightPlayer.scoringData();

  return effects.reduce(
    guildEffect({ self: playerData, leftNeighbour, rightNeighbour }),
    0,
  );
};

const calculateScore = (player) => {
  const { stagedCount, stages, buildings, warTokens } = player.scoringData();

  const score = {
    militaryConflict: calcMilitaryConflictPoints(warTokens),
    treasury: calcTreasuryPoints(player.coins),
    wonderStage: calcWonderStagePoints(stagedCount, stages),
    civilianStructure: calcCivilStructurePoints(buildings.blue),
    scientificStructure: calcSciStructurePoints(buildings.green),
    commerceStructure: calcComStructurePoints(buildings, stagedCount),
    guilds: calcGuildsPoints(player),
  };

  return score;
};

export {
  calcCivilStructurePoints,
  calcComStructurePoints,
  calcGuildsPoints,
  calcMilitaryConflictPoints,
  calcSciStructurePoints,
  calcTreasuryPoints,
  calculateScore,
  calcWonderStagePoints,
};
