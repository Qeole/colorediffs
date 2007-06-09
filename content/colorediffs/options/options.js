if (!colorediffsGlobal) {
	var colorediffsGlobal = {}
}

colorediffsGlobal.initOptions = function() {
	var me = colorediffsGlobal;
	var internalPrefs = new colorediffsGlobal.OptionsPrefModel(colorediffsGlobal.getPrefs());
	var prefs = new colorediffsGlobal.Pref(internalPrefs);

	var getNodeGetter = function (name) {
		return function() {return me.$(name);}
	}

	var getViewModeNode = getNodeGetter('view_mode');
	var getViewNode = getNodeGetter('view');
	var getPreviewNode = getNodeGetter('previewbox');

	var savePrefs = function() {
		internalPrefs.saveToModel();
	}

	var updatePreview = function() {
		if (prefs.mode.get() == "none") {
			var code = "" + <r><![CDATA[
<pre>
Log message

File title
==============
--- filename
+++ filename
@@ -10,4 +10,5 @@
 line1
 line2
 line3
+line4
 line5
</pre>
]]></r>;


			var doc = getPreviewNode().contentDocument;
			var head = doc.getElementsByTagName("head")[0];
			head.innerHTML = "";

			var body = doc.getElementsByTagName("body")[0];
			body.innerHTML = code;

		} else {
			var il = {
				log:"Log message",
				files:[
					{name: "filename",
					 title: "File title\n==============\n",
					 chunks: [
						{'old':{line:10,
						  code:[
							  " line1",
							  "	line2",
							  " line3",
							  null,
							  "	line5"]},
						 'new':{line:10,
						  code:[
							  " line1",
							  "	line2",
							  " line3",
							  " line4",
							  "	line5"]}}]}]};

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

			updatePreview();
		}

	}

	//init code
	updatePreview();
	colorediffsGlobal.options.onChangeMode();

}

colorediffsGlobal.deleteOptions = function() {
	colorediffsGlobal.options = null;
}

