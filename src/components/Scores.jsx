import React from "react";

export default function Scores(props) {
	function btnDesignContent() {
		if (!props.design) {
			return "5";
		} else {
			let dieFace = [];
			for (let i = 0; i < 5; i++) {
				dieFace.push(<span key={i}></span>);
			}
			return dieFace;
		}
	}
	
	return (
		<div className="scores">
			<h2>{props.timer}</h2>
			<h3>{props.rolls}</h3>
			<div className="wrapper-design">
				<button
					className={props.design ? "die d5" : "die"}
					onClick={props.handleDesign}
				>
					{btnDesignContent()}
				</button>
			</div>
		</div>
	);
}