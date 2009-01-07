eval(loadFile("content/colorediffs/globals.js"));
eval(loadFile("content/colorediffs/callbacks.js"));
eval(loadFile("content/colorediffs/dom.js"));

test.tooltipCallback = function() {
    var me = colorediffsGlobal;
    var dom = new colorediffsGlobal.domHelper(document);

    me.isActive = function() {return true;};

    let tt = dom.createElement("div", {"id":'colorediff-tooltip', 'value':'aaa'}, null);
    document.documentElement.appendChild(tt);
    let tooltip = me.$("colorediff-tooltip");

    let first_test = dom.createElement("div", {"id":"first-test"}, "");
    let element =
	    dom.createElement("div", {'title':'nice tooltip'},
		dom.createElement("div", null, first_test));

    assert.that(me.tooltipCallback(first_test), is.True());
    assert.that(tooltip.getAttribute('value'), is.eqLoosely("nice tooltip"));

    let second_test = dom.createElement("div", {"id":"second-test", title:"another nice tooltip"}, "");

    assert.that(me.tooltipCallback(second_test), is.True());
    assert.that(tooltip.getAttribute('value'), is.eqLoosely("another nice tooltip"));

    let third_test = dom.createElement("div", {"id":"third-test"}, "");

    assert.that(me.tooltipCallback(third_test), is.False());

    me.isActive = function() {return false;};
    assert.that(me.tooltipCallback(first_test), is.False());
};

test.scrollCallback = function() {
    var me = colorediffsGlobal;
    var dom = new colorediffsGlobal.domHelper(document);

    var table = dom.createElement("table", null,
	dom.createElement("tr", null,
	    [dom.createElement("td", {"width":"1px"},
		dom.createElement("pre", {"class":"left", "id":"left", "style":"overflow:scroll"},
		    "big string")),
	     dom.createElement("td", {"width":"1px"},
		dom.createElement("pre", {"class":"right", "id":"right", "style":"overflow:scroll"},
		    "big string"))]));

    document.documentElement.appendChild(table);

    var left = document.getElementById("left");
    var right = document.getElementById("right");

    left.scrollLeft = 5;
    me.scrollCallback({target:left});
    assert.that(right.scrollLeft, is.eq(left.scrollLeft));

    right.scrollLeft = 3;
    me.scrollCallback({target:right});
    assert.that(left.scrollLeft, is.eq(right.scrollLeft));
};
