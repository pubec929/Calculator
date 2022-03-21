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

		this.previousOperand = `${this.getDisplayNumber(this.previousOperand)} ${
			this.operation
		} ${this.getDisplayNumber(this.currentOperand)} =`;
		this.currentOperand = computation;
		this.operation = undefined;
		history.addCalculation(
			`${this.previousOperand} ${this.getDisplayNumber(this.currentOperand)}`,
		);
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
}

class calculationsHistory {
	constructor(calculations) {
		this.calculations = calculations != undefined ? calculations : []; // All calculations will be stored here

		if (this.calculations.length != 0) {
			this.calculations.forEach(this.addToDisplay);
		}
	}

	addCalculation(calculation) {
		// Adds a calculation to the calculations
		this.calculations.push(calculation);
		this.addToDisplay(calculation);
		localStorage.setItem('history', JSON.stringify(this.calculations));
	}

	clear() {
		this.calculations = [];
		while (calculationsElement.lastChild) {
			calculationsElement.removeChild(calculationsElement.lastChild);
		}
		localStorage.removeItem('history');
	}

	addToDisplay(value) {
		let newCalculation = document.createElement('div');
		const calculationText = document.createElement('p');
		const copyButton = document.createElement('button');

		calculationText.innerText = value;
		copyButton.innerHTML = `<svg
		xmlns="http://www.w3.org/2000/svg"
		id="Outline"
		viewBox="0 0 24 24"
		data-copy
		width="20"
		fill="#fff"
		height="20"
		>
		<path
			d="M21.155,3.272,18.871.913A3.02,3.02,0,0,0,16.715,0H12A5.009,5.009,0,0,0,7.1,4H7A5.006,5.006,0,0,0,2,9V19a5.006,5.006,0,0,0,5,5h6a5.006,5.006,0,0,0,5-5v-.1A5.009,5.009,0,0,0,22,14V5.36A2.988,2.988,0,0,0,21.155,3.272ZM13,22H7a3,3,0,0,1-3-3V9A3,3,0,0,1,7,6v8a5.006,5.006,0,0,0,5,5h4A3,3,0,0,1,13,22Zm4-5H12a3,3,0,0,1-3-3V5a3,3,0,0,1,3-3h4V4a2,2,0,0,0,2,2h2v8A3,3,0,0,1,17,17Z"
		/>
		</svg>`;

		copyButton.classList.add('copy-button');
		copyButton.setAttribute('data-history-copy', undefined);
		copyButton.setAttribute('data-message', 'Copy to Clipboard');

		newCalculation = calculationsElement.insertBefore(
			newCalculation,
			calculationsElement.firstChild,
		);

		newCalculation.classList.add('calculation');

		newCalculation.appendChild(calculationText);
		newCalculation.appendChild(copyButton);
	}
}

// Method for copying
function copy(button, value, isModalOpen = false) {
	if (value === '') {
		return;
	}
	const container = isModalOpen ? historyModal : body;

	const defaultHMTL = button.innerHTML;
	const invisibleInput = document.createElement('input');

	invisibleInput.setAttribute('readonly', '');

	invisibleInput.classList.add('invisible');

	container.appendChild(invisibleInput);

	invisibleInput.value = value;
	invisibleInput.select();

	document.execCommand('copy');

	container.removeChild(invisibleInput);

	button.setAttribute('data-message', 'Copied to clipboard');
	button.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" version="1.1" width="20" height="20" x="0" y="0" viewBox="0 0 24 24" style="enable-background:new 0 0 512 512" xml:space="preserve"><g><path xmlns="http://www.w3.org/2000/svg" d="M22.319,4.431,8.5,18.249a1,1,0,0,1-1.417,0L1.739,12.9a1,1,0,0,0-1.417,0h0a1,1,0,0,0,0,1.417l5.346,5.345a3.008,3.008,0,0,0,4.25,0L23.736,5.847a1,1,0,0,0,0-1.416h0A1,1,0,0,0,22.319,4.431Z" fill="#29e50d" data-original="#000000"/></g></svg>
	`;

	setTimeout(() => {
		button.innerHTML = defaultHMTL;
		button.setAttribute('data-message', 'Copy to clipboard');
	}, 2500);
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

const historyModal = document.querySelector('[data-modal]');
const calculationsElement = document.querySelector('[data-calculations]');

// Init Calculator
const calculator = new Calculator(
	previousOperandTextElement,
	currentOperandTextElement,
	copyButton,
);

// Read theme from local storage
const theme = localStorage.getItem('theme');

if (theme) {
	body.classList.add(theme);
}

// Read history from local storage
const calculationsArray = JSON.parse(localStorage.getItem('history'));

// Init calculationsHistory
const history = new calculationsHistory(calculationsArray);

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
		copy(e.target, calculator.currentOperand);
	} else if (e.target.matches('[data-theme]')) {
		switchTheme(e.target.getAttribute('id'));
	} else if (e.target.matches('[data-history]')) {
		historyModal.showModal();
	} else if (e.target.matches('[data-clear-history]')) {
		history.clear();
	} else if (e.target.matches('[data-history-copy]')) {
		const calculationContainer = e.target.parentElement;
		const calculationToCopy = calculationContainer.firstElementChild.innerText;

		copy(e.target, calculationToCopy, true);
	} else if (e.target.matches('[data-close-modal]')) {
		historyModal.close();
	} else {
		return;
	}

	calculator.updateDisplay();
}

function handleKeyPress(e) {
	// If the modal is open, interactivity should be stopped
	if (historyModal.hasAttribute('open')) return;

	if (e.key.match(/[0-9]/) || e.key === '.') {
		calculator.appendNumber(e.key);
	} else if (e.key === 'Backspace' || e.key === 'Delete') {
		calculator.delete();
	} else if (e.key.toLowerCase() === 'c') {
		if (e.ctrlKey) calculator.copy();
		else calculator.clear();
	} else if (e.key === 'Enter') {
		calculator.compute();
	} else if (operators.includes(e.key)) {
		calculator.handleOperators(e);
	} else return;

	calculator.updateDisplay();
}
