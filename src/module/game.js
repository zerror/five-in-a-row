import React from 'react';
import { calculateWinner, getAIMove } from '../functions';
import { FormattedMessage } from 'react-intl';

const MODE_PRACTICE = 0;
const MODE_VERSUS_AI = 1;
const MODE_AI_VERSUS = 2;
// const MODE_VERSUS_HUMAN = 3;

function Square(props) {
	let className = props.className + (props.value ? " " + props.value : "");
	return (
		<button className={className} onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
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

		return (
			<div>{rows}</div>
		);
  }
}

export class Game extends React.Component {
  constructor(props) {
    super(props);

    this.cols = 15;
    this.modes = [
      <FormattedMessage id="game.practice" defaultMessage="practice" />,
      <FormattedMessage id="game.mode_vs_ai" defaultMessage="versus AI" />,
      <FormattedMessage id="game.mode_ai_vs" defaultMessage="AI versus" />,
    ];
    this.state = {
      history: [{
        squares: Array(this.cols * this.cols).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
      mode: MODE_PRACTICE
    };

    let session = JSON.parse(sessionStorage.getItem('5R-SessionData') || "{}");
    if ('state' in session) {
      this.state = session.state;
    } else {
      session.state = this.state;
      sessionStorage.setItem('5R-SessionData', JSON.stringify(session));
    }
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.saveStateToSessionStorage.bind(this) );
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.saveStateToSessionStorage.bind(this) );
    this.saveStateToSessionStorage();
  }

  saveStateToSessionStorage() {
    let session = JSON.parse(sessionStorage.getItem('5R-SessionData') || "{}");
    session.state = this.state;
    sessionStorage.setItem('5R-SessionData', JSON.stringify(session));
  }

  changeLang(e, lang) {
    e.preventDefault();
    this.props.action(lang);
  }

  addMarker(i, playerMove = true) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const { winner, indexes } = calculateWinner(squares, this.cols);
    if (winner || squares[i]) {
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
				let { move, moveScore } = getAIMove(Object.assign({}, this.state), squares.slice(), this.cols);
				this.addMarker(move, false);

			} else	if (this.state.mode === MODE_AI_VERSUS && playerMove) {
    		let { move, moveScore } = getAIMove(Object.assign({}, this.state), squares.slice(), this.cols);
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
      history: [{ squares: Array(this.cols * this.cols).fill(null) }],
      stepNumber: 0,
      xIsNext: xIsNext,
      mode: mode,
    }, function () {
    	if (mode === MODE_AI_VERSUS) {
    		const squares = this.state.history[0].squares.slice();
    		let { move, moveScore } = getAIMove(Object.assign({}, this.state), squares.slice(), this.cols);
				this.addMarker(move, false);
			}
		});
  }

  jumpTo(step) {
  	if ((this.state.stepNumber - step)% 2 !== 0) {
  		this.setState({ xIsNext: !this.state.xIsNext });
  	}
    this.setState({ stepNumber: step });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const { winner, indexes } = calculateWinner(current.squares, this.cols);

    let status = <FormattedMessage id="game.next_player" defaultMessage="Next player: {player}" values={{ player: (this.state.xIsNext ? 'X' : 'O') }}/>;
    if (winner) {
		  status = <strong><FormattedMessage id="game.winner" defaultMessage="Winner: {player}" values={{ player: winner }}/></strong>;
    }

    const langSelector = <div className="lang-selector"><FormattedMessage id="game.language" defaultMessage="Language" />:&nbsp;
      {this.props.locale === "fi" ? "FI" : <a href="/" onClick={(e) => this.changeLang(e, "fi")}>FI</a>} |&nbsp;
      {this.props.locale === "en" ? "EN" : <a href="/" onClick={(e) => this.changeLang(e, "en")}>EN</a>}
    </div>;

	let steps = (this.state.mode === MODE_PRACTICE ? 1 : 2);
    let undoDisabled = (this.state.stepNumber - steps < 0 ? 'disabled' : '');
    let redoDisabled = (this.state.stepNumber >= history.length - steps ? 'disabled' : '');

    const undoRedoButtons = <div className="undo-redo">
      <button disabled={undoDisabled} onClick={() => this.jumpTo(this.state.stepNumber - steps)}>
        <FormattedMessage id="game.undo" defaultMessage="Undo" /></button>
      <button disabled={redoDisabled} onClick={() => this.jumpTo(this.state.stepNumber + steps)}>
        <FormattedMessage id="game.redo" defaultMessage="Redo" /></button>
    </div>;

    return (
      <div>
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares} highlite={indexes} cols={this.cols} onClick={(i) => this.addMarker(i) } />
          </div>

          <div className="game-info">
            <div className="status">{status}</div>

            {undoRedoButtons}

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

            {langSelector}

          </div>
        </div>

      </div>
    );
  }
}


