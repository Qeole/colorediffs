colorediffsGlobal.transformations.composite.members["collect-tab-sizes"] = {
	init: function(registrator, pref) {
		if (pref.mode.get() == "side-by-side" || pref.tabSize.get() != 8 || pref.showWhiteSpace.get() || pref.showLineNumbers.get()) {
			registrator.addListener("collect-tab-sizes-init-chunk", "chunk", initChunk);
			registrator.addListener("collect-tab-sizes", "line", collectTabSizes, "collect-tab-sizes-init-chunk");
		}

		function initChunk(chunk) {
			chunk.tab_sizes = new Array(chunk.code.length);
			return chunk;
		}

		function collectTabSizes(line, i, chunk) {
			chunk.tab_sizes[i] = calcTabSizes(line);

			return line;
		}

		function calcTabSizes(s) {
			if (s) {
				var offsetCorrector = 0;
				var tab_sizes = [];
				var i = -1;
				while ((i = s.indexOf("\t", i + 1)) != -1) {
					var l = pref.tabSize.get() - (i + offsetCorrector) % pref.tabSize.get();
					tab_sizes.push(l);
					offsetCorrector += l - 1;
				}

				if (tab_sizes.length == 0) {
					return null;
				} else {
					return tab_sizes;
				}
			} else {
				return null;
			}
		}
	}
};
