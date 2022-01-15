/* eslint-disable default-case */
import React, { useReducer } from "react";
import DigitButton from "./DigitButton";
import Footer from "./Footer";
import Header from "./Header";
import OperationButton from "./OperationButton";
import "./styles.css";

export const ACTIONS = {
	ADD_DIGIT: "add_digit",
	CHOOSE_OPERATION: "choose_operation",
	CLEAR: "clear",
	DELETE_DIGIT: "delete_digit",
	EVALUATE: "evaluate",
};

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
	maximumFractionDigits: 0,
});

function formatOperand(operand) {
	if (operand == null) return;
	const [integer, fraction] = operand.split(".");
	if (fraction == null) return INTEGER_FORMATTER.format(integer);
	return `${INTEGER_FORMATTER.format(integer)}.${fraction}`;
}

const reducer = (state, { type, payload }) => {
	switch (type) {
		case ACTIONS.ADD_DIGIT:
			if (state.overwrite)
				return {
					...state,
					currentOperand: payload.digit,
					overwrite: false,
				};
			if (payload.digit === "0" && state.currentOperand === "0")
				return state;
			if (state.currentOperand === "0")
				return {
					...state,
					currentOperand: payload.digit,
				};
			if (payload.digit === "." && state.currentOperand.includes("."))
				return state;
			return {
				...state,
				currentOperand: `${state.currentOperand || ""}${payload.digit}`,
			};

		case ACTIONS.DELETE_DIGIT:
			if (state.overwrite) {
				return {
					...state,
					overwrite: false,
					currentOperand: null,
				};
			}

			if (state.currentOperand == null) return state;
			if (state.currentOperand.length === 1)
				return {
					...state,
					currentOperand: null,
				};

			return {
				...state,
				currentOperand: state.currentOperand.slice(0, -1),
			};

		case ACTIONS.CLEAR:
			return {};

		case ACTIONS.CHOOSE_OPERATION:
			if (state.currentOperand == null && state.previousOperand == null)
				return state;

			if (state.currentOperand == null) {
				return {
					...state,
					operation: payload.operation,
				};
			}

			if (state.previousOperand == null)
				return {
					...state,
					operation: payload.operation,
					previousOperand: state.currentOperand,
					currentOperand: null,
				};

			return {
				...state,
				operation: payload.operation,
				previousOperand: evaluate(state),
				currentOperand: null,
			};

		case ACTIONS.EVALUATE:
			if (
				state.previousOperand == null ||
				state.currentOperand == null ||
				state.operation == null
			)
				return state;
			return {
				...state,
				previousOperand: null,
				operation: null,
				currentOperand: evaluate(state),
				overwrite: true,
			};
	}
};

const evaluate = ({ previousOperand, operation, currentOperand }) => {
	const prev = parseFloat(previousOperand);
	const curr = parseFloat(currentOperand);
	if (isNaN(prev) || isNaN(curr)) return "";
	let computation = "";
	switch (operation) {
		case "+":
			computation = prev + curr;
			break;
		case "-":
			computation = prev - curr;
			break;
		case "*":
			computation = prev * curr;
			break;
		case "÷":
			computation = prev / curr;
			break;
	}
	return computation.toString();
};

const App = () => {
	const [{ currentOperand, previousOperand, operation }, dispatch] =
		useReducer(reducer, {});

	return (
		<div className="outermost">
			<Header />
			<div className="calculator-grid">
				<div className="output">
					<div className="previous-operand">
						{formatOperand(previousOperand)} {operation}
					</div>
					<div className="current-operand">
						{formatOperand(currentOperand)}
					</div>
				</div>
				<button
					className="span-two"
					onClick={() => {
						dispatch({ type: ACTIONS.CLEAR });
					}}
				>
					AC
				</button>
				<button
					onClick={() => {
						dispatch({ type: ACTIONS.DELETE_DIGIT });
					}}
				>
					DEL
				</button>
				<OperationButton dispatch={dispatch} operation={"÷"} />
				<DigitButton dispatch={dispatch} digit={"1"} />
				<DigitButton dispatch={dispatch} digit={"2"} />
				<DigitButton dispatch={dispatch} digit={"3"} />
				<OperationButton dispatch={dispatch} operation={"*"} />
				<DigitButton dispatch={dispatch} digit={"4"} />
				<DigitButton dispatch={dispatch} digit={"5"} />
				<DigitButton dispatch={dispatch} digit={"6"} />
				<OperationButton dispatch={dispatch} operation={"+"} />
				<DigitButton dispatch={dispatch} digit={"7"} />
				<DigitButton dispatch={dispatch} digit={"8"} />
				<DigitButton dispatch={dispatch} digit={"9"} />
				<OperationButton dispatch={dispatch} operation={"-"} />
				<DigitButton dispatch={dispatch} digit={"."} />
				<DigitButton dispatch={dispatch} digit={"0"} />
				<button
					className="span-two"
					onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
				>
					=
				</button>
			</div>
			<Footer />
		</div>
	);
};

export default App;
