colorediffsGlobal.transformations.composite.members["show-whitespaces"] = {
	init: function(registrator, pref) {
		if (pref.showWhiteSpace.get()) {
			registrator.addLineListener(2, replaceWhitespaces);
		}

		function replaceWhitespaces(line) {
			if ( line ) {
				line = line.replace(" ", "&middot;", "g");
				var offsetCorrector = 0;
				line = line.replace(
					"\t",
					function(str, offset) {
						var a = ((offset + offsetCorrector) % colorediffsGlobal.tabWidth == colorediffsGlobal.tabWidth - 1)?"":"\t";
						offsetCorrector += colorediffsGlobal.tabWidth - (offset + offsetCorrector) % colorediffsGlobal.tabWidth - 1;
						return "&raquo;" + a;
					},
					"g"
				);
			}
			return line;
		}
	}
};
