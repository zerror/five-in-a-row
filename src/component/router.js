import { BrowserRouter, Route } from "react-router-dom";
import { Nickname } from "../view/nickname";
import { Game } from "../view/game";
import React from "react";
import { connect } from "react-redux";


export function Router(props) {
	return (
		<BrowserRouter>
			<Route exact path="/" render={(view) => <Nickname handleNickname={props.handleNickname} />}/>
			<Route exact path="/game" render={(view) => <ConnectedGame messages={props.messages} />}/>
		</BrowserRouter>
	);
}

function mapGameStateToProps(state) {
  return state.game;
}

const ConnectedGame = connect(mapGameStateToProps)(Game);