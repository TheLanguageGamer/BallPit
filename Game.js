var MouseInput = {
	MouseClicked : "MouseClicked",
	MouseOver : "MouseOver",
	MouseOut : "MouseOut",
};

var Game = function(width, height) {

	var FPSCounter = window.FPSCounter();
	var Renderer = window.Renderer();
	var Tweener = window.Tweener();
	var Physics = window.Physics(width, height);
	var Collider = window.Collider(width, height);
	var Dot = window.Dot(Tweener);

	var state = null;

	var paused = false;

	var dots = [];

	var keyDowns = {};
	document.addEventListener("keydown", function(e) {
		keyDowns[e.key] = e;
	}, false);

	var clicked = null;
	var mouseMove = null;
	var mouseOver = null;
	var mouseOut = null;
	var mouseEvents = [];
	var canvas = Renderer.getCanvas();
	function getDotForMouseEvent(e) {
		//console.log("Click:", e.screenX, e.screenY, e.clientX, e.clientY);
		var position = vector2(
			e.pageX - canvas.offsetLeft,
			e.pageY - canvas.offsetTop
		);
		return Collider.forPosition(dots, position);
	}
	canvas.addEventListener("click", function(e) {
		var dot = getDotForMouseEvent(e);
		//console.log("clicked:", clicked);
		if (dot) {
			mouseEvents.push({
				dot : dot,
				type : MouseInput.MouseClicked,
			});
		}
	});
	canvas.addEventListener("mousemove", function(e) {
		var dot = getDotForMouseEvent(e);
		if (mouseMove != dot) {
			if (mouseMove) {
				//mouseOut = mouseMove;
				mouseEvents.push({
					dot : mouseMove,
					type : MouseInput.MouseOut,
				});
			}
			if (dot) {
				//mouseOver = dot;
				mouseEvents.push({
					dot : dot,
					type : MouseInput.MouseOver,
				});
			}
		}
		mouseMove = dot;
		//console.log("mousemove:", dot);
	});
	canvas.addEventListener("mouseout", function(e) {
		console.log("mouseout");
		if (mouseMove != null) {
			mouseEvents.push({
				dot : mouseMove,
				type : MouseInput.MouseOut,
			});
			mouseMove = null;
		}
	});

	var last = 0;
	function update(now) {
		if (!paused) {
			var delta = now - last;
			last = now;
			FPSCounter.update(delta);

			state.input(keyDowns, mouseEvents, dots);
			keyDowns = {};
			mouseEvents = [];

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