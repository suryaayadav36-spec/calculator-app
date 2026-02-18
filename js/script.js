// Calculator Class for managing calculator state and operations
class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    // Clear current operand only (C button)
    clear() {
        this.currentOperand = '';
        this.updateDisplay();
    }

    // All Clear - reset everything (AC button)
    allClear() {
        this.previousOperand = '';
        this.currentOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    // Remove the last digit (Backspace button)
    backspace() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        this.updateDisplay();
    }

    // Add a number or decimal point to current operand
    addNumber(number) {
        // Prevent multiple decimal points
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        // Prevent leading zeros (except for decimals like 0.5)
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        
        this.updateDisplay();
    }

    // Choose an operation
    chooseOperation(operation) {
        // If no current operand, don't proceed
        if (this.currentOperand === '') return;

        // If there's already a previous operand and operation, calculate first
        if (this.previousOperand !== '') {
            this.calculate();
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    // Perform the calculation
    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        // If both operands don't exist, don't calculate
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                // Error handling for division by zero
                if (current === 0) {
                    this.currentOperand = 'Error: Div by 0';
                    this.operation = undefined;
                    this.previousOperand = '';
                    this.updateDisplay();
                    return null;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        // Round to avoid floating point errors
        this.currentOperand = Math.round(computation * 100000000) / 100000000;
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
        
        return computation;
    }

    // Update the display
    updateDisplay() {
        this.currentOperandElement.innerText = this.formatDisplay(this.currentOperand);
        
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.formatDisplay(this.previousOperand)} ${this.formatOperation(this.operation)}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }

    // Format display output
    formatDisplay(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];

        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    // Format operation symbols for display
    formatOperation(operation) {
        switch (operation) {
            case '+': return '+';
            case '-': return '−';
            case '*': return '×';
            case '/': return '÷';
            default: return '';
        }
    }

    // Get the display value for history
    getDisplayValue() {
        return this.formatDisplay(this.currentOperand);
    }
}

// History Manager Class
class HistoryManager {
    constructor(maxItems = 5) {
        this.maxItems = maxItems;
        this.items = this.loadHistory();
    }

    // Add item to history
    addItem(calculation) {
        this.items.unshift(calculation);
        if (this.items.length > this.maxItems) {
            this.items.pop();
        }
        this.saveHistory();
    }

    // Get all history items
    getItems() {
        return this.items;
    }

    // Clear history
    clear() {
        this.items = [];
        this.saveHistory();
    }

    // Save history to localStorage
    saveHistory() {
        localStorage.setItem('calculatorHistory', JSON.stringify(this.items));
    }

    // Load history from localStorage
    loadHistory() {
        const saved = localStorage.getItem('calculatorHistory');
        return saved ? JSON.parse(saved) : [];
    }
}

// Theme Manager Class
class ThemeManager {
    constructor() {
        this.isDarkMode = this.loadTheme();
        this.applyTheme();
    }

    // Toggle theme
    toggle() {
        this.isDarkMode = !this.isDarkMode;
        this.saveTheme();
        this.applyTheme();
    }

    // Apply theme to document
    applyTheme() {
        if (this.isDarkMode) {
            document.body.classList.add('dark-mode');
            this.updateThemeIcon('☀️');
        } else {
            document.body.classList.remove('dark-mode');
            this.updateThemeIcon('🌙');
        }
    }

    // Update theme toggle button icon
    updateThemeIcon(icon) {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = icon;
        }
    }

    // Save theme preference to localStorage
    saveTheme() {
        localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }

    // Load theme preference from localStorage
    loadTheme() {
        const saved = localStorage.getItem('theme');
        if (saved) {
            return saved === 'dark';
        }
        // Use system preference as default
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
}

// DOM Elements
const previousOperandElement = document.getElementById('previousOperand');
const currentOperandElement = document.getElementById('currentOperand');
const historyList = document.getElementById('historyList');
const themeToggle = document.getElementById('themeToggle');

// Initialize classes
const calculator = new Calculator(previousOperandElement, currentOperandElement);
const history = new HistoryManager();
const theme = new ThemeManager();

// Event Listeners for Number Buttons
document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.addNumber(button.dataset.number);
    });
});

// Event Listeners for Operator Buttons
document.querySelectorAll('[data-operator]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.dataset.operator);
    });
});

// Event Listener for Equals Button
document.getElementById('equals').addEventListener('click', () => {
    const result = calculator.calculate();
    
    // If calculation was successful and not an error, add to history
    if (result !== null && calculator.currentOperand !== 'Error: Div by 0') {
        const historyEntry = `${calculator.formatDisplay(calculator.previousOperand || result)} = ${calculator.getDisplayValue()}`;
        history.addItem(historyEntry);
        updateHistoryDisplay();
    }
});

// Event Listener for Clear Button (C)
document.getElementById('clear').addEventListener('click', () => {
    calculator.clear();
});

// Event Listener for All Clear Button (AC)
document.getElementById('allClear').addEventListener('click', () => {
    calculator.allClear();
});

// Event Listener for Backspace Button
document.getElementById('backspace').addEventListener('click', () => {
    calculator.backspace();
});

// Event Listener for Theme Toggle
themeToggle.addEventListener('click', () => {
    theme.toggle();
});

// Keyboard Support
document.addEventListener('keydown', (e) => {
    // Number keys and decimal point
    if (e.key >= '0' && e.key <= '9') {
        calculator.addNumber(e.key);
    } else if (e.key === '.') {
        e.preventDefault();
        calculator.addNumber('.');
    }
    // Operators
    else if (e.key === '+') {
        e.preventDefault();
        calculator.chooseOperation('+');
    } else if (e.key === '-') {
        e.preventDefault();
        calculator.chooseOperation('-');
    } else if (e.key === '*') {
        e.preventDefault();
        calculator.chooseOperation('*');
    } else if (e.key === '/') {
        e.preventDefault();
        calculator.chooseOperation('/');
    }
    // Enter or = for equals
    else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        const result = calculator.calculate();
        if (result !== null && calculator.currentOperand !== 'Error: Div by 0') {
            const historyEntry = `${calculator.formatDisplay(calculator.previousOperand || result)} = ${calculator.getDisplayValue()}`;
            history.addItem(historyEntry);
            updateHistoryDisplay();
        }
    }
    // Backspace for backspace
    else if (e.key === 'Backspace') {
        e.preventDefault();
        calculator.backspace();
    }
    // Escape for clear
    else if (e.key === 'Escape') {
        e.preventDefault();
        calculator.allClear();
    }
});

// Update History Display
function updateHistoryDisplay() {
    const items = history.getItems();

    if (items.length === 0) {
        historyList.innerHTML = '<p class="history-empty">No calculations yet</p>';
    } else {
        historyList.innerHTML = items.map(item => `
            <div class="history-item" title="Click to use this result">${item}</div>
        `).join('');

        // Add click listeners to history items to paste result
        document.querySelectorAll('.history-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                const value = items[index].split(' = ')[1];
                calculator.currentOperand = value;
                calculator.previousOperand = '';
                calculator.operation = undefined;
                calculator.updateDisplay();
            });
        });
    }
}

// Initialize history display
updateHistoryDisplay();

// Initial display update
calculator.updateDisplay();
