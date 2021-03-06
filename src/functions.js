import { MODE_AI_VERSUS, DEV_ENV } from "./common";

/*** Functions.js ***/

export function initialGameState(mode, columns, nickname = "") {
	return {
		history: [{ squares: Array(columns * columns).fill(null) }],
		cols: columns,
		xIsNext: (mode === MODE_AI_VERSUS ? false : true),
		stepNumber: 0,
		mode: mode,
		nickname: nickname
	};
}

export function calculateWinner(squares, cols) {

  for (let i = 0; i < squares.length; i++) {
    let mark = squares[i];
    if (!mark) continue;

		let indexes = [];
    let startOfRow = (i === 0 || (i % cols) === 0);
    let fitsInRow = startOfRow || ((i + 1) % cols !== 0 && (i + 2) % cols !== 0 && (i + 3) % cols !== 0 && (i + 4) % cols !== 0);
    let fitsInCol = i + cols * 4 < squares.length;
    let fitsInDownDiagonal = i + cols * 4 + 4 < squares.length;
    let fitsInUpDiagonal = i + cols * 4 - 4 < squares.length;

    if (fitsInRow && squares[i + 1] === mark && squares[i + 2] === mark && squares[i + 3] === mark && squares[i + 4] === mark) {
    	[].push.apply(indexes, [i, (i + 1), (i + 2), (i + 3), (i + 4)]);
      return { winner: mark, indexes: indexes };
		}

		if (fitsInCol && squares[i + cols] === mark && squares[i + cols * 2] === mark && squares[i + cols * 3] === mark && squares[i + cols * 4] === mark) {
			[].push.apply(indexes, [i, (i + cols * 1), (i + cols * 2), (i + cols * 3), (i + cols * 4)]);
      return { winner: mark, indexes: indexes };
		}

    if (fitsInDownDiagonal) {
      for (let x = 1; x < 5; x++) {
        if (squares[i + cols * x + x] !== mark) { break; }
        if ((i + cols * x + x) % cols === 0) { break; }
        if (x === 4) {
        	[].push.apply(indexes, [i, (i + cols * 1 + 1), (i + cols * 2 + 2), (i + cols * 3 + 3), (i + cols * 4 + 4)]);
        	return { winner: mark, indexes: indexes };
        }
      }
    }
    if (fitsInUpDiagonal) {
      for (let x = 1; x < 5; x++) {
        if (squares[i + cols * x - x] !== mark) { break; }
        if ((i + cols * x - x) % cols === 0 && x !== 4) { break; }
        if (x === 4) {
        	[].push.apply(indexes, [i, (i + cols * 1 - 1), (i + cols * 2 - 2), (i + cols * 3 - 3), (i + cols * 4 - 4)]);
        	return { winner: mark, indexes: indexes };
        }
      }
    }
  }

  return { winner: null, indexes: [] };
}

function scoreMove(index, squares, cols, stepNumber, mark, hFactor = 1, slide = 0) {

	let optionsForward = 0;
	let ownForward = 0;
	let ownInARowForward = 0;
	let opponentInARowForward = 0;
	let opponentRowForwardSpace = 0;
	let spaceInARowForward = 0;
	let optionsBackward = 0;
	let ownBackward = 0;
	let ownInARowBackward = 0;
	let opponentInARowBackward = 0;
	let opponentRowBackwardSpace = 0;
	let spaceInARowBackward = 0;
	let score = 0;

	let opponentMark = (mark === 'X' ? 'O' : 'X');

	for (let j = 1; j < cols; j++) {
		let vars = hFactor * j + slide * j;
		if (hFactor === 1 && (index + j) % cols === 0) { // row changed
			break;
		} else	if (hFactor > 1 && (index + vars) >= squares.length) { // out of board
			break;
		} else if (hFactor > 1 && slide && (index + vars) % cols === 0) { // out of bounds
			break;
		}

		if (squares[index + vars] === mark && !opponentInARowForward) { // next is own
			if (ownInARowForward + 1 === j) {
				ownInARowForward++;
			}
			ownForward++;
		} else if (squares[index + vars] === opponentMark) { // next is opponents mark
			if (opponentInARowForward + 1 === j) {
				opponentInARowForward++;
			}
		} else if (squares[index + vars] === null) { // next is empty
			if (!spaceInARowForward && !opponentInARowForward) { spaceInARowForward++; }
			if (opponentInARowForward === j - 1) { opponentRowForwardSpace++ }
		}
		if (!opponentInARowForward) { optionsForward++; }
	}

	for (let j = 1; j < cols; j++) {
		let vars = hFactor * j + slide * j;
		if (hFactor === 1 && (index - j + 1) % cols === 0) { // row changed
			break;
		} else	if (hFactor > 1 && (index - vars) < 0) { // out of board
			break;
		}	else	if (hFactor > 1 && slide && (index - vars - hFactor + 1) % cols === 0) { // out of bounds
			break;
		}

		if (squares[index - vars] === mark && !opponentInARowBackward) { // previous is own
			if (ownInARowBackward + 1 === j) { ownInARowBackward++; }
			ownBackward++;
		} else if (squares[index - vars] === opponentMark) { // previous is opponents mark
			if (opponentInARowBackward + 1 === j) {
				opponentInARowBackward++;
			}
		} else if (squares[index - vars] === null) { // previous is empty
			if (!spaceInARowBackward && !opponentInARowBackward) {	spaceInARowBackward++; }
			if (opponentInARowBackward === j - 1) { opponentRowBackwardSpace++ }
		}
		if (!opponentInARowBackward) optionsBackward++;
	}

	if (ownInARowForward === 4 || ownInARowBackward === 4) {
		return 200;
	}

	if (optionsBackward + optionsForward >= 4 || opponentInARowForward + opponentInARowBackward >= 3) {
		if (stepNumber < 4) {
			if (optionsForward >= (cols / 2) - 1 && optionsBackward >= (cols / 2) - 1) {
				score += 1;
			}
			if (opponentInARowForward && optionsBackward >= (cols / 2) - 1) {
				score += 2;
			}
			if (opponentInARowBackward && optionsForward >= (cols / 2) - 1) {
				score += 2;
			}
		}

		if (ownInARowForward && optionsForward > ownInARowForward) {
			score += 2;
			if (ownForward > ownInARowForward) {
				score++;
			}
			if (ownInARowForward >= 3) {
				score += 5;
				if (optionsBackward && optionsForward) {
					score += 6;
				}
				if (spaceInARowBackward + spaceInARowForward > 1) {
					score += 2;
				}
			}
		}
		if (ownInARowBackward && optionsBackward > ownInARowBackward) {
			score += 2;
			if (ownBackward > ownInARowBackward) {
				score += 1;
			}
			if (ownInARowBackward >= 3) {
				score += 5;
				if (optionsBackward && optionsForward) {
					score += 6;
				}
				if (spaceInARowBackward + spaceInARowForward > 1) {
					score += 2;
				}
			}
		}
		if (ownInARowBackward + ownInARowForward >= 2) {
			score += 2;
			if (spaceInARowBackward + spaceInARowForward > 1) {
				score += 1;
			}
		}

		if (opponentInARowForward >= 2) {
			if (opponentRowForwardSpace) {
				score += 1;
			}
			if (opponentRowBackwardSpace) {
				score += 1;
			}
			if (opponentInARowForward >= 3) {
				score += 3;
				if (opponentRowForwardSpace) {
					score += 5;
				}
				if (opponentInARowForward >= 4) {
					score += 20;
				}
				if (opponentInARowBackward) {
					score += 10;
				}
				if (opponentRowForwardSpace || opponentRowBackwardSpace) {
					score += 10;
				}
			}
			if (opponentInARowBackward) {
				score += 10;
			}
		}
		if (opponentInARowBackward >= 2) {
			if (opponentRowBackwardSpace) {
				score += 1;
			}
			if (opponentRowForwardSpace) {
				score += 1;
			}
			if (opponentInARowBackward >= 3) {
				score+= 3;
				if (opponentRowBackwardSpace) {
					score += 5;
				}
				if (opponentInARowBackward >= 4) {
					score += 20;
				}
				if (opponentInARowForward) {
					score += 10;
				}
				if (opponentRowForwardSpace || opponentRowBackwardSpace) {
					score += 10;
				}
			}
			if (opponentInARowForward) {
				score += 10;
			}
		}
		if (opponentInARowBackward && opponentInARowForward) {
			score += 1;
			if (opponentInARowBackward + opponentInARowForward >= 3) {
				score += 1;
				if (opponentRowBackwardSpace) {
					score += 1;
				}
				if (opponentRowForwardSpace) {
					score += 1;
				}
				if (opponentRowBackwardSpace || opponentRowForwardSpace) {
					score += 6;
				}
			}
		}
	}

	return score;
}

export function getAIMove(state, squares, cols, depth = 0) {

	let thisStep = state.stepNumber + depth;
	let thisMark = state.xIsNext ? 'X' : 'O';

	// if (depth % 2 !== 0) {
	// 	thisMark = !state.xIsNext ? 'X' : 'O';
	// }

	let middleGround = Math.floor(squares.length / 2);
	let middleGroundBegin = middleGround - cols * 2;
	let middleGroundEnd = middleGround + cols * 2;
	let score = -100;
	let thisScore = -100;
	let bestMove = middleGround;

	for (let i = 0; i < squares.length; i++) {
		if (squares[i]) {
			continue;
		}

		if (thisStep < 5 && (i < middleGroundBegin || i > middleGroundEnd)){
			continue;
		}

		squares[i] = thisMark;

		thisScore = -100;
		thisScore += scoreMove(i, squares, cols, thisStep, thisMark, 1, 0);
		thisScore += scoreMove(i, squares, cols, thisStep, thisMark, cols, 0);
		thisScore += scoreMove(i, squares, cols, thisStep, thisMark, cols, 1);
		thisScore += scoreMove(i, squares, cols, thisStep, thisMark, cols, -1);

		// if (depth < 1) {
		// 	let move = getAIMove(state, squares, cols, depth + 1);
		// 	thisScore = thisScore - moveScore;
		// }

		if (thisScore > score) {
			score = thisScore;
			bestMove = i;
			if (DEV_ENV) { console.log("move:", bestMove, "score:", score); }
		}

		squares[i] = null;
	}

	return bestMove;
}
