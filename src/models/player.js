import uniqid from "uniqid";
import _ from "lodash";

class Player {
  #name;
  #playerID;
  #rightPlayer;
  #leftPlayer;
  #warTokens;
  #hand;
  #wonder;
  #status;
  #tempAct;
  #isUptoDate;
  #doneWithConflict;
  #tempCard;
  #effects;
  #cart;
  #result;

  constructor(userName) {
    this.#name = userName;
    this.#playerID = Player.generateUniquePlayerID();
    this.#rightPlayer = null;
    this.#leftPlayer = null;
    this.#warTokens = [];
    this.#hand = [];
    this.#wonder = null;
    this.#status = "waiting";
    this.#isUptoDate = true;
    this.#doneWithConflict = false;
    this.#tempCard = null;
    this.#effects = [];
    this.#result = { coins: 0, yellow: [], blue: [], purple: [] };
    this.#cart = null;
  }

  static generateUniquePlayerID() {
    return "pid" + uniqid();
  }

  resetDoneWithConflict() {
    this.#doneWithConflict = false;
  }

  get doneWithConflict() {
    return this.#doneWithConflict;
  }

  get name() {
    return this.#name;
  }

  get coins() {
    return this.#result.coins;
  }

  get playerID() {
    return this.#playerID;
  }

  set playerID(playerId) {
    this.#playerID = playerId;
  }

  get isUptoDate() {
    return this.#isUptoDate;
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
    this.#result["milteryPoins"] += token;
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
      leftConflict: this.conflict(this.#leftPlayer, age),
      rightConflict: this.conflict(this.#rightPlayer, age),
    };
    this.#doneWithConflict = true;

    return conflictData;
  }

  assignHand(hand) {
    this.#hand = hand;
  }

  addCoins(coins) {
    this.#result.coins += coins;
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

  #getResources(cart, type) {
    return cart.resources.find(
      (res) => res.type === type && !cart.resourceIds.has(res.id),
    );
  }

  addResources(cart, resourceFn, [id, cost]) {
    const resource = resourceFn(cart, cost.type);
    if (!resource) return;

    cart.resourceIds.add(resource.id);
    cart.usedResources.push(resource);
    cart.toBuy.delete(id);

    if (resource.count >= cost.count) return;

    const newCost = { ...cost, count: cost.count - resource.count };
    cart.toBuy.set(id, newCost);

    return this.addResources(cart, resourceFn, [id, newCost]);
  }

  #getChoiceResources(cart, type) {
    return cart.resources.find(
      (res) =>
        res.type === "choice" &&
        !cart.resourceIds.has(res.id) &&
        res.options.includes(type),
    );
  }

  calculateCost(cost) {
    const cart = {
      toBuy: new Map(),
      resourceIds: new Set(),
      resources: this.#wonder.resources,
      usedResources: [],
    };
    this.#cart = cart;

    cost.forEach((cost, i) => cart.toBuy.set(i, cost));
    const resourceFn = this.#getResources;
    [...cart.toBuy].forEach(this.addResources.bind(this, cart, resourceFn));

    const choiceFn = this.#getChoiceResources;
    [...cart.toBuy].forEach(this.addResources.bind(this, cart, choiceFn));

    return cart;
  }

  scoringData() {
    return {
      stagedCount: this.#wonder.staged.length,
      stages: this.#wonder.stages,
      buildings: this.#wonder.buildings,
      warTokens: this.warTokensObj,
    };
  }

  playerData() {
    const data = {
      name: this.name,
      wonder: this.#wonder.name,
      coins: this.#result.coins,
      warTokens: this.warTokensObj,
      stagedCards: this.#wonder.staged,
      stages: this.#wonder.stages,
      buildings: this.#wonder.buildingsName,
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
    const playersStatus = {};
    let otherPlayer = this.#leftPlayer.leftPlayer;
    while (otherPlayer.playerID !== this.#rightPlayer.playerID) {
      playersStatus[otherPlayer.name] = otherPlayer.status;
      otherPlayer = otherPlayer.leftPlayer;
    }

    return playersStatus;
  }

  deductCoins(card) {
    const coinCost = card.cost.find(({ type }) => type === "coin");
    if (coinCost) this.#result.coins -= coinCost.count;
    return this;
  }

  addValueCoins(card) {
    const coinsCard = card.produces.find(({ type }) => type === "coin");
    if (coinsCard) this.#result.coins += coinsCard.count;
    return this;
  }

  #stageEffect({ appliesTo, count, type }, players) {
    appliesTo.forEach((player) => {
      const playedBy = player === "self" ? this : players[player];

      if (type === "coin") {
        this.#result["coins"] += playedBy.staged?.length * count;
      }
    });
  }

  #cardColourEffect({ appliesTo, cardColor, count, type }, players) {
    appliesTo.forEach((player) => {
      const played = player === "self" ? this : players[player];
      const buildings = played.#wonder.buildings;

      if (type === "coin") {
        this.#result["coins"] += buildings[cardColor].length * count;
      }
    });
  }

  #buyEffect(effect) {
    this.#effects.push({ ...effect, id: Date.now() });
    return this;
  }

  addEffect(cardToBuilt, players) {
    const stage = this.#stageEffect.bind(this);
    const card = this.#cardColourEffect.bind(this);
    const buy = this.#buyEffect.bind(this);
    const effects = { stage, card, buy };

    cardToBuilt.effect?.forEach((eff) => {
      effects[eff["effectType"]](eff, players);
    });

    return this;
  }

  addBenefits(card) {
    const rightNeighbour = this.#rightPlayer;
    const leftNeighbour = this.#leftPlayer;

    const players = { rightNeighbour, leftNeighbour };
    this.deductCoins(card).addValueCoins(card).addEffect(card, players);
  }

  #getPlayerEffect(direction, resource) {
    const player = `${direction}Neighbour`;

    return this.#effects.find(
      (effect) =>
        effect.appliesTo.includes(player) &&
        effect.options.includes(resource.type),
    );
  }

  #getTradeOptions(direction, resource) {
    const effect = this.#getPlayerEffect(direction, resource);

    if (!effect) return { coin: 2, ...resource };

    const noOfCoins = effect.cost.find(({ type }) => type === "coin");
    return { coin: noOfCoins.count || 2, ...resource };
  }

  #useEffects({ resourceIds, resources }, direction) {
    return [...resourceIds].map((id) => {
      const getTradeOptions = this.#getTradeOptions.bind(this);
      const resource = resources.find((res) => res.id === id);

      return getTradeOptions(direction, resource);
    });
  }

  isResourceInChoice({ type, options }, resourceType) {
    return type === "choice" && options.includes(resourceType);
  }

  totalCount(trades, type) {
    const resourceCards = trades.filter(
      (res) => res.type === type || this.isResourceInChoice(res, type),
    );

    const count = resourceCards.reduce((total, { count }) => total + count, 0);
    const coin = resourceCards.reduce((total, { coin }) => total + coin, 0);

    return { coin, count };
  }

  canResourceTrade(cost, player, type, count, trade, side) {
    if (cost > 0 && cost === player.coin && player.count >= count) {
      trade.possibleTrades.push({ side, coin: cost, type });
      return true;
    }
  }

  isBothResource(cost, left, right, type, count, trade) {
    if (cost > 0 && right.count + left.count >= count) {
      trade.possibleTrades.push(
        { side: "right", coin: right.coin, type },
        { side: "right", coin: left.coin, type },
      );
      return true;
    }
  }

  cannotTrade(trade) {
    return !(trade.canTrade = false);
  }

  findPossibleTrade(left, right, trade, count, type) {
    const cost = Math.min(left.coin, right.coin) ||
      Math.max(left.coin, right.coin);

    return (
      this.canResourceTrade(cost, left, type, count, trade, "left") ||
      this.canResourceTrade(cost, right, type, count, trade, "right") ||
      this.isBothResource(cost, left, right, type, count, trade) ||
      this.cannotTrade(trade)
    );
  }

  possibleTrades(leftTrade, rightTrade, cart, trade) {
    return [...cart.toBuy].every(([_, { type, count }]) => {
      const left = this.totalCount(leftTrade, type, trade);
      const right = this.totalCount(rightTrade, type, trade);
      this.findPossibleTrade(left, right, trade, count, type);
      return trade.canTrade;
    });
  }

  #doNeighboursHaveResources(left, right) {
    return (
      (left.trades.length <= 0 && right.trades.length <= 0) ||
      (left.cart.toBuy.size <= 0 && right.cart.toBuy.size <= 0)
    );
  }

  #evaluteTrade(leftTrades, rightTrades, cart) {
    const trade = { canTrade: true, possibleTrades: [] };
    const hasTrade = this.possibleTrades(leftTrades, rightTrades, cart, trade);

    const allTrades = trade.possibleTrades;
    const totalCost = allTrades.reduce((total, { coin }) => total + coin, 0);
    const canTrade = hasTrade && totalCost <= this.#result.coins;

    return { canTrade, possibleTrades: trade.possibleTrades };
  }

  getTrades(player, cost, direction) {
    const cart = player.calculateCost(cost);
    const trades = this.#useEffects(cart, direction);
    return { cart, trades };
  }

  formatTrade({ canTrade, possibleTrades }) {
    const { left, right } = possibleTrades.reduce(
      (acc, trade) => {
        acc[trade.side] += trade.coin;
        return acc;
      },
      { left: 0, right: 0 },
    );

    return { canTrade, tradeOptions: { right, left } };
  }

  resourcesFromNeighbour() {
    const cart = this.#cart;
    const cost = [...cart.toBuy].map(([_, cost]) => cost);

    const left = this.getTrades(this.#leftPlayer, cost, "left");
    const right = this.getTrades(this.#rightPlayer, cost, "right");

    if (this.#doNeighboursHaveResources(left, right)) {
      return { canTrade: false };
    }

    const trades = this.formatTrade(
      this.#evaluteTrade(left.trades, right.trades, cart),
    );

    return trades;
  }

  #addAction(action, key, value = true) {
    action[key] = value;
    return action;
  }

  #isCardFree(cost, actions) {
    return cost.length === 0
      ? this.#addAction(actions, "isCardFree", true)
      : null;
  }

  #canAffordCoinCost(cost, actions) {
    const coinCost = cost.find(({ type }) => type === "coin");

    return coinCost && this.#result.coins >= coinCost.count
      ? this.#addAction(actions, "needToPayCoinsToBank", true)
      : null;
  }

  #hasEnoughResources(card, actions) {
    const cart = this.calculateCost(card.cost);

    if (cart.toBuy.size === 0) {
      this.#addAction(actions, "haveEnoughResources", true);
      return this.#addAction(actions, "cart", cart);
    }

    return null;
  }

  #hasFutureCard(card, actions) {
    return this.#wonder.futureBenefits.has(card.name)
      ? this.#addAction(actions, "isFutureCard", true)
      : null;
  }

  #trade(actions) {
    const { canTrade, tradeOptions } = this.resourcesFromNeighbour();
    return canTrade
      ? { canTrade, ...this.#addAction(actions, "trade", tradeOptions) }
      : null;
  }

  #alreadyHave(card, actions) {
    if (this.#wonder.alreadyBuilt(card.name)) {
      this.#addAction(actions, "isAlreadyBuild", true);
      return this.#addAction(actions, "canBuild", false);
    }
    return null;
  }

  #getActionDetails(card) {
    const cost = card.cost;
    const possibleActions = { canBuild: true };

    return (
      this.#alreadyHave(card, possibleActions) ||
      this.#isCardFree(cost, possibleActions) ||
      this.#canAffordCoinCost(cost, possibleActions) ||
      this.#hasFutureCard(card, possibleActions) ||
      this.#hasEnoughResources(card, possibleActions) ||
      this.#trade(possibleActions) || {
        canBuild: false,
        noResources: true,
      }
    );
  }

  #canStage() {
    const noOfStages = `stage${this.#wonder.staged.length + 1}`;
    const stageCard = this.#wonder.stages[noOfStages];
    const alreadyStaged = { canBuild: false, isStagingCompleted: true };

    const possibleActions = stageCard
      ? this.#getActionDetails(stageCard)
      : alreadyStaged;

    return { canStage: possibleActions.canBuild, ...possibleActions };
  }

  #addActionDetails(card, stage) {
    return {
      name: card.name,
      build: this.#getActionDetails(card),
      stage,
      discard: { canDiscard: true },
    };
  }

  getHandData() {
    const stage = this.#canStage();
    return this.#hand.map((card) => this.#addActionDetails(card, stage));
  }

  #executeTempCard() {
    if (this.#tempCard) this.wonder.build(this.#tempCard);
    this.#tempCard = null;
  }

  postTradeActions(action, subAction) {
    const { right, left } = action[subAction].trade;

    this.leftPlayer.addCoins(left);
    this.rightPlayer.addCoins(right);
    this.#result.coins -= left + right;
  }

  buildCard(cardName) {
    const card = this.#hand.find((card) => card.name === cardName);
    const stage = this.#canStage();
    const action = this.#addActionDetails(card, stage);

    if (action.build.canTrade) {
      this.postTradeActions(action, "build");
    }

    this.addBenefits(card);
    this.#isUptoDate = true;
    this.#tempCard = card;
    this.updateHand(cardName);
    setTimeout(this.#executeTempCard.bind(this), 0);
  }

  #getStageBenefits() {
    const stageCount = `stage${this.#wonder.staged.length}`;
    const { effects } = this.#wonder.stages[stageCount];
    const coinEffects = effects.find(({ type }) => type === "coin");
    const militaryEffect = effects.find(({ type }) => type === "military");

    if (coinEffects) this.#result.coins += coinEffects.count;
    if (militaryEffect) {
      this.wonder.increaseMilitaryStrengthBy(militaryEffect.count);
    }
  }

  stageCard(cardName) {
    const card = this.#hand.find((card) => card.name === cardName);
    const stage = this.#canStage();
    const action = this.#addActionDetails(card, stage);

    if (action.stage.canTrade) {
      this.postTradeActions(action, "stage");
    }

    this.#wonder.stage(card);
    this.#getStageBenefits();
    this.updateHand(cardName);
  }

  discardCard(cardName) {
    this.updateHand(cardName);
    this.addCoins(3);
  }

  updateViewStatus(status) {
    this.#isUptoDate = status;
  }

  resetTempAct() {
    this.#tempAct = null;
  }
}

export { Player };
