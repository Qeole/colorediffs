eval(loadFile("content/colorediffs/globals.js"));
eval(loadFile("content/colorediffs/dom.js"));

test.dom = function() {
    var dom = new colorediffsGlobal.domHelper(document);

    var element = dom.createElement("div", null,
	dom.createElement("span", {"class":"black", "id":1},
	function() {
	    return dom.createElement("p", null,
	    "Nice paragraph");
	}),
	["That is the end", "It is"]);

    //create supposed result
    var div = document.createElement("div");
    var span = document.createElement("span");
    span.setAttribute("id", "1");
    span.setAttribute("class", "black");
    var p = document.createElement("p");
    var nice = document.createTextNode("Nice paragraph");
    p.appendChild(nice);
    span.appendChild(p);
    div.appendChild(span);
    var end1 = document.createTextNode("That is the end");
    div.appendChild(end1);
    var end2 = document.createTextNode("It is");
    div.appendChild(end2);

    assert.that(element, is.eqDom(div));
};
