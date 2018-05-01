var TwentyFortyEight = function(game, width, height) {

	var ROW_COUNT = 4;
	var COL_COUNT = 4;

	var grid = window.Grid(
		game, 4, 4, width, height, vector2(0, 0));
	grid.addBackground();

	function styleCallback(cell, newState) {
		var cc = Color.Combination.LoveThese;
		cell.dot.color = cc[newState%cc.length];
		if (newState > 0) {
			cell.dot.letter = (1<<newState).toString()
			cell.dot.visible = true;
		} else {
			cell.dot.letter = null;
			cell.dot.visible = false;
		}
	}
	grid.setStateStyleCallback(styleCallback);
	// grid.setCells([
	// 	[1, 2, 3, 4],
	// 	[5, 6, 7, 8],
	// 	[9, 10, 11, 12],
	// 	[13, 14, 15, 16],
	// ]);
	// grid.setCells([
	// 	[0, 1, 0, 0],
	// 	[0, 2, 0, 0],
	// 	[0, 3, 0, 0],
	// 	[0, 0, 0, 0],
	// ]);
	// grid.setCells([
	// 	[1, 1, 1, 1],
	// 	[0, 0, 0, 0],
	// 	[0, 0, 0, 0],
	// 	[1, 1, 1, 1],
	// ]);

	function move(j, i, jDelta, iDelta) {
		var cell = grid.getCell(j, i);
		var state = cell.state;
		var subgrid = grid.getSubgrid(j, i, 1, 1);
		if (Object.keys(subgrid.states).length == 0) {
			return;
		}
		var jDistance = 0;
		var iDistance = 0;
		while(grid.canMoveSubgrid(
			jDistance+jDelta,
			iDistance+iDelta,
			subgrid)) {

			jDistance += jDelta;
			iDistance += iDelta;
		}
		var nextCell = grid.getCell(
			j+jDistance+jDelta,
			i+iDistance+iDelta);
		var consumed = false;
		
		if (nextCell && nextCell.state == cell.state) {
			nextCell.state = 0;
			jDistance += jDelta;
			iDistance += iDelta;
			consumed = true;
		}
		grid.moveSubgrid(jDistance, iDistance, subgrid, false);
		if (consumed) {
			grid.setStateForCell(nextCell, state+1, false);
		}
		var newCell = grid.getCell(j+jDistance, i+iDistance);
		var startPosition = cell.dot.position;
		var endPosition = grid.positionForCoordinate(i+iDistance, j+jDistance);
		cell.dot.tween = game.Tweener.create(
			cell.dot,
			false,
			100.0,
			grid.getRadius(),
			game.Tweener.line(startPosition, endPosition),
			function(dot) {
				cell.dot.position = grid.positionForCoordinate(i, j);
				styleCallback(newCell, newCell.state);
				styleCallback(cell, cell.state);
			}
		);
		return jDistance != 0 || iDistance != 0;
	}

	function moveLeft() {
		var movement = false;
		for (var j = 0; j < ROW_COUNT; j++) {
			for (var i = 0; i < COL_COUNT; i++) {
				movement = move(j, i, 0, -1) || movement;
			}
		}
		return movement;
	}

	function moveRight() {
		var movement = false;
		for (var j = 0; j < ROW_COUNT; j++) {
			for (var i = COL_COUNT-1; i >= 0; i--) {
				movement = move(j, i, 0, 1) || movement;
			}
		}
		return movement;
	}

	function moveUp() {
		var movement = false;
		for (var j = 0; j < ROW_COUNT; j++) {
			for (var i = 0; i < COL_COUNT; i++) {
				movement = move(j, i, -1, 0) || movement;
			}
		}
		return movement;
	}

	function moveDown() {
		var movement = false;
		for (var j = ROW_COUNT-1; j >= 0; j--) {
			for (var i = 0; i < COL_COUNT; i++) {
				movement = move(j, i, 1, 0) || movement;
			}
		}
		return movement;
	}

	function addRandom() {
		var cell = grid.addRandom(1, false);
		setTimeout(function() {
			styleCallback(cell, cell.state);
			cell.dot.radius = grid.getRadius()*0.5;
			cell.dot.position = grid.positionForCoordinate(cell.i, cell.j);
			cell.dot.tween = game.Tweener.create(
				cell.dot,
				false,
				100.0,
				grid.getRadius());
		}, 100.0);
	}

	return {
		initialize(dots) {
			grid.initialize(dots);
			grid.addRandom(1);
			grid.addRandom(1);
		},
		input(keyDowns, dots) {
			for (var key in keyDowns) {
				var code = keyDowns[key].code;
				var movement = false;
				if (code == "ArrowLeft") {
					movement = moveLeft() || movement;
				} else if (code == "ArrowRight") {
					movement = moveRight() || movement;
				} else if (code == "ArrowDown") {
					movement = moveDown() || movement;
				} else if (code == "ArrowUp") {
					movement = moveUp() || movement;
				}
				if (movement) {
					addRandom();
				}
			}
		},
		update(delta, dots) {

		},
	};
}