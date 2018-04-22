function Grid(rowCount, colCount, maxWidth, maxHeight, upperLeft) {
	var cellSize = Math.min(
		maxHeight/rowCount,
		maxWidth/colCount,
	);
	var radius = cellSize / 2.0;
	var width = cellSize*colCount;
	var height = cellSize*rowCount;
	upperLeft = vector2(
		upperLeft.x + (maxWidth-width)/2.0,
		upperLeft.y + (maxHeight-height)/2.0,
	);

	var cells = [];
	for (var j = 0; j < rowCount; j++) {
		var row = [];
		cellSize.push(row);
		for (var i = 0; i < colCount; i++) {
			var cell = {
				i : i,
				j : j,
				dot : null,
			};
			row.push(cell);
		}
	}

	function positionForCoordinate(i, j) {
		return vector2(
			cellSize*i + radius + upperLeft.x,
			cellSize*j + radius + upperLeft.y,
		);
	}
	function coordinateForPosition(position) {
		var i = (position.x - radius - upperLeft.x)/cellSize;
		var j = (position.y - radius - upperLeft.y)/cellSize;
		return {
			i : Math.round(i),
			j : Math.round(j),
		};
	}
	return {

	};
}