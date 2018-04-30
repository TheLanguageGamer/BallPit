function Grid(Game,
	rowCount,
	colCount,
	maxWidth,
	maxHeight,
	upperLeft) {

	var colorCombination = Color.Combination.LoveThese;
	var maxCellSize = Math.min(
		maxHeight/rowCount,
		maxWidth/colCount,
	);
	var width = maxCellSize*colCount;
	var height = maxCellSize*rowCount;
	upperLeft = vector2(
		upperLeft.x + (maxWidth-width)/2.0,
		upperLeft.y + (maxHeight-height)/2.0,
	);

	var cellSize = Math.min(
		height/rowCount,
		width/colCount,
	);
	var margin = 0.1*cellSize
	var radius = (cellSize-margin) / 2.0;

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

	var cells = [];
	var data = [];
	for (var j = 0; j < rowCount; j++) {
		var row = [];
		cells.push(row);
		for (var i = 0; i < colCount; i++) {
			var position = positionForCoordinate(i, j);
			var dot = Game.Dot.create(
				position,
				radius,
				colorCombination[0],
			);
			var cell = {
				i : i,
				j : j,
				dot : dot,
				state : 0, 
			};
			row.push(cell);
			data.push(dot);
		}
	}

	var stateStyleCallback = null;
	function setStateForCell(cell, newState) {
		if (stateStyleCallback) {
			stateStyleCallback(cell, newState);
		} else {
			cell.dot.color = colorCombination[newState];
		}
		//cell.dot.visible = (newState > 0);
		cell.state = newState;
	}

	function matchShapeAt(j0, i0, shape) {
		if (shape.length+j0 > rowCount) {
			return false;
		}
		if (shape[0].length+i0 > colCount) {
			return false;
		}
		for (var j = 0; j < shape.length; j++) {
			for (var i = 0; i < shape[0].length; i++) {
				var state = cells[j0+j][i0+i].state;
				if ((shape[j][i] & (1<<state)) == 1) {
					return false;
				}
			}
		}
		return true;
	}

	function setShapeAt(j0, i0, shape) {
		for (var j = 0; j < shape.length; j++) {
			for (var i = 0; i < shape[0].length; i++) {
				var newState = shape[j][i];
				var cell = cells[j0+j][i0+i];
				setStateForCell(cell, newState);
			}
		}
	}

	function getCount(state) {
		var count = 0;
		for (var j = 0; j < rowCount; j++) {
			for (var i = 0; i < colCount; i++) {
				var cell = cells[j][i];
				if (cell.state == state) {
					count += 1;
				}
			}
		}
		return count;
	}

	return {
		matchShapeAt : matchShapeAt,
		setShapeAt : setShapeAt,
		getCount : getCount,
		setStateForCell : setStateForCell,
		addBackground() {
			data = [];
			var margin = -0.05*cellSize;
			var radius = (cellSize - margin)/2.0;
			for (var j = 0; j < rowCount; j++) {
				for (var i = 0; i < colCount; i++) {
					var position = positionForCoordinate(i, j);
					var bgDot = Game.Dot.create(
						position,
						radius,
						colorCombination[0],
					);
					var cell = cells[j][i];
					cell.bgDot = bgDot;
					data.push(cell.bgDot);
				}
			}
			for (var j = 0; j < rowCount; j++) {
				for (var i = 0; i < colCount; i++) {
					data.push(cells[j][i].dot);
				}
			}
		},
		setCells(cellStates) {
			for (var j = 0; j < rowCount; j++) {
				for (var i = 0; i < colCount; i++) {
					var cell = cells[j][i];
					setStateForCell(cell, cellStates[j][i]);
				}
			}
		},
		transform(fromShape, toShape) {
			for (var j = 0; j < rowCount; j++) {
				for (var i = 0; i < colCount; i++) {
					var matched = matchShapeAt(j, i, fromShape);
					if (matched) {
						setShapeAt(j, i, toShape);
					}
				}
			}
		},
		addSubgrid(j0, i0, cellStates) {
			var subgrid = {};
			for (var j = 0; j < cellStates.length; j++) {
				for (var i = 0; i < cellStates[0].length; i++) {
					var state = cellStates[j][i];
					var cell = cells[j+j0][i+i0];
					setStateForCell(cell, state);
					if (state > 0) {
						subgrid[[j+j0, i+i0]] = state;
					}
				}
			}
			return {
				i : i0,
				j : j0,
				size : Math.max(cellStates.length, cellStates[0].length),
				states : subgrid,
			};
		},
		getSubgrid(j0, i0, width, height) {
			var subgrid = {};
			for (var j = j0; j < j0 + height; j++) {
				for (var i = i0; i < i0 + width; i++) {
					var state = cells[j][i].state;
					if (state > 0) {
						subgrid[[j, i]] = state;
					}
				}
			}
			return {
				i : i0,
				j : j0,
				size : Math.max(width, height),
				states : subgrid,
			};
		},
		rotateSubgrid(subgrid, clockwise = true) {
			var newStates = {};
			for (var key in subgrid.states) {
				var coordinate = JSON.parse("["+key+"]");
				var j = coordinate[0];
				var i = coordinate[1];
				var deltaJ = j - subgrid.j;
				var deltaI = i - subgrid.i;
				var newJ;
				var newI;
				if (clockwise) {
					newJ = subgrid.j + deltaI;
					newI = subgrid.i + (subgrid.size - 1 - deltaJ);
				} else {
					newJ = subgrid.j + (subgrid.size - 1 - deltaI);
					newI = subgrid.i + deltaJ;
				}
				var newState = subgrid.states[key];
				var newCell = cells[newJ][newI];
				setStateForCell(newCell, newState);
				newStates[[newJ, newI]] = newState;
			}
			for (var key in subgrid.states) {
				if (!newStates[key]) {
					var coordinate = JSON.parse("["+key+"]");
					var j = coordinate[0];
					var i = coordinate[1];
					setStateForCell(cells[j][i], 0);
				}
			}
			return {
				j : subgrid.j,
				i : subgrid.i,
				size : subgrid.size,
				states : newStates,
			};
		},
		canRotateSubgrid(subgrid, clockwise = true) {
			for (var key in subgrid.states) {
				var coordinate = JSON.parse("["+key+"]");
				var j = coordinate[0];
				var i = coordinate[1];
				var deltaJ = j - subgrid.j;
				var deltaI = i - subgrid.i;
				var newJ;
				var newI;
				if (clockwise) {
					newJ = subgrid.j + deltaI;
					newI = subgrid.i + (subgrid.size - 1 - deltaJ);
				} else {
					newJ = subgrid.j + (subgrid.size - 1 - deltaI);
					newI = subgrid.i + deltaJ;
				}
				if (newJ < 0 || newI < 0
					|| newJ >= cells.length
					|| newI >= cells[0].length) {
					return false;
				}
				var currentState = cells[newJ][newI].state;
				if (currentState != 0
					&& !subgrid.states[[newJ, newI]]) {
					return false;
				}
			}
			return true;
		},
		moveSubgrid(deltaJ, deltaI, subgrid) {
			var newStates = {};
			for (var key in subgrid.states) {
				var coordinate = JSON.parse("["+key+"]");
				var j = coordinate[0];
				var i = coordinate[1];
				var newJ = j + deltaJ;
				var newI = i + deltaI;
				var newState = subgrid.states[key];
				var newCell = cells[newJ][newI];
				setStateForCell(newCell, newState);
				newStates[[newJ, newI]] = newState;
			}
			for (var key in subgrid.states) {
				if (!newStates[key]){
					var coordinate = JSON.parse("["+key+"]");
					var j = coordinate[0];
					var i = coordinate[1];
					setStateForCell(cells[j][i], 0);
				}
			}
			return {
				j : subgrid.j+deltaJ,
				i : subgrid.i+deltaI,
				size : subgrid.size,
				states : newStates,
			};
		},
		canMoveSubgrid(deltaJ, deltaI, subgrid) {
			for (var key in subgrid.states) {
				var coordinate = JSON.parse("["+key+"]");
				var j = coordinate[0];
				var i = coordinate[1];
				var newJ = j + deltaJ;
				var newI = i + deltaI;
				if (newJ < 0 || newI < 0
					|| newJ >= cells.length
					|| newI >= cells[0].length) {
					return false;
				}
				var currentState = cells[newJ][newI].state;
				if (currentState != 0
					&& !subgrid.states[[newJ, newI]]) {
					return false;
				}
			}
			return true;
		},
		addRandom(state) {
			var count = getCount(0);
			var c = 0;
			var targetC = Math.floor(Math.random()*count);
			console.log("addRandom", count, targetC);
			for (var j = 0; j < rowCount; j++) {
				for (var i = 0; i < colCount; i++) {
					var cell = cells[j][i];
					if (cell.state == 0) {
						if (c == targetC) {
							setStateForCell(cell, state);
							return;
						}
						c += 1;
					}
				}
			}
		},
		getCell(j, i) {
			if (i < 0
				|| j < 0
				|| i >= colCount
				|| j >= rowCount) {
				return null;
			}
			return cells[j][i];
		},
		setStateStyleCallback(callback) {
			stateStyleCallback = callback;
		},
		initialize(dots) {
			Game.Dot.transition(dots, data);
			// for (var c = 0; c < data.length; c++) {
			// 	console.log("data", c, data[c].position, dots[c].position);
			// }
			//console.log("initialize", data.length, dots.length);
			for (var j = 0; j < rowCount; j++) {
				for (var i = 0; i < colCount; i++) {
					var cell = cells[j][i];
					var offset = 0;
					if (cell.bgDot) {
						cell.bgDot = dots[j*colCount + i];
						//cell.bgDot.visible = false;
						offset = rowCount*colCount;
					}
					var idx = offset + j*colCount + i;
					cell.dot = dots[idx];
					//console.log("dot index", offset, idx, dots[idx]);
				}
			}
		}

	};
}