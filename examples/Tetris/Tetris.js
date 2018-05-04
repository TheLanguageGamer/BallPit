var Tetris = function(Game, width, height) {

	var ROW_COUNT = 20;
	var COL_COUNT = 10;
	var START_TIME_TO_DROP = 800.0;

	var timeToDrop = START_TIME_TO_DROP;
	var deltaSinceDrop = 0;

	var layout = window.NormalGridLayout(
		ROW_COUNT, COL_COUNT, width, height, vector2(0, 0));
	var grid = window.Grid(Game, layout);
	
	var gui = window.TetrisGUI();

	var shapes = [
		[
			[0, 1, 0],
			[0, 1, 0],
			[0, 1, 1],
		],
		[
			[0, 2, 0],
			[0, 2, 0],
			[2, 2, 0],
		],
		[
			[3, 3, 0],
			[0, 3, 3],
		],
		[
			[0, 4, 4],
			[4, 4, 0],
		],
		[
			[0, 5, 0],
			[5, 5, 5],
		],
		[
			[6, 6],
			[6, 6],
		],
		[
			[7, 7, 7, 7],
		],
	];

	var piece = grid.addSubgrid(0, 4, shapes[0]);
	var lines = 0;
	var score = 0;
	var level = 1;

	function resetScores() {
		lines = 0;
		score = 0;
		level = 1;

		gui.setLevel(level);
		gui.setLines(lines);
		gui.setScore(score);
	}

	function onRowsCleared(count) {
		lines += count;
		level = Math.floor(lines/10)+1;

		var scoresForLine = [0, 40, 100, 300, 1200];
		score += scoresForLine[count]*level;

		gui.setLevel(level);
		gui.setLines(lines);
		gui.setScore(score);

		timeToDrop = START_TIME_TO_DROP*Math.pow(0.9, level-1);
	}

	function clearRows() {
		var any = (1<<8)-1;
		var count = 0;
		for (var j0 = ROW_COUNT-1; j0 >= 0; j0--) {
			if(grid.matchShapeAt(j0, 0, [[any, any, any, any, any, any, any, any, any, any]])) {
				grid.setShapeAt(j0, 0, [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]);
				console.log("Clearing row", j0);
				count += 1;
				if (j0 > 0) {
					var subgrid = grid.getSubgrid(0, 0, COL_COUNT, j0);
					subgrid = grid.moveSubgrid(1, 0, subgrid);
				}
				j0 += 1;
			}
		}
		onRowsCleared(count);
	}

	function addPiece() {
		var idx = Math.floor(Math.random()*shapes.length);
		var shape = shapes[idx];
		if (!grid.canAddSubgrid(0, 4, shape)) {
			console.log("you dead");
			Game.setGameOver();
		}
		piece = grid.addSubgrid(0, 4, shape);
	}

	return {
		initialize(dots) {
			//Game.Dot.transition(dots, data);
			grid.initialize(dots);
		},
		input(keyDowns, dots) {
			for (var key in keyDowns) {
				var code = keyDowns[key].code;
				if (code == "ArrowLeft" || code == "KeyA") {
					if (grid.canMoveSubgrid(0, -1, piece)) {
						piece = grid.moveSubgrid(0, -1, piece);
					}
				} else if (code == "ArrowRight" || code == "KeyD") {
					if (grid.canMoveSubgrid(0, 1, piece)) {
						piece = grid.moveSubgrid(0, 1, piece);
					}
				} else if (code == "ArrowDown" || code == "KeyS") {
					if (grid.canMoveSubgrid(1, 0, piece)) {
						piece = grid.moveSubgrid(1, 0, piece);
					}
				} else if (code == "ArrowUp" || code == "KeyW") {
					if (grid.canRotateSubgrid(piece)) {
						piece = grid.rotateSubgrid(piece);
					}
				} else if (code == "Space") {
					while (grid.canMoveSubgrid(1, 0, piece)) {
						piece = grid.moveSubgrid(1, 0, piece);
					}
				}
			}
		},
		update(delta, dots) {
			deltaSinceDrop += delta;
			if (deltaSinceDrop > timeToDrop) {
				if (grid.canMoveSubgrid(1, 0, piece)) {
					piece = grid.moveSubgrid(1, 0, piece);
				} else {
					clearRows();
					addPiece();
				}
				deltaSinceDrop = 0.0;
			}
		},
		reset() {
			var duration = 500;
			grid.clear();
			grid.restorePositions(duration);
			resetScores();
			timeToDrop = START_TIME_TO_DROP;
			setTimeout(function(){
				//addPiece();
			}, duration);
		},
	};
}