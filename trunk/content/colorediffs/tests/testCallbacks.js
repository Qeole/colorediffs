function testTooltipCallback() {
	var me = colorediffsGlobal;

	me.isActive = function() {return true;}

	assertTrue("First tooltip", me.tooltipCallback(document.getElementById('first-test')));
	assertEquals("Check first tooltip", "nice tooltip", document.getElementById('colorediff-tooltip').value);

	assertTrue("Second tooltip", me.tooltipCallback(document.getElementById('second-test')));
	assertEquals("Check second tooltip", "another nice tooltip", document.getElementById('colorediff-tooltip').value);

	assertFalse("Third tooltip", me.tooltipCallback(document.getElementById('third-test')));

	me.isActive = function() {return false;}
	assertFalse("First tooltip non-active", me.tooltipCallback(document.getElementById('first-test')));
}

function testScrollCallback() {
	var me = colorediffsGlobal;

	var left = document.getElementById("left");
	var right = document.getElementById("left");

	left.scrollLeft = 5;
	me.scrollCallback({target:left});
	assertEquals("check left scroll", 5, right.scrollLeft);

	right.scrollLeft = 3;
	me.scrollCallback({target:right});
	assertEquals("check right scroll", 3, left.scrollLeft);
}
