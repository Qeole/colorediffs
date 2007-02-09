function parseDiff(text, mode) {
	var parseDiffPart = function(diff, filename) {
		var parts = diff.split(/^(@@\s\-\d+\,\d+\s\+\d+\,\d+\s@@)$/m);
		//parts[0] is some text before code
		var newText = mode.decoratePrecode(parts[0]);
		//parts[odd] are tags
		//parts[even] are code
		for ( var i = 1; i < parts.length; i += 2 ) {
			newText += mode.decorateAnchor(parts[i]);
			if (parts[i].match_perl_like(/^@@\s+\-(\d+)\,\d+\s+\+(\d+)\,\d+\s+@@$/)) {
				left_line = $1;
				right_line = $2;
			}
			newText += mode.decorateDiff(parts[i+1], filename, left_line, right_line);
		}
		return newText;
	}


	//main function body

	//remove tags Thunderbird inserted
	text = text.replace(/^<pre.*><br><hr.*><br>/, "\n\n");
	text = text.replace(/^<pre.*>/, "\n\n");
	text = text.replace(/<\/pre>$/, "");

	var diffs = text.split(/\n\n((?:.*\n){1,3}[-=]+\n)/);
	//Ok, diffs[0] is log, put it away.
	//diffs[odd] are titles
	//diffs[even] are diffs themselves
	var newText = mode.decorateLog(diffs[0]) + "\n\n";
	for ( var i = 1; i < diffs.length; i += 2 ) {
		var file = mode.decorateTitle(diffs[i]);
		//get filename from it
		var filename = "";
		if (diffs[i].match_perl_like(/\/([\w\.]+.[\w])$/m)) {
			filename = $1;
		}
		//var filename =
		file += parseDiffPart(diffs[i+1], filename);
		newText += mode.decorateFile(file, filename);
	}
	return newText;
}


function isDiff(text) {
	//check if text has line tags
	line_tag = /^@@\s\-\d+\,\d+\s\+\d+\,\d+\s@@$/m;
	return line_tag.test(text);
}
