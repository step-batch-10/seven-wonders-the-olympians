const getWonderDetails = async () => {
  const response = await fetch("/game/wonder");
};

const main = () => {
  getWonderDetails();

  setTimeout(() => {

  }, 1000);
};

globalThis.onload = main;