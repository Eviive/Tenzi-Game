import React from "react";
import Confetti from "react-confetti";
import { useStopwatch } from "react-timer-hook";

import Die from "./components/Die.jsx";
import Scores from "./components/Scores.jsx";

export default function App() {
	let [tenzi, setTenzi] = React.useState(false);

	let [rolls, setRolls] = React.useState(0);

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

	const {
		seconds,
		minutes,
		isRunning,
		start,
		pause,
		reset,
	} = useStopwatch({ autoStart: false });

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
			pause();
			let prevBestScores = JSON.parse(localStorage.getItem("bestScores"));
			if (!prevBestScores) {
				localStorage.setItem("bestScores", JSON.stringify(
				{
					bestRolls: {
						minutes: minutes,
						seconds: seconds,
						rolls: rolls
					},
					bestTime: {
						minutes: minutes,
						seconds: seconds,
						rolls: rolls
					}
				}));
			} else {
				let verifModif = false;
				const currentScores = {
					minutes: minutes,
					seconds: seconds,
					rolls: rolls
				}
				let currentTime = minutes * 60 + seconds;
				if (prevBestScores.bestRolls.rolls > currentScores.rolls) {
					prevBestScores.bestRolls = currentScores;
					verifModif = true;
				}
				if (prevBestScores.bestTime.minutes * 60 + prevBestScores.bestTime.seconds > currentTime) {
					prevBestScores.bestTime = currentScores;
					verifModif = true;
				}
				if (verifModif) {
					localStorage.setItem("bestScores", JSON.stringify(prevBestScores));
				}
			}
		}
	}, [diceArray]);

	function randomNumbers() {
		let randArray = [];
		for (let i = 0; i < 10; i++) {
			const randNb = Math.floor(Math.random() * 6 + 1);
			randArray.push(randNb);
		}
		return randArray;
	}

	function selectDice(dieId) {
		if (rolls === 0 && !isRunning) {
			start();
		}
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
		if (rolls === 0 && !isRunning) {
			start();
		}
		setRolls(prevRolls => prevRolls + 1);
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
		setRolls(0);
		reset(0, false);
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
				<Scores
					rolls={rolls}
					design={design}
					handleDesign={() => setDesign(prevDesign => !prevDesign)}
					timer={`${minutes}:${seconds.toString().padStart(2, '0')}`}
				/>
			</main>
		</>
	);
}