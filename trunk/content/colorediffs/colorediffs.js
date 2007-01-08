function createStyle() {
	var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

	var stylecontent="";

	switch(pref.getCharPref("diffColorer.view-mode")) {
		case "unified":
			stylecontent += ".linetag {color: " + pref.getCharPref("diffColorer.anchor_fg")
				+ ";background-color: " + pref.getCharPref("diffColorer.anchor_bg") + ";}\n";
			stylecontent += ".addline {color: " + pref.getCharPref("diffColorer.addedLine_fg")
				+ ";background-color: " + pref.getCharPref("diffColorer.addedLine_bg") + ";}\n";
			stylecontent += ".delline {color: " + pref.getCharPref("diffColorer.deletedLine_fg")
				+ ";background-color: " + pref.getCharPref("diffColorer.deletedLine_bg") + ";}\n";
			stylecontent += ".steadyline {color: " + pref.getCharPref("diffColorer.steadyLine_fg")
				+ ";background-color: " + pref.getCharPref("diffColorer.steadyLine_bg") + ";}\n";
			stylecontent += ".title {color: " + pref.getCharPref("diffColorer.title_fg")
				+ ";background-color: " + pref.getCharPref("diffColorer.title_bg") + ";}\n";
			//stylecontent += ".addline {color: red;}\n";
			stylecontent += "pre {font-family:monospace;}\n";
			break;
		case "side-by-side":
			stylecontent += "	.log {color: " + pref.getCharPref("diffColorer.sbs_log_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_log_bg") + "; padding: 5px; border: 1px solid black;}";
			stylecontent += "	.file-diff {color: " + pref.getCharPref("diffColorer.sbs_file-diff_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_file-diff_bg") + "; padding: 3px;}";
			stylecontent += "	.title {color: " + pref.getCharPref("diffColorer.sbs_title_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_title_bg") + "; padding: 3px;clear:left;}";
			stylecontent += "	.pre-code {color: " + pref.getCharPref("diffColorer.sbs_precode_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_precode_bg") + ";}";
			stylecontent += "	.addline {color: " + pref.getCharPref("diffColorer.sbs_addedLine_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_addedLine_bg") + ";}";
			stylecontent += "	.delline {color: " + pref.getCharPref("diffColorer.sbs_deletedLine_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_deletedLine_bg") + ";}";
			stylecontent += "	.linetag {color: " + pref.getCharPref("diffColorer.sbs_anchor_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_anchor_bg") + ";text-align:center;clear:left;}";
			stylecontent += "	.steadyline {color: " + pref.getCharPref("diffColorer.sbs_steadyLine_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_steadyLine_bg") + ";}";
			stylecontent += "	.left {float:left; padding: 5px; margin:0; width:48%;overflow:auto; color: " + pref.getCharPref("diffColorer.sbs_left_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_left_bg") + "; border: 1px solid black;}";
			stylecontent += "	.right {float:right; padding: 5px; margin:0; width:48%;overflow:auto; color: " + pref.getCharPref("diffColorer.sbs_right_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_right_bg") + "; border: 1px solid black;}";
			stylecontent += "	.left-title {float:left; padding: 5px; padding-top:0; padding-bottom:0; margin:0; width:48%;overflow:auto; color: " + pref.getCharPref("diffColorer.sbs_left-title_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_left-title_bg") + "; border: 1px solid black;}";
			stylecontent += "	.right-title {float:right; padding: 5px; padding-top:0; padding-bottom:0; margin:0; width:48%;overflow:auto; color: " + pref.getCharPref("diffColorer.sbs_right-title_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_right-title_bg") + "; border: 1px solid black;}";
			stylecontent += "	.left .addline {width:100%; color: green; margin-right:5px; color: " + pref.getCharPref("diffColorer.sbs_emptyLine_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_emptyLine_bg") + ";}";
			stylecontent += "	.right .delline {width:100%; color: green; color: " + pref.getCharPref("diffColorer.sbs_emptyLine_fg") + "; background-color:" + pref.getCharPref("diffColorer.sbs_emptyLine_bg") + ";}";
			break;
	}
	return stylecontent;
}

function getDecoration() {
	switch(pref.getCharPref("diffColorer.view-mode")) {
		case "unified":
			return normalDecoration;
		case "side-by-side":
			return sideBySideDecoration;
	}
	return normalDecoration;
}

function onLoadMessage() {
	var content = getMessagePane();
	if(!content) return;

	var loadedMessage = GetLoadedMessage();
	if(!loadedMessage) return;

	var messagePrefix = /^mailbox-message:|^imap-message:|^news-message:|^file:/i;
	if ( ! messagePrefix.test(loadedMessage) ) return;

	var message = content.contentDocument;

	var body = message.body;

	if( !body ) {
		return;
	}

	if (!isDiff(body.innerHTML)) {
		return;
	}

	if ( pref.getBoolPref("diffColorer.debug-mode" )) {
			var file = Components.classes["@mozilla.org/file/local;1"]
				.createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath("%TEMP%\\before.html");
			// file is nsIFile, data is a string
			var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
				.createInstance(Components.interfaces.nsIFileOutputStream);

			// use 0x02 | 0x10 to open file for appending.
			foStream.init(file, 0x02 | 0x08 | 0x20, 0664, 0); // write, create, truncate
			foStream.write(message.documentElement.innerHTML, message.documentElement.innerHTML.length);
			foStream.close();
	}

	var divs = body.getElementsByTagName("div");
	var div = null;

	for ( var i=0; i < divs.length; i++ ) {
		switch(divs[i].getAttribute("class")) {
			case "moz-text-plain":
			case "moz-text-flowed":
				divs[i].innerHTML = realParseDiff(divs[i].innerHTML, getDecoration());
				div = divs[i];
			default:
		}
	}

	if( !div ) {
		return;
	}

	var styleElement = message.createElement("style");
	styleElement.type = "text/css";

	var styletext = document.createTextNode(createStyle());
	styleElement.appendChild(styletext);

	var head = message.getElementsByTagName("head")[0];
	head.appendChild(styleElement);

	if ( pref.getBoolPref("diffColorer.debug-mode" )) {
		var file = Components.classes["@mozilla.org/file/local;1"]
			.createInstance(Components.interfaces.nsILocalFile);
		file.initWithPath("%TEMP%\\after.html");
		// file is nsIFile, data is a string
		var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
			.createInstance(Components.interfaces.nsIFileOutputStream);

		// use 0x02 | 0x10 to open file for appending.
		foStream.init(file, 0x02 | 0x08 | 0x20, 0664, 0); // write, create, truncate
		foStream.write(message.documentElement.innerHTML, message.documentElement.innerHTML.length);
		foStream.close();
	}
}

function getTestText() {
	var text = "";
	text = "Update of /data/cvs/updateagent\n";
	text +="In directory frodo:/tmp/cvs-serv21674/updateagent\n";
	text +="\n";
	text +="Modified Files:\n";
	text +="	UpdateAgent.cpp\n";
	text +="Log Message:\n";
	text +="Fix for bug 21675 \"entries in the log should have time stamps \"\n";
	text +="http://frodo/cgi-bin/bugzilla/show_bug.cgi?id=21675\n";
	text +=" http://localhost/cgi-bin/bugzilla/show_bug.cgi?id=21675\n";
	text +="\n";
	text +="\n";
	text +="Index: UpdateAgent.cpp http://frodo/cgi-bin/viewcvs.cgi/updateagent/UpdateAgent.cpp http://localhost/cgi-bin/viewcvs.cgi/updateagent/UpdateAgent.cpp\n";
	text +="===================================================================\n";
	text +="RCS file: /data/cvs/updateagent/UpdateAgent.cpp,v\n";
	text +="retrieving revision 1.4\n";
	text +="retrieving revision 1.5\n";
	text +="diff -u -d -r1.4 -r1.5\n";
	text +="--- UpdateAgent.cpp	8 Jun 2005 13:58:09 -0000	1.4\n";
	text +="+++ UpdateAgent.cpp	3 Jan 2007 05:08:17 -0000	1.5\n";
	text +="@@ -71,6 +71,7 @@\n";
	text +="\n";
	text +=" BOOL\n";
	text +=" UpdateAgent::InitInstance() {\n";
	text +="+	LogStream::log().setTimeStamp(true);\n";
	text +="	static Cms::FileMutexImpl oldUpdateAgentMutex( \"HeartCodeAlreadyRunning\" );\n";
	text +="	if ( oldUpdateAgentMutex.isAlreadyExists() ) {\n";
	text +="		LogStream::log() << \"Trying to close MicroSimFilesync( ie. Old UpdateAgent ).\" << endl;\n";
	text +="\n";
	return text;
}

function normalDecoration(string, type) {
	switch(type) {
		case 0: return "<div class='log'>"+string+"</div>";
		case 1: return "<div class='title'>"+string+"</div>";
		case 2: return "<div class='pre-code'>"+string+"</div>";
		case 3:
			string = string.replace(/^(\+{3}.*\d+\.\d+)$/mg, "<span class='addline'>$1</span>" );
			string = string.replace(/^(\-{3}.*\d+\.\d+)$/mg, "<span class='delline'>$1</span>" );
			return string;
		case 4: return "<div class='linetag'>"+string+"</div>";
		case 5:
			string = string.replace(/^(\+[^+].*)$/mg, "<span class='addline'>$1</span>" );
			string = string.replace(/^(\-[^-].*)$/mg, "<span class='delline'>$1</span>" );
			string = string.replace(/^( .*)$/mg, "<span class='steadyline'>$1</span>" );
			return string;
	}
	return string;
}

function sideBySideDecoration(string, type) {
	switch(type) {
		case 0: if (string == "" ) {return "";} else {return "<pre class='log'>"+string+"</pre>";}
		case 1: return "<pre class='title'>"+string+"</pre>";
		case 2:
			string = string.replace(/^(\+{3}.*)$/mg, "</pre><div class='right-title'>$1</div><pre class='pre-code'>" );
			string = string.replace(/^(\-{3}.*)$/mg, "</pre><div class='left-title'>$1</div><pre class='pre-code'>" );
			return "<pre class='pre-code'>"+string+"</pre>";
		case 3:
			return "<div class='file-diff'>" + string + "</div>";
		case 4: return "<div class='linetag'>"+string+"</div>";
		case 5: //split code
			var left = [];
			var right = [];
			var lines = string.split("\n");
			lines.push("");
			for (var i=0; i < lines.length; i++) {
				if (/^(\-.*)$/.test(lines[i])) {
					left.push("<div class='delline'>"+lines[i].substring(1)+" </div>");
				} else if (/^(\+.*)$/.test(lines[i])) {
					right.push("<div class='addline'>"+lines[i].substring(1)+" </div>");
				} else {
					if ( left.length < right.length ) {
						for (var k = left.length; k < right.length; k++) {
							left.push("<div class='addline'> </div>");
						}
					} else if ( left.length > right.length ) {
						for (var k = right.length; k < left.length; k++) {
							right.push("<div class='delline'> </div>");
						}
					}
					var steadyline = "<div class='steadyline'>"+lines[i].substring(1)+" </div>";
					left.push(steadyline);
					right.push(steadyline);
				}
			}
			left.pop(); right.pop();
			return "<pre class='left'>"+left.join("")+"</pre><pre class='right'>"+right.join("")+"</pre>";
	}
	return string;
}

function main() {
	text = getTestText();
	return realParseDiff(text, sideBySideDecoration);
}

function realParseDiff(text, decoration) {
	//if (! isDiff(text)) return text;
	//remove tags Thunderbird inserted
	text = text.replace(/^<pre.*><br><hr.*><br>/, "\n\n");
	text = text.replace(/^<pre.*>/, "\n\n");
	text = text.replace(/<\/pre>$/, "");
	//
	var diffs = text.split(/\n\n((?:.*\n){1,3}[-=]+\n)/);
	//Ok, diffs[0] is log, put it away. But if first is false it is just a first code part so process it normally.
	//diffs[odd] are titles
	//diffs[even] are diffs themselves
	var newText = decoration(diffs[0], 0) + "\n\n";
	for ( var i = 1; i < diffs.length; i += 2 ) {
		var file = decoration(diffs[i], 1);
		file += parseDiffPart(diffs[i+1], decoration);
		newText += decoration(file, 3);
	}
	return newText;
}

function parseDiffPart(diff, decoration) {
	var parts = diff.split(/^(@@\s\-\d+\,\d+\s\+\d+\,\d+\s@@)$/m);
	//parts[0] is some text before code
	var newText = decoration(parts[0], 2);
	//parts[odd] are tags
	//parts[even] are code
	for ( var i = 1; i < parts.length; i += 1 ) {
		if ( i % 2 == 1 ) {
			newText += decoration(parts[i], 4);
		} else {
			newText += decoration(parts[i], 5);
		}
	}
	return newText;
}

function isDiff(text) {
	//check if text has line tags
	line_tag = /^@@\s\-\d+\,\d+\s\+\d+\,\d+\s@@$/m;
	return line_tag.test(text);
}
