if (!colorediffsGlobal) {
	var colorediffsGlobal = {}
}

colorediffsGlobal.options = new function() {
	var me = colorediffsGlobal;

	var coloredElems = ["anchor", "steadyLine", "deletedLine", "addedLine", "title", "sbs_title", "sbs_log", "sbs_file-diff", "sbs_precode", "sbs_left-title", "sbs_right-title", "sbs_anchor", "sbs_left", "sbs_right", "sbs_addedLine", "sbs_deletedLine", "sbs_steadyLine", "sbs_emptyLine"];

	var getNodeGetter = function (name) {
		return function() {return me.$(name);}
	}

	var getViewModeNode = getNodeGetter('view_mode');
	var getShowWhiteSpacesNode = getNodeGetter('show-whitespaces');
	var getShowToolbarNode = getNodeGetter('show-toolbar');
	var getViewNode = getNodeGetter('view');

	var savePrefs = function() {
		for ( var i = 0; i < coloredElems.length; i++ ) {
			var bg = coloredElems[i] + "_bg";
			var fg = coloredElems[i] + "_fg";

			me.setColorFG("diffColorer." + coloredElems[i], me.$(fg).color);
			me.setColorBG("diffColorer." + coloredElems[i], me.$(bg).color);
		}

		me.showWhiteSpace.set(getShowWhiteSpacesNode().checked);
		me.showToolbar.set(getShowToolbarNode().checked);

		me.mode.set(getViewModeNode().getAttribute('value'));
	}

	var updatePreview = function() {
		for ( var i = 0; i < coloredElems.length; i++ ) {
			var element = coloredElems[i];
			var elem = document.getElementById(element);
			elem.style.color = me.$(element + "_fg").color;
			elem.style.backgroundColor = me.$(element + "_bg").color;
		}
	}

	this.init = function() {
		for ( var i = 0; i < coloredElems.length; i++ ) {
			var bg = coloredElems[i] + "_bg";
			var fg = coloredElems[i] + "_fg";

			me.$(fg).color = me.getColorFG("diffColorer." + coloredElems[i]);
			me.$(bg).color = me.getColorBG("diffColorer." + coloredElems[i]);
		}

		getViewModeNode().setAttribute('value', me.mode.get());

		//update combobox
		var menulist = getViewNode();
		var items = menulist.firstChild.childNodes;
		for( var i=0; i < items.length; i++ ) {
			if ( items[i].value == me.mode.get() ) {
				menulist.selectedItem = items[i];
				break;
			}
		}

		getShowWhiteSpacesNode().checked = me.showWhiteSpace.get();
		getShowToolbarNode().checked = me.showToolbar.get();

		updatePreview();
	}

	this.checkOptions = function() {
		savePrefs();
		//repaint actual mail message
		var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
		observerService.notifyObservers(null, "colored-diff-update", null);
		return true;
	}

	this.onChangeMode = function() {
		var deck = me.$("view-properties");

		if (getViewNode().selectedItem == "none") {
			deck.selectedIndex = 0;
		} else {
			var view = me.views[getViewNode().selectedItem];

			//change options page
			var children = deck.childNodes;
			var l = children.length;

			for (var i=1; i <l; i++) {
				if (children[i].id == view.getPropertyPageId()) {
					deck.selectedIndex = i;
					break;
				}
			}
		}

		window.sizeToContent();
	}

	this.onBroadcastModeUnified = function() {
		colorediffsGlobal.$('unified-properties').setAttribute('hidden', getViewModeNode().getAttribute('value') != 'unified');
	}

	this.onBroadcastModeSideBySide = function() {
		colorediffsGlobal.$('side-by-side-properties').setAttribute('hidden', getViewModeNode().getAttribute('value') != 'side-by-side');
	}

}
