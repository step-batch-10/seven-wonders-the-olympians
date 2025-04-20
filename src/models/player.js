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
        token < 0 ? (total.negative -= token) : (total.positive += token);
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

  udpateStatus (status) {
    this.status = status;
  }

  updateHand (card) {
    const indexOfCard = _.findIndex(
      this.hand,
      (handCard) => card === handCard.name,
    );
    _.remove(this.hand, (_ele, idx) => idx === indexOfCard);
  }

  selectCard () {}

  coverWithChoices () {
    const usedChoices = new Set();
    const choices = this.wonder.resources.choices;

    return (resource, count) => {
      if(count <= 0) return 0;

      let costCovered = 0;

      for(let index = 0; index < choices.length && costCovered < count; index++) {
        const choiceResources = choices[index];
        const available = !(usedChoices.has(index));
        const resourceIncluded = choiceResources.has(resource);

        if(available && resourceIncluded) {
          costCovered++;
          usedChoices.add(index);
        }
      };

      return costCovered;
    };
  }

  haveResources ([...cost]) { // getUncoveredResources
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

  getHandData () {
    const handData = [];
    this.hand.forEach((card) => {
      handData.push({
        name: card.name,
        canBuild: true,
        canStage: false,
      });
    });
    return handData;
  }

  buildCard (cardName) {
    const card = [...this.hand].find((card) => (card.name === cardName));

    this.wonder.build(card);
    this.updateHand(card);
  }
}

export {Player};
