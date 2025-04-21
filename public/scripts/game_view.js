const createElements = (tags) => tags.map((tag) => document.createElement(tag));

const notify = (msg) => {
  const popup = document.createElement("span");
  popup.textContent = msg;
  popup.classList.add("popup");
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 3000);
};

const createWaitingWindow = () => {
  const ele = document.createElement("div");
  ele.textContent = "waiting for other players....";
  ele.classList.add("waiting-window");
  document.body.appendChild(ele);
};

const removeWaitingWindow = () => {
  const waitingWindow = document.querySelector(".waiting-window");
  if (waitingWindow) waitingWindow.remove();
};

const renderWonder = (wonder) => {
  const holder = document.getElementById("wonder-placeholder");
  const img = document.createElement("img");
  img.src = `/img/wonders/${wonder.toLowerCase()}A.jpeg`;
  img.alt = wonder;
  img.id = "player-wonder";
  holder.replaceChildren(img);
};

const renderPlayerName = (name) => {
  const nameHolder = document.getElementById("player-name");
  nameHolder.textContent = `Player : ${name}`;
};

const getPlayerPoints = (coins, tokens) => {
  const container = document.createElement("div");
  container.className = "player-points";

  const coinsEl = document.createElement("p");
  const tokensEl = document.createElement("p");

  coinsEl.textContent = `💲 ${coins}`;
  tokensEl.textContent = `⚔️ ${tokens}`;
  container.append(coinsEl, tokensEl);
  return container;
};

const renderPlayerInfo = ({ wonder, name, coins, warTokens, buildings }) => {
  renderWonder(wonder);
  renderPlayerName(name);
  renderCards(buildings);

  const header = document.querySelector(".property");
  header.replaceChildren(getPlayerPoints(coins, warTokens.positive));
};

const convert = (name) => name.replaceAll(" ", "").toLowerCase();

const fetchImage = (card, index) => {
  const image = document.createElement("img");
  image.src = `/img/cards/${convert(card)}.jpeg`;
  image.style = `--index:${index}`;
  return image;
};

const renderBuildings = ([colour, cards]) => {
  const container = document.querySelector(`.${colour}`);
  container.classList.add(colour);
  container.append(...cards.map(fetchImage));
};

const renderCards = (cards) => Object.entries(cards).forEach(renderBuildings);

const getPlayerStats = (name) => {
  const [div, nameP, statusP] = createElements(["div", "p", "p"]);
  div.className = "player-points";
  nameP.textContent = name;
  statusP.textContent = "⏳";
  div.append(nameP, statusP);
  return div;
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

const getWonderStats = (wonder, resource) => [
  getResourceHolder(resource),
  getWonderHolder(wonder),
  getStageHolder(),
];

const extractAllCards = (buildings) =>
  Object.entries(buildings).flatMap(([_, cards]) => cards);

const halfTheCards = (cards) => {
  const mid = Math.floor(cards.length / 2);
  return [cards.slice(0, mid), cards.slice(mid)];
};

const appendPlayerBuildings = (clone, buildings) => {
  const allCards = extractAllCards(buildings);
  const [left, right] = halfTheCards(allCards);
  const firstCol = clone.querySelector(".first-col");
  const secondCol = clone.querySelector(".second-col");

  firstCol.append(...left.map(fetchImage));
  secondCol.append(...right.map(fetchImage));
};

const getNeighbourStats = (player, template) => {
  const { name, coins, warTokens, wonder, bonusResource, buildings } = player;
  const playerClone = template.content.cloneNode(true);
  const header = playerClone.querySelector(".player-stats-header");
  header.append(getPlayerStats(name));
  header.append(getPlayerPoints(coins, warTokens.positive));
  const cards = playerClone.querySelector(".cards");

  if (cards) appendPlayerBuildings(playerClone, buildings);

  const wonderStats = playerClone.querySelector(".wonder-stats");
  wonderStats.append(...getWonderStats(wonder, bonusResource));

  return playerClone;
};

const renderNeighbours = ({ leftPlayerData, rightPlayerData }) => {
  const template = document.getElementById("neighbour-template");
  const left = getNeighbourStats(leftPlayerData, template);
  const right = getNeighbourStats(rightPlayerData, template);

  document.getElementById("left-neighbour").replaceChildren(left);
  document.getElementById("right-neighbour").replaceChildren(right);
};

const renderOtherPlayerStats = ({ others }) => {
  const otherPlayersContainer = document.getElementById("other-players");
  const playerTemplate = document.getElementById("other-players-template");

  const stats = others.map((playerInfo) =>
    getNeighbourStats(playerInfo, playerTemplate)
  );
  otherPlayersContainer.replaceChildren(...stats);
};

const addHoverForChildren = (parentSelector) => {
  const parent = document.querySelector(parentSelector);

  Array.from(parent.children).forEach((child) => {
    child.addEventListener("mouseenter", handleHover);
    child.addEventListener("mouseleave", handleHoverLeave);
  });
};

const removeList = (event) => {
  const container = event.target.closest(".hovered");

  if (container) {
    container.classList.remove("hovered");
  }

  addHoverForChildren("#cardsContainer");
  document.querySelector(".actionsBox").remove();
};

const createCancel = () => {
  const [stage, content, image] = createElements(["div", "p", "img"]);
  image.src = "/img/icons/cancel.avif";

  content.innerText = "Cancel";
  stage.append(image, content);
  stage.addEventListener("click", removeList);

  return stage;
};

const reqBuildCard = (parentEvent) => {
  return () => {
    const _move = { card: parentEvent.cardName, action: "build" };
  };
};

const createBuild = (parentEvent, card) => {
  const [stage, content, image] = createElements(["div", "p", "img"]);

  image.src = "/img/icons/build.png";
  content.innerText = "Build";
  stage.append(image, content);

  if (card.canBuild) stage.addEventListener("click", reqBuildCard(parentEvent));
  stage.className = card.canBuild ? "" : "disabled";
  return stage;
};

const reqToDiscard = (parentEvent, postPlayerAction) => {
  return () => {
    removeList();

    createWaitingWindow();
    postPlayerAction({ card: parentEvent.cardName, action: "discard" });
  };
};

const createDiscard = (parentEvent, postPlayerAction) => {
  const [stage, content, image] = createElements(["div", "p", "img"]);

  image.src = "/img/icons/discard.png";
  content.innerText = "Discard";

  stage.append(image, content);
  stage.addEventListener("click", reqToDiscard(parentEvent, postPlayerAction));

  return stage;
};

const reqStage = (parentEvent) => {
  return () => {
    const _move = { card: parentEvent.cardName, action: "stage" };
  };
};

const createStage = (parentEvent, card) => {
  const [stage, content, image] = createElements(["div", "p", "img"]);
  image.src = "/img/icons/stage.png";

  content.innerText = "Stage";
  stage.append(image, content);
  if (card.canStage) stage.addEventListener("click", reqStage(parentEvent));
  stage.className = card.canStage ? "" : "disabled";
  return stage;
};

const showActions = (event, card, postPlayerAction) => {
  const actionBox = document.createElement("div");
  actionBox.classList.add("actionsBox");

  actionBox.append(
    createDiscard(event.target, postPlayerAction),
    createStage(event.target, card),
    createBuild(event.target, card),
    createCancel(event.target),
  );

  return actionBox;
};

const removeHover = (parentSelector) => {
  const parent = document.querySelector(parentSelector);

  Array.from(parent.children).forEach((child) => {
    child.removeEventListener("mouseenter", handleHover);
    child.removeEventListener("mouseleave", handleHoverLeave);
  });
};

const selectTheCard = (event, card, postPlayerAction) => {
  if (document.querySelector(".actionsBox")) return;
  event.target.parentNode.appendChild(
    showActions(event, card, postPlayerAction),
  );
  removeHover("#cardsContainer");
};

const createCardsContainer = (card, index, offset, postPlayerAction) => {
  const imageContainer = document.createElement("div");
  const img = document.createElement("img");
  img.src = `/img/cards/${convert(card.name)}.jpeg`;
  img.cardName = card.name;
  imageContainer.style = `--index:${index + 1 - offset}; --middle:${offset}`;
  imageContainer.classList.add("deck");
  imageContainer.appendChild(img);

  img.addEventListener(
    "click",
    (e) => selectTheCard(e, card, postPlayerAction),
  );
  return imageContainer;
};

const renderDeck = (cards, postPlayerAction) => {
  const container = document.querySelector("#cardsContainer");
  const offset = Math.ceil(cards.length / 2);

  const cardEls = cards.map((card, i) =>
    createCardsContainer(card, i, offset, postPlayerAction)
  );

  container.style = `--total:${cards.length}`;
  container.replaceChildren(...cardEls);
  addHoverForChildren("#cardsContainer");
};

const renderAge = () => {
  const el = document.querySelector("#age");
  setTimeout(() => {
    el.style.display = "none";
  }, 2000);
};

export {
  createWaitingWindow,
  getPlayerPoints,
  notify,
  removeWaitingWindow,
  renderAge,
  renderDeck,
  renderNeighbours,
  renderOtherPlayerStats,
  renderPlayerInfo,
  renderPlayerName,
  renderWonder,
};
