var gmessagePane;

function getMessagePane() {
	if (!gmessagePane) {
		gmessagePane = document.getElementById("messagepane");
	}

	return gmessagePane;
}

var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);


String.prototype.match_perl_like = function(regexp) {
	var res = this.match(regexp);
	if (res) {
		for ( var i = 0; i < res.length; i++ ) {
			eval("$" + i + "='" + res[i] + "'");
		}
	}
	return res;
}

function $(id) {
	return document.getElementById(id);
}

document.getElementsByClassName = function(className, parentElement) {
	var elements = [];
	var qwe = parentElement.getElementsByTagName("*");
	for (var i = 0; i < qwe.length; i++) {
		if (qwe[i] && qwe[i].getAttribute("class") === className) {
			elements.push(qwe[i]);
		} else {
			elements = elements.concat(document.getElementsByClassName(className, qwe[i]));
		}
	}

	return elements;
}

