
function testDom() {
	var dom = new colorediffsGlobal.domHelper(document);

	var element = dom.createElement("div", null,
									dom.createElement("span", {class:"black", id:1},
													  function() {
														  return dom.createElement("p", null,
																			"Nice paragraph");
													  }),
									["That is the end", "It is"]);

	assertEquals("Dom", '<span id="1" class="black"><p>Nice paragraph</p></span>That is the endIt is', element.innerHTML);
}
