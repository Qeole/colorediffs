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

let ppDom = function(el) {
    let res;
    if (typeof(el.outerHTML) != "undefined") {
	res = el.outerHTML;
    } else {
	let serializer = new XMLSerializer();
	res = serializer.serializeToString(el);
    }
    return "\n" + XML(res).toXMLString() + "\n";
};

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
    },
    eqLoosely: function(expr) {
	return {
	    check: function(actual) {return actual == expr;},
	    expected: expr
	};
    },
    eqDom: function(expr) {
	function checkAttrs(a, b) {
	    let an = a.attributes;
	    let bn = b.attributes;
	    if (an == null && bn == null) {
		return true;
	    } else if ((an == null && bn != null) || (an != null && bn == null)) {
		return false;
	    }
	    if (typeof(an.length) != "undefined") {
		if (an.length == bn.length) {
		    let length = an.length;
		    let hash = {};
		    for (let i = 0; i < length; i++) {
			hash[an.item(i).name] = an.item(i).value;
		    }

		    for (let i = 0; i < length; i++) {
			if (hash[bn.item(i).name] != bn.item(i).value) {
			    return false;
			}
		    }
		} else {
		    return false;
		}
	    } else {
		for (let a in an) {
		    if (bn[a] != an[a]) {
			return false;
		    }
		}
		for (let b in bn) {
		    if (bn[b] != an[b]) {
			return false;
		    }
		}
	    }
	    return true;
	}

	function check(a, b) {
	    if (checkAttrs(a, b)) {
		let an = a.childNodes;
		let bn = b.childNodes;
		if (an == null && bn == null) {
		    return true;
		} else if ((an == null && bn != null) || (an != null && bn == null)) {
		    return false;
		}
		if (an.length == bn.length) {
		    let length = an.length;
		    for (let i = 0; i < length; i++) {
			if (!check(an[i], bn[i])) {
			    return false;
			}
		    }
		    return true;
		} else {
		    return false;
		}
	    } else {
		return false;
	    }
	}

	return {
	    check: function(actual) {
		return check(actual, expr);
	    },
	    expected: expr,
	    format: ppDom
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
		let nice_actual = (pred.format == null)?actual:pred.format(actual);
		let nice_expected = (pred.format == null)?pred.expected:pred.format(pred.expected);
		log("Assert #" + number + ": < got: " + nice_actual + " :>, < expected: " + nice_expected + " :>");

// 		let diff = findDiff(nice_actual, nice_expected);
// 		let string_diff = "";
// 		for (var o = d; o; o = o.next[0]) {
// 		    if (o.prev.length == 0 || o.prev.length == 2) {//funny way to find out if this is a common part
// 			string_diff += o.text;
// 		    } else {
// 			//if () {}
// 		    }
// 		}

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

// let findDiff = function(a, b) {
//     //replace element in array
//     function replace(arr, el, new_el) {
// 	if (el == new_el) return;
// 	for (var i=0; arr[i]; i++) {
// 	    if (arr[i] == el) {
// 		arr[i] = new_el;
// 		break;
// 	    }
// 	}
//     }

//     function zip(arr) {
// 	var res = [];
// 	var prev = null;
// 	for (var i=0; arr[i]; i++) {
// 	    if (arr[i] != prev) {
// 		res.push(arr[i]);
// 	    }
// 	    prev = arr[i];
// 	}
// 	return res;
//     }

//     function join(old_o, new_o) {
// 	var common = old_o;
// 	replace(old_o.prev[0].next, old_o, common);
// 	replace(new_o.prev[0].next, new_o, common);
// 	old_o.prev[0].next = zip(old_o.prev[0].next);
// 	new_o.prev[0].next = zip(new_o.prev[0].next);
// 	replace(old_o.next[0].prev, old_o, common);
// 	replace(new_o.next[0].prev, new_o, common);
// 	old_o.next[0].prev = zip(old_o.next[0].prev);
// 	new_o.next[0].prev = zip(new_o.next[0].prev);
// 	common.prev = zip([old_o.prev[0], new_o.prev[0]]);
// 	common.next = zip([old_o.next[0], new_o.next[0]]);
//     }

//     function break_to_tokens(s) {
// 	var ts = s.split(/([^A-Za-z0-9])/);
// 	var res = {text:"", next:[], prev: []};
// 	var next = res;
// 	for (var i = 0; typeof(ts[i]) != "undefined"; i++) {
// 	    var new_o = {text:ts[i], next:[], prev: []};
// 	    next.next.push(new_o);
// 	    new_o.prev.push(next);
// 	    next = new_o;
// 	}
// 	res.next[0].prev = [];
// 	return {first: res.next[0], last: next};
//     }

//     //vtokens are used as keys in hash to look for anchors
//     // should also have a link to what tokens it's from
//     // should contain one or more tokens
//     // 		    function break_to_vtokens(s) {
// // 			var res = [];
// // 			for (var i = 0; s[i]; i++) {
// // 			    res.push(s.substr(i, 3));
// // 			}
// // 			return res;
// // 		    }
//     function break_to_vtokens(tokens) {
// 	var res = [];
// 	for (var o = tokens.first; o; o = o.next[0]) {
// 	    res.push({anchor:o.text, tokens:[o]});
// 	}
// 	return res;
//     }

//     var hash = {};

//     var new_tokens = break_to_tokens(b);
//     var new_vtokens = break_to_vtokens(new_tokens);
//     for (var i = 0; new_vtokens[i]; i++) {
// 	var temp = hash[new_vtokens[i].anchor];
// 	if (!temp) {
// 	    //we are interested in new/old tokens only if nc==oc==1
// 	    hash[new_vtokens[i].anchor] = temp = {nc: 0, oc: 0, new_tokens: new_vtokens[i].tokens, old_tokens:[]};
// 	}
// 	temp.nc++;
//     }

//     var old_tokens = break_to_tokens(a);
//     var old_vtokens = break_to_vtokens(old_tokens);
//     for (i = 0; old_vtokens[i]; i++) {
// 	var temp = hash[old_vtokens[i].anchor];
// 	if (!temp) {
// 	    hash[old_vtokens[i].anchor] = temp = {nc: 0, oc: 0, new_tokens: [], old_tokens:[]};
// 	}
// 	temp.oc++;
// 	temp.old_tokens = old_vtokens[i].tokens; //we are interested in new/old tokens only if nc==oc==1
//     }

//     var common_first = {text:"", prev:[], next:[old_tokens.first, new_tokens.first]};
//     var common_last = {text:"", next:[], prev:[old_tokens.last, new_tokens.last]};
//     old_tokens.first.prev.push(common_first); new_tokens.first.prev.push(common_first);
//     old_tokens.last.next.push(common_last); new_tokens.last.next.push(common_last);
//     var res = {first:common_first, last:common_last};

//     for (el in hash) {
// 	var e = hash[el];
// 	if (e.nc == 1 && e.oc == 1) {
// 	    for (i = 0; e.old_tokens[i] && e.new_tokens[i]; i++) {
// 		join(e.old_tokens[i], e.new_tokens[i]);
// 	    }
// 	}
//     }

//     for (var o = res.first; o; o = o.next[0]) {
// 	if (o.next.length == 2) {
// 	    //we're on common element, see if we can join next one
// 	    if (o.next[0].text == o.next[1].text) {
// 		join(o.next[0], o.next[1]);
// 	    }
// 	}
//     }

//     for (o = res.last; o; o = o.prev[0]) {
// 	if (o.prev.length == 2) {
// 	    //we're on common element, see if we can join previous one
// 	    if (o.prev[0].text == o.prev[1].text) {
// 		join(o.prev[0], o.prev[1]);
// 	    }
// 	}
//     }

//     //simplify result by joining tokens from the same group (common, old) together
//     for (o = res.first; o;) {
// 	//if a <-> b exclusively
// 	if (o.next.length == 1 && o.next[0].prev.length == 1) {
// 	    var onext = o.next[0];
// 	    //join a and b
// 	    o.text = o.text + onext.text;
// 	    o.next = onext.next;
// 	    for (i = 0; o.next[i]; i++) {
// 		replace(o.next[i].prev, onext, o);
// 	    }
// 	} else {
// 	    o = o.next[0];
// 	}
//     }

//     //simplify result by joining tokens from the same group (common, new) together
//     for (o = res.first; o;) {
// 	//if a <-> b exclusively
// 	if (o.next.length == 1 && o.next[0].prev.length == 1) {
// 	    var onext = o.next[0];
// 	    //join a and b
// 	    o.text = o.text + onext.text;
// 	    o.next = onext.next;
// 	    for (i = 0; o.next[i]; i++) {
// 		replace(o.next[i].prev, onext, o);
// 	    }
// 	} else {
// 	    o = o.next[o.next.length-1];
// 	}
//     }
//     return res.first;
// };

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
