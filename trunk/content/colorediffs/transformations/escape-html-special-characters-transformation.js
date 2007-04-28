//Should be proceeded first
colorediffsGlobal.transformations.unshift({
	run: function(il) {
			il.files.forEach(function(file) {
					file.chunks.forEach(function(chunk) {
							var escapeHTML = function(line) {
								if ( line ) {
									line = colorediffsGlobal.escapeHTML(line);
								}
								return line;
							}

							chunk['old'].code = chunk['old'].code.map(escapeHTML);
							chunk['new'].code = chunk['new'].code.map(escapeHTML);
						});
				});
		}

		return il;
	}
});
