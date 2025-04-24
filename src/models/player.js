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
  #currentTrades;
  #doneWithConflict;

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
    this.#currentTrades = {};
    this.#doneWithConflict = false;
  }

  static generateUniquePlayerID() {
    return "pid" + uniqid();
  }

  toggleDoneWithConflict() {
    this.#doneWithConflict = !this.#doneWithConflict;
  }

  get doneWithConflict() {
    return this.#doneWithConflict;
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

  set playerID(playerId) {
    this.#playerID = playerId;
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

  set tempAct(action) {
    this.#tempAct = action;
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

  conflict(neighbour, age) {
    const winningToken = 2 * age - 1;

    const playerShields = this.wonder.militaryStrength;
    const neighbourShields = neighbour.wonder.militaryStrength;

    const delta = playerShields - neighbourShields;

    let result, tokens;

    switch (true) {
      case delta > 0:
        [result, tokens] = ["won", winningToken];
        break;
      case delta < 0:
        [result, tokens] = ["lose", -1];
        break;
      case delta === 0:
        [result, tokens] = ["draw", 0];
        break;
    }

    this.doneWithConflict || this.addWarTokens(tokens);

    return {
      opponentName: neighbour.name,
      militaryShields: neighbourShields,
      wonderName: neighbour.wonder.name,
      result,
      tokens,
    };
  }

  calculateWarPoints(age) {
    const conflictData = {
      militaryShields: this.wonder.militaryStrength,
      leftConflict: this.conflict(this.#leftPlayer, age, "<---"),
      rightConflict: this.conflict(this.#rightPlayer, age, "--->"),
    };
    this.#doneWithConflict = true;

    return conflictData;
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

  // canStage () {
  //   const stage = this.wonder.getNextStage();
  //   return this.canBuild(stage.cost);
  // }

  // validateTrades () {
  //   this.#hand.forEach((card) => {
  //     this.#currentTrades[card.name] = this.canBuild(card.cost);
  //   });

  //   this.#currentTrades.stage = this.canStage();
  // }

  deductCoins(card) {
    const coinCost = card.cost.find(({ type }) => type === "coin");
    if (coinCost) this.#coins -= coinCost.count;
  }

  addBenefits(card) {
    const benefits = card.produces.find(({ type }) => type === "coin"); // card.effect also
    if (benefits) this.#coins += benefits.count;
  }

  minimumCost(trade1, trade2, type, count) {
    const trade1Count = trade1[type]?.count || 0;
    const trade2Count = trade2[type]?.count || 0;
    const trade1Rate = trade1[type]?.rate;
    const trade2Rate = trade2[type]?.rate;

    return trade1Rate < trade2Rate
      ? trade1Rate * trade1Count + ((count - trade1Count) * trade2Rate)
      : trade2Rate * trade2Count + ((count - trade2Count) * trade1Rate);
  }

  canTrade({ leftPlayer, rightPlayer }, cost) {
    const coins = this.#coins;

    let coinsNeeded = 0;
    const leftPlayerMap = _.keyBy(leftPlayer, "type");
    const rightPlayerMap = _.keyBy(rightPlayer, "type");

    const costsCovered = cost.every(({ type, count }) => {
      const leftPlayerCount = leftPlayerMap[type]?.count || 0;
      const rightPlayerCount = rightPlayerMap[type]?.count || 0;
      const itemCount = leftPlayerCount + rightPlayerCount;

      coinsNeeded += this.minimumCost(
        leftPlayerMap,
        rightPlayerMap,
        type,
        count,
      );

      return itemCount >= count && coinsNeeded <= coins;
    });

    return costsCovered;
  }

  resourcesGot(cost, costPending) {
    const costPendingMap = _.keyBy(costPending, "type");
    return cost.map(({ type, count }) => {
      const coveredCount = count - (costPendingMap[type]?.count || 0);
      return { type, count: coveredCount };
    });
  }

  tradeDetails(cost, costPending, discount) {
    const resourcesGot = this.resourcesGot(cost, costPending);

    return resourcesGot.map(({ type, count }) => {
      const rate = discount.has(type) ? 1 : 2;
      return {
        type,
        count,
        rate,
      };
    });
  }

  resourcesFromneighbour(cost) {
    const trade = {};
    const discounts = this.#wonder.discounts;

    const leftPlayerPendings = this.#leftPlayer.haveResources(cost);
    trade.leftPlayer = this.tradeDetails(
      cost,
      leftPlayerPendings,
      discounts["left_neighbour"],
    );

    const rightPlayerPendings = this.#rightPlayer.haveResources(cost);
    trade.rightPlayer = this.tradeDetails(
      cost,
      rightPlayerPendings,
      discounts["right_neighbour"],
    );

    const canTrade = this.canTrade(trade, cost);

    return { canTrade, trade };
  }

  #addBuildDetails(msg, actionDetails) {
    actionDetails.buildDetails = msg;

    return actionDetails;
  }

  #addTradeDetails(trade, actionDetails) {
    actionDetails.tradeDetails = trade;

    return actionDetails;
  }

  #isCardFree(cost) {
    return cost.length === 0
      ? this.#addBuildDetails("no resources required", {})
      : null;
  }

  #canAffordCoinCost(cost) {
    const isCoin = cost.length === 1 && cost[0]?.type === "coin";

    return isCoin && (cost[0]?.count <= this.#coins)
      ? this.#addBuildDetails("pay bank", {})
      : null;
  }

  #hasEnoughResources(tradeCost) {
    return tradeCost.length === 0
      ? this.#addBuildDetails("had enough resources", {})
      : null;
  }

  #hasFutureCard(card) {
    return this.#wonder.futureBenefits.has(card.name)
      ? this.#addBuildDetails("future free card", {})
      : null;
  }

  #trade(cost) {
    const { canTrade, trade } = this.resourcesFromneighbour(cost);
    return canTrade ? this.#addTradeDetails(trade, {}) : null;
  }

  #alreadyHave(card) {
    if (this.#wonder.alreadyBuilt(card.name)) {
      return {};
    }
    return null;
  }

  #getActionDetails(card) {
    const cost = card.cost;
    const tradeCost = this.haveResources(cost);

    return (
      this.#alreadyHave(card) ||
      this.#isCardFree(cost) ||
      this.#canAffordCoinCost(cost) ||
      this.#hasFutureCard(card) ||
      this.#hasEnoughResources(tradeCost) ||
      this.#trade(tradeCost) ||
      {}
    );
  }

  #addActionDetails(card) {
    const actionDetails = this.#getActionDetails(card);

    return {
      name: card.name,
      actionDetails,
      canStage: false,
      canDiscard: true,
    };
  }

  getHandData() {
    return this.#hand.map((card) => this.#addActionDetails(card));
  }

  buildCard(cardName) {
    const card = [...this.#hand].find((card) => card.name === cardName);

    this.deductCoins(card);
    this.addBenefits(card);
    this.#view = "upto-date";

    this.#wonder.build(card);
    this.updateHand(cardName);
  }

  stageCard(cardName) {
    const card = [...this.#hand].find((card) => card.name === cardName);

    this.#wonder.stage(card);
    this.updateHand(cardName);
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
