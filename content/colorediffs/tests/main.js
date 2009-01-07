let loadFile = function() {
    var res;
    if (typeof(readFile) != "undefined") {
	res = function(fileName) {
	    return readFile(fileName);
	};
    } else if (typeof(Components) != "undefined") {
	res = function(fileName) {
	    var MY_ID = "{282C3C7A-15A8-4037-A30D-BBEB17FFC76B}";
	    var em = Components.classes["@mozilla.org/extensions/manager;1"].
			 getService(Components.interfaces.nsIExtensionManager);
	    var file = em.getInstallLocation(MY_ID).getItemFile(MY_ID, fileName);

	    var fstream = Components.classes["@mozilla.org/network/file-input-stream;1"].
			      createInstance(Components.interfaces.nsIFileInputStream);
	    var sstream = Components.classes["@mozilla.org/scriptableinputstream;1"].
			      createInstance(Components.interfaces.nsIScriptableInputStream);
	    fstream.init(file, -1, 0, 0);
	    sstream.init(fstream);

	    var data = "";
	    var str = sstream.read(4096);
	    while (str.length > 0) {
		data += str;
		str = sstream.read(4096);
	    }

	    sstream.close();
	    fstream.close();

	    return data;
	};
    }
    return res;
}();

eval(loadFile("framework_utils.js"));

function getFileName(path) {
    var res = path.split(/[\\, \/]/);
    return res[res.length - 1];
}

let listFiles = function() {
    var res;
    if (typeof(importClass) != "undefined") {
	res = function(fileName) {
	    importClass(java.io.File);

	    return (new File(fileName)).list();
	};
    } else if (typeof(Components) != "undefined") {
	res = function(fileName) {
	    var MY_ID = "{282C3C7A-15A8-4037-A30D-BBEB17FFC76B}";
	    var em = Components.classes["@mozilla.org/extensions/manager;1"].
			 getService(Components.interfaces.nsIExtensionManager);
	    var file = em.getInstallLocation(MY_ID).getItemFile(MY_ID, fileName);

	    // file is the given directory (nsIFile)
	    var entries = file.directoryEntries;
	    var array = [];
	    while(entries.hasMoreElements()) {
		var entry = entries.getNext();
		entry.QueryInterface(Components.interfaces.nsIFile);
		array.push(getFileName(entry.path));
	    }
	    return array;
	};
    }
    return res;
}();

let log = function() {
    var res;
    if (typeof(importClass) != "undefined") {
	res = function(text) {
	    print(text);
	};
    } else if (typeof(Components) != "undefined") {
	res = function(text) {
	    Components.utils.reportError(text);
	};
    }
    return res;
}();

function isTestFile(path) {
    var filename = getFileName(path);
    return /^test.*\.js$/.test(filename);
}

function wrap(towrap, wrapwith) {
    return function () {
	var res;
	var args = arguments;
	var me = this;
	wrapwith(
	    function() { res = towrap.apply(me, args); }
	);
	return res;
    };
}

function checkGlobals(f) {
    return wrap(f, function(f) {
	var globalVars = {};
	for (let varName in this) {
	    globalVars[varName] = true;
	}

	f();

	var errors = [];
	for (let varName in this) {
	    if (typeof(globalVars[varName]) == "undefined") {
		if (varName != "ignoreGlobals" && (typeof(ignoreGlobals) == "undefined" || ignoreGlobals.indexOf(varName) == -1)) {
		    errors[varName] = "Warning: Reason: Polluted global namespace with '" + varName + "'";
		    assert.fail();
		}
	    }
	}
	for (let [v, text] in Iterator(errors)) {
	    delete this[v];
	    log(text);
	}
    })();
}

function prepLogs(p, f) {
    wrap(f, function(f) {
	var oldLog = log;
	log = function(t) { oldLog(p + t); };
	f();
	log = oldLog;
    })();
}

log("Wow, it's working");

let window = this;
let document = function() {
    if (typeof(xul_doc) == "undefined") {
	load("env.js");
	return new DOMDocument(
	    new java.io.ByteArrayInputStream(
		(new java.lang.String("<html><body></body></html>").getBytes("UTF8"))));
    } else {
	let el = xul_doc.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "xul:browser");
	el.style = "display:none";
	let elb = xul_doc.createElementNS("http://www.w3.org/1999/xhtml", "html:body");
	el.appendChild(elb);
	return elb.ownerDocument;
    }
}();

if (typeof(Element) == "undefined") {
    window.Element = DOMElement;
    DOMElement.prototype.getElementsByClassName = function(className) {
	var elements = [];
	var qwe = this.getElementsByTagName("*");
	for (var i = 0; i < qwe.length; i++) {
		if (qwe[i] && qwe[i].getAttribute("class") == className) {
			elements.push(qwe[i]);
		}
	}

	return elements;
    };
}

let getInnerHTML = function() {
    if (typeof(Element.innerHTML) != "undefined") {
	return function(el) { return el.innerHTML; };
    } else {
	return function(el) {
 	    let serializer = new XMLSerializer();
	    let xml = "";
	    for (let e in Iterator(el.childNodes)) {
		xml += serializer.serializeToString(e);
	    }
	    return serializer.serializeToString(xml).replace('xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"', "", "g").replace('"', "'", "g");
	};
    }
}();

var dir = "content/colorediffs/tests/";
var files = listFiles(dir).filter(isTestFile);

for (let [, file] in Iterator(files)) {
    prepLogs(getFileName(file) + ": ", function() {
	checkGlobals(function() {
	    ignoreGlobals = ["location"];
	    test = {};
	    assert.mustNotThrow(function() {
		eval(loadFile(dir + file));
		for (let varName in test) {
		    ignoreGlobals.push(varName);
		    prepLogs(varName + ": ", function() {
			checkGlobals(function() {
			    assert.mustNotThrow(function() {
				test[varName]();
			    });
			    assert.clear();
			});
		    });
		}
	    });
	    delete test;
	});
    });
}

if (!assert.everything_ok()) {
    throw 1; //make exit code
}
