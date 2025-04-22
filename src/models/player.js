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

  constructor (userName) {
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
  }

  static generateUniquePlayerID () {
    return "pid" + uniqid();
  }

  get name () {
    return this.#name;
  }

  get coins () {
    return this.#coins;
  }

  get playerID () {
    return this.#playerID;
  }

  set playerID (playerId) {
    this.#playerID = playerId;
  }

  get view () {
    return this.#view;
  }

  get status () {
    return this.#status;
  }
  set status (status) {
    this.#status = status;
  }

  get tempAct () {
    return this.#tempAct;
  }

  addWarTokens (token) {
    this.#warTokens.push(token);
  }

  // get warTokensObj() {
  //   return this.#warTokens.reduce(
  //     (total, token) => {
  //       token < 0 ? (total.negative += token) : (total.positive += token);
  //       return total;
  //     },
  //     { positive: 0, negative: 0 }
  //   );
  // }

  get leftPlayer () {
    return this.#leftPlayer;
  }

  set leftPlayer (player) {
    this.#leftPlayer = player;
  }

  get rightPlayer () {
    return this.#rightPlayer;
  }

  set rightPlayer (player) {
    this.#rightPlayer = player;
  }

  get wonder () {
    return this.#wonder;
  }

  set wonder (wonder) {
    this.#wonder = wonder;
  }

  calculateWarPoints () {
    const playerShields = this.wonder.militaryStrength;
    const leftShields = this.leftPlayer.wonder.militaryStrength;
    const rightShields = this.rightPlayer.wonder.militaryStrength;

    return {
      positive: (playerShields > leftShields) + (playerShields > rightShields),
      negative: (playerShields < leftShields) + (playerShields < rightShields),
    };
  }

  assignHand (hand) {
    this.#hand = hand;
  }

  addCoins (coins) {
    this.#coins += coins;
  }

  updateStatus (status) {
    this.#status = status;
  }

  updateHand (cardName) {
    const indexOfCard = _.findIndex(
      this.#hand,
      (handCard) => cardName === handCard.name,
    );

    _.remove(this.#hand, (_ele, idx) => idx === indexOfCard);
  }

  playerData () {
    const data = {
      name: this.name,
      wonder: this.#wonder.name,
      coins: this.#coins,
      warTokens: this.calculateWarPoints(),
      stage: this.#wonder.staged,
      buildings: this.#wonder.buildings,
      bonusResource: this.#wonder.bonusResource,
    };

    return data;
  }

  getOtherPlayerData () {
    const data = [];
    let otherPlayer = this.#leftPlayer.leftPlayer;

    while(otherPlayer.playerID !== this.#rightPlayer.playerID) {
      data.push(otherPlayer.playerData());
      otherPlayer = otherPlayer.leftPlayer;
    }

    return data;
  }

  getOtherPlayersStatus () {
    const playersStatus = [];
    let otherPlayer = this.#leftPlayer.leftPlayer;
    while(otherPlayer.playerID !== this.#rightPlayer.playerID) {
      playersStatus.push(otherPlayer.status);
      otherPlayer = otherPlayer.leftPlayer;
    }

    return playersStatus;
  }

  #makeBuildDes (canBuild, msg) {
    return {
      canBuild,
      buildDetails: {
        noOfResources: 0,
        resourcesReq: 0,
        msg,
      },
    };
  }

  resourcesGot (cost, costPending) {
    const costPendingMap = _.keyBy(costPending, "type");
    return cost.map(({type, count}) => {
      const coveredCount = count - costPendingMap[type].count;
      return {type, count: coveredCount};
    });
  }

  coverWithChoices () {
    const usedChoices = new Set();
    const choices = this.wonder.resources.choices;

    return (resource, count) => {
      if(count <= 0) return 0;

      let costCovered = 0;

      for(
        let index = 0;
        index < choices.length && costCovered < count;
        index++
      ) {
        const choiceResources = choices[index];
        const available = !usedChoices.has(index);
        const resourceIncluded = choiceResources.has(resource);

        if(available && resourceIncluded) {
          costCovered++;
          usedChoices.add(index);
        }
      }

      return costCovered;
    };
  }

  haveResources (cost) {
    const resources = this.wonder.resources;
    const costPending = [];
    const coveredFromChoice = this.coverWithChoices();

    cost.forEach(({type, count}) => {
      const resourceAvailable = resources[type] || 0;
      let pendingCount = count - resourceAvailable;
      pendingCount -= coveredFromChoice(type, pendingCount);

      if(pendingCount > 0) costPending.push({type, count: pendingCount});
    });

    return costPending;
  }

  tradeDetails (cost, costPending, payableCoin = 2) {
    const resourcesGot = this.resourcesGot(cost, costPending);

    return resourcesGot.map(({type, count}) =>
      ({type, count, rate: (count * payableCoin)}));
  }

  totalCost (neighbor) {
    return neighbor.reduce(({rate}, total) => rate + total, 0);
  }

  canTrade ({leftPlayer, rightPlayer}, cost) {
    const coins = this.#coins;
    let coinsNeeded = 0;
    const leftPlayerMap = _.keyBy(leftPlayer, "type");
    const rightPlayerMap = _.keyBy(rightPlayer, "type");

    const costsCovered = cost.every(({type, count}) => {
      coinsNeeded += (leftPlayerMap[type]?.cost || 0) + (rightPlayerMap[type]?.cost || 0);
      const itemCount = (leftPlayerMap[type]?.count || 0) + (rightPlayerMap[type]?.count || 0);

      return itemCount >= count && coinsNeeded <= coins;
    });

    return costsCovered;
  }

  resourcesFromNeighbour (cost) {
    const trade = {};

    const leftPlayerPendings = this.leftPlayer.haveResources(cost);
    trade.leftPlayer = this.tradeDetails(cost, leftPlayerPendings);

    const rightPlayerPendings = this.rightPlayer.haveResources(cost);
    trade.rightPlayer = this.tradeDetails(cost, rightPlayerPendings);

    const canBuy = this.canTrade(trade, cost);

    return {canBuy, trade};

  }

  canBuild (card) {
    console.log({card});
    const cost = card.cost;

    if(!(cost.length)) return {canBuy: true};

    if(cost[0]?.type === "coin") {
      const canBuy = cost[0].count <= this.#coins;

      return {canBuy};
    }

    const costPending = this.haveResources(cost);

    if(!(costPending.length)) return {canBuy: true};

    return this.resourcesFromNeighbour(costPending);

  }

  canStage () {
    const stage = this.wonder.getNextStage();
    return this.canBuild(stage.cost);
  }

  validateTrades () {
    this.#hand.forEach((card) => {
      this.#currentTrades[card.name] = this.canBuild(card.cost);
    });

    this.#currentTrades.stage = this.canStage();
  }

  deductCoins (card) {
    const coinCost = card.cost.find(({type}) => type === "coin");
    if(coinCost) this.#coins -= coinCost.count;
  }

  addBenefits (card) {
    const benefits = card.produces.find(({type}) => type === "coin");
    if(benefits) this.#coins += benefits.count;
  }
  #hasNoCost (cost) {
    return cost.length === 0;
  }

  #isCostTypecoin (cost) {
    return cost.length === 1 && cost[0]?.type === "coin";
  }

  #playerHasResources (tradeCost) {
    return tradeCost.length === 0;
  }

  #buildDetails (cost) {
    if(this.#hasNoCost(cost)) {
      return this.#makeBuildDes(true, "no resources required");
    }

    if(this.#isCostTypecoin(cost)) {
      console.log("Entered the 2nd if");
      console.log(cost, this.#coins);

      const canBuild = cost[0].count <= this.#coins;
      return this.#makeBuildDes(canBuild, "pay bank");
    }

    const playerTradeCost = this.haveResources(cost);

    if(this.#playerHasResources(playerTradeCost)) {
      return this.#makeBuildDes(true, "had enough resources");
    }

    return {canBuild: false, buildDetails: {}};
  }

  #getBuildDetails (card) {
    const cost = card.cost;

    return this.#buildDetails(cost);
  }

  #addActionDetails (card) {
    const {canBuild, buildDetails} = this.#getBuildDetails(card);

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

  getHandData () {
    return this.#hand.map((card) => this.#addActionDetails(card));
  }

  buildCard (cardName) {
    const card = [...this.#hand].find((card) => card.name === cardName);

    this.deductCoins(card);
    this.addBenefits(card);
    this.#view = "upto-date";

    this.#wonder.build(card);
    this.updateHand(cardName);
  }

  setTempAct (action) {
    this.#tempAct = action;
  }

  discardCard (cardName) {
    this.updateHand(cardName);
    this.addCoins(3);
  }

  updateViewStatus (status) {
    this.#view = status;
  }
}

export {Player};
