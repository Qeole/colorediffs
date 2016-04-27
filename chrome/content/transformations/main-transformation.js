colorediffsGlobal.transform = function(il, pref) {
	for each (var tr in colorediffsGlobal.transformations) {
		il = tr.run(il, pref);
	}
	return il;
}
