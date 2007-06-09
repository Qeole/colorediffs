colorediffsGlobal.parse = function(code) {
	for each (var parser in colorediffsGlobal.parsers) {
		if (parser.couldParse(code)) {
			return parser.parse(code);
		}
	}
	return null;
}
