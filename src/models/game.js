import uniqid from "uniqid";
import wondersData from "../../data/wonders.json" with { type: "json" };
import ageOneCards from "../../data/ageOneCards.json" with { type: "json" };
import ageTwoCards from "../../data/ageTwoCards.json" with { type: "json" };
import ageThreeCards from "../../data/ageThreeCards.json" with { type: "json" };
import { Wonder } from "./wonder.js";

class Game {
  #gameID;
  #players;
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
  ageOneDeck;
  ageTwoDeck;
  ageThreeDeck;

  constructor(noOfPlayers, player1) {
    this.noOfPlayers = noOfPlayers;
    this.#players = [player1];
    this.#gameID = Game.generateUniqueGameID();
    this.gameStatus = "waiting";
    this.currentAge = 0;
    this.discardedDeck = [];
  }

  get isGameFull() {
    return this.#players.length === this.noOfPlayers;
  }

  get gameID() {
    return this.#gameID;
  }

  static generateUniqueGameID() {
    return "gid" + uniqid();
  }

  addPlayer(player) {
    if (this.gameStatus === "matched") {
      throw new Error("Room is full!");
    }
    this.#players.push(player);
    if (this.#players.length >= this.noOfPlayers) {
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
    this.#players.forEach((player, idx) => {
      player.rightPlayer = this.#players[(idx + 1) % this.#players.length];
      player.leftPlayer =
        this.#players[(idx + this.#players.length - 1) % this.#players.length];
    });
  }

  distributeWonders() {
    this.#players.forEach((player) => {
      const wonderName = this.wonders.pop();
      const wonderData = wondersData[wonderName];
      const wonder = new Wonder(wonderData);

      player.wonder = wonder;
    });
  }

  segregateCards() {
    this.ageOneDeck = ageOneCards.filter((card) =>
      card.min_players <= this.noOfPlayers
    );
    this.ageTwoDeck = ageTwoCards.filter((card) =>
      card.min_players <= this.noOfPlayers
    );
    this.ageThreeDeck = ageThreeCards.filter((card) =>
      card.min_players <= this.noOfPlayers
    );
  }

  distributeCoins() {
    this.#players.forEach((player) => {
      player.addCoins(3);
    });
  }

  setUpTheCardDecks() {}

  didAllPlayerSelectCard() {
    return this.#players.every((player) => player.status === "seleted");
  }

  addToDiscarded(card) {
    this.discardedDeck.push(card);
  }

  #passLeft() {
    const firstHand = this.#players[0].hand;
    for (let index = 0; index < this.noOfPlayers - 1; index++) {
      this.#players[index].hand = this.#players[index + 1].hand;
    }
    this.#players.at(-1).hand = firstHand;
  }

  #passRight() {
    const lastHand = this.#players.at(-1).hand;
    for (let index = this.noOfPlayers - 1; index > 0; index--) {
      this.#players[index].hand = this.#players[index - 1].hand;
    }

    this.#players[0].hand = lastHand;
  }

  passHands() {
    return this.currentAge === 2 ? this.#passRight() : this.#passLeft();
  }

  distributeCards() {
    //create random four deck
    //assign the deck to each player
  }

  initAge() {
    this.distributeCards();
  }

  gameData() {
    return {
      gameStatus: this.gameStatus,
      currentAge: this.currentAge,
    };
  }

  getPlayerInfo(playerID) {
    const player = this.#players.find((player) => player.playerID === playerID);
    const playerData = player.playerData();

    playerData.leftPlayerData = player.leftPlayer.playerData();
    playerData.rightPlayerData = player.rightPlayer.playerData();
    playerData.others = player.getOtherPlayerData();

    return playerData;
  }
}

export { Game };
