if (!colorediffsGlobal) {
	var colorediffsGlobal = {}
}

colorediffsGlobal.colorediffsToolbar = {
	reloadWithScrollPreserved: function() {
		var mp = colorediffsGlobal.getMessagePane();
		var oldScroll = mp.contentWindow.scrollY;
		mp.addEventListener(
			"load",
			function() {
				mp.contentWindow.scrollTo(0, oldScroll);
				mp.removeEventListener("load", arguments.callee, true);
			},
			true);
		MsgReload();
	},

	selectMode: function () {
		colorediffsGlobal.setMode(colorediffsGlobal.$('colorediffs-view-mode').selectedItem.value);
		MsgReload();
	},

	toggleWhiteSpaces: function () {
		colorediffsGlobal.pref.setBoolPref('diffColorer.show-whitespace', !colorediffsGlobal.pref.getBoolPref('diffColorer.show-whitespace'));
		colorediffsGlobal.$('colorediffs-show-whitespaces').checked=!colorediffsGlobal.$('colorediffs-show-whitespaces').checked;

		this.reloadWithScrollPreserved();
	},

	closeToolbar: function() {
		colorediffsGlobal.pref.setBoolPref('diffColorer.show-toolbar', false);
		colorediffsGlobal.$('colorediffs-toolbar').hidden=true
	},

	initToolbar: function () {
		if (colorediffsGlobal.pref.getBoolPref('diffColorer.show-toolbar')) {
			//check if should be shown
			if (!colorediffsGlobal.isActive()) {
				colorediffsGlobal.$('colorediffs-toolbar').hidden=true;
			} else {
				colorediffsGlobal.$('colorediffs-toolbar').hidden=false;
				colorediffsGlobal.$('colorediffs-show-whitespaces').checked = colorediffsGlobal.pref.getBoolPref('diffColorer.show-whitespace');

				//update combobox
				var menulist = colorediffsGlobal.$('colorediffs-view-mode');
				var items = menulist.firstChild.childNodes;
				for( var i=0; i < items.length; i++ ) {
					if ( items[i].value == colorediffsGlobal.getMode() ) {
						menulist.selectedItem = items[i];
						break;
					}
				}
			}
		}
	}
}
