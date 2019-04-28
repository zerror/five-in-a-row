import { FormattedMessage } from "react-intl";
import React from "react";
import { GameOptions } from "./game-options";
import { ReactReduxContext } from "react-redux";
// import { IntlProviderWrapper } from "./intl-provider-wrapper";
// import {initialGameState} from "../functions";
import { MODE_PRACTICE } from "../common";

const modes = [
	<FormattedMessage id="game.na" defaultMessage="N/A" />,
	<FormattedMessage id="game.practice" defaultMessage="practice" />,
	<FormattedMessage id="game.mode_vs_ai" defaultMessage="player versus AI" />,
	<FormattedMessage id="game.mode_ai_vs" defaultMessage="AI versus player" />,
];

export class Header extends React.Component {

	constructor(props) {
    super(props);
    this.state = { mode: MODE_PRACTICE };
  }

	componentDidMount() {
		let store = this.context.store;
		let state = store.getState().game;
		let component = this;

    this.setState(state);

		function updateState() {
			let state = store.getState().game;
			component.setState(state);
		}

		this.context.store.subscribe(updateState);
	}

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
						<GameOptions action={this.props.handleMode} /> <FormattedMessage id="game.mode" defaultMessage="Mode"/>: {modes[this.state.mode]}
					</div>

					<div className="readme-link">
						<FormattedMessage id="page.here_you_can_find" defaultMessage="Here you can find: "/>
						<a href="https://github.com/zerror/five-in-a-row/blob/master/README.md" target="_blank"
							 rel="noopener noreferrer">
							<FormattedMessage id="page.readme_link" defaultMessage="README!"/>
						</a>
					</div>

					<FormattedMessage id="button.back" defaultMessage="Back">
						{text => <input className="back-button" disabled={document.location.pathname === "/" ? "disabled" : ""} type="button" onClick={this.goBack} value={text} />}
					</FormattedMessage>

				</div>
		);
	}
}

Header.contextType = ReactReduxContext;