var BustAMove = function(Game, width, height) {

	var ROW_COUNT = 12;
	var COL_COUNT = 8;

	var layout = window.SquishedGridLayout(
		ROW_COUNT, COL_COUNT, width, height, vector2(0, 0));
	var grid = window.Grid(Game, layout);

	return {
		initialize(dots) {
			grid.initialize(dots);
		},
		input(keyDowns, dots) {
		},
		update(delta, dots) {
		},
	};
}