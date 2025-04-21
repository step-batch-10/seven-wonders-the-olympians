import uniqid from "uniqid";
import _ from "lodash";

class Player {
  #name;
  #playerID;
  rightPlayer;
  leftPlayer;
  #coins;
  warTokens;
  hand;
  wonder;
  status;
  tempAct;

  constructor (userName) {
    this.#name = userName;
    this.#playerID = Player.generateUniquePlayerID();
    this.rightPlayer = null;
    this.leftPlayer = null;
    this.#coins = 0;
    this.warTokens = [];
    this.hand = [];
    this.wonder = null;
    this.status = "waiting";
    this.view = "upto-date";
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

  get warTokensObj () {
    return this.warTokens.reduce(
      (total, token) => {
        token < 0 ? (total.negative += token) : (total.positive += token);
        return total;
      },
      {positive: 0, negative: 0},
    );
  }

  assignHand (hand) {
    this.hand = hand;
  }

  addCoins (coins) {
    this.#coins += coins;
  }

  updateStatus (status) {
    this.status = status;
  }

  updateHand (cardName) {
    const indexOfCard = _.findIndex(
      this.hand,
      (handCard) => cardName === handCard.name,
    );

    _.remove(this.hand, (_ele, idx) => idx === indexOfCard);
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
    // getUncoveredResources
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

  playerData () {
    const data = {
      name: this.name,
      wonder: this.wonder.name,
      coins: this.#coins,
      warTokens: this.warTokensObj,
      stage: this.wonder.staged,
      buildings: this.wonder.buildings,
      bonusResource: this.wonder.bonusResource,
    };

    return data;
  }

  getOtherPlayerData () {
    const data = [];
    let otherPlayer = this.leftPlayer.leftPlayer;

    while(otherPlayer.playerID !== this.rightPlayer.playerID) {
      data.push(otherPlayer.playerData());
      otherPlayer = otherPlayer.leftPlayer;
    }

    return data;
  }

  getOtherPlayersStatus () {
    const playersStatus = [];
    let otherPlayer = this.leftPlayer.leftPlayer;
    while(otherPlayer.playerID !== this.rightPlayer.playerID) {
      playersStatus.push(otherPlayer.status);
      otherPlayer = otherPlayer.leftPlayer;
    }

    return playersStatus;
  }

  getHandData () {
    const canStage = this.canStage();

    return this.hand.map((card) => ({
      name: card.name,
      canBuild: this.canBuild(card),
      canStage: canStage,
    }));
  }

  // #doesPlayerHaveResources (card, resources) {
  //   return card.cost.every(({type, count}) => {
  //     if(type === "coins" && this.#coins >= count) return true;

  //     return type in resources && resources[type] >= count;
  //   });
  // }

  canBuild (card) {
    const cost = card.cost;

    if(cost.length === 0) return true;

    if(cost[0]?.type === "coin") {
      return cost[0].count <= this.#coins;
    }

    let remainingCost = this.haveResources(cost);

    if(remainingCost.length === 0) return true;

    remainingCost = this.leftPlayer.haveResources(cost);
    if(remainingCost.lenght === 0) return true; // return money to be deducted

    remainingCost = this.rightPlayer.haveResources(cost);
    if(remainingCost.lenght === 0) return true;

    return false;
  }

  canStage () {
    const stages = this.wonder.stages;
    const toStageCount = this.wonder.staged.length + 1;
    const stageCard = stages[`stage${toStageCount}`];

    return this.canBuild(stageCard);
  }

  buildCard (cardName) {
    const card = [...this.hand].find((card) => card.name === cardName);

    //deduct coins if the card cost === coins
    this.wonder.build(card);
    this.updateHand(card);
  }

  setTempAct (action) {
    this.tempAct = action;
  }

  discardCard (cardName) {
    this.updateHand(cardName);
    this.addCoins(3);
  }

  updateViewStatus (status) {
    this.view = status;
  }
}

export {Player};
