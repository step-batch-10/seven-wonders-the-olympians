const userName = async () => {
  const res = await fetch("/player/name");
  return `${await res.text()}!`;
};

const data = async (intervalId) => {
  const res = await fetch("/game/status");
  const data = await res.json();

  if (data.gameStatus === "matched") {
    clearInterval(intervalId);
    globalThis.location.replace("/player_wonder.html");
  }
};

const displayUserName = async () => {
  const name = await userName();
  const location = document.querySelector(".name");
  location.innerText = `${location.innerText}  ${name}`;
  const intervalId = setInterval(() => {
    data(intervalId);
  }, 1000);
};

globalThis.onload = displayUserName;
