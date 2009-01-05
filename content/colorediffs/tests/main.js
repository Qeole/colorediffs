if (typeof(load) != "undefined") { //this is Rhino
    load("env.js");
    document = window.document;
}

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

function isTrue() {
    return function (actual, not) {
	return assert.testOrNot(
	    actual,
	    not,
	    message || "Should have been truey:<" + actual + ">",
	    message || "Should have been falsey:<" + actual + ">");
    };
}

function isFalse(actual) {
    if (!actual) {
	return true;
    } else {
	log("got " + actual + ", expected false");
	return false;
    }
}

function eq(actual) {
    if (!actual) {
	return true;
    } else {
	log("got " + actual + ", expected false");
	return false;
    }
}

let is = {
    True: function() {
	return {
	    check: function(actual) {return actual === true;},
	    expected: "true"
	};
    },
    False: function() {
	return {
	    check: function(actual) {return actual === false;},
	    expected: "false"
	};
    },
    eq: function(expr) {
	return {
	    check: function(actual) {return actual === expr;},
	    expected: expr
	};
    }
};

let assert = function() {
    var number = 1;
    var something_failed = false;
    return {
	that: function(actual, pred) {
	    var res = pred.check(actual);
	    if (!res) {
		log("Assert #" + number + ": < got: " + actual + " :>, < expected: " + pred.expected + " :>");
		something_failed = true;
	    }
	    number++;
	},
	mustNotThrow: function(f) {
	    try {
		f();
	    } catch(e) {
		log("Got exception:  " + e.fileName + ":" + e.lineNumber + " : " + e);
		something_failed = true;
	    }
	},
	fail: function() {
	    something_failed = true;
	},
	clear: function() {
	    number = 1;
	},
	everything_ok: function() {return !something_failed;}
    };
}();

log("Wow, it's working");

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
