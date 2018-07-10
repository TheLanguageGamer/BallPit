
function drawCircle(ctx, circle) {	
	ctx.globalAlpha = circle.alpha;
	ctx.beginPath();
	ctx.arc(circle.position.x, circle.position.y, circle.radius, 0, 2*Math.PI, false);
	ctx.fillStyle = circle.color.style;
	ctx.fill();
	ctx.closePath();
	if (circle.letter) {
		var l = circle.letter.length;
		var size = circle.radius*1.6/l;
		var x = circle.position.x-circle.radius*0.5;
		var y = circle.position.y+circle.radius*(1.0/(2*l));
		if (circle.letterOffset) {
			x += circle.letterOffset.x;
			y += circle.letterOffset.y;
		}
		ctx.font = Math.round(size)+"px monospace";
		ctx.fillStyle = Color.BLACK.style;
		ctx.fillText(circle.letter, x, y);
	}
}

function drawPath(ctx, path) {
	ctx.beginPath();
	ctx.strokeStyle = path.stroke.style;
	ctx.lineWidth = path.width;
	var currentX = 0;
	var currentY = 0;
	var controlX = 0;
	var controlY = 0;
	for (var i = 0; i < path.moves.length; i++) {
		var move = path.moves[i];
		switch (move[0]) {
			case 'm':
				currentX += move[1];
				currentY += move[2];
				ctx.moveTo(currentX, currentY);
				break;
			case 'M':
				currentX = move[1];
				currentY = move[2];
				ctx.moveTo(currentX, currentY);
				break;
			case 'l':
				currentX += move[1];
				currentY += move[2];
				ctx.lineTo(currentX, currentY);
				break;
			case 'L':
				currentX = move[1];
				currentY = move[2];
				ctx.lineTo(currentX, currentY);
				break;
			case 'c':
				controlX = currentX + move[3];
				controlY = currentY + move[4];
				ctx.bezierCurveTo(
					currentX + move[1], currentY + move[2],
					controlX, controlY,
					currentX + move[5], currentY + move[6]
				);
				currentX += move[5];
				currentY += move[6];
				break;
			case 'C':
				ctx.bezierCurveTo(
					move[1], move[2],
					move[3], move[4],
					move[5], move[6]
				);
				controlX = move[3];
				controlY = move[4];
				currentX = move[5];
				currentY = move[6];
				break;
			case 's':
				var deltaX = controlX-currentX;
				var deltaY = controlY-currentY;
				var reflectedX = currentX - deltaX;
				var reflectedY = currentY - deltaY;
				ctx.bezierCurveTo(
					reflectedX, reflectedY,
					currentX + move[1], currentY + move[2],
					currentX + move[3], currentY + move[4]
				);
				controlX = currentX + move[1];
				controlY = currentY + move[2];
				currentX += move[3];
				currentY += move[4];
				break;
			case 'S':
				var deltaX = controlX-currentX;
				var deltaY = controlY-currentY;
				var reflectedX = currentX - deltaX;
				var reflectedY = currentY - deltaY;
				ctx.bezierCurveTo(
					reflectedX, reflectedY,
					move[1], move[2],
					move[3], move[4]
				);
				controlX = move[1];
				controlY = move[2];
				currentX = move[3];
				currentY = move[4];
				break;
			default:
				break;
		}
	}
	ctx.stroke();
	ctx.closePath();
}

function drawShape(ctx, shape) {
	if (shape.visible) {
		switch (shape.type) {
			case Shape.CIRCLE:
				drawCircle(ctx, shape);
				break;
			case Shape.PATH:
				drawPath(ctx, shape);
				break;
			default:
				break;
		}
	}
}

var Renderer = function() {
	var cvWidth = window.innerWidth - 20;
	var cvHeight = window.innerHeight - 20;
	var canvas = document.createElement("canvas");
	document.body.appendChild(canvas);
	canvas.width = cvWidth;
	canvas.height = cvHeight;

	var ctx = canvas.getContext("2d")

	var backgroundColor = null;

	return {
		update(delta, shapes) {
			if (backgroundColor) {
				ctx.fillStyle = backgroundColor.style;
				ctx.fillRect(0, 0, cvWidth, cvHeight);
			} else {
				ctx.clearRect(0, 0, cvWidth, cvHeight);
			}

			for (var i = 0; i < shapes.length; ++i) {
				drawShape(ctx, shapes[i]);
			}
		},
		getCanvas() {
			return canvas;
		},
		setBackgroundColor(color) {
			backgroundColor = color;
		},
	};
};