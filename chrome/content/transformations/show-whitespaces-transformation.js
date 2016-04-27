colorediffsGlobal.transformations.composite.members["show-whitespaces"] = {
	init: function(registrator, pref) {
		if (pref.showWhiteSpace.get()) {
			registrator.addListener("show-whitespaces", "line", replaceWhitespaces, ["collect-tab-sizes"]);
		}

		function replaceWhitespaces(line, index, chunk) {
			var tab_sizes = chunk.tab_sizes[index];
			if ( line ) {
				line = line.replace(" ", "&middot;", "g");
				var i = 0;
				line = line.replace(
					"\t",
					function() {
						return "&raquo;" + colorediffsGlobal.pad("", tab_sizes[i++] - 1);
					},
					"g"
				);
			}
			return line;
		}
	}
};
