import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Game} from './module/game.js';
import { addLocaleData, IntlProvider, FormattedMessage } from 'react-intl';

import fiMessages from './locale/fi.json';

let locale = "fi";
let localeData = require('react-intl/locale-data/' + locale);
let allMessages = { "fi": fiMessages };
let messages = allMessages[locale] ? allMessages[locale] : {};
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

  handler(lang) {
    this.setState({
      locale: lang,
      messages: allMessages[lang] ? allMessages[lang] : {}
    });
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

