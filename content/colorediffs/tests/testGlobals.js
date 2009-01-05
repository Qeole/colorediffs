eval(loadFile("content/colorediffs/globals.js"));

// function testDollar() {
// 	assertEquals("Dollar check", colorediffsGlobal.$('testData').id, 'testData');
// }

// function testGetElementsByClassName() {
// 	var elems = document.getElementById('classTesting').getElementsByClassName("test");

// 	assertNotNull("First Null check", elems);

// 	assertEquals("Length check", 4, elems.length);

// 	var elemsIds = [];
// 	for (var i=0; i < elems.length; i++) {
// 		elemsIds.push(elems[i].id);
// 	}

// 	elemsIds.sort();

// 	assertEquals("Elems ids", [1, 2, 3, 4].join(","), elemsIds.join(",") );

// 	var elems2 = document.getElementById('classTesting').getElementsByClassName("test2");
// 	assertNotNull("Second Null check", elems2);
// 	assertEquals("Length check", 0, elems2.length);
// }

test.pad = function() {
	assert.that("abcd".pad(7, " "), is.eq("abcd   "));
	assert.that("abcd".pad(8, "_"), is.eq("abcd____"));
	assert.that("abcd".pad(5), is.eq("abcd "));
};

test.isUpperCaseLetter = function() {
	assert.that(colorediffsGlobal.isUpperCaseLetter("R"), is.True());
	assert.that(colorediffsGlobal.isUpperCaseLetter("s"), is.False());
};

test.htmlToPlainText = function() {
	assert.that(colorediffsGlobal.htmlToPlainText("This is a link to <a href='www.google.com'>google</a> - the best <img class='moz-txt-smily' alt = \":)\"> search engine in the world"), is.eq("This is a link to google - the best :) search engine in the world"));
	assert.that(colorediffsGlobal.htmlToPlainText("Me &amp; my&nbsp;brother<img src='foto01.jpg'> and &lt;magnificent joey&gt; aka &quot;Fish&quot;"), is.eq('Me & my brother and <magnificent joey> aka "Fish"'));
};

test.escapeHtml = function() {
	assert.that(colorediffsGlobal.escapeHTML("<div>\"Hello\" 'darling' & good bye</div>"), is.eq("&lt;div&gt;&quot;Hello&quot; 'darling' &amp; good bye&lt;/div&gt;"));
};

test.trim = function () {
	assert.that("___abcd___".trim("_"), is.eq("abcd"));
	assert.that("	 abcd	".trim(), is.eq("abcd"));
};

test.ltrim = function() {
	assert.that("___abcd___".ltrim("_"), is.eq("abcd___"));
	assert.that("	 abcd ".ltrim(), is.eq("abcd "));
};

test.fold = function() {
	assert.that(colorediffsGlobal.fold([1,2,3,4,5,6], function(e, o) {return o + e;}, ""), is.eq("123456"));
};

function testInclude() {
	colorediffsGlobal.include("tests/testGlobalInclude.js");
	assertEquals("Include", "Included", isGlobalIncluded);
}
