var TetrisGUI = function() {

	var topDiv = document.createElement("div");
	topDiv.style.position = "absolute";
	topDiv.style.right = "20px";
	topDiv.style.top = "20px";
	topDiv.style.fontFamily = "monospace";

	var scoreLabelDiv = document.createElement("div");
	scoreLabelDiv.innerHTML = "SCORE";

	var scoreDiv = document.createElement("div");
	scoreDiv.innerHTML = "0";
	
	var levelLabelDiv = document.createElement("div");
	levelLabelDiv.innerHTML = "LEVEL";

	var levelDiv = document.createElement("div");
	levelDiv.innerHTML = "1";

	var linesLabelDiv = document.createElement("div");
	linesLabelDiv.innerHTML = "LINES";

	var linesDiv = document.createElement("div");
	linesDiv.innerHTML = "0";

	topDiv.appendChild(scoreLabelDiv);
	topDiv.appendChild(scoreDiv);
	topDiv.appendChild(levelLabelDiv);
	topDiv.appendChild(levelDiv);
	topDiv.appendChild(linesLabelDiv);
	topDiv.appendChild(linesDiv);

	document.body.appendChild(topDiv);

	return {
		setScore(score) {
			scoreDiv.innerHTML = score;
		},
		setLevel(level) {
			levelDiv.innerHTML = level;
		},
		setLines(lines) {
			linesDiv.innerHTML = lines;
		},
	};
}