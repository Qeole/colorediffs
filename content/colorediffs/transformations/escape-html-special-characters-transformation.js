colorediffsGlobal.transformations.composite.members["escape-html"] = {
	init: function(registrator, pref) {
		registrator.addListener("escape-html", "line", escapeHTML, ["collect-tab-sizes", "make-lines-equal-length", "strip-html"]);

		function escapeHTML(line) {
			if ( line ) {
				line = colorediffsGlobal.escapeHTML(line);
			}
			return line;
		}
	}
};
