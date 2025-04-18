const getPlayerDetails = async () => await (await fetch("/playerInfo")).json();

const renderWonder = (PlayerWonder) => {
  const wonderPlaceHolder = document.getElementById("wonder-placeholder");
  const img = document.createElement("img");

  img.id = "player-wonder";
  img.src = `/img/wonders/${PlayerWonder}.jpeg`;
  img.alt = PlayerWonder;

  wonderPlaceHolder.appendChild(img);
};

const renderPlayerName = (player) => {
  const nameHolder = document.getElementById("player-name");
  nameHolder.textContent = `Player : ${player}`;
};

const getPlayerPoints = (coins, tokens) => {
  const pointsHolder = document.createElement("div");
  pointsHolder.className = "player-points";

  const coinsHolder = document.createElement("p");
  const tokensHolder = document.createElement("p");

  coinsHolder.textContent = `💲 ${coins}`;
  tokensHolder.textContent = `⚔️ ${tokens}`;

  pointsHolder.append(coinsHolder, tokensHolder);
  return pointsHolder;
};

const renderPlayerInfo = (playerInfo) => {
  renderWonder(playerInfo.wonder);
  const header = document.querySelector("header");
  renderPlayerName(playerInfo.name);

  const playerPoints = getPlayerPoints(playerInfo.coins, playerInfo.warTokens);
  header.append(playerPoints);
};

const getPlayerStats = (name) => {
  const statsHolder = document.createElement("div");
  const nameHolder = document.createElement("p");
  const statusHolder = document.createElement("p");

  statsHolder.className = "player-points";
  nameHolder.textContent = name;
  statusHolder.textContent = "⏳";

  statsHolder.append(nameHolder, statusHolder);

  return statsHolder;
};

const getResourceHolder = (resource) => {
  const resourceHolder = document.createElement("img");

  resourceHolder.src = `/img/resources/${resource}.png`;
  resourceHolder.className = "png";
  resourceHolder.alt = resource;

  return resourceHolder;
};

const getWonderHolder = (wonder) => {
  const wonderHolder = document.createElement("p");
  wonderHolder.textContent = wonder;

  return wonderHolder;
};

const getStageHolder = () => {
  const stageHolder = document.createElement("img");

  stageHolder.src = "/img/stages/empty-stage.png";
  stageHolder.className = "png";
  stageHolder.alt = "empty-stage.png";

  return stageHolder;
};

const getWonderStats = (wonder, resource) => {
  const resourceHolder = getResourceHolder(resource);
  const wonderHolder = getWonderHolder(wonder);
  const stageHolder = getStageHolder();

  return [resourceHolder, wonderHolder, stageHolder];
};

const appendNeighbourStats = (playerClone, coins, name, warTokens) => {
  const neighbourPlaceHolder = playerClone.querySelector(
    ".player-stats-header",
  );

  const playerStats = getPlayerStats(name);
  const playerPoints = getPlayerPoints(coins, warTokens);

  neighbourPlaceHolder.append(playerStats);
  neighbourPlaceHolder.append(playerPoints);
};

const appendWonderStats = (playerClone, wonder, bonusResource) => {
  const wonderStatsHolder = playerClone.querySelector(".wonder-stats");
  const wonderStats = getWonderStats(wonder, bonusResource);

  wonderStatsHolder.append(...wonderStats);
};

const getNeighbourStats = (player, template) => {
  const { coins, warTokens, name, wonder, bonusResource } = player;
  const playerClone = template.content.cloneNode(true);

  appendNeighbourStats(playerClone, coins, name, warTokens);
  appendWonderStats(playerClone, wonder, bonusResource);

  return playerClone;
};

const renderLeftPlayerStats = (leftPlayer, playerTemplate) => {
  const leftPlayerHolder = document.getElementById("left-neighbour");

  const leftPlayerStats = getNeighbourStats(leftPlayer, playerTemplate);
  leftPlayerHolder.append(leftPlayerStats);
};

const renderRightPlayerStats = (rightPlayer, playerTemplate) => {
  const rightPlayerHolder = document.getElementById("right-neighbour");
  const rightPlayerStats = getNeighbourStats(rightPlayer, playerTemplate);

  rightPlayerHolder.append(rightPlayerStats);
};

const renderNeighbours = ({ leftPlayer, rightPlayer }) => {
  const playerTemplate = document.getElementById("neighbour-template");

  renderLeftPlayerStats(leftPlayer, playerTemplate);
  renderRightPlayerStats(rightPlayer, playerTemplate);
};

const renderOtherPlayerStats = ({ others }) => {
  const statsHolder = document.getElementById("other-players");
  const playerTemplate = document.getElementById("other-players-template");

  const playersStatsHolders = others.map((playerInfo) => {
    return getNeighbourStats(playerInfo, playerTemplate);
  });

  console.log(playersStatsHolders);

  statsHolder.append(...playersStatsHolders);
};

const main = async () => {
  const playerInfo = await getPlayerDetails();
  // console.log("this is the player info", playerInfo);

  renderPlayerInfo(playerInfo);
  renderNeighbours(playerInfo);
  renderOtherPlayerStats(playerInfo);
};

globalThis.onload = main;
