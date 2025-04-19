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
    console.log({card, player: this.name});

    console.log(
      "before: %o",
      this.hand.map((card) => card.name),
    );

    const indexOfCard = _.findIndex(
      this.hand,
      (handCard) => card === handCard.name,
    );
    _.remove(this.hand, (_ele, idx) => idx === indexOfCard);

    console.log(
      "after: %o",
      this.hand.map((card) => card.name),
    );
  }

  selectCard () {}

  haveResources (cost) {
    const resources = this.wonder.resources;
    const choices = resources.choices;
    const choicesTook = [];

    return cost.every(({type, count}) => {
      const resource = resources[type];
      let pendingResource = count - resource;

      if(pendingResource <= 0) return true;

      return choices.some((choiceResources, index) => {
        const availabe = !(choicesTook.includes(index));

        if(availabe && choiceResources.has(resource)) {
          pendingResource--;
          choicesTook.push(index);
        }

        return pendingResource <= 0;
      });
    });
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
    const card = [...this.hand].find((card) => (card.name = cardName));

    this.wonder.build(card);
    this.updateHand(card);
  }
}

export {Player};
