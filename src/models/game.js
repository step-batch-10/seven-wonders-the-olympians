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
  #noOfPlayers;
  #gameStatus;
  #currentAge;
  #wonders;
  #discardedDeck;
  #decks;
  #round;
  shuffleDeck;
  #hands;

  constructor(noOfPlayers, player, shuffleDeck = shuffleArray) {
    this.#noOfPlayers = noOfPlayers;
    this.#players = [player];
    this.#gameID = Game.generateUniqueGameID();
    this.#gameStatus = "waiting";
    this.#currentAge = 0;
    this.#discardedDeck = [];
    this.shuffleDeck = shuffleDeck;
    this.#wonders = this.shuffleDeck(wonders);
    this.#decks = {
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
    return this.#players.length === this.#noOfPlayers;
  }

  get gameID() {
    return this.#gameID;
  }

  get gameStatus() {
    return this.#gameStatus;
  }

  get discardedDeck() {
    return this.#discardedDeck;
  }

  set currentAge(currentAge) {
    this.#currentAge = currentAge;
  }

  get currentAge() {
    return this.#currentAge;
  }

  set round(round) {
    this.#round = round;
  }

  get round() {
    return this.#round;
  }

  static generateUniqueGameID() {
    return "gid" + uniqid();
  }

  addPlayer(player) {
    if (this.gameStatus === "matched") {
      throw new Error("Room is full!");
    }

    this.#players.push(player);
    if (this.#players.length >= this.#noOfPlayers) {
      this.#gameStatus = "matched";
      this.init();
    }
  }

  init() {
    this.#currentAge = 1;
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
      const wonderName = this.#wonders.pop();
      const wonderData = wondersData.find(({ name }) => name === wonderName);
      const wonder = new Wonder(wonderData);

      player.wonder = wonder;
    });
  }

  segregateCards(cards) {
    return cards.filter((card) => card.min_players <= this.#noOfPlayers);
  }

  setUpTheCardDecks() {
    this.#decks[1] = this.segregateCards(ageOneCards);
    this.#decks[2] = this.segregateCards(ageTwoCards);
    this.#decks[3] = this.segregateCards(ageThreeCards);
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
    this.#discardedDeck.push(card);
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

  isLastRound = () => {
    return this.#round === 6;
  };

  resetRound() {
    this.#round = 0;
  }

  nextRound() {
    this.#round++;
  }

  nextAge() {
    this.#currentAge++;
  }

  endAgeDiscards() {
    this.#players.forEach((player) => {
      this.addToDiscarded(player.hand);
    });
  }

  militaryConflicts() {
    this.#players.forEach((player) => {
      player.calculateWarPoints(this.currentAge);
    });
  }

  endAge() {
    this.endAgeDiscards();
    if (this.#currentAge > 3) {
      this.endGame();
    }
  }

  passHands() {
    this.nextRound();

    if (this.isLastRound()) {
      return this.endAge();
    }

    this.#currentAge === 2 ? this.#passRight() : this.#passLeft();
  }

  makeHands() {
    const cardsDeck = this.shuffleDeck(this.#decks[this.#currentAge]);

    this.#hands = [];
    for (let i = 0; i < this.#noOfPlayers; i++) {
      this.#hands.push(cardsDeck.splice(0, 7));
    }
  }

  distributeCards() {
    this.makeHands();
    this.#players.forEach((player, idx) => player.assignHand(this.#hands[idx]));
  }

  initAge() {
    this.resetRound();
    this.distributeCards();
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
    const hand = player.getHandData();
    return { isLastRound: this.isLastRound(), hand };
  }

  #buildCard(card, player) {
    player.buildCard(card);
  }

  #discardCard(card, player) {    
    player.discardCard(card);
    this.addToDiscarded(card);
  }

  #stageCard(card, player) {
    player.stageCard(card);
  }

  performAction(player) {
    const { action, card } = player.tempAct;
    switch (action) {
      case "discard":
        this.#discardCard(card, player);
        break;
      case "build":
        this.#buildCard(card, player);
        break;
      case "stage":
        this.#stageCard(card, player);
        break;
    }
  }

  executeTempActs() {
    this.#players.forEach((player) => {
      this.performAction(player)
    });
  }

  updatePlayersStatus() {
    this.#players.forEach((player) => {
      player.updateStatus("waiting");
      player.updateViewStatus(false);
    });
  }

  doesEveryOneDoneWithWar() {
    return this.players.every((player) => player.doneWithConflict);
  }

  doesNoOneDoneWithWar() {
    return this.players.every((player) => !player.doneWithConflict);
  }

  endGame() {}
}

export { Game };
