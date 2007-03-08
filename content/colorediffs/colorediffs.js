if (!colorediffsGlobal) {
	var colorediffsGlobal = {}
}

colorediffsGlobal.pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

colorediffsGlobal.isMessageDiff = function() {
	var content = this.getMessagePane();
	if (!content) {
		return false;
	}

	var messagePrefix = /^mailbox-message:|^imap-message:/i;
	if ( ! messagePrefix.test(GetLoadedMessage()) ) {
		return false;

	}

	var message = content.contentDocument;
	var body = message.body;

	if ( !body || !this.isDiff(body.innerHTML) ) {
		return false;
	}

	return true;
}

colorediffsGlobal.writeDebugFile = function(filename, html) {
	if (this.pref.prefHasUserValue("diffColorer.debug-dir" )) {
		var debugDir = this.pref.getCharPref("diffColorer.debug-dir" );
		if ( debugDir ) {
			var file = Components.classes["@mozilla.org/file/local;1"]
				.createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(debugDir);
			file.append(filename);

			var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
				.createInstance(Components.interfaces.nsIFileOutputStream);

			foStream.init(file, 0x02 | 0x08 | 0x20, 0664, 0); // write, create, truncate
			foStream.write(html, html.length);
			foStream.close();
		}
	}
}

colorediffsGlobal.onLoadMessage = function() {
	function getMode() {
		switch(pref.getCharPref("diffColorer.view-mode")) {
			case "side-by-side":
				return new colorediffsGlobal.sideBySideMode();
			case "unified":
				return new colorediffsGlobal.unifiedMode();
		}
		return null;
	}

	var replaceLinks = function(log) {
		for (var i = 0; i < addLinkClosures.length; i++ ) {
			log = addLinkClosures[i](log);
		}
		return log;
	}

	var optimizedLeftRightSearch = function(div) {
		if ( this.pref.getCharPref("diffColorer.view-mode") != "side-by-side" ) {
			return [];
		}

		var elements = [];

		var tables = document.getElementsByClassName("file-diff", div);
		for (var i=0; i < tables.length; i++) {
			var rows = tables[i].rows;
			for (var r=0; r < rows.length; r++) {
				if (rows[r].className == "diffs") {
					elements = elements.concat(document.getElementsByClassName("left", rows[r]).concat(document.getElementsByClassName("right", rows[r])));
				}
			}
		}

		return elements;
	}

	//Actual code starts here

	if (!this.isMessageDiff()) {
		this.$("colorediff-mode").value = false;
		this.colorediffsToolbar.initToolbar();
		return;
	}

	this.$("colorediff-mode").value = true;
	this.colorediffsToolbar.initToolbar();

	var message = this.getMessagePane().contentDocument;
	var body = message.body;

	this.writeDebugFile("before.html", message.documentElement.innerHTML);

	var divs = body.getElementsByTagName("div");
	var mode = getMode();
	if ( !divs || !mode ) {
		return;
	}

	var addLinkClosures = []; //list of functions that replaces filenames with links
	var generateHtmlClosures = []; //list of functions that actually generate html


	//Parse body
	for ( var i=0; i < divs.length; i++ ) {
		switch(divs[i].getAttribute("class")) {
			case "moz-text-plain":
			case "moz-text-flowed": var none = function() {
				var getHtml = colorediffsGlobal.parseDiff(divs[i].innerHTML, mode, addLinkClosures);
				var div = divs[i];

				generateHtmlClosures.push(function() {
						div.innerHTML = getHtml(replaceLinks);
						var diffs = optimizedLeftRightSearch(div);
						for ( var j = 0; j < diffs.length; j++ ) {
							diffs[j].addEventListener("scroll", function() {colorediffsGlobal.scrollCallback();}, false);
						}
					});
			}();
		}
	}

	for (var i = 0; i < generateHtmlClosures.length; i++ ) {
		generateHtmlClosures[i]();
	}

	//add stylesheet
	var styleElement = message.createElement("style");
	styleElement.type = "text/css";

	var styletext = document.createTextNode(mode.getStyle(pref));
	styleElement.appendChild(styletext);

	var head = message.getElementsByTagName("head")[0];
	head.appendChild(styleElement);

	this.writeDebugFile("after.html", message.documentElement.innerHTML);
}

