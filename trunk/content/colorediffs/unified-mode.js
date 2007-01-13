function unifiedMode() {
	this.decoration = function (string, type) {
		switch(type) {
			case TypeEnum.LOG: return "<div class='log'>"+string+"</div>";
			case TypeEnum.TITLE: return "<div class='title'>"+string+"</div>";
			case TypeEnum.PRECODE: return "<div class='pre-code'>"+string+"</div>";
			case TypeEnum.ONE_DIFF_FILE:
				string = string.replace(/^(\+{3}.*\d+\.\d+)$/mg, "<span class='addline'>$1</span>" );
				string = string.replace(/^(\-{3}.*\d+\.\d+)$/mg, "<span class='delline'>$1</span>" );
				return string;
			case TypeEnum.ANCHOR: return "<div class='linetag'>"+string+"</div>";
			case TypeEnum.DIFF:
				string = string.replace(/^(\+[^+].*)$/mg, "<span class='addline'>$1</span>" );
				string = string.replace(/^(\-[^-].*)$/mg, "<span class='delline'>$1</span>" );
				string = string.replace(/^( .*)$/mg, "<span class='steadyline'>$1</span>" );
				return string;
		}
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
