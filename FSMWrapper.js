var FSMWrapper = function(game, width, height) {

	var module = null;

	return {
		Renderer : game.Renderer,
		Tweener : game.Tweener,
		Physics : game.Physics,
		Dot : game.Dot,
		setModule(m) {
			module = m;
		},
		initialize(dots) {
			module.initialize(dots);
		},
		input(keyDowns, dots) {
			module.input(keyDowns, dots);
		},
		update(delta, dots) {
			module.update(delta, dots);
		},
	};
}