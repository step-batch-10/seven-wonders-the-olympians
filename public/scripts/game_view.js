const hide1 = (event) => {
  event.currentTarget.classList.toggle("hide2");
  document.querySelector(".stage-details2").classList.toggle("hide2");
};
const hide = (event) => {
  event.currentTarget.classList.toggle("hide");
  document.querySelector(".stage-details").classList.toggle("hide");
};

const createEmptyStage = (index) => {
  const stageImg = document.createElement("img");
  stageImg.src = `img/stages/stage${index + 1}.png`;
  stageImg.alt = "empty-stage.png";
  stageImg.className = "png";
  return stageImg;
};

const createCostDiv = (stage) => {
  const costDiv = document.createElement("div");
  costDiv.className = "cost";
  stage.cost.forEach((resource) => {
    for (let i = 0; i < resource.count; i++) {
      const resImg = document.createElement("img");
      resImg.src = `img/resources/${resource.type}.png`;
      resImg.alt = resource.type;
      costDiv.appendChild(resImg);
    }
  });

  return costDiv;
};

const createWonderEffect = (stage) => {
  const power = stage.powers[0];
  const powerImg = document.createElement("img");
  const value = power.value ? power.value : "";
  powerImg.src = `img/wonder-effect/${value}${power.type}.png`;
  powerImg.alt = `${value} ${power.type}`;

  return powerImg;
};

const renderPoints = (person, className) => {
  const container = document.querySelector(`.${className}`);
  const holder = document.createElement("div");
  Object.entries(person.stages).forEach(([key, stage], index) => {
    const stageDiv = document.createElement("div");
    stageDiv.className = key;

    stageDiv.appendChild(createEmptyStage(index));
    stageDiv.appendChild(createCostDiv(stage));
    stageDiv.appendChild(createWonderEffect(stage));
    console.log(person.stagedCards, index);
    if (person.stagedCards.length <= index) stageDiv.classList.add("dim");
    holder.appendChild(stageDiv);
  });

  container.replaceChildren(...holder.children);
};

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
  waitingWindow?.remove();
};

const renderWonder = (wonder) => {
  const wonderImgStr = wonder.toLowerCase();
  const holder = document.getElementById("wonder-placeholder");
  const img = document.createElement("img");
  img.src = `/img/wonders/${wonderImgStr}A.jpeg`;
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
  tokensEl.textContent = `⚔️  ${tokens.negative}`;
  container.append(coinsEl, tokensEl);
  return container;
};

const addStagedCard = (stagedCards, card, i) => {
  const holder = stagedCards.querySelector(`.stage${i + 1}`);
  const [img] = createElements(["img"]);

  img.src = `/img/ages/age${card.age}.jpeg`;
  holder.replaceChildren(img);
};

const renderStagedCards = (stagedCards) => {
  const stagedCardsElement = document.querySelector(".staged-cards");
  stagedCards.forEach((card, i) => addStagedCard(stagedCardsElement, card, i));
};

const renderPlayerInfo = (info) => {
  const { wonder, name, coins, warTokens, buildings, stagedCards } = info;

  renderWonder(wonder);
  renderPlayerName(name);
  renderCards(buildings);
  renderStagedCards(stagedCards);

  const header = document.querySelector(".property");
  header.replaceChildren(getPlayerPoints(coins, warTokens));
};

const convert = (name) => name.replaceAll(" ", "").toLowerCase();

const fetchImage = (card, index) => {
  const image = document.createElement("img");
  image.src = `/img/cards/${convert(card)}.jpeg`;
  image.style = `--index:${index}; --z-index:${900 - index}`;

  return image;
};

const renderBuildings = ([colour, cards]) => {
  const container = document.querySelector(`.${colour}`);
  console.log(colour, container);
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

  header?.append(getPlayerStats(name));
  header?.append(getPlayerPoints(coins, warTokens));

  const cards = playerClone?.querySelector(".cards");
  if (cards) appendPlayerBuildings(playerClone, buildings);

  const wonderStats = playerClone.querySelector(".wonder-stats");
  wonderStats?.append(...getWonderStats(wonder, bonusResource));

  return playerClone;
};

const renderNeighbours = ({ leftPlayerData, rightPlayerData }) => {
  const template = document.getElementById("neighbour-template");
  const left = getNeighbourStats(leftPlayerData, template);
  renderPoints(leftPlayerData, "stage-details");
  const right = getNeighbourStats(rightPlayerData, template);
  renderPoints(rightPlayerData, "stage-details2");

  document.getElementById("left-neighbour-stats").replaceChildren(left);
  document.getElementById("right-neighbour-stats").replaceChildren(right);
  document.querySelector(".toggle").addEventListener("click", hide);
  document.querySelector(".toggle2").addEventListener("click", hide1);
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

const clearPerviousThings = () => {
  document.querySelector("#build-message")?.remove();
  document.querySelector(".actionsBox").remove();
  document.querySelector(".hovered").classList.remove("hovered");
};

const removeList = () => {
  addHoverForChildren("#cardsContainer");
  clearPerviousThings();
};

const createCancel = () => {
  const [stage, content, image] = createElements(["div", "p", "img"]);
  image.src = "/img/icons/cancel.png";

  content.innerText = "Cancel";
  stage.append(image, content);
  stage.addEventListener("click", removeList);

  return stage;
};

const removeOtherActionsInteractions = () => {
  document.querySelector("#build-message")?.remove();
  document.querySelector(".actionsBox").remove();

  const cards = document.querySelectorAll(".deck");

  Array.from(cards).forEach((card) => {
    card.removeEventListener("mouseenter", handleHover);
    card.removeEventListener("mouseleave", handleHoverLeave);
    const cardImg = card.querySelector(".card-image");
    cardImg.removeEventListener("click", cardImg.onClickHandler);
  });
};

const resetCardsEventListeners = () => {
  const cards = document.querySelectorAll(".card-image");

  Array.from(cards).forEach((card) => {
    card.addEventListener("click", card.onClickHandler);
  });
};

const reselectCard = (resetPlayerAction) => {
  return async (event) => {
    event.target.closest(".deck").classList.remove("hovered");
    event.target.remove();
    addHoverForChildren("#cardsContainer");
    resetCardsEventListeners();

    notify((await resetPlayerAction()).message);
  };
};

const addReselectOption = (event, resetPlayerAction) => {
  const img = createImg("/img/icons/reselect.png", "reselect-icon");
  img.addEventListener("click", reselectCard(resetPlayerAction));
  const card = event.target.closest(".deck");
  card.appendChild(img);
};

const reqBuildCard = (card, postPlayerAction, resetPlayerAction) => {
  return (event) => {
    addReselectOption(event, resetPlayerAction);
    removeOtherActionsInteractions();

    postPlayerAction({ card: card.name, action: "build" });
  };
};

const createHoverMsg = (message) => {
  return (event) => {
    const hoverMessage = document.createElement("div");
    hoverMessage.textContent = message;
    hoverMessage.classList.add("hover-message");
    hoverMessage.id = "build-message";

    event.target.closest(".deck").appendChild(hoverMessage);
  };
};

const removeHoverMessage = () => {
  const buildMessageEle = document.querySelector("#build-message");
  buildMessageEle?.remove();
};

const addBuildOptEvtListener = (
  card,
  stage,
  postPlayerAction,
  resetPlayerAction,
) => {
  stage.addEventListener(
    "click",
    reqBuildCard(card, postPlayerAction, resetPlayerAction),
  );

  return stage;
};

const getHoverMsg = (actions, action) => {
  const messages = {
    isAlreadyBuild: "You already own the card. No duplicates allowed!",
    isStagingCompleted: "Staging is completed, cannot stage anymore",
    trade:
      "You don't have enough resources. You can trade with the neighbours.",
    isFutureCard:
      "You get this card for free! You already have the required linked card.",
    haveEnoughResources:
      `You can ${action} this card, You have enough resources.`,
    needToPayCoinsToBank:
      `You need to pay coins to the bank to ${action} this card.`,
    isCardFree: `You can ${action} this card at no cost.`,
    noResources: `You don't have enough resources to ${action} this card.`,
  };

  const [possibleAction] = Object.keys(actions).filter(
    (key) => actions[key] && !key.startsWith("can"),
  );

  return (
    messages[possibleAction] ||
    "You don't have enough resources to build this card."
  );
};

const addHoverListener = (ele, actions, action) => {
  const hoverMsg = getHoverMsg(actions, action);
  ele.addEventListener("mouseenter", createHoverMsg(hoverMsg));
  ele.addEventListener("mouseleave", removeHoverMessage);
};

const createBuild = (card, postPlayerAction, resetPlayerAction) => {
  const [stage, content, image] = createElements(["div", "p", "img"]);

  image.src = "/img/icons/build.png";
  content.innerText = "Build";
  stage.append(image, content);

  addHoverListener(stage, card.build, "build");

  if (!card.build.canBuild) {
    stage.classList.add("disabled");
    return stage;
  }

  return addBuildOptEvtListener(
    card,
    stage,
    postPlayerAction,
    resetPlayerAction,
  );
};

const reqToDiscard = (card, postPlayerAction, resetPlayerAction) => {
  return (event) => {
    addReselectOption(event, resetPlayerAction);
    removeOtherActionsInteractions();

    postPlayerAction({ card: card.name, action: "discard" });
  };
};

const createDiscard = (card, postPlayerAction, resetPlayerAction) => {
  const [stage, content, image] = createElements(["div", "p", "img"]);

  image.src = "/img/icons/discard.png";
  content.innerText = "Discard";
  stage.append(image, content);

  if (!card.discard.canDiscard) {
    stage.classList.add("disabled");
    return stage;
  }

  stage.addEventListener(
    "click",
    reqToDiscard(card, postPlayerAction, resetPlayerAction),
  );
  return stage;
};

const reqToStage = (card, postAction, reset) => {
  return (event) => {
    addReselectOption(event, reset);
    removeOtherActionsInteractions();

    postAction({ card: card.name, action: "stage" });
  };
};

const createStage = (card, postAction, resetAction) => {
  const [stage, content, image] = createElements(["div", "p", "img"]);

  image.src = "/img/icons/stage.png";
  content.innerText = "Stage";
  stage.append(image, content);

  addHoverListener(stage, card.stage, "stage");

  if (!card.stage.canStage) {
    stage.classList.add("disabled");
    return stage;
  }

  stage.addEventListener("click", reqToStage(card, postAction, resetAction));
  return stage;
};

const showActions = (card, postPlayerAction, resetPlayerAction) => {
  const actionBox = document.createElement("div");
  actionBox.classList.add("actionsBox");

  actionBox.append(
    createDiscard(card, postPlayerAction),
    createStage(card, postPlayerAction, resetPlayerAction),
    createBuild(card, postPlayerAction, resetPlayerAction),
    createCancel(),
  );

  removeHover("#cardsContainer");
  return actionBox;
};

const removeHover = (parentSelector) => {
  const parent = document.querySelector(parentSelector);

  Array.from(parent.children).forEach((child) => {
    child.removeEventListener("mouseenter", handleHover);
    child.removeEventListener("mouseleave", handleHoverLeave);
  });
};

const createSelectCardHandler = (card, postPlayerAction, resetPlayerAction) => {
  return (event) => {
    if (document.querySelector(".actionsBox")) clearPerviousThings();

    event.target.parentNode.append(
      showActions(card, postPlayerAction, resetPlayerAction),
    );

    removeHover("#cardsContainer");
    cardHover(event);
  };
};

const createCardsContainer = (
  card,
  index,
  offset,
  postPlayerAction,
  resetPlayerAction,
) => {
  const onClickHandler = createSelectCardHandler(
    card,
    postPlayerAction,
    resetPlayerAction,
  );
  const img = createEl("img", {
    className: "card-image",
    attrs: { src: `/img/cards/${convert(card.name)}.jpeg`, onClickHandler },
  });
  img.onClickHandler = onClickHandler;
  img.addEventListener("click", onClickHandler);

  const imageContainer = createEl("div", {
    className: "deck",
    attrs: { style: `--index:${index + 1 - offset}; --middle:${offset}` },
  });
  imageContainer.appendChild(img);

  return imageContainer;
};

const renderDeck = (cards, postPlayerAction, resetPlayerAction) => {
  const container = document.querySelector("#cardsContainer");
  const offset = Math.ceil(cards.length / 2);
  const cardEls = cards.map((card, i) =>
    createCardsContainer(card, i, offset, postPlayerAction, resetPlayerAction)
  );

  container.style = `--total:${cards.length}`;
  container.replaceChildren(...cardEls);
  addHoverForChildren("#cardsContainer");
};

const createAgeElements = (age) => {
  const h1 = document.createElement("h1");
  h1.textContent = "Age";
  const image = document.createElement("img");
  image.src = `img/ages/age${age}.png`;

  return [h1, image];
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const renderAge = async (age) => {
  const el = document.querySelector("#age");
  el.style.display = "flex";
  el.replaceChildren(...createAgeElements(age));
  await sleep(1000);
  el.style.display = "none";
};

const createEl = (tag, options = { id: "", className: "", text: "" }) => {
  const element = document.createElement(tag);

  element.classList.add(options.className);
  element.id = options.id;
  element.textContent = options.text;

  for (const attr in options.attrs) {
    element.setAttribute(attr, options.attrs[attr]);
  }

  return element;
};

const createImg = (src, className = "", alt = "") =>
  createEl("img", { className, attrs: { src, alt } });

const createShieldBlock = (shieldSrc, count) => {
  const wrapper = createEl("div", { className: "othershield" });
  wrapper.append(
    createImg(shieldSrc, "shield"),
    createEl("p", { text: count }),
  );

  return wrapper;
};

const createPersonBlock = (
  wrapperClass,
  imgSrc,
  shieldSrc,
  victorySrc,
  shields,
) => {
  const person = createEl("div", { className: wrapperClass });
  const personImg = createImg(imgSrc, "img");

  const points = createEl("div", { className: "points" });
  points.append(createShieldBlock(shieldSrc, `${shields}`));
  points.append(createImg(victorySrc, "small"));

  person.append(personImg, points);
  return person;
};

const createConflict = (conflict, player) => {
  const { opponentName, result, tokens, militaryShields, wonderName } =
    conflict;

  const person = createPersonBlock(
    player,
    `img/wonders/${wonderName.toLowerCase()}A.jpeg`,
    "img/miltiry-conflits/shield.png",
    `img/miltiry-conflits/victory${tokens}.png`,
    militaryShields,
  );

  const direction = player === "leftPlayer" ? "<---" : "--->";
  const playerStatus = createEl("div", { className: `playerStatus` });

  const drawText = createEl("p", {
    text: `you ${result} with ${opponentName}  ${direction}`,
  });

  playerStatus.append(drawText);

  return [person, playerStatus];
};

const createUserShield = (militaryShields) => {
  const ele = createEl("div", { className: "top" });
  ele.append(
    createImg("img/miltiry-conflits/shield.png", "shield"),
    createEl("p", { text: `${militaryShields}` }),
  );

  return ele;
};

const createConflictChilds = (militaryShields, leftConflict, rightConflict) => {
  const top = createUserShield(militaryShields);
  const hr = document.createElement("hr");
  const [left, leftPlayerStatus] = createConflict(leftConflict, "leftPlayer");
  const [right, rightPlayerStatus] = createConflict(
    rightConflict,
    "rightPlayer",
  );

  return [top, left, leftPlayerStatus, hr, right, rightPlayerStatus];
};

const createConflictContainer = () => {
  const conflict = document.querySelector(".conflict");
  conflict.style.display = "flex";
  conflict.innerHTML = "";
  conflict.classList.add("conflict-Border");

  return conflict;
};

const renderConflictsResults = async ({
  militaryShields,
  leftConflict,
  rightConflict,
}) => {
  console.log({ militaryShields, leftConflict, rightConflict });
  const parent = document.querySelector(".conflictContainer");
  parent.style.display = "flex";
  const conflict = createConflictContainer();

  conflict.replaceChildren(
    ...createConflictChilds(militaryShields, leftConflict, rightConflict),
  );

  console.log(parent);
  await sleep(20000);
  parent.style.display = "none";
};

const conflictAnimation = () => {
  const imag1 = document.createElement("img");
  imag1.src = "/img/miltiry-conflits/person1.png";
  const imag2 = document.createElement("img");
  imag2.src = "/img/miltiry-conflits/person2.png";

  return [imag1, imag2];
};

const renderMilitaryConflicts = async (conflicts) => {
  const ele = document.querySelector("#age");
  ele.style.display = "flex";
  ele.replaceChildren(...conflictAnimation());
  ele.style.display = "flex";
  await sleep(3000);
  ele.style.display = "none";
  await renderConflictsResults(conflicts);
};

export {
  createWaitingWindow,
  getPlayerPoints,
  notify,
  removeWaitingWindow,
  renderAge,
  renderDeck,
  renderMilitaryConflicts,
  renderNeighbours,
  renderOtherPlayerStats,
  renderPlayerInfo,
  renderPlayerName,
  renderWonder,
};
