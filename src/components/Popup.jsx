import React from "react";

export default function Popup(props) {
	let text = {};
	if (props.type.rolls && props.type.time) {
		text = {
			title: "Best time and rolls score",
			sub: `You won with ${props.rolls} rolls in ${props.time >= 60
				? `${Math.floor(props.time / 60)}:${props.time % 60} minutes`
				: `${props.time} seconds`
			}`
		};
	} else if (props.type.rolls) {
		text = {
			title: "Best rolls score",
			sub: `You won in ${props.rolls} rolls`
		};
	} else {
		text = {
			title: "Best time score",
			sub: `You won in ${props.time >= 60
				? `${Math.floor(props.time / 60)}:${props.time % 60} minutes`
				: `${props.time} seconds`
			}`
		};
	}
	
	return (
		<div className="popup">
			<div>
				<h1>New High Score</h1>
				<h2>Well played !</h2>
				<h2 className="best-score">{text.title}</h2>
			</div>
			<h3>{text.sub}</h3>
			<button className="btn-popup" onClick={props.handleClick}>Dismiss</button>
		</div>
	);
}