
let navbarToggler = function() {
  document.getElementById("nav-menu-wrapper").classList.add("anim");
  document.getElementById("nav-menu-wrapper").classList.toggle("open");
  //document.getElementById("navbar-toggler-button").classList.toggle("open");
  //document.getElementById("navbar-toggler-button").blur();
};
document.getElementById("nav-menu-button").addEventListener("click", navbarToggler);
document.getElementById("nav-menu-closer").addEventListener("click", navbarToggler);

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


/*

//Here's an example of a 'click' event handler to expand/collapse an accordion:
// Source: https://healthy.kaiserpermanente.org/northern-california/facilities/Pleasanton-Medical-Offices-100340


                getPanel: function(t) {
                    return document.getElementById(t.getAttribute("aria-controls"))
                },
                show: function(t) {
                    if (this.getPanel(t).setAttribute("aria-hidden", "false"),
                    this.getPanel(t).classList.add("show"),
                    t.setAttribute("aria-expanded", "true"),
                    !n) {
                        var e = void 0 !== window.pageYOffset ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop
                          , i = t.offsetTop;
                        e > i && window.scrollTo(0, i)
                    }
                },
                hide: function(t) {
                    this.getPanel(t).setAttribute("aria-hidden", "true"),
                    t.setAttribute("aria-expanded", "false"),
                    this.getPanel(t).classList.remove("show")
                },
                hideAll: function() {
                    this.tabs.map(function(t) {
                        this.hide(t)
                    }, this)
                },
                onTabClick: function(t) {
                    var e = "true" !== t.target.getAttribute("aria-expanded");
                    this.isMultiple || this.hideAll(),
                    e ? this.show(t.target) : this.isMultiple && this.tabs.map(function(e) {
                        e.getAttribute("id") === t.target.getAttribute("id") && this.hide(e)
                    }, this)
                },

*/