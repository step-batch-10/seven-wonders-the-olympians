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
    this.#militaryStrength = 0;
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

  alreadyBuilt(cardName) {
    return this.#buildingsSet.has(cardName);
  }

  addResources(card) {
    const tradables = new Set(["brown", "grey"]);
    const tradable = tradables.has(card.color);

    card?.produces.forEach((produced) => {
      this.resources.push({ id: card.name, ...produced, tradable });
    });
  }

  increaseMilitaryStrengthBy(count) {
    this.#militaryStrength += count;
  }

  addMilitaryStrength(card) {
    card?.produces.forEach(({ type, count }) => {
      if (type === "shield") this.increaseMilitaryStrengthBy(count);
    });
  }

  addFutureBenefits(card) {
    if (!card.chainTo?.length) return;
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
