var FlappyWorm = function(Tweener, Physics, Renderer, Dot, width, height) {
	var HEAD_PERCENT_OF_HEIGHT = 0.11;
	var HEAD_VELOCITY = vector2(0, -1.0);
	var HEAD_GRAVITY = vector2(0, 0.003);

	var TAIL1_VELOCITY = vector2(0, -1.0+0.01);
	var TAIL1_GRAVITY = vector2(0, 0.003);

	var TAIL2_VELOCITY = vector2(0, -1.0+0.02);
	var TAIL2_GRAVITY = vector2(0, 0.003);

	var GROUND_PERCENT_OF_HEIGHT = 0.08;
	var GROUND_MARGIN = 3;
	var GROUND_RECOVER_VELOCITY = vector2(0.6, 0.0);

	var LETTER_COUNT = 10;
	var LETTER_PERCENT_OF_HEIGHT = 0.11;
	var LETTER_X_MARGIN = 300;

	var WORLD_VELOCITY = vector2(-0.3, 0.0);

	var LocalState = {
		Playing : "Playing",
		Dead : "Dead",
		Ready : "Ready",
	};

	var state = LocalState.Ready;
	
	var head = Dot.create(
		vector2(200, height/2.5),
		HEAD_PERCENT_OF_HEIGHT*height/2,
		Color.NCS_YELLOW,
	);
	var tail1 = Dot.create(
		vector2(
			head.position.x-head.radius-30,
			head.position.y
		),
		head.radius*.40,
		head.color,
	);
	var tail2 = Dot.create(
		vector2(
			tail1.position.x-tail1.radius-20,
			tail1.position.y
		),
		head.radius*.20,
		head.color,
	);

	function moveBird(delta) {
		Physics.updatePosition(head, delta);
		Physics.updateVelocity(head, delta, HEAD_GRAVITY);
		tail1.position = vector2(
			head.position.x-head.radius-20,
			head.position.y-head.velocity.y*30,
		);
		tail2.position = vector2(
			tail1.position.x-tail1.radius-10,
			head.position.y-head.velocity.y*60,
		);
	}

	var data = [head, tail1, tail2];

	var ground = [];
	var groundRadius = GROUND_PERCENT_OF_HEIGHT*height/2;
	var groundCount = Math.floor(1.5*width/((GROUND_MARGIN+groundRadius)*2) - 1);
	var groundHeight = height-groundRadius*2;
	for (var i = 0; i < groundCount; i++) {
		var patchOfDirt = Dot.create(
			vector2(
				(i+1.5)*(GROUND_MARGIN+groundRadius)*2,
				groundHeight,
			),
			groundRadius,
			Color.BLACK,
		);
		patchOfDirt.velocity = WORLD_VELOCITY;
		data.push(patchOfDirt);
		ground.push(patchOfDirt);
	}

	function scrollGround(delta) {
		var minG = null;
		for (var i = 0; i < ground.length; i++) {
			Physics.updatePosition(ground[i], delta);
			if (ground[i].position.x < groundRadius*2) {
				ground[i].velocity = GROUND_RECOVER_VELOCITY;
				ground[i].position = vector2(
					ground[i].position.x,
					groundHeight + groundRadius*0.5,
				);
			} else if (ground[i].velocity.x < 0.0
				&& (minG == null || ground[i].position.x > minG.position.x)) {
				minG = ground[i];
			}
		}
		for (var i = 0; i < ground.length; i++) {
			if (ground[i].velocity.x > 0.0
				&& ground[i].position.x > minG.position.x+(groundRadius+GROUND_MARGIN)*2) {
				ground[i].position = vector2(
					minG.position.x+(groundRadius+GROUND_MARGIN)*2,
					minG.position.y,
				);
				ground[i].velocity = WORLD_VELOCITY;
			}
		}
	}

	var letters = [];
	var selected = [];
	var subWordTrie = window.WordTrie;
	var selectedStartPosition = vector2(
		LETTER_PERCENT_OF_HEIGHT*height/2.0 + 5, 
		LETTER_PERCENT_OF_HEIGHT*height/2.0 + 5,
	);
	var nextLetterX = width + 100;

	function getCurrentWord() {
		var word = "";
		for (var i = 0; i < selected.length; i++) {
			word += selected[i].letter;
		}
		return word;
	}

	function finishWord() {
		for (var i = 0; i < selected.length; i++) {
			var dot = selected[i];
			dot.tween = Tweener.create(
				dot, false, 300.0, dot.radius,
				Tweener.line(
					dot.position,
					vector2(
						-100-LETTER_X_MARGIN*i,
						dot.position.y)
				),
				function(dot) {
					dot.isSelected = false;
					dot.color = Color.NCS_GREEN;
					dot.velocity = WORLD_VELOCITY;
				},
			);
		}
		selected = [];
		subWordTrie = WordTrie;
	}

	function randomY() {
		return 0.2*height+Math.random()*height*0.6;
	}

	function randomLetter() {
		var r = Math.random();
		if (r < 0.2) {
			var vowels = ["A", "E", "I", "O", "U"];
			ret = vowels[Math.floor(Math.random()*vowels.length)];
		} else if (r < 0.4) {
			var keys = Object.keys(subWordTrie);
			ret = keys[Math.floor(Math.random()*keys.length)];
			ret = ret.toUpperCase();
		} else {
			var c = Math.floor(Math.random()*26);
			ret = String.fromCharCode(65+c);
		}
		return ret;
	}

	for (var i = 0; i < LETTER_COUNT; i++) {
		var dot = Dot.create(
			vector2(
				nextLetterX,
				randomY(),
			),
			LETTER_PERCENT_OF_HEIGHT*height/2.0,
			Color.NCS_GREEN,
		);
		dot.velocity = WORLD_VELOCITY;
		dot.letter = randomLetter();
		nextLetterX += LETTER_X_MARGIN;
		letters.push(dot);
		data.push(dot);
	}

	function resetLetters() {
		subWordTrie = WordTrie;
		selected = [];
		for (var i = 0; i < LETTER_COUNT; i++) {
			var dot = letters[i];
			dot.color = Color.NCS_GREEN;
			dot.position = vector2(
				dot.position.x,
				randomY()
			);
			dot.letter = randomLetter();
			dot.isSelected = false;
		}
	}

	function scrollLetters(delta) {
		var nextLetterX = 0;
		for (var i = 0; i < letters.length; i++) {
			if (letters[i].isSelected) {
				continue;
			}
			Physics.updatePosition(letters[i], delta);
			if (letters[i].position.x > nextLetterX) {
				nextLetterX = letters[i].position.x;
			}
		}
		nextLetterX += LETTER_X_MARGIN;
		for (var i = 0; i < letters.length; i++) {
			if (letters[i].isSelected) {
				continue;
			}
			if (letters[i].position.x < -300) {
				letters[i].position = vector2(
					nextLetterX,
					randomY(),
				);
				letters[i].letter = randomLetter();
			}
		}
	}

	var startData = JSON.parse(JSON.stringify(data));

	return {
		initialize(dots) {
			Renderer.setBackgroundColor(Color.NCS_BLUE);
			Dot.transition(dots, data);

			head = dots[0];
			tail1 = dots[1];
			tail2 = dots[2];

			for (var i = 0; i < groundCount; i++) {
				ground[i] = dots[i+3];
			}

			for (var i = 0; i < LETTER_COUNT; i++) {
				letters[i] = dots[i+3+groundCount];
			}
		},
		input(keyDowns, dots) {
			for (var key in keyDowns) {
				var code = keyDowns[key].code;
				if (code == "Space") {
					if (state == LocalState.Playing) {
						head.velocity =  HEAD_VELOCITY;
					} else if (state == LocalState.Ready) {
						state = LocalState.Playing;
					} else if (state == LocalState.Dead) {
						state = LocalState.Ready;
						resetLetters();
						Dot.transition(dots, startData);
					}
				}
			}
		},
		update(delta, dots) {
			if (state == LocalState.Playing) {
				moveBird(delta);
				scrollGround(delta);
				scrollLetters(delta);

				for (var i = 0; i < ground.length; i++) {
					if (Dot.intersects(ground[i], head)) {
						state = LocalState.Dead;
						break;
					}
				}

				for (var i = 0; i < letters.length; i++) {
					var dot = letters[i];
					if (dot.isSelected) {
						continue;
					}
					if (Dot.intersects(dot, head)) {
						var letter = dot.letter;
						dot.isSelected = true;
						var targetPosition = selectedStartPosition;
						if (selected.length > 0) {
							var last = selected[selected.length-1];
							targetPosition = vector2(
								last.position.x + 2*last.radius + 5.0,
								last.position.y,
							);
						}
						selected.push(dot);
						dot.color = Color.WHITE;
						dot.tween = Tweener.create(
							dot, false, 200.0, dot.radius,
							Tweener.line(dot.position, targetPosition),
							function(dot) {
								letter = letter.toLowerCase();
								if (!subWordTrie[letter]) {
									state = LocalState.Dead;
									console.log("No word begins with:", getCurrentWord());
								} else {
									subWordTrie = subWordTrie[letter];
									if (subWordTrie["$"]) {
										console.log("Score!", getCurrentWord());
										finishWord();
									}
								}
							}
						);
					}
				}
			}
		},
	}
}









