
colorediffsGlobal.views["context"] = {
 render: function(il, pref, dom) {
		var me = colorediffsGlobal;

		return [
			function() {
				var colorStyle = function(style, prop) {
					return "." + style + " {" + pref.getColorProps(prop) + "}\n";
				}

				var stylecontent = "";

				stylecontent += colorStyle("linetag", "extensions.diffColorer.c_anchor");
				stylecontent += colorStyle("addline", "extensions.diffColorer.c_addedLine");
				stylecontent += colorStyle("delline", "extensions.diffColorer.c_deletedLine");
				stylecontent += colorStyle("steadyline", "extensions.diffColorer.c_steadyLine");
				stylecontent += colorStyle("title", "extensions.diffColorer.c_title");
				stylecontent += colorStyle("precode", "extensions.diffColorer.c_precode");
				stylecontent += colorStyle("infoline", "extensions.diffColorer.precode");
				//stylecontent += ".addline {color: red;}\n";
				stylecontent += "pre {font-family:monospace;}\n";
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
											"*** " + old_name + old_version
										),
										dom.createElement(
											"pre", {'class':'addline'},
											"--- " + new_name + new_version
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

									var oldCodeDecorated = [];
									var newCodeDecorated = [];

									var oldCodeDecoratedDelayed = [];
									var newCodeDecoratedDelayed = [];

									var oldLine = old_chunk.line;
									var newLine = new_chunk.line;

									var oldCode = old_chunk.code.concat([]); //copy array
									var newCode = new_chunk.code.concat([]); //copy array

									if (old_chunk.doesnt_have_new_line != new_chunk.doesnt_have_new_line) {
										oldCode.pop();newCode.pop();
									}

									oldCode.push("");newCode.push("");

									var onlyNew = true;
									var onlyOld = true;
									var l = oldCode.length;

									for (var i=0; i < l; ++i) {
										if ( oldCode[i] == newCode[i] ) {
											if (oldCodeDecoratedDelayed.length == 0 && newCodeDecoratedDelayed.length != 0) {
												newCodeDecorated = newCodeDecorated.concat(newCodeDecoratedDelayed);
												onlyOld = false;
											} else if (newCodeDecoratedDelayed.length == 0 && oldCodeDecoratedDelayed.length != 0) {
												oldCodeDecorated = oldCodeDecorated.concat(oldCodeDecoratedDelayed);
												onlyNew = false;
											} else if (newCodeDecoratedDelayed.length != 0 && oldCodeDecoratedDelayed.length != 0) {
												newCodeDecorated = newCodeDecorated.concat(
													newCodeDecoratedDelayed.map(
														function(line) {
															return line.replace(">+ ", ">! ");
														}
													));
												oldCodeDecorated = oldCodeDecorated.concat(
													oldCodeDecoratedDelayed.map(
														function(line) {
															return line.replace(">- ", ">! ");
														}
													));

												onlyNew = false;
												onlyOld = false;
											}

											newCodeDecoratedDelayed = [];
											oldCodeDecoratedDelayed = [];

											var line = oldCode[i];

											oldCodeDecorated.push("<div class='steadyline' title='" + file['old'].name15Truncated + ":" + oldLine + "'>&nbsp;&nbsp;" + line +" </div>");
											newCodeDecorated.push("<div class='steadyline' title='" + file['new'].name15Truncated + ":" + newLine + "'>&nbsp;&nbsp;" + line +" </div>");

											newLine++;
											oldLine++;
										} else {
											if ( newCode[i] != null ) {
												var line = newCode[i];
												newCodeDecoratedDelayed.push("<div class='addline' title='" + file['new'].name15Truncated + ":" + newLine + "'>+ " + line +" </div>");
												newLine++;
											}
											if ( oldCode[i] != null ) {
												var line = oldCode[i];
												oldCodeDecoratedDelayed.push("<div class='delline' title='" + file['old'].name15Truncated + ":" + oldLine + "'>- " + line +" </div>");
												oldLine++;
											}
										}
									}

									oldCodeDecorated.pop(); newCodeDecorated.pop();

									if (old_chunk.doesnt_have_new_line) {
										oldCodeDecorated.push("<div class='steadyline' title='" + file['old'].name15Truncated + "'>\\ No newline at end of file</div>");
									}

									if (new_chunk.doesnt_have_new_line) {
										newCodeDecorated.push("<div class='steadyline' title='" + file['new'].name15Truncated + "'>\\ No newline at end of file</div>");
									}


									if ( onlyOld ) {
										newCodeDecorated = [];
									}

									if ( onlyNew ) {
										oldCodeDecorated = [];
									}

									return [
										dom.createElement(
											"pre", {'class':'linetag'},
											"***************"
										),
										function() {
											if (!old_chunk.infoline) {
												return null;
											} else {
												return dom.createElement(
													"pre", {'class':'infoline'},
													old_chunk.infoline
												);
											}
										},
										dom.createElement(
											"pre", {'class':'linetag'},
											"*** " +
											old_chunk.line +
											"," + old_chunk.code_size +
											" ****"
										),
										function() {
											if (onlyNew) {
												return null;
											} else {
												return dom.createElement(
													"pre", {'class':'diffs'},
													oldCodeDecorated.join("")
												);
											}
										},
										dom.createElement(
											"pre", {'class':'linetag'},
											"--- " +
											new_chunk.line +
											"," + new_chunk.code_size +
											" ----"
										),
										function() {
											if (onlyOld) {
												return null;
											} else {
												return dom.createElement(
													"pre", {'class':'diffs'},
													newCodeDecorated.join("")
												);
											}
										}
									];
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
			return chunk;
		}

		//Seriously, that bug is annoying.
		return null;
	},
	getPropertyPageId: function() {return "context-view-options";}
};
