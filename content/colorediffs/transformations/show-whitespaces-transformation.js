colorediffsGlobal.transformations["show-whitespaces"] = {
	run: function(il, pref) {
		function replaceWhitespaces(line, i) {
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

		function replaceWhitespacesInChunk(chunk) {
			chunk.code = chunk.code.map(replaceWhitespaces);
		}

		if (pref.showWhiteSpace.get()) {
			il.files.forEach(function(file) {
					file['old'].chunks.forEach(replaceWhitespacesInChunk);
					file['new'].chunks.forEach(replaceWhitespacesInChunk);
			});
		}

		return il;
	}
};
