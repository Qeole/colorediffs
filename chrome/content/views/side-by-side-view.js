
colorediffsGlobal.views["side-by-side"] = {
 render: function(il, pref, dom) {
		var me = colorediffsGlobal;

		function createCodeElement (side, code) {
			var e = dom.createElement("pre", {'class':side}, code);
			e.addEventListener("scroll", function(evt) {colorediffsGlobal.scrollCallback(evt);}, false);
			return e;
		}

		function pcp(str) {
			return str.replace(/\$cp{(.*?)}/g, function(str, prop) {
					return pref.getColorProps(prop.trim());
				});
		}

		function createCodeLine(klass, title, code) {
			var t = (title)?"title='" + title + "'" : "";
			return "<span class='" + klass + "' " + t + ">" + code + "</span>\n";
		}

		return [
			function() {
				var stylecontent = "";
				stylecontent += "	.log			{$cp{extensions.diffColorer.sbs_log		}; padding: 5px; border: 1px solid black;overflow:auto;}\n";
				stylecontent += "	.file-diff		{$cp{extensions.diffColorer.sbs_file-diff	}; padding: 3px;margin:5px;border: 1px solid black; table-layout: fixed;}\n";
				stylecontent += "	.title			{$cp{extensions.diffColorer.sbs_title		};padding: 5px; margin:0; overflow:auto; border: 1px solid black;}\n";
				stylecontent += "	.pre-code		{$cp{extensions.diffColorer.sbs_precode	}; margin:0;overflow:auto; display:inline;}\n";
				stylecontent += "	.infoline		{$cp{extensions.diffColorer.sbs_precode	}; margin:0;overflow:auto; display:inline;}\n";
				stylecontent += "	.addline		{$cp{extensions.diffColorer.sbs_addedLine	}; margin-left:5px;margin-right:5px;}\n";
				stylecontent += "	.delline		{$cp{extensions.diffColorer.sbs_deletedLine}; margin-left:5px;margin-right:5px;}\n";
				stylecontent += "	.steadyline		{$cp{extensions.diffColorer.sbs_steadyLine }; margin-left:5px;margin-right:5px;}\n";
				stylecontent += "	.linetag		{$cp{extensions.diffColorer.sbs_anchor		}; text-align:center;clear:left;margin:0;}\n";
				stylecontent += "	.left			{$cp{extensions.diffColorer.sbs_left		};margin:0; overflow:auto; border: 1px solid black;padding-top:5px;padding-bottom:5px;}\n";
				stylecontent += "	.right			{$cp{extensions.diffColorer.sbs_right		};margin:0; overflow:auto; border: 1px solid black;padding-top:5px;padding-bottom:5px;}\n";
				stylecontent += "	.left-title		{$cp{extensions.diffColorer.sbs_left-title };padding: 0; margin:0; overflow:auto; border: 1px solid black;}\n";
				stylecontent += "	.right-title	{$cp{extensions.diffColorer.sbs_right-title};padding: 0; margin:0; overflow:auto; border: 1px solid black;}\n";
				stylecontent += "	.left .addline	{$cp{extensions.diffColorer.sbs_emptyLine	};color: green;}\n";
				stylecontent += "	.right .delline	{$cp{extensions.diffColorer.sbs_emptyLine	};color: green;}\n";

				return dom.createElement("style", null, pcp(stylecontent));
			}(),
			dom.createDocumentFragment(
				dom.createElement("pre", {id:'log', 'class':'log', wrap: ""}, il.log),
				il.files.map(function(file) {

						return dom.createElement(
							"table", {'class':'file-diff', title:file.commonNameTruncated, id:file.id, width:"99%", align:"center"},
							dom.createElement(
								"tr", {},
								dom.createElement(
									"td", {colspan:2},
									dom.createElement(
										"pre", {'class':'title', wrap: ""},
										file.title
									)
								)
							),
							dom.createElement(
								"tr", {'class':'pre-code'},
								dom.createElement(
									"td", {colspan:2},
									dom.createElement(
										"pre", {'class':'pre-code', wrap: ""},
										file.additional_info
									)
								)
							),
							function() {
								if ( file['old'] && file['old'].chunks && file['new'] && file['new'].chunks ) {
									return side_by_side_file(file);
								} else if ( file['old'] && file['old'].chunks ) {
									return standalone_file(file, 'old');
								} else if ( file['new'] && file['new'].chunks ) {
									return standalone_file(file, 'new');
								} else {
									return null;
								}
							} ()
						);
					}
				),
				dom.createElement(
					"pre", {wrap: "", style: "overflow:auto;"},
					il.postfix || ""
				)
			)
		];

		function side_by_side_file(file) {
			var old_version = (file['old'].version) ? "\t" + file['old'].version : "";
			var new_version = (file['new'].version) ? "\t" + file['new'].version : "";

			var old_title = (file['old'].name + old_version).replace(/ /g, "&nbsp;");
			var new_title = (file['new'].name + new_version).replace(/ /g, "&nbsp;");

			return [
				dom.createElement(
					"tr", {},
					dom.createElement(
						"td", {valign:'top', width:'50%'},
						dom.createElement(
							'pre', {'class':'left-title', wrap: ""},
							dom.createElement('div', {style: 'padding:5px'}, old_title))
					),
					dom.createElement(
						"td", {valign:'top', width:'50%'},
						dom.createElement(
							'pre', {'class':'right-title', wrap: ""},
							dom.createElement('div', {style: 'padding:5px'}, new_title))
					)
				),
				me.ilUtils.chunksMap(file, function(old_chunk, new_chunk) {
						var prev_old_class = null;
						var prev_new_class = null;


						function startCodeBlockIfNeeded(old_class, new_class) {
							if (old_class != prev_old_class) {
								if (prev_old_class) {
									oldCodeDecorated += "</div>";
								}
								oldCodeDecorated += "<div class='" + old_class + "'>";
								prev_old_class = old_class;
							}
							if (new_class != prev_new_class) {
								if (prev_new_class) {
									newCodeDecorated += "</div>";
								}
								newCodeDecorated += "<div class='" + new_class + "'>";
								prev_new_class = new_class;
							}
						}

						var oldCodeDecorated = "";
						var newCodeDecorated = "";
						var oldLine = old_chunk.line;
						var newLine = new_chunk.line;

						var oldCode = old_chunk.code;
						var newCode = new_chunk.code;

						var oldPadding = old_chunk.padding;
						var newPadding = new_chunk.padding;

						var l = old_chunk.code.length;

						for (var i=0; i < l; ++i) {
							var oldCodeLine = oldCode[i] + oldPadding[i];
							var newCodeLine = newCode[i] + newPadding[i];

							switch( old_chunk.status[i] ) {
								case "A": //Added
									startCodeBlockIfNeeded('addline', 'addline');
									oldCodeDecorated += createCodeLine('addline', null, oldPadding[i]);
									newCodeDecorated += createCodeLine('addline', file['new'].name15Truncated + ":" + newLine, newCodeLine);
									newLine++;
									break;
								case "D": //Deleted
									startCodeBlockIfNeeded('delline', 'delline');
									newCodeDecorated += createCodeLine('delline', null, newPadding[i]);
									oldCodeDecorated += createCodeLine('delline', file['old'].name15Truncated + ":" + oldLine, oldCodeLine);
									oldLine++;
									break;
								case "C": //Changed
									startCodeBlockIfNeeded('delline', 'addline');
									oldCodeDecorated += createCodeLine('delline', file['old'].name15Truncated + ":" + oldLine, oldCodeLine);
									newCodeDecorated += createCodeLine('addline', file['new'].name15Truncated + ":" + newLine, newCodeLine);
									newLine++;
									oldLine++;
									break;
								case "S": //the Same
									startCodeBlockIfNeeded('steadyline', 'steadyline');
									oldCodeDecorated += createCodeLine('steadyline', file['old'].name15Truncated + ":" + oldLine, oldCodeLine);
									newCodeDecorated += createCodeLine('steadyline', file['new'].name15Truncated + ":" + newLine, newCodeLine);
									newLine++;
									oldLine++;
									break;
							}
						}

						if (old_chunk.doesnt_have_new_line && !new_chunk.doesnt_have_new_line) {
							startCodeBlockIfNeeded('addline', 'addline');
							newCodeDecorated += createCodeLine('addline', file['new'].name15Truncated + ":" + newLine, newPadding[i]);
							oldCodeDecorated += createCodeLine('addline', file['old'].name15Truncated, oldPadding[i]);
						}

						if (!old_chunk.doesnt_have_new_line && new_chunk.doesnt_have_new_line) {
							startCodeBlockIfNeeded('delline', 'delline');
							newCodeDecorated += createCodeLine('delline', file['new'].name15Truncated, newPadding[i]);
							oldCodeDecorated += createCodeLine('delline', file['old'].name15Truncated + ":" + oldLine, oldPadding[i]);
						}

						oldCodeDecorated += "</div>";
						newCodeDecorated += "</div>";

						return [
							dom.createElement(
								"tr", {'class':'linetag'},
								dom.createElement("td", {colspan:2},
												  "@@ -" + old_chunk.line +
												  "," + old_chunk.code_size +
												  " +" +new_chunk.line +
												  "," + new_chunk.code_size +
												  " @@")
							),
							function() {
								if (!old_chunk.infoline) {
									return null;
								} else {
									return dom.createElement(
										"tr", {'class':'linetag'},
										dom.createElement("td", {colspan:2},
											dom.createElement(
												"pre", {'class':'infoline'},
												old_chunk.infoline
											)
										)
									);
								}
							},
							dom.createElement(
								"tr", {'class':'diffs'},
								dom.createElement(
									"td", {valign:'top', width:'50%'},
									createCodeElement('left', oldCodeDecorated)
								),
								dom.createElement(
									"td", {valign:'top', width:'50%'},
									createCodeElement('right', newCodeDecorated)
								)
							)
						];
					}
				)
			];
		}

		function standalone_file(file, side) {
			var version = (file[side].version) ? "\t" + file[side].version : "";

			switch(side) {
				case "new":
					var changedClass = "addline";
					var ignoredTag = "D";
					var anchorSign = "+";
					var sideClass = "right";
					break;
				case "old":
					var changedClass = "delline";
					var ignoredTag = "A";
					var anchorSign = "-";
					var sideClass = "left";
					break;
			}

			return [
				dom.createElement(
					"tr", {},
					dom.createElement(
						"td", {valign:'top', colspan:'2'},
						dom.createElement(
							'pre', {'class':sideClass+"-title", wrap: ""},
							dom.createElement('div', {style: 'padding:5px'}, file[side].name + version)
						)
					)
				),
				file[side].chunks.map(function(chunk) {
						function getDecoratedLine(decoratedClass, code, line) {
							return createCodeLine(decoratedClass, file[side].name15Truncated + ":" + line, code);
						}

						var prev_class = null;

						function startCodeBlockIfNeeded(klass) {
							if (klass != prev_class) {
								if (prev_class) {
									codeDecorated += "</div>";
								}
								codeDecorated += "<div class='" + klass + "'>";
								prev_class = klass;
							}
						}

						var codeDecorated = "";
						var line = chunk.line;

						var code = chunk.code;
						var padding = chunk.padding;

						var l = chunk.code.length;

						for (var i=0; i < l; ++i) {
							var codeLine = code[i] + padding[i];

							if ( codeLine == "" ) {
								codeLine = " ";
							}

							switch( chunk.status[i] ) {
								case "A": //Added
								case "D": //Deleted
								case "C": //Changed
									startCodeBlockIfNeeded(changedClass);
									if (ignoredTag != chunk.status[i]) {
										codeDecorated += getDecoratedLine(changedClass, codeLine, line);
										line++;
									}
									break;
								case "S": //the Same
									startCodeBlockIfNeeded('steadyline');
									codeDecorated += getDecoratedLine('steadyline', codeLine, line);
									line++;
									break;
							}

						}

						if (chunk.doesnt_have_new_line) {
							startCodeBlockIfNeeded('steadyline');
							codeDecorated += createCodeLine('steadyline', file.name15Truncated, "\\ No newline at end of file");
						}

						codeDecorated += "</div>";

						return [
							dom.createElement(
								"tr", {'class':'linetag'},
								dom.createElement("td", {colspan:'2'},
												  "@@ " + anchorSign + chunk.line +
												  "," + chunk.code_size +
												  " @@")
							),
							dom.createElement(
								"tr", {'class':'diffs'},
								dom.createElement(
									"td", {valign:'top', colspan:'2'},
									dom.createElement("pre", {'class':sideClass}, codeDecorated)
								)
							)
						];
					}
				)
			];
		}

		return null;
	},
	getPropertyPageId: function() {return "side-by-side-view-options";}
};
