colorediffsGlobal.transform = function(il) {
	return colorediffsGlobal.transformations.fold(function(trasnformation, il) {
			return transformation.run(il);
		},
		il);
}
