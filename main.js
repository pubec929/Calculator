class Calculator {
	constructor(previousOperandTextElement, currentOperandTextElement) {
		this.previousOperandTextElement = previousOperandTextElement;
		this.currentOperandTextElement = currentOperandTextElement;
		this.clear();
	}

	clear() {
		this.currentOperand = '';
		this.previousOperand = '';
		this.operation = undefined;
	}

	delete() {
		console.log(this.currentOperand, this.previousOperand.includes('='));
		if (this.previousOperand.includes('=')) {
			this.previousOperand = '';
		}
		this.currentOperand = this.currentOperand.toString().slice(0, -1);
	}

	appendNumber(number) {
		if (number === '.' && this.currentOperand.includes('.')) {
			return;
		}
		this.currentOperand = this.currentOperand.toString() + number.toString();
	}

	changeSign() {
		if (this.currentOperand[0] != '-') {
			this.currentOperand = `-${this.currentOperand}`;
		} else {
			this.currentOperand = this.currentOperand.slice(
				1,
				this.currentOperand.length,
			);
		}
	}

	chooseOperation(operation) {
		if (this.currentOperand === '') return;
		if (this.previousOperand !== '') {
			this.compute();
		}
		this.operation = operation;
		this.previousOperand = this.currentOperand;
		this.currentOperand = '';
	}

	compute() {
		let computation;
		const prev = parseFloat(this.previousOperand);
		const current = parseFloat(this.currentOperand);

		if (isNaN(prev) || isNaN(current)) return;
		console.log(this.operation);
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
	}

	getDisplayNumber(number) {
		const stringNumber = number.toString();
		const integerDigits = parseFloat(stringNumber.split('.')[0]);
		const decimalDigits = stringNumber.split('.')[1];
		let integerDisplay;
		if (isNaN(integerDigits)) {
			integerDisplay = '';
		} else {
			integerDisplay = integerDigits.toLocaleString('en', {
				maximumFractionDigits: 0,
			});
		}
		if (decimalDigits != null) {
			return `${integerDisplay}.${decimalDigits}`;
		} else {
			return integerDisplay;
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
			this.previousOperandTextElement.innerText = this.previousOperand;
		}
	}
}

const previousOperandTextElement = document.querySelector(
	'[data-previous-operand]',
);
const currentOperandTextElement = document.querySelector(
	'[data-current-operand]',
);

const calculator = new Calculator(
	previousOperandTextElement,
	currentOperandTextElement,
);

// start Interaction
document.addEventListener('click', handleMouseClick);
document.addEventListener('keydown', handleKeyPress);

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
	} else {
		return;
	}

	calculator.updateDisplay();
}

function handleKeyPress(e) {
	operators = ['*', '/', ':', '+', '-', '^'];

	let key = e.key; // asign e.key to key, cuz e.key isn't changeable

	if (key === 'Dead') {
		// key is Dead when the ^ key is just clicked once
		key = '^';
	}

	if (key.match(/[0-9]/) || key === '.') {
		calculator.appendNumber(key);
	} else if (key === 'Backspace' || key === 'Delete') {
		calculator.delete();
	} else if (key.toLowerCase() === 'c') {
		calculator.clear();
	} else if (key === 'Enter') {
		calculator.compute();
	} else if (operators.includes(key)) {
		if (key === '/' || key === ':') {
			key = '÷';
		}
		calculator.chooseOperation(key);
	}
	calculator.updateDisplay();
}
