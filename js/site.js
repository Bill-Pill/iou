// Get and verify input values
function getValues() {
    let loanValue = document.getElementById("loanValue").value;
    let termValue = document.getElementById("termValue").value;
    let interestValue = document.getElementById("interestValue").value;

    // Convert float/integer
    loanValue = parseFloat(loanValue);
    termValue = parseFloat(termValue);
    interestValue = parseFloat(interestValue);

    // Validate inputs as numbers
    if (Number.isFinite(loanValue) && Number.isInteger(termValue) && Number.isFinite(interestValue)) {
        // Call calculate function
        let returnObjArr = calcPayments(loanValue, termValue, interestValue);
        // output function
        displayPayments(returnObjArr);
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


    // Loop for m months
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
    let returnObj = {
        paymentObjArr, totalMonthlyPay

    };
    return returnObj;
}

// Output results
function displayPayments(returnObjArr) {
    // Get table body
    let tableBody = document.getElementById("results");

    // Get template row
    let templateRow = document.getElementById("paymentsTemplate");

    let payment = returnObjArr.totalMonthlyPay;
    let paymentObjArr = returnObjArr.paymentObjArr;

    for (let i = 0; i < paymentObjArr.length; i++) {
        let tableRow = document.importNode(templateRow.content, true);
        let rowCols = tableRow.querySelectorAll("td");

        rowCols[0].textContent = payment;

        // Apply TDs to current row on page
        tableBody.appendChild(tableRow);
    }
}