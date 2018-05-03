var Color = (function() {

	function fromRGBA (red, green, blue, alpha) {
		return {
			red : red,
			green : green,
			blue : blue,
			alpha : alpha,
			style : "rgba("+red+", "+green+", "+blue+")",
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
				fromHEX("#8e7970"),
				fromHEX("#0f1f38"),
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
			LoveThese : [
				fromHEX("#f5f5f5"),
				fromRGBA(234, 132, 44, 255),
				fromRGBA(124, 13, 69, 255),
				fromRGBA(127, 0, 32, 255),
				fromRGBA(249, 28, 97, 255),
				fromRGBA(71, 103, 145, 255),
				fromRGBA(0, 12, 165, 255),
				fromRGBA(144, 212, 225, 255),
				fromRGBA(214, 167, 198, 255),
				fromRGBA(188, 255, 165, 255),
			],
			MountainSunset : [
				fromRGBA(255, 229, 220, 255),
				fromRGBA(199, 33, 62, 255),
				fromRGBA(124, 35, 39, 255),
				fromRGBA(126, 69, 85, 255),
				fromRGBA(34, 34, 34, 255),
				fromRGBA(76, 109, 174, 255),
				fromRGBA(10, 80, 155, 255),
				fromRGBA(55, 37, 68, 255),
				fromRGBA(240, 176, 171, 255),
			],
		},
		WHITE : fromRGBA(255, 255, 255, 255),
		BLACK : fromRGBA(0, 0, 0, 255),
		NCS_YELLOW : fromHEX("#FFD300"),
		NCS_GREEN : fromHEX("#009F6B"),
		NCS_BLUE : fromHEX("#0087BD"),
		NCS_RED : fromHEX("#C40233"),
		randomize : function(dots, combination) {
			for (var i = 0; i < dots.length; i++) {
				var idx = Math.floor(Math.random()*combination.length);
				dots[i].color = combination[idx];
			}
		},
	};
})();