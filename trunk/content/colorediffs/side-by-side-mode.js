function sideBySideMode() {

	this.decorateLog = function(string) {
		if (string == "" ) {
			return "";
		} else {
			return "<pre id='log' class='log'>"+string+"</pre>";
		}
	}

	this.decorateTitle = function(string) {
		return "<pre class='title'>"+string+"</pre>";
	}

	this.decoratePrecode = function(string) {
		string = string.replace(/^(\+{3}.*)$/mg, "</pre><div class='right-title'>$1</div><pre class='pre-code'>" );
		string = string.replace(/^(\-{3}.*)$/mg, "</pre><div class='left-title'>$1</div><pre class='pre-code'>" );
		return "<pre class='pre-code'>" + string + "</pre>";
	}

	this.decorateFile = function(string, filename) {
		return "<div class='file-diff' tooltiptext='" + filename + "'>" + string + "</div>";
	}

	this.decorateAnchor = function(string) {
		return "<div class='linetag'>"+string+"</div>";
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
		return "<pre class='left'>"+left.join("")+"</pre><pre class='right'>"+right.join("")+"</pre>";
	}

	this.getStyle = function(pref) {
		var stylecontent = "";

		stylecontent += "	.log {color: " + pref.getCharPref("diffColorer.sbs_log_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_log_bg") + "; padding: 5px; border: 1px solid black;}";
		stylecontent += "	.file-diff {color: " + pref.getCharPref("diffColorer.sbs_file-diff_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_file-diff_bg") + "; padding: 3px;}";
		stylecontent += "	.title {color: " + pref.getCharPref("diffColorer.sbs_title_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_title_bg") + "; padding: 3px;clear:left;}";
		stylecontent += "	.pre-code {color: " + pref.getCharPref("diffColorer.sbs_precode_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_precode_bg") + ";}";
		stylecontent += "	.addline {color: " + pref.getCharPref("diffColorer.sbs_addedLine_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_addedLine_bg") + ";}";
		stylecontent += "	.delline {color: " + pref.getCharPref("diffColorer.sbs_deletedLine_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_deletedLine_bg") + ";}";
		stylecontent += "	.linetag {color: " + pref.getCharPref("diffColorer.sbs_anchor_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_anchor_bg") + ";text-align:center;clear:left;}";
		stylecontent += "	.steadyline {color: " + pref.getCharPref("diffColorer.sbs_steadyLine_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_steadyLine_bg") + ";}";
		stylecontent += "	.left {float:left; padding: 5px; margin:0; width:48%;overflow:auto; color: " + pref.getCharPref("diffColorer.sbs_left_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_left_bg") + "; border: 1px solid black;}";
		stylecontent += "	.right {float:right; padding: 5px; margin:0; width:48%;overflow:auto; color: " + pref.getCharPref("diffColorer.sbs_right_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_right_bg") + "; border: 1px solid black;}";
		stylecontent += "	.left-title {float:left; padding: 5px; padding-top:0; padding-bottom:0; margin:0; width:48%;overflow:auto; color: " + pref.getCharPref("diffColorer.sbs_left-title_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_left-title_bg") + "; border: 1px solid black;}";
		stylecontent += "	.right-title {float:right; padding: 5px; padding-top:0; padding-bottom:0; margin:0; width:48%;overflow:auto; color: " + pref.getCharPref("diffColorer.sbs_right-title_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_right-title_bg") + "; border: 1px solid black;}";
		stylecontent += "	.left .addline {width:100%; color: green; margin-right:5px; color: " + pref.getCharPref("diffColorer.sbs_emptyLine_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_emptyLine_bg") + ";}";
		stylecontent += "	.right .delline {width:100%; color: green; color: " + pref.getCharPref("diffColorer.sbs_emptyLine_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_emptyLine_bg") + ";}";
		return stylecontent;
	}
}
