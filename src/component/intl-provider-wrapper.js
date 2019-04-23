import React from "react";
import {addLocaleData, FormattedMessage, IntlProvider} from "react-intl";
import { Router } from "./router"
import { DocumentTitle } from "./document-title"
import fiMessages from "../locale/fi";
import {Header} from "./header";
import {MIN_COLUMNS, MODE_NA, MODE_PRACTICE} from "../common";
import {initialGameState} from "../functions";

let allMessages = { "fi": fiMessages };
let locale = "en";
let session = JSON.parse(localStorage.getItem('5R-SessionData') || "{}");

if (!session) {
  session = { locale: locale };
  localStorage.setItem('5R-SessionData', JSON.stringify(session));
} else if ('locale' in session) {
  locale = session.locale;
}

let localeData = require('react-intl/locale-data/' + locale);

addLocaleData(localeData);

export class IntlProviderWrapper extends React.Component {
  constructor(props) {
    super(props);

		let messages = allMessages[locale] ? allMessages[locale] : {};
		this.state = {
			locale,
			messages,
			mode: MODE_NA,
			nickname: ""
		};

		let session = JSON.parse(localStorage.getItem('5R-SessionData') || "{}");
  	if ('gameState' in session) {
  		this.state.mode = session.gameState.mode;
  		if ('nickname' in session.gameState && session.gameState.nickname) {
				this.state.nickname = session.gameState.nickname;
			}
  	} else {
  		session.gameState = initialGameState(MODE_PRACTICE, MIN_COLUMNS);
  		localStorage.setItem('5R-SessionData', JSON.stringify(session));
  	}

  	this.setMode = this.setMode.bind(this);
  	this.setNickname = this.setNickname.bind(this);
  }

  handle(locale) {
    let messages = allMessages[locale] ? allMessages[locale] : {};
		this.setState({
      locale: locale,
      messages: messages
    });

    let localeData = require('react-intl/locale-data/' + locale);
    addLocaleData(localeData);

    session.locale = locale;
    localStorage.setItem('5R-SessionData', JSON.stringify(session));
  }

  setNickname(nickname) {
    this.setState({
      nickname: nickname
    });
    let session = JSON.parse(localStorage.getItem('5R-SessionData') || "{}");
    session.gameState.nickname = nickname;
  	localStorage.setItem('5R-SessionData', JSON.stringify(session));
  }

  setMode(mode) {
    this.setState({
      mode: mode
    });
    let session = JSON.parse(localStorage.getItem('5R-SessionData') || "{}");
    session.gameState.mode = mode;
  	localStorage.setItem('5R-SessionData', JSON.stringify(session));
  }

  render() {
    return (
      <IntlProvider locale={this.state.locale} messages={this.state.messages} >
        <div className="body-wrapper">
          <DocumentTitle />

          <Header nickname={this.state.nickname}  mode={this.state.mode} locale={this.state.locale} action={this.handle.bind(this)} />

					<Router handleNickname={this.setNickname} handleMode={this.setMode}/>
        </div>
      </IntlProvider>
    );
  }
}