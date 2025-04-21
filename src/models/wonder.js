class Wonder {
  #wonder;
  #buildings;
  #resources;
  #staged;
  #discounts;
  #militaryStrength;
  #victoryPoints;
  #stages;

  constructor(wonder) {
    this.#wonder = wonder;
    this.#buildings = {
      brown: [],
      gray: [],
      green: [],
      yellow: [],
      blue: [],
      red: [],
      purple: [],
    };
    this.#resources = { choices: [] };
    this.#resources[wonder.resource] = 1;
    this.#discounts = {};
    this.#militaryStrength = 0;
    this.#victoryPoints = 0;
    this.#staged = [];
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

  get img() {
    return this.#wonder.img;
  }

  get stages() {
    return this.#wonder.stages;
  }

  get buildings() {
    return Object.fromEntries(
      Object.entries(this.#buildings).map(([colors, cards]) => {
        const cardNames = cards.map((card) => card.name);
        return [colors, cardNames];
      })
    );
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

    resources.forEach((resource) => {
      const neighbours = this.#discounts[resource];

      if (!neighbours) {
        this.#discounts[resource] = [];
      }

      this.#discounts[resource] =
        this.#discounts[resource].concat(newNeighbours);
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

  getCardBenefits(card) {
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

  stageACard(card) {
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
