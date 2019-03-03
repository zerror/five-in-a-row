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
  constructor(props) {
    super(props);
    this.cols = 10;
    this.state = {
      squares: Array(this.cols * this.cols).fill(null),
      xIsNext: true,
    };
  }

  handleClick(i) {
  	const squares = this.state.squares.slice();
    if (calculateWinner(squares, this.cols) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
		squares: squares,
		xIsNext: !this.state.xIsNext,
	});
  }

  renderSquare(i) {
  	return <Square key={i} value={this.state.squares[i]} onClick={() => this.handleClick(i)} />;
  }

  render() {
    const winner = calculateWinner(this.state.squares, this.cols);
    let status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
	  if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    var rows = [];
	  for (let i = 0; i < this.cols; i++) {
	    let cells = []
	    for (let j = 0; j < this.cols; j++) {
        cells.push(this.renderSquare(i * this.cols + j));
	    }
      rows.push(<div className="board-row" key={i}>{cells}</div>);
    }

    return (
      <div>
        <div className="status">{status}</div>
        {rows}
        <input type="button" onClick={() => this.setState({
          squares: Array(this.cols * this.cols).fill(null),
          xIsNext: true,
        })} value="Restart game" />
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
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
    if (fitsInRow && squares[i + 1] === mark && squares[i + 2] === mark && squares[i + 3] === mark) {
      return mark;
    }
    if (fitsInCol && squares[i + cols] === mark && squares[i + cols * 2] === mark && squares[i + cols * 3] === mark) {
      return mark;
    }
    if (fitsInDownDiagonal && squares[i + cols + 1] === mark && squares[i + cols * 2 + 2] === mark && squares[i + cols * 3 + 3] === mark) {
      return mark;
    }
    if (fitsInUpDiagonal && squares[i + cols - 1] === mark && squares[i + cols * 2 - 2] === mark && squares[i + cols * 3 - 3] === mark) {
      return mark;
    }
  }

  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

