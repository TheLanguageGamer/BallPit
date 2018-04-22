var State = function(Tweener, Physics, Dot) {
	var current = null;

	function setState(state, dots) {
		current = state;
		current.initialize(dots);
	}

	function tweenPlayInputHandler(keyDowns, dots) {
		for (var key in keyDowns) {
			var code = keyDowns[key].code;
			if (code == "KeyP") {
				console.log("P!");
				var keys = Object.keys(Color.Combination);
				var key = keys[keys.length*Math.random() << 0];
				Color.randomize(dots, Color.Combination[key]);
			}
			if (code == "ArrowLeft") {
				Dot.flipHorizontal(dots, false);
			}
			if (code == "ArrowRight") {
				Dot.flipHorizontal(dots, true);
			}
			if (code == "ArrowUp") {
				Dot.flipVertical(dots, false);
			}
			if (code == "ArrowDown") {
				Dot.flipVertical(dots, true);
			}
			if (code == "KeyW") {
				Dot.wiggle(dots);
			}
			if (code == "KeyR") {
				Dot.rotate(dots)
			}
		}
	}

	function Chaos(inputHandler) {
		return {
			initialize(dots) {
				Physics.setEnabled(true);
				Physics.setGravity(vector2(0, 0));
				Physics.setDampening(vector2(1, 1));
				for (var i = 0; i < dots.length; i++) {
					dots[i].velocity = vector2(Math.random()-0.5, Math.random()-0.5);
					dots[i].tween = null;
				}
			},
			input(keyDowns, dots) {
				inputHandler(keyDowns, dots);
			},
		};
	}

	function fromData(data, inputHandler) {
		return {
			initialize(dots) {
				Physics.setEnabled(false);
				for (var i = 0; i < dots.length; i++) {
					var dot = dots[i];
					if (i >= data.length) {
						dot.tween = Tweener.create(
							dot,
							false,
							500.0,
							0,
							null,
							function(dot) {
								dot.visible = false;
							},
						);
					} else {
						dot.visible = true;
						dot.tween = Tweener.create(
							dot,
							false,
							500.0,
							data[i].radius,
							Tweener.line(dot.position, data[i].position),
						);
					}
				}
				for (var i = dots.length; i < data.length; i++) {
					var dot = JSON.parse(JSON.stringify(data[i]));
					var radiusTarget = dot.radius;
					dot.radius = 0;
					dot.tween = Tweener.create(
						dot,
						false,
						500.0,
						radiusTarget,
					);
					dots.push(dot);
				}
			},
			input(keyDowns, dots) {
				inputHandler(keyDowns, dots);
			},
		};
	};

	return {
		fromData : fromData,
		input(keyDowns, dots) {
			if (current && current.input) {
				current.input(keyDowns, dots);
			}
		},
		DataChaosCycle : (function() {
			var states = [
				fromData(Data.Doughnut, tweenPlayInputHandler),
				Chaos(tweenPlayInputHandler),
				fromData(Data.Square, tweenPlayInputHandler),
				Chaos(tweenPlayInputHandler),
			];
			var index = 0;
			return {
				initialize(dots) {
					states[index].initialize(dots);
				},		
				input(keyDowns, dots) {
					for (var key in keyDowns) {
						var code = keyDowns[key].code;
						console.log("keyDown: ", key, code);
						if (code == "Space") {
							console.log("SPACE!");
							index = (index+1)%states.length;
							states[index].initialize(dots);
						}
					}
					states[index].input(keyDowns, dots);
				},
			};
		})(),
		setState : setState,
	};
};



