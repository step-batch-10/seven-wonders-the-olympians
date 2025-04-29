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

const calcWonderStagePoints = (stagedCards, stages) => {
  const stagedCount = stagedCards.length;
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
    0
  );
};

const calcDiffCombination = (cardGroups) => {
  if (_.size(cardGroups) < 3) return 0;

  const combinations = _.min(
    Object.values(cardGroups).map((group) => group.length)
  );

  return combinations * 7;
};

const calcSciStructurePoints = (sciCards) => {
  const cardGroups = Object.groupBy(sciCards, (card) => card.produces[0].type);
  const pointsFromIdenticalGroups = calcIdenticalCombination(cardGroups);
  const pointsForDifferentCombination = calcDiffCombination(cardGroups);
  return pointsFromIdenticalGroups + pointsForDifferentCombination;
};

const commEffect = (buildings, stagedCards) => {
  return (total, effect) => {
    if (effect.effectType === "card") {
      return total + buildings[effect.cardColor].length * effect.count;
    }

    return total + stagedCards.length * effect.count;
  };
};

const calcComStructurePoints = (buildings, stagedCards) => {
  const effects = buildings.yellow
    .flatMap((card) => card.effect)
    .filter((effect) => effect?.type === "points");

  return effects.reduce(commEffect(buildings, stagedCards), 0);
};

const calcGuildsPoints = (player) => {
  return 0;
};

const calculateScore = (player) => {
  const { stagedCards, stages, buildings } = player.playerData();

  const score = {
    militaryConflict: calcMilitaryConflictPoints(player.warTokensObj),
    treasury: calcTreasuryPoints(player.coins),
    wonderStage: calcWonderStagePoints(stagedCards, stages),
    civilianStructure: calcCivilStructurePoints(buildings.blue),
    scientificStructure: calcSciStructurePoints(buildings.green),
    commerceStructure: calcComStructurePoints(player),
    guilds: calcGuildsPoints(player),
  };

  return score;
};

export {
  calculateScore,
  calcWonderStagePoints,
  calcTreasuryPoints,
  calcMilitaryConflictPoints,
  calcCivilStructurePoints,
  calcSciStructurePoints,
  calcComStructurePoints,
};
