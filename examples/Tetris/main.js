window.onload = function() {
	var width = window.innerWidth-20.0;
	var height = window.innerHeight-20.0;
	var game = window.Game(width, height);
	var tetris = window.Tetris(game, width, height);
	console.log("main.js", tetris);
	game.initialize(tetris);
}