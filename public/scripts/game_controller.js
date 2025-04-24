import * as api from "./game_model.js";
import * as uiView from "./game_view.js";
import { SevenWonders } from "./game_model.js";

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
        document.querySelector(".waiting-window")?.remove();
        await uiView.renderMilitaryConflicts(
          await api.fetchMilitaryConflicts(),
        );
        await uiView.renderAge(await api.fetchAge());
        return;
      }
      return renderUpdatedGame(hand);
    }
  }, 1500);
};

const gameManager = async (sevenWonders) => {
  const cardsRes = await sevenWonders.fetchGetReq("/game/cards");
  const { hand } = await sevenWonders.toJson(cardsRes);
  const ageRes = await sevenWonders.fetchGetReq("/game/age");
  const { age } = await sevenWonders.toJson(ageRes);

  await uiView.renderAge(age);
  renderGame(hand);
};

const main = async () => {
  const sevenWonders = new SevenWonders();

  await gameManager(sevenWonders);
  pollForPlayerStatus();
};

globalThis.onload = main;
