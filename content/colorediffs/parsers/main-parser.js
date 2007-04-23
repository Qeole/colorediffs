colorediffsGlobal.include("parsers/unified-parser.js");
colorediffsGlobal.include("parsers/context-parser.js");

colorediffsGlobal.parse = function(code) {
	return colorediffsGlobal.parsers.fold(function(parser, il) {
			if (il == null && parser.couldParse(code)) {
				return parser.parse(code);
			} else {
				return il;
			}
		},
		null);
}
