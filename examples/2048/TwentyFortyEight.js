var TwentyFortyEight = function(game, width, height) {

	var ROW_COUNT = 4;
	var COL_COUNT = 4;

	var grid = window.Grid(
		game, 4, 4, width, height, vector2(0, 0));
	grid.addBackground();
	grid.setStateStyleCallback(function(cell, newState) {
		console.log("TwentyFortyEight");
		var cc = Color.Combination.LoveThese;
		cell.dot.color = cc[newState%cc.length];
		if (newState > 0) {
			cell.dot.letter = (1<<newState).toString()
		} else {
			cell.dot.letter = null;
		}
	});
	// grid.setCells([
	// 	[1, 2, 3, 4],
	// 	[5, 6, 7, 8],
	// 	[9, 10, 11, 12],
	// 	[13, 14, 15, 16],
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
		console.log("trying to move", j, jDelta, jDistance, i, iDelta, iDistance);
		var nextCell = grid.getCell(
			j+jDistance+jDelta,
			i+iDistance+iDelta);
		console.log(cell);
		console.log("nextCell", j+jDistance+jDelta, i+iDistance+iDelta, nextCell);
		if (!nextCell || nextCell.state != cell.state) {
			console.log("move", j, i, "by", jDistance, iDistance);
			grid.moveSubgrid(jDistance, iDistance, subgrid);
			return jDistance != 0 || iDistance != 0;
		}
		nextCell.state = 0;
		grid.moveSubgrid(jDistance+jDelta, iDistance+iDelta, subgrid);
		grid.setStateForCell(nextCell, state+1);
		return true;
	}

	function moveLeft() {
		console.log("moveLeft");
		var movement = false;
		for (var j = 0; j < ROW_COUNT; j++) {
			for (var i = 0; i < COL_COUNT; i++) {
				movement = move(j, i, 0, -1) || movement;
			}
		}
		return movement;
	}

	function moveRight() {
		console.log("moveRight");
		var movement = false;
		for (var j = 0; j < ROW_COUNT; j++) {
			for (var i = COL_COUNT-1; i >= 0; i--) {
				movement = move(j, i, 0, 1) || movement;
			}
		}
		return movement;
	}

	function moveUp() {
		console.log("moveUp");
		var movement = false;
		for (var j = 0; j < ROW_COUNT; j++) {
			for (var i = 0; i < COL_COUNT; i++) {
				movement = move(j, i, -1, 0) || movement;
			}
		}
		return movement;
	}

	function moveDown() {
		console.log("moveDown");
		var movement = false;
		for (var j = ROW_COUNT-1; j >= 0; j--) {
			for (var i = 0; i < COL_COUNT; i++) {
				movement = move(j, i, 1, 0) || movement;
			}
		}
		return movement;
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
					grid.addRandom(1);
				}
			}
		},
		update(delta, dots) {

		},
	};
}