if (!colorediffsGlobal) {
	var colorediffsGlobal = {}
}

colorediffsGlobal.colorediffsToolbar = new function() {
	var me = colorediffsGlobal;

	var getNode = function (name) {
		return function() {return me.$(name);}
	}

	var getViewModeNode = getNode('colorediffs-view-mode');
	var getShowWhiteSpacesNode = getNode('colorediffs-show-whitespaces');
	var getToolbarNode = getNode('colorediffs-toolbar');

	var reloadWithScrollPreserved = function() {
		var mp = me.getMessagePane();
		var oldScroll = mp.contentWindow.scrollY;
		mp.addEventListener(
			"load",
			function() {
				mp.contentWindow.scrollTo(0, oldScroll);
				mp.removeEventListener("load", arguments.callee, true);
			},
			true);
		MsgReload();
	}

	this.selectMode = function () {
		me.mode.set(getViewModeNode().selectedItem.value);
		MsgReload();
	}

	this.toggleWhiteSpaces = function () {
		me.showWhiteSpace.set(!me.showWhiteSpace.get());
		getShowWhiteSpacesNode().checked = !getShowWhiteSpacesNode().checked;

		reloadWithScrollPreserved();
	}

	this.closeToolbar = function() {
		me.showToolbar.set(false);
		getToolbarNode().hidden=true
	}

	this.initToolbar = function () {
		if (me.showToolbar.get()) {
			//check if should be shown
			if (!me.isActive()) {
				getToolbarNode().hidden=true;
			} else {
				getToolbarNode().hidden=false;
				getShowWhiteSpacesNode().checked = me.showWhiteSpace.get();

				//update combobox
				var menulist = getViewModeNode();
				var items = menulist.firstChild.childNodes;
				for( var i=0; i < items.length; i++ ) {
					if ( items[i].value == me.mode.get() ) {
						menulist.selectedItem = items[i];
						break;
					}
				}
			}
		}
	}
}
