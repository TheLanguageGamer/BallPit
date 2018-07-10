var Path = function() {
	var Animation = {
		TRANSITION : 0,
		DRAW : 1,
	};

	function stepTransition(path, delta) {
		var animation = path.animation;
		var originalMoves = animation.original.moves;
		var targetMoves = animation.target.moves;

		animation.time += delta/1000.0;

		var percent = animation.time/animation.duration;
		if (percent >= 1.0) {
			percent = 1.0;
		}
		for (var i = 0; i < originalMoves.length; ++i) {
			for (var j = 1; j < originalMoves[i].length; ++j) {
				var oValue = originalMoves[i][j];
				var tValue = targetMoves[i][j];

				var delta =tValue - oValue;

				path.moves[i][j] = oValue + delta*percent;
			}
		}
		if (percent == 1.0) {
			if (animation.repeating) {
				var temp = animation.original;
				animation.original = animation.target;
				animation.target = temp;
				animation.time = 0.0;
			} else {
				path.animation = null;
			}
		}
	}

	function stepDraw(path, delta) {
		var moves = path.moves;

		animation.time += delta/1000.0;

		var percent = animation.time/animation.duration;
		var totalDistance = 0;
		var lastX = 0;
		var lastY = 0;
		for (var i = 0; i < moves.length; ++i) {
			var move = moves[i];
			var x = move[move.length-2];
			var y = move[move.length-1];
			if (move[0] == 'm' || move[0] == 'M') {
				lastX = x;
				lastY = y;
				continue;
			}
			var deltaX = x - lastX;
			var deltaY = y - lastY;
			var distance = Math.sqrt(deltaX*deltaX+deltaY*deltaY);
			
		}
	}

	return {
		create(moves, stroke, width, fill) {
			return {
				moves : moves,
				stroke : stroke,
				width : width,
				fill : fill,
				type : Shape.PATH,
				visible : true,
				animation : null,
			};
		},
		transition(original, target, duration, repeating) {
			return {
				original : JSON.parse(JSON.stringify(original)),
				target : target,
				duration : duration, 
				repeating : repeating,
				time : 0.0,
				type : Animation.TRANSITION,
			};
		},
		draw(target, duration) {
			return {
				target : JSON.parse(JSON.stringify(tarter)),
				duration : duration,
				time : 0.0,
				type : Animation.DRAW,
			};
		},
		update(delta, shapes) {
			for (var i = 0; i < shapes.length; ++i) {
				var shape = shapes[i];
				if (shape.type != Shape.PATH) {
					continue;
				}

				if (shape.animation == null) {
					continue;
				}

				switch(shape.animation.type) {
					case Animation.TRANSITION:
						stepTransition(shape, delta);
						break;
					default:
						break;
				}
			}
		},
	};
};