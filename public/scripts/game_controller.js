import * as api from "./game_model.js";
import * as view from "./game_view.js";

const renderGame = async () => {
  const data = await api.fetchPlayersDetails();

  view.renderPlayerInfo(data);
  view.renderNeighbours(data);
  view.renderOtherPlayerStats(data);

  const { isLastRound, hand } = await api.fetchDeck();

  if (isLastRound) {
    return view.renderMilitaryConflicts(api.fetchMilitaryConflicts());
  }

  view.renderDeck(hand, api.postPlayerAction);
};

const renderUpdatedGame = async () => {
  const updateViewResponse = await api.updatePlayerView();

  view.notify(updateViewResponse.message);
  view.removeWaitingWindow();
  renderGame();
};

const pollForPlayerStatus = () => {
  setInterval(async () => {
    const playersStatus = await api.getPlayersStatus();
    console.log(playersStatus);

    const { view } = await api.getPlayersViewStatus();
    console.log(view);

    if (view === "not upto-date") renderUpdatedGame();
  }, 2000);
};

const main = async () => {
  view.renderAge(await api.fetchAge());
  renderGame();
  pollForPlayerStatus();
  removeAgeDiv();
};

globalThis.onload = main;
