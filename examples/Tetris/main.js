window.onload = function() {
	var width = window.innerWidth-20.0;
	var height = window.innerHeight-20.0;
	var game = window.Game(width, height);
	
	//var fsm = window.FSMWrapper(game, width, height);
	//var tetris = window.Tetris(fsm, width, height);
	//fsm.setModule(tetris);
	//game.initialize(fsm);

	var tetris = window.Tetris(game, width, height);
	game.initialize(tetris);
}