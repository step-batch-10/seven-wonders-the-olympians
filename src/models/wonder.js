import _ from "lodash";
import uniqid from "uniqid";

class Wonder {
  #wonder;
  #buildings;
  #buildingsSet;
  #resources;
  #staged;
  #discounts;
  #militaryStrength;
  #victoryPoints;
  #futureBenefits;

  constructor(wonder) {
    this.#wonder = wonder;
    this.#buildings = {
      brown: [],
      grey: [],
      green: [],
      yellow: [],
      blue: [],
      red: [],
      purple: [],
    };

    this.#buildingsSet = new Set();
    this.#resources = [{ id: wonder.name, type: wonder.resource, count: 1 }];
    // this.#discounts = {
    //   leftNeighbour: new Set(),
    //   rightNeighbour: new Set(),
    // };
    this.#militaryStrength = 0;
    // this.#victoryPoints = 0;
    this.#staged = [];
    this.#futureBenefits = new Set();
  }

  static generateUID() {
    return uniqid();
  }

  get name() {
    return this.#wonder.name;
  }

  get bonusResource() {
    return this.#wonder.resource;
  }

  get staged() {
    return this.#staged;
  }

  get resources() {
    return this.#resources;
  }

  get militaryStrength() {
    return this.#militaryStrength;
  }

  get victoryPoints() {
    return this.#victoryPoints;
  }

  get discounts() {
    return this.#discounts;
  }

  get futureBenefits() {
    return this.#futureBenefits;
  }

  get img() {
    return this.#wonder.img;
  }

  get stages() {
    return this.#wonder.stages;
  }

  get wonder() {
    return this.#wonder;
  }

  get buildings() {
    return this.#buildings;
  }

  get buildingsName() {
    return Object.fromEntries(
      Object.entries(this.#buildings).map(([colors, cards]) => {
        const cardNames = cards.map((card) => card.name);
        return [colors, cardNames];
      }),
    );
  }

  get buildingsSet() {
    return this.#buildingsSet;
  }

  // calculateResources(cards) {
  //   const resources = {
  //     wood: 0,
  //     ore: 0,
  //     clay: 0,
  //     stone: 0,
  //     papyrus: 0,
  //     glass: 0,
  //     textile: 0,
  //     loom: 0,
  //     choices: [],
  //   };

  //   cards.forEach((card) => {
  //     const type = card.produces[0].type;

  //     if (type === "choice") {
  //       resources.choices.push(card.produces[0].options);
  //     } else {
  //       resources[type] += card.produces[0].count;
  //     }
  //   });

  //   resources[this.wonder.resource] += 1;
  //   return resources;
  // }

  // aggregatedResources() {
  //   const brown = this.#buildings.brown;
  //   const grey = this.#buildings.grey;
  //   const yellow = this.#buildings.yellow.filter(
  //     ({ produces }) => produces.length > 0
  //   );
  //   return this.calculateResources([...brown, ...grey, ...yellow]);
  // }

  alreadyBuilt(cardName) {
    return this.#buildingsSet.has(cardName);
  }

  // isDiscountCard(card) {
  //   const isYellowCard = card.color === "yellow";
  //   const isDiscountCard = card.effect && card.effect[0]?.effectType === "buy";

  //   return isYellowCard && isDiscountCard;
  // }

  // isMilitaryStrength(card) {
  //   return card.color === "red";
  // }

  // isVictoryPoints(card) {
  //   return card.color === "blue";
  // }

  addResources(card) {
    card?.produces.forEach((produced) => {
      this.resources.push({ id: card.name, ...produced });
    });
  }

  // addDiscounts(card) {
  //   const resources = card.effect[0].options;
  //   const newNeighbours = card.effect[0].appliesTo;

  //   newNeighbours.forEach((neighbour) => {
  //     resources.forEach((resource) => this.#discounts[neighbour].add(resource));
  //   });
  // }

  // addVictoryPoints(card) {
  //   const count = card.produces[0].count;
  //   this.#victoryPoints += count;
  // }

  addMilitaryStrength(card) {
    card?.produces.forEach(({ type, count }) => {
      if (type === "shield") this.#militaryStrength += count;
    });
  }

  addFutureBenefits(card) {
    if (!card.chainTo.length) return;
    card.chainTo.map((chain) => this.#futureBenefits.add(chain));
  }

  getCardBenefits(card) {
    this.addFutureBenefits(card);
    this.addResources(card);
    this.addMilitaryStrength(card);
  }

  build(card) {
    this.#buildings[card.color].push(card);
    this.#buildingsSet.add(card.name);

    this.getCardBenefits(card);
  }

  getNextStage() {
    const nextStage = {
      0: "stage1",
      1: "stage2",
      2: "stage3",
    };

    return nextStage[this.#staged.length];
  }

  stage(card) {
    this.#staged.push(card);
  }
}

export { Wonder };
