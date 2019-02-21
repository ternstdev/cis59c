(function () {
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
})();


class RegApp {

  constructor() {
    this.email = "";
    this.phone = "";
    this.country = "";
    this.contactPreference = "";
    this.termsAccepted = false;
    this.comments = "";
    document.getElementById("register-form").addEventListener("submit", () => this.submitRegisterForm());
    document.getElementById("register-form").addEventListener("reset", () => this.resetRegisterForm());
    //document.getElementById("submit-register").addEventListener("click", this.processEntries);
    const registerInputs = document.querySelectorAll("#register-form input, #register-form select");
    registerInputs.forEach((input) => {
      if (input.id === "email-address") {
        input.addEventListener("blur", () => this.validateEmail());
        input.addEventListener("focus", (evt) => this.notReadyToSubmit(evt));
      } else if (input.id === "phone") {
        input.addEventListener("blur", () => this.validatePhone());
        input.addEventListener("focus", (evt) => this.notReadyToSubmit(evt));
        this.setInputFilter(input, function (value) {
          return /^\d{0,10}$/.test(value); // integers only
        });
      } else if (input.id === "country") {
        input.addEventListener("blur", () => this.validateCountry());
        input.addEventListener("focus", (evt) => this.notReadyToSubmit(evt));
      } else if (input.name === "contact-preference") {
        input.addEventListener("input", () => this.validateContactPreference());
      } else if (input.id === "accept-terms") {
        input.addEventListener("input", () => this.validateTerms());
      }

    });

  }

  setInputFilter(input, inputFilter) {
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

  validateEmail() {
    const elem = document.getElementById("email-address");
    const val = elem.value;
    if (!val) { // input is blank (empty string). Could possible check length instead?
      this.email = "";
      elem.classList.remove("is-success");
      elem.classList.remove("is-error");
      elem.nextElementSibling.classList.add("d-invisible");
    } else if (!(/^[\w\.-]+@[\w\.-]+\.\w{2,10}$/.test(val))) {
      this.email = "";
      elem.classList.remove("is-success");
      elem.classList.add("is-error");
      elem.nextElementSibling.classList.remove("d-invisible");
    } else {
      this.email = val;
      elem.classList.remove("is-error");
      elem.classList.add("is-success");
      elem.nextElementSibling.classList.add("d-invisible");
    }
    this.checkIfReadyForSubmit();
  }

  validatePhone() {
    const elem = document.getElementById("phone");
    const val = elem.value;
    const isUnformattedPhoneNum = /^\d{10}$/.test(val);
    const isFormattedPhoneNum = /^\d{3}-\d{3}-\d{4}$/.test(val);
    if (!val) { // input is blank (empty string). Could possible check length instead?
      this.phone = "";
      elem.classList.remove("is-success");
      elem.classList.remove("is-error");
      elem.nextElementSibling.classList.add("d-invisible");
    } else if (!(isUnformattedPhoneNum || isFormattedPhoneNum)) {
      this.phone = "";
      elem.classList.remove("is-success");
      elem.classList.add("is-error");
      elem.nextElementSibling.classList.remove("d-invisible");
    } else {
      if (isUnformattedPhoneNum) {
        this.phone = val;
        elem.value = val.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
      } else {
        this.phone = val.replace("-", "");
        elem.value = val;
      }
      elem.classList.remove("is-error");
      elem.classList.add("is-success");
      elem.nextElementSibling.classList.add("d-invisible");
    }
    this.checkIfReadyForSubmit();
  }

  validateCountry() {
    const elem = document.getElementById("country");
    const val = elem.value;
    if (!val) { // Nothing selected. Could possible check length instead?
      this.country = "";
      elem.classList.remove("is-success");
      elem.classList.add("is-error");
      elem.nextElementSibling.classList.remove("d-invisible");
    } else {
      this.country = val;
      elem.classList.remove("is-error");
      elem.classList.add("is-success");
      elem.nextElementSibling.classList.add("d-invisible");
    }
    this.checkIfReadyForSubmit();
  }

  validateContactPreference() {
    const elem = document.querySelector("input[name='contact-preference']:checked");
    this.contactPreference = elem.value;
    this.checkIfReadyForSubmit();
  }

  validateTerms() {
    const elem = document.getElementById("accept-terms");
    if (!elem.checked) {
      this.termsAccepted = elem.checked;
      elem.classList.remove("is-success");
      elem.parentElement.parentElement.classList.remove("has-success");
      elem.classList.add("is-error");
      elem.parentElement.parentElement.classList.add("has-error");
      document.getElementById("accept-terms-error").classList.remove("d-invisible");
    } else {
      this.termsAccepted = elem.checked;
      elem.classList.remove("is-error");
      elem.parentElement.parentElement.classList.remove("has-error");
      elem.classList.add("is-success");
      elem.parentElement.parentElement.classList.add("has-success");
      document.getElementById("accept-terms-error").classList.add("d-invisible");
    }
    this.checkIfReadyForSubmit();
  }

  notReadyToSubmit(evt) {
    evt.target.classList.remove("is-success");
    evt.target.classList.remove("is-error");
    evt.target.nextElementSibling.classList.add("d-invisible");
  }

  checkIfReadyForSubmit() {
    if (this.email && this.phone && this.country && this.contactPreference && this.termsAccepted) {
      document.getElementById("submit-register").classList.add("btn-success");
      return true;
    } else {
      document.getElementById("submit-register").classList.remove("btn-success");
      return false;
    }

  }

  resetRegisterForm() {
    const registerInputs = document.querySelectorAll("#register-form input, #register-form select");
    registerInputs.forEach((input) => {
      input.classList.remove("is-success");
      input.classList.remove("is-error");
    });
    
    const labelErrorHints = document.querySelectorAll(".form-input-hint");
    labelErrorHints.forEach((label) => {
      label.classList.add("d-invisible");
    });
    
    const hasSuccessContainers = document.querySelectorAll(".has-success");
    hasSuccessContainers.forEach((elem) => {
      elem.classList.remove("has-success");
    });
    
    this.email = "";
    this.phone = "";
    this.country = "";
    this.contactPreference = "";
    this.termsAccepted = false;
    this.comments = "";
  }

  submitRegisterForm() {
    const isFormValid = this.checkIfReadyForSubmit();
    if (!isFormValid) {
      //return;
    }

    this.comments = document.getElementById("comments").value;

    let output = `
          <h5 class="mb-5">Form Valid?: ${isFormValid ? '<span class="label label-success">Yes' : '<span class="label label-error">No'}</span></h5>
          <table class="table table-striped table-hover text-center" style="min-width: 150px; max-width: 800px; margin: 0 auto;">
            <thead>
              <tr class="text-center text-primary h5">
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-bold">Email</td>
                <td>${this.email ? this.email : "No valid input"}</td>
              </tr>
              <tr>
                <td class="text-bold">Phone</td>
                <td>${this.phone ? this.phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3") : "No valid input"}</td>
              </tr>
              <tr>
                <td class="text-bold">Country</td>
                <td>${this.country ? this.country : "No valid input"}</td>
              </tr>
              <tr>
                <td class="text-bold">Contact Preference</td>
                <td>${this.contactPreference ? this.contactPreference.cap : "No selection made"}</td>
              </tr>
              <tr>
                <td class="text-bold">Terms Accepted?</td>
                <td>${this.termsAccepted ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td class="text-bold">Comments</td>
                <td class="text-break" style='white-space: pre-wrap;'>Length: ${this.comments.length}<br />${this.comments}</td>
              </tr>
            </tbody>
          </table>
          <br />`;

    document.getElementById("table-output").innerHTML = output + document.getElementById("table-output").innerHTML;
  }

}


let app = new RegApp()

