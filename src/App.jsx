import React from "react";
import Confetti from "react-confetti";
import { useStopwatch } from "react-timer-hook";

import Die from "./components/Die.jsx";
import Scores from "./components/Scores.jsx";
import Popup from "./components/Popup.jsx";

export default function App() {
	const tenziDefault = {
		win: false,
		popup: {
			rolls: false,
			time: false
		}
	};
	let [tenzi, setTenzi] = React.useState(tenziDefault);

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

	React.useEffect(() => {
		const firstValue = diceArray[0].value;
		const verif = diceArray.every(dice => dice.isHeld && dice.value === firstValue);
		if (verif) {
			pause();
			let prevBestRolls = JSON.parse(localStorage.getItem("bestRolls"));
			let prevBestTime = JSON.parse(localStorage.getItem("bestTime"));
			const currentRolls = rolls
			const currentTime = minutes * 60 + seconds
			let popup = {
				rolls: false,
				time: false
			};
			if (!prevBestRolls || prevBestRolls.rolls > currentRolls) {
				localStorage.setItem("bestRolls", JSON.stringify({
					rolls: currentRolls
				}));
				popup.rolls = true;
			}
			if (!prevBestTime || prevBestTime.time > currentTime) {
				localStorage.setItem("bestTime", JSON.stringify({
					time: currentTime
				}));
				popup.time = true;
			}
			setTenzi({
				win: true,
				popup
			});
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
		if (!tenzi.win) {
			if (rolls === 0 && !isRunning) {
				start();
			}
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
		setTenzi(tenziDefault);
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
			{(tenzi.popup.rolls || tenzi.popup.time) &&
				<Popup
					handleClick={() => setTenzi(({
						...tenziDefault,
						win: true
					}))}
					type={tenzi.popup}
					rolls={rolls}
					time={minutes * 60 + seconds}
				/>
			}
			{tenzi.win &&
				<Confetti
					{...windowSize}
					numberOfPieces={1000}
					tweenDuration={60000}
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
				<button className="btn-roll" onClick={tenzi.win ? newGame : rollDice}>
					{tenzi.win ? "New Game" : "Roll"}
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