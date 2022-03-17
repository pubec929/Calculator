// Calculator class with methods
class Calculator {
	constructor(
		previousOperandTextElement,
		currentOperandTextElement,
		copyButton,
	) {
		this.previousOperandTextElement = previousOperandTextElement;
		this.currentOperandTextElement = currentOperandTextElement;
		this.copyButton = copyButton;
		this.clear();
	}

	clear() {
		this.currentOperand = '';
		this.previousOperand = '';
		this.operation = undefined;
	}

	delete() {
		// console.log(this.currentOperand, this.previousOperand.includes('='));
		if (this.previousOperand.includes('=')) {
			this.previousOperand = '';
		}
		this.currentOperand = this.currentOperand.toString().slice(0, -1);
	}

	appendNumber(number) {
		if (this.previousOperand.includes('=')) {
			this.previousOperand = '';
		}
		if (number === '.' && this.currentOperand.includes('.')) {
			return;
		}
		this.currentOperand = this.currentOperand.toString() + number.toString();
	}

	changeSign() {
		if (this.previousOperand.includes('=')) {
			this.previousOperand = '';
		}

		if (this.currentOperand[0] != '-') {
			this.currentOperand = `-${this.currentOperand}`;
		} else {
			this.currentOperand = this.currentOperand.slice(
				1,
				this.currentOperand.length,
			);
		}
	}

	handleOperators(e) {
		let operator = e.key; // assign e.key to operator so it is mutable

		operator = operator === '/' || operator === ':' ? '÷' : operator;
		operator = operator === 'Dead' ? '^' : operator;
		if ((operator === '-' && e.altKey) || (operator === '+' && e.altKey)) {
			this.changeSign();
		} else this.chooseOperation(operator);
	}

	chooseOperation(operation) {
		if (this.currentOperand === '') return;
		if (this.previousOperand !== '') {
			this.compute();
		}
		this.operation = operation;
		this.previousOperand = `${this.currentOperand}`;
		this.currentOperand = '';
	}

	compute() {
		let computation;
		const prev = parseFloat(this.previousOperand);
		const current = parseFloat(this.currentOperand);

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
			case '÷':
				computation = prev / current;
				break;
			case '^':
				computation = Math.pow(prev, current);
				break;
			default:
				return;
		}
		console.log(computation);

		this.previousOperand = `${this.getDisplayNumber(this.previousOperand)} ${
			this.operation
		} ${this.getDisplayNumber(this.currentOperand)} =`;
		this.currentOperand = computation;
		this.operation = undefined;
	}

	getDisplayNumber(number) {
		number = number.toString();

		if (!Number.isFinite(parseFloat(number))) {
			this.currentOperand = '';
			return '';
		}

		if (number.length <= 3) return number;

		let sign = '';

		if (number[0] === '-') {
			sign = '-';
			number = number.slice(1, number.length);
		}

		const integerDigits = [...number.split('.')[0]].reverse();
		const decimalDigits = number.split('.')[1];

		let formattedIntegerDigits = integerDigits.map((value, index) => {
			if (index % 3 == 0 && index != 0) {
				return `${value},`;
			} else {
				return value;
			}
		});

		formattedIntegerDigits = formattedIntegerDigits.reverse().join('');

		if (decimalDigits != null) {
			return `${sign}${formattedIntegerDigits}.${decimalDigits}`;
		} else {
			return `${sign}${formattedIntegerDigits}`;
		}
	}

	updateDisplay() {
		this.currentOperandTextElement.innerText = this.getDisplayNumber(
			this.currentOperand,
		);
		if (this.operation != null) {
			this.previousOperandTextElement.innerText = `${this.getDisplayNumber(
				this.previousOperand,
			)} ${this.operation}`;
		} else {
			this.previousOperandTextElement.innerText = `${this.previousOperand}`;
		}
	}

	copy() {
		if (this.currentOperand === '') {
			return;
		}

		const invisibleInput = document.createElement('input');

		invisibleInput.setAttribute('readonly', '');

		invisibleInput.classList.add('invisible');

		document.body.appendChild(invisibleInput);

		invisibleInput.value = this.currentOperand;

		invisibleInput.select();

		document.execCommand('copy');

		document.body.removeChild(invisibleInput);
	}
}

// Method for theme switching
function switchTheme(theme) {
	body.className = '';
	body.classList.add(theme);
	localStorage.setItem('theme', theme);
}

// Get DOM Elements
const body = document.body;

const previousOperandTextElement = document.querySelector(
	'[data-previous-operand]',
);
const currentOperandTextElement = document.querySelector(
	'[data-current-operand]',
);

const copyButton = document.querySelector('[data-copy]');

// Init Calculator
const calculator = new Calculator(
	previousOperandTextElement,
	currentOperandTextElement,
	copyButton,
);

// Read from local storage
const theme = localStorage.getItem('theme');

if (theme) {
	body.classList.add(theme);
}

// start Interaction
document.addEventListener('click', handleMouseClick);
document.addEventListener('keydown', handleKeyPress);

const operators = ['*', '/', ':', '+', '-', 'Dead']; // valid operators, Dead is for ^

function handleMouseClick(e) {
	if (e.target.matches('[data-number]')) {
		calculator.appendNumber(e.target.innerText);
	} else if (e.target.matches('[data-operation')) {
		calculator.chooseOperation(e.target.innerText);
	} else if (e.target.matches('[data-all-clear')) {
		calculator.clear();
	} else if (e.target.matches('[data-delete]')) {
		calculator.delete();
	} else if (e.target.matches('[data-equals]')) {
		calculator.compute();
	} else if (e.target.matches(['[data-sign]'])) {
		calculator.changeSign();
	} else if (e.target.matches('[data-copy')) {
		calculator.copy();
	} else if (e.target.matches('[data-theme]')) {
		switchTheme(e.target.getAttribute('id'));
	} else {
		return;
	}

	calculator.updateDisplay();
}

function handleKeyPress(e) {
	if (e.key.match(/[0-9]/) || e.key === '.') {
		calculator.appendNumber(e.key);
	} else if (e.key === 'Backspace' || e.key === 'Delete') {
		calculator.delete();
	} else if (e.key.toLowerCase() === 'c') {
		if (e.ctrlKey) calculator.copy();
		else calculator.clear();
	} else if (e.key === 'Enter') {
		calculator.compute();
	} else if (e.key === 'z' && e.ctrlKey) {
		calculator.undo();
	} else if (operators.includes(e.key)) {
		calculator.handleOperators(e);
	} else return;
	calculator.updateDisplay();
}
