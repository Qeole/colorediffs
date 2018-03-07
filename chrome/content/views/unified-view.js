
colorediffsGlobal.views["unified"] = {
 render: function(il, pref, dom) {
		var me = colorediffsGlobal;

		return [
			function() {
				var colorStyle = function(style, prop) {
					return "." + style + " {" + pref.getColorProps(prop) + "}\n";
				}

				var stylecontent = "";

				stylecontent += colorStyle("linetag", "extensions.diffColorer.anchor");
				stylecontent += colorStyle("addline", "extensions.diffColorer.addedLine");
				stylecontent += colorStyle("delline", "extensions.diffColorer.deletedLine");
				stylecontent += colorStyle("steadyline", "extensions.diffColorer.steadyLine");
				stylecontent += colorStyle("title", "extensions.diffColorer.title");
				stylecontent += colorStyle("precode", "extensions.diffColorer.precode");
				stylecontent += colorStyle("infoline", "extensions.diffColorer.precode");
				//stylecontent += ".addline {color: red;}\n";
				stylecontent += "pre {font-family:monospace;}\n";
				stylecontent += ".linetag, .infoline {display:inline;}\n";
				stylecontent += ".title, .linetag, .diffs, .addline, .delline, .precode, .infoline {margin:0;}\n";
				return dom.createElement("style", null, stylecontent);
			}(),
			dom.createDocumentFragment(
				dom.createElement("pre", {id:'log', 'class':'log', wrap: ""}, il.log),
				il.files.map(function(file) {
						return dom.createElement(
							"div", {'class':'file-diff', title:file.commonNameTruncated, id:file.id, width:"100%"},
							dom.createElement(
								"pre", {'class':'title', wrap: ""},
								file.title + "\n======================================="
							),
							dom.createElement(
								"pre", {'class':'precode', wrap: ""},
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
									var only_new = false;
									var only_old = false;


									if (old_chunk == null) {
										only_new = true;
										old_chunk = gen_empty_chunk(new_chunk);
									}

									if (new_chunk == null) {
										only_old = true;
										new_chunk = gen_empty_chunk(old_chunk);
									}

									var codeDecorated = [];
									var oldCodeDecorated = [];
									var newCodeDecorated = [];

									var oldLine = old_chunk.line;
									var newLine = new_chunk.line;

									var oldCode = old_chunk.code; //.concat([]); //do not copy array;
									var newCode = new_chunk.code; //.concat([]); //do not copy array

									var l = new_chunk.code.length;

									for (var i=0; i < l; ++i) {
										switch( new_chunk.status[i] ) {
											case "A": //Added
												var line = newCode[i];

												newCodeDecorated.push("<div class='addline' title='" + file['new'].name15Truncated + ":" + newLine + "'>+" + line +" </div>");
												newLine++;
												break;
											case "D": //Deleted
												var line = oldCode[i];

												oldCodeDecorated.push("<div class='delline' title='" + file['old'].name15Truncated + ":" + oldLine + "'>-" + line +" </div>");
												oldLine++;
												break;
											case "C": //Changed
												newCodeDecorated.push("<div class='addline' title='" + file['new'].name15Truncated + ":" + newLine + "'>+" + newCode[i] +" </div>");
												oldCodeDecorated.push("<div class='delline' title='" + file['old'].name15Truncated + ":" + oldLine + "'>-" + oldCode[i] +" </div>");
												newLine++;
												oldLine++;
												break;
											case "S": //the Same
												if ( !only_new ) {
													codeDecorated = codeDecorated.concat(oldCodeDecorated);
												}

												if ( !only_old ) {
													codeDecorated = codeDecorated.concat(newCodeDecorated);
												}

												oldCodeDecorated = [];
												newCodeDecorated = [];

												if ( only_old ) {
													var line = oldCode[i];
													var tooltip = file['old'].name15Truncated + ':' + oldLine;
												} else if (only_new) {
													var line = newCode[i];
													var tooltip = file['new'].name15Truncated + ':' + newLine;
												} else {
													var line = newCode[i];
													var tooltip = "old: " + file['old'].name7Truncated + ':' + oldLine + ", " +
																  "new: " + file['new'].name7Truncated + ':' + newLine;
												}

												codeDecorated.push("<div class='steadyline' title='" + tooltip + "'> " + line +" </div>");

												newLine++;
												oldLine++;
												break;
										}
									}

									if (old_chunk.doesnt_have_new_line && !new_chunk.doesnt_have_new_line) {
										oldCodeDecorated.push("<div class='steadyline' title='" + file['old'].name15Truncated + "'>\\ No newline at end of file</div>");
									}

									if (!old_chunk.doesnt_have_new_line && new_chunk.doesnt_have_new_line) {
										newCodeDecorated.push("<div class='steadyline' title='" + file['new'].name15Truncated + "'>\\ No newline at end of file</div>");
									}

									if ( !only_new ) {
										codeDecorated = codeDecorated.concat(oldCodeDecorated);
									}

									if ( !only_old ) {
										codeDecorated = codeDecorated.concat(newCodeDecorated);
									}

									if (old_chunk.doesnt_have_new_line && new_chunk.doesnt_have_new_line) {
										codeDecorated.push("<div class='steadyline' title='" + file.commonNameTruncated + "'>\\ No newline at end of file</div>");
									}

									var ret = [dom.createElement(
											"pre", {'class':'linetag'},
											"@@ -" + old_chunk.line +
											"," + old_chunk.code_size +
											" +" +new_chunk.line +
											"," + new_chunk.code_size +
											" @@"
									)];

									if (old_chunk.infoline) {
										ret.push(dom.createElement(
												"pre", {'class':'infoline'},
												" " + old_chunk.infoline
										));
									}

									ret.push(dom.createElement(
											"pre", {'class':'diffs'},
											codeDecorated.join("")
									));

									return ret;
								}
							),
							dom.createElement(
								"pre", {},
								""
							)
						);
					}
				),
				dom.createElement(
					"pre", {wrap: ""},
					il.postfix || ""
				)
			)
		];


		function gen_empty_chunk(oposite_chunk) {
			var chunk = {line:0, code:[], code_size:0};
			for (var i = 0; i < oposite_chunk.code.length; i++ ) {
				chunk.code.push(null);
			}

			chunk.status = oposite_chunk.status;

			return chunk;
		}

		//Seriously, that bug is annoying.
		return null;
	},
	getPropertyPageId: function() {return "unified-view-options";}
};
