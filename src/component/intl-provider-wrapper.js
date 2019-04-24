import React from "react";
import {addLocaleData, IntlProvider} from "react-intl";
import { Router } from "./router"
import { DocumentTitle } from "./document-title"
import fiMessages from "../locale/fi";
import {Header} from "./header";
import {MIN_COLUMNS, MODE_NA, MODE_PRACTICE} from "../common";
import {initialGameState} from "../functions";

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
			localStorage.setItem('5R-SessionData', JSON.stringify(session));
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
  		session.gameState = initialGameState(MODE_PRACTICE, MIN_COLUMNS);
  		localStorage.setItem('5R-SessionData', JSON.stringify(session));
  	}

  	this.setMode = this.setMode.bind(this);
  	this.setNickname = this.setNickname.bind(this);
  }

  setLocale(locale) {
    let messages = allMessages[locale] ? allMessages[locale] : {};
		this.setState({
      locale: locale,
      messages: messages
    });

    let localeData = require('react-intl/locale-data/' + locale);
    addLocaleData(localeData);

    let session = JSON.parse(localStorage.getItem('5R-SessionData') || "{}");
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
  	let nickname = this.state.nickname;
  	let locale = this.state.locale;
  	let mode = this.state.mode;

    return (
      <IntlProvider locale={this.state.locale} messages={this.state.messages} >
        <div className="body-wrapper">
          <DocumentTitle />

          <Header nickname={nickname} mode={mode} locale={locale} action={this.setLocale.bind(this)} handleMode={this.setMode} />

					<Router mode={this.state.mode} handleNickname={this.setNickname} messages={this.state.messages}/>
        </div>
      </IntlProvider>
    );
  }
}