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

	var text = colorediffsGlobal.htmlToPlainText(body.innerHTML);

	return colorediffsGlobal.parsers.some(function(parser) {
			return parser.couldParse(text);
		});
}

colorediffsGlobal.writeDebugFile = function(filename, html, pref) {
	if (pref.debugDir.has()) {
		var debugDir = pref.debugDir.get();
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

	if (!me.isMessageDiff()) {
		me.setActive(false);
		me.colorediffsToolbar.initToolbar();
		return;
	}

	me.setActive(true);
	me.colorediffsToolbar.initToolbar();

	var pref = new colorediffsGlobal.Pref(colorediffsGlobal.getPrefs());

	//don't do anything if user wants plain
	if (pref.mode.get() == 'plain') {
		return;
	}

	var message = me.getMessagePane().contentDocument;
	var body = message.body;

	me.writeDebugFile("before.html", message.documentElement.innerHTML, pref);

	var divs = body.getElementsByTagName("div");
	if ( !divs ) {
		return;
	}

	var text = me.fold(divs, function(div, text) {
			switch(div.getAttribute("class")) {
				case "moz-text-plain":
				case "moz-text-flowed":
					return text + colorediffsGlobal.htmlToPlainText(div.innerHTML) + "\n\n\n";
				default:
					return text;
			}
		},
		"");

	//Choose parser
	var il = colorediffsGlobal.parse(text);

	//Apply filters
	var il = colorediffsGlobal.transform(il, pref);

	var dom = new colorediffsGlobal.domHelper(message);

	//Generate view
	var renderedStyleBody = colorediffsGlobal.render(il, pref, dom);

	var head = message.getElementsByTagName("head")[0];
	head.appendChild(renderedStyleBody[0]);

	body.innerHTML = "";
	body.appendChild(renderedStyleBody[1]);

	me.writeDebugFile("after.html", message.documentElement.innerHTML, pref);
}

