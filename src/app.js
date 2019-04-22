import React from 'react';
import { IntlProviderWrapper } from "./component/intl-provider-wrapper";

import socketIOClient from "socket.io-client";

let host = null;
if (process.env.NODE_ENV === 'development') {
	host = 'http://localhost:3001';
}

const socket = socketIOClient(host);

socket.on('message', function (data) {
	console.log(data, "!!!");
	socket.emit('ack', { my: 'data' });
});

export class App extends React.Component {
	render() {
		return (
			<IntlProviderWrapper/>
		);
	}
}
