if (!colorediffsGlobal) {
	var colorediffsGlobal = new Object();
}

var globalPref;

function setUp() {
	colorediffsGlobal.getPrefs = function() {
		globalPref = new function() {
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

		return globalPref;
	}
	colorediffsGlobal.temp();
}

function testProps() {
	var me = colorediffsGlobal;

	var checkProp = function(prop, value, desc, name, getter) {
		assertFalse(desc + " has before", prop.has());
		prop.set(value);
		assertTrue(desc + " has after", prop.has());
		assertEquals(desc + " check", value, prop.get());
		assertEquals(desc + " pref check", value, getter(name));
	}

	var checkCharProp = function(prop, desc, name) {
		var randString = "abcdefghsadgjdflkgjxlkcvjlkxcvsadfawef";

		var value = randString[Math.floor(Math.random() * randString.length)];

		checkProp(prop, value, desc, name, function(n) {return globalPref.getCharPref(n)});
	}

	var checkBoolProp = function(prop, desc, name) {
		var value = Math.random() > 0.5;
		checkProp(prop, value, desc, name, function(n) {return globalPref.getBoolPref(n)});
	}

	checkCharProp(me.mode, "mode", "diffColorer.view-mode");
	checkCharProp(me.debugDir, "debug dir", "diffColorer.debug-dir");

	checkBoolProp(me.showWhiteSpace, "show whitespaces", "diffColorer.show-whitespace");
	checkBoolProp(me.showToolbar, "show toolbar", "diffColorer.show-toolbar");
}

function testColorProps() {
	var me = colorediffsGlobal;

	me.setColorBG("b", "a");
	assertEquals("check get bg color", "a", me.getColorBG("b"));
	assertEquals("check set bg color", "a", globalPref.getCharPref("b_bg"));

	me.setColorFG("c", "d");
	assertEquals("check get fg color", "d", me.getColorFG("c"));
	assertEquals("check set fg color", "d", globalPref.getCharPref("c_fg"));
}


function testCSSColorProps() {
	var me = colorediffsGlobal;

	me.setColorBG("b", "a");
	me.setColorFG("b", "d");

	assertEquals("check CSS color props", "color: d;background-color: a;", me.getColorProps("b"));
}
