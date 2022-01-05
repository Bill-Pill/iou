// Get and verify input values
function getValues() {
    // Hide totals/payments to start
    document.getElementById("totals").classList.add("invisible");
    document.getElementById("payments").classList.add("invisible");

    // Get inputs and parse float
    let loanValue = document.getElementById("loanValue").value;
    let termValue = document.getElementById("termValue").value;
    let interestValue = document.getElementById("interestValue").value;
    loanValue = parseFloat(loanValue);
    termValue = parseFloat(termValue);
    interestValue = parseFloat(interestValue);

    // Validate inputs as numbers
    if (Number.isFinite(loanValue) && Number.isInteger(termValue) && Number.isFinite(interestValue)) {
        // Call calculate function
        let returnObj = calcPayments(loanValue, termValue, interestValue);
        // Call output functions
        displayPayments(returnObj);
        displayTotals(returnObj, loanValue);
    } else {
        alert("Incorrect input(s). Please enter numbers for all values(Term must be an integer)")
    }
}

// Perform calculations
function calcPayments(loan, term, interest) {
    // Get monthly payments
    let totalMonthlyPay = loan * (interest / 1200) / (1 - (1 + interest / 1200) ** (-term))

    // Set initial values
    let paymentObjArr = [];
    let remainingBalance = loan;
    let interestPayment = 0;
    let principalPayment = 0;
    let totalInterest = 0;

    // Push paymentObj for each m month
    for (let month = 1; month <= term; month++) {
        interestPayment = remainingBalance * interest / 1200;
        principalPayment = totalMonthlyPay - interestPayment;
        remainingBalance -= principalPayment
        totalInterest += interestPayment

        let paymentObj = {
            month,
            principalPayment,
            interestPayment,
            totalInterest,
            remainingBalance
        };
        paymentObjArr.push(paymentObj);

    };
    // Return payment details for each month. Include monthly pay for display functions
    let returnObj = {
        paymentObjArr, totalMonthlyPay
    };
    return returnObj;
}

// Number formatter for display outputs
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

// Output payments
function displayPayments(returnObj) {
    // Get table body
    let tableBody = document.getElementById("results");

    // Get template row
    let templateRow = document.getElementById("paymentsTemplate");

    // Clear table
    tableBody.innerHTML= "";

    // Deconstruct returnObj
    let payment = returnObj.totalMonthlyPay;
    let paymentObjArr = returnObj.paymentObjArr;
    
    // Loop over each month/element of paymentObjArr and populate payments table
    for (let i = 0; i < paymentObjArr.length; i++) {
        let tableRow = document.importNode(templateRow.content, true);
        let rowCols = tableRow.querySelectorAll("td");

        // Format and populate values to table columns in current row
        let currentPaymentObj = paymentObjArr[i];
        rowCols[0].textContent = currentPaymentObj.month;
        rowCols[1].textContent = `${formatter.format(payment)}`;
        rowCols[2].textContent = `${formatter.format(currentPaymentObj.principalPayment)}`;
        rowCols[3].textContent = `${formatter.format(currentPaymentObj.interestPayment)}`;
        rowCols[4].textContent = `${formatter.format(currentPaymentObj.totalInterest)}`;
        rowCols[5].textContent = `${formatter.format(currentPaymentObj.remainingBalance)}`;

        // Apply TDs to current row on page
        tableBody.appendChild(tableRow);
    }
    // Show payments section
    document.getElementById("payments").classList.remove("invisible");
}

// Output totals to page
function displayTotals (returnObj, totalPrincipal) {
    // Get values to display
    let totalMonthlyPay = returnObj.totalMonthlyPay;
    let finalPaymentObj = returnObj.paymentObjArr.pop();
    let totalInterest = finalPaymentObj.totalInterest;
    let totalCost = totalPrincipal + totalInterest;

    // Populate and format values to totals
    document.getElementById("monthlyPayment").innerHTML = `${formatter.format(totalMonthlyPay)}`;
    document.getElementById("totalPrincipal").innerHTML = `${formatter.format(totalPrincipal)}`;
    document.getElementById("totalInterest").innerHTML = `${formatter.format(totalInterest)}`;
    document.getElementById("totalCost").innerHTML = `${formatter.format(totalCost)}`;
    // Show totals section
    document.getElementById("totals").classList.remove("invisible");
}