colorediffsGlobal.transformations.composite.members["show-whitespaces"] = {
	init: function(registrator, pref) {
		if (pref.showWhiteSpace.get()) {
			registrator.addListener("show-whitespaces", "line", replaceWhitespaces, ["collect-tab-sizes"]);
		}

		var pref = new colorediffsGlobal.Pref(colorediffsGlobal.getPrefs());

		function replaceWhitespaces(line, index, chunk) {
			var tab_sizes = chunk.tab_sizes[index];
			if ( line ) {
				//replace spaces, but attempt not to replace those within HTML
				//tags: only replace in substrings not within angle brackets
				var split = line.split(/<.*?>/)
				for (s of split) {
					line = line.replace(s, s.replace(/ /g, pref.symbolWhitespace.get()))
				}
				var i = 0;
				line = line.replace(
					/\t/g,
					function() {
						return pref.symbolTab.get() +
							colorediffsGlobal.pad("", tab_sizes[i++] - 1);
					}
				);
			}
			return line;
		}
	}
};
