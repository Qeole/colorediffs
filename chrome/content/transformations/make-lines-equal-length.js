colorediffsGlobal.transformations.composite.members["make-lines-equal-length"] = {
	init: function(registrator, pref) {
		if (pref.mode.get() == "side-by-side") {
			registrator.addListener("make-lines-equal-length-init-chunk", "chunk", initChunk);
			registrator.addListener("make-lines-equal-length-calc-pad-length", "line", calcPadLength, ["collect-tab-sizes", "make-lines-equal-length-init-chunk"]);
			registrator.addListener("make-lines-equal-length-sync-pad-length", "chunk-pair", syncPadLength, "make-lines-equal-length-calc-pad-length");
			registrator.addListener("make-lines-equal-length", "line", padLines, "make-lines-equal-length-sync-pad-length");
			registrator.addListener("make-lines-equal-length-close-chunk", "chunk", closeChunk, "make-lines-equal-length");
		}

		function syncPadLength(old_chunk, new_chunk) {
			var maxLength = 0;

			if (old_chunk) {
				maxLength = Math.max(old_chunk.maxLineLength, maxLength);
			}

			if (new_chunk) {
				maxLength = Math.max(new_chunk.maxLineLength, maxLength);
			}
			if (old_chunk) {
				old_chunk.maxLineLength = maxLength;
			}

			if (new_chunk) {
				new_chunk.maxLineLength = maxLength;
			}
		}

		function calcPadLength(line, i, chunk) {
			chunk.maxLineLength = Math.max(countLength(line, chunk.tab_sizes[i]), chunk.maxLineLength);
			return line;
		}

		function initChunk(chunk) {
			chunk.padding = new Array(chunk.code.length + 1);
			chunk.maxLineLength = 0;
			return chunk;
		}

		function padLines(line, i, chunk) {
			var lineLength = countLength(line, chunk.tab_sizes[i]);

			var p = colorediffsGlobal.pad("", chunk.maxLineLength - lineLength);

			if (lineLength + p.length == 0) p = " ";
			chunk.padding[i] = p;
			return line;
		}

		function closeChunk(chunk) {
			chunk.padding[chunk.padding.length - 1] = (colorediffsGlobal.pad("", chunk.maxLineLength)); //used if \No new line at end of file in old and new parts differs
			delete chunk.maxLineLength;
			return chunk;
		}

		function countLength(s, tab_sizes) {
			if (s) {
				var l = s.length;

				if (tab_sizes) {
					for (var i = 0; i < tab_sizes.length; i++) {
						l += tab_sizes[i] - 1;
					}
				}

				return l;
			} else {
				return 0;
			}
		}
	}
};
