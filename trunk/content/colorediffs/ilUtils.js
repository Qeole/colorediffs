colorediffsGlobal.ilUtils = {
	calcLineCounts : function (arr) {
		return colorediffsGlobal.fold(arr, function(el, i) {return i + ((el != null)?1:0);}, 0);
	}
};
