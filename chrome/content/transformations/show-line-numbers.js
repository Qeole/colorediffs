colorediffsGlobal.transformations.composite.members["show-line-numbers"] = {
	init: function(registrator, pref) {
		if ( pref.showLineNumbers.get() ) {
			registrator.addListener("show-line-numbers-calc-max-line-number", "chunk-pair", calcMaxLineNumber, "calc-chunk-size");
			registrator.addListener("show-line-numbers-calc-init-chunk", "chunk", initChunk, "show-line-numbers-calc-max-line-number");
			registrator.addListener("show-line-numbers", "line", addLineNumber, ["show-line-numbers-calc-init-chunk"]);
			registrator.addListener("show-line-numbers-close-chunk", "chunk", closeChunk, "show-line-numbers");
		}

		function calcMaxLineNumber(old_chunk, new_chunk) {
			var maxLineNumber = 0;

			if ( old_chunk ) {
				maxLineNumber = old_chunk.line + old_chunk.code_size - 1;
			}

			if ( new_chunk ) {
				maxLineNumber = Math.max(new_chunk.line + new_chunk.code_size - 1, maxLineNumber);
			}

			var charsLength = countCharsLength(maxLineNumber);

			if ( old_chunk ) {
				old_chunk.charsLength = charsLength;
			}

			if ( new_chunk ) {
				new_chunk.charsLength = charsLength;
			}
		}

		function closeChunk(chunk) {
			delete chunk.charsLength;
			delete chunk.local_pad;
			delete chunk.lineNumber;
		}

		function initChunk(chunk) {
			if ( countCharsLength(chunk.line) != chunk.charsLength ) {
				chunk.local_pad = pad;
			} else {
				chunk.local_pad = function(n) { return "" + n; };
			}

			chunk.lineNumber = chunk.line;
			return chunk;
		}

		function addLineNumber(line, i, chunk) {
			if ( line != null ) {
				line = decorate(chunk.local_pad(chunk.lineNumber, chunk.charsLength)) + line;

				chunk.lineNumber++;
			} else if (chunk.padding && chunk.padding[i]) {
				chunk.padding[i] = decoratePadding(colorediffsGlobal.pad("", chunk.charsLength)) + chunk.padding[i];
			}

			return line;
		}

		function decorate(s) {
			return "<span style='border-right:solid 1px;border-left:solid 1px;margin-right:2px;padding-left:1px;padding-right:1px'>" + s + "</span>";
		}

		function decoratePadding(s) {
			return "<span style='margin-right:4px;padding-left:1px;padding-right:1px'>" + s + "</span>";
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
	}
};
