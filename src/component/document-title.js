import {FormattedMessage} from "react-intl";
import React from "react";

export const DocumentTitle = () => (
	<FormattedMessage id='page.title' defaultMessage='5-in-a-row'>
    {(message) => {
      document.title = message;
      return null
    }}
	</FormattedMessage>
);