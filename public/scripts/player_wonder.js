const loadWonderImage = (image) => {
  const imgTag = document.getElementById("wonder-img");
  imgTag.src = `img/wonders/${image}`;
};

const getWonderDetails = async () => {
  const response = await fetch("/player/wonder");
  const { image } = await response.json();
  loadWonderImage(image);
};

const redirectToGamePage = () => {
  globalThis.location.replace("/game.html");
};

const main = () => {
  getWonderDetails();

  setTimeout(redirectToGamePage, 2000);
};

globalThis.onload = main;
