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
    this.#result = { coins: 0 };
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

  buyResources(cart, resources, cost, i) {
    const resource = resources.find(
      (res) => res.type === cost.type && !cart.resourceIds.has(res.id),
    );
    cart.toBuy.set(i, cost);

    if (!resource) return;
    cart.resourceIds.add(resource.id);
    cart.resources.push(resource);
    cart.toBuy.delete(i);

    if (resource.count >= cost.count) return;

    const newCost = { type: cost.type, count: cost.count - resource.count };
    return this.buyResources(cart, resources, newCost, i);
  }

  choices(cart, resources, [id, cost], i) {
    const resource = resources.find(
      (res) => res.type === "choice" && !cart.resourceIds.has(res.id),
    );
    cart.toBuy.set(id, { type: cost.type, count: cost.count });

    if (!resource) return;
    cart.resourceIds.add(resource.id);
    cart.resources.push(resource);

    if (!resource.options.includes(cost.type)) {
      return this.choices(cart, resources, [id, cost], i);
    }

    cart.toBuy.delete(id);

    if (resource.count >= cost.count) return;

    const newCost = { type: cost.type, count: cost.count - resource.count };
    return this.choices(cart, resources, [id, newCost], i);
  }

  calculateCost(cost) {
    const resources = this.#wonder.resources;
    const cart = {
      toBuy: new Map(),
      resourceIds: new Set(),
      cost: new Map(),
      resources: [],
    };

    cost.forEach(this.buyResources.bind(this, cart, resources));
    this.#cart = cart;

    if (cart.toBuy.size === 0) return cart;
    [...cart.toBuy].forEach(this.choices.bind(this, cart, resources));

    return cart;
  }

  #executeTempCard() {
    if (this.#tempCard) this.wonder.build(this.#tempCard);
    this.#tempCard = null;
  }

  playerData() {
    this.#executeTempCard();
    const data = {
      name: this.name,
      wonder: this.#wonder.name,
      coins: this.#result.coins,
      warTokens: this.warTokensObj,
      stagedCards: this.#wonder.staged,
      stages: this.#wonder.stages,
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

      this.#result[type] += playedBy.staged.length * count; //TODO: type of result
    });
  }

  #cardColourEffect({ appliesTo, cardColor, count, type }, players) {
    appliesTo.forEach((player) => {
      const played = player === "self" ? this : players[player];
      const buildings = played.#wonder.buildings;

      this.#result[type] += buildings[cardColor].length * count;
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

  #getPlayerEffect(direction, cart) {
    const player = `${direction}Neighbour`;
    return this.#effects.find(
      (eff) => eff.appliesTo.includes(player) && !cart.effectIds.has(eff.id),
    );
  }

  #getTradeOptions(id, cart, direction, trades, resources) {
    console.log({ trades });
    const resource = resources.find((res) => res.id === id);
    const effect = this.#getPlayerEffect(direction, cart);

    if (!effect) return trades.push({ coin: 2, ...resource });
    cart.effectIds.add(effect.id);

    if (!effect.options.includes(resource.type)) {
      return this.#getTradeOptions(id, cart, direction, trades, resources);
    }

    const noOfCoins = effect.cost.find(({ type }) => type === "coin");
    cart.effectIds = new Set();
    return trades.push({ coin: noOfCoins.count, ...resource });
  }

  #useEffects({ resourceIds, resources }, direction, playerCart) {
    const trades = [];
    if (resourceIds.size === 0) return { canTrade: false }; //

    [...resourceIds].forEach((id) => {
      const getTradeOptions = this.#getTradeOptions.bind(this);
      getTradeOptions(id, playerCart, direction, trades, resources);
    });

    return { trades };
  }

  isResourceInChoice({ type, options }, resourceType) {
    return type === "choice" && options.includes(resourceType);
  }

  totalResources(trades, type) {
    const resourceCards = trades.filter(
      (res) => res.type === type || this.isResourceInChoice(res, type),
    );

    return resourceCards.reduce(
      (total, { count, coin }) => {
        total.count += count;
        total.coin += coin;
        return total;
      },
      { count: 0, coin: 0 },
    );
  }

  possibleTrades(leftTrades, rightTrades, cart, canTrade) {
    console.log({ leftTrades, rightTrades });
    return [...cart.toBuy].some(([_, { type, count }]) => {
      const left = leftTrades
        ? this.totalResources(leftTrades, type)
        : { coin: 0, count: 0 };
      const right = rightTrades
        ? this.totalResources(rightTrades, type)
        : { coin: 0, count: 0 };

      canTrade.neededCoins += Math.min(left.coin, right.coin) ||
        Math.max(left.coin, right.coin);

      return left.count >= count || right.count >= count;
    });
  }

  #canTrade(left, right, cart) {
    const leftTrades = left?.trades;
    const rightTrades = right?.trades;

    console.log(left, right, "trades");
    if (!leftTrades && !rightTrades) return false;

    const trade = { neededCoins: 0 };

    const hasTrade = this.possibleTrades(leftTrades, rightTrades, cart, trade);

    return hasTrade && trade.neededCoins <= this.#result.coins;
  }

  resourcesFromNeighbour() {
    const cart = this.#cart;
    cart.effectIds = new Set();

    const cost = [...cart.toBuy].map(([_, cost]) => cost);

    const leftPlayerCart = this.#leftPlayer.calculateCost(cost);
    const rightPlayerCart = this.#rightPlayer.calculateCost(cost);

    const leftTrades = this.#useEffects(leftPlayerCart, "left", cart);
    const rightTrades = this.#useEffects(rightPlayerCart, "right", cart);

    const canTrade = this.#canTrade(leftTrades, rightTrades, cart);

    this.#cart = null;
    return { canTrade, trade: { leftTrades, rightTrades } };
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
    const { canTrade, trade } = this.resourcesFromNeighbour();
    return canTrade ? this.#addAction(actions, "trade", trade) : null;
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

  buildCard(cardName) {
    const card = this.#hand.find((card) => card.name === cardName);

    this.addBenefits(card);
    this.#isUptoDate = true;
    this.#tempCard = card;
    this.updateHand(cardName);
  }

  stageCard(cardName) {
    const card = this.#hand.find((card) => card.name === cardName);

    this.#wonder.stage(card);
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
