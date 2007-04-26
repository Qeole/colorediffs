colorediffsGlobal.parse = function(code) {
	return colorediffsGlobal.fold(colorediffsGlobal.parsers, function(parser, il) {
			if (il == null && parser.couldParse(code)) {
				return parser.parse(code);
			} else {
				return il;
			}
		},
		null);
}
