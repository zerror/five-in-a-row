import { FormattedMessage } from "react-intl";
import React from "react";
import { GameOptions } from "./game-options";
import { connect } from "react-redux";

const modes = [
	<FormattedMessage id="game.na" defaultMessage="N/A" />,
	<FormattedMessage id="game.practice" defaultMessage="practice" />,
	<FormattedMessage id="game.mode_vs_ai" defaultMessage="player versus AI" />,
	<FormattedMessage id="game.mode_ai_vs" defaultMessage="AI versus player" />,
];

export class Header extends React.Component {

  changeLang(e, lang) {
    e.preventDefault();
    this.props.action(lang);
  }

  goBack() {
  	document.location.href = "/";
  }

	render() {
		return (
				<div className="header">

					<div className="player-nick">
						<FormattedMessage id="game.player" defaultMessage="Player"/>:&nbsp;
						<FormattedMessage id="game.na" defaultMessage="N/A">
							{text => (this.props.nickname ? this.props.nickname : text)}
						</FormattedMessage>
					</div>

					<div className="lang-selector">
						<FormattedMessage id="game.language" defaultMessage="Language"/>:&nbsp;
						{this.props.locale === "fi" ? "FI" : <a href="/" onClick={(e) => this.changeLang(e, "fi")}>FI</a>} |&nbsp;
						{this.props.locale === "en" ? "EN" : <a href="/" onClick={(e) => this.changeLang(e, "en")}>EN</a>}
					</div>

					<div className="mode-label">
						<ConnectedGameOptions action={this.props.handleMode} /> <FormattedMessage id="game.mode" defaultMessage="Mode"/>: {modes[this.props.mode]}
					</div>

					<FormattedMessage id="button.back" defaultMessage="Back">
						{text => <input className="back-button" disabled={document.location.pathname === "/" ? "disabled" : ""} type="button" onClick={this.goBack} value={text} />}
					</FormattedMessage>

				</div>
		);
	}
}

function mapGameStateToProps(state) {
	return state.game;
}

const ConnectedGameOptions = connect(mapGameStateToProps)(GameOptions);