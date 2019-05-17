
let navbarToggler = function () {
  document.getElementById("nav-menu-wrapper").classList.add("anim");
  document.getElementById("nav-menu-wrapper").classList.toggle("open");
  //document.getElementById("navbar-toggler-button").classList.toggle("open");
  //document.getElementById("navbar-toggler-button").blur();
};
document.getElementById("nav-menu-button").addEventListener("click", navbarToggler);
document.getElementById("nav-menu-closer").addEventListener("click", navbarToggler);

const ATTRIBUTE_LIST = [
  "id", "name", "typeId", "breed", "age",
  "shortDesc", "houseTrained", "specialNeeds", "energy", "affection",
  "obedience", "children", "strangers", "otherAnimals", "imgs"];

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


if (document.getElementById("add-form")) {
  let selectAllTypeId = document.getElementById("selectAllTypeId");
  if (selectAllTypeId) {
    selectAllTypeId.addEventListener("input", selectAllTypeIds);
    document.getElementById("typeId").addEventListener("input", handleTypeIdCheckboxes);
  }

  if (document.getElementById("add-form-next"))
    document.getElementById("add-form-next").addEventListener("click", formNext);
  if (document.getElementById("add-form-back"))
    document.getElementById("add-form-back").addEventListener("click", formBack);

  document.getElementById("add-form").addEventListener("submit", formSubmitNewAnimal);
}


function selectAllTypeIds(evt) {
  let checkboxes = document.querySelectorAll('input[type="checkbox"][name="typeId"]');
  for (let i = 0; i < checkboxes.length; ++i) {
    checkboxes[i].checked = false;
  }

  this.checked = true;
  evt.stopPropagation();
}

function handleTypeIdCheckboxes() {
  let checkboxes = document.querySelectorAll('input[type="checkbox"][name="typeId"]');
  let selectAllTypeId = document.getElementById("selectAllTypeId");
  let checkedCount = 0;
  for (let checkbox of checkboxes) {
    if (checkbox.checked)
      ++checkedCount;
  }
  if (checkedCount === 0) {
    selectAllTypeId.checked = true;
  } else if (checkedCount > 1) {
    selectAllTypeId.checked = false;
  } else if (checkedCount === checkboxes.length - 1) {
    for (let checkbox of checkboxes) {
      checkbox.checked = false;
    }
    selectAllTypeId.checked = true;
  }
}

function formValidator(formSection) {
  let inputs = formSection.querySelectorAll("textarea, select, [type=text], [type=file]");

  let invalidInputCount = 0;
  for (let input of inputs) {
    if (!input.value) {
      ++invalidInputCount;
      input.classList.add("is-error");
      input.addEventListener("focus", function (evt) { this.classList.remove("is-error"); });
    }
  }
  if (invalidInputCount !== 0)
    return false;
  else
    return true;
}


// Form pagination
// <form id="add-form" class="paged-form card" data-current-page="0" data-max-pages="3">
function formNext(evt) {
  let addForm = document.getElementById("add-form");
  let currentPageNum = parseInt(addForm.getAttribute("data-current-page"));
  const maxPages = parseInt(addForm.getAttribute("data-max-pages"));

  let formSection = document.getElementById("step" + currentPageNum);

  if (!formValidator(formSection))
    return;

  if (currentPageNum < maxPages) {
    document.getElementById("step" + currentPageNum + "prog").classList.remove("active");
    document.getElementById("step" + (currentPageNum + 1) + "prog").classList.add("active");
    document.getElementById("step" + currentPageNum).classList.add("d-hide");
    document.getElementById("step" + (currentPageNum + 1)).classList.remove("d-hide");

    currentPageNum += 1;
    addForm.setAttribute("data-current-page", currentPageNum);
    if (currentPageNum === maxPages) {
      document.getElementById("add-form-next").classList.add("d-hide");
      document.getElementById("add-form-submit").classList.remove("d-hide")
    } else {
      document.getElementById("add-form-back").classList.remove("d-hide");
    }
  }

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
      document.getElementById("add-form-submit").classList.add("d-hide");
    }
  }

}

function formReturnToFirstPage() {
  let addForm = document.getElementById("add-form");
  let currentPage = parseInt(addForm.getAttribute("data-current-page"));
  while (currentPage !== 0) {
    formBack();
    currentPage = parseInt(addForm.getAttribute("data-current-page"));
  }
}

function formSubmitNewAnimal(evt) {

  let fullForm = document.getElementById("add-form");

  if (!formValidator(fullForm)) {
    evt.preventDefault();
    return false;
  } else {
    return true;
  }
}










if (document.getElementById("main-grid")) {
  fetch('https://api.ernst.dev/pets/animals') // Initiates the request.
    .then(function (response) { // Once we receive a response, run the function below.
      var animals = response.json() // Converts the response from JSON into an object or array (in our case, an array).
      return animals;
    })
    .then(displayAnimals);
}

function displayAnimals(animals) {
  let matchCount = document.getElementById("match-count");
  if (matchCount) {
    matchCount.setAttribute("data-badge", animals.length);
  }

  document.getElementById("main-grid").innerHTML = "";
  animals.forEach((animal) => {
    let node = document.createElement("article");
    node.classList.add("card");
    for (const attribute of ATTRIBUTE_LIST) {
      node.setAttribute('data-' + attribute, animal[attribute]);
    }

    // old image: <img src="./img/${animal.imgs[0]}" alt="${animal.name}" class="img-responsive hover-zoom" />
    // new image: <img alt="${animal.name}" class="img-responsive hover-zoom" style="height: 0; padding-top: 56.25%; background: url(./img/${animal.imgs[0]}); background-size: cover; background-repeat: no-repeat;">
    node.innerHTML = '<a class="card-image learn-more" name="' + animal.id + '" href="#">' +
      '<div alt="' + animal.name + '" class="img-aspect hover-zoom" style="background: url(./img/' + animal.imgs[0] + '); background-size: cover; background-repeat: no-repeat;"></div>' +
      '</a>' +
      '<header class="card-header">' +
      '<h5 class="card-title">' + animal.name + '</h5>' +
      '<h6 class="card-subtitle">' + animal.breed + '</h6>' +
      '</header>' +
      '<p class="card-body">' +
      animal.shortDesc +
      '</p>' +
      '<footer class="card-footer">' +
      '<a class="btn btn-primary learn-more" name="' + animal.id + '" href="#">Learn more!</a>' +
      '<span class="float-right m-2 text-gray text-italic">' + (animal.matchness ? animal.matchness : "") + '</span>' +
      '</footer>';
    document.getElementById("main-grid").appendChild(node);
  });
  document.querySelectorAll(".learn-more").forEach(function (learnMore) {
    learnMore.addEventListener("click", function (evt) {
      const animalId = this.name;
      let parentCard = document.querySelector('[data-id="' + animalId + '"]');
      writeDomTable(parentCard);

    });
  });
};

function writeDomTable(animalCard) {
  if (!animalCard)
    return;

  let domTable = '<table class="table">' +
    '<thead>' +
    '<tr>' +
    '<th>Property</th>' +
    '<th>Value</th>' +
    '</tr>' +
    '</thead>' +
    '<tbody>' +
    '<tr>' +
    '<td>Name</td>' +
    '<td id="name_value">' + animalCard.getAttribute("data-name") + '</td>' +
    '</tr>' +
    '<tr>' +
    '<td>Energy Level</td>' +
    '<td id="energy_value">' + animalCard.getAttribute("data-energy") + '</td>' +
    '</tr>' +
    '<tr>' +
    '<td>Affection Level</td>' +
    '<td id="affection_value">' + animalCard.getAttribute("data-affection") + '</td>' +
    '</tr>' +
    '<tr>' +
    '<td>Obedience</td>' +
    '<td id="obedience_value">' + animalCard.getAttribute("data-obedience") + '</td>' +
    '</tr>' +
    '<tr>' +
    '<td>Children</td>' +
    '<td id="children_value">' + animalCard.getAttribute("data-children") + '</td>' +
    '</tr>' +
    '<tr>' +
    '<td>Strangers</td>' +
    '<td id="strangers_value">' + animalCard.getAttribute("data-strangers") + '</td>' +
    '</tr>' +
    '<tr>' +
    '<td>Other Animals</td>' +
    '<td id="other_animals_value">' + animalCard.getAttribute("data-otherAnimals") + '</td>' +
    '</tr>' +
    '</tbody>' +
    '</table>';

  let modalCard =
    '<a href="#close" class="modal-overlay close-modal" aria-label="Close"></a>' +
    '<div class="modal-container">' +
    '<div class="modal-header">' +
    '<a href="#close" class="btn btn-clear float-right close-modal" aria-label="Close"></a>' +
    '<div class="modal-title h5">' + animalCard.getAttribute("data-name") + '</div>' +
    '</div>' +
    '<div class="modal-body">' +
    '<div class="content">' +
    '<div class="card">' +
    '<div class="card-image img">' +
    '<div alt="' + animalCard.getAttribute("data-name") + '" class="img-aspect hover-zoom" style="background: url(./img/' + animalCard.getAttribute("data-imgs").split(",")[0] + '); background-size: cover; background-repeat: no-repeat;"></div>' +
    '</div>' +
    '</div>' +
    domTable +
    '</div>' +
    '</div>' +
    '</div>';


  let modalContainer = document.getElementById("learn-more-modal");
  modalContainer.innerHTML = modalCard;
  modalContainer.classList.add("active");
  let closeModalButtons = document.getElementsByClassName("close-modal");
  for (let i = 0; i < closeModalButtons.length; ++i) {
    closeModalButtons[i].addEventListener("click", function (evt) {
      let modalContainer = document.getElementById("learn-more-modal");
      modalContainer.classList.remove("active");
      modalContainer.innerHTML = "";
    });
  }


  
};

