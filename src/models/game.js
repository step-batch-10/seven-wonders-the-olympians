import uniqid from "uniqid";
class Game {
  gameID;
  players;
  noOfPlayers;
  gameStatus;
  currentAge;

  constructor(noOfPlayers, player1) {
    this.noOfPlayers = noOfPlayers;
    this.players = [player1];
    this.gameID = Game.generateUniqueGameID();
    this.gameStatus = "waiting";
    this.currentAge = 0;
  }

  get isGameFull() {
    return this.players.length === this.noOfPlayers;
  }

  static generateUniqueGameID() {
    return "gid" + uniqid();
  }

  addPlayer(player) {
    if (this.gameStatus === "matched") {
      throw new Error("Room is full!");
    }
    this.players.push(player);
    if (this.players.length >= this.noOfPlayers) {
      this.gameStatus = "matched";
      this.init();
    }
  }

  init() {
    this.currentAge = 1;
    this.arrangePlayers();
    this.distributeWonders();
    this.distributeCoins();
    this.setUpTheCardDecks();
    this.initAge();
  }

  arrangePlayers() {
    this.players.forEach((player, idx) => {
      player.rightNeighbor = this.players[(idx + 1) % this.players.length];
      player.leftNeighbor =
        this.players[(idx + this.players.length - 1) % this.players.length];
    });
  }

  distributeWonders() {}

  distributeCoins() {}

  setUpTheCardDecks() {}

  distributeCards() {
    //create random four deck
    //assign the deck to each player
  }

  initAge() {
    this.distributeCards();
  }
}

export { Game };
