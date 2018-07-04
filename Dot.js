var Dot = function(Tweener) {
	function boundingRect(dots) {
		var min = vector2(
			10000,
			10000
		);
		var max = vector2(
			-10000,
			-10000
		);
		for (var i = 0; i < dots.length; i++) {
			if (!dots[i].visible) {
				continue;
			}
			min.x = dots[i].position.x < min.x ? dots[i].position.x : min.x;
			min.y = dots[i].position.y < min.y ? dots[i].position.y : min.y;
			max.x = dots[i].position.x > max.x ? dots[i].position.x : max.x;
			max.y = dots[i].position.y > max.y ? dots[i].position.y : max.y;
		}
		return {
			min,
			max,
		};
	}

	function translate(dots, delta) {
		for (var i = 0; i < dots.length; i++) {
			var dot = dots[i];
			dot.position = vector2(
				dot.position.x + delta.x,
				dot.position.y + delta.y
			);
		}
	}

	return {
		create : function(position, radius, color) {
			return {
				position : position,
				radius : radius,
				color : color,
				visible : true,
				alpha : 1.0,
				velocity : vector2(0, 0),
				destination : position,
			};
		},
		intersects : function(a, b, buffer = 0.0) {
			var x = a.position.x-b.position.x;
			var y = a.position.y-b.position.y;
			var distance = Math.sqrt(x*x+y*y);
			return distance < a.radius+b.radius+buffer;
		},
		boundingRect : boundingRect,
		translate : translate,
		center : function(dots, rect) {
			var bounding = boundingRect(dots);
			console.log("Bounding: ", bounding.min.x, bounding.min.y, bounding.max.x, bounding.max.y);
			var delta = vector2(
				((rect.max.x - bounding.max.x) - (bounding.min.x - rect.min.x))/2.0,
				((rect.max.y - bounding.max.y) - (bounding.min.y - rect.min.y))/2.0,
			);
			translate(dots, delta);
		},
		flipHorizontal : function(dots, reverse) {
			var bounding = boundingRect(dots);
			var width = bounding.max.x - bounding.min.x;
			for (var i = 0; i < dots.length; i++) {
				var dot = reverse ? dots[dots.length-i-1] : dots[i];
				var newPosition = vector2(
					bounding.min.x + width - (dot.position.x - bounding.min.x),
					dot.position.y,
				);
				dot.tween = Tweener.create(
					dot, false, 500.0, dot.radius,
					Tweener.line(dot.position, newPosition)
				);
			}
		},
		flipVertical : function(dots, reverse) {
			var bounding = boundingRect(dots);
			var height = bounding.max.y - bounding.min.y;
			for (var i = 0; i < dots.length; i++) {
				var dot = reverse ? dots[dots.length-i-1] : dots[i];
				var newPosition = vector2(
					dot.position.x,
					bounding.min.y + height - (dot.position.y - bounding.min.y),
				);
				dot.tween = Tweener.create(
					dot, false, 500.0, dot.radius,
					Tweener.line(dot.position, newPosition),
				);
			}
		},
		fade : function(dots, alpha) {
			for (var i = 0; i < dots.length; i++) {
				dots[i].alpha = alpha;
			}
		},
		rotate : function(dots) {
			var bounding = boundingRect(dots);
			var width = bounding.max.x - bounding.min.x;
			var height = bounding.max.y - bounding.min.y;
			var center = vector2(
				bounding.min.x + width/2.0,
				bounding.min.y + width/2.0,
			);
			for (var i = 0; i < dots.length; i++) {
				var dot = dots[i];
				var delta = vector2(
					dot.position.x - center.x,
					dot.position.y - center.y,
				);
				var distance = Math.sqrt(delta.x*delta.x+delta.y*delta.y);				
				var base = vector2(
					distance,
					0,
				);
				var angle = Math.atan2(
					base.x*delta.y - base.y*delta.x,
					base.x*delta.x + base.y*delta.y,
				);
				dot.tween = Tweener.create(
					dot,
					true,
					20000.0,
					dot.radius,
					Tweener.circle(center, distance, angle),
				);
			}
		},
		wiggle : function(dots, center) {
			for (var i = 0; i < dots.length; i++) {
				var dot = dots[i];
				var radius = 30+10*Math.random();
				var position = vector2(
					dot.position.x - radius,
					dot.position.y
				);
				dot.tween = Tweener.create(
					dot,
					true,
					1300+300.0*Math.random(),
					dot.radius,
					Tweener.circle(position, radius),
				);
			}
		},
		transition : function(dots, data) {
			for (var i = 0; i < dots.length; i++) {
				var dot = dots[i];
				dot.velocity = data[i].velocity;
				if (i >= data.length) {
					dot.tween = Tweener.create(
						dot,
						false,
						500.0,
						0,
						null,
						function(dot) {
							dot.visible = false;
						},
					);
				} else {
					dot.visible = true;
					dot.tween = Tweener.create(
						dot,
						false,
						500.0,
						data[i].radius,
						Tweener.line(dot.position, data[i].position),
					);
				}
			}
			for (var i = dots.length; i < data.length; i++) {
				var dot = JSON.parse(JSON.stringify(data[i]));
				dot.velocity = data[i].velocity;
				var radiusTarget = dot.radius;
				dot.radius = 0;
				dot.tween = Tweener.create(
					dot,
					false,
					500.0,
					radiusTarget,
				);
				dots.push(dot);
			}
		},
	};
};





