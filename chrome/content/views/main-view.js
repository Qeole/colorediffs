colorediffsGlobal.render = function(il, pref, dom) {
	return colorediffsGlobal.views[pref.mode.get()].render(il, pref, dom);
}
