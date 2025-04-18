import uniqid from "uniqid";
import wondersData from "../../data/wonders.json" with { type: "json" };

class Game {
  gameID;
  players;
  noOfPlayers;
  gameStatus;
  currentAge;
  wonders = [
    "babylon",
    "rhodos",
    "halikarnassos",
    "alexandria",
    "ephesos",
    "gizah",
    "olympia",
  ];
  discardedDeck;

  constructor(noOfPlayers, player1) {
    this.noOfPlayers = noOfPlayers;
    this.players = [player1];
    this.gameID = Game.generateUniqueGameID();
    this.gameStatus = "waiting";
    this.currentAge = 0;
    this.discardedDeck = [];
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

  distributeWonders() {
    this.players.forEach((player) => {
      const wonderName = this.wonders.pop();
      const wonderData = wondersData[wonderName];

      player.wonder = wonderData;
    });
  }

  distributeCoins() {
    this.players.forEach((player) => {
      player.coins = 3;
    });
  }

  setUpTheCardDecks() {}

  addToDiscarded(card) {
    this.discardedDeck.push(card);
  }

  distributeCards() {
    //create random four deck
    //assign the deck to each player
  }

  initAge() {
    this.distributeCards();
  }

  gameData() {
    // mockdata
    return {
      gameStatus: this.gameStatus,
      currentAge: this.currentAge,
    };
  }

  getPlayerInfo() {
    console.log("hello");
    return {
      name: "Akash",
      wonder: "alexandria",
      coins: 3,
      warTokens: { positive: 0, negative: 0 },
      bonusResource: "glass",

      leftPlayer: {
        name: "Siddu",
        wonder: "olympia",
        coins: 3,
        warTokens: { positive: 0, negative: 0 },
        noOfStages: 0,
        bonusResource: "wood",
        cards: [],
      },

      rightPlayer: {
        name: "Tom",
        wonder: "rhodos",
        coins: 3,
        warTokens: { positive: 0, negative: 0 },
        bonusResource: "ore",
        noOfStages: 0,
        cards: [],
      },
      others: [
        {
          name: "Alice",
          wonder: "halikarnossos",
          coins: 3,
          warTokens: { positive: 0, negative: 0 },
          noOfStages: 0,
          bonusResource: "textile",
        },
      ],
    };
  }
}

export { Game };
