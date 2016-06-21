I don't know where to post it so it'll be here.

The best possible way to get message user reading is
```
var messageText = document.getElementById("messagepane").contentDocument.body
```

This will give you html with some of the thunderbird special elements inside, all the text that looks like links will be replaced to actual ones, smiles might be converted to images etc. You can save a little time by searching for `<div class="moz-text-plain">` elements, inside them lying actual body and inlined attachments, each one in different `<div>`.

This is sad picture but there are no better alternatives. You can get mime version but then you'll have to parse it yourself, also you could get xml version, but there are only headers, no text itself.

But lets look at them anyway. It also might be useful if you have uri of message that user don't reading right now and you want to do something with it.

So, how to read a message? There are two simple ways.

```
var messageService = messenger.messageServiceFromURI(uri);
var messageStream = Components.classes["@mozilla.org/network/sync-stream-listener;1"].createInstance().QueryInterface(Components.interfaces.nsIInputStream);
var inputStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance().QueryInterface(Components.interfaces.nsIScriptableInputStream);
inputStream.init(messageStream);
messageService.streamMessage(uri, messageStream, {}, null, false, null);

var body = "";
inputStream.available();
while (inputStream.available()) {
   body = body + inputStream.read(512);
}

messageStream.close();
inputStream.close();
```

I got this version from [this blog](http://www.blogger.com/comment.g?blogID=10911258&postID=112480960399966267).
It reads mime version of message in sync way.

You also could use this code
```
	var messageService = messenger.messageServiceFromURI(uri);

        var body = "";

	var dataListener = {
		QueryInterface: function(aIID) {
			if (aIID.equals(Components.interfaces.nsISupports) || aIID.equals(Components.interfaces.nsIStreamListener))
				return this;
			throw Components.results.NS_NOINTERFACE;
		},
		onStartRequest: function() {},
		onStopRequest: function() {},
		onDataAvailable:function(req, context, inputStream, offset, count) {
			var sStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance().QueryInterface(Components.interfaces.nsIScriptableInputStream);
			sStream.init(inputStream);
			sStream.available();
			while (sStream.available()) {
				body += sStream.read(count);
			}
		}
	};

	messageService.streamMessage(uri, dataListener, {}, null, true, null);
```

This code does the same, only using async IO.

But it doesn't help us much if we have mime encoded message. It's no fun to parse one with JavaScript. But it's Thunderbird, it could convert MIME to something more useful, it does it for user anyway.

So, if you want to get nice html message you could get MIME version and convert it to HTML using this code
```
        var messageService = messenger.messageServiceFromURI(uri);

        var body = ""

	var dataListener = {
		QueryInterface: function(aIID) {
			if (aIID.equals(Components.interfaces.nsISupports) || aIID.equals(Components.interfaces.nsIStreamListener))
				return this;
			throw Components.results.NS_NOINTERFACE;
		},
		onStartRequest: function() {},
		onStopRequest: function() {},
		onDataAvailable:function(req, context, inputStream, offset, count) {
			var sStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance().QueryInterface(Components.interfaces.nsIScriptableInputStream);
			sStream.init(inputStream);
			sStream.available();
			while (sStream.available()) {
				body += sStream.read(count);
			}
		}
	};

	var initialListener = {
		QueryInterface: function(aIID) {
			if (aIID.equals(Components.interfaces.nsISupports) || aIID.equals(Components.interfaces.nsIStreamListener))
				return this;
			throw Components.results.NS_NOINTERFACE;
		},
		streamConverter: null,
		onStartRequest: function(request, context) {
			//create converter
			this.streamConverter = Components.classes["@mozilla.org/streamconv;1?from=message/rfc822&to=application/vnd.mozilla.xul+xml"].createInstance().QueryInterface(Components.interfaces.nsIStreamConverter);
			this.streamConverter.asyncConvertData("message/rfc822", "application/vnd.mozilla.xul+xml", dataListener, request);
                        this.streamConverter.onStartRequest(request, context);
		},
		onStopRequest: function(request, context, status) {
                        this.streamConverter.onStopRequest(request, context, status);
		},
		onDataAvailable:function(req, context, inputStream, offset, count) {
			this.streamConverter.onDataAvailable(req, context, inputStream, offset, count);
		}
	};

	messageService.streamMessage(uri, initialListener, {}, null, true, null);
```

That's all. You'll get your html. Notice there are few MIME types in the text, and none of them is text/html. It doesn't matter, converter still would produce html :)

The only change you can do to get xml is to change the last line to
```
	messageService.streamMessage(uri, initialListener, {}, null, true, "only");
```

But this would be waste of your time anyway, you'll get only headers and nothing more.

So, if you want to get plain text of the message, the simplest thing that you could do is get HTML and throw all the tags away. Don't forget to convert smileys back though.