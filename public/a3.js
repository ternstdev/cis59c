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

  document.getElementById("navbar-toggler-button").onclick = blurBehindNav;
  document.getElementById("assignment-container").onclick = blurBehindNav;
})();


class FVApp {

  constructor() {
    this.investmentAmt = NaN;
    this.interestRate = NaN;
    this.years = NaN;
    document.getElementById("calculate").addEventListener("click", this.processEntries);
    const investInputs = document.querySelectorAll("#invest-inputs input");
    investInputs.forEach((input) => {
      if (input.id === "investment-amt") {
        input.addEventListener("change", this.validateInvestmentAmt);
        input.addEventListener("focus", this.notReadyToCalc);
      } else if (input.id === "interest-rate") {
        input.addEventListener("change", this.validateInterestRate);
      } else if (input.id === "years") {
        input.addEventListener("change", this.validateYears);
      }
    });
    document.getElementById("investment-amt").focus();
  }

  // There must be a simple way to combine the three validation methods into one function.
  // The only difference is the RegEx test and the max values.
  validateInvestmentAmt() {
    const elem = document.getElementById("investment-amt");
    const valUnparsed = elem.value;
    const val = parseFloat(valUnparsed);
    if (!valUnparsed) { // input is blank (empty string). Could possible check length instead?
      this.investmentAmt = NaN;
      elem.classList.remove("is-success");
      elem.classList.remove("is-error");
      // Might want to consider explicitly selecting the label-error element to
      // prevent future layout changes from breaking functionality.
      // I could also refactor the CSS, but that would also still be fragile.
      // If changed, would a require 3 changes per validation method.
      elem.nextElementSibling.classList.add("d-invisible");
    } else if (isNaN(val) || !(/^\d*\.?\d{0,2}$/.test(valUnparsed)) || val < 0.01 || val > 100000) {
      this.investmentAmt = NaN;
      elem.classList.remove("is-success");
      elem.classList.add("is-error");
      elem.nextElementSibling.classList.remove("d-invisible"); // See note above
    } else {
      this.investmentAmt = val;
      elem.classList.remove("is-error");
      elem.classList.add("is-success");
      elem.nextElementSibling.classList.add("d-invisible"); // See note above
    }
    this.checkIfReadyForCalc();
  }

  validateInterestRate() {
    const elem = document.getElementById("interest-rate");
    const valUnparsed = elem.value;
    const val = parseFloat(valUnparsed);
    if (!valUnparsed) { // input is blank (empty string). Could possible check length instead?
      this.interestRate = NaN;
      elem.classList.remove("is-success");
      elem.classList.remove("is-error");
      elem.nextElementSibling.classList.add("d-invisible"); // See note on validateInvestmentAmt
    } else if (isNaN(val) || !(/^\d*\.?\d{0,2}$/.test(valUnparsed)) || val <= 0 || val > 15) {
      this.interestRate = NaN;
      elem.classList.remove("is-success");
      elem.classList.add("is-error");
      elem.nextElementSibling.classList.remove("d-invisible"); // See note on validateInvestmentAmt
    } else {
      this.interestRate = val;
      elem.classList.remove("is-error");
      elem.classList.add("is-success");
      elem.nextElementSibling.classList.add("d-invisible"); // See note on validateInvestmentAmt
    }
    this.checkIfReadyForCalc();
  }

  validateYears() {
    const elem = document.getElementById("years");
    const valUnparsed = elem.value;
    const val = parseFloat(valUnparsed);
    if (!valUnparsed) { // input is blank (empty string). Could possible check length instead?
      this.years = NaN;
      elem.classList.remove("is-success");
      elem.classList.remove("is-error");
      elem.nextElementSibling.classList.add("d-invisible"); // See note on validateInvestmentAmt
    } else if (isNaN(val) || !(/^\d*$/.test(valUnparsed)) || val <= 0 || val > 50) {
      this.years = NaN;
      elem.classList.remove("is-success");
      elem.classList.add("is-error");
      elem.nextElementSibling.classList.remove("d-invisible"); // See note on validateInvestmentAmt
    } else {
      this.years = val;
      elem.classList.remove("is-error");
      elem.classList.add("is-success");
      elem.nextElementSibling.classList.add("d-invisible"); // See note on validateInvestmentAmt
    }
    this.checkIfReadyForCalc();
  }

  notReadyToCalc() {
    document.getElementById("calculate").classList.add("disabled");
    document.querySelectorAll("#invest-inputs.label-error").forEach(e => e.classList.add("d-invisible"));
  }

  checkIfReadyForCalc() {
    if (!(isNaN(this.investmentAmt) || isNaN(this.interestRate) || isNaN(this.years))) {
      document.getElementById("calculate").classList.remove("disabled");
    } else {
      document.getElementById("calculate").classList.add("disabled");
    }
  }

  calculateFV(investmentAmt, interestRate, years) {
    //alert(this.name);
  }

  processEntries() {
    //alert(this.name);
  }
}

// This setup is a little convoluted in order to fulfill the specifications of the assignment.
//let app = new FVApp();
let app;
window.addEventListener("load", () => app = new FVApp());
window.addEventListener("load", () => {

});