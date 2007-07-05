
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

		return [
			function() {
				var stylecontent = "";
				stylecontent += "	.log			{$cp{diffColorer.sbs_log		}; padding: 5px; border: 1px solid black;}";
				stylecontent += "	.file-diff		{$cp{diffColorer.sbs_file-diff	}; padding: 3px;margin:5px;}";
				stylecontent += "	.title			{$cp{diffColorer.sbs_title		};padding: 5px; margin:0; overflow:auto; border: 1px solid black;}";
				stylecontent += "	.pre-code		{$cp{diffColorer.sbs_precode	}; margin:0;}";
				stylecontent += "	.addline		{$cp{diffColorer.sbs_addedLine	}}";
				stylecontent += "	.delline		{$cp{diffColorer.sbs_deletedLine}}";
				stylecontent += "	.linetag		{$cp{diffColorer.sbs_anchor		}; text-align:center;clear:left;margin:0;}";
				stylecontent += "	.steadyline		{$cp{diffColorer.sbs_steadyLine }}";
				stylecontent += "	.left			{$cp{diffColorer.sbs_left		};padding: 5px; margin:0; overflow:auto; border: 1px solid black;}";
				stylecontent += "	.right			{$cp{diffColorer.sbs_right		};padding: 5px; margin:0; overflow:auto; border: 1px solid black;}";
				stylecontent += "	.left-title		{$cp{diffColorer.sbs_left-title };padding: 5px; padding-top:0; padding-bottom:0; margin:0; overflow:auto; border: 1px solid black;}";
				stylecontent += "	.right-title	{$cp{diffColorer.sbs_right-title};padding: 5px; padding-top:0; padding-bottom:0; margin:0; overflow:auto; border: 1px solid black;}";
				stylecontent += "	.left .addline	{$cp{diffColorer.sbs_emptyLine	};width:100%; color: green; margin-right:5px;}";
				stylecontent += "	.right .delline	{$cp{diffColorer.sbs_emptyLine	};width:100%; color: green;}";

				return dom.createElement("style", null, pcp(stylecontent));
			}(),
			dom.createDocumentFragment(
				dom.createElement("pre", {id:'log', 'class':'log'}, il.log),
				il.files.map(function(file) {
						return dom.createElement(
							"table", {'class':'file-diff', title:file.common_name, id:file.id, width:"99%", align:"center"},
							dom.createElement(
								"tr", {},
								dom.createElement(
									"td", {colspan:2},
									dom.createElement(
										"pre", {'class':'title'},
										file.title
									)
								)
							),
							dom.createElement(
								"tr", {'class':'pre-code'},
								dom.createElement(
									"td", {colspan:2},
									dom.createElement(
										"pre", {'class':'pre-code'},
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
					"pre", {},
					il.postfix || ""
				)
			)
		];

		function side_by_side_file(file) {
			var old_version = (file['old'].version) ? "\t" + file['old'].version : "";
			var new_version = (file['new'].version) ? "\t" + file['new'].version : "";

			return [
				dom.createElement(
					"tr", {},
					dom.createElement(
						"td", {valign:'top', width:'50%'},
						dom.createElement(
							'pre', {'class':'left', style: 'padding:0'},
							dom.createElement('div', {'class':'delline', style: 'padding:5px'}, file['old'].name + old_version))
					),
					dom.createElement(
						"td", {valign:'top', width:'50%'},
						dom.createElement(
							'pre', {'class':'right', style: 'padding:0'},
							dom.createElement('div', {'class':'addline', style: 'padding:5px'}, file['new'].name + new_version))
					)
				),
				me.ilUtils.chunksMap(file, function(old_chunk, new_chunk) {
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
									oldCodeDecorated += "<div class='addline'>" + oldPadding[i] + "</div>";
									newCodeDecorated += "<div class='addline' title='" + file['new'].name + ":" + newLine + "'>" + newCodeLine + "</div>";
									newLine++;
									break;
								case "D": //Deleted
									newCodeDecorated += "<div class='delline'>" + newPadding[i] + "</div>";
									oldCodeDecorated += "<div class='delline' title='" + file['old'].name + ":" + oldLine + "'>" + oldCodeLine + "</div>";
									oldLine++;
									break;
								case "C": //Changed
									oldCodeDecorated += "<div class='delline' title='" + file['old'].name + ":" + oldLine + "'>" + oldCodeLine + "</div>";
									newCodeDecorated += "<div class='addline' title='" + file['new'].name + ":" + newLine + "'>" + newCodeLine + "</div>";
									newLine++;
									oldLine++;
									break;
								case "S": //the Same
									oldCodeDecorated += "<div class='steadyline' title='" + file['old'].name + ":" + oldLine + "'>" + oldCodeLine + "</div>";
									newCodeDecorated += "<div class='steadyline' title='" + file['new'].name + ":" + newLine + "'>" + newCodeLine + "</div>";
									newLine++;
									oldLine++;
									break;
							}
						}

						if (old_chunk.doesnt_have_new_line && !new_chunk.doesnt_have_new_line) {
							newCodeDecorated += "<div class='addline' title='" + file['new'].name + ":" + newLine + "'> </div>";
							oldCodeDecorated += "<div class='addline' title='" + file['old'].name + "'> </div>";
						}

						if (!old_chunk.doesnt_have_new_line && new_chunk.doesnt_have_new_line) {
							newCodeDecorated += "<div class='delline' title='" + file['new'].name + "'> </div>";
							oldCodeDecorated += "<div class='delline' title='" + file['old'].name + ":" + oldLine + "'> </div>";
						}

						return [
							dom.createElement(
								"tr", {'class':'linetag'},
								dom.createElement("td", {colspan:2},
												  "@@ -" + old_chunk.line +
												  "," + me.ilUtils.calcLineCounts(old_chunk.code) +
												  " +" +new_chunk.line +
												  "," + me.ilUtils.calcLineCounts(new_chunk.code) +
												  " @@")
							),
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
						"td", {valign:'top', width:'50%'},
						dom.createElement(
							'pre', {'class':sideClass, style: 'padding:0'},
							dom.createElement('div', {'class':changedClass, style: 'padding:5px'}, file[side].name + version))
					)
				),
				file[side].chunks.map(function(chunk) {
						function getDecoratedLine(decoratedClass, code, line) {
							return "<div class='" + decoratedClass + "' title='" + file[side].name + ":" + line + "'>" + code + "</div>";
						}

						var codeDecorated = "";
						var line = chunk.line;

						var code = chunk.code;

						var l = chunk.code.length;

						for (var i=0; i < l; ++i) {
							var codeLine = code[i];

							if ( codeLine == "" ) {
								codeLine = " ";
							}

							switch( chunk.status[i] ) {
								case "A": //Added
								case "D": //Deleted
								case "C": //Changed
									if (ignoredTag != chunk.status[i]) {
										codeDecorated += getDecoratedLine(changedClass, codeLine, line);
										line++;
									}
									break;
								case "S": //the Same
									codeDecorated += getDecoratedLine('steadyline', codeLine, line);
									line++;
									break;
							}

						}

						if (chunk.doesnt_have_new_line) {
							codeDecorated += "<div class='steadyline' title='" + file[side].name + "'>\\ No newline at end of file</div>";
						}

						return [
							dom.createElement(
								"tr", {'class':'linetag'},
								dom.createElement("td", {},
												  "@@ " + anchorSign + chunk.line +
												  "," + me.ilUtils.calcLineCounts(chunk.code) +
												  " @@")
							),
							dom.createElement(
								"tr", {'class':'diffs'},
								dom.createElement(
									"td", {valign:'top', width:'50%'},
									createCodeElement(sideClass, codeDecorated)
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
