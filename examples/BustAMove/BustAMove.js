var BustAMove = function(game, width, height) {

	var ROW_COUNT = 14;
	var COL_COUNT = 8;
	var CC = Color.Combination.Painterly;

	var layout = window.SquishedGridLayout(
		ROW_COUNT, COL_COUNT, width, height, vector2(0, 0));
	var grid = window.Grid(game, layout);
	var gridDots = [];

	function stateStyleCallback(cell, newState) {
		cell.dot.visible = newState != 0;
		if (newState > 0) {
			cell.dot.color = CC[newState-1];
		}
	}
	grid.setStateStyleCallback(stateStyleCallback);

	var aimer = game.ShapeMaker.line(
		CC[2],
		2.0,
		8.0,
		vector2(width/2.0, height-100),
		vector2(width/2.0, height-350),
	);

	var centerIdx= Math.floor(aimer.dots.length*1/3);
	var center = aimer.dots[centerIdx].position;

	game.Renderer.getCanvas().addEventListener("mousemove", function(e){
		var position = vector2(
			e.pageX - game.Renderer.getCanvas().offsetLeft,
			e.pageY - game.Renderer.getCanvas().offsetTop,
		);

		var angle = Math.atan2(
			position.y-center.y,
			position.x-center.x,
		);

		for (var i = 0; i < aimer.dots.length; i++) {
			var dot = aimer.dots[i];
			var deltaX = dot.position.x - center.x;
			var deltaY = dot.position.y - center.y;
			var magnitude = Math.sqrt(deltaX*deltaX+deltaY*deltaY);
			var polarity = i < centerIdx ? -1.0 : 1.0;
			dot.position = vector2(
				polarity*Math.cos(angle)*magnitude+center.x,
				polarity*Math.sin(angle)*magnitude+center.y,
			);
		}
	});

	var current = game.Dot.create(center, layout.radius, CC[1]);

	game.Renderer.getCanvas().addEventListener("click", function(e){
		var position = vector2(
			e.pageX - game.Renderer.getCanvas().offsetLeft,
			e.pageY - game.Renderer.getCanvas().offsetTop,
		);

		var angle = Math.atan2(
			position.y-center.y,
			position.x-center.x,
		);
		
		current.velocity = vector2(
			Math.cos(angle),
			Math.sin(angle)
		);
	});

	return {
		initialize(dots) {
			game.Physics.setEnabled(true);
			game.Physics.setGravity(vector2(0, 0));
			game.Physics.setWalls(
				layout.upperLeft.x,
				layout.upperLeft.x + layout.width,
				layout.upperLeft.y,
				layout.upperLeft.y + layout.height
			);
			grid.initialize(gridDots);
			for (var j = 0; j < 4; j++) {
				for (var i = 0; i < COL_COUNT; i++) {
					grid.setCell(j, i, Math.floor(Math.random()*4+1));
				}
			}
			dots.push.apply(dots, gridDots);
			dots.push.apply(dots, aimer.dots);
			dots.push(current);
		},
		input(keyDowns, dots) {
		},
		update(delta, dots) {
			if (current && current.visible) {
				var collided = game.Collider.forDots(
					gridDots, current, function(dot){

					return dot.visible;
				});
				if (!collided) {
					return;
				}
				//var coord = layout.coordinateForPosition(collided.position);
				//console.log("Collided:", coord.j, coord.i);
				var closest = game.Collider.closest(gridDots, current);
				var coord = layout.coordinateForPosition(closest.position);
				grid.setCell(coord.j, coord.i, 1);
				var cell = grid.getCell(coord.j, coord.i);
				current.visible = false;
				console.log("closest", coord.j, coord.i);
				console.log(cell.dot.position.x, cell.dot.position.y);
				console.log(closest.position.x, closest.position.y);
			}
		},
	};
}








