import * as uiView from "./game_view.js";
import { SevenWonders } from "./game_model.js";

const renderGame = async (sevenWonders, hand) => {
  const data = await sevenWonders.requestJsonData("/game/info");

  uiView.renderPlayerInfo(data);
  uiView.renderNeighbours(data);
  uiView.renderOtherPlayerStats(data);
  uiView.renderDeck(
    hand,
    sevenWonders.postPlayerAction,
    sevenWonders.resetPlayerAction,
  );
};

const renderUpdatedGame = async (sevenWonders, hand) => {
  const updateViewResponse = await sevenWonders.updatePlayerView();

  uiView.notify(updateViewResponse.message);
  uiView.removeWaitingWindow();
  renderGame(sevenWonders, hand);
};

const endAnAge = async (sevenWonders) => {
  document.querySelector(".waiting-window")?.remove();
  const conflictData = await sevenWonders.requestJsonData(
    "/game/military-conflicts",
  );

  await uiView.renderMilitaryConflicts(conflictData);
  const { age } = await sevenWonders.requestJsonData("/game/age");
  await uiView.renderAge(age);
  return;
};

const pollGameState = async (sevenWonders) => {
  sevenWonders.requestJsonData("/game/players-status");
  const { isUptoDate } = await sevenWonders.requestJsonData("/player/view");

  if (!isUptoDate) {
    const { isLastRound, hand } = await sevenWonders.requestJsonData(
      "/game/cards",
    );

    if (isLastRound) return await endAnAge(sevenWonders);

    return renderUpdatedGame(sevenWonders, hand);
  }
};

const pollForPlayerStatus = (sevenWonders) => {
  setInterval(async () => {
    await pollGameState(sevenWonders);
  }, 1500);
};

const gameManager = async (sevenWonders) => {
  const { hand } = await sevenWonders.requestJsonData("/game/cards");
  const { age } = await sevenWonders.requestJsonData("/game/age");

  await uiView.renderAge(age);
  renderGame(sevenWonders, hand);
};

const main = async () => {
  const sevenWonders = new SevenWonders();
  await gameManager(sevenWonders);
  pollForPlayerStatus(sevenWonders);
};

globalThis.onload = main;
