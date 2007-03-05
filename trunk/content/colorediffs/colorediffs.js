var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

function isMessageDiff() {
	var content = getMessagePane();
	if (!content) {
		return false;
	}

	var messagePrefix = /^mailbox-message:|^imap-message:/i;
	if ( ! messagePrefix.test(GetLoadedMessage()) ) {
		return false;

	}

	var message = content.contentDocument;
	var body = message.body;

	if ( !body || !isDiff(body.innerHTML) ) {
		return false;
	}

	return true;
}

function getMode() {
	switch(pref.getCharPref("diffColorer.view-mode")) {
		case "side-by-side":
			return new sideBySideMode();
		case "unified":
			return new unifiedMode();
	}
	return null;
}

function writeDebugFile(filename, html) {
	if (pref.prefHasUserValue("diffColorer.debug-dir" )) {
		var debugDir = pref.getCharPref("diffColorer.debug-dir" );
		if ( debugDir ) {
			var file = Components.classes["@mozilla.org/file/local;1"]
				.createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath( debugDir + "\\" + filename);

			var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
				.createInstance(Components.interfaces.nsIFileOutputStream);

			foStream.init(file, 0x02 | 0x08 | 0x20, 0664, 0); // write, create, truncate
			foStream.write(html, html.length);
			foStream.close();
		}
	}
}

function onLoadMessage() {
	if (!isMessageDiff()) {
		$("colorediff-mode").value = false;
		colorediffsToolbar.initToolbar();
		return;
	}

	$("colorediff-mode").value = true;
	colorediffsToolbar.initToolbar();

	var message = getMessagePane().contentDocument;
	var body = message.body;

	writeDebugFile("before.html", message.documentElement.innerHTML);

	var divs = body.getElementsByTagName("div");
	var mode = getMode();
	if ( !divs || !mode ) {
		return;
	}

	var addLinkClosures = []; //list of functions that replaces filenames with links
	var generateHtmlClosures = []; //list of functions that actually generate html

	var replaceLinks = function(log) {
		for (var i = 0; i < addLinkClosures.length; i++ ) {
			log = addLinkClosures[i](log);
		}
		return log;
	}

	var optimizedLeftRightSearch = function(div) {
		if ( pref.getCharPref("diffColorer.view-mode") != "side-by-side" ) {
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

	//Parse body
	for ( var i=0; i < divs.length; i++ ) {
		switch(divs[i].getAttribute("class")) {
			case "moz-text-plain":
			case "moz-text-flowed": var none = function() {
				var getHtml = parseDiff(divs[i].innerHTML, mode, addLinkClosures);
				var div = divs[i];

				generateHtmlClosures.push(function() {
						div.innerHTML = getHtml(replaceLinks);
						var diffs = optimizedLeftRightSearch(div);
						for ( var j = 0; j < diffs.length; j++ ) {
							diffs[j].addEventListener("scroll", colorediffsScrollCallback, false);
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

	writeDebugFile("after.html", message.documentElement.innerHTML);
}

