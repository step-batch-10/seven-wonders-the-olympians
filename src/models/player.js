import uniqid from "uniqid";
import _ from "lodash";

class Player {
  #name;
  #playerID;
  #rightPlayer;
  #leftPlayer;
  #coins;
  #warTokens;
  #hand;
  #wonder;
  #status;
  #tempAct;
  #view;

  constructor(userName) {
    this.#name = userName;
    this.#playerID = Player.generateUniquePlayerID();
    this.#rightPlayer = null;
    this.#leftPlayer = null;
    this.#coins = 0;
    this.#warTokens = [];
    this.#hand = [];
    this.#wonder = null;
    this.#status = "waiting";
    this.#view = "upto-date";
  }

  static generateUniquePlayerID() {
    return "pid" + uniqid();
  }

  get name() {
    return this.#name;
  }

  get coins() {
    return this.#coins;
  }

  get playerID() {
    return this.#playerID;
  }

  get view() {
    return this.#view;
  }

  get status() {
    return this.#status;
  }

  set status(status) {
    this.#status = status;
  }

  get tempAct() {
    return this.#tempAct;
  }

  addWarTokens(token) {
    this.#warTokens.push(token);
  }

  get warTokensObj() {
    return this.#warTokens.reduce(
      (total, token) => {
        token < 0 ? (total.negative += token) : (total.positive += token);
        return total;
      },
      { positive: 0, negative: 0 },
    );
  }

  get leftPlayer() {
    return this.#leftPlayer;
  }

  set leftPlayer(player) {
    this.#leftPlayer = player;
  }

  get rightPlayer() {
    return this.#rightPlayer;
  }

  set rightPlayer(player) {
    this.#rightPlayer = player;
  }

  get wonder() {
    return this.#wonder;
  }

  set wonder(wonder) {
    this.#wonder = wonder;
  }

  calculateWarPoints() {
    const playerShields = this.#wonder.buildings.red.length;
    const leftShields = this.#leftPlayer.wonder.buildings.red.length;
    const rightShields = this.#rightPlayer.wonder.buildings.red.length;

    return {
      positive: (playerShields > leftShields) + (playerShields > rightShields),
      negative: (playerShields < leftShields) + (playerShields < rightShields),
    };
  }

  assignHand(hand) {
    this.#hand = hand;
  }

  addCoins(coins) {
    this.#coins += coins;
  }

  updateStatus(status) {
    this.#status = status;
  }

  updateHand(cardName) {
    const indexOfCard = _.findIndex(
      this.#hand,
      (handCard) => cardName === handCard.name,
    );

    _.remove(this.#hand, (_ele, idx) => idx === indexOfCard);
  }

  coverWithChoices() {
    const usedChoices = new Set();
    const choices = this.#wonder.resources.choices;

    return (resource, count) => {
      if (count <= 0) return 0;

      let costCovered = 0;

      for (
        let index = 0;
        index < choices.length && costCovered < count;
        index++
      ) {
        const choiceResources = choices[index];
        const available = !usedChoices.has(index);
        const resourceIncluded = choiceResources.has(resource);

        if (available && resourceIncluded) {
          costCovered++;
          usedChoices.add(index);
        }
      }

      return costCovered;
    };
  }

  haveResources(cost) {
    const resources = this.#wonder.resources;
    const costPending = [];
    const coveredFromChoice = this.coverWithChoices();

    cost.forEach(({ type, count }) => {
      const resourceAvailable = resources[type] || 0;
      let pendingCount = count - resourceAvailable;
      pendingCount -= coveredFromChoice(type, pendingCount);

      if (pendingCount > 0) costPending.push({ type, count: pendingCount });
    });

    return costPending;
  }

  playerData() {
    const data = {
      name: this.name,
      wonder: this.#wonder.name,
      coins: this.#coins,
      warTokens: this.warTokensObj,
      stage: this.#wonder.staged,
      buildings: this.#wonder.buildings,
      bonusResource: this.#wonder.bonusResource,
    };

    return data;
  }

  getOtherPlayerData() {
    const data = [];
    let otherPlayer = this.#leftPlayer.leftPlayer;

    while (otherPlayer.playerID !== this.#rightPlayer.playerID) {
      data.push(otherPlayer.playerData());
      otherPlayer = otherPlayer.leftPlayer;
    }

    return data;
  }

  getOtherPlayersStatus() {
    const playersStatus = [];
    let otherPlayer = this.#leftPlayer.leftPlayer;
    while (otherPlayer.playerID !== this.#rightPlayer.playerID) {
      playersStatus.push(otherPlayer.status);
      otherPlayer = otherPlayer.leftPlayer;
    }

    return playersStatus;
  }

  #makeBuildDes(canBuild, msg) {
    return {
      canBuild,
      buildDetails: {
        noOfResources: 0,
        resourcesReq: 0,
        msg,
      },
    };
  }

  #hasNoCost(cost) {
    return cost.length === 0;
  }

  #isCostTypecoin(cost) {
    return cost.length === 1 && cost[0]?.type === "coin";
  }

  #playerHasResources(tradeCost) {
    return tradeCost.length === 0;
  }

  #buildDetails(cost) {
    if (this.#hasNoCost(cost)) {
      return this.#makeBuildDes(true, "no resources required");
    }

    if (this.#isCostTypecoin(cost)) {
      console.log("Entered the 2nd if");
      console.log(cost, this.#coins);

      const canBuild = cost[0].count <= this.#coins;
      return this.#makeBuildDes(canBuild, "pay bank");
    }

    const playerTradeCost = this.haveResources(cost);

    if (this.#playerHasResources(playerTradeCost)) {
      return this.#makeBuildDes(true, "had enough resources");
    }

    return { canBuild: false, buildDetails: {} };
  }

  #getBuildDetails(card) {
    const cost = card.cost;

    return this.#buildDetails(cost);
  }

  #addActionDetails(card) {
    const { canBuild, buildDetails } = this.#getBuildDetails(card);

    return {
      name: card.name,
      canBuild,
      canStage: false,
      buildDetails,
      canTrade: false,
      tradeDetails: {},
      canDiscard: true,
    };
  }

  getHandData() {
    return this.#hand.map((card) => this.#addActionDetails(card));
  }

  canBuild(card) {
    const cost = card.cost;

    if (cost.length === 0) return true;

    if (cost[0]?.type === "coin") {
      return cost[0].count <= this.#coins;
    }

    let remainingCost = this.haveResources(cost);

    if (remainingCost.length === 0) return true;

    remainingCost = this.leftPlayer.haveResources(cost);
    if (remainingCost.length === 0) return true; // return money to be deducted

    remainingCost = this.#rightPlayer.haveResources(cost);
    if (remainingCost.length === 0) return true;

    return false;
  }

  canStage() {
    const stages = this.#wonder.stages;
    const toStageCount = this.#wonder.staged.length + 1;
    const stageCard = stages[`stage${toStageCount}`];

    return this.canBuild(stageCard);
  }

  deductCoins(card) {
    const coinCost = card.cost.find(({ type }) => type === "coin");
    if (coinCost) this.#coins -= coinCost.count;
  }

  addBenefits(card) {
    const benefits = card.produces.find(({ type }) => type === "coin");
    if (benefits) this.#coins += benefits.count;
  }

  buildCard(cardName) {
    const card = [...this.#hand].find((card) => card.name === cardName);

    this.deductCoins(card);
    this.addBenefits(card);
    this.#view = "upto-date";

    this.#wonder.build(card);
    this.updateHand(cardName);
  }

  setTempAct(action) {
    this.#tempAct = action;
  }

  discardCard(cardName) {
    this.updateHand(cardName);
    this.addCoins(3);
  }

  updateViewStatus(status) {
    this.#view = status;
  }
}

export { Player };
