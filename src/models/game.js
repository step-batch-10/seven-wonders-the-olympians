import uniqid from "uniqid";
import wondersData from "../../data/wonders.json" with { type: "json" };
import ageOneCards from "../../data/ageOneCards.json" with { type: "json" };
import ageTwoCards from "../../data/ageTwoCards.json" with { type: "json" };
import ageThreeCards from "../../data/ageThreeCards.json" with { type: "json" };
import { Wonder } from "./wonder.js";

const shuffleArray = ([...arr]) => arr.sort(() => Math.random() - 0.5);

const wonders = [
  "Babylon",
  "Rhodos",
  "Halikarnassos",
  "Alexandria",
  "Ephesos",
  "Gizah",
  "Olympia",
];

class Game {
  #gameID;
  #players;
  noOfPlayers;
  gameStatus;
  currentAge;
  wonders;
  discardedDeck;
  decks;
  round;
  shuffleDeck;
  #hands;

  constructor(noOfPlayers, player, shuffleDeck = shuffleArray) {
    this.noOfPlayers = noOfPlayers;
    this.#players = [player];
    this.#gameID = Game.generateUniqueGameID();
    this.gameStatus = "waiting";
    this.currentAge = 0;
    this.discardedDeck = [];
    this.shuffleDeck = shuffleDeck;
    this.wonders = this.shuffleDeck(wonders);
    this.decks = {
      1: null,
      2: null,
      3: null,
    };
    this.round = 0;
  }

  get players() {
    return this.#players;
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
      const wonderData = wondersData.find(({ name }) => name === wonderName);
      const wonder = new Wonder(wonderData);

      player.wonder = wonder;
    });
  }

  segregateCards(cards) {
    return cards.filter((card) => card.min_players <= this.noOfPlayers);
  }

  setUpTheCardDecks() {
    this.decks[1] = this.segregateCards(ageOneCards);
    this.decks[2] = this.segregateCards(ageTwoCards);
    this.decks[3] = this.segregateCards(ageThreeCards);
  }

  distributeCoins() {
    this.#players.forEach((player) => {
      player.addCoins(3);
    });
  }

  didAllPlayerSelectCard() {
    return this.#players.every((player) => player.status === "selected");
  }

  addToDiscarded(card) {
    this.discardedDeck.push(card);
  }

  #passLeft() {
    const firstHand = this.#hands.shift();
    this.#hands.push(firstHand);
    this.#players.forEach((player, idx) => player.assignHand(this.#hands[idx]));
  }

  #passRight() {
    const lastHand = this.#hands.pop();
    this.#hands.unshift(lastHand);
    this.#players.forEach((player, idx) => player.assignHand(this.#hands[idx]));
  }

  #isLastRound = () => {
    return this.round === 6;
  };

  #resetRound() {
    this.round = 0;
  }

  #nextRound() {
    this.round++;
  }

  endAgeDiscards() {
    this.#players.forEach((player) => {
      this.addToDiscarded(player.hand);
    });
  }

  militaryConflicts() {
    this.#players.forEach((player) => {
      console.log("war tokens--->", player.warTokensObj);
    });
  }

  endAge() {
    this.endAgeDiscards();
    return this.militaryConflicts();
  }

  passHands() {
    this.#nextRound();
    console.log("round-->", this.round);

    if (this.#isLastRound()) {
      return this.endAge();
    }

    return this.currentAge === 2 ? this.#passRight() : this.#passLeft();
  }

  makeHands() {
    const cardsDeck = this.shuffleDeck(this.decks[this.currentAge]);

    this.#hands = [];
    for (let i = 0; i < this.noOfPlayers; i++) {
      this.#hands.push(cardsDeck.splice(0, 7));
    }
  }

  distributeCards() {
    this.makeHands();
    this.#players.forEach((player, idx) => player.assignHand(this.#hands[idx]));
  }

  initAge() {
    this.#resetRound();
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

  getPlayersStatus(playerID) {
    const player = this.#players.find((player) => player.playerID === playerID);
    const playersStatus = { status: player.status };

    playersStatus.leftPlayerStatus = player.leftPlayer.status;
    playersStatus.rightPlayerStatus = player.rightPlayer.status;
    player.others = player.getOtherPlayersStatus();

    return playersStatus;
  }

  getPlayerHandData(playerID) {
    const player = this.#players.find((player) => player.playerID === playerID);
    return player.getHandData();
  }

  executeTempActs() {
    this.#players.forEach((player) => {
      const { action, card } = player.tempAct;
      if (action === "discard") {
        player.discardCard(card);
        this.addToDiscarded(card);
      } else if (action === "build") {
        player.buildCard(card);
      }
    });
  }

  updatePlayersStatus() {
    this.#players.forEach((player) => {
      player.updateStatus("waiting");
      player.updateViewStatus("not upto-date");
    });
  }
}

export { Game };
