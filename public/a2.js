// Setup number formatting.
(function () {

  // Investment Amount (aka Initial Investment) input formatting
  let investAmtElement = document.getElementById("investment-amt");

  investAmtElement.onfocus = function () {
    let rate = parseFloat(investAmtElement.value.replace(/\$/g, "").replace(/,/g, ""));
    if (isNaN(rate) || rate < 0) {
      investAmtElement.value = "";
    } else {
      investAmtElement.value = rate.toFixed(2);
    }
    this.select();
  };

  investAmtElement.onblur = function () {
    let rate = parseFloat(investAmtElement.value);
    if (isNaN(rate) || rate < 0) {
      investAmtElement.value = "$0.00";
    } else {
      investAmtElement.value = rate.toLocaleString('en', { style: 'currency', currency: 'USD' });
    }
  };



  // Interest Rate input formatting
  let interestRateElement = document.getElementById("interest-rate");

  interestRateElement.onfocus = function () {
    let rate = parseFloat(interestRateElement.value.replace(/%/g, ""));
    if (isNaN(rate) || rate < 0) {
      interestRateElement.value = "";
    } else {
      interestRateElement.value = rate.toFixed(3);
    }
    this.select();
  };

  interestRateElement.onblur = function () {
    let rate = parseFloat(interestRateElement.value.replace(/%/g, ""));
    if (isNaN(rate) || rate < 0) {
      interestRateElement.value = "0.000%";
    } else {
      interestRateElement.value = rate.toFixed(3) + "%";
    }
  };

})();




// Setup input filters (numbers only)
// This code was adapted from solution found online.
(function () {

  let investInputs = document.querySelectorAll("#invest-inputs input");
  for (let i = 0; i < investInputs.length; i++) {
    if (investInputs[i].id === "years") {
      setInputFilter(investInputs[i], function (value) {
        return /^\d*$/.test(value); // integers only
      });
    } else if (investInputs[i].id === "investment-amt") {
      setInputFilter(investInputs[i], function (value) {
        return /^\d*\.?\d{0,2}$/.test(value); // up to two decimal places
      });
    } else if (investInputs[i].id === "interest-rate") {
      setInputFilter(investInputs[i], function (value) {
        return /^\d*\.?\d{0,3}$/.test(value); // up to three decimal places
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




// Calculate and display 
(function () {
  document.getElementById("calculate").onclick = function () {
    const investAmt = parseFloat(document.getElementById("investment-amt").value.replace(/\$/g, "").replace(/,/g, "")) || 0;
    const interestRate = parseFloat(document.getElementById("interest-rate").value.replace(/%/g, "")) || 0;
    const years = parseInt(document.getElementById("years").value) || 0;

    if (investAmt <= 0 || interestRate <= 0 || years <= 0)
      return;

    let output = `
      <div class="columns my-5">
        <div class="column col-5 col-lg-7 col-mx-auto">
          <div class="divider"></div>
        </div>
      </div>
      <div class="columns my-5">
        <div class="column col-4 col-lg-6 col-mx-auto">
          <h5 class="mb-1">Investment Amount: <span class="label label-secondary">${investAmt.toLocaleString('en', { style: 'currency', currency: 'USD' })}</span></h5>
          <h5 class="mb-1">Interest Rate: <span class="label label-secondary">${interestRate.toFixed(3) + "%"}</span></h5>
          <h5 class="mb-1">Years: <span class="label label-secondary">${years}</span></h5>
          <table class="table table-striped table-hover text-right">
            <thead>
              <tr>
                <th>Year</th>
                <th>Interest</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>`;
    
    let currentInterestAmt;
    let totalAmt = investAmt;

    output += `
              <tr>
                <td>0</td>
                <td>N/A</td>
                <td>${totalAmt.toLocaleString('en', { style: 'currency', currency: 'USD' })}</td>
              </tr>`;
    
    for(let i = 1; i <= years; i++)
    {
      currentInterestAmt = totalAmt * (interestRate / 100);
      totalAmt += currentInterestAmt;
      output += `
              <tr>
                <td>${i}</td>
                <td>${currentInterestAmt.toLocaleString('en', { style: 'currency', currency: 'USD' })}</td>
                <td>${totalAmt.toLocaleString('en', { style: 'currency', currency: 'USD' })}</td>
              </tr>`;
    }
    
    output += `
            </tbody>
          </table>
        </div>
      </div>`;

    document.getElementById("table-output").innerHTML = output + document.getElementById("table-output").innerHTML;
  }

})();