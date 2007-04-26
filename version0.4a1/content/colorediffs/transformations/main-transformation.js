colorediffsGlobal.transform = function(il) {
	return colorediffsGlobal.fold(colorediffsGlobal.transformations, function(transformation, il) {
			return transformation.run(il);
		},
		il);
}
