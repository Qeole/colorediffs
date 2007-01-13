var TypeEnum = {
	LOG:0,
	TITLE:1,
	PRECODE:2,
	ONE_DIFF_FILE:3,
	ANCHOR:4,
	DIFF:5
}

function parseDiff(text, decoration) {
	var parseDiffPart = function(diff) {
		var parts = diff.split(/^(@@\s\-\d+\,\d+\s\+\d+\,\d+\s@@)$/m);
		//parts[0] is some text before code
		var newText = decoration(parts[0], TypeEnum.PRECODE);
		//parts[odd] are tags
		//parts[even] are code
		for ( var i = 1; i < parts.length; i += 1 ) {
			if ( i % 2 == 1 ) {
				newText += decoration(parts[i], TypeEnum.ANCHOR);
			} else {
				newText += decoration(parts[i], TypeEnum.DIFF);
			}
		}
		return newText;
	}


	//main function body

	//remove tags Thunderbird inserted
	text = text.replace(/^<pre.*><br><hr.*><br>/, "\n\n");
	text = text.replace(/^<pre.*>/, "\n\n");
	text = text.replace(/<\/pre>$/, "");

	var diffs = text.split(/\n\n((?:.*\n){1,3}[-=]+\n)/);
	//Ok, diffs[0] is log, put it away. But if first is false it is just a first code part so process it normally.
	//diffs[odd] are titles
	//diffs[even] are diffs themselves
	var newText = decoration(diffs[0], TypeEnum.LOG) + "\n\n";
	for ( var i = 1; i < diffs.length; i += 2 ) {
		var file = decoration(diffs[i], TypeEnum.TITLE);
		file += parseDiffPart(diffs[i+1], decoration);
		newText += decoration(file, TypeEnum.ONE_DIFF_FILE);
	}
	return newText;
}


function isDiff(text) {
	//check if text has line tags
	line_tag = /^@@\s\-\d+\,\d+\s\+\d+\,\d+\s@@$/m;
	return line_tag.test(text);
}
