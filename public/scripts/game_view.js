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
  container.replaceChildren(...cards.map(fetchImage));
};

const withoutResource = ([color]) => {
  const resourceColors = new Set(["brown", "grey"]);
  return !resourceColors.has(color);
};

const renderCards = (cards) => {
  const brownCards = cards["brown"];
  const greyCards = cards["grey"];
  cards["resources"] = brownCards.concat(greyCards);

  const builds = Object.entries(cards).filter(withoutResource);
  return builds.forEach(renderBuildings);
};

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

const getColourCards = (builds, arr, color) => {
  arr.push(builds[color]);
  return arr;
};

const seperateSources = (builds) => {
  const colors = new Set(["brown", "grey", "yellow"]);
  const others = Object.keys(builds).filter((color) => !colors.has(color));

  const left = [...colors].reduce(getColourCards.bind(null, builds), []);
  const right = [...others].reduce(getColourCards.bind(null, builds), []);

  return [left.flat(), right.flat()];
};

const appendPlayerBuildings = (clone, buildings) => {
  const [left, right] = seperateSources(buildings);
  const firstCol = clone.querySelector(".first-col");
  const secondCol = clone.querySelector(".second-col");

  firstCol.append(...left.map((card, i) => fetchImage(card, i)));
  secondCol.append(...right.map((card, i) => fetchImage(card, i)));
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

const cardHover = (event) => {
  event.currentTarget.parentNode.classList.add("hovered");
};

const handleHover = (event) => {
  event.currentTarget.classList.add("hovered");
};

const handleHoverLeave = (event) => {
  event.currentTarget.classList.remove("hovered");
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

  if (container) container.classList.remove("hovered");

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

const reqBuildCard = (card, postPlayerAction) => {
  return (event) => {
    removeList(event);

    createWaitingWindow();
    postPlayerAction({ card: card.name, action: "build" });
  };
};

const hoverMessage = (message) => {
  const element = document.createElement("div");
  element.classList.add("hover-message");
  element.textContent = message;

  return element;
};

// const displayHoverMsg = () => {
//   const hoverMessage = document.querySelector("");
// };

const createBuild = (card, postPlayerAction) => {
  const [stage, content, image] = createElements(["div", "p", "img"]);

  image.src = "/img/icons/build.png";
  content.innerText = "Build";
  stage.append(image, content);

  if (!card.canBuild) {
    stage.classList.add("disabled");
    return stage;
  }

  stage.append(hoverMessage(card.buildDetails.msg));
  stage.addEventListener("click", reqBuildCard(card, postPlayerAction));
  // stage.addEventListener("mouseenter", showHoverMessage);
  // stage.addEventListener("mouseleave", hideHoverMessage);

  return stage;
};

const reqToDiscard = (card, postPlayerAction) => {
  return (event) => {
    removeList(event);
    createWaitingWindow();
    postPlayerAction({ card: card.name, action: "discard" });
  };
};

const createDiscard = (card, postPlayerAction) => {
  const [stage, content, image] = createElements(["div", "p", "img"]);

  image.src = "/img/icons/discard.png";
  content.innerText = "Discard";
  stage.append(image, content);

  if (!card.canDiscard) {
    stage.classList.add("disabled");
    return stage;
  }

  stage.addEventListener("click", reqToDiscard(card, postPlayerAction));
  return stage;
};

const reqStage = (card) => {
  return () => {
    const _move = { card: card.name, action: "stage" };
  };
};

const createStage = (card) => {
  const [stage, content, image] = createElements(["div", "p", "img"]);

  image.src = "/img/icons/stage.png";
  content.innerText = "Stage";
  stage.append(image, content);

  if (!card.canStage) {
    stage.classList.add("disabled");
    return stage;
  }

  stage.addEventListener("click", reqStage(card));
  return stage;
};

const enableActions = (card, postPlayerAction) => {
  const actionBox = document.createElement("div");
  actionBox.classList.add("actionsBox");

  actionBox.append(
    createDiscard(card, postPlayerAction),
    createStage(card),
    createBuild(card, postPlayerAction),
    createCancel()
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

const clearPerviousThings = () => {
  document.querySelector(".actionsBox").remove();
  document.querySelector(".hovered").classList.remove("hovered");
};

const selectCard = (event, card, postPlayerAction) => {
  if (document.querySelector(".actionsBox")) clearPerviousThings();

  event.target.parentNode.append(enableActions(card, postPlayerAction));

  removeHover("#cardsContainer");
  cardHover(event);
};

const createCardsContainer = (card, index, offset, postPlayerAction) => {
  const imageContainer = document.createElement("div");
  const img = document.createElement("img");
  img.src = `/img/cards/${convert(card.name)}.jpeg`;
  imageContainer.style = `--index:${index + 1 - offset}; --middle:${offset}`;
  imageContainer.classList.add("deck");
  imageContainer.appendChild(img);

  img.addEventListener("click", (e) => selectCard(e, card, postPlayerAction));

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

const renderAge = ({ age }) => {
  const el = document.querySelector("#age");
  const h1 = document.createElement("h1");
  h1.textContent = "Age";
  const image = document.createElement("img");
  image.src = `img/ages/age${age}.png`;
  console.log("ana");
  el.replaceChildren(h1, image);
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
