if (!colorediffsGlobal) {
	var colorediffsGlobal = {}
}

colorediffsGlobal.sideBySideMode = function() {

	this.decorateLog = function(string) {
		if (string == "" ) {
			return "";
		} else {
			return "<pre id='log' class='log'>"+string+"</pre>";
		}
	}

	this.decorateTitle = function(string) {
		return "<tr class='title'><td colspan='2'><pre class='title'>"+string+"</pre></td></tr>";
	}

	this.decoratePrecode = function(string) {
		var left;
		var right;

		string = string.replace(/^(\+{3}.*)$/mg, function(str, p1) {right = p1; return '';});
		string = string.replace(/^(\-{3}.*)$/mg, function(str, p1) {left = p1; return '';});
		string = string.replace(/\n+$/, '');

		if (left && right) {
			return "<tr><td valign='top' width='50%' class='left-title'>" + left + "</td><td valign='top' class='right-title'>" + right + "</td></tr><tr><td colspan='2'><pre class='pre-code'>" + string + "</pre></td></tr>";
		} else {
			return "";
		}
	}

	this.decorateFile = function(string, filename) {
		return "<table class='file-diff' title='" + filename + "'>" + string + "</table>";
	}

	this.decorateAnchor = function(string) {
		return "<tr class='linetag'><td colspan='2'>"+string+"</td></tr>";
	}

	this.decorateDiff = function(string, filename, left_line, right_line) {
		var decorate = function(tag, str, line) {
			switch(tag) {
				case "d": return "<div class='delline' title='" + filename + ":" + line + "'>"+ str +" </div>";
				case "a": return "<div class='addline' title='" + filename + ":" + line + "'>"+ str +" </div>";
				case "s": return "<div class='steadyline' title='" + filename + ":" + line + "'>"+str+" </div>"
				case "A": return "<div class='addline'>" + str + "</div>";
				case "D": return "<div class='delline'>" + str + "</div>";
			}
			return "";
		}

		//split code
		var left = [];
		var right = [];
		var lines = string.split("\n");
		lines.push("");
		for (var i=0; i < lines.length; i++) {
			if (/^\-(.*)$/.test(lines[i])) {
				left.push("d" + lines[i].substring(1));
			} else if (/^\+(.*)$/.test(lines[i])) {
				right.push("a" + lines[i].substring(1));
			} else {
				if ( left.length < right.length ) {
					for (var k = left.length; k < right.length; k++) {
						left.push("A ");
					}
				} else if ( left.length > right.length ) {
					for (var k = right.length; k < left.length; k++) {
						right.push("D ");
					}
				}
				left.push("s" + lines[i].substring(1));
				right.push("s" + lines[i].substring(1));
			}
		}
		left.pop(); right.pop();

		var decoratedLeft = [];
		var decoratedRight = [];

		for (var i=0; i < left.length; i++) {
			var maxLength = Math.max(left[i].length, right[i].length);

			decoratedLeft.push(decorate(left[i][0], left[i].substring(1).pad(maxLength), (colorediffsGlobal.isUpperCaseLetter(left[i][0]))?left_line:left_line++ ));
			decoratedRight.push(decorate(right[i][0], right[i].substring(1).pad(maxLength), (colorediffsGlobal.isUpperCaseLetter(right[i][0]))?right_line:right_line++));
		}

		return "<tr class='diffs'><td valign='top'><pre class='left'>"+decoratedLeft.join("")+"</pre></td><td valign='top'><pre class='right'>"+decoratedRight.join("")+"</pre></td></tr>";
	}

	this.getStyle = function() {
		var stylecontent = "";

		stylecontent += "	.log {" + colorediffsGlobal.getColorProps("diffColorer.sbs_log") + " padding: 5px; border: 1px solid black;}";
		stylecontent += "	.file-diff {" + colorediffsGlobal.getColorProps("diffColorer.sbs_file-diff") + " padding: 3px;margin:5px;}";
		stylecontent += "	.title {" + colorediffsGlobal.getColorProps("diffColorer.sbs_title") + "padding: 3px;clear:left;}";
		stylecontent += "	.pre-code {" + colorediffsGlobal.getColorProps("diffColorer.sbs_precode") + "margin:0;}";
		stylecontent += "	.addline {" + colorediffsGlobal.getColorProps("diffColorer.sbs_addedLine") + "}";
		stylecontent += "	.delline {" + colorediffsGlobal.getColorProps("diffColorer.sbs_deletedLine") + "}";
		stylecontent += "	.linetag {" + colorediffsGlobal.getColorProps("diffColorer.sbs_anchor") + "text-align:center;clear:left;}";
		stylecontent += "	.steadyline {" + colorediffsGlobal.getColorProps("diffColorer.sbs_steadyLine") + "}";
		stylecontent += "	.left {" + colorediffsGlobal.getColorProps("diffColorer.sbs_left") + "padding: 5px; margin:0; overflow:auto; border: 1px solid black;}";
		stylecontent += "	.right {" + colorediffsGlobal.getColorProps("diffColorer.sbs_right") + "padding: 5px; margin:0; overflow:auto; border: 1px solid black;}";
		stylecontent += "	.left-title {" + colorediffsGlobal.getColorProps("diffColorer.sbs_left-title") + "padding: 5px; padding-top:0; padding-bottom:0; margin:0; overflow:auto; border: 1px solid black;}";
		stylecontent += "	.right-title {" + colorediffsGlobal.getColorProps("diffColorer.sbs_right-title") + "padding: 5px; padding-top:0; padding-bottom:0; margin:0; overflow:auto; border: 1px solid black;}";
		stylecontent += "	.left .addline {" + colorediffsGlobal.getColorProps("diffColorer.sbs_emptyLine") + "width:100%; color: green; margin-right:5px;}";
		stylecontent += "	.right .delline {" + colorediffsGlobal.getColorProps("diffColorer.sbs_emptyLine") + "width:100%; color: green;}";
		return stylecontent;
	}
}
