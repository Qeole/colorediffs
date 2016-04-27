if (!colorediffsGlobal) {
    var colorediffsGlobal = {};
}

colorediffsGlobal.Pref = function (prefModel) {
	var me = this;
	var pref = prefModel;

	var createGetSet = function(name, prop_name, getter, setter) {
		me[name] = {
			get: function() { return getter(prop_name); },
			set: function(value) { setter(prop_name, value); },
			has: function () {return pref.prefHasUserValue(prop_name);}
		};
	};

	var createBoolGetSet = function(name, prop_name) {
		var getBoolPref = function(p) {
			return pref.getBoolPref(p);
		};

		var setBoolPref = function(p, v) {
			return pref.setBoolPref(p, v);
		};

		createGetSet(name, prop_name, getBoolPref, setBoolPref);
	};

	var createIntGetSet = function(name, prop_name) {
		var getIntPref = function(p) {
			return pref.getIntPref(p);
		};

		var setIntPref = function(p, v) {
			return pref.setIntPref(p, v);
		};

		createGetSet(name, prop_name, getIntPref, setIntPref);
	};

	var getCharPref = function(p) {
		return pref.getCharPref(p);
	};

	var setCharPref = function(p, v) {
		pref.setCharPref(p, v);
	};

	var createCharGetSet = function(name, prop_name) {
		createGetSet(name, prop_name, getCharPref, setCharPref);
	};

	var getProperty = function(prop, color) {
		var v = getCharPref(color);
		if (v) {
			return prop + ": " + v + ";";
		} else {
			return "";
		}
	};

	me.getColorProps = function(baseName) {
		return getProperty("color", baseName + "_fg") + getProperty("background-color", baseName + "_bg");
	};

	me.getColorBG = function(baseName) {
		return getCharPref(baseName + "_bg");
	};

	me.getColorFG = function(baseName) {
		return getCharPref(baseName + "_fg");
	};

	me.setColorBG = function(baseName, value) {
		setCharPref(baseName + "_bg", value);
	};

	me.setColorFG = function(baseName, value) {
		setCharPref(baseName + "_fg", value);
	};


	createCharGetSet("mode", "diffColorer.view-mode");
	createCharGetSet("debugDir", "diffColorer.debug-dir");
	createBoolGetSet("showWhiteSpace", "diffColorer.show-whitespace");
	createBoolGetSet("showToolbar", "diffColorer.show-toolbar");
	createBoolGetSet("instantApply", "browser.preferences.instantApply");

	createIntGetSet("parserMaxTitleSize", "diffColorer.parser.max-title-size");
	createIntGetSet("parserMinTitleDelimiterCharsCount", "diffColorer.parser.min-title-delimiter-chars-count");
	createIntGetSet("parserMaxAdditionalInfoSize", "diffColorer.parser.max-additional-info-size");
	createIntGetSet("parserMaxPostfixSize", "diffColorer.parser.max-postfix-size");

	createCharGetSet("diffMode", "diffColorer.diff-mode");
	createBoolGetSet("showLineNumbers", "diffColorer.show-line-numbers");

	createBoolGetSet("preferHtml", "mailnews.display.prefer_plaintext");

	createIntGetSet("tabSize", "diffColorer.tab-size");
};
