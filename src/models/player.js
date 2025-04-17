// import type { uidGenerator } from "../type-alias.ts";
import uniqid from "uniqid";
// import { BaseCard } from "./cards.ts";
class Player {
  name;
  playerId;
  rightNeighbor;
  leftNeighbor;
  coins;
  hand;

  constructor(userName) {
    this.name = userName;
    this.playerId = Player.generateUniquePlayerID();
    this.rightNeighbor = null;
    this.leftNeighbor = null;
    this.coins = 0;
    this.hand = new Set();
  }

  static generateUniquePlayerID() {
    return "pid" + uniqid();
  }

  assignHand(hand) {
    this.hand = hand;
  }

  selectCard() {}
}

export { Player };
