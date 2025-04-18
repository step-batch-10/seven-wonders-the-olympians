import uniqid from "uniqid";

class Player {
  name;
  playerId;
  rightPlayer;
  leftPlayer;
  coins;
  warTokens;
  hand;
  oldHand;
  wonder;

  constructor(userName) {
    this.name = userName;
    this.playerId = Player.generateUniquePlayerID();
    this.rightPlayer = null;
    this.leftPlayer = null;
    this.coins = 0;
    this.warTokens = [];
    this.hand = new Set();
    this.oldHand = new Set();
    this.wonder = null;
  }

  static generateUniquePlayerID() {
    return "pid" + uniqid();
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
    this.coins += coins;
  }

  updateHand(card) {
    this.hand.delete(card);
  }

  selectCard() {}

  playerData() {
    const data = {
      name: this.name,
      wonder: this.wonder.name,
      coins: this.coins,
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
    while (otherPlayer.playerId !== this.rightPlayer.playerId) {
      data.push(otherPlayer.playerData());
      otherPlayer = otherPlayer.leftPlayer;
    }

    return data;
  }
}

export { Player };
