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
}

const fetchPlayersDetails = async () =>
  await (await fetch("/game/info")).json();

const fetchDeck = async () => await (await fetch("/game/cards")).json();

const fetchAge = async () => await (await fetch("/game/age")).json();

const fetchMilitaryConflicts = async () =>
  await (await fetch("/game/military-conflicts")).json();

const postPlayerAction = async (move) => {
  const response = await fetch("/player/action", {
    body: JSON.stringify(move),
    headers: { "content-type": "application/json" },
    method: "POST",
  });

  return await response.json();
};

const getPlayersStatus = async () =>
  await (await fetch("/game/players-status")).json();

const getPlayersViewStatus = async () =>
  await (await fetch("/player/view")).json();

const updatePlayerView = async () => {
  const response = await fetch("/player/view", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ isUptoDate: "upto-date" }),
  });

  return await response.json();
};

export {
  fetchAge,
  fetchDeck,
  fetchMilitaryConflicts,
  fetchPlayersDetails,
  getPlayersStatus,
  getPlayersViewStatus,
  postPlayerAction,
  updatePlayerView,
};
