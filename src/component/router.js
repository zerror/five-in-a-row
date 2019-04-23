import {BrowserRouter, Route} from "react-router-dom";
import {Nickname} from "../view/nickname";
import {Game} from "../view/game";
import React from "react";

export function Router(props) {
	return (
		<BrowserRouter>
			<Route exact path="/" render={(view) => <Nickname />}/>
			<Route exact path="/game" render={(view) => <Game />}/>
		</BrowserRouter>
	);
}
