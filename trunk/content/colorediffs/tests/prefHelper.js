importFile("../prefs.js");

function Pref() {
    var boolPrefs = {};
    var charPrefs = {};
    var intPrefs = {};

    var getPref = function(hash, prop) {
	return hash[prop];
    };

    var setPref = function(hash, prop, value) {
	hash[prop] = value;
    };

    var hasPref = function(prop) {
	return boolPrefs[prop] != undefined || charPrefs[prop] != undefined;
    };

    this.getBoolPref = function(prop) {
	return getPref(boolPrefs, prop);
    };

    this.setBoolPref = function(prop, value) {
	setPref(boolPrefs, prop, value);
    };

    this.getIntPref = function(prop) {
	return getPref(intPrefs, prop);
    };

    this.setIntPref = function(prop, value) {
	setPref(intPrefs, prop, value);
    };

    this.getCharPref = function(prop) {
	return getPref(charPrefs, prop);
    };

    this.setCharPref = function(prop, value) {
	setPref(charPrefs, prop, value);
    };

    this.prefHasUserValue = function(prop) {
	return hasPref(prop);
    };
}

let globalPref = new Pref();
let pref = new colorediffsGlobal.Pref(globalPref);

ignore("globalPref");
ignore("Pref");
ignore("pref");
