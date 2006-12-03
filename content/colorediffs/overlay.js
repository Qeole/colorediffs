var gmessagepane;
var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

function load() {

  gmessagepane = getMessagePane();
  if (gmessagepane) {
    gmessagepane.addEventListener("load", onLoadMessage, true);
  }

}

const QCMailPaneConfigObserver = {
  observe: function(subject, topic, prefName) {
    // verify that we're changing the mail pane config pref
    if (topic == "nsPref:changed")
      load();
  }
};

var updateObserver = {
  observe: function(subject, topic, data) {
    if(topic=="colored-diff-update") {
      if(gDBView) ReloadMessage();
    }
  }
};

observerService.addObserver(updateObserver, "colored-diff-update", false);

function unload() {
  pref.QueryInterface(Components.interfaces.nsIPrefBranchInternal);
  pref.removeObserver("mail.pane_config.dynamic", QCMailPaneConfigObserver);

  observerService.removeObserver(updateObserver, "colored-diff-update");
}

function unloadMsgWnd() {
  observerService.removeObserver(updateObserver, "colored-diff-update");
}