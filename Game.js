var Game = function(width, height) {

	var FPSCounter = window.FPSCounter();
	var Renderer = window.Renderer();
	var Tweener = window.Tweener();
	var Physics = window.Physics(width, height);
	var Dot = window.Dot(Tweener);

	var keyDowns = {};
	document.addEventListener("keydown", function(e) {
		keyDowns[e.key] = e;
	}, false);

	var state = null;

	var paused = false;

	var dots = [];

	var last = 0;
	function update(now) {
		if (!paused) {
			var delta = now - last;
			last = now;
			FPSCounter.update(delta);

			state.input(keyDowns, dots);
			keyDowns = {};

			state.update(delta, dots);

			Tweener.update(delta, dots);
			Physics.update(delta, dots);
			Renderer.update(delta, dots);
		}

		window.requestAnimationFrame(update);
	}

	document.body.onblur = function() {
		console.log("blur");
		paused = true;
	}

	document.body.onfocus = function() {
		console.log("focus");
		paused = false;
	}

	return {
		initialize(startingState) {
			console.log("Game.initialize", startingState);
			state = startingState;
			state.initialize(dots);
			window.requestAnimationFrame(update);
		},
		Renderer : Renderer,
		Tweener : Tweener,
		Physics : Physics,
		Dot : Dot,
	};
}