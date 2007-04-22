if (!colorediffsGlobal) {
	var colorediffsGlobal = {}
}

colorediffsGlobal.transformations.push({
	run: function(il) {
		if (colorediffsGlobal.showWhiteSpace.get()) {
			il.files.forEach(function(file) {
					file.chunks.forEach(function(chunk) {
							var replaceWhitespaces = function(line) {
								line = line.replace(/ /g, "&middot;");
								line = line.replace(/\t/g, "&raquo;	  ");
								return line;
							}

							chunk.old.code = chunk.old.code.map(replaceWhitespaces);
							chunk.new.code = chunk.new.code.map(replaceWhitespaces);
						});
				});
		}

		return il;
	}
});
