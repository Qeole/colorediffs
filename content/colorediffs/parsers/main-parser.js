colorediffsGlobal.parse = function(code, pref) {
	for each (var parser in colorediffsGlobal.parsers) {
		if (parser.couldParse(code)) {
			return parser.parse(code, pref);
		}
	}
	return null;
}
