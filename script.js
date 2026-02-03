const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const popup = document.getElementById("popup");
const close = document.getElementById("close");

let scale = 1;

noBtn.addEventListener("mouseenter", () => {
  const x = Math.random() * 80;
  const y = Math.random() * 20;

  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";

  scale += 0.15;
  yesBtn.style.transform = `scale(${scale})`;
});

yesBtn.addEventListener("click", () => {
  popup.style.display = "flex";
});

close.addEventListener("click", () => {
  popup.style.display = "none";
});
