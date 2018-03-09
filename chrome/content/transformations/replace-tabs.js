colorediffsGlobal.transformations.composite.members["replace-tabs"] = {
	init: function(registrator, pref) {
		if ( (pref.showLineNumbers.get() || pref.tabSize.get() != 8) && !pref.showWhiteSpace.get()) {
			registrator.addListener("replace-tabs", "line", replaceTabs, ["show-line-numbers", "show-whitespaces", "calc-tab-sizes"]);
		}

		function replaceTabs(line, index, chunk) {
			var tab_sizes = chunk.tab_sizes[index];
			if ( line ) {
				var i = 0;
				line = line.replace(
					/\t/g,
					function() {
						return colorediffsGlobal.pad("", tab_sizes[i++]);
					}
				);

			}
			return line;
		}
	}
};
