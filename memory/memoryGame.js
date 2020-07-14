//@ts-check
const mode = { //these numbers are arbitrary, and they can even be strings if you want! they only have to be unique
	WaitingForFirstClick: 0,
	WaitingOnFirstCard: 1,
	WaitingOnSecondCard: 2
}

var gameState = {}; //empty object, we can add arbitrary variables to it with .
gameState.mode = mode.WaitingForFirstClick;
gameState.firstCard = null;
gameState.successfulMatches = 0;
gameState.waiting = false;

var buttons = new Array(16);
var colors = ["violet", "red", "#613613", "yellow",
			  "green", "turquoise", "indigo", "white"];
var secretButtonColors = new Array(16);

var secondsToWaitAfterFailedMatch = .4;

function initialize() {
	setInstructionText("Click any box to start!");
	setupButtons();
}

function setInstructionText(text, size = 1) {
	var instructionsElement = document.getElementById("instructions");
	instructionsElement.innerHTML = text;
	instructionsElement.style.fontSize = (size * 180) + "%";
}

function setupButtons() {
	var div = document.getElementById("buttons");
	
	// - LET INSTEAD OF VAR!!!
	// Confusing! :D
	// var = function scope, let = block scope.
	// by making this let instead of var, buttonClicked(id) will get the variable at the time
	// instead of what the variable -ends- as (16)
	for(let id = 0; id < 16; id++) {
		if(div.childElementCount < 16) {
			var button = document.createElement("button");
			button.className = "memoryButton";
			button.onclick = function() { buttonClicked(id); };
			div.append(button);
			buttons[id] = button;
		}

		buttons[id].style.backgroundColor = colors[Math.floor(id/2)];
	}
}

function buttonClicked(id) {

	if(gameState.waiting) {
		return;
	}

	switch(gameState.mode) {
		case mode.WaitingForFirstClick: {
			resetGameState();
		} break;

		case mode.WaitingOnFirstCard: {
			clickedFirstCard(id);
		} break;

		case mode.WaitingOnSecondCard: {
			clickedSecondCard(id);
		} break;
	}
}

function resetGameState() {
	gameState.mode = mode.WaitingForFirstClick;
	gameState.firstCard = null;
	gameState.successfulMatches = 0;
	gameState.waiting = false;

	setInstructionText("");

	randomizeGameState();
}

function randomizeGameState() {
	for(var id = 0; id < 16; id++) {
		secretButtonColors[id] = colors[Math.floor(id/2)]
		buttons[id].style.backgroundColor = null;
	}

	Shuffle();

	gameState.mode = mode.WaitingOnFirstCard;
}

function clickedFirstCard(id) {
	if(buttons[id].style.backgroundColor != "") return;

	gameState.firstCard = id;
	buttons[id].style.backgroundColor = secretButtonColors[id];
	gameState.mode = mode.WaitingOnSecondCard;
}

function clickedSecondCard(id) {
	if(buttons[id].style.backgroundColor != "") return;

	buttons[id].style.backgroundColor = secretButtonColors[id];

	if(secretButtonColors[id] == secretButtonColors[gameState.firstCard]) {
		gameState.successfulMatches++;
	}
	else {
		gameState.waiting = true;

		//delay
		setTimeout(function() {
			buttons[id].style.backgroundColor = "";
			buttons[gameState.firstCard].style.backgroundColor = "";
			gameState.waiting = false;
		}, secondsToWaitAfterFailedMatch * 1000)
	}

	gameState.mode = mode.WaitingOnFirstCard;

	if(gameState.successfulMatches == 8) {
		setInstructionText("Congratulations! Click any square to start again.");
		gameState.mode = mode.WaitingForFirstClick;
	}
}

//shenanigans :)
function Shuffle() {
	for(let i = secretButtonColors.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * i)
		const temp = secretButtonColors[i]
		secretButtonColors[i] = secretButtonColors[j]
		secretButtonColors[j] = temp
	}
};