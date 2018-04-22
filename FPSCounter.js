var FPSCounter = function() {

	var fpsDiv = document.createElement("div");
	fpsDiv.style.position = "absolute";
	fpsDiv.style.bottom = 0;
	fpsDiv.style.left = 0;
	document.body.appendChild(fpsDiv);
	var fps = 0.0;
	var count = 0;
	var totalTime = 0.0;

	return {
		update: function(delta) {
			totalTime += delta;
			count += 1;

			fps = 1000 * count / totalTime;
			fpsDiv.innerHTML = delta;
		}
	};
};