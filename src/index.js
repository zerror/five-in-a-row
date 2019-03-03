import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
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
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.cols = 15;
    this.state = {
      history: [{
        squares: Array(this.cols * this.cols).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
    };
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
      xIsNext: this.state.xIsNext,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares, this.cols);
    let status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
	  if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    let undoDisabled = (this.state.stepNumber - 1 < 0 ? 'disabled' : '');
    let redoDisabled = (this.state.stepNumber >= history.length - 1? 'disabled' : '');
    const moves = <div>
      <button disabled={undoDisabled} onClick={() => this.jumpTo(this.state.stepNumber - 1)}>Undo</button>
      <button disabled={redoDisabled} onClick={() => this.jumpTo(this.state.stepNumber + 1)}>Redo</button>
    </div>;

    return (
      <div>
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares} cols={this.cols} onClick={(i) => this.handleClick(i)}/>
          </div>

          <div className="game-info">
            <div className="status">{status}</div>
            {moves}
          </div>
        </div>
        <input className="reset-button" type="button" onClick={() => this.setState({
          history: [{ squares: Array(this.cols * this.cols).fill(null) }],
          xIsNext: this.state.xIsNext,
          stepNumber: 0,
        })} value="Restart game" />
      </div>
    );
  }
}

function calculateWinner(squares, cols) {

  for (let i = 0; i < squares.length; i++) {
    let mark = squares[i];
    if (!mark) continue;

    let startOfRow = (i === 0 || (i % cols) === 0);
    let fitsInRow = startOfRow || ((i + 1) % cols !== 0 && (i + 2) % cols !== 0 && (i + 3) % cols !== 0);
    let fitsInCol = i + cols * 3 <= squares.length;
    let fitsInDownDiagonal = i + cols * 3 + 3 <= squares.length;
    let fitsInUpDiagonal = i + cols * 3 - 3 <= squares.length;

    if (fitsInRow || fitsInCol){
      if (squares[i + 1] === mark && squares[i + 2] === mark && squares[i + 3] === mark && squares[i + 4] === mark) {
        return mark;
      }
      if (squares[i + cols] === mark && squares[i + cols * 2] === mark && squares[i + cols * 3] === mark && squares[i + cols * 4] === mark) {
        return mark;
      }
    }
    if (fitsInDownDiagonal) {
      for (let x = 1; x < 5; x++) {
        if (squares[i + cols * x + x] !== mark) { break; }
        if (x === 4) { return mark; }
      }
    }
    if (fitsInUpDiagonal) {
      for (let x = 1; x < 5; x++) {
        if (squares[i + cols * x - x] !== mark) { break; }
        if (x === 4) { return mark; }
      }
    }
  }

  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

