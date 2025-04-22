const fetchPlayersDetails = async () =>
  await (await fetch("/game/info")).json();

const fetchDeck = async () => await (await fetch("/game/cards")).json();

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
    body: JSON.stringify({ status: "upto-date" }),
  });

  return await response.json();
};

export {
  fetchDeck,
  fetchPlayersDetails,
  getPlayersStatus,
  getPlayersViewStatus,
  postPlayerAction,
  updatePlayerView,
};
