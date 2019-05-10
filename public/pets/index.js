
let navbarToggler = function () {
  document.getElementById("nav-menu-wrapper").classList.add("anim");
  document.getElementById("nav-menu-wrapper").classList.toggle("open");
  //document.getElementById("navbar-toggler-button").classList.toggle("open");
  //document.getElementById("navbar-toggler-button").blur();
};
document.getElementById("nav-menu-button").addEventListener("click", navbarToggler);
document.getElementById("nav-menu-closer").addEventListener("click", navbarToggler);



// Setup numeric inputs
// data-numtype options:
//   +i = int (positive or negative)
//   -i = unsigned int (positive only)
//   +d2 = up to two decimal places (positive or negative)
//   +d3 = up to two decimal places (positive or negative)
//   -d2 = up to two decimal places (positive only)
//   -d3 = up to two decimal places (positive only)
(function () {
  let numericInputs = document.getElementsByClassName("numeric");
  for (let i = 0; i < numericInputs.length; i++) {
    if (numericInputs[i].getAttribute("data-numtype") === "+i") {
      setInputFilter(numericInputs[i], function (value) {
        return /^\d*$/.test(value); // positive integers only
      });
    } else if (numericInputs[i].getAttribute("data-numtype") === "-i") {
      setInputFilter(numericInputs[i], function (value) {
        return /^-?\d*$/.test(value); // +/- integers only
      });
    } else if (numericInputs[i].getAttribute("data-numtype") === "+d2") {
      setInputFilter(numericInputs[i], function (value) {
        return /^\d*\.?\d{0,2}$/.test(value); // up to two decimal places
      });
    } else if (numericInputs[i].getAttribute("data-numtype") === "+d3") {
      setInputFilter(numericInputs[i], function (value) {
        return /^\d*\.?\d{0,3}$/.test(value); // up to three decimal places
      });
    } else if (numericInputs[i].getAttribute("data-numtype") === "-d2") {
      setInputFilter(numericInputs[i], function (value) {
        return /^-?\d*\.?\d{0,2}$/.test(value); // up to two decimal places
      });
    } else if (numericInputs[i].getAttribute("data-numtype") === "-d3") {
      setInputFilter(numericInputs[i], function (value) {
        return /^-?\d*\.?\d{0,3}$/.test(value); // up to three decimal places
      });
    }
  }

})();

function setInputFilter(input, inputFilter) {
  ["input", "keydown", "keyup", "mousedown",
    "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
      input.addEventListener(event, function () {
        if (inputFilter(this.value)) {
          this.oldValue = this.value;
          this.oldSelectionStart = this.selectionStart;
          this.oldSelectionEnd = this.selectionEnd;
        }
        else if (this.hasOwnProperty("oldValue")) {
          this.value = this.oldValue;
          this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        }
      });
    });
}



if (document.getElementById("add-form-next"))
  document.getElementById("add-form-next").addEventListener("click", formNext);
if (document.getElementById("add-form-back"))
  document.getElementById("add-form-back").addEventListener("click", formBack);

// Form pagination
// <form id="add-form" class="paged-form card" data-current-page="0" data-max-pages="3">
function formNext(evt) {
  let addForm = document.getElementById("add-form");
  let currentPage = parseInt(addForm.getAttribute("data-current-page"));
  const maxPages = parseInt(addForm.getAttribute("data-max-pages"));

  if (currentPage < maxPages) {
    document.getElementById("step" + currentPage + "prog").classList.remove("active");
    document.getElementById("step" + (currentPage + 1) + "prog").classList.add("active");
    document.getElementById("step" + currentPage).classList.add("d-hide");
    document.getElementById("step" + (currentPage + 1)).classList.remove("d-hide");

    currentPage += 1;
    addForm.setAttribute("data-current-page", currentPage);
    if (currentPage === maxPages) {
      document.getElementById("add-form-next").classList.add("d-hide");
      document.getElementById("add-form-submit").classList.remove("d-hide")
    } else {
      document.getElementById("add-form-back").classList.remove("d-hide");
    }
  }

  // let formPages = document.getElementsByClassName("form-group");
  // let stepInidcators = document.getElementsByClassName("step-item");

  // let activateNextPage = false;

  // for (let i = 0; i < formPages.length; ++i) {
  //   if (activateNextPage === true) {      
  //     formPages[i].classList.add("d-hide");

  //     activateNextPage = false
  //   }
  //   if (!formPages[i].classList.contains("d-hide")) {
  //     activateNextPage = true;
  //   }
  // }

}

function formBack(evt) {
  let addForm = document.getElementById("add-form");
  let currentPage = parseInt(addForm.getAttribute("data-current-page"));
  const maxPages = parseInt(addForm.getAttribute("data-max-pages"));

  if (currentPage > 0) {
    document.getElementById("step" + currentPage + "prog").classList.remove("active");
    document.getElementById("step" + (currentPage - 1) + "prog").classList.add("active");
    document.getElementById("step" + currentPage).classList.add("d-hide");
    document.getElementById("step" + (currentPage - 1)).classList.remove("d-hide");

    currentPage -= 1;
    addForm.setAttribute("data-current-page", currentPage);

    if (currentPage === 0) {
      document.getElementById("add-form-back").classList.add("d-hide");
    } else {
      document.getElementById("add-form-next").classList.remove("d-hide");
      document.getElementById("add-form-submit").classList.add("d-hide")
    }
  }

}

function formReturnToFirstPage() {
  let addForm = document.getElementById("add-form");
  let currentPage = parseInt(addForm.getAttribute("data-current-page"));
  while (currentPage !== 0)
  {
    formBack();
    currentPage = parseInt(addForm.getAttribute("data-current-page"));
  }
}


if (document.getElementById("main-grid")) {
  fetch('https://api.tay.fail/pets/animals') // Initiates the request.
    .then(function (response) { // Once we receive a response, run the function below.
      var animals = response.json() // Converts the response from JSON into an object or array (in our case, an array).
      return animals;
    })
    .then(displayAnimals);
}

function displayAnimals(animals) {
  animals.forEach((animal) => {
    let node = document.createElement("article");
    node.classList.add("card");
    // old image: <img src="./img/${animal.imgs[0]}" alt="${animal.name}" class="img-responsive hover-zoom" />
    // new image: <img alt="${animal.name}" class="img-responsive hover-zoom" style="height: 0; padding-top: 56.25%; background: url(./img/${animal.imgs[0]}); background-size: cover; background-repeat: no-repeat;">
    node.innerHTML = `
      <a class="card-image" href="#">
      <div alt="${animal.name}" class="img-aspect hover-zoom" style="background: url(./img/${animal.imgs[0]}); background-size: cover; background-repeat: no-repeat;"></div>
      </a>
      <header class="card-header">
        <h5 class="card-title">${animal.name}</h5>
        <h6 class="card-subtitle">${animal.breed}</h6>
      </header>
      <p class="card-body">
        ${animal.shortDesc}
      </p>
      <footer class="card-footer">
        <a class="btn btn-primary" href="#">Learn more!</a>
        <span class="float-right m-2 text-gray text-italic">${animal.matchness ? animal.matchness : ""}</span>
      </footer>`;
    document.getElementById("main-grid").appendChild(node);
  });
}





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