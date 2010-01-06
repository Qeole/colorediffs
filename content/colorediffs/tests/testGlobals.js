importFile("../globals.js");
importFile("../dom.js");

test.dollar = function() {
    var dom = new colorediffsGlobal.domHelper(document);
    var element = dom.createElement("div", {"id":'testData'}, "aaa");
    document.documentElement.appendChild(element);

    assert.that(colorediffsGlobal.$('testData').id, is.eqLoosely('testData'));
};

test.pad = function() {
	assert.that(colorediffsGlobal.pad("abcd", 7, " "), is.eq("abcd   "));
	assert.that(colorediffsGlobal.pad("abcd", 8, "_"), is.eq("abcd____"));
	assert.that(colorediffsGlobal.pad("abcd", 5), is.eq("abcd "));
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

test.trimLeft = function() {
	assert.that("___abcd___".trimLeft("_"), is.eq("abcd___"));
	assert.that("	 abcd ".trimLeft(), is.eq("abcd "));
};

test.fold = function() {
	assert.that(colorediffsGlobal.fold([1,2,3,4,5,6], function(e, o) {return o + e;}, ""), is.eq("123456"));
};
