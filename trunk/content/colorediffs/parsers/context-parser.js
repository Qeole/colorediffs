colorediffsGlobal.parsers["context"] = {
	parse:function(text) {
		var parseFile = function(title, code) {
			var parseChunk = function(code) {
				var chunk = {};
				chunk['old'] = {};
				chunk['new'] = {};

				var parts = code.split(/^(?:\*|\-){3}\s+(\d+)\,\d+\s+(?:\*|\-){4}$/m);

				//parts[0] is "\n"
				// parts[1] is line number of old code
				// parts[2] is either old code or "\n"
				// parts[3] is line number of new code
				// parts[4] is new code

				chunk['new'].line = Number(parts[3]);
				chunk['old'].line = Number(parts[1]);

				//split code
				chunk['old'].code = [];
				chunk['new'].code = [];

				var processSteadyParts = function(oldCodeString, newCodeString) {
					var i=0, j=0;

					var oldCode = [];
					var newCode = [];

					var oldLines = oldCodeString.trim("\n").split("\n");
					var newLines = newCodeString.trim("\n").split("\n");

					while ( i < oldLines.length || j < newLines.length ) {
						if (/^\-(.*)$/.test(oldLines[i])) {
							oldCode.push(oldLines[i].substring(2));
							newCode.push(null);
							i++;
						} else if (/^\+(.*)$/.test(newLines[j])) {
							newCode.push(newLines[j].substring(2));
							oldCode.push(null);
							j++;
						} else {
							if ( /^ (.*)$/.test(oldLines[i] ) ) {
								oldCode.push(oldLines[i].substring(2));
								newCode.push(oldLines[i].substring(2));
							} else if ( /^ (.*)$/.test(newLines[j] ) ) {
								newCode.push(newLines[j].substring(2));
								oldCode.push(newLines[j].substring(2));
							}
							i++; j++;
						}
					}
					return [oldCode, newCode];
				}

				//Separate modified parts from non-modified
				var modifiedPartsOld = parts[2].split(/(\n(?:!.*\n)+)/);
				var modifiedPartsNew = parts[4].split(/(\n(?:!.*\n)+)/);

				//There are always the same number of modified/non-modified parts in old and new code
				for (var i = 0; i < modifiedPartsOld.length; i++) {
					if ( /^!/m.test(modifiedPartsOld[i]) ) {
						//modified parts
						chunk['old'].code = chunk['old'].code.concat(modifiedPartsOld[i].trim("\n").replace(/^! /mg, "").split("\n"));
						chunk['new'].code = chunk['new'].code.concat(modifiedPartsNew[i].trim("\n").replace(/^! /mg, "").split("\n"));
						while ( chunk['old'].code.length < chunk['new'].code.length ) {
							chunk['old'].code.push(null);
						}
						while ( chunk['old'].code.length > chunk['new'].code.length ) {
							chunk['new'].code.push(null);
						}
					} else {
						//steady parts
						var splittedCode = processSteadyParts(modifiedPartsOld[i], modifiedPartsNew[i]);
						chunk['old'].code = chunk['old'].code.concat(splittedCode[0]);
						chunk['new'].code = chunk['new'].code.concat(splittedCode[1]);
					}
				}

				var oldLines = parts[2].trim("\n").split("\n");
				var newLines = parts[4].trim("\n").split("\n");
				var oldLastLine = oldLines[oldLines.length-1];
				var newLastLine = newLines[newLines.length-1];;

				chunk['old'].doesnt_have_new_line = /^\\ No newline at end of file$/.test(oldLastLine);
				chunk['new'].doesnt_have_new_line = /^\\ No newline at end of file$/.test(newLastLine);
				//check for \ No newline at end of file
				if (chunk['old'].doesnt_have_new_line && !chunk['new'].doesnt_have_new_line) {
					chunk['old'].code.push(null);
					chunk['new'].code.push("");
				} else if (chunk['new'].doesnt_have_new_line && !chunk['old'].doesnt_have_new_line) {
					chunk['new'].code.push(null);
					chunk['old'].code.push("");
				}

				return chunk;
			}

			var res_file = {};

			res_file.title = title;

			var parts = code.split(/^\*{4,}$/m);
			//parts[0] is some text before code

			//get filename from it
			var filename = "";
			var regExpRes = parts[0].match(/---\s+(.*?)(?:\s|\n)+/);
			if (regExpRes) {
				res_file.name = regExpRes[1];
			}

			res_file.precode = parts[0];
			res_file.chunks = [];

			for ( var i = 1; i < parts.length; i++ ) {
				res_file.chunks.push(parseChunk(parts[i]));
			}

			return res_file;
		}


		//main function body
		var res = {}

		var diffs = text.split(/(?:\n\n((?:.*\n){1,3}[-=]+\n))|(?:\n\n(diff.*)\n)/);
		//Ok, diffs[0] is log, put it away.
		//diffs[odd] are titles
		//diffs[even] are diffs themselves
		res.log = diffs[0];
		res.files = [];

		for ( var i = 1; i < diffs.length; i += 3 ) {
			res.files.push(parseFile(diffs[i]+diffs[i+1], diffs[i+2]));
		}

		return res;
	},
	couldParse: function(text) {
		var line_tag = /^(?:\*|\-){3}\s+(\d+)\,\d+\s+(?:\*|\-){4}$/m;
		return line_tag.test(text);
	}
};

