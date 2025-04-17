// const userName = async () => {
//   const res = await fetch("/user/name");
//   return `${await res.text()}!`;
// };

// const data = async () => {
//   const res = await fetch("/user/playerReady");
//   if (res.redirected) {
//     globalThis.location.href = res.url;
//   }
// };

// const displayUserName = async () => {
//   const name = await userName();
//   const location = document.querySelector(".name");
//   location.innerText = `${location.innerText}  ${name}`;
//   return setInterval(() => {
//     data();
//   }, 1000);
// };

// globalThis.onload = displayUserName;
