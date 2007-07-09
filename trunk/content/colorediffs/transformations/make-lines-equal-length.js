colorediffsGlobal.transformations.composite.members["make-lines-equal-length"] = {
	init: function(registrator, pref) {
		if (pref.mode.get() == "side-by-side") {
			registrator.addFileListener(0, padLinesInFile);
		}

		function countLength(s) {
			if (s) {
				var offsetCorrector = 0;
				return s.replace(
					"\t",
					function(str, offset) {
						var a = "".pad(colorediffsGlobal.tabWidth - (offset + offsetCorrector) % colorediffsGlobal.tabWidth);
						offsetCorrector += colorediffsGlobal.tabWidth - (offset + offsetCorrector) % colorediffsGlobal.tabWidth - 1;
						return a;
					},
					"g"
				).length;
			} else {
				return 0;
			}
		}

		function padLinesInFile(file) {
			var l = 0;

			if ( file['old'] && file['old'].chunks ) {
				l = file['old'].chunks.length;
			} else if ( file['new'] && file['new'].chunks ) {
				l = file['new'].chunks.length;
			}

			for (var i = 0; i < l; i++) {
				var old_chunk = null;
				var new_chunk = null;

				if ( file['old'] && file['old'].chunks ) {
					old_chunk = file['old'].chunks[i];
				}

				if ( file['new'] && file['new'].chunks ) {
					new_chunk = file['new'].chunks[i];
				}

				padLines(old_chunk, new_chunk);
			}

			return file;
		}

		function padLines(old_chunk, new_chunk) {
			var maxLength = 0;

			//calc max length
			if ( old_chunk ) {
				maxLength = colorediffsGlobal.fold(old_chunk.code, compareLength, maxLength);
			}

			if ( new_chunk ) {
				maxLength = colorediffsGlobal.fold(new_chunk.code, compareLength, maxLength);
			}

			//pad lines
			if ( old_chunk ) {
				old_chunk.padding = pad(old_chunk.code, maxLength);
			}

			if ( new_chunk ) {
				new_chunk.padding = pad(new_chunk.code, maxLength);
			}

			function compareLength(s, l) {
				return Math.max(countLength(s), l);
			}

			function pad(code, maxLength) {
				var padding = [];
				var length = code.length;

				for (var i = 0; i < length; i++) {
					var lineLength = countLength(code[i]);

					var p = "".pad(maxLength - lineLength);

					if (lineLength + p.length == 0) p = " ";
					padding.push(p);
				}

				return padding;
			}
		}
	}
};
