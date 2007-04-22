colorediffsGlobal.parse = function(code) {
	return colorediffsGlobal.parsers.fold(function(parser, il) {
			if (il != null && parser.couldParse(code)) {
				return parser.parse(code);
			}
		},
		null);
}
