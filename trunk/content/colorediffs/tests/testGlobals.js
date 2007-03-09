
function testMatchPerlLike() {
	"aaaa".match_perl_like(/(a)/);
	assertEquals("$1 check", "a", $1);

	"bbbb".match_perl_like(/(b)(b)/);
	assertEquals("$1 check", "b", $1);
	assertEquals("$2 check", "b", $2);
}

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
