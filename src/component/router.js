import {BrowserRouter, Route} from "react-router-dom";
import {Nick} from "../view/nick";
import {Game} from "../view/game";
import React from "react";

export function Router(props) {
	return (
		<BrowserRouter>
			<Route exact path="/" render={(view) => <Nick locale={props.locale} action={props.handle}/>}/>
			<Route exact path="/game" render={(view) => <Game locale={props.locale} action={props.handle}/>}/>
		</BrowserRouter>
	);
}
