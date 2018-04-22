function vector2(x, y) {
	return {
		x : x,
		y : y,
	}
}

var Physics = function(width, height) {

	var enabled = false;
	var gravity = vector2(0, .003);
	var dampening = vector2(1, 1);
	var absoluteMin = vector2(0, 0);
	var absoluteMax = vector2(width, height);

	function updateVelocity(dot, delta) {
		var position = dot.position;
		velocity = dot.velocity;
		dot.position = vector2(
			position.x + delta*velocity.x,
			position.y + delta*velocity.y
		);
	}

	function collideWithWalls(dot) {
		if (dot.position.x - dot.radius < 0 
			&& dot.velocity.x < 0) {
			console.log("collideWithWalls");
			dot.velocity = vector2(-dot.velocity.x, dot.velocity.y);
		}
		if (dot.position.x + dot.radius > width
			&& dot.velocity.x > 0) {
			dot.velocity = vector2(-dot.velocity.x, dot.velocity.y);
		}
		if (dot.position.y - dot.radius < 0 
			&& dot.velocity.y < 0) {
			dot.velocity = vector2(dot.velocity.x, -dot.velocity.y);
		}
		if (dot.position.y + dot.radius > height 
			&& dot.velocity.y > 0) {
			dot.velocity = vector2(dot.velocity.x*dampening.x, -dot.velocity.y*dampening.y);
		}
	}

	function applyGravity(dot, delta) {
		var velocity = dot.velocity;
		dot.velocity = vector2(
			velocity.x + delta*gravity.x,
			velocity.y + delta*gravity.y,
		);
	}

	function clamp(v, min, max, radius) {
		return vector2(
			v.x-radius <= min.x ? min.x+radius : v.x+radius >= max.x ? max.x-radius : v.x,
			v.y-radius <= min.y ? min.y+radius : v.y+radius >= max.y ? max.y-radius : v.y,
		);
	}

	return {
		update(delta, dots) {
			if (!enabled) {
				return;
			}
			for (var i = 0; i < dots.length; ++i) {
				var dot = dots[i];
				updateVelocity(dot, delta);
				collideWithWalls(dot);
				applyGravity(dot, delta);
				dot.position = clamp(dot.position, absoluteMin, absoluteMax, dot.radius);
			}
		},
		setEnabled(value) { enabled = value; },
		setGravity(value) { gravity = value; },
		setDampening(value) { dampening = value; },
	};
};