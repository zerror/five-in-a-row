import React from 'react';
import { ResizableBox } from 'react-resizable';
import { calculateWinner, getAIMove, initialGameState } from '../functions';
import { FormattedMessage } from 'react-intl';
import { MODE_PRACTICE, MODE_AI_VERSUS, MODE_VERSUS_AI, MIN_COLUMNS, MAX_COLUMNS, SQUARE_WIDTH, DEV_ENV } from '../common';
import { MessageData } from "../component/message-data";


export class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialGameState(MODE_PRACTICE, MIN_COLUMNS);
		this.width = SQUARE_WIDTH * MIN_COLUMNS;

    let session = JSON.parse(localStorage.getItem('5R-SessionData') || "{}");
    if ('gameState' in session) {
      this.state = session.gameState;
			this.width = SQUARE_WIDTH * this.state.cols;
    }

    this.resizeBoard = this.resizeBoard.bind(this);
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.saveGameStateToSessionStorage.bind(this) );

		if (this.state.stepNumber === 0 && this.props.mode === MODE_AI_VERSUS) {
			this.changeMode(this.props.mode);
		}
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.saveGameStateToSessionStorage.bind(this) );
    this.saveGameStateToSessionStorage();
  }

  componentWillReceiveProps(nextProps, nextContext) {
  	if (this.props.mode !== nextProps.mode || this.props.id !== nextProps.id) {
  		this.changeMode(nextProps.mode);
  	}
	}

	saveGameStateToSessionStorage() {
    let session = JSON.parse(localStorage.getItem('5R-SessionData') || "{}");
    session.gameState = this.state;
    localStorage.setItem('5R-SessionData', JSON.stringify(session));
  }

  resizeBoard(e, data) {
  	let width = data.size.width;
  	let oldWidth = this.width;
		let newSize = Math.floor(width / SQUARE_WIDTH);

		if (width > oldWidth && newSize <= MAX_COLUMNS) {
			this.width = width;
			this.setState({ cols: newSize }, this.saveGameStateToSessionStorage());
		} else if (width < (oldWidth - SQUARE_WIDTH / 2) && newSize > MIN_COLUMNS) {
			newSize = newSize - 1;
			this.width = width;
			this.setState({ cols: newSize }, this.saveGameStateToSessionStorage());
		}
  }

  addMarker(i, playerMove = true) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const { winner, indexes } = calculateWinner(squares, this.state.cols);
    if ((winner && indexes) || squares[i]) {
    	this.setState({ xIsNext: !this.state.xIsNext });
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{ squares: squares, }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    }, function () {
			if (this.props.mode === MODE_VERSUS_AI && playerMove) {
				let move = getAIMove(Object.assign({}, this.state), squares.slice(), this.state.cols);
				this.addMarker(move, false);

			} else if (this.props.mode === MODE_AI_VERSUS && playerMove) {
    		let move = getAIMove(Object.assign({}, this.state), squares.slice(), this.state.cols);
				this.addMarker(move, false);
			}
		});
  }

  jumpTo(step) {
  	if (this.props.mode === MODE_PRACTICE) {
  		this.setState({ xIsNext: !this.state.xIsNext });
  	}
    this.setState({ stepNumber: step });
  }

  changeMode(mode) {
		let gameState = initialGameState(mode, this.state.cols, this.state.nickname);
    this.setState(gameState, function () {
    	if (mode === MODE_AI_VERSUS) {
    		const squares = this.state.history[0].squares.slice();
    		let move = getAIMove(Object.assign({}, this.state), squares.slice(), this.state.cols);
				this.addMarker(move, false);
			}
		});
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares;
    const cols = this.state.cols;
    const { winner, indexes } = calculateWinner(current.squares, cols);

    let status = <FormattedMessage id="game.next_player" defaultMessage="Next player: {player}" values={{ player: (this.state.xIsNext ? 'X' : 'O') }}/>;
    if (winner) {
		  status = <strong><FormattedMessage id="game.winner" defaultMessage="Winner: {player}" values={{ player: winner }}/></strong>;
    }

		let steps = (this.props.mode === MODE_PRACTICE ? 1 : 2);
    let undoDisabled = (this.state.stepNumber - steps < 0 ? 'disabled' : '');
    let redoDisabled = (this.state.stepNumber >= history.length - steps ? 'disabled' : '');

    return (
			<div className="game-view">
				<div className="game">

					<style>
						{ `.square { line-height: ${SQUARE_WIDTH}px;	height: ${SQUARE_WIDTH}px;	width: ${SQUARE_WIDTH}px; }` }
						{ this.state.stepNumber ? ".react-resizable-handle { display: none; }" : "" }
					</style>

					<Board squares={squares} highlite={indexes} cols={cols} resizeBoard={this.resizeBoard} onClick={(i) => this.addMarker(i) } />

					<MessageData nickname={this.state.nickname} messages={this.props.messages} cols={this.state.cols} />
				</div>

				<div className="game-info">
					<div className="status">{status}</div>

					<div className="undo-redo">
						<button disabled={undoDisabled} onClick={() => this.jumpTo(this.state.stepNumber - steps)}>
							<FormattedMessage id="game.undo" defaultMessage="Undo" />
						</button>
						<button disabled={redoDisabled} onClick={() => this.jumpTo(this.state.stepNumber + steps)}>
							<FormattedMessage id="game.redo" defaultMessage="Redo" />
						</button>
					</div>
				</div>

			</div>
    );
  }
}

function Square(props) {
	let className = props.className + (props.value ? " " + props.value : "");
	let title = (DEV_ENV ? props.index : '');

	return (
		<button className={className} onClick={props.onClick} title={title}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	constructor(props) {
		super(props);
		this.resizeBoard = this.props.resizeBoard.bind(this);
	}

  renderSquare(i, className) {
    return <Square key={i} index={i} value={this.props.squares[i]} className={className} onClick={() => this.props.onClick(i)} />;
  }

	render() {
		let rows = [];
		for (let i = 0; i < this.props.cols; i++) {
			let cells = [];
			for (let j = 0; j < this.props.cols; j++) {
				let index = i * this.props.cols + j;
				let className = "square";
				if (this.props.highlite.indexOf(index) >= 0) {
					className += " highlite-square";
				}
				cells.push(this.renderSquare(index, className));
			}
			rows.push(<div className="board-row" key={i} > {cells} </div>);
		}

		const minSize = SQUARE_WIDTH * MIN_COLUMNS;
		const maxSize = SQUARE_WIDTH * MAX_COLUMNS;

		return (
				<ResizableBox
					onResize={this.resizeBoard}
					lockAspectRatio={true}
					width={SQUARE_WIDTH * this.props.cols}
					height={SQUARE_WIDTH * this.props.cols}
					minConstraints={[minSize, minSize]}
					maxConstraints={[maxSize, maxSize]}
					className="board">{rows}</ResizableBox>
		);
  }
}
