if (!colorediffsGlobal) {
	var colorediffsGlobal = {};
}

colorediffsGlobal.isMessageDiff = function() {
	var content = this.getMessagePane();
	if (!content) {
		return false;
	}

	var messagePrefix = /^mailbox-message:|^imap-message:|^news-message:|^exquilla-message:/i;
	if (! gMessageDisplay.folderDisplay.selectedMessageUris ||
			! messagePrefix.test(
				gMessageDisplay.folderDisplay.selectedMessageUris[0]) ) {
		return false;
	}

	var message = content.contentDocument;
	var body = message.body;

	if ( !body ) {
		return false;
	}

	var text = colorediffsGlobal.htmlToPlainText(body.innerHTML);

	for (var parserName in colorediffsGlobal.parsers) {
		if (colorediffsGlobal.parsers[parserName].couldParse(text)) {
			return true;
		}
	}
	return false;
};

colorediffsGlobal.writeDebugFile = function(filename, html, pref) {
	if (pref.debugDir.has()) {
		var debugDir = pref.debugDir.get();
		if ( debugDir != "" ) {
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
};

colorediffsGlobal.onLoadMessage = function() {
	var me = colorediffsGlobal;

	var message = me.getMessagePane().contentDocument;
	var pref = new colorediffsGlobal.Pref(colorediffsGlobal.getPrefs());
	me.writeDebugFile("before1.html", message.documentElement.innerHTML, pref);

	if (!me.isMessageDiff()) {
	me.setActive(false);
	me.colorediffsToolbar.initToolbar();
	return;
	}

	me.setActive(true);
	me.colorediffsToolbar.initToolbar();

	//don't do anything if user wants plain
	if (pref.mode.get() == 'none') {
	return;
	}

	var body = message.body;

	me.writeDebugFile("before.html", message.documentElement.innerHTML, pref);

	var divs = body.getElementsByTagName("div");
	if ( !divs ) {
		return;
	}

	var reloadPlanned = false;

	var text = me.fold(divs, function(div, text) {
		switch(div.getAttribute("class")) {
			case "moz-text-plain":
			case "moz-text-flowed":
				return text + colorediffsGlobal.stripHtml(div) + "\n\n\n";
			case "moz-text-html":
				//that means we're looking at HTML part of multipart mail
				//Check if we're after reload
				if (colorediffsGlobal.restorePreferHtmlTo === undefined) {
					//Will try to make Thunderird reload it with text part in use.
					colorediffsGlobal.restorePreferHtmlTo = pref.preferHtml.get();
					pref.preferHtml.set(true);
					ReloadMessage();
					reloadPlanned = true;
				} else { //ok, reloading was bad idea, but maybe html part is only log and diff is actually in attached file
					// so let's give it a try
					return text + colorediffsGlobal.stripHtml(div) + "\n\n\n";
				}
			default:
				return text;
		}
	}, "");

	if (reloadPlanned) {
		return; //got to reload
	}

	//Should do it here so we can check whether we planned reload or not in the code that actually plan it.
	if (colorediffsGlobal.restorePreferHtmlTo !== undefined) {
		pref.preferHtml.set(colorediffsGlobal.restorePreferHtmlTo);
		delete colorediffsGlobal.restorePreferHtmlTo;
	}

	//no luck finding a moz styled divs,
	//	let's try just stripping all html out
	if (text == "") {
		text = colorediffsGlobal.stripHtml(body);
	}

	me.writeDebugFile("text.html", text, pref);
	//Choose parser
	var il = colorediffsGlobal.parse(text, pref);
	if (il == null) {
		me.setActive(false);
		me.colorediffsToolbar.initToolbar();
		return;
	}

	//Apply filters
	il = colorediffsGlobal.transform(il, pref);

	var dom = new colorediffsGlobal.domHelper(message);

	//Generate view
	var renderedStyleBody = colorediffsGlobal.render(il, pref, dom);

	var head = message.getElementsByTagName("head")[0];
	head.appendChild(renderedStyleBody[0]);

	body.innerHTML = "";
	body.appendChild(renderedStyleBody[1]);

	me.writeDebugFile("after.html", message.documentElement.innerHTML, pref);


	//inner functions
	//Strip <pre wrap=""><br><hr size="4" width="90%"><br> tags from every div
	function stripThunderbirdGeneratedHtml(html) {
		return html.replace(/^<pre .*?>(?:<br>(?:<hr .*?>|<fieldset .*?>.*?<\/fieldset>)<br>)?((?:.|\n)*)<\/pre>$/i, "$1");
	}
};

