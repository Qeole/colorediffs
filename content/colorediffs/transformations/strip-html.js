colorediffsGlobal.transformations.composite.members["strip-html"] = {
	init: function(registrator, pref) {
		registrator.addListener("strip-html", "line", stripHTML);

		function stripHTML(line) {
			if ( line ) {
				line = colorediffsGlobal.htmlToPlainText(line);
			}
			return line;
		}
	}
};
