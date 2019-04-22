import React from 'react';
import { FormattedMessage } from 'react-intl';
import { MODE_PRACTICE, MODE_AI_VERSUS, MODE_VERSUS_AI, MIN_COLUMNS } from '../common';
import { initialGameState } from '../functions';
import { HeadingInfo } from "../component/heading-info";

export class Main extends React.Component {
  constructor(props) {
    super(props);

		this.state = initialGameState(MODE_PRACTICE, MIN_COLUMNS);
		this.state.nickname = "";

    let session = JSON.parse(localStorage.getItem('5R-SessionData') || "{}");
    if ('gameState' in session) {
    	this.state = session.gameState;
		} else {
    	session.gameState = this.state;
    }
  }

  saveNickname(event) {
  	this.setState({ nickname: event.target.value });
  }

  setNickname(event) {
  	if (this.state.nickname) {
  		document.location.href = "/game";
  	}
  }

  removeNickname() {
  	this.setState({ nickname: "" });
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.saveMainStateToSessionStorage.bind(this) );
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.saveMainStateToSessionStorage.bind(this) );
    this.saveMainStateToSessionStorage();
  }

  saveMainStateToSessionStorage() {
    let session = JSON.parse(localStorage.getItem('5R-SessionData') || "{}");
    session.gameState.nickname = this.state.nickname;
    localStorage.setItem('5R-SessionData', JSON.stringify(session));
  }

  render() {
    return (
			<div className="main">

				<HeadingInfo nickname={this.state.nickname} locale={this.props.locale} action={this.props.action} mode={this.state.mode} />

				<FormattedMessage id="game.start_the" defaultMessage="Start the game by selecting a nickname!" />

				<div className="set-nickname">

					<FormattedMessage id="placeholder.nickname" defaultMessage="nickname..">
						{text => <input className="nickname" onChange={(event)=>this.saveNickname(event)} value={this.state.nickname} type="text" placeholder={text} />}
					</FormattedMessage>

					<FormattedMessage id="button.use_nickname" defaultMessage="Use">
						{text => <input className="game-button" disabled={!this.state.nickname ? "disabled" : ""} type="button" onClick={() => this.setNickname()} value={text} />}
					</FormattedMessage>

					<FormattedMessage id="button.remove_nickname" defaultMessage="Remove">
						{text => <input className="game-button" disabled={!this.state.nickname ? "disabled" : ""} type="reset" onClick={() => this.removeNickname()} value={text} />}
					</FormattedMessage>

				</div>

			</div>
    );
  }
}
