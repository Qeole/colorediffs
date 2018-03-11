colorediffsGlobal.parse = function(code, pref) {
	for (var parserName in colorediffsGlobal.parsers) {
		if (colorediffsGlobal.parsers[parserName].couldParse(code)) {
			return colorediffsGlobal.parsers[parserName].parse(code, pref);
		}
	}
	return null;
}
