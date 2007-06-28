//Should be proceeded first
colorediffsGlobal.transformations["escape-html"] = {
	run: function(il) {
		function escapeChunk(chunk) {
			var escapeHTML = function(line) {
				if ( line ) {
					line = colorediffsGlobal.escapeHTML(line);
				}
				return line;
			}

			chunk.raw_code = chunk.code;
			chunk.code = chunk.code.map(escapeHTML);
		}

		il.files.forEach(function(file) {
				file['old'].chunks.forEach(escapeChunk);
				file['new'].chunks.forEach(escapeChunk);
			});
		return il;
	}
};
