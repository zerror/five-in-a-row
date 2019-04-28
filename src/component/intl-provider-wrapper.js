import React from "react";
import { addLocaleData, IntlProvider } from "react-intl";
import { Router } from "./router"
import { DocumentTitle } from "./document-title"
import { Header } from "./header";
import { MIN_COLUMNS, MODE_NA, MODE_PRACTICE } from "../common";
import { initialGameState } from "../functions";
import { connect, ReactReduxContext } from "react-redux"
import { gameUpdate } from "../reducers";

import fiMessages from "../locale/fi";

let allMessages = { "fi": fiMessages };

export class IntlProviderWrapper extends React.Component {
  constructor(props) {
    super(props);

		this.state = {
			locale: "en",
			messages: {},
			mode: MODE_NA,
			nickname: ""
		};

		let session = JSON.parse(localStorage.getItem('5R-SessionData') || "{}");
		if (!session) {
			session.locale = this.state.locale;
		} else if ('locale' in session) {
			this.state.locale = session.locale;
			this.state.messages = (allMessages[this.state.locale] ? allMessages[this.state.locale] : {});
		}

		let localeData = require('react-intl/locale-data/' + this.state.locale);

		addLocaleData(localeData);

  	if ('gameState' in session) {
  		this.state.mode = session.gameState.mode;
  		if ('nickname' in session.gameState && session.gameState.nickname) {
				this.state.nickname = session.gameState.nickname;
			}
  	} else {
  		session.gameState = initialGameState(MODE_PRACTICE, MIN_COLUMNS, this.state.nickname);
  	}

  	this.setMode = this.setMode.bind(this);
  	this.setNickname = this.setNickname.bind(this);
  }

  componentDidMount() {
  	this.context.store.dispatch(gameUpdate(this.state));
	}

	saveGameStateToSessionStorage() {
    let session = JSON.parse(localStorage.getItem('5R-SessionData') || "{}");
    session.locale = this.state.locale;
    session.gameState.nickname = this.state.nickname;
    session.gameState.mode = this.state.mode;
    localStorage.setItem('5R-SessionData', JSON.stringify(session));
  }

	setLocale(locale) {
    let messages = allMessages[locale] ? allMessages[locale] : {};
    let localeData = require('react-intl/locale-data/' + locale);
		addLocaleData(localeData);

		this.setState({
      locale: locale,
      messages: messages
    }, function () {
			this.saveGameStateToSessionStorage();
		});
  }

  setNickname(nickname) {
    this.setState({
      nickname: nickname
    }, function () {
			this.context.store.dispatch(gameUpdate(this.state));
			this.saveGameStateToSessionStorage();
		});
  }

  setMode(mode) {
  	let modeReset = (mode === this.state.mode);

    this.setState({
      mode: mode
    }, function () {
			this.context.store.dispatch(gameUpdate(this.state, modeReset));
			this.saveGameStateToSessionStorage();
		});
  }

  render() {
  	let locale = this.state.locale;

    return (
      <IntlProvider locale={this.state.locale} messages={this.state.messages} >
        <div className="body-wrapper">
          <DocumentTitle />

          <ConnectedHeader locale={locale} action={this.setLocale.bind(this)} handleMode={this.setMode} />

					<Router handleNickname={this.setNickname} messages={this.state.messages}/>
        </div>
      </IntlProvider>
    );
  }
}

IntlProviderWrapper.contextType = ReactReduxContext;

let gameNumber = 0;

function mapGameStateToProps(state) {
	gameNumber += 1;
	state.game.id = gameNumber;
  return state.game;
}

const ConnectedHeader = connect(mapGameStateToProps)(Header);