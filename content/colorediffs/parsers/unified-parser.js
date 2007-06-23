colorediffsGlobal.parsers["unified"] = {
	parse: function(text) {
		var parseFile = function(title, code) {
			var parseChunk = function(anchor, code) {
				var chunk = {};
				chunk['old'] = {};
				chunk['new'] = {};

				var regExpRes = anchor.match(/^@@\s+\-(\d+)(?:\,\d+)?\s+\+(\d+)(?:\,\d+)?\s+@@/);
				if (regExpRes) {
					chunk['old'].line = Number(regExpRes[1]);
					chunk['new'].line = Number(regExpRes[2]);
				}

				//split code
				chunk['old'].code = [];
				chunk['new'].code = [];

				var lines = code.trim("\n").split("\n");
				//terminal symbol to make old and new code equal length
				lines.push("");

				chunk['old'].doesnt_have_new_line = false;
				chunk['new'].doesnt_have_new_line = false;

				for (var i=0; i < lines.length; i++) {
					if (/^\-(.*)$/.test(lines[i])) {
						chunk['old'].code.push(lines[i].substring(1));
					} else if (/^\+(.*)$/.test(lines[i])) {
						chunk['new'].code.push(lines[i].substring(1));
					} else if (/^\\ No newline at end of file$/.test(lines[i])) {
						//check what sign previous line has if there are any
						if ( i > 0 ) {
							if (/^\-/.test(lines[i-1])) {
								chunk['old'].doesnt_have_new_line = true;
							} else if (/^\+/.test(lines[i-1])) {
								chunk['new'].doesnt_have_new_line = true;
							}
						}
					} else {
						while ( chunk['old'].code.length < chunk['new'].code.length ) {
							chunk['old'].code.push(null);
						}
						while ( chunk['old'].code.length > chunk['new'].code.length ) {
							chunk['new'].code.push(null);
						}
						chunk['old'].code.push(lines[i].substring(1));
						chunk['new'].code.push(lines[i].substring(1));
					}
				}
				chunk['old'].code.pop(); chunk['new'].code.pop();

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

			var parts = code.split(/^(@@\s+\-\d+(?:\,\d+)?\s\+\d+(?:\,\d+)?\s+@@)/m);
			//parts[0] is some text before code

			//get filename from it
			var regExpRes = parts[0].match(/---\s+(.*?)(?:\s|\n)+/);
			if (regExpRes) {
				res_file.name = regExpRes[1];
			}

			res_file.precode = parts[0];
			res_file.chunks = [];

			for ( var i = 1; i < parts.length; i += 2 ) {
				res_file.chunks.push(parseChunk(parts[i], parts[i+1]));
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
		var line_tag = /^@@\s+\-\d+(?:\,\d+)?\s\+\d+(?:\,\d+)?\s+@@/m;
		return line_tag.test(text);
	}
};

