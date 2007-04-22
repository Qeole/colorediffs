if (!colorediffsGlobal) {
	var colorediffsGlobal = {}
}

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

	if ( !body ) {
		return false;
	}

	var text = colorediffsGlobal.htmlToPlainText(div.innerHTML);

	return colorediffsGlobal.parsers.some(function(parser) {
			return parser.couldParse(text);
		});
}

colorediffsGlobal.writeDebugFile = function(filename, html) {
	if (this.debugDir.has()) {
		var debugDir = this.debugDir.get();
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
	var me = colorediffsGlobal;

	function getMode() {
		switch(colorediffsGlobal.mode.get()) {
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
		if ( me.mode.get() != "side-by-side" ) {
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

	if (!me.isMessageDiff()) {
		me.setActive(false);
		me.colorediffsToolbar.initToolbar();
		return;
	}

	me.setActive(true);
	me.colorediffsToolbar.initToolbar();

	var message = me.getMessagePane().contentDocument;
	var body = message.body;

	me.writeDebugFile("before.html", message.documentElement.innerHTML);

	var divs = body.getElementsByTagName("div");
	var mode = getMode();
	if ( !divs || !mode ) {
		return;
	}

	var addLinkClosures = []; //list of functions that replaces filenames with links
	var generateHtmlClosures = []; //list of functions that actually generate html


	var text = divs.fold(function(div, text) {
			switch(div.getAttribute("class")) {
				case "moz-text-plain":
				case "moz-text-flowed":
					return text + colorediffsGlobal.htmlToPlainText(div.innerHTML);
			}
		},
		"");

	//Choose parser
	var il = colorediffsGlobal.parse(text);

	//Apply filters
	var il = colorediffsGlobal.transform(il);


	//Generate view


//				var getHtml = colorediffsGlobal.parseDiff(divs[i].innerHTML, mode, addLinkClosures);
//				var div = divs[i];

//				generateHtmlClosures.push(function() {
//						div.innerHTML = getHtml(replaceLinks);
//						var diffs = optimizedLeftRightSearch(div);
//						for ( var j = 0; j < diffs.length; j++ ) {
//							diffs[j].addEventListener("scroll", function(evt) {colorediffsGlobal.scrollCallback(evt);}, false);
//						}
//					});


//	for (var i = 0; i < generateHtmlClosures.length; i++ ) {
//		generateHtmlClosures[i]();
//	}

	//add stylesheet
	var styleElement = message.createElement("style");
	styleElement.type = "text/css";

	var styletext = document.createTextNode(mode.getStyle());
	styleElement.appendChild(styletext);

	var head = message.getElementsByTagName("head")[0];
	head.appendChild(styleElement);

	me.writeDebugFile("after.html", message.documentElement.innerHTML);
}

