import * as api from "./game_model.js";
import * as uiView from "./game_view.js";

const renderGame = async (hand) => {
  const data = await api.fetchPlayersDetails();

  uiView.renderPlayerInfo(data);
  uiView.renderNeighbours(data);
  uiView.renderOtherPlayerStats(data);

  uiView.renderDeck(hand, api.postPlayerAction);
};

const renderUpdatedGame = async (hand) => {
  const updateViewResponse = await api.updatePlayerView();

  uiView.notify(updateViewResponse.message);
  uiView.removeWaitingWindow();
  renderGame(hand);
};

const pollForPlayerStatus = () => {
  setInterval(async () => {
    const playersStatus = await api.getPlayersStatus();
    console.log(playersStatus);

    const { view } = await api.getPlayersViewStatus();
    console.log(view);

    if (view === "not upto-date") {
      const { isLastRound, hand } = await api.fetchDeck();
      if (isLastRound) {
        document.querySelector(".waiting-window").remove();
        await uiView.renderMilitaryConflicts(
          await api.fetchMilitaryConflicts(),
        );
        return gameManager();
      }
      return renderUpdatedGame(hand);
    }
  }, 1500);
};

const gameManager = async () => {
  const { _, hand } = await api.fetchDeck();
  await uiView.renderAge(await api.fetchAge());
  renderGame(hand);
};

const main = async () => {
  await gameManager();
  pollForPlayerStatus();
};

globalThis.onload = main;
