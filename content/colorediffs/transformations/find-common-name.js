colorediffsGlobal.transformations.composite.members["find-common-name"] = {
	init: function(registrator, pref) {

		registrator.addListener("find-common-name", "file", findCommonName);

		function findCommonName(file, il) {
			if ( file['new'].name || file['old'].name ) {
				//get common part of the names
				var commonPart = returnCommonPart(file['new'].name || "", file['old'].name || "");

				//try all the combinations of it on the log until found something
				//common_name = found_part
				file.common_name = checkCombinations(il.log, commonPart) || commonPart;

				file.id = file.common_name;
			}

			return file;
		}

		function returnCommonPart(s1, s2) {
		    if (s1 && !s2) {
			return s1;
		    } else if (s2 && !s1) {
			return s2;
		    }
		    var d = findDiff(s1, s2);
		    var max = "";
		    for (var o = d; o; o = o.next[0]) {
			if (o.prev.length == 0 || o.prev.length == 2) {//funny way to found out if this is a common part
			    if (o.text.length > max.length) {
				max = o.text;
			    }
			}
		    }
		    return max.trim();
		}

		function skipNextComponent(s) {
			var i1 = s.indexOf("/");
			var i2 = s.indexOf("\\");

			var i = Math.max(i1, i2) + 1;

			if ( i > 0 ) {
				return s.substring(i);
			} else {
				return "";
			}
		}

		function checkCombinations(log, name) {
			do {
				if ( log.indexOf(name) >= 0 ) {
					return name;
				}

				name = skipNextComponent(name);
			} while( name != "" );
			return null;
		}

		function findDiff(a, b) {
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
			var ts = s.split(/([^A-Za-z0-9])/);
			var res = {text:"", next:[], prev: []};
			var next = res;
			for (var i = 0; typeof(ts[i]) != "undefined"; i++) {
			    var new_o = {text:ts[i], next:[], prev: []};
			    next.next.push(new_o);
			    new_o.prev.push(next);
			    next = new_o;
			}
			res.next[0].prev = [];
			return {first: res.next[0], last: next};
		    }

		    //vtokens are used as keys in hash to look for anchors
		    // should also have a link to what tokens it's from
		    // should contain one or more tokens
// 		    function break_to_vtokens(s) {
// 			var res = [];
// 			for (var i = 0; s[i]; i++) {
// 			    res.push(s.substr(i, 3));
// 			}
// 			return res;
// 		    }
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



		    for (el in hash) {
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
		}

		//test
		//findDiff("This is a diff line", "This is a new line");
	}
};