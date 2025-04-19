import uniqid from "uniqid";

class Player {
  #name;
  #playerID;
  rightPlayer;
  leftPlayer;
  #coins;
  warTokens;
  hand;
  oldHand;
  wonder;
  status;

  constructor(userName) {
    this.#name = userName;
    this.#playerID = Player.generateUniquePlayerID();
    this.rightPlayer = null;
    this.leftPlayer = null;
    this.#coins = 0;
    this.warTokens = [];
    this.hand = new Set();
    this.oldHand = new Set();
    this.wonder = null;
    this.status = "waiting";
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

  get warTokensObj() {
    return this.warTokens.reduce(
      (total, token) => {
        token < 0 ? (total.negative -= token) : (total.positive += token);
        return total;
      },
      { positive: 0, negative: 0 },
    );
  }

  assignHand(hand) {
    this.hand = hand;
  }

  addCoins(coins) {
    this.#coins += coins;
  }

  udpateStatus(status) {
    this.status = status;
  }

  updateHand(card) {
    this.hand.delete(card);
  }

  selectCard() {}

  playerData() {
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

  getOtherPlayerData() {
    const data = [];
    let otherPlayer = this.leftPlayer.leftPlayer;
    while (otherPlayer.playerID !== this.rightPlayer.playerID) {
      data.push(otherPlayer.playerData());
      otherPlayer = otherPlayer.leftPlayer;
    }

    return data;
  }

  buildCard(cardName) {
    const card = [...this.hand].find((card) => (card.name = cardName));

    this.wonder.build(card);
    this.updateHand(card);
  }
}

export { Player };
