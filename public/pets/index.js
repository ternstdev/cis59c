/*(function () {
  let blurBehindNav = function (event) {
    if (document.getElementById("assignment-container").classList.contains("sidenav-show")) {
      if (this.id !== event.target.id && this.id !== "navbar-toggler-button") {
        event.stopPropagation();
        return;
      }
      document.getElementById("navbar-toggler-button").classList.remove("open");
      document.getElementById("assignment-container").classList.remove("sidenav-show");
      document.querySelectorAll(".blurable").forEach(e => e.classList.remove("blur"));
    } else {
      document.getElementById("navbar-toggler-button").classList.add("open");
      document.getElementById("assignment-container").classList.add("sidenav-show");
      document.querySelectorAll(".blurable").forEach(e => e.classList.add("blur"));
    }
  };

  document.getElementById("navbar-toggler-button").addEventListener("click", blurBehindNav);
  document.getElementById("assignment-container").addEventListener("click", blurBehindNav);
})();*/