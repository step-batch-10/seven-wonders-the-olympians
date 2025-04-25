import _ from "lodash";

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
    this.#resources = { choices: [] };
    this.#resources[wonder.resource] = 1;
    this.#discounts = {
      "left_neighbour": new Set(),
      "right_neighbour": new Set(),
    };
    this.#militaryStrength = 0;
    this.#victoryPoints = 0;
    this.#staged = [];
    this.#futureBenefits = new Set();
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

  alreadyBuilt(cardName) {
    return this.#buildingsSet.has(cardName);
  }

  isResourceCard(card) {
    const resources = ["brown", "grey", "green"];
    return resources.includes(card.color);
  }

  isDiscountCard(card) {
    const isYellowCard = card.color === "yellow";
    const isDiscountCard = card.effect && card.effect[0]?.effect_type === "buy";

    return isYellowCard && isDiscountCard;
  }

  isMilitaryStrength(card) {
    return card.color == "red";
  }

  isVictoryPoints(card) {
    return card.color == "blue";
  }

  addResources(card) {
    if (card.produces[0].type === "choice") {
      const options = card.produces[0].options;
      this.#resources.choices.push(new Set(options));
      return;
    }

    const resource = card.produces[0].type;
    const count = card.produces[0].count;
    this.#resources[resource] = (this.#resources[resource] || 0) + count;
  }

  addDiscounts(card) {
    const resources = card.effect[0].options;
    const newNeighbours = card.effect[0].applies_to;

    newNeighbours.forEach((neighbour) => {
      resources.forEach((resource) => this.#discounts[neighbour].add(resource));
    });
  }

  addVictoryPoints(card) {
    const count = card.produces[0].count;
    this.#victoryPoints += count;
  }

  addMilitaryStrength(card) {
    const count = card.produces[0].count;
    this.#militaryStrength += count;
  }

  addFutureBenefits(card) {
    if (!card.chain_to.length) return;

    card.chain_to.map((chain) => this.#futureBenefits.add(chain));
  }

  getCardBenefits(card) {
    this.addFutureBenefits(card);
    if (this.isResourceCard(card)) {
      this.addResources(card);
    }

    if (this.isDiscountCard(card)) {
      this.addDiscounts(card);
    }

    if (this.isVictoryPoints(card)) {
      this.addVictoryPoints(card);
    }

    if (this.isMilitaryStrength(card)) {
      this.addMilitaryStrength(card);
    }
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
    const stage = this.getNextStage();
    const benefit = this.#wonder.stages[stage].powers[0];

    if (benefit.type === "points") {
      const count = benefit.value;
      this.#victoryPoints += count;
    }

    this.#staged.push(card);
  }
}

export { Wonder };
