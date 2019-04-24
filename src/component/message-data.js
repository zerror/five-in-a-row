import React from "react";
import socketIOClient from "socket.io-client";
import {FormattedMessage} from "react-intl";

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
				$('#messages').animate({
					scrollTop: $('#messages').get(0).scrollHeight
				}, 1000);
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
			$('#messages').animate({
				scrollTop: $('#messages').get(0).scrollHeight
			}, 1000);
		});

		socket.on('chat-message', function(msg){
			$('#messages').append($('<li>').html(msg));
			$('#messages').animate({
				scrollTop: $('#messages').get(0).scrollHeight
			}, 1000);
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
					<button><FormattedMessage id="button.send" defaultMessage="Send" /></button>
				</form>

			</div>
		);
	}
}