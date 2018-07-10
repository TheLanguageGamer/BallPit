window.onload = function() {
	var width = window.innerWidth-20.0;
	var height = window.innerHeight-20.0;
	var game = window.Game(width, height);
	var editor = window.Editor(game, width, height);
	game.initialize(editor);
}