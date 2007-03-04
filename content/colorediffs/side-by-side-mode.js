function sideBySideMode() {

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

		return "<tr><td valign='top' width='50%' class='left-title'>" + left + "</td><td valign='top' class='right-title'>" + right + "</td></tr><tr><td colspan='2'><pre class='pre-code'>" + string + "</pre></td></tr>";
	}

	this.decorateFile = function(string, filename) {
		return "<table class='file-diff' title='" + filename + "'>" + string + "</table>";
	}

	this.decorateAnchor = function(string) {
		return "<tr class='linetag'><td colspan='2'>"+string+"</td></tr>";
	}

	this.decorateDiff = function(string, filename, left_line, right_line) {
		//split code
		var left = [];
		var right = [];
		var lines = string.split("\n");
		lines.push("");
		for (var i=0; i < lines.length; i++) {
			if (/^\-(.*)$/.test(lines[i])) {
				left.push("<div class='delline' title='" + filename + ":" + left_line++ + "'>"+ lines[i].substring(1) +" </div>");
			} else if (/^\+(.*)$/.test(lines[i])) {
				right.push("<div class='addline' title='" + filename + ":" + right_line++ + "'>"+lines[i].substring(1)+" </div>");
			} else {
				if ( left.length < right.length ) {
					for (var k = left.length; k < right.length; k++) {
						left.push("<div class='addline'> </div>");
					}
				} else if ( left.length > right.length ) {
					for (var k = right.length; k < left.length; k++) {
						right.push("<div class='delline'> </div>");
					}
				}
				left.push("<div class='steadyline' title='" + filename + ":" + left_line++ + "'>"+lines[i].substring(1)+" </div>");
				right.push("<div class='steadyline' title='" + filename + ":" + right_line++ + "'>"+lines[i].substring(1)+" </div>");
			}
		}
		left.pop(); right.pop();
		return "<tr><td valign='top'><pre class='left'>"+left.join("")+"</pre></td><td valign='top'><pre class='right'>"+right.join("")+"</pre></td></tr>";
	}

	this.getStyle = function(pref) {
		var stylecontent = "";

		stylecontent += "	.log {" + getColorProps("diffColorer.sbs_log") + " padding: 5px; border: 1px solid black;}";
		stylecontent += "	.file-diff {" + getColorProps("diffColorer.sbs_file-diff") + " padding: 3px;margin:5px;}";
		stylecontent += "	.title {" + getColorProps("diffColorer.sbs_title") + "padding: 3px;clear:left;}";
		stylecontent += "	.pre-code {" + getColorProps("diffColorer.sbs_precode") + "margin:0;}";
		stylecontent += "	.addline {" + getColorProps("diffColorer.sbs_addedLine") + "}";
		stylecontent += "	.delline {" + getColorProps("diffColorer.sbs_deletedLine") + "}";
		stylecontent += "	.linetag {" + getColorProps("diffColorer.sbs_anchor") + "text-align:center;clear:left;}";
		stylecontent += "	.steadyline {" + getColorProps("diffColorer.sbs_steadyLine") + "}";
		stylecontent += "	.left {" + getColorProps("diffColorer.sbs_left") + "padding: 5px; margin:0; overflow:auto; border: 1px solid black;}";
		stylecontent += "	.right {" + getColorProps("diffColorer.sbs_right") + "padding: 5px; margin:0; overflow:auto; border: 1px solid black;}";
		stylecontent += "	.left-title {" + getColorProps("diffColorer.sbs_left-title") + "padding: 5px; padding-top:0; padding-bottom:0; margin:0; overflow:auto; border: 1px solid black;}";
		stylecontent += "	.right-title {" + getColorProps("diffColorer.sbs_right-title") + "padding: 5px; padding-top:0; padding-bottom:0; margin:0; overflow:auto; border: 1px solid black;}";
		stylecontent += "	.left .addline {" + getColorProps("diffColorer.sbs_emptyLine") + "width:100%; color: green; margin-right:5px;}";
		stylecontent += "	.right .delline {" + getColorProps("diffColorer.sbs_emptyLine") + "width:100%; color: green;}";
		return stylecontent;
	}
}
