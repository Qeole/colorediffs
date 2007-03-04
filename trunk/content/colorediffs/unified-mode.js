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
		var colorStyle = function(style, prop) {
			return "." + style + " {" + getColorProps(prop) + "}\n";
		}

		var stylecontent = "";

		stylecontent += colorStyle("linetag", "diffColorer.anchor");
		stylecontent += colorStyle("addline", "diffColorer.addedLine");
		stylecontent += colorStyle("delline", "diffColorer.deletedLine");
		stylecontent += colorStyle("steadyline", "diffColorer.steadyLine");
		stylecontent += colorStyle("title", "diffColorer.title");
		//stylecontent += ".addline {color: red;}\n";
		stylecontent += "pre {font-family:monospace;}\n";
		return stylecontent;
	}
}
