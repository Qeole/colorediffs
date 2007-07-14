colorediffsGlobal.transformations.composite.members["calc-chunk-size"] = {
	init: function(registrator, pref) {

		registrator.addListener("calc-chunk-size-init-chunk", "chunk", initChunk);
		registrator.addListener("calc-chunk-size", "line", sumLine, ["calc-chunk-size-init-chunk", "select-old-new-files"]);

		function initChunk(chunk) {
			chunk.code_size = 0;
			return chunk;
		}

		function sumLine(line, i, chunk) {
			if (line != null) {
				chunk.code_size++;
			}
			return line;
		}
	}
};
