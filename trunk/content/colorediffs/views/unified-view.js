
colorediffsGlobal.views["unified"] = {
 render: function(il, pref, dom) {
		var me = colorediffsGlobal;

		return [
			function() {
				var colorStyle = function(style, prop) {
					return "." + style + " {" + pref.getColorProps(prop) + "}\n";
				}

				var stylecontent = "";

				stylecontent += colorStyle("linetag", "diffColorer.anchor");
				stylecontent += colorStyle("addline", "diffColorer.addedLine");
				stylecontent += colorStyle("delline", "diffColorer.deletedLine");
				stylecontent += colorStyle("steadyline", "diffColorer.steadyLine");
				stylecontent += colorStyle("title", "diffColorer.title");
				stylecontent += colorStyle("precode", "diffColorer.precode");
				//stylecontent += ".addline {color: red;}\n";
				stylecontent += "pre {font-family:monospace;}\n";
				stylecontent += ".title, .linetag, .diffs, .addline, .delline, .precode {margin:0;}\n";
				return dom.createElement("style", null, stylecontent);
			}(),
			dom.createDocumentFragment(
				dom.createElement("pre", {id:'log', 'class':'log'}, il.log),
				il.files.map(function(file) {
						return dom.createElement(
							"div", {'class':'file-diff', title:file['new'].name, id:file['new'].name, width:"100%"},
							dom.createElement(
								"pre", {'class':'title'},
								file.title + "\n======================================="
							),
							dom.createElement(
								"pre", {'class':'precode'},
								file.additional_info
							),
							dom.createElement(
								"pre", {'class':'delline'},
								"--- " + file['old'].name + ((file['old'].version) ? "\t" + file['old'].version : "")
							),
							dom.createElement(
								"pre", {'class':'addline'},
								"+++ " + file['new'].name + ((file['new'].version) ? "\t" + file['new'].version : "")
							),
							me.ilUtils.chunksMap(file, function(old_chunk, new_chunk) {
									var codeDecorated = [];
									var oldCodeDecorated = [];
									var newCodeDecorated = [];

									var oldLine = old_chunk.line;
									var newLine = new_chunk.line;

									var oldCode = old_chunk.code; //.concat([]); //do not copy array;
									var newCode = new_chunk.code; //.concat([]); //do not copy array

									oldCode.push("");newCode.push("");

									var l = new_chunk.code.length;

									for (var i=0; i < l; ++i) {
										if ( oldCode[i] == newCode[i] ) {
											codeDecorated = codeDecorated.concat(oldCodeDecorated).concat(newCodeDecorated);
											oldCodeDecorated = [];
											newCodeDecorated = [];

											var line = oldCode[i];

											codeDecorated.push("<div class='steadyline' title='" + file['new'].name + ":" + oldLine + "'> " + line +" </div>");

											newLine++;
											oldLine++;
										} else {
											if ( newCode[i] != null ) {
												var line = newCode[i];

												newCodeDecorated.push("<div class='addline' title='" + file['new'].name + ":" + newLine + "'>+" + line +" </div>");
												newLine++;
											}
											if ( oldCode[i] != null ) {
												var line = oldCode[i];

												oldCodeDecorated.push("<div class='delline' title='" + file['old'].name + ":" + oldLine + "'>-" + line +" </div>");
												oldLine++;
											}
										}
									}

									oldCode.pop(); newCode.pop(); codeDecorated.pop();

									return [
										dom.createElement(
											"pre", {'class':'linetag'},
											"@@ -" + old_chunk.line +
											"," + colorediffsGlobal.ilUtils.calcLineCounts(old_chunk.code) +
											" +" +new_chunk.line +
											"," + colorediffsGlobal.ilUtils.calcLineCounts(new_chunk.code) +
											" @@"
										),
										dom.createElement(
											"pre", {'class':'diffs'},
											codeDecorated.join("")
										)
									];
								}
							)
						);
					}
				)
			)
		];
	},
	getPropertyPageId: function() {return "unified-view-options";}
};
