

function drawDot(ctx, dot) {
	if (dot.visible) {
		ctx.beginPath();
		ctx.arc(dot.position.x, dot.position.y, dot.radius, 0, 2*Math.PI, false);
		ctx.fillStyle = dot.color.style;
		ctx.fill();
		ctx.closePath();
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

	return {
		update(delta, dots) {
			ctx.clearRect(0, 0, cvWidth, cvHeight);

			for (var i = 0; i < dots.length; ++i) {
				drawDot(ctx, dots[i]);
			}
		},
		getCanvas() {
			return canvas;
		},
	};
};