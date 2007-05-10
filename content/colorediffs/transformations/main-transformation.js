colorediffsGlobal.transform = function(il, pref) {
	return colorediffsGlobal.fold(colorediffsGlobal.transformations, function(transformation, il) {
			return transformation.run(il, pref);
		},
		il);
}
