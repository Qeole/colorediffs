colorediffsGlobal.render = function(il, pref) {
	return colorediffsGlobal.views[pref.mode.get()].render(il, pref);
}
