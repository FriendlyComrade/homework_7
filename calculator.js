
const calc = {
    displayValue: '0',
    firstValue: null,
    waitingForSecondValue: false,
    operator: null
  };

  function addNum(num) {
    const { displayValue, waitingForSecondValue } = calc;

    if (waitingForSecondValue === true) {
      calc.displayValue = num;
      calc.waitingForSecondValue = false;
    } else {
      calc.displayValue = displayValue === '0' ? num : displayValue + num;
    }
  }
  
  function addDecimal(dot) {
    if (calc.waitingForSecondValue === true) {
        calc.displayValue = "0."
      calc.waitingForSecondValue = false;
      return
    }

    if (!calc.displayValue.includes(dot)) {
      calc.displayValue += dot;
    }
  }

  function addOperator(nextOperator) {
    const { firstValue, displayValue, operator} = calc;
    const inputValue = parseFloat(displayValue);
    
    if (firstValue === null && !isNaN(inputValue)) {    
      calc.firstValue = inputValue;
    } else if (operator) {   
      const result = calculate(firstValue, inputValue, operator);       
        if (isNaN(result)) {    
          calc.displayValue = 'Error'
        } else {
          calc.displayValue = `${parseFloat(result.toFixed(8))}`;
          calc.firstValue = result;
        }      
    }
    calc.waitingForSecondValue = true;
    calc.operator = nextOperator;  
  }
  
  function calculate(firstValue, secondValue, operator) {
    if (operator === '+') {
      return firstValue + secondValue;
    } else if (operator === '-') {
      return firstValue - secondValue;
    } else if (operator === '*') {
      return firstValue * secondValue;
    } else if (operator === '/') {
      return firstValue / secondValue;
    }
    return secondValue;
  }
  
  function resetCalculator() {
    calc.displayValue = '0',
    calc.firstValue = null,
    calc.waitingForSecondValue = false,
    calc.operator = null
  }

  function setNegativeOrPositive() {
    const inputValue = parseFloat(calc.displayValue);

    if (calc.waitingForSecondValue === true) {
        if (calc.operator !== '=') {
          calc.displayValue = '-';
        } else if (calc.operator === '=' && !calc.displayValue.includes('-')){
          calc.displayValue = '-' + calc.displayValue
        } else {
          calc.displayValue = calc.displayValue.slice(1);
        }
        calc.waitingForSecondValue = false;
      return;
    }

    if (calc.displayValue !== '0') {
        if (!calc.displayValue.includes('-')) {
          calc.displayValue = '-' + calc.displayValue;
          calc.firstValue = inputValue;
        } else {
          calc.displayValue = calc.displayValue.slice(1)
        }
    } else {
      if (calc.displayValue.length > 1) {
        calc.displayValue = '-' + calc.displayValue;
      } else {
        calc.displayValue = '-';
      }
        
    }
  }

  function deleteOneValue() {
    if (calc.displayValue.length !== 1) {
      calc.displayValue = calc.displayValue.substring(0, --calc.displayValue.length)
      calc.firstValue = parseFloat(calc.displayValue);
    } else {
      resetCalculator();
    }
  }
  
  function updateDisplay() {
    const display = document.querySelector('.viewport');
    display.value = calc.displayValue;
  }
  updateDisplay();

  
  const btns = document.querySelector('.btns');
  btns.addEventListener('click', event => {
    const { target } = event;
    const { value } = target;
    
    if (!target.matches('button')) {
      return;
    }
  
    switch (value) {
      case '+':
      case '-':
      case '*':
      case '/':
      case '=':
        addOperator(value);
        break;
      case '.':
        addDecimal(value);
        break;
      case 'C':
        resetCalculator();
        break;
      case '+/-':
        setNegativeOrPositive(value);
        break;
      case '>':
        deleteOneValue();
      default:
        if (Number.isSafeInteger(parseFloat(value))) {
          addNum(value);
        }
    }
    updateDisplay();
  });