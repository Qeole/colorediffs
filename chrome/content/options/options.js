if (!colorediffsGlobal) {
	var colorediffsGlobal = {}
}

colorediffsGlobal.initOptions = function() {
	var me = colorediffsGlobal;

	var globalPrefs = new colorediffsGlobal.Pref(colorediffsGlobal.getPrefs());

	if ( globalPrefs.instantApply.get() ) {
		//repaint all the instances at every change.
		var internalPrefs = new colorediffsGlobal.OptionsPrefCallbackModel(
			colorediffsGlobal.getPrefs(),
			function() {
				updatePreview();
				//repaint actual mail message
				var observerService =
					Components.classes["@mozilla.org/observer-service;1"]
					.getService(Components.interfaces.nsIObserverService);
				observerService.notifyObservers(null, "colored-diff-update", null);
			});
	} else {
		//Store changes and commit them only by OK button.
		//Repaint only preview
		var cachedPrefs = new colorediffsGlobal.OptionsPrefModel(colorediffsGlobal.getPrefs());

		var internalPrefs = new colorediffsGlobal.OptionsPrefCallbackModel(
			cachedPrefs,
			function() {
				updatePreview();
			});
	}

	var prefs = new colorediffsGlobal.Pref(internalPrefs);

	var getNodeGetter = function (name) {
		return function() {return me.$(name);}
	}

	var getViewModeNode = getNodeGetter('view_mode');
	var getViewNode = getNodeGetter('view');
	var getPreviewNode = getNodeGetter('previewbox');

	var savePrefs = function() {
		if (cachedPrefs) {
			cachedPrefs.saveToModel();

			//repaint actual mail message
			var observerService =
				Components.classes["@mozilla.org/observer-service;1"]
				.getService(Components.interfaces.nsIObserverService);
			observerService.notifyObservers(null, "colored-diff-update", null);
		} //else everything is saved and updated already
	}

	var updatePreview = function() {
		if (prefs.mode.get() == "none") {
			var code = "<pre>\n" +
				"Log message\n" +
				"\n" +
				"File title\n" +
				"===============================\n" +
				"--- filename\n" +
				"+++ filename\n" +
				"@@ -10,4 +10,5 @@\n" +
				" line1\n" +
				" line2\n" +
				" line3\n" +
				"+line4\n" +
				" line5\n" +
				"</pre>";

			var doc = getPreviewNode().contentDocument;
			var head = doc.getElementsByTagName("head")[0];
			head.innerHTML = "";

			var body = doc.getElementsByTagName("body")[0];
			body.innerHTML = code;

		} else {
			var status = ["S", "S", "S", "A", "S"];

			var il = {
				log:"Log message",
				files:[
					{title: "File title",
					 additional_info:null,
					 'old': {
						name: "filename",
						chunks: [
							{line:10,
							 code:[
								 " line1",
								 "	line2",
								 " line3",
								 null,
								 "	line5"],
							 status: status,
							 doesnt_have_new_line:false}]
					 },
					 'new': {
						name: "filename",
						chunks: [
							{line:10,
							 code:[
								 " line1",
								 "	line2",
								 " line3",
								 " line4",
								 "	line5"],
							 status: status,
							 doesnt_have_new_line:false}]
					 }}]};

			var doc = getPreviewNode().contentDocument;
			var dom = new colorediffsGlobal.domHelper(doc);

			//Apply filters
			var il = colorediffsGlobal.transform(il, prefs);

			//Generate view
			var renderedStyleBody = colorediffsGlobal.render(il, prefs, dom);

			var head = doc.getElementsByTagName("head")[0];
			head.innerHTML = "";
			head.appendChild(renderedStyleBody[0]);

			var body = doc.getElementsByTagName("body")[0];
			body.innerHTML = "";
			body.appendChild(renderedStyleBody[1]);
		}
	}

	colorediffsGlobal.options =	{
		checkOptions : function() {
			savePrefs();
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

		//new code
		changePref: function(control) {
			var pref = document.getElementById(control.getAttribute('preference'));

			if (control.value != undefined) {
				var value = control.value;
			} else if (control.checked != undefined) {
				var value = control.checked;
			} else if (control.color != undefined) {
				var value = control.color;
			} else if (control.selectedItem != undefined) {
				var value = control.selectedItem;
			}

			switch (pref.type) {
				case "bool":
					internalPrefs.setBoolPref(pref.name, value);
					break;
				case "string":
					internalPrefs.setCharPref(pref.name, value);
					break;
			}
		}

	}

	getPreviewNode().contentWindow.setTimeout(function() {
		if (getPreviewNode().contentDocument.getElementsByTagName("body")[0].innerHTML == "") {
			updatePreview();
		}
		getPreviewNode().contentWindow.setTimeout(arguments.callee, 1000);
	}, 1000);
	
        //init code
	updatePreview();
	colorediffsGlobal.options.onChangeMode();
}

colorediffsGlobal.deleteOptions = function() {
	colorediffsGlobal.options = null;
}

