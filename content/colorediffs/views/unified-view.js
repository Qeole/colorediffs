
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
							"div", {'class':'file-diff', title:file.common_name, id:file.id, width:"100%"},
							dom.createElement(
								"pre", {'class':'title'},
								file.title + "\n======================================="
							),
							dom.createElement(
								"pre", {'class':'precode'},
								file.additional_info
							),
							function () {
								if (file['old'].chunks || file['new'].chunks) {
									var old_name;
									var new_name;
									var old_version;
									var new_version;

									if ( file['old'] && file['old'].name ) {
										old_name = file['old'].name;
										old_version = (file['old'].version) ? "\t" + file['old'].version : "";
									} else {
										old_name = file['new'].name;
										old_version = "";
									}

									if ( file['new'] && file['new'].name ) {
										new_name = file['new'].name;
										new_version = (file['new'].version) ? "\t" + file['new'].version : "";
									} else {
										new_name = file['old'].name;
										new_version = "";
									}


									return [dom.createElement(
											"pre", {'class':'delline'},
											"--- " + old_name + old_version
										),
										dom.createElement(
											"pre", {'class':'addline'},
											"+++ " + new_name + new_version
										)];
								} else {
									return null;
								}
							}(),
							me.ilUtils.chunksMap(file, function(old_chunk, new_chunk) {
									if (old_chunk == null) {
										old_chunk = gen_empty_chunk(new_chunk);
									}

									if (new_chunk == null) {
										new_chunk = gen_empty_chunk(old_chunk);
									}

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
							),
							dom.createElement(
								"pre", {},
								""
							)
						);
					}
				)
			)
		];


		function gen_empty_chunk(oposite_chunk) {
			var chunk = {line:0, code:[]};
			for (var i = 0; i < oposite_chunk.code.length; i++ ) {
				chunk.code.push(null);
			}
			return chunk;
		}

		//Seriously, that bug is annoying.
		return null;
	},
	getPropertyPageId: function() {return "unified-view-options";}
};
