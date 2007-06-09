
colorediffsGlobal.views["context"] = {
 render: function(il, pref, dom) {
		function createCodeElement(side, code) {
			var e = dom.createElement("pre", {'class':side}, code);
			e.addEventListener("scroll", function(evt) {colorediffsGlobal.scrollCallback(evt);}, false);
			return e;
		}

		return [
			function() {
				var colorStyle = function(style, prop) {
					return "." + style + " {" + pref.getColorProps(prop) + "}\n";
				}

				var stylecontent = "";

				stylecontent += colorStyle("linetag", "diffColorer.c_anchor");
				stylecontent += colorStyle("addline", "diffColorer.c_addedLine");
				stylecontent += colorStyle("delline", "diffColorer.c_deletedLine");
				stylecontent += colorStyle("steadyline", "diffColorer.c_steadyLine");
				stylecontent += colorStyle("title", "diffColorer.c_title");
				stylecontent += colorStyle("precode", "diffColorer.c_precode");
				//stylecontent += ".addline {color: red;}\n";
				stylecontent += "pre {font-family:monospace;}\n";
				stylecontent += ".linetag, .diffs, .addline, .delline, .precode {margin:0;}\n";
				return dom.createElement("style", null, stylecontent);
			}(),
			dom.createDocumentFragment(
				dom.createElement("pre", {id:'log', 'class':'log'}, il.log),
				il.files.map(function(file) {
						return dom.createElement(
							"div", {'class':'file-diff', title:file.name, id:file.name, width:"100%"},
							dom.createElement(
								"pre", {'class':'title'},
								file.title
							),
							dom.createElement(
								"pre", {'class':'precode'},
								file.precode
							),
							dom.createElement(
								"pre", {'class':'delline'},
								"*** " + file.name
							),
							dom.createElement(
								"pre", {'class':'addline'},
								"--- " + file.name
							),
							//precode,
							file.chunks.map(function(chunk) {
									var oldCodeDecorated = [];
									var newCodeDecorated = [];

									var oldCodeDecoratedDelayed = [];
									var newCodeDecoratedDelayed = [];

									var oldLine = chunk['old'].line;
									var newLine = chunk['new'].line;

									var oldCode = chunk['old'].code.concat([]); //copy array
									var newCode = chunk['new'].code.concat([]); //copy array

									if (chunk['old'].doesnt_have_new_line != chunk['new'].doesnt_have_new_line) {
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

											oldCodeDecorated.push("<div class='steadyline' title='" + file.name + ":" + oldLine + "'>  " + line +" </div>");
											newCodeDecorated.push("<div class='steadyline' title='" + file.name + ":" + newLine + "'>  " + line +" </div>");

											newLine++;
											oldLine++;
										} else {
											if ( newCode[i] != null ) {
												var line = newCode[i];
												newCodeDecoratedDelayed.push("<div class='addline' title='" + file.name + ":" + newLine + "'>+ " + line +" </div>");
												newLine++;
											}
											if ( oldCode[i] != null ) {
												var line = oldCode[i];
												oldCodeDecoratedDelayed.push("<div class='delline' title='" + file.name + ":" + oldLine + "'>- " + line +" </div>");
												oldLine++;
											}
										}
									}

									oldCodeDecorated.pop(); newCodeDecorated.pop();

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
										dom.createElement(
											"pre", {'class':'linetag'},
											"*** " +
											chunk['old'].line +
											"," + colorediffsGlobal.ilUtils.calcLineCounts(chunk['old'].code) +
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
											chunk['new'].line +
											"," + colorediffsGlobal.ilUtils.calcLineCounts(chunk['new'].code) +
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
							)
						);
					}
				)
			)
		];


//				//put precode
//				var left;
//				var right;

//				var string = file.precode;

//				string = string.replace(/^(\+{3}.*)$/mg, function(str, p1) {right = p1; return '';});
//				string = string.replace(/^(\-{3}.*)$/mg, function(str, p1) {left = p1; return '';});
//				string = string.replace(/\n+$/, '');

//				if (left && right) {
//					html += "<tr><td valign='top' width='50%' class='left-title'>" + left + "</td><td valign='top' class='right-title'>" + right + "</td></tr><tr><td colspan='2'><pre class='pre-code'>" + string + "</pre></td></tr>";
//				}

	},
	getPropertyPageId: function() {return "context-view-options";}
};
