import { SevenWonders } from "./game_model.js";

const gameStatus = async (sevenWonders, intervalId) => {
  const res = await sevenWonders.fetchGetReq("/game/status");
  const data = await sevenWonders.toJson(res);

  if (data.status === "matched") {
    clearInterval(intervalId);
    globalThis.location.replace("/player_wonder.html");
  }
};

const pollGameStatus = (sevenWonders) => {
  //common function for polling
  const intervalId = setInterval(() => {
    gameStatus(sevenWonders, intervalId);
  }, 1000);
};

const renderPlayerName = (name) => {
  const field = document.getElementById("name");
  field.innerText = `Hey ${name}`;
};

const main = async () => {
  const sevenWonders = new SevenWonders();
  const res = await sevenWonders.fetchGetReq("/player/name");
  const name = await sevenWonders.toText(res);
  console.log(name);
  renderPlayerName(name);
  pollGameStatus(sevenWonders);
};

globalThis.onload = main;
