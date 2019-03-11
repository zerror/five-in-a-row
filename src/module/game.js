import React from 'react';
import { ResizableBox } from 'react-resizable';
import { calculateWinner, getAIMove } from '../functions';
import { FormattedMessage } from 'react-intl';

const MODE_PRACTICE = 0;
const MODE_VERSUS_AI = 1;
const MODE_AI_VERSUS = 2;
// const MODE_VERSUS_HUMAN = 3;

const MIN_COLUMNS = 15;
const MAX_COLUMNS = 25;
const SQUARE_WIDTH = 34;

function Square(props) {
	let className = props.className + (props.value ? " " + props.value : "");

	return (
		<button className={className} onClick={props.onClick}>
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
    return <Square key={i} value={this.props.squares[i]} className={className} onClick={() => this.props.onClick(i)} />;
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

export class Game extends React.Component {
  constructor(props) {
    super(props);

		this.modes = [
      <FormattedMessage id="game.practice" defaultMessage="practice" />,
      <FormattedMessage id="game.mode_vs_ai" defaultMessage="versus AI" />,
      <FormattedMessage id="game.mode_ai_vs" defaultMessage="AI versus" />,
    ];
    this.width = SQUARE_WIDTH * MIN_COLUMNS;
		this.state = {
      history: [{ squares: Array(MIN_COLUMNS * MIN_COLUMNS).fill(null) }],
      cols: MIN_COLUMNS,
      xIsNext: true,
      stepNumber: 0,
      mode: MODE_PRACTICE
    };

    let session = JSON.parse(localStorage.getItem('5R-SessionData') || "{}");
    if ('state' in session) {
      this.state = session.state;
      this.width = SQUARE_WIDTH * this.state.cols;
    } else {
      session.state = this.state;
      localStorage.setItem('5R-SessionData', JSON.stringify(session));
    }

    this.resizeBoard = this.resizeBoard.bind(this);
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.saveStateToSessionStorage.bind(this) );
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.saveStateToSessionStorage.bind(this) );
    this.saveStateToSessionStorage();
  }

  saveStateToSessionStorage() {
    let session = JSON.parse(localStorage.getItem('5R-SessionData') || "{}");
    session.state = this.state;
    localStorage.setItem('5R-SessionData', JSON.stringify(session));
  }

  changeLang(e, lang) {
    e.preventDefault();
    this.props.action(lang);
  }

  resizeBoard (e, data) {
  	let width = data.size.width;
  	let oldWidth = this.width;
		let newSize = Math.floor(width / SQUARE_WIDTH);

		if (width > oldWidth && newSize <= MAX_COLUMNS) {
			this.width = width;
			this.setState({ cols: newSize });
		} else if (width < (oldWidth - SQUARE_WIDTH / 2) && newSize > MIN_COLUMNS) {
			newSize = newSize - 1;
			this.width = width;
			this.setState({ cols: newSize });
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
			if (this.state.mode === MODE_VERSUS_AI && playerMove) {
				let move = getAIMove(Object.assign({}, this.state), squares.slice(), this.state.cols);
				this.addMarker(move, false);

			} else	if (this.state.mode === MODE_AI_VERSUS && playerMove) {
    		let move = getAIMove(Object.assign({}, this.state), squares.slice(), this.state.cols);
				this.addMarker(move, false);
			}
		});
  }

  changeMode(mode) {
  	let xIsNext = this.state.xIsNext;
		if (mode === MODE_VERSUS_AI) {
			xIsNext = true;
		} else if (mode === MODE_AI_VERSUS) {
			xIsNext = false;
		}

    this.setState({
      history: [{ squares: Array(this.state.cols * this.state.cols).fill(null) }],
      stepNumber: 0,
      xIsNext: xIsNext,
      mode: mode,
    }, function () {
    	if (mode === MODE_AI_VERSUS) {
    		const squares = this.state.history[0].squares.slice();
    		let move = getAIMove(Object.assign({}, this.state), squares.slice(), this.state.cols);
				this.addMarker(move, false);
			}
		});
  }

  jumpTo(step) {
  	if ((this.state.stepNumber - step) % 2 !== 0) {
  		this.setState({ xIsNext: !this.state.xIsNext });
  	}
    this.setState({ stepNumber: step });
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

		let steps = (this.state.mode === MODE_PRACTICE ? 1 : 2);
    let undoDisabled = (this.state.stepNumber - steps < 0 ? 'disabled' : '');
    let redoDisabled = (this.state.stepNumber >= history.length - steps ? 'disabled' : '');
		let hideResize = this.state.stepNumber ? ".react-resizable-handle { display: none; }" : "";

    return (
			<div className="game">

				<style>
					{ `.square { line-height: ${SQUARE_WIDTH}px;	height: ${SQUARE_WIDTH}px;	width: ${SQUARE_WIDTH}px; }` }
					{ hideResize }
				</style>

				<Board squares={squares} highlite={indexes} cols={cols} resizeBoard={this.resizeBoard} onClick={(i) => this.addMarker(i) } />

				<div className="game-info">
					<div className="status">{status}</div>

					<div className="undo-redo">
						<button disabled={undoDisabled} onClick={() => this.jumpTo(this.state.stepNumber - steps)}>
							<FormattedMessage id="game.undo" defaultMessage="Undo" /></button>
						<button disabled={redoDisabled} onClick={() => this.jumpTo(this.state.stepNumber + steps)}>
							<FormattedMessage id="game.redo" defaultMessage="Redo" /></button>
					</div>

					<div className="mode-label"><FormattedMessage id="game.mode" defaultMessage="Mode" />: {this.modes[this.state.mode]}</div>

					<FormattedMessage id="game.practice_game" defaultMessage="Practice">
						{text => <input className="game-button" type="button" onClick={() => this.changeMode(MODE_PRACTICE)} value={text} />}
					</FormattedMessage>

					<FormattedMessage id="game.vs_ai" defaultMessage="Versus AI">
						{text => <input className="game-button" type="button" onClick={() => this.changeMode(MODE_VERSUS_AI)} value={text} />}
					</FormattedMessage>

					<FormattedMessage id="game.ai_vs" defaultMessage="AI versus">
						{text => <input className="game-button" type="button" onClick={() => this.changeMode(MODE_AI_VERSUS)} value={text} />}
					</FormattedMessage>

					<div className="lang-selector"><FormattedMessage id="game.language" defaultMessage="Language" />:&nbsp;
						{this.props.locale === "fi" ? "FI" : <a href="/" onClick={(e) => this.changeLang(e, "fi")}>FI</a>} |&nbsp;
						{this.props.locale === "en" ? "EN" : <a href="/" onClick={(e) => this.changeLang(e, "en")}>EN</a>}
					</div>

					<div className="readme-link">
						<FormattedMessage id="page.here-be" defaultMessage="Here be.. " />
						<a href="https://github.com/zerror/five-in-a-row/blob/master/README.md" target="_blank" rel="noopener noreferrer">
							<FormattedMessage id="page.readme-link" defaultMessage="README!" />
						</a>
					</div>

				</div>
			</div>
    );
  }
}


