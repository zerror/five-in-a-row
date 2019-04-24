import React from "react";
import socketIOClient from "socket.io-client";

let host = null;
if (process.env.NODE_ENV === 'development') {
	host = 'http://localhost:3001';
}

const socket = socketIOClient(host);
const $ = require("jquery");

export class MessageData extends React.Component {

	componentWillReceiveProps(nextProps, nextContext) {
		if (this.props.messages !== nextProps.messages) {
			const userConnected = nextProps.messages["placeholder.user_connected"] || "user connected";
			socket.removeEventListener('user-connected');
			socket.on('user-connected', function (data) {
				$('#messages').append($('<li>').html("<i>" + userConnected + ": " + data.nickname + "</i>"));
			});
		}
	}

	componentDidMount() {
		const nickname = this.props.nickname;
		const userConnected = this.props.messages["placeholder.user_connected"] || "user connected";

		socket.on('connection', function (data) {
			socket.emit('ack', { nickname: nickname });
		});

		socket.on('user-connected', function (data) {
			$('#messages').append($('<li>').html("<i>" + userConnected + ": " + data.nickname + "</i>"));
		});

		socket.on('chat-message', function(msg){
			$('#messages').append($('<li>').html(msg));
		});

		$(function () {
			$('form').submit(function(e) {
				e.preventDefault();
				socket.emit('chat-message', "<strong>" + nickname + "</strong>: " + $('#message-input').val());
				$('#message-input').val('');
				return false;
			});
		});
	}

	render() {
		return (
			<div className="message-data">

				<style>
					{ "#messages { height: " + (this.props.cols * 33 - 34) + "px; }" }
				</style>

				<ul id="messages"></ul>

				<form action="">
					<input id="message-input" autoComplete="off"/>
					<button>Send</button>
				</form>

			</div>
		);
	}
}