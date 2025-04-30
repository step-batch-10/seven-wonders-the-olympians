const redirectHome = () => {
  globalThis.location.href = "/index.html";
};

const labels = [
  { key: "militaryConflictPoints", class: "military" },
  { key: "treasuryPoints", class: "treasury" },
  { key: "wonderStagesPoints", class: "wonder" },
  { key: "civilianStructuresPoints", class: "civilian" },
  { key: "scientificStructuresPoints", class: "science" },
  { key: "commerceStructuresPoints", class: "commerce" },
  { key: "guildsPoints", class: "guild" },
  { key: "totalPoints", class: "total" },
];

const createEle = (tag, { class: className, id }) => {
  const ele = document.createElement(tag);
  if (className) ele.classList.add(...className);
  if (id) ele.id = id;

  return ele;
};

const createCell = ({ class: className, key }, stats) => {
  const valueEle = createEle("div", {
    class: [className, "cell"],
  });
  valueEle.textContent = stats[key] ?? 0;

  return valueEle;
};

const createPlayerCol = ([wonder, stats], labels) => {
  const columnEle = createEle("div", { class: ["col"] });

  const wonderNameEle = createEle("div", {
    class: ["cell", "category"],
  });
  wonderNameEle.textContent = wonder;

  const playerScore = labels.map((label) => {
    return createCell(label, stats);
  });

  columnEle.append(wonderNameEle, ...playerScore);

  return columnEle;
};

const renderResults = (resultData) => {
  const scoreBoard = document.querySelector(".score-board");
  console.log(resultData);

  const playersScore = Object.entries(resultData).map((playerData) => {
    return createPlayerCol(playerData, labels);
  });

  scoreBoard.append(...playersScore);
};

const main = async () => {
  const res = await fetch("/game/result");
  const resultData = await res.json();

  console.log(resultData);
  const homeBtn = document.querySelector("#return-home");
  homeBtn.addEventListener("click", redirectHome);

  renderResults(resultData);
};

globalThis.onload = main;
