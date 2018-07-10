var Editor = function(game, width, height) {

	var circle = game.Dot.create(
		vector2(200, height/2.5),
		.1*height/2,
		Color.NCS_YELLOW,
	);

	var squareRelativePath = game.Path.create(
		[
			['M', 200, 50],
			['l', 100, 0],
			['l', 0, 100],
			['l', -100, 0],
			['l', 0, -100],
		],
		Color.BLACK,
		5.0,
	);

	var squareAbsolutePath = game.Path.create(
		[
			['M', 50, 50],
			['L', 150, 50],
			['L', 150, 150],
			['L', 50, 150],
			['L', 50, 50],
		],
		Color.BLACK,
		5.0,
	);

	var cubicAbsolutePath = game.Path.create(
		[
			['M', 350, 50],
			['C', 350, 150, 550, 150, 550, 50],
			['l', 0, 100],
		],
		Color.BLACK,
		5.0,
	);

	var cubicRelativePath = game.Path.create(
		[
			['M', 350, 200],
			['c', 0, 100, 200, 100, 200, 0],
			['l', 0, 100],
		],
		Color.BLACK,
		5.0,
	);

	var smoothCubicAbsolute = game.Path.create(
		[
			['M', 10, 380],
			['C', 40, 310, 65, 310, 95, 380],
			['S', 150, 450, 180, 380],
			['S', 235, 310, 265, 380],
			['l', 0, 100],
		],
		Color.NCS_BLUE,
		5.0,
	);

	var smoothCubicRelative = game.Path.create(
		[
			['M', 10, 430],
			['c', 30, -70, 55, -70, 85, 0],
			['s', 55, 70, 85, 0],
			['s', 55, -70, 85, 0],
			['l', 0, 100],
		],
		Color.NCS_GREEN,
		5.0,
	);

	var animationTarget = game.Path.create(
		[
			['M', 10, 430],
			['c', 30, 70, 55, 70, 85, 0],
			['s', 55, -70, 85, 0],
			['s', 55, 70, 85, 0],
			['l', 0, 100],
		],
		Color.NCS_GREEN,
		5.0,
	);

	smoothCubicRelative.animation = game.Path.transition(
		smoothCubicRelative,
		animationTarget,
		1.5,
		false,
	);

	return {
		initialize(dots) {
			dots.push(circle);
			dots.push(squareRelativePath);
			dots.push(squareAbsolutePath);
			dots.push(cubicRelativePath);
			dots.push(cubicAbsolutePath);
			dots.push(smoothCubicAbsolute);
			dots.push(smoothCubicRelative);
		},
		input(keyDowns, clicked, dots) {

		},
		update(delta, dots) {

		},
	}
}