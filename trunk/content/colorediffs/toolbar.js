if (!colorediffsGlobal) {
	var colorediffsGlobal = {};
}

colorediffsGlobal.colorediffsToolbar = new function() {
	var me = colorediffsGlobal;
	var pref = new me.Pref(me.getPrefs());

	var getNode = function (name) {
		return function() {return me.$(name);};
	};

	var getViewModeNode = getNode('colorediffs-view-mode');
	var getDiffModeNode = getNode('colorediffs-diff-mode');
	var getTabSizeNode = getNode('colorediffs-tab-size');
	var getShowWhiteSpacesNode = getNode('colorediffs-show-whitespaces');
	var getShowLineNumbersNode = getNode('colorediffs-show-line-numbers');
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
		ReloadMessage();
	};

	var updatePrefs = function() {
		pref.showWhiteSpace.set(getShowWhiteSpacesNode().checked);
		pref.showLineNumbers.set(getShowLineNumbersNode().checked);
		pref.mode.set(getViewModeNode().selectedItem);
		pref.diffMode.set(getDiffModeNode().selectedItem.value);
		pref.tabSize.set(getTabSizeNode().selectedItem.value);
		pref.showToolbar.set(!getToolbarNode().hidden);
	};

	this.selectMode = function () {
		updatePrefs();
		ReloadMessage();
	};

	this.toggleWhiteSpaces = function () {
		getShowWhiteSpacesNode().checked = !getShowWhiteSpacesNode().checked;
		updatePrefs();

		reloadWithScrollPreserved();
	};

	this.toggleLineNumbers = function () {
		getShowLineNumbersNode().checked = !getShowLineNumbersNode().checked;
		updatePrefs();

		reloadWithScrollPreserved();
	};

	this.showOptions = function() {
		var features = "chrome,titlebar,toolbar,centerscreen";
		window.openDialog("chrome://colorediffs/content/options/options.xul", "Preferences", features);
	};

	this.selectDiffMode = function() {
		updatePrefs();
		reloadWithScrollPreserved();
	};

	this.selectTabSize = function() {
		updatePrefs();
		reloadWithScrollPreserved();
	};

	this.closeToolbar = function() {
		getToolbarNode().hidden=true;
		updatePrefs();
	};

	function selectComboByValue(menulist, value) {
	    var items = menulist.firstChild.childNodes;
	    for( var i=0; i < items.length; i++ ) {
		if ( items[i].getAttribute("value") == value ) {
		    menulist.selectedItem = items[i];
		    break;
		}
	    }
	}

	this.initToolbar = function () {
		if (pref.showToolbar.get()) {
			//check if should be shown
			if (!me.isActive()) {
				getToolbarNode().hidden=true;
			} else {
				getToolbarNode().hidden=false;
				getShowWhiteSpacesNode().checked = pref.showWhiteSpace.get();

				//update combobox
				getViewModeNode().selectedItem = pref.mode.get();
				getShowLineNumbersNode().checked = pref.showLineNumbers.get();

				selectComboByValue(getDiffModeNode(), pref.diffMode.get());
				selectComboByValue(getTabSizeNode(), pref.tabSize.get());
			}
		} else {
			getToolbarNode().hidden=true;
		}
	};
};
