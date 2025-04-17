const getWonderDetails = async () => {
  const response = await fetch("/game/wonder");
  console.log(response);
};

const main = () => {
  getWonderDetails();

  setTimeout(() => {
  }, 1000);
};

globalThis.onload = main;