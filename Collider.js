var Collider = function(width, height) {
	var SIZE = 80;

	var bWidth = width/Math.floor(width/SIZE);
	var bHeight = height/Math.floor(height/SIZE);
	var wCount = width/bWidth;
	var hCount = height/bHeight;
	console.log("Collider", bWidth, bHeight, wCount, hCount);

	var buckets = [];
	for (var i = 0; i < hCount; i++) {
		var row = [];
		buckets.push(row);
		for (var j = 0; j < wCount; j++) {
			row.push([]);
		}
	}

	function bucketForPosition(position) {
		var i = Math.floor(position.y/bHeight);
		var j = Math.floor(position.x/bWidth);
		return {
			i : i,
			j : j,
		};
	}

	return {
		update(dots) {
			for (var c = 0; c < dots.length; c++) {
				var dot = dots[i];
				var l = dot.position.x - dot.radius;
				var r = dot.position.x + dot.radius;
				var u = dot.position.y - dot.radius;
				var d = dot.position.y + dot.radius;

				var luC = bucketForPosition(vector2(l, u));
				var ldC = bucketForPosition(vector2(l, d));
				var ruC = bucketForPosition(vector2(r, u));
				var rdC = bucketForPosition(vector2(r, d));
			}
		},
		forPosition(dots, position) {
			for (var i = dots.length-1; i >= 0; i--) {
				var dot = dots[i];
				var delta = vector2(
					dot.position.x - position.x,
					dot.position.y - position.y
				);
				var distance = Math.sqrt(delta.x*delta.x+delta.y*delta.y);
				if (distance <= dot.radius) {
					return dot;
				}
			}
			return null;
		},
		forDots(dots, otherDot, filter = null) {
			for (var i = dots.length-1; i >= 0; i--) {
				var dot = dots[i];
				if (filter && !filter(dot)) {
					continue;
				}
				var delta = vector2(
					dot.position.x - otherDot.position.x,
					dot.position.y - otherDot.position.y,
				);
				var distance = Math.sqrt(delta.x*delta.x+delta.y*delta.y);
				if (distance <= dot.radius + otherDot.radius) {
					return dot;
				}
			}
			return null;
		},
		closest(dots, otherDot) {
			var closest = null
			var closestDistance = 0;
			for (var i = dots.length-1; i >= 0; i--) {
				var dot = dots[i];
				var delta = vector2(
					dot.position.x - otherDot.position.x,
					dot.position.y - otherDot.position.y
				);
				var distance = Math.sqrt(delta.x*delta.x+delta.y*delta.y);
				console.log("Distance:", distance);
				if (distance <= closestDistance
					|| closest == null) {
					closest = dot;
					closestDistance = distance;
				}
			}
			return closest;
		},
	};
};