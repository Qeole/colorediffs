var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
var coloredElems = ["anchor", "steadyLine", "deletedLine", "addedLine", "title", "sbs_title", "sbs_log", "sbs_file-diff", "sbs_precode", "sbs_left-title", "sbs_right-title", "sbs_anchor", "sbs_left", "sbs_right", "sbs_addedLine", "sbs_deletedLine", "sbs_steadyLine", "sbs_emptyLine"];

function init() {
	for ( var i = 0; i < coloredElems.length; i++ ) {
		var bg = coloredElems[i] + "_bg";
		var fg = coloredElems[i] + "_fg";

		setColor(fg, pref.getCharPref("diffColorer." + fg));
		setColor(bg, pref.getCharPref("diffColorer." + bg));
	}

	document.getElementById('view_mode').setAttribute('value', pref.getCharPref("diffColorer.view-mode"));

	//update combobox
	var menulist = document.getElementById('view');
	var items = menulist.firstChild.childNodes;
	for( var i=0; i < items.length; i++ ) {
		if ( items[i].value == pref.getCharPref("diffColorer.view-mode") ) {
			menulist.selectedItem = items[i];
			break;
		}
	}

	updatePreview();
}

function savePrefs() {
	for ( var i = 0; i < coloredElems.length; i++ ) {
		var bg = coloredElems[i] + "_bg";
		var fg = coloredElems[i] + "_fg";

		pref.setCharPref("diffColorer." + fg, getColor(fg));
		pref.setCharPref("diffColorer." + bg, getColor(bg));
	}
	pref.setCharPref("diffColorer.view-mode", document.getElementById('view_mode').getAttribute('value'));
}

function checkOptions() {
	savePrefs();
	observerService.notifyObservers(null, "colored-diff-update", null);
	return true;
}


function updatePreview() {
	for ( var i = 0; i < coloredElems.length; i++ ) {
		var element = coloredElems[i];
		var elem = document.getElementById(element);
		elem.style.color = getColor(element + "_fg");
		elem.style.backgroundColor = getColor(element + "_bg");
	}
}

function OnColorChange(element) {
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


function setColor(elementId, color) {
	var element = document.getElementById(elementId);
	var colorElement = element.getElementsByTagName("spacer")[0];
	if (colorElement && color) {
		colorElement.style.backgroundColor = color;
	}
}

function getColor(elementId) {
	var element = document.getElementById(elementId);
	var colorElement = element.getElementsByTagName("spacer")[0];
	if (colorElement) {
		return colorElement.style.backgroundColor;
	} else {
		return null;
	}
}
