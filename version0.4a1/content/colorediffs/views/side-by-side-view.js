
colorediffsGlobal.views["side-by-side"] = {
	render: function(il) {
		var dom = colorediffsGlobal.domHelper;

		function createCodeElement(side, code) {
			var e = dom.createElement("pre", {'class':side}, code.join("\n"));
			e.addEventListener("scroll", function(evt) {colorediffsGlobal.scrollCallback(evt);}, false);
			return e;
		}

		function pcp(str) {
			return str.replace(/\$cp{(.*?)}/g, function(str, prop) {
					return colorediffsGlobal.getColorProps(prop.trim());
				});
		}

		return [
			function() {
				var stylecontent = "";
				stylecontent += "	.log			{$cp{diffColorer.sbs_log		}; padding: 5px; border: 1px solid black;}";
				stylecontent += "	.file-diff		{$cp{diffColorer.sbs_file-diff	}; padding: 3px;margin:5px;}";
				stylecontent += "	.title			{$cp{diffColorer.sbs_title		}; padding: 3px;clear:left;}";
				stylecontent += "	.pre-code		{$cp{diffColorer.sbs_precode	}; margin:0;}";
				stylecontent += "	.addline		{$cp{diffColorer.sbs_addedLine	}}";
				stylecontent += "	.delline		{$cp{diffColorer.sbs_deletedLine}}";
				stylecontent += "	.linetag		{$cp{diffColorer.sbs_anchor		}; text-align:center;clear:left;}";
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
							"table", {'class':'file-diff', title:file.name},
							dom.createElement(
								"tr", {'class':'title'},
								dom.createElement(
									"td", {colspan:2},
									dom.createElement(
										"pre", {'class':'title'},
										file.title
									)
								)
							),
							//precode,
							file.chunks.map(function(chunk) {
									return [
										dom.createElement(
											"tr", {'class':'linetag'},
											dom.createElement("td", {colspan:2}, "@@"+chunk['old'].line + "," +chunk['new'].line +"@@")
										),
										dom.createElement(
											"tr", {'class':'diffs'},
											dom.createElement(
												"td", {valign:'top'},
												createCodeElement('left', chunk['old'].code)
											),
											dom.createElement(
												"td", {valign:'top'},
												createCodeElement('right', chunk['new'].code)
											)
										)
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

	}
};
