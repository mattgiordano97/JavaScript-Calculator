/* Constants and global variables */
let currentInput = '0';
let historyInput = '';
let isResult = false;
let isNumberStart = true;

/* Display input */
const displayInput = () => {
    $('#display-input').text(currentInput);
}
const displayHistory = () => {
    let formattedHistory;
    if (historyInput.length > 30) {
        formattedHistory = '';
        for (let i = 0; i < historyInput.length; i+= 30) {
            formattedHistory += historyInput.slice(i, i + 30) + '\n';
        }
    }
    else {
        formattedHistory = historyInput;
    }
    $('#display-history').text(formattedHistory);
}

/* Evaluate binary operation */
const getResult = (op1, op2, sign, operator) => {
    let result;
    let num1 = Number(op1);
    let num2 = Number(op2);
    if (sign === '-') {
        num1 = -num1;
    }

    switch (operator) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case 'x':
            result = num1 * num2;
            break;
        case '/':
            result = num1 / num2;
            break;
    
        default:
            console.log('Error in getResult()');
            break;
    }

    if (result > 0) {
        result = '+' + result;
    }
    return result.toString();
}

/* Evaluate expression in historyInput */
const evaluateExpression = () => {
    let result;
    let expression = historyInput;

    /* Evaluate result */

    // Evaluate high precedence operations
    const reg = /([+-]*)(\d*\.*\d+)([x\/])(\d+\.*\d*)/;
    let highPrecedence = expression.match(reg);

    while (highPrecedence) {
        // Extract a pair of numbers and their operand
        const [matchedString, sign, op1, operator, op2] = highPrecedence;
        // Evaluate result of the operation
        result = getResult(op1, op2, sign, operator);
        // Replace numbers and their operand from expression
        expression = expression.replace(matchedString, result);

        // Find if there are any other high precedence expressions
        highPrecedence = expression.match(reg);
    }

    // Evaluate low precedence operations
    const reg2 = /([+-]*)(\d*\.*\d+)([\+-])(\d+\.*\d*)/;
    let lowPrecedence = expression.match(reg2);
    while (lowPrecedence) {
        const [matchedString, sign, op1, operator, op2] = lowPrecedence;
        result = getResult(op1, op2, sign, operator);
        expression = expression.replace(matchedString, result);

        lowPrecedence = expression.match(reg2);
    }

    // Display result
    return Number(result);
}

/* On document ready */
$(document).ready(function () {
    // Clear button
    $('#btn-AC').on('click', function () {
        isResult = false;
        isNumberStart = true;
        currentInput = '0';
        historyInput = '';

        displayInput();
        displayHistory();
    });

    // Number button
    $('.btn-number').on('click', function (e) {
        const newDigit = $(e.target).text();

        // If display-input is full don't allow to add a new digit
        if (currentInput.length > 24 || historyInput.length > 59) {
            return;
        }
        
        if (isResult) {
            historyInput = '';
            isResult = false;
        }
        /* Update currentInput */
        // If there is zero or an operator in current input, overwrite it with new digit
        // Otherwise, append the next digit to current input
        if (isNumberStart) {
            if (currentInput === '0') {
                historyInput = historyInput.slice(0, historyInput.length - 1) + newDigit;
            }
            else {
                historyInput += newDigit;
            }
            currentInput = newDigit;
        }
        else {
            currentInput += newDigit;
            historyInput += newDigit;
        }

        if (newDigit !== '0') {
            isNumberStart = false;
        }
        
        // Display new inputs
        displayInput();
        displayHistory();
    });

    // Operator button
    $('.btn-operator').on('click', function (e) {
        // If history-input is full don't allow to add a new operator
        if (historyInput.length > 59) {
            return;
        }

        const newOperator = $(e.target).text();

        if (isNumberStart) {
            if (isResult) {
                historyInput = historyInput.slice(historyInput.indexOf('=') + 1) + newOperator;
                isResult = false;
            }
            else {
                if (historyInput === '' && newOperator.match(/[^-]/)) {
                }
                else {
                    historyInput = historyInput.slice(0, historyInput.length - 1) + newOperator;
                }
            }
        }
        else {
            historyInput += newOperator;
            isNumberStart = true;
        }
        currentInput = newOperator;

        // Display new inputs
        displayInput();
        displayHistory();
    });

    // Equal button
    $('#btn-equal').on('click', function (e) {

        // Evaluate result
        const result = evaluateExpression();

        // Update variables
        isResult = true;
        isNumberStart = true;
        currentInput = result;
        historyInput += '=' + result;

        // Display new inputs
        displayInput();
        displayHistory();
    });

    // Dot button
    $('#btn-point').on('click', function () {
        if (currentInput.match(/[0\+-\/x]/)) {
            currentInput = '0.';
            historyInput += '0.';
            isNumberStart = false;
        }
        else {
            currentInput += '.';
            historyInput += '.';
        }
        displayInput();
        displayHistory();
    });

});