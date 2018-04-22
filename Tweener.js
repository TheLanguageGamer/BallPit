var Tweener = function() {
	return {
		create(dot, repeating, duration, radius, curve, onComplete) {
			return {
				repeating : repeating,
				duration : duration,
				time : 0.0,
				radius : radius,
				originalRadius : dot.radius,
				curve : curve,
				onComplete : onComplete,
			};
		},
		circle(center, radius, startingAngle = 0) {
			return function(t) {
				angle = t*2*Math.PI+startingAngle;
				return vector2(
					Math.cos(angle)*radius+center.x,
					Math.sin(angle)*radius+center.y,
				);
			};
		},
		line : function(start, end) {
			var delta = vector2(end.x - start.x, end.y - start.y);
			return function(t) {
				t = t > 1.0 ? 1.0 : t;
				return vector2(
					start.x + delta.x*t,
					start.y + delta.y*t
				);
			};
		},
		update(delta, dots) {
			for (var i = 0; i < dots.length; ++i) {
				var dot = dots[i];
				var tween = dot.tween;
				if (!tween) {
					continue;
				}
				tween.time += delta;
				var percent = tween.time/tween.duration;
				if (tween.curve) {
					dot.position = tween.curve(percent);
				}
				dot.radius = (1.0-percent)*tween.originalRadius+percent*tween.radius
				if (tween.time >= tween.duration) {
					if (tween.repeating) {
						tween.time = 0.0;
					} else {
						dot.radius = tween.radius;
						dot.tween = null;
						if (tween.onComplete) {
							tween.onComplete(dot);
						}
					}
				}
			}
		},
	};
};