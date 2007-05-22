var globalPref;

function setUp() {
	function Pref() {
		var boolPrefs = {}
		var charPrefs = {}

		var getPref = function(hash, prop) {
			return hash[prop];
		}

		var setPref = function(hash, prop, value) {
			hash[prop] = value;
		}

		var hasPref = function(prop) {
			return boolPrefs[prop] != undefined || charPrefs[prop] != undefined;
		}

		this.getBoolPref = function(prop) {
			return getPref(boolPrefs, prop);
		}

		this.setBoolPref = function(prop, value) {
			setPref(boolPrefs, prop, value);
		}

		this.getCharPref = function(prop) {
			return getPref(charPrefs, prop);
		}

		this.setCharPref = function(prop, value) {
			setPref(charPrefs, prop, value);
		}

		this.prefHasUserValue = function(prop) {
			return hasPref(prop);
		}
	}

	globalPref = new Pref();
}

function testProps() {
	var prefs = new colorediffsGlobal.OptionsPrefModel(globalPref);

	globalPref.setBoolPref("predefined.bool-prop", true);
	globalPref.setCharPref("predefined.char-prop", "yes");

	assertTrue("test predefined bool has", prefs.prefHasUserValue("predefined.bool-prop"));
	assertTrue("test predefined char has", prefs.prefHasUserValue("predefined.char-prop"));

	assertFalse("test non-predefined bool has", prefs.prefHasUserValue("non-predefined.bool-prop"));
	assertFalse("test non-predefined char has", prefs.prefHasUserValue("non-predefined.char-prop"));

	prefs.setBoolPref("non-predefined.bool-prop", true);
	prefs.setCharPref("non-predefined.char-prop", "yes");

	assertTrue("test predefined bool get", prefs.getBoolPref("predefined.bool-prop"));
	assertTrue("test non-predefined bool get", prefs.getBoolPref("non-predefined.bool-prop"));

	assertEquals("test predefined char get", "yes", prefs.getCharPref("predefined.char-prop"));
	assertEquals("test non-predefined char get", "yes", prefs.getCharPref("non-predefined.char-prop"));

	assertFalse("test non-predefined bool has before sync", globalPref.prefHasUserValue("non-predefined.bool-prop"));
	assertFalse("test non-predefined char has before sync", globalPref.prefHasUserValue("non-predefined.char-prop"));

	prefs.saveToModel();

	assertTrue("test predefined bool get after sync", globalPref.getBoolPref("predefined.bool-prop"));
	assertTrue("test non-predefined bool get after sync", globalPref.getBoolPref("non-predefined.bool-prop"));

	assertEquals("test predefined char get after sync", "yes", globalPref.getCharPref("predefined.char-prop"));
	assertEquals("test non-predefined char get after sync", "yes", globalPref.getCharPref("non-predefined.char-prop"));
}

