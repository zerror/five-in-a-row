import { combineReducers } from 'redux'
import { MODE_PRACTICE } from "./common";

/*** constants ***/

const MODE_CHANGE = "MODE_CHANGE";
const MODE_RESET = "MODE_RESET";

/*** action creators ***/

export function modeUpdate(mode, modeReset = false) {
	return { type: (modeReset ? MODE_RESET : MODE_CHANGE), mode }
}

/*** reducers ***/

function game(state = { mode: MODE_PRACTICE }, action) {
  switch (action.type) {
    case MODE_CHANGE:
  		return action;
    case MODE_RESET:
  		return action;
    default:
      return state;
  }
}

const gameReducers = combineReducers({
	game
});

export default gameReducers