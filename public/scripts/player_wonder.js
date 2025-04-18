const loadWonderImage = (image) => {
  const imgTag = document.getElementById("wonder-img");
  imgTag.src = `/img/wonders/${image}`;
};

const getWonderDetails = async () => {
  const response = await fetch("/game/wonder");
  const { wonderImage } = await response.json();

  loadWonderImage(wonderImage);
};

const redirectToGamePage = () => {
  window.location.href = "/"; // need to know the route to add
};

const main = () => {
  getWonderDetails();

  // setTimeout(redirectToGamePage, 1000);
};

globalThis.onload = main;
