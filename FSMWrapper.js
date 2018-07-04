var Button = function(game, radius, text) {
	var outer = game.Dot.create(
		vector2(0, 0), radius, Color.BLACK);
	var inner = game.Dot.create(
		vector2(0, 0), radius*0.85, Color.WHITE);
	inner.letter = text;

	var dots = [outer, inner];

	return {
		dots : dots,
		setPosition(position) {
			outer.position = position;
			inner.position = position;
		},
		is(dot) {
			return outer == dot || inner == dot;
		},
		processMouseEvent(event) {
			console.log("processMouseEvent", event.type);
		},
		setText(text, offset) {
			inner.letter = text;
			inner.letterOffset = offset;
		},
		move(endPosition, radius) {
			for (var i = 0; i < dots.length; i++) {
				var dot = dots[i];
				dot.tween = game.Tweener.create(
					dot,
					false,
					100,
					i == 0 ? radius : radius*0.85,
					game.Tweener.line(dot.position, endPosition),
				);
			}
		},
	}
}

var FSMWrapper = function(game, width, height) {

	var State = {
		Paused : "Paused",
		Playing : "Playing",
		GameOver : "GameOver",
	}

	var PAUSE_POSITION = vector2(40, 40);
	var RESET_POSITION = vector2(40, 120);
	var SMALL_BUTTON_RADIUS = 30;
	var BIG_BUTTON_RADIUS = SMALL_BUTTON_RADIUS*2.5;

	var state = State.Playing;
	var module = null;
	var moduleDots = [];

	var playButton = Button(game, SMALL_BUTTON_RADIUS, "▍▍");
	playButton.dots[1].letterOffset = vector2(-1, 2);
	playButton.setPosition(PAUSE_POSITION);

	var resetButton = Button(game, SMALL_BUTTON_RADIUS, "↺");
	resetButton.dots[1].letterOffset = vector2(-4, 2);
	resetButton.setPosition(RESET_POSITION);

	function setState(newState) {
		if (newState == state) {
			return;
		}
		if (newState == State.Paused) {
			var endPosition = vector2(width/2.0, height/2.0);
			playButton.move(endPosition, BIG_BUTTON_RADIUS);
			playButton.setText("►", vector2(-4, 8));
			game.Dot.fade(moduleDots, 0.5);
		} else if (newState == State.Playing) {

			playButton.move(PAUSE_POSITION, SMALL_BUTTON_RADIUS);
			playButton.setText("▍▍", vector2(-1, 2));
			game.Dot.fade(moduleDots, 1.0);
		} else if (newState == State.GameOver) {

			playButton.move(vector2(-100, -100), SMALL_BUTTON_RADIUS);

			var endPosition = vector2(width/2.0, height/2.0);
			resetButton.move(endPosition, BIG_BUTTON_RADIUS);
			resetButton.dots[1].letterOffset = vector2(-10, 5);
			game.Dot.fade(moduleDots, 0.5);
		}
		state = newState;
	}

	function reset() {
		
		resetButton.move(RESET_POSITION, SMALL_BUTTON_RADIUS);
		resetButton.dots[1].letterOffset = vector2(-4, 2);

		game.Physics.setEnabled(true);
		game.Physics.setGravity(vector2(0, 0));
		game.Physics.setDampening(vector2(1, 1));
		for (var i = 0; i < moduleDots.length; i++) {
			moduleDots[i].velocity = vector2(Math.random()-0.5, Math.random()-0.5);
			moduleDots[i].tween = null;
		}
		setTimeout(function(){
			game.Physics.setEnabled(false);
			module.reset();
			setState(State.Playing);
		}, 500);
	}

	return {
		Renderer : game.Renderer,
		Tweener : game.Tweener,
		Physics : game.Physics,
		Dot : game.Dot,
		ShapeMaker : game.ShapeMaker,
		Collider : game.Collider,
		setModule(m) {
			module = m;
		},
		setGameOver() {
			setTimeout(function(){
				setState(State.GameOver);
			}, 0.5);
		},
		initialize(dots) {
			module.initialize(dots);
			moduleDots = dots.slice();
			dots.push.apply(dots, playButton.dots);
			dots.push.apply(dots, resetButton.dots);
		},
		input(keyDowns, mouseEvents, dots) {
			if (state == State.Playing) {
				module.input(keyDowns, dots);
			}
			for (var i = 0; i < mouseEvents.length; i++) {
				var event = mouseEvents[i];
				if (playButton.is(event.dot)) {
					playButton.processMouseEvent(event);
					if (event.type == MouseInput.MouseClicked) {
						if (state == State.Playing) {
							setState(State.Paused);
						} else if (state == State.Paused) {
							setState(State.Playing);
						}
					}
				}
				if (resetButton.is(event.dot)) {
					resetButton.processMouseEvent(event);
					if (event.type == MouseInput.MouseClicked) {
						reset();
					}
				}
			}
		},
		update(delta, dots) {
			if (state == State.Playing) {
				module.update(delta, dots);
			}
		},
	};
}