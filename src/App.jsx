import React from "react";
import Confetti from "react-confetti";

import Die from "./components/Die.jsx";

export default function App() {
	let [tenzi, setTenzi] = React.useState(false);

	let [design, setDesign] = React.useState(true);

	let [diceArray, setDiceArray] = React.useState(() => {
		let dice = [];
		let values = randomNumbers();
		for (let index = 0; index < 10; index++) {
			dice.push({
				id: index,
				value: values[index],
				isHeld: false
			});
		}
		return dice;
	});

	let [windowSize, setWindowSize] = React.useState({
		width: undefined,
		height: undefined
	});

	let windowDimensions = () => setWindowSize({
		width: window.innerWidth,
		height: window.innerHeight
	});

	React.useEffect(() => {
		window.addEventListener("resize", windowDimensions);
		windowDimensions();
		return () => window.removeEventListener("resize", windowDimensions);
	}, []);

	// useEffect is useful here because we have to keep two different states synced
	React.useEffect(() => {
		const firstValue = diceArray[0].value;
		const verif = diceArray.every(dice => dice.isHeld && dice.value === firstValue);
		if (verif) {
			setTenzi(true);
		}
	}, [diceArray]);

	function randomNumbers() {
		let randArray = [];
		for (let i = 0; i < 10; i++) {
			let randNb = Math.floor(Math.random() * 6 + 1);
			// do {
			// 	randNb = Math.floor(Math.random() * 6 + 1);
			// } while (randNb == diceArray[i].value);
			randArray.push(randNb);
		}
		return randArray;
	}

	function selectDice(dieId) {
		if (!tenzi) {
			setDiceArray(prevDiceArray => 
				prevDiceArray.map(prevDice => 
					prevDice.id === dieId
					? {...prevDice, isHeld: !prevDice.isHeld}
					: prevDice
				)
			);
		}
	}

	function rollDice() {
		let values = randomNumbers();
		setDiceArray(prevDiceArray =>
			prevDiceArray.map(prevDice =>
				!prevDice.isHeld
				? {...prevDice, value: values[prevDice.id]}
				: prevDice
			)
		);
	}

	function newGame() {
		setTenzi(false);
		let values = randomNumbers();
		setDiceArray(prevDiceArray =>
			prevDiceArray.map(prevDice => ({
				...prevDice,
				value: values[prevDice.id],
				isHeld: false
			}))
		);
	}

	let diceElements = diceArray.map(dice => 
		<Die
			key={dice.id}
			{...dice}
			handleClick={selectDice}
			design={design}
		/>
	);

	function btnDesignContent() {
		if (!design) {
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
		<>
			{tenzi && <Confetti
						  {...windowSize}
						  numberOfPieces={1750}
						  tweenDuration={70000}
						  recycle={false}
					  />
			}
			<main>
				<div className="instructions">
					<h1>Tenzi</h1>
					<p>
						Roll until all dice are the same.
						<br/>
						Click each die to freeze it at its current value between rolls.
					</p>
				</div>
				<div className="wrapper-dice">
					{diceElements}
				</div>
				<button className="btn-roll" onClick={tenzi ? newGame : rollDice}>
					{tenzi ? "New Game" : "Roll"}
				</button>
				<button
					className={design ? "die d5" : "die"}
					onClick={() => setDesign(prevDesign => !prevDesign)}
				>
					{btnDesignContent()}
				</button>
			</main>
		</>
	);
}