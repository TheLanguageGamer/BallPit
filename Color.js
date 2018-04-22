var Color = (function() {

	function fromRGBA (red, green, blue, alpha) {
		return {
			red : red,
			green : green,
			blue : blue,
			alpha : alpha,
			style : "rgb("+red+", "+green+", "+blue+")",
		};
	}

	function fromHEX(hex) {
		var r = parseInt("0x"+hex.substring(1, 3));
		var g = parseInt("0x"+hex.substring(3, 5));
		var b = parseInt("0x"+hex.substring(5, 7));

		return fromRGBA(r, g, b, 255);
	}

	return {
		fromRGBA : fromRGBA,
		fromHEX : fromHEX,
		Combination : {
			Trendy : [
				fromHEX("#488a99"),
				fromHEX("#dbae58"),
				fromHEX("#fbe9e7"),
				fromHEX("#b4b4b4"),
			],
			Smoky : [
				fromHEX("#e99787"),
				fromHEX("#eed8c9"),
				fromHEX("#727077"),
				fromHEX("#a49592"),
			],
			Kitchen : [
				fromHEX("#b3dbc0"),
				fromHEX("#fe0000"),
				fromHEX("#67baca"),
			],
			Painterly : [
				fromHEX("#061283"),
				fromHEX("#fd3c3c"),
				fromHEX("#ffb74c"),
				fromHEX("#138d90"),
			],
			School : [
				fromHEX("#81715e"),
				fromHEX("#faae3d"),
				fromHEX("#e38533"),
				fromHEX("#e4535e"),
			],
			Impact : [
				fromHEX("#0f1f38"),
				fromHEX("#8e7970"),
				fromHEX("#f55449"),
				fromHEX("#1b4b5a"),
			],
			Cheerful : [
				fromHEX("#ffbebd"),
				fromHEX("#fcfcfa"),
				fromHEX("#337bae"),
				fromHEX("#1a405f"),
			],
			Technology : [
				fromHEX("#fbcd4b"),
				fromHEX("#a3a599"),
				fromHEX("#282623"),
				fromHEX("#88a550"),
			],
			Nightlife : [
				fromHEX("#00cffa"),
				fromHEX("#ff0038"),
				fromHEX("#ffce38"),
				fromHEX("#020509"),
			],
			PoolParty : [
				fromHEX("#344d90"),
				fromHEX("#5cc5ef"),
				fromHEX("#ffb745"),
				fromHEX("#e7552c"),
			],
		},
		WHITE : fromRGBA(255, 255, 255, 255),
		BLACK : fromRGBA(0, 0, 0, 255),
		randomize : function(dots, combination) {
			for (var i = 0; i < dots.length; i++) {
				var idx = Math.floor(Math.random()*combination.length);
				dots[i].color = combination[idx];
			}
		},
	};
})();