
function imageDataToPixels(imageData, width, height) {
	var pixels = []
	var row = [];
	for (var i = 0; i < imageData.data.length; i += 4) {
		var pixel = {
			red : imageData.data[i],
			green : imageData.data[i+1],
			blue : imageData.data[i+2],
			alpha : imageData.data[i+3],
		};
		row.push(pixel);
		if (row.length == width) {
			pixels.push(row);
			row = [];
		}
	}
	return {
		pixels : pixels,
		width : imageData.width,
		height : imageData.height,
	}
}

function colorMatch(data, i0, j0, radius) {
	var red = 0;
	var green = 0;
	var blue = 0;
	var alpha = 0;

	var r2 = 0;
	var g2 = 0;
	var b2 = 0;
	var a2 = 0;

	var n = 0;

	for (var i = i0-radius; i < i0+radius; i++) {
		if (i < 0 || i >= data.height) {
			continue;
		}
		for (var j = j0-radius; j < j0+radius; j++) {
			if (j < 0 || j >= data.width) {
				continue;
			}
			var iD = i0-i;
			var jD = j0-j;
			var distance = Math.sqrt(iD*iD+jD*jD);
			if (distance > radius) {
				continue;
			}
			//console.log("Pixel: ", i, j, data.width, data.height);
			var pixel = data.pixels[i][j];

			red += pixel.red;
			green += pixel.green;
			blue += pixel.blue;
			alpha += pixel.alpha;

			r2 += pixel.red*pixel.red;
			g2 += pixel.green*pixel.green;
			b2 += pixel.blue*pixel.blue;
			a2 += pixel.alpha*pixel.alpha;

			n += 1;
		}
	}

	var sd = Math.sqrt(r2/n - red*red/(n*n));
	sd += Math.sqrt(g2/n - green*green/(n*n));
	sd += Math.sqrt(b2/n - blue*blue/(n*n));
	sd += Math.sqrt(a2/n - alpha*alpha/(n*n));
	sd /= 4;
	//console.log("SD:", sd, n, r2, g2, b2, a2, red, green, blue, alpha);

	red = Math.round(red/n);
	green = Math.round(green/n);
	blue = Math.round(blue/n);
	alpha = Math.round(alpha/n);

	return {
		dot : Dot.create(vector2(j0, i0), radius, Color.fromRGBA(red, green, blue, alpha)),
		sd : sd,
	}
}

function findCircles(data) {
	var results = [];
	var minRadius = 10;
	var maxRadius = 20;
	var maxSD = 0;
	for (var i = maxRadius; i < data.height-maxRadius; i++) {
		for (var j = maxRadius; j < data.width-maxRadius; j++) {
			for (var radius = minRadius; radius < maxRadius; radius += 1) {
				var result = colorMatch(data, i, j, radius);
				results.push(result);
				maxSD = Math.max(result.sd, maxSD);
			}
		}
	}
	for (var i = 0; i < results.length; i++) {
		var result = results[i];
		result.score = (1-result.sd/maxSD) + 10*result.dot.color.alpha/255 + result.dot.radius/maxRadius
	}
	results.sort(function(a, b) { return b.score-a.score; });
	var used = [];
	for (var idx = 0; idx < results.length; idx++) {
		var circle = results[idx].dot;
		var shouldAdd = true;
		shouldAdd = shouldAdd && circle.color.alpha > 240;
		for (var jdx = 0; jdx < used.length; jdx++) {
			var other = used[jdx];
			shouldAdd = shouldAdd && !Dot.intersects(circle, other, 1);
		}
		if (shouldAdd) {
			used.push(circle);
		}
	}

	return used;
}

function processFile(file) {

	var img = new Image;
	img.src = URL.createObjectURL(file);
	img.onload = function() {
		console.log("Image: ", img.width, img.height);
		var canvas = document.createElement("canvas");
		document.body.appendChild(canvas);
		canvas.width = img.width;
		canvas.height = img.height;

		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);

		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

		var data = imageDataToPixels(imageData, img.width, img.height);
		var dots = findCircles(data);
		Color.randomize(dots, Color.Combination.Trendy);
		
		ctx.clearRect(0, 0, img.width, img.height);
		// ctx.beginPath();
		// ctx.rect(0, 0, img.width, img.height);
		// ctx.fillStyle = "red";
		// ctx.fill();

		for (var i = 0; i < dots.length; i++) {
			drawDot(ctx, dots[i]);
		}

		var canvas2 = document.createElement("canvas");
		document.body.appendChild(canvas2);
		canvas2.width = img.width;
		canvas2.height = img.height;

		var ctx2 = canvas2.getContext("2d");
		ctx2.drawImage(img, 0, 0);

		var textarea = document.createElement("textarea");
		document.body.appendChild(textarea);
		textarea.innerHTML = JSON.stringify(dots);
	}
}

window.onload = function() {
	var input = document.createElement("input");
	input.type = "file";
	input.multiple = true;
	document.body.appendChild(input);
	input.addEventListener('change', handleFiles);

	function handleFiles(e) {
		for (var i = 0; i < e.target.files.length; i++) {
			processFile(e.target.files[i]);
		}
	}
}
