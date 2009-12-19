if (!colorediffsGlobal) {
	var colorediffsGlobal = {
		parsers:{},
		transformations:{},
		views:{}
	};
}

colorediffsGlobal.$ = function(id) {
	return document.getElementById(id);
};

colorediffsGlobal.$R = function(f) {
	return f();
};

colorediffsGlobal.getMessagePane = function() {
	if (!this.gmessagePane) {
		this.gmessagePane = this.$("messagepane");
	}

	return this.gmessagePane;
};

colorediffsGlobal.isActive = function(m) {
	var node = colorediffsGlobal.$("colorediff-mode");
	if ( node ) {
		return node.value;
	} else {
		return false;
	}
};

colorediffsGlobal.setActive = function(m) {
	colorediffsGlobal.$("colorediff-mode").value = m;
};

String.prototype.pad = function(l, s) {
	if (!s) s = " ";

	if ( this.length < l ) {
		var padding = new Array(Math.ceil((l - this.length)/s.length) + 1);

		return this.concat(padding.join(s));
	} else {
		return this;
	}
};

String.prototype.trim = function(s) {
	if (!s) s = "\\s";
	return this.replace(new RegExp("^" + s + "*|" + s + "*$", "g"), "");
};

String.prototype.ltrim = function(s) {
	if (!s) s = "\\s";
	return this.replace(new RegExp("^" + s + "*", "g"), "");
};

colorediffsGlobal.isUpperCaseLetter = function(c) {
	return /^[A-Z]$/.test(c);
};

colorediffsGlobal.getPrefs = function() {
	return Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
};

colorediffsGlobal.htmlToPlainText = function(html) {
	var texts = html.split(/(<\/?[^>]+>)/);
	var text = texts.map(function(string) {
			if (string.length > 0 && string[0] == '<') {
				//replace smileys
				var regExpRes = string.match(/^<img.*?alt\s*=\s*['"](.*)["']/i);
				if (regExpRes) {
					return regExpRes[1];
				} else {
					return "";
				}
			} else {
				//return string;
				return string.replace(/&([^;]+);/g, function(str, p1) {
						switch (p1) {
							case "nbsp": return " ";
							case "amp": return "&";
							case "lt": return "<";
							case "gt": return ">";
							case "quot": return '"';
						}
						return " ";
					});
			}
	}).join("");

	return text;
};

colorediffsGlobal.escapeHTML = function(text) {
	text = text.replace("&", "&amp;", "g");
	text = text.replace("<", "&lt;", "g");
	text = text.replace(">", "&gt;", "g");
	text = text.replace('"', "&quot;", "g");
	return text;
};

colorediffsGlobal.fold = function(a, fun, o) {
	var l = a.length;
	for (var i=0; i < l; ++i) {
		o = fun(a[i], o);
	}
	return o;
};

