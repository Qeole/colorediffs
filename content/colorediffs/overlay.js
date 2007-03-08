if (!colorediffsGlobal) {
	var colorediffsGlobal = {}
}

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
		observerService.removeObserver(updateObserver, "colored-diff-update");
	}

	window.addEventListener("unload", unload, false);
}
