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
			var l = file['old'].chunks.length;

			for (var i = 0; i < l; i++) {
				padLines(file['old'].chunks[i], file['new'].chunks[i]);
			}

			return file;
		}

		function padLines(old_chunk, new_chunk) {
			var old_code = old_chunk.code;
			var new_code = new_chunk.code;

			var old_padding = old_chunk.padding = [];
			var new_padding = new_chunk.padding = [];

			var length = old_code.length;

			for (var i = 0; i < length; i++) {
				var oldLineLength = countLength(old_code[i]);
				var newLineLength = countLength(new_code[i]);

				var maxLength = Math.max(oldLineLength, newLineLength);

				var paddingOld = "".pad(maxLength - oldLineLength);
				var paddingNew = "".pad(maxLength - newLineLength);

				old_padding[i] = paddingOld;
				new_padding[i] = paddingNew;

				if (oldLineLength + old_padding[i].length == 0) old_padding[i] = " ";
				if (newLineLength + new_padding[i].length == 0) new_padding[i] = " ";
			}
		}
	}
};
