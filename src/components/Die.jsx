import React from "react";

export default function Die(props) {
	function dotsArray(nbDots) {
		let dotsArray = [];
		for (let i = 0; i < nbDots; i++) {
			dotsArray.push(<span key={i}></span>)
		}
		return dotsArray;
	}

	let classNames = "die";
	if (props.isHeld) {
		classNames += " held";
	}
	if (!props.design) {
		classNames += ` d${props.value}`;
	}
	
	return (
		<div
			className={classNames}
			onClick={() => props.handleClick(props.id)}
		>
			{props.design
			? props.value
			: dotsArray(props.value)}
		</div>
	);
}