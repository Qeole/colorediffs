if (!colorediffsGlobal) {
	var colorediffsGlobal = {};
}

//This observer make sure message get redrew if user change layout
colorediffsGlobal.MailPaneConfigObserver = {
	observe: function(subject, topic, prefName) {
		// verify that we're changing the mail pane config pref
		if (topic == "nsPref:changed") {
			colorediffsGlobal.load();
		}
	}
};

colorediffsGlobal.load = function() {
	var me = colorediffsGlobal;

	var gmessagepane = me.getMessagePane();
	if (gmessagepane) {
	gmessagepane.addEventListener("load", function() {me.onLoadMessage();}, true);
	}

	var updateObserver = {
	observe: function(subject, topic, data) {
		if(topic=="colored-diff-update" && me.isActive()) {
		ReloadMessage();
		}
	}
	};

	var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
	observerService.addObserver(updateObserver, "colored-diff-update", false);

	var unload = function() {
	var pref = me.getPrefs();
	pref.QueryInterface(Components.interfaces.nsIPrefBranch);
	pref.removeObserver("mail.pane_config.dynamic", me.MailPaneConfigObserver);

	observerService.removeObserver(updateObserver, "colored-diff-update");
	};

	window.addEventListener("unload", unload, false);

//	   Components.utils.import("resource://test-framework/main.js");
//	   run_tests("{282C3C7A-15A8-4037-A30D-BBEB17FFC76B}", "content/colorediffs/tests", document);

	// var pref = new colorediffsGlobal.Pref(colorediffsGlobal.getPrefs());
	// if (pref.debugDir.has()) {
	// //run tests

	// var MY_ID = "{282C3C7A-15A8-4037-A30D-BBEB17FFC76B}";
	// var em = Components.classes["@mozilla.org/extensions/manager;1"].getService(Components.interfaces.nsIExtensionManager);
	// var file = em.getInstallLocation(MY_ID).getItemFile(MY_ID, "test-framework/main.js");
	// var fstream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
	// var sstream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
	// fstream.init(file, -1, 0, 0);
	// sstream.init(fstream);

	// var data = "";
	// var str = sstream.read(4096);
	// while (str.length > 0) {data += str; str = sstream.read(4096);}

	// sstream.close();
	// fstream.close();

	// eval(data);
	// run_tests(MY_ID, "content/colorediffs/tests/", document);
	// }
};

colorediffsGlobal.temp = function() {
	var me = colorediffsGlobal;
	var pref = me.getPrefs();

	pref.QueryInterface(Components.interfaces.nsIPrefBranch);
	pref.addObserver("mail.pane_config.dynamic", me.MailPaneConfigObserver, false);

	window.addEventListener("load", function() {me.load();}, false);
}();
