if (!colorediffsGlobal) {
	var colorediffsGlobal = {}
}

colorediffsGlobal.pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

colorediffsGlobal.load = function() {
	var gmessagepane = this.getMessagePane();
	if (gmessagepane) {
		gmessagepane.addEventListener("load", function() {colorediffsGlobal.onLoadMessage();}, true);
	}
}

colorediffsGlobal.DiffColorerMailPaneConfigObserver = {
 observe: function(subject, topic, prefName) {
		// verify that we're changing the mail pane config pref
		if (topic == "nsPref:changed")
			colorediffsGlobal.load();
	}
};

colorediffsGlobal.updateObserver = {
 observe: function(subject, topic, data) {
		if(topic=="colored-diff-update") {
			if(gDBView) ReloadMessage();
		}
	}
};

colorediffsGlobal.observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
colorediffsGlobal.observerService.addObserver(colorediffsGlobal.updateObserver, "colored-diff-update", false);

colorediffsGlobal.unload = function() {
	this.pref.QueryInterface(Components.interfaces.nsIPrefBranchInternal);
	this.pref.removeObserver("mail.pane_config.dynamic", this.DiffColorerMailPaneConfigObserver);

	this.observerService.removeObserver(updateObserver, "colored-diff-update");
}

colorediffsGlobal.unloadMsgWnd = function() {
	this.observerService.removeObserver(this.updateObserver, "colored-diff-update");
}
