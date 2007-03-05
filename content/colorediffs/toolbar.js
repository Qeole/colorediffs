
var colorediffsToolbar = {
	reloadWithScrollPreserved: function() {
		var mp = $('messagepane');
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
		pref.setCharPref('diffColorer.view-mode', $('colorediffs-view-mode').selectedItem.value);
		MsgReload();
	},

	toggleWhiteSpaces: function () {
		pref.setBoolPref('diffColorer.show-whitespace', !pref.getBoolPref('diffColorer.show-whitespace'));
		$('colorediffs-show-whitespaces').checked=!$('colorediffs-show-whitespaces').checked;

		colorediffsToolbar.reloadWithScrollPreserved();
	},

	closeToolbar: function() {
		pref.setBoolPref('diffColorer.show-toolbar', false);
		$('colorediffs-toolbar').hidden=true
	},

	initToolbar: function () {
		if (pref.getBoolPref('diffColorer.show-toolbar')) {
			//check if should be shown
			if (!colorediffIsOn) {
				$('colorediffs-toolbar').hidden=true;
			} else {
				$('colorediffs-toolbar').hidden=false;
				$('colorediffs-show-whitespaces').checked = pref.getBoolPref('diffColorer.show-whitespace');

				//update combobox
				var menulist = $('colorediffs-view-mode');
				var items = menulist.firstChild.childNodes;
				for( var i=0; i < items.length; i++ ) {
					if ( items[i].value == pref.getCharPref("diffColorer.view-mode") ) {
						menulist.selectedItem = items[i];
						break;
					}
				}
			}
		}
	}
}
