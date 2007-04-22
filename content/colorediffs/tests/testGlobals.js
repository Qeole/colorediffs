
function testDollar() {
	assertEquals("Dollar check", colorediffsGlobal.$('testData').id, 'testData');
}

function testGetElementsByClassName() {
	var elems = document.getElementsByClassName("test", document.getElementById('classTesting'));

	assertNotNull("First Null check", elems);

	assertEquals("Length check", 4, elems.length);

	var elemsIds = [];
	for (var i=0; i < elems.length; i++) {
		elemsIds.push(elems[i].id);
	}

	elemsIds.sort();

	assertEquals("Elems ids", [1, 2, 3, 4].join(","), elemsIds.join(",") );

	var elems2 = document.getElementsByClassName("test2", document.getElementById('classTesting'));
	assertNotNull("Second Null check", elems2);
	assertEquals("Length check", 0, elems2.length);
}

function testPad() {
	assertEquals("Pad spaces", "abcd   ", "abcd".pad(7, " "));
	assertEquals("Pad _", "abcd____", "abcd".pad(8, "_"));
	assertEquals("Pad default(spaces)", "abcd ", "abcd".pad(5));
}

function testIsUpperCaseLetter() {
	assertTrue("Uppercase", colorediffsGlobal.isUpperCaseLetter("R"));
	assertFalse("Lowercase", colorediffsGlobal.isUpperCaseLetter("s"));
}

function testHtmlToPlainText() {
	assertEquals("Smiley and link", "This is a link to google - the best :) search engine in the world", colorediffsGlobal.htmlToPlainText("This is a link to <a href='www.google.com'>google</a> - the best <img class='moz-txt-smily' alt = \":)\"> search engine in the world"));
	assertEquals("Unescaped html", 'Me & my brother and <magnificent joey> aka "Fish"', colorediffsGlobal.htmlToPlainText("Me &amp; my&nbsp;brother<img src='foto01.jpg'> and &lt;magnificent joey&gt; aka &quot;Fish&quot;"));
}

function testEscapeHtml() {
	assertEquals("All the reserved chars", "&lt;div&gt;&quot;Hello&quot; 'darling' &amp; good bye&lt;/div&gt;", colorediffsGlobal.escapeHTML("<div>\"Hello\" 'darling' & good bye</div>"));
}

function testTrim() {
	assertEquals("Trim _", "abcd", "___abcd___".trim("_"));
	assertEquals("Trim default(spaces)", "abcd", "	 abcd	".trim());
}

function testLTrim() {
	assertEquals("LTrim _", "abcd___", "___abcd___".ltrim("_"));
	assertEquals("LTrim default(spaces)", "abcd ", "	 abcd ".ltrim());
}

function testFold() {
	assertEquals("Fold", "123456", [1,2,3,4,5,6].fold(function(e, o) {return o + e;}, ""));
}
