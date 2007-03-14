if (!colorediffsGlobal) {
	var colorediffsGlobal = {}
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
		pref.QueryInterface(Components.interfaces.nsIPrefBranchInternal);
		pref.removeObserver("mail.pane_config.dynamic", me.MailPaneConfigObserver);

		observerService.removeObserver(updateObserver, "colored-diff-update");
	}

	window.addEventListener("unload", unload, false);
}

colorediffsGlobal.temp = function() {
	var me = colorediffsGlobal;
	var pref = me.getPrefs();

	pref.QueryInterface(Components.interfaces.nsIPrefBranchInternal);
	pref.addObserver("mail.pane_config.dynamic", me.MailPaneConfigObserver, false);

	window.addEventListener("load", function() {me.load();}, false);
}();
