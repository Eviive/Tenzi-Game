import React from "react";

export default function Popup(props) {
	let text = {};
	if (props.type.rolls && props.type.time) {
		text = {
			title: "Best time and rolls score :",
			sub: `You won with ${props.score.rolls} rolls in ${props.score.minutes > 0
				? `${props.score.minutes}:${props.score.seconds} minutes`
				: `${props.score.seconds} seconds`
			}`
		};
	} else if (props.type.rolls) {
		text = {
			title: "Best rolls score :",
			sub: `You won in ${props.score.rolls} rolls`
		};
	} else {
		text = {
			title: "Best time score :",
			sub: `You won in ${props.score.minutes > 0
				? `${props.score.minutes}:${props.score.seconds} minutes`
				: `${props.score.seconds} seconds`
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