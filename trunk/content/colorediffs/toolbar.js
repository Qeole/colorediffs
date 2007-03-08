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
		colorediffsGlobal.mode.set(colorediffsGlobal.$('colorediffs-view-mode').selectedItem.value);
		MsgReload();
	},

	toggleWhiteSpaces: function () {
		colorediffsGlobal.showWhiteSpace.set(!colorediffsGlobal.showWhiteSpace.get());
		colorediffsGlobal.$('colorediffs-show-whitespaces').checked=!colorediffsGlobal.$('colorediffs-show-whitespaces').checked;

		this.reloadWithScrollPreserved();
	},

	closeToolbar: function() {
		colorediffsGlobal.showToolbar.set(false);
		colorediffsGlobal.$('colorediffs-toolbar').hidden=true
	},

	initToolbar: function () {
		if (colorediffsGlobal.showToolbar.get()) {
			//check if should be shown
			if (!colorediffsGlobal.isActive()) {
				colorediffsGlobal.$('colorediffs-toolbar').hidden=true;
			} else {
				colorediffsGlobal.$('colorediffs-toolbar').hidden=false;
				colorediffsGlobal.$('colorediffs-show-whitespaces').checked = colorediffsGlobal.showWhiteSpace.get();

				//update combobox
				var menulist = colorediffsGlobal.$('colorediffs-view-mode');
				var items = menulist.firstChild.childNodes;
				for( var i=0; i < items.length; i++ ) {
					if ( items[i].value == colorediffsGlobal.mode.get() ) {
						menulist.selectedItem = items[i];
						break;
					}
				}
			}
		}
	}
}
