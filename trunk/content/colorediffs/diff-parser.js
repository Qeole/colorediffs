function parseDiff(text, mode, addLinkClosures) {
	var parseDiffPart = function(d) {
		var parts = d.split(/^(@@\s\-\d+\,\d+\s\+\d+\,\d+\s@@)/m);
		//parts[0] is some text before code

		//get filename from it
		var filename = "";
		if (parts[0].match_perl_like(/---\s+.*?([^\/\s]+)(?:\s|\n)+/)) {
			filename = $1;
		}

		var newText = mode.decoratePrecode(parts[0]);
		//parts[odd] are tags
		//parts[even] are code
		for ( var i = 1; i < parts.length; i += 2 ) {
			newText += mode.decorateAnchor(parts[i]);
			if (parts[i].match_perl_like(/^@@\s+\-(\d+)\,\d+\s+\+(\d+)\,\d+\s+@@/)) {
				left_line = $1;
				right_line = $2;
			}

			var diff = parts[i+1];

			//show whitespaces
			if (pref.getBoolPref("diffColorer.show-whitespace" )) {
				diff = diff.replace(/ /g, "\u00B7");
				diff = diff.replace(/^\u00B7/gm, " "); //first space should stay
				diff = diff.replace(/^\t/gm, " \t");
				diff = diff.replace(/\t/g, "\u00BB\t");
			}


			newText += mode.decorateDiff(diff, filename, left_line, right_line);
		}
		return [filename, newText];
	}


	//main function body

	//remove tags Thunderbird inserted
	text = text.replace(/^<pre.*><br><hr.*><br>/, "\n\n");
	text = text.replace(/^<pre.*>/, "\n\n");
	text = text.replace(/<\/pre>$/, "");

	var diffs = text.split(/(?:\n\n((?:.*\n){1,3}[-=]+\n))|(?:\n\n(diff.*)\n)/);
	//Ok, diffs[0] is log, put it away.
	//diffs[odd] are titles
	//diffs[even] are diffs themselves
	var newText = "";
	var log = diffs[0];

	for ( var i = 1; i < diffs.length; i += 3 ) {var loopbody = function() {
		var title = diffs[i]+diffs[i+1];
		var file = mode.decorateTitle(title);

		var filenameAndDiffPart = parseDiffPart(diffs[i+2]);
		var filename = filenameAndDiffPart[0];
		file += filenameAndDiffPart[1];

		newText += "<a name='" + filename + "' width='500px'>" + mode.decorateFile(file, filename) + "</a>";

		addLinkClosures.push(function(log) {return log.replace(new RegExp("([\/\.a-zA-Z0-9-]*" + filename + ")"), "<a href='#" + filename + "'>$1</a>");});
		}();
	}

	return function(replaceLinks) {
		return mode.decorateLog(replaceLinks(log)) + "\n\n" + newText;
	}
}


function isDiff(text) {
	//check if text has line tags
	line_tag = /^@@\s\-\d+\,\d+\s\+\d+\,\d+\s@@/m;
	return line_tag.test(text);
}
