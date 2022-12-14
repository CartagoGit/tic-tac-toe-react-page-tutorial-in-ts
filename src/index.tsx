import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

type Possibilities = "X" | "O" | null;

interface SquareProps {
	onClick: () => void;
	value: Possibilities;
}

interface BoardProps {
	onClick: (i: number) => void;
	squares: Array<Possibilities>;
	xIsNext?: boolean;
}
// interface BoardState {}

interface GameProps {}
interface GameState {
	history: { squares: Array<Possibilities> }[];
	stepNumber: number;
	xIsNext: boolean;
}

// class Square extends React.Component<SquareProps> {
// 	// state: SquareProps;
// 	// constructor(props: SquareProps) {
// 	// 	super(props);
// 	// 	this.state = { value: null, onClick: () => {} };
// 	// }
// 	render() {
// 		return (
// 			<button
// 				className="square"
// 				onClick={() => this.props.onClick()}
// 			>
// 				{this.props.value}
// 			</button>
// 		);
// 	}
// }

const Square = (props: SquareProps) => {
	return (
		<button
			className="square"
			onClick={props.onClick}
		>
			{props.value}
		</button>
	);
};

class Board extends React.Component<BoardProps> {
	// constructor(props: BoardProps) {
	// 	super(props);
	// 	this.state = {
	// 		squares: Array(9).fill(null),
	// 		xIsNext: true,
	// 	};
	// }
	// handleClick(i: number): void {
	// 	const squares = this.state.squares.slice();
	// 	if (calculateWinner(squares) || squares[i]) return;
	// 	squares[i] = this.state.xIsNext ? "X" : "O";
	// 	this.setState({ squares, xIsNext: !this.state.xIsNext });
	// }

	renderSquare(i: number) {
		return (
			<Square
				// value={this.state.squares[i]}
				value={this.props.squares[i]}
				// onClick={() => this.handleClick(i)}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		return (
			<div>
				{/* <div className="status">{status}</div> */}
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component<GameProps, GameState> {
	constructor(props: GameProps) {
		super(props);
		this.state = {
			history: [{ squares: Array(9).fill(null) }],
			stepNumber: 0,
			xIsNext: true,
		};
	}

	handleClick(i: number): void {
		// const history = this.state.history;
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) return;
		squares[i] = this.state.xIsNext ? "X" : "O";
		this.setState({
			history: history.concat([{ squares }]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}

	jumpTo(step: number) {
		this.setState({
			stepNumber: step,
			xIsNext: step % 2 === 0,
		});
	}

	render() {
		const history = this.state.history;
		// const current = history[history.length - 1];
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		const moves = history.map((_step, move) => {
			const desc = move ? "Go to move #" + move : "Go to game start";
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});

		let status;
		if (winner) status = "The Winner is... " + winner;
		else status = "Next player: " + (this.state.xIsNext ? "X" : "O");
		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={(i: number) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

// ========================================

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(<Game />);

function calculateWinner(squares: Array<Possibilities>) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}
