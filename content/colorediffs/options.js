if (!colorediffsGlobal) {
	var colorediffsGlobal = {}
}

colorediffsGlobal.options = new function() {
	var me = colorediffsGlobal;

	var coloredElems = ["anchor", "steadyLine", "deletedLine", "addedLine", "title", "sbs_title", "sbs_log", "sbs_file-diff", "sbs_precode", "sbs_left-title", "sbs_right-title", "sbs_anchor", "sbs_left", "sbs_right", "sbs_addedLine", "sbs_deletedLine", "sbs_steadyLine", "sbs_emptyLine"];

	var getNode = function (name) {
		return function() {return me.$(name);}
	}

	var getViewModeNode = getNode('view_mode');
	var getShowWhiteSpacesNode = getNode('show-whitespaces');
	var getShowToolbarNode = getNode('show-toolbar');
	var getViewNode = getNode('view');

	var setColor = function(elementId, color) {
		var element = document.getElementById(elementId);
		var colorElement = element.getElementsByTagName("spacer")[0];
		if (colorElement && color) {
			colorElement.style.backgroundColor = color;
		}
	}

	var getColor = function(elementId) {
		var element = document.getElementById(elementId);
		var colorElement = element.getElementsByTagName("spacer")[0];
		if (colorElement) {
			return colorElement.style.backgroundColor;
		} else {
			return null;
		}
	}

	var savePrefs = function() {
		for ( var i = 0; i < coloredElems.length; i++ ) {
			var bg = coloredElems[i] + "_bg";
			var fg = coloredElems[i] + "_fg";

			me.setColorFG("diffColorer." + coloredElems[i], getColor(fg));
			me.setColorBG("diffColorer." + coloredElems[i], getColor(bg));
		}

		me.showWhiteSpace.set(getShowWhiteSpacesNode().checked);
		me.showToolbar.set(getShowToolbarNode().checked);

		me.mode.set(getViewModeNode().getAttribute('value'));
	}

	var updatePreview = function() {
		for ( var i = 0; i < coloredElems.length; i++ ) {
			var element = coloredElems[i];
			var elem = document.getElementById(element);
			elem.style.color = getColor(element + "_fg");
			elem.style.backgroundColor = getColor(element + "_bg");
		}
	}

	this.init = function() {
		for ( var i = 0; i < coloredElems.length; i++ ) {
			var bg = coloredElems[i] + "_bg";
			var fg = coloredElems[i] + "_fg";

			setColor(fg, me.getColorFG("diffColorer." + coloredElems[i]));
			setColor(bg, me.getColorBG("diffColorer." + coloredElems[i]));
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

	this.OnColorChange = function(element) {
		var istext = (element.id.lastIndexOf("_fg")!=0);
		var colorObj = { NoDefault:false, Type:istext?"Text":"Page", TextColor:0, PageColor:0, Cancel:false };

		window.openDialog("chrome://editor/content/EdColorPicker.xul", "_blank", "chrome,close,titlebar,modal", "", colorObj);

		if (colorObj.Cancel) {
			return;
		}

		var color = (istext)?colorObj.TextColor:colorObj.BackgroundColor;
		setColor(element.id, color);

		updatePreview();
	}

	this.onChangeMode = function() {
		getViewModeNode().setAttribute('value', getViewNode().selectedItem.value);
		window.sizeToContent();
	}

	this.onBroadcastModeUnified = function() {
		colorediffsGlobal.$('unified-properties').setAttribute('hidden', getViewModeNode().getAttribute('value') != 'unified');
	}

	this.onBroadcastModeSideBySide = function() {
		colorediffsGlobal.$('side-by-side-properties').setAttribute('hidden', getViewModeNode().getAttribute('value') != 'side-by-side');
	}

}
