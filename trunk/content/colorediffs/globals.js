var gmessagePane;

function getMessagePane()
{
  if (!gmessagePane)
    gmessagePane = document.getElementById("messagepane");

  return gmessagePane;
}

var observerService = 
Components.classes["@mozilla.org/observer-service;1"]
  .getService(Components.interfaces.nsIObserverService);