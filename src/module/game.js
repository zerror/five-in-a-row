import React from 'react';
import {calculateWinner} from '../functions';
import { FormattedMessage } from 'react-intl';

function Square(props) {
  return (
  	<button className={props.value ? "square " + props.value : "square"} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square key={i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }

  render() {
    var rows = [];
	  for (let i = 0; i < this.props.cols; i++) {
	    let cells = []
	    for (let j = 0; j < this.props.cols; j++) {
        cells.push(this.renderSquare(i * this.props.cols + j));
	    }
      rows.push(<div className="board-row" key={i}>{cells}</div>);
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
    this.mode = 0;
    this.modes = [<FormattedMessage id="game.practice" defaultMessage="practice" />];
    this.state = {
      history: [{
        squares: Array(this.cols * this.cols).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
    };

    var session = sessionStorage.getItem('sessionData');
    if (!session) { session = {} } else { session = JSON.parse(session) };
    if ('mode' in session) {
      this.mode = session.mode;
    } else {
      session.mode = this.mode;
    }
  }

  changeLang(e, lang) {
    e.preventDefault();
    this.props.action(lang);
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares, this.cols) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{ squares: squares, }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares, this.cols);

    let status = <FormattedMessage id="game.next_player" defaultMessage="Next player: {player}" values={{
      player: (this.state.xIsNext ? 'X' : 'O') }}/>;
    if (winner) {
      status = <strong><FormattedMessage id="game.winner" defaultMessage="Winner: {player}" values={{
        player: winner }}/></strong>;
    }

    const langSelector = <div className="lang-selector"><FormattedMessage id="game.language" defaultMessage="Language" />:&nbsp;
      {this.props.locale === "fi" ? "FI" : <a href="/" onClick={(e) => this.changeLang(e, "fi")}>FI</a>} |
      {this.props.locale === "en" ? "EN" : <a href="/" onClick={(e) => this.changeLang(e, "en")}>EN</a>}
    </div>;

		let steps = (this.mode === 0 ? 1 : 2);
    let undoDisabled = (this.state.stepNumber - steps < 0 ? 'disabled' : '');
    let redoDisabled = (this.state.stepNumber >= history.length - steps ? 'disabled' : '');

    const undoRedoButtons = <div>
      <button disabled={undoDisabled} onClick={() => this.jumpTo(this.state.stepNumber - steps)}>
        <FormattedMessage id="game.undo" defaultMessage="Undo" /></button>
      <button disabled={redoDisabled} onClick={() => this.jumpTo(this.state.stepNumber + steps)}>
        <FormattedMessage id="game.redo" defaultMessage="Redo" /></button>
    </div>;

    return (
      <div>
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares} cols={this.cols} onClick={(i) => this.handleClick(i)} />
          </div>

          <div className="game-info">
            <div className="status">{status}</div>
            {undoRedoButtons}

            <div className="mode-label"><FormattedMessage id="game.mode" defaultMessage="Mode" />: {this.modes[this.mode]}</div>

            <FormattedMessage id="game.practice_game" defaultMessage="Practice game">
              {text => <input className="game-button" type="button" onClick={() => this.setState({
              history: [{ squares: Array(this.cols * this.cols).fill(null) }], stepNumber: 0, })} value={text} />}
            </FormattedMessage>

            {langSelector}

          </div>
        </div>

      </div>
    );
  }
}


