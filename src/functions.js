/*** Functions.js ***/

export function calculateWinner(squares, cols) {

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
