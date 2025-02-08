function buttonClickLogic(tilesToToggle) {
  let buttonText;

  if (tilesToToggle.show) {
    tilesToToggle.show = false;
    buttonText = "Show Google 3D tiles";
  } else {
    tilesToToggle.show = true;
    buttonText = "Hide Google 3D tiles";
  }
  document.getElementById("viewSwitcher").innerHTML = buttonText;
}

export default function demoShowcase(tilesToToggle) {
  document
    .getElementById("viewSwitcher")
    .addEventListener("click", () => buttonClickLogic(tilesToToggle));
}
