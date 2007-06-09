colorediffsGlobal.transformations["show-whitespaces"] = {
	run: function(il, pref) {
		if (pref.showWhiteSpace.get()) {
			il.files.forEach(function(file) {
				file.chunks.forEach(function(chunk) {
					var replaceWhitespaces = function(line, i) {
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

					chunk['old'].code = chunk['old'].code.map(replaceWhitespaces);
					chunk['new'].code = chunk['new'].code.map(replaceWhitespaces);
				});
			});
		}

		return il;
	}
};
