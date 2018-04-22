

function drawDot(ctx, dot) {
	if (dot.visible) {
		ctx.beginPath();
		ctx.arc(dot.position.x, dot.position.y, dot.radius, 0, 2*Math.PI, false);
		ctx.fillStyle = dot.color.style;
		ctx.fill();
		ctx.closePath();
		if (dot.letter) {
			ctx.font = Math.round(dot.radius*1.6)+"px monospace";
			ctx.fillStyle = Color.BLACK.style;
			ctx.fillText(dot.letter,
				dot.position.x-dot.radius*0.5,
				dot.position.y+dot.radius*0.5
			);
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