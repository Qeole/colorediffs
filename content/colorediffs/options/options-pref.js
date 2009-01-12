if (!colorediffsGlobal) {
    colorediffsGlobal = {};
}

colorediffsGlobal.OptionsPrefModel = function(prefModel) {
	var boolPrefs = {};
	var charPrefs = {};
	var intPrefs = {};

	var getPref = function(hash, prop, defFunc) {
		return (hash[prop] != undefined) ? hash[prop] : defFunc(prop);
	};

	var setPref = function(hash, prop, value) {
		hash[prop] = value;
	};

	var hasPref = function(prop) {
		return boolPrefs[prop] != undefined || charPrefs[prop] != undefined || intPrefs[prop] != undefined;;
	};

	this.getBoolPref = function(prop) {
		return getPref(boolPrefs, prop, prefModel.getBoolPref);
	};

	this.setBoolPref = function(prop, value) {
		setPref(boolPrefs, prop, value);
	};

	this.getIntPref = function(prop) {
		return getPref(intPrefs, prop, prefModel.getIntPref);
	};

	this.setIntPref = function(prop, value) {
		setPref(intPrefs, prop, value);
	};

	this.getCharPref = function(prop) {
		return getPref(charPrefs, prop, prefModel.getCharPref);
	};

	this.setCharPref = function(prop, value) {
		setPref(charPrefs, prop, value);
	};

	this.prefHasUserValue = function(prop) {
		return hasPref(prop) || prefModel.prefHasUserValue(prop);
	};

	this.saveToModel = function() {
		for (var b in boolPrefs) {
			prefModel.setBoolPref(b, boolPrefs[b]);
		}

		for (var c in charPrefs) {
			prefModel.setCharPref(c, charPrefs[c]);
		}

		for (var i in intPrefs) {
			prefModel.setIntPref(c, intPrefs[i]);
		}
	};
};
