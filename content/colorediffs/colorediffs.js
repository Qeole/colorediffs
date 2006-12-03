function createStyle()
{
  var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
  
  var stylecontent="";

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
  stylecontent += "pre {font-family:monospace;}\n"

  return stylecontent;
}

function onLoadMessage()
{
  var content = getMessagePane();
  if(!content) return;

  var loadedMessage = GetLoadedMessage();
  if(!loadedMessage) return;

  var messagePrefix = /^mailbox-message:|^imap-message:|^news-message:|^file:/i;
  if ( ! messagePrefix.test(loadedMessage) ) return;

  var message = content.contentDocument;

  var body = message.getElementsByTagName("body")[0];

  if( !body ) {
    return;
  }

  var divs = body.getElementsByTagName("div");
  var div = null;

  for ( var i=0; i < divs.length; i++ ) {
	  switch(divs[i].getAttribute("class")) {
		  case "moz-text-plain":
		  case "moz-text-flowed":
			  div = divs[i];
			  break;
		  default:
	  }
  }

  if( !div )
  {
    return;
  }

  div.innerHTML = parseDiff(div.innerHTML);

  var styleElement = message.createElement("style");
  styleElement.type = "text/css";

  var styletext = document.createTextNode(createStyle());
  styleElement.appendChild(styletext);
  
  var head = message.getElementsByTagName("head")[0]
  head.appendChild(styleElement);
//  dump(div.innerHTML);
}

function parseDiff(text) {
   if (! isDiff(text)) return text;
   var newText = text;
   newText = newText.replace(/^(<pre.*>)/mg, "$1\n\n\n\n" );
   newText = newText.replace(/^(@@\s\-\d+\,\d+\s\+\d+\,\d+\s@@)$/mg, "<span class='linetag'>$1</span>" );
   newText = newText.replace(/^(\+[^+].*)$/mg, "<span class='addline'>$1</span>" );
   newText = newText.replace(/^(\+{3}.*\d+\.\d+)$/mg, "<span class='addline'>$1</span>" );
   newText = newText.replace(/^(\-[^-].*)$/mg, "<span class='delline'>$1</span>" );
   newText = newText.replace(/^(\-{3}.*\d+\.\d+)$/mg, "<span class='delline'>$1</span>" );
   newText = newText.replace(/^( .*)$/mg, "<span class='steadyline'>$1</span>" );
   newText = newText.replace(/(\n\n)((.*\n){1,3}[-=]+\n)/g, "$1<div class='title'>$2</div>" );
   return newText;
}

function isDiff(text) {
   //check if text has line tags
   line_tag = /^@@\s\-\d+\,\d+\s\+\d+\,\d+\s@@$/m;
   return line_tag.test(text);
}