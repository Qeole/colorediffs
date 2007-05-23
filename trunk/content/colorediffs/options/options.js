if (!colorediffsGlobal) {
	var colorediffsGlobal = {}
}

colorediffsGlobal.initOptions = function() {
	var me = colorediffsGlobal;
	var internalPrefs = new colorediffsGlobal.OptionsPrefModel(colorediffsGlobal.getPrefs());
	var prefs = new colorediffsGlobal.Pref(internalPrefs);

	var coloredElems = ["anchor", "steadyLine", "deletedLine", "addedLine", "title", "sbs_title", "sbs_log", "sbs_file-diff", "sbs_precode", "sbs_left-title", "sbs_right-title", "sbs_anchor", "sbs_left", "sbs_right", "sbs_addedLine", "sbs_deletedLine", "sbs_steadyLine", "sbs_emptyLine"];

	var getNodeGetter = function (name) {
		return function() {return me.$(name);}
	}

	var getViewModeNode = getNodeGetter('view_mode');
	var getShowWhiteSpacesNode = getNodeGetter('show-whitespaces');
	var getShowToolbarNode = getNodeGetter('show-toolbar');
	var getViewNode = getNodeGetter('view');
	var getPreviewNode = getNodeGetter('previewbox');

	var savePrefs = function() {
		for ( var i = 0; i < coloredElems.length; i++ ) {
			var bg = coloredElems[i] + "_bg";
			var fg = coloredElems[i] + "_fg";

			prefs.setColorFG("diffColorer." + coloredElems[i], me.$(fg).color);
			prefs.setColorBG("diffColorer." + coloredElems[i], me.$(bg).color);
		}

		prefs.showWhiteSpace.set(getShowWhiteSpacesNode().checked);
		prefs.showToolbar.set(getShowToolbarNode().checked);

		prefs.mode.set(getViewModeNode().getAttribute('value'));
	}

	var updatePreview = function() {
		var il = {
			log:"Log message",
			files:[
				{name: "filename",
				 title: "File title\n==============\n",
				 chunks: [
					{'old':
						{line:10,
						 code:[
							 "line1",
							 "line2",
							 "line3",
							 null,
							 "line5"]},
					 'new':{line:10,
						  code:[
							  "line1",
							  "line2",
							  "line3",
							  "line4",
							  "line5"]}}]}]};

		var doc = getPreviewNode().contentDocument;
		var dom = new colorediffsGlobal.domHelper(doc);

		//Apply filters
		var il = colorediffsGlobal.transform(il, prefs);

		//Generate view
		var renderedStyleBody = colorediffsGlobal.render(il, prefs, dom);

		var head = doc.getElementsByTagName("head")[0];
		head.appendChild(renderedStyleBody[0]);

		var body = doc.getElementsByTagName("body")[0];
		body.innerHTML = "";
		body.appendChild(renderedStyleBody[1]);
	}

	updatePreview();

	colorediffsGlobal.options =	{
		init : function() {
			for ( var i = 0; i < coloredElems.length; i++ ) {
				var bg = coloredElems[i] + "_bg";
				var fg = coloredElems[i] + "_fg";

				me.$(fg).color = prefs.getColorFG("diffColorer." + coloredElems[i]);
				me.$(bg).color = prefs.getColorBG("diffColorer." + coloredElems[i]);
			}

			getViewModeNode().setAttribute('value', prefs.mode.get());

			//update combobox
			var menulist = getViewNode();
			var items = menulist.firstChild.childNodes;
			for( var i=0; i < items.length; i++ ) {
				if ( items[i].value == prefs.mode.get() ) {
					menulist.selectedItem = items[i];
					break;
				}
			}

			getShowWhiteSpacesNode().checked = prefs.showWhiteSpace.get();
			getShowToolbarNode().checked = prefs.showToolbar.get();

			updatePreview();
		},

		checkOptions : function() {
			savePrefs();
			//repaint actual mail message
			var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
			observerService.notifyObservers(null, "colored-diff-update", null);
			return true;
		},

		onChangeMode : function() {
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
		},

		onBroadcastModeUnified : function() {
			colorediffsGlobal.$('unified-properties').setAttribute('hidden', getViewModeNode().getAttribute('value') != 'unified');
		},

		onBroadcastModeSideBySide : function() {
			colorediffsGlobal.$('side-by-side-properties').setAttribute('hidden', getViewModeNode().getAttribute('value') != 'side-by-side');
		}

	}
}

colorediffsGlobal.deleteOptions = function() {
	colorediffsGlobal.options = null;
}

