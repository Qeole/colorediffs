colorediffsGlobal.transformations.composite.members["escape-html"] = {
	init: function(registrator, pref) {
		function escapeHTML(line) {
			if ( line ) {
				line = colorediffsGlobal.escapeHTML(line);
			}
			return line;
		}

		registrator.addLineListener(1, escapeHTML);
	}
};
