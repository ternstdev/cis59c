(function () {
  let blurBehindNav = function (event) {
    if (document.getElementById("assignment-container").style.height === "100%") {
      if (this.id !== event.target.id && this.id !== "navbar-toggler-button") {
        event.stopPropagation();
        return;
      }
      document.getElementById("navbar-toggler-button").classList.remove("open");
      document.getElementById("assignment-container").style.height = "0%";
      document.querySelectorAll(".blurable").forEach(e => e.classList.remove("blur"));
    } else {
      document.getElementById("navbar-toggler-button").classList.add("open");
      document.getElementById("assignment-container").style.height = "100%";
      document.querySelectorAll(".blurable").forEach(e => e.classList.add("blur"));
    }
  };

  document.getElementById("navbar-toggler-button").onclick = blurBehindNav;
  document.getElementById("assignment-container").onclick = blurBehindNav;
})();

