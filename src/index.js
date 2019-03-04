import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Game} from './module/game.js';
import { addLocaleData, IntlProvider, FormattedMessage } from 'react-intl';

import fiMessages from './locale/fi.json';

let locale = "fi";

let session = JSON.parse(sessionStorage.getItem('5R-SessionData') || "{}");
if (!session) {
  session = { locale: locale };
  sessionStorage.setItem('5R-SessionData', JSON.stringify(session));
} else if ('locale' in session) {
  locale = session.locale;
}

let allMessages = { "fi": fiMessages };
let messages = allMessages[locale] ? allMessages[locale] : {};
let localeData = require('react-intl/locale-data/' + locale);
addLocaleData(localeData);


const DocumentTitle = () => (
	<FormattedMessage id='page.title' defaultMessage='5-in-a-row'>
    {(message) => {
      document.title = message;
      return null
    }}
	</FormattedMessage>
);

class HotSwappingIntlProvider extends React.Component {
  constructor(props) {
    super(props);
    const {initialLocale: locale, initialMessages: messages} = props;
    this.state = {locale, messages};
  }

  handler(locale) {
    this.setState({
      locale: locale,
      messages: allMessages[locale] ? allMessages[locale] : {}
    });
    localeData = require('react-intl/locale-data/' + locale);
    addLocaleData(localeData);

    session.locale = locale;
    sessionStorage.setItem('5R-SessionData', JSON.stringify(session));
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
  <HotSwappingIntlProvider initialLocale={locale} initialMessages={messages}>
  </HotSwappingIntlProvider>,
  document.getElementById('root')
);

