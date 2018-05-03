

function drawDot(ctx, dot) {
	if (dot.visible) {
		ctx.globalAlpha = dot.alpha;
		ctx.beginPath();
		ctx.arc(dot.position.x, dot.position.y, dot.radius, 0, 2*Math.PI, false);
		ctx.fillStyle = dot.color.style;
		ctx.fill();
		ctx.closePath();
		if (dot.letter) {
			var l = dot.letter.length;
			var size = dot.radius*1.6/l;
			var x = dot.position.x-dot.radius*0.5;
			var y = dot.position.y+dot.radius*(1.0/(2*l));
			if (dot.letterOffset) {
				x += dot.letterOffset.x;
				y += dot.letterOffset.y;
			}
			ctx.font = Math.round(size)+"px monospace";
			ctx.fillStyle = Color.BLACK.style;
			ctx.fillText(dot.letter, x, y);
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
		update(delta, dots) {
			if (backgroundColor) {
				ctx.fillStyle = backgroundColor.style;
				ctx.fillRect(0, 0, cvWidth, cvHeight);
			} else {
				ctx.clearRect(0, 0, cvWidth, cvHeight);
			}

			for (var i = 0; i < dots.length; ++i) {
				drawDot(ctx, dots[i]);
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