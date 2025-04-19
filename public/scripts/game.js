const getPlayerDetails = async () => await (await fetch("/player/info")).json();

const renderWonder = (playerWonder) => {
  const wonderPlaceHolder = document.getElementById("wonder-placeholder");
  const img = document.createElement("img");

  img.id = "player-wonder";
  img.src = `/img/wonders/${playerWonder.toLowerCase()}A.jpeg`;
  img.alt = playerWonder;

  wonderPlaceHolder.replaceChildren(img);
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

const fetchImage = (card, index) => {
  const cardName = convert(card);
  const image = document.createElement("img");
  image.src = `/img/cards/${cardName}.jpeg`;
  image.style = `--index:${index}`;
  return image;
};

const renderBuildings = ([colour, cards]) => {
  const container = document.querySelector(`.${colour}`);
  container.classList.add(colour);

  const cardCont = cards.map((card, index) => fetchImage(card, index));
  container.append(...cardCont);
  return container;
};

const renderCards = (cards) => {
  Object.entries(cards).map(renderBuildings);
};

const renderPlayerInfo = (playerInfo) => {
  const { wonder, name, coins, warTokens, buildings } = playerInfo;
  const header = document.querySelector(".property");
  const playerPoints = getPlayerPoints(coins, warTokens.positive);

  renderWonder(wonder);
  renderPlayerName(name);
  renderCards(buildings);
  header.replaceChildren(playerPoints);
};

const getPlayerStats = (name) => {
  const [stats, nameHolder, status] = createElements(["div", "p", "p"]);

  stats.className = "player-points";
  nameHolder.textContent = name;
  status.textContent = "⏳";

  stats.append(name, status);

  return stats;
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

const extractAllCards = (buildings) => {
  const colourCards = Object.entries(buildings);
  return colourCards.map(([_, cards]) => cards).flat();
};

const halfTheCards = (cards) => {
  const half = Math.floor(cards.length / 2);
  const firstHalf = cards.slice(0, half);
  const secondHalf = cards.slice(half);

  return [firstHalf, secondHalf];
};

const appendPlayerBuildings = (playerClone, buildings) => {
  const firstColHolder = playerClone.querySelector(".first-col");
  const secondColHolder = playerClone.querySelector(".second-col");
  const cards = extractAllCards(buildings);
  const [firstCol, secondCol] = halfTheCards(cards);

  firstColHolder.append(...firstCol.map(fetchImage));
  secondColHolder.append(...secondCol.map(fetchImage));
};

const appendWonderStats = (playerClone, wonder, bonusResource) => {
  const wonderStatsHolder = playerClone.querySelector(".wonder-stats");
  const wonderStats = getWonderStats(wonder, bonusResource);

  wonderStatsHolder.append(...wonderStats);
};

const getNeighbourStats = (player, template) => {
  const { coins, warTokens, name, wonder, bonusResource, buildings } = player;
  const playerClone = template.content.cloneNode(true);
  const cards = playerClone.querySelector(".cards");

  appendNeighbourStats(playerClone, coins, name, warTokens.positive);
  if (cards) appendPlayerBuildings(playerClone, buildings);
  appendWonderStats(playerClone, wonder, bonusResource);

  return playerClone;
};

const renderLeftPlayerStats = (leftPlayer, playerTemplate) => {
  const leftPlayerHolder = document.getElementById("left-neighbour");

  const leftPlayerStats = getNeighbourStats(leftPlayer, playerTemplate);
  leftPlayerHolder.replaceChildren(leftPlayerStats);
};

const renderRightPlayerStats = (rightPlayer, playerTemplate) => {
  const rightPlayerHolder = document.getElementById("right-neighbour");
  const rightPlayerStats = getNeighbourStats(rightPlayer, playerTemplate);

  rightPlayerHolder.replaceChildren(rightPlayerStats);
};

const renderNeighbours = ({ leftPlayerData, rightPlayerData }) => {
  const playerTemplate = document.getElementById("neighbour-template");

  renderLeftPlayerStats(leftPlayerData, playerTemplate);
  renderRightPlayerStats(rightPlayerData, playerTemplate);
};

const renderOtherPlayerStats = ({ others }) => {
  const statsHolder = document.getElementById("other-players");
  const playerTemplate = document.getElementById("other-players-template");

  const playersStatsHolders = others.map((playerInfo) => {
    return getNeighbourStats(playerInfo, playerTemplate);
  });

  statsHolder.replaceChildren(...playersStatsHolders);
};

const convert = (name, format) => {
  if (format === "server") {
    return name.replace("_", "");
  }
  return name.replaceAll(" ", "").toLowerCase();
};

const createContainer = (card, index, length) => {
  const imageUrl = `/img/cards/${convert(card.name)}.jpeg`;
  const imageContainer = document.createElement("div");
  const image = document.createElement("img");
  const offset = Math.ceil(length / 2);
  imageContainer.style = `--index:${index + 1 - offset};--middle:${offset}`;
  image.src = imageUrl;
  image.cardName = card.name;
  imageContainer.classList.add("deck");
  image.addEventListener("click", (event) => selectTheCard(event, card));
  imageContainer.appendChild(image);

  return imageContainer;
};

const notify = (msg) => {
  const popup = document.createElement("span");
  popup.textContent = msg;
  popup.classList.add("popup");
  document.body.appendChild(popup);

  console.log(popup);

  setTimeout(() => {
    popup.remove();
  }, 3000);
};

const polling = async (currentMove, intervalId) => {
  const _statusResponse = await fetch("/player/status", {
    method: "PUT",
    body: JSON.stringify({ status: "seleted" }),
  });

  return async () => {
    const res = await fetch("/game/all-players-ready");
    const { status } = await res.json();
    if (status) {
      clearInterval(intervalId);
      const response = await fetch("/game/action", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(currentMove),
      });

      notify((await response.json()).message);

      const passHandResponse = await fetch("/game/pass-hand", {
        method: "POST",
      });

      notify((await passHandResponse.json()).message);
      renderGamePage();
    }
  };
};

const reqToDiscard = (parentEvent) => {
  return () => {
    const move = { card: parentEvent.cardName, action: "discard" };
    const intervalId = setInterval(
      async () => (await polling(move, intervalId))(),
      1000,
    );
  };
};

const reqStage = (parentEvent) => {
  return () => {
    const move = { card: parentEvent.cardName, action: "stage" };
    const intervalId = setInterval(
      async () => (await polling(move, intervalId))(),
      1000,
    );
  };
};

const reqBuildCard = (parentEvent) => {
  return () => {
    const move = { card: parentEvent.cardName, action: "build" };
    const intervalId = setInterval(
      async () => (await polling(move, intervalId))(),
      1000,
    );
  };
};

const removeList = () => {
  document.querySelector(".actionsBox").remove();
};

const createElements = (elements) => {
  return elements.map((ele) => document.createElement(ele));
};

const createDiscard = (parentEvent) => {
  console.log(parentEvent);
  const [stage, content, image] = createElements(["div", "p", "img"]);

  image.src = "/img/icons/discard.png";
  content.innerText = "Discard";

  stage.append(image, content);
  addListener(stage, reqToDiscard(parentEvent), "click");

  return stage;
};

const addListener = (ele, fn, event) => {
  ele.addEventListener(event, fn);
};

const createStage = (parentEvent, card) => {
  const [stage, content, image] = createElements(["div", "p", "img"]);
  image.src = "/img/icons/stage.png";

  content.innerText = "Stage";
  stage.append(image, content);
  if (card.canStage) addListener(stage, reqStage(parentEvent), "click");
  stage.className = card.canStage ? "" : "disabled";
  return stage;
};

const createBuild = (parentEvent, card) => {
  const [stage, content, image] = createElements(["div", "p", "img"]);

  image.src = "/img/icons/build.png";
  content.innerText = "Build";
  stage.append(image, content);

  if (card.canBuild) addListener(stage, reqBuildCard(parentEvent), "click");
  stage.className = card.canBuild ? "" : "disabled";
  return stage;
};

const createCancel = () => {
  const [stage, content, image] = createElements(["div", "p", "img"]);
  image.src = "/img/icons/cancel.avif";

  content.innerText = "Cancel";
  stage.append(image, content);
  addListener(stage, removeList, "click");

  return stage;
};

const showActions = (event, card) => {
  const actionBox = document.createElement("div");
  actionBox.classList.add("actionsBox");

  actionBox.append(
    createDiscard(event.target),
    createStage(event.target, card),
    createBuild(event.target, card),
    createCancel(event.target),
  );

  return actionBox;
};

const selectTheCard = (event, card) => {
  if (document.querySelector(".actionsBox")) return;
  event.target.parentNode.appendChild(showActions(event, card));
};

const renderDeck = async () => {
  const res = await fetch("/game/cards");
  const cards = await res.json();
  const container = document.querySelector("#cardsContainer");
  const data = cards.map((card, index) =>
    createContainer(card, index, cards.length)
  );
  const noOfCards = data.length;
  container.style = `--total:${noOfCards}`;
  container.replaceChildren(...data);
};

const renderGamePage = async () => {
  const playerInfo = await getPlayerDetails();

  renderPlayerInfo(playerInfo);
  renderNeighbours(playerInfo);

  renderOtherPlayerStats(playerInfo);
  renderDeck();
};

const main = () => {
  renderGamePage();
};

globalThis.onload = main;
