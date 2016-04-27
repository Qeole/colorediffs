importFile("../prefs.js");
importFile("prefHelper.js");

test.props = function() {
    var me = new colorediffsGlobal.Pref(globalPref);

    var checkProp = function(prop, value, name, getter) {
	assert.that(prop.has(), is.False());
	prop.set(value);
	assert.that(prop.has(), is.True());
	assert.that(prop.get(), is.eq(value));
	assert.that(getter(name), is.eq(value));
    };

    var checkCharProp = function(prop, name) {
	var randString = "abcdefghsadgjdflkgjxlkcvjlkxcvsadfawef";
	var value = randString[Math.floor(Math.random() * randString.length)];

	checkProp(prop, value, name, function(n) {return globalPref.getCharPref(n);});
    };

    var checkBoolProp = function(prop, name) {
	var value = Math.random() > 0.5;
	checkProp(prop, value, name, function(n) {return globalPref.getBoolPref(n);});
    };

    checkCharProp(me.mode, "diffColorer.view-mode");
    checkCharProp(me.debugDir, "diffColorer.debug-dir");

    checkBoolProp(me.showWhiteSpace, "diffColorer.show-whitespace");
    checkBoolProp(me.showToolbar, "diffColorer.show-toolbar");
};

test.colorProps = function() {
    var me = new colorediffsGlobal.Pref(globalPref);

    me.setColorBG("b", "a");
    assert.that(me.getColorBG("b"), is.eq("a"));
    assert.that(globalPref.getCharPref("b_bg"), is.eq("a"));

    me.setColorFG("c", "d");
    assert.that(me.getColorFG("c"), is.eq("d"));
    assert.that(globalPref.getCharPref("c_fg"), is.eq("d"));
};


test.CSSColorProps = function() {
    var me = new colorediffsGlobal.Pref(globalPref);

    me.setColorBG("b", "a");
    me.setColorFG("b", "d");

    assert.that(me.getColorProps("b"), is.eq("color: d;background-color: a;"));
};
