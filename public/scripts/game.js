const getPlayerDetails = async () => await (await fetch("/player-info")).json();

const renderWonder = (PlayerWonder) => {
  const wonderPlaceHolder = document.getElementById("wonder-placeholder");
  const img = document.createElement("img");

  img.id = "player-wonder";
  img.src = `/img/wonders/${PlayerWonder}A.jpeg`;
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

const convert = (name, format) => {
  if (format === "server") {
    return name.replace("_", "");
  }
  return name.replace(" ", "_").toLowerCase();
};

const createContainer = (card) => {
  const imageUrl = `/img/cards/${convert(card.name)}.jpeg`;
  const imageContainer = document.createElement("div");
  const image = document.createElement("img");

  image.src = imageUrl;
  image.cardName = card.name;
  imageContainer.classList.add("deck");
  image.addEventListener("click", selectTheCard);
  imageContainer.appendChild(image);

  return imageContainer;
};

const polling = (currentMove, intervalId) => {
  return async () => {
    const res = await fetch("/game/all-players-ready");
    const status = await res.text();
    if (status === "Done") {
      clearInterval(intervalId);
      console.log(currentMove);
    }
  };
};

const reqToDiscard = (parentEvent) => {
  return () => {
    const move = { card: parentEvent.cardName, action: "Discard" };
    const intervalId = setInterval(() => polling(move, intervalId)(), 5000);
  };
};

const reqStage = (parentEvent) => {
  return () => {
    const move = { card: parentEvent.cardName, action: "Stage" };
    const intervalId = setInterval(() => polling(move, intervalId)(), 5000);
  };
};

const reqBuildCard = (parentEvent) => {
  return () => {
    const move = { card: parentEvent.cardName, action: "Build" };
    const intervalId = setInterval(() => polling(move, intervalId)(), 5000);
  };
};

const removeList = () => {
  document.querySelector(".actionsBox").remove();
};

const createDiscard = (parentEvent) => {
  console.log(parentEvent);
  const stage = document.createElement("div");
  const contnet = document.createElement("p");
  const image = document.createElement("img");
  image.src = "/img/icons/discard.png";
  stage.appendChild(image);
  contnet.innerText = "Discard";
  stage.append(contnet);
  stage.addEventListener("click", reqToDiscard(parentEvent));

  return stage;
};

const createStage = (parentEvent) => {
  const stage = document.createElement("div");
  const contnet = document.createElement("p");
  const image = document.createElement("img");
  image.src = "/img/icons/stage.png";
  stage.appendChild(image);
  contnet.innerText = "Stage";
  stage.append(contnet);
  stage.addEventListener("click", reqStage(parentEvent));

  return stage;
};

const createBuild = (parentEvent) => {
  const stage = document.createElement("div");
  const contnet = document.createElement("p");
  const image = document.createElement("img");
  image.src = "/img/icons/build.png";
  stage.appendChild(image);
  contnet.innerText = "Build";
  stage.append(contnet);
  stage.addEventListener("click", reqBuildCard(parentEvent));

  return stage;
};

const createCancel = () => {
  const stage = document.createElement("div");
  const contnet = document.createElement("p");
  const image = document.createElement("img");
  image.src = "/img/icons/cancel.avif";
  stage.appendChild(image);
  contnet.innerText = "Cancel";
  stage.append(contnet);
  stage.addEventListener("click", removeList);

  return stage;
};

const showActions = (event) => {
  const actionBox = document.createElement("div");
  actionBox.classList.add("actionsBox");

  actionBox.append(
    createDiscard(event.target),
    createStage(event.target),
    createBuild(event.target),
    createCancel(event.target)
  );

  return actionBox;
};

const selectTheCard = (event) => {
  if (document.querySelector(".actionsBox")) return;
  event.target.parentNode.appendChild(showActions(event));
};

const renderCards = async () => {
  const res = await fetch("/game/cards");
  const cards = await res.json();
  const container = document.querySelector("#cardsContainer");
  const data = cards.map(createContainer);

  container.append(...data);
};

const main = async () => {
  const playerInfo = await getPlayerDetails();

  renderPlayerInfo(playerInfo);
  renderNeighbours(playerInfo);

  renderOtherPlayerStats(playerInfo);

  renderCards();
};

globalThis.onload = main;
