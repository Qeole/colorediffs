colorediffsGlobal.transformations.composite.members["show-line-numbers"] = {
	init: function(registrator, pref) {
		if ( pref.showLineNumbers.get() ) {
			registrator.addFileAfterListener(0, addLineNumbersToFile);
		}

		function addLineNumbersToFile(file) {
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

				addLineNumbers(old_chunk, new_chunk);
			}

			return file;
		}

		function addLineNumbers(old_chunk, new_chunk) {
			var maxLength = 0;

			//calc max length
			if ( old_chunk ) {
				maxLineNumber = countMaxLineNumber(old_chunk.code, old_chunk.line);
			}

			if ( new_chunk ) {
				maxLineNumber = Math.max(countMaxLineNumber(new_chunk.code, new_chunk.line), maxLineNumber);
			}

			var charsLength = countCharsLength(maxLineNumber);

			//pad lines
			if ( old_chunk ) {
				addLineNumberToLines(old_chunk.code, old_chunk.line, charsLength);
			}

			if ( new_chunk ) {
				addLineNumberToLines(new_chunk.code, new_chunk.line, charsLength);
			}

			function countMaxLineNumber(code, line) {
				var lineNumber = line;

				for ( var i = 0; i < code.length; i++ ) {
					if ( code[i] != null ) {
						lineNumber++;
					}
				}

				return lineNumber;
			}

			//works for numbers > 0 only
			function countCharsLength(n) {
				var c = 1;
				while( (n = Math.floor(n / 10)) > 0 ) { c++; }
				return c;
			}

			function pad(n, length) {
				var s = "" + n;
				var nLength = countCharsLength(n);
				while ( nLength < length ) {
					s = "&nbsp;" + s;
					nLength++;
				}

				return s;
			}

			function addLineNumberToLines(code, line, charsLength) {
				var local_pad;

				if ( countCharsLength(line) != charsLength ) {
					local_pad = pad;
				} else {
					local_pad = function(n) { return "" + n; }
				}

				var lineNumber = line;
				for ( var i = 0; i < code.length; i++ ) {
					if ( code[i] != null ) {
						code[i] = "<span style='border-right:solid 1px;border-left:solid 1px'>" + local_pad(lineNumber, charsLength) + "</span>" + code[i];

						lineNumber++;
					}
				}
			}
		}
	}
};
