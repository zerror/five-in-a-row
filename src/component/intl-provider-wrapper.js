import React from "react";
import { addLocaleData, IntlProvider } from "react-intl";
import { Router } from "./router"
import { DocumentTitle } from "./document-title"
import fiMessages from "../locale/fi";

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
			messages
		};
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

  render() {
    return (
      <IntlProvider locale={this.state.locale} messages={this.state.messages} >
        <div className="body-wrapper">
          <DocumentTitle />
					<Router locale={this.state.locale} handle={this.handle.bind(this)}/>
        </div>
      </IntlProvider>
    );
  }
}