import {BrowserRouter, Route} from "react-router-dom";
import {Main} from "../view/main";
import {Game} from "../view/game";
import React from "react";

export function Router(props) {
	return (
		<BrowserRouter>
			<Route exact path="/" render={(view) => <Main locale={props.locale} action={props.handle}/>}/>
			<Route exact path="/game" render={(view) => <Game locale={props.locale} action={props.handle}/>}/>
		</BrowserRouter>
	);
}
