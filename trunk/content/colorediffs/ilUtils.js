colorediffsGlobal.ilUtils = {
	calcLineCounts: function (arr) {
		return colorediffsGlobal.fold(arr, function(el, i) {return i + ((el != null)?1:0);}, 0);
	},

	chunksMap: function (file, func) {
		var result = [];
		for (var i = 0; i < file['new'].chunks.length; i++) {
			result.push(func(file['old'].chunks[i], file['new'].chunks[i]));
		}

		return result;
	}
};
