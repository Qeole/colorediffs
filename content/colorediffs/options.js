if (!colorediffsGlobal) {
	var colorediffsGlobal = {}
}

colorediffsGlobal.pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
colorediffsGlobal.coloredElems = ["anchor", "steadyLine", "deletedLine", "addedLine", "title", "sbs_title", "sbs_log", "sbs_file-diff", "sbs_precode", "sbs_left-title", "sbs_right-title", "sbs_anchor", "sbs_left", "sbs_right", "sbs_addedLine", "sbs_deletedLine", "sbs_steadyLine", "sbs_emptyLine"];

colorediffsGlobal.init = function() {
	for ( var i = 0; i < coloredElems.length; i++ ) {
		var bg = coloredElems[i] + "_bg";
		var fg = coloredElems[i] + "_fg";

		setColor(fg, pref.getCharPref("diffColorer." + fg));
		setColor(bg, pref.getCharPref("diffColorer." + bg));
	}

	$('view_mode').setAttribute('value', pref.getCharPref("diffColorer.view-mode"));

	//update combobox
	var menulist = document.getElementById('view');
	var items = menulist.firstChild.childNodes;
	for( var i=0; i < items.length; i++ ) {
		if ( items[i].value == pref.getCharPref("diffColorer.view-mode") ) {
			menulist.selectedItem = items[i];
			break;
		}
	}

	$('show-whitespaces').checked = pref.getBoolPref('diffColorer.show-whitespace');
	$('show-toolbar').checked = pref.getBoolPref('diffColorer.show-toolbar');

	updatePreview();
}

colorediffsGlobal.savePrefs = function() {
	for ( var i = 0; i < coloredElems.length; i++ ) {
		var bg = coloredElems[i] + "_bg";
		var fg = coloredElems[i] + "_fg";

		pref.setCharPref("diffColorer." + fg, getColor(fg));
		pref.setCharPref("diffColorer." + bg, getColor(bg));
	}

	pref.setBoolPref('diffColorer.show-whitespace', $('show-whitespaces').checked);
	pref.setBoolPref('diffColorer.show-toolbar', $('show-toolbar').checked);

	pref.setCharPref("diffColorer.view-mode", $('view_mode').getAttribute('value'));
}

colorediffsGlobal.checkOptions = function() {
	savePrefs();
	observerService.notifyObservers(null, "colored-diff-update", null);
	return true;
}


colorediffsGlobal.updatePreview = function() {
	for ( var i = 0; i < coloredElems.length; i++ ) {
		var element = coloredElems[i];
		var elem = document.getElementById(element);
		elem.style.color = getColor(element + "_fg");
		elem.style.backgroundColor = getColor(element + "_bg");
	}
}

colorediffsGlobal.OnColorChange = function(element) {
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


colorediffsGlobal.setColor = function(elementId, color) {
	var element = document.getElementById(elementId);
	var colorElement = element.getElementsByTagName("spacer")[0];
	if (colorElement && color) {
		colorElement.style.backgroundColor = color;
	}
}

colorediffsGlobal.getColor = function(elementId) {
	var element = document.getElementById(elementId);
	var colorElement = element.getElementsByTagName("spacer")[0];
	if (colorElement) {
		return colorElement.style.backgroundColor;
	} else {
		return null;
	}
}
