import React from 'react';
import { FormattedMessage } from 'react-intl';
import { MODE_PRACTICE, MIN_COLUMNS } from '../common';
import { initialGameState } from '../functions';

export class Nickname extends React.Component {
  constructor(props) {
    super(props);

		this.state = initialGameState(MODE_PRACTICE, MIN_COLUMNS);

    let session = JSON.parse(localStorage.getItem('5R-SessionData') || "{}");
    if ('gameState' in session) {
    	this.state = session.gameState;
		}
  }

  saveNickname(event) {
  	this.setState({ nickname: event.target.value });
  	this.props.handleNickname(event.target.value);
  }

  useNickname(event) {
  	if (this.state.nickname) {
  		document.location.href = "/game";
  	}
  }

  removeNickname() {
  	this.setState({ nickname: "" });
  	this.props.handleNickname("");
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

				<h1>
					<FormattedMessage id="page.title" defaultMessage="Five-in-a-Row" />
				</h1>

				<p><FormattedMessage id="game.start_the" defaultMessage="Start the game by selecting a nickname!" /></p>

				<div className="set-nickname">

					<FormattedMessage id="placeholder.nickname" defaultMessage="nickname..">
						{text => <input className="nickname" onChange={(event)=>this.saveNickname(event)} value={this.state.nickname} type="text" placeholder={text} />}
					</FormattedMessage>

					<FormattedMessage id="button.remove_nickname" defaultMessage="Remove">
						{text => <input className="game-button" disabled={!this.state.nickname ? "disabled" : ""} type="reset" onClick={() => this.removeNickname()} value={text} />}
					</FormattedMessage>

				</div>

				<FormattedMessage id="button.start_game" defaultMessage="Start game">
					{text => <input className="start-game-button" disabled={!this.state.nickname ? "disabled" : ""} type="button" onClick={() => this.useNickname()} value={text} />}
				</FormattedMessage>

				<div className="readme-link">
					<FormattedMessage id="page.here_you_can_find" defaultMessage="Here you can find: "/>
					<a href="https://github.com/zerror/five-in-a-row/blob/master/README.md" target="_blank"
						 rel="noopener noreferrer">
						<FormattedMessage id="page.readme_link" defaultMessage="README!"/>
					</a>
				</div>

			</div>
    );
  }
}
