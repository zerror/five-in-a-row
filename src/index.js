import React from 'react';
import ReactDOM from 'react-dom';
import {Game} from './module/game.js';
import './index.css';
import { addLocaleData, IntlProvider, FormattedMessage } from 'react-intl';

import fiMessages from './locale/fi.json';

import socketIOClient from "socket.io-client";

const socket = socketIOClient('http://localhost:3001');

socket.on('message', function (data) {
	console.log(data, "!!!");
	socket.emit('ack', { my: 'data' });
});

let locale = "en";
let allMessages = { "fi": fiMessages };
let session = JSON.parse(localStorage.getItem('5R-SessionData') || "{}");

if (!session) {
  session = { locale: locale };
  localStorage.setItem('5R-SessionData', JSON.stringify(session));
} else if ('locale' in session) {
  locale = session.locale;
}

let messages = allMessages[locale] ? allMessages[locale] : {};
let localeData = require('react-intl/locale-data/' + locale);

addLocaleData(localeData);

// ========================================

const DocumentTitle = () => (
	<FormattedMessage id='page.title' defaultMessage='5-in-a-row'>
    {(message) => {
      document.title = message;
      return null
    }}
	</FormattedMessage>
);

class IntlProviderWrapper extends React.Component {
  constructor(props) {
    super(props);
    const {initialLocale: locale, initialMessages: messages} = props;
		this.state = {
			locale,
			messages
		};
  }

  handler(locale) {
    this.setState({
      locale: locale,
      messages: allMessages[locale] ? allMessages[locale] : {}
    });
    localeData = require('react-intl/locale-data/' + locale);
    addLocaleData(localeData);

    session.locale = locale;
    localStorage.setItem('5R-SessionData', JSON.stringify(session));
  }

  render() {
    return (
      <IntlProvider locale={this.state.locale} messages={this.state.messages} >
        <div className="body-wrapper">
          <DocumentTitle />
          <Game locale={this.state.locale} action={this.handler.bind(this)} />
        </div>
      </IntlProvider>
    );
  }
}

// ========================================

ReactDOM.render(
  <IntlProviderWrapper initialLocale={locale} initialMessages={messages} />,
  document.getElementById('root')
);

