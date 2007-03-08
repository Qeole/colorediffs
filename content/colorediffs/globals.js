if (!colorediffsGlobal) {
	var colorediffsGlobal = new Object();
}

String.prototype.match_perl_like = function(regexp) {
	var res = this.match(regexp);
	if (res) {
		for ( var i = 0; i < res.length; i++ ) {
			eval("$" + i + "='" + escape(res[i]) + "'");
		}
	}
	return res;
}

colorediffsGlobal.$ = function(id) {
	return document.getElementById(id);
}

colorediffsGlobal.getMessagePane = function() {
	if (!this.gmessagePane) {
		this.gmessagePane = this.$("messagepane");
	}

	return this.gmessagePane;
}

colorediffsGlobal.getCharPref = function(p) {
	return this.pref.getCharPref(p);
}

colorediffsGlobal.setCharPref = function(p, v) {
	this.pref.setCharPref(p, v);
}

colorediffsGlobal.getBoolPref = function(p) {
	return this.pref.getBoolPref(p);
}

colorediffsGlobal.setBoolPref = function(p, v) {
	return this.pref.setBoolPref(p, v);
}

colorediffsGlobal.getMode = function() {
	return this.getCharPref('diffColorer.view-mode');
}

colorediffsGlobal.setMode = function(m) {
	this.setCharPref('diffColorer.view-mode', m);
}

colorediffsGlobal.isActive = function(m) {
	return this.$("colorediff-mode").value;
}

colorediffsGlobal.setActive = function(m) {
	this.$("colorediff-mode").value = m;
}

document.getElementsByClassName = function(className, parentElement) {
	var elements = [];
	var qwe = parentElement.getElementsByTagName("*");
	for (var i = 0; i < qwe.length; i++) {
		if (qwe[i] && qwe[i].getAttribute("class") === className) {
			elements.push(qwe[i]);
		} else {
			elements = elements.concat(document.getElementsByClassName(className, qwe[i]));
		}
	}

	return elements;
}

colorediffsGlobal.getProperty = function(prop, color) {
	var v = this.pref.getCharPref(color);
	if (v) {
		return prop + ": " + v + ";";
	} else {
		return "";
	}
}

colorediffsGlobal.getColorProps = function(baseName) {
	return this.getProperty("color", baseName + "_fg") + this.getProperty("background-color", baseName + "_bg");
}

String.prototype.pad = function(l, s) {
	if (!s) s = " ";
	var n = this;
	while (l > n.length) {
		n += s;
	}
	return n;
}

colorediffsGlobal.isUpperCaseLetter = function(c) {
	return /^[A-Z]$/.test(c);
}
