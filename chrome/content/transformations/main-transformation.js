colorediffsGlobal.transform = function(il, pref) {
	for (var trName in colorediffsGlobal.transformations) {
		il = colorediffsGlobal.transformations[trName].run(il, pref);
	}
	return il;
}
