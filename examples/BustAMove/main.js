window.onload = function() {
	var width = window.innerWidth-20.0;
	var height = window.innerHeight-20.0;
	var game = window.Game(width, height);

	var fsm = window.FSMWrapper(game, width, height);
	var bustAmove = window.BustAMove(fsm, width, height);
	fsm.setModule(bustAmove);
	game.initialize(fsm);
}