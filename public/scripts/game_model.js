export class SevenWonders {
  async fetchGetReq(url) {
    return await fetch(url);
  }

  async toJson(req) {
    return await req.json();
  }

  async toText(req) {
    return await req.text();
  }

  async requestJsonData(url) {
    const req = await this.fetchGetReq(url);
    return await this.toJson(req);
  }

  updatePlayerView = async () => {
    const res = await fetch("/player/view", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ isUptoDate: true }),
    });

    return await this.toJson(res);
  };

  postPlayerAction = async (move) => {
    const res = await fetch("/player/action", {
      body: JSON.stringify(move),
      headers: { "content-type": "application/json" },
      method: "POST",
    });

    return await this.toJson(res);
  };
}

// const fetchPlayersDetails = async () =>
//   await (await fetch("/game/info")).json();

// const fetchDeck = async () => await (await fetch("/game/cards")).json();

// const fetchAge = async () => await (await fetch("/game/age")).json();

// const fetchMilitaryConflicts = async () =>
//   await (await fetch("/game/military-conflicts")).json();

// const getPlayersStatus = async () =>
//   await (await fetch("/game/players-status")).json();

// const getPlayersViewStatus = async () =>
//   await (await fetch("/player/view")).json();

export {}; // fetchAge,
// fetchDeck,
// fetchMilitaryConflicts,
// fetchPlayersDetails,
// getPlayersStatus,
// getPlayersViewStatus,
// postPlayerAction,
// updatePlayerView,
