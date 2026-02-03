const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");

let scale = 1;

// NO hover → move NO + grow YES
noBtn.addEventListener("mouseenter", () => {
  const x = Math.random() * 80;
  const y = Math.random() * 20;

  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";

  scale += 0.2;
  yesBtn.style.transform = `scale(${scale})`;
});

// YES click → popup
yesBtn.addEventListener("click", () => {
  popup.style.display = "flex";
});

// Close popup
closePopup.addEventListener("click", () => {
  popup.style.display = "none";
});
