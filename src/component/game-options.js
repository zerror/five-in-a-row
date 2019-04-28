import {FormattedMessage} from "react-intl";
import React from "react";
import { MODE_AI_VERSUS, MODE_PRACTICE, MODE_VERSUS_AI } from "../common";

export class GameOptions extends React.Component {

	render() {
		return (
			<div className="game-options">

				<FormattedMessage id="button.practice_game" defaultMessage="Practice">
					{text => <input className="game-button" type="button" onClick={() => this.props.action(MODE_PRACTICE)} value={text} />}
				</FormattedMessage>

				<FormattedMessage id="button.vs_ai" defaultMessage="Versus AI">
					{text => <input className="game-button" type="button" onClick={() => this.props.action(MODE_VERSUS_AI)} value={text} />}
				</FormattedMessage>

				<FormattedMessage id="button.ai_vs" defaultMessage="AI versus">
					{text => <input className="game-button" type="button" onClick={() => this.props.action(MODE_AI_VERSUS)} value={text} />}
				</FormattedMessage>

			</div>
		);
	}
}