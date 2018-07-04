var ShapeMaker = function(Dot) {
	return {
		line(color, margin, radius, start, end) {
			var size = radius+margin;
			var dots = [];
			var deltaX = end.x - start.x;
			var deltaY = end.y - start.y;
			var magnitude = Math.sqrt(deltaX*deltaX+deltaY*deltaY);
			var count = Math.floor(magnitude/(size*2.0))+1.0;
			var spacing = magnitude/(count-1.0);
			for (var i = 0; i < count; i++) {
				var position = vector2(
					start.x + deltaX*i/count,
					start.y + deltaY*i/count,
				);
				var dot = Dot.create(position, radius, color);
				dots.push(dot);
			}
			return {
				dots : dots,
				start : start,
				end : end,
			};
		},
	};
};