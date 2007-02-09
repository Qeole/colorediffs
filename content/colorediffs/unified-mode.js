function unifiedMode() {
	this.decorateLog = function(string) {
		return "<div class='log'>"+string+"</div>";
	}

	this.decorateTitle = function(string) {
		return "<div class='title'>"+string+"</div>";
	}

	this.decoratePrecode = function(string) {
		return "<div class='pre-code'>"+string+"</div>";
	}

	this.decorateFile = function(string, filename) {
		string = string.replace(/^(\+{3}.*\d+\.\d+)$/mg, "<span class='addline'>$1</span>" );
		string = string.replace(/^(\-{3}.*\d+\.\d+)$/mg, "<span class='delline'>$1</span>" );
		return "<div class='file-diff' title='" + filename + "'>" + string + "</div>";
	}

	this.decorateAnchor = function(string) {
		return "<div class='linetag'>"+string+"</div>";
	}

	this.decorateDiff = function(string, filename, left_line, right_line) {
		string = string.replace(/^(\+[^+].*)$/mg, "<span class='addline'>$1</span>" );
		string = string.replace(/^(\-[^-].*)$/mg, "<span class='delline'>$1</span>" );
		string = string.replace(/^( .*)$/mg, "<span class='steadyline'>$1</span>" );
		return string;
	}

	this.getStyle = function(pref) {
		var stylecontent = "";

		stylecontent += ".linetag {color: " + pref.getCharPref("diffColorer.anchor_fg")
					 + ";background-color: " + pref.getCharPref("diffColorer.anchor_bg") + ";}\n";
		stylecontent += ".addline {color: " + pref.getCharPref("diffColorer.addedLine_fg")
					 + ";background-color: " + pref.getCharPref("diffColorer.addedLine_bg") + ";}\n";
		stylecontent += ".delline {color: " + pref.getCharPref("diffColorer.deletedLine_fg")
					 + ";background-color: " + pref.getCharPref("diffColorer.deletedLine_bg") + ";}\n";
		stylecontent += ".steadyline {color: " + pref.getCharPref("diffColorer.steadyLine_fg")
					 + ";background-color: " + pref.getCharPref("diffColorer.steadyLine_bg") + ";}\n";
		stylecontent += ".title {color: " + pref.getCharPref("diffColorer.title_fg")
					 + ";background-color: " + pref.getCharPref("diffColorer.title_bg") + ";}\n";
		//stylecontent += ".addline {color: red;}\n";
		stylecontent += "pre {font-family:monospace;}\n";
		return stylecontent;
	}
}
