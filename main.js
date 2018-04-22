window.onload = function() {

	var cvWidth = window.innerWidth - 20;
	var cvHeight = window.innerHeight - 20;

	var FPSCounter = window.FPSCounter();
	var Renderer = window.Renderer();
	var Tweener = window.Tweener();
	var Physics = window.Physics(cvWidth, cvHeight);
	var Collider = window.Collider(cvWidth, cvHeight);
	var Dot = window.Dot(Tweener);
	var State = window.State(Tweener, Physics, Dot);
	var FlappyWorm = window.FlappyWorm(Tweener, Physics, Renderer, Dot, cvWidth, cvHeight);

	var dots = []; //JSON.parse(JSON.stringify(Data.Doughnut));
	Color.randomize(dots, Color.Combination.Painterly);
	State.setState(FlappyWorm, dots);

	var keyDowns = {};
	document.addEventListener("keydown", function(e) {
		keyDowns[e.key] = e;
	}, false);

	var clicked = null;
	var canvas = Renderer.getCanvas();
	canvas.addEventListener("click", function(e) {
		console.log("Click:", e.screenX, e.screenY, e.clientX, e.clientY, e.pageX, e.pageY);
		var position = vector2(
			e.pageX - canvas.offsetLeft,
			e.pageY - canvas.offsetTop,
		);
		var dot = Collider.forPosition(dots, position);
	}, false);

	var last = 0;
	function update(now) {
		var delta = now - last;
		last = now;
		FPSCounter.update(delta);

		State.input(keyDowns, dots);
		keyDowns = {};

		State.update(delta, dots);
		Tweener.update(delta, dots);
		Physics.update(delta, dots);
		Renderer.update(delta, dots);

		window.requestAnimationFrame(update);
	}
	window.requestAnimationFrame(update);
}