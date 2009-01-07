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
    },
    eqJson: function(expr) {
	function check(a, b) {
	    if (a == null && b == null) {
		return true;
	    } else if (a == null && b != null || b == null && a != null) {
		return false;
	    } else if (typeof(a) != typeof(b)) {
		return false;
	    } else if (typeof(a) == "object") {
		for (let [name, value] in Iterator(a)) {
		    if (!check(value, b[name])) {
			return false;
		    }
		}
		for (let [name, value] in Iterator(b)) {
		    if (!check(value, a[name])) {
			return false;
		    }
		}
		return true;
	    } else {
		return a === b;
	    }
	}

	return {
	    check: function(actual) {
		return check(actual, expr);
	    },
	    expected: expr,
	    format: ppJson
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

		if (nice_actual.indexOf("\n") != -1 && nice_expected.indexOf("\n") != -1) {
		    //show diff instead
		    let diff = make_diff(nice_actual, nice_expected);
		    log("Assert #" + number + ": < diff between (+)got and (-)expected : " + diff + " :>");
		    log("Assert #" + number + ": < got: " + nice_actual + " :>, < expected: " + nice_expected + " :>");
		} else {
		    log("Assert #" + number + ": < got: " + nice_actual + " :>, < expected: " + nice_expected + " :>");
		}

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

let ppJson = function(el) {
    function intPP(indent, el) {
	if (el == null) {
	    return "null";
	} else if (typeof(el) == "object") {
	    if (el instanceof Array) {
		let res = "[\n";
		let new_indent = indent + "    ";
		var attrs = [];
		for (let [,value] in Iterator(el)) {
		    let attr_value = new_indent + intPP(new_indent, value);
		    attrs.push(attr_value);
		}
		res += attrs.join(",\n");
		res += "\n" + indent + "]";
		return res;
	    } else {
		let res = "{\n";
		let new_indent = indent + "    ";
		var attrs = [];
		for (let [name, value] in Iterator(el)) {
		    let attr_name = new_indent + "'" + name + "' : ";
		    let attr_value = intPP(attr_name.replace(/./g, " "), value);
		    attrs.push(attr_name + attr_value);
		}
		res += attrs.join(",\n");
		res += "\n" + indent + "}";
		return res;
	    }
	} else if (typeof(el) == "string") {
	    return "'" + el + "'";
	} else {
	    return el.toString();
	}
    }
    return intPP("", el);
};

let make_diff = function(a, b) {
    let diff = findDiff(a, b);
    let string_diff = "";
    var o = diff;
    while(o) {
	string_diff += o.text.replace(/^/mg, " ").replace(/\n $/, "\n");
	if (o.next.length != 0) {
	    var added = (o.next[0].prev.length != 2)?o.next[0].text:null;
	    var deleted = (o.next[1].prev.length != 2)?o.next[1].text:null;
	    if (added != null) {
		string_diff += added.replace(/^/mg, "+").replace(/\n\+$/, "\n");
	    }
	    if (deleted != null) {
		string_diff += deleted.replace(/^/mg, "-").replace(/\n-$/, "\n");
	    }

	    if (added != null) {
		o = o.next[0].next[0];
	    }
	} else {
	    o = null;
	}
    }
    return string_diff;
};

let findDiff = function(a, b) {
    //replace element in array
    function replace(arr, el, new_el) {
	if (el == new_el) return;
	for (var i=0; arr[i]; i++) {
	    if (arr[i] == el) {
		arr[i] = new_el;
		break;
	    }
	}
    }

    function zip(arr) {
	var res = [];
	var prev = null;
	for (var i=0; arr[i]; i++) {
	    if (arr[i] != prev) {
		res.push(arr[i]);
	    }
	    prev = arr[i];
	}
	return res;
    }

    function join(old_o, new_o) {
	var common = old_o;
	replace(old_o.prev[0].next, old_o, common);
	replace(new_o.prev[0].next, new_o, common);
	old_o.prev[0].next = zip(old_o.prev[0].next);
	new_o.prev[0].next = zip(new_o.prev[0].next);
	replace(old_o.next[0].prev, old_o, common);
	replace(new_o.next[0].prev, new_o, common);
	old_o.next[0].prev = zip(old_o.next[0].prev);
	new_o.next[0].prev = zip(new_o.next[0].prev);
	common.prev = zip([old_o.prev[0], new_o.prev[0]]);
	common.next = zip([old_o.next[0], new_o.next[0]]);
    }

    function break_to_tokens(s) {
	var ts = s.split("\n");
	var res = {text:"", next:[], prev: []};
	var next = res;
	for (var i = 0; typeof(ts[i]) != "undefined"; i++) {
	    var new_o = {text:ts[i] + "\n", next:[], prev: []};
	    next.next.push(new_o);
	    new_o.prev.push(next);
	    next = new_o;
	}
	res.next[0].prev = [];
	return {first: res.next[0], last: next};
    }

    function break_to_vtokens(tokens) {
	var res = [];
	for (var o = tokens.first; o; o = o.next[0]) {
	    res.push({anchor:o.text, tokens:[o]});
	}
	return res;
    }

    var hash = {};

    var new_tokens = break_to_tokens(b);
    var new_vtokens = break_to_vtokens(new_tokens);
    for (var i = 0; new_vtokens[i]; i++) {
	var temp = hash[new_vtokens[i].anchor];
	if (!temp) {
	    //we are interested in new/old tokens only if nc==oc==1
	    hash[new_vtokens[i].anchor] = temp = {nc: 0, oc: 0, new_tokens: new_vtokens[i].tokens, old_tokens:[]};
	}
	temp.nc++;
    }

    var old_tokens = break_to_tokens(a);
    var old_vtokens = break_to_vtokens(old_tokens);
    for (i = 0; old_vtokens[i]; i++) {
	var temp = hash[old_vtokens[i].anchor];
	if (!temp) {
	    hash[old_vtokens[i].anchor] = temp = {nc: 0, oc: 0, new_tokens: [], old_tokens:[]};
	}
	temp.oc++;
	temp.old_tokens = old_vtokens[i].tokens; //we are interested in new/old tokens only if nc==oc==1
    }

    var common_first = {text:"", prev:[], next:[old_tokens.first, new_tokens.first]};
    var common_last = {text:"", next:[], prev:[old_tokens.last, new_tokens.last]};
    old_tokens.first.prev.push(common_first); new_tokens.first.prev.push(common_first);
    old_tokens.last.next.push(common_last); new_tokens.last.next.push(common_last);
    var res = {first:common_first, last:common_last};

    for (let el in hash) {
	var e = hash[el];
	if (e.nc == 1 && e.oc == 1) {
	    for (i = 0; e.old_tokens[i] && e.new_tokens[i]; i++) {
		join(e.old_tokens[i], e.new_tokens[i]);
	    }
	}
    }

    for (var o = res.first; o; o = o.next[0]) {
	if (o.next.length == 2) {
	    //we're on common element, see if we can join next one
	    if (o.next[0].text == o.next[1].text) {
		join(o.next[0], o.next[1]);
	    }
	}
    }

    for (o = res.last; o; o = o.prev[0]) {
	if (o.prev.length == 2) {
	    //we're on common element, see if we can join previous one
	    if (o.prev[0].text == o.prev[1].text) {
		join(o.prev[0], o.prev[1]);
	    }
	}
    }

    //simplify result by joining tokens from the same group (common, old) together
    for (o = res.first; o;) {
	//if a <-> b exclusively
	if (o.next.length == 1 && o.next[0].prev.length == 1) {
	    var onext = o.next[0];
	    //join a and b
	    o.text = o.text + onext.text;
	    o.next = onext.next;
	    for (i = 0; o.next[i]; i++) {
		replace(o.next[i].prev, onext, o);
	    }
	} else {
	    o = o.next[0];
	}
    }

    //simplify result by joining tokens from the same group (common, new) together
    for (o = res.first; o;) {
	//if a <-> b exclusively
	if (o.next.length == 1 && o.next[0].prev.length == 1) {
	    var onext = o.next[0];
	    //join a and b
	    o.text = o.text + onext.text;
	    o.next = onext.next;
	    for (i = 0; o.next[i]; i++) {
		replace(o.next[i].prev, onext, o);
	    }
	} else {
	    o = o.next[o.next.length-1];
	}
    }
    return res.first;
};
