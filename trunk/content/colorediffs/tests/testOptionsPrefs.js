importFile("../options/options-pref.js");
importFile("prefHelper.js");

test.props = function() {
    var prefs = new colorediffsGlobal.OptionsPrefModel(globalPref);

    globalPref.setBoolPref("predefined.bool-prop", true);
    globalPref.setCharPref("predefined.char-prop", "yes");

    assert.that(prefs.prefHasUserValue("predefined.bool-prop"), is.True());
    assert.that(prefs.prefHasUserValue("predefined.char-prop"), is.True());

    assert.that(prefs.prefHasUserValue("non-predefined.bool-prop"), is.False());
    assert.that(prefs.prefHasUserValue("non-predefined.char-prop"), is.False());

    prefs.setBoolPref("non-predefined.bool-prop", true);
    prefs.setCharPref("non-predefined.char-prop", "yes");

    assert.that(prefs.getBoolPref("predefined.bool-prop"), is.True());
    assert.that(prefs.getBoolPref("non-predefined.bool-prop"), is.True());

    assert.that(prefs.getCharPref("predefined.char-prop"), is.eq("yes"));
    assert.that(prefs.getCharPref("non-predefined.char-prop"), is.eq("yes"));

    assert.that(globalPref.prefHasUserValue("non-predefined.bool-prop"), is.False());
    assert.that(globalPref.prefHasUserValue("non-predefined.char-prop"), is.False());

    prefs.saveToModel();

    assert.that(globalPref.getBoolPref("predefined.bool-prop"), is.True());
    assert.that(globalPref.getBoolPref("non-predefined.bool-prop"), is.True());

    assert.that(globalPref.getCharPref("predefined.char-prop"), is.eq("yes"));
    assert.that(globalPref.getCharPref("non-predefined.char-prop"), is.eq("yes"));
};
