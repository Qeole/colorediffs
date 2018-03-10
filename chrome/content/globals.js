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

colorediffsGlobal.pad = function(string, l, s) {
	if (!s) s = " ";

	if ( string.length < l ) {
		var padding = new Array(Math.ceil((l - string.length)/s.length) + 1);

		return string.concat(padding.join(s));
	} else {
		return string;
	}
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

colorediffsGlobal.outerHtml = function(dom_node, innerHtml) {
	var html = "<" + dom_node.tagName;
	if (dom_node.hasAttributes()) {
		var attributes = dom_node.attributes;
		var attributes_length = attributes.length;
		for (let i = 0; i < attributes_length; i++) {
			var attribute = attributes[i];
			html += ' ' + attribute.name + '="' + attribute.value.replace('"', '\\"') + '"';
		}
	}
	html += '>' + innerHtml + '</' + dom_node.tagName + '>';
	return html;
};

colorediffsGlobal.stripHtml = function(dom_node) {
	if (dom_node.nodeName == "#text") {
		return colorediffsGlobal.escapeHTML(dom_node.textContent);
	} else if (dom_node.nodeType == 1) {
		if (dom_node.tagName == "BLOCKQUOTE") {
			return dom_node.outerHTML;
		}
		var klass = dom_node.getAttribute("class");
		var text = colorediffsGlobal.stripHtmlList(dom_node.childNodes);
		if (klass != null && (klass.indexOf('moz-txt-link') == 0 || klass.indexOf('moz-smiley') == 0)) {
			text = colorediffsGlobal.outerHtml(dom_node, text);
		}
		return text;
	} else {
		//it's not a real dom node, comment of something similar.
		// better to ignore it
		return "";
	}
};

colorediffsGlobal.stripHtmlList = function(dom_node_list) {
	var text = "";
	var nodes_length = dom_node_list.length;
	for (let i = 0; i < nodes_length; i++) {
		text += colorediffsGlobal.stripHtml(dom_node_list[i]);
	}
	return text;
};

colorediffsGlobal.escapeHTML = function(text) {
	text = text.replace(/&/g, "&amp;");
	text = text.replace(/</g, "&lt;");
	text = text.replace(/>/g, "&gt;");
	text = text.replace(/"/g, "&quot;");
	return text;
};

colorediffsGlobal.unescapeHTML = function(text) {
	text = text.replace(/&amp;/g, "&");
	text = text.replace(/&lt;/g, "<");
	text = text.replace(/&gt;/g, ">");
	text = text.replace(/&quot;/g, '"');
	text = text.replace(/&nbsp;/g, ' ');
	return text;
};

colorediffsGlobal.fold = function(a, fun, o) {
	var l = a.length;
	for (var i=0; i < l; ++i) {
		o = fun(a[i], o);
	}
	return o;
};

