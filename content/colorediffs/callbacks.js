if (!colorediffsGlobal) {
	var colorediffsGlobal = {}
}

colorediffsGlobal.tooltipCallback = function(elem) {
	var getTooltip = function (elem) {
		while( elem && elem.nodeName.toLowerCase() != "body" && elem.nodeName.toLowerCase() != "browser" && (elem.title == null || elem.title == "")	) {
			elem = elem.parentNode;
		}
		return (elem != null && elem.hasAttribute('title'))?elem.title:null;
	}

	if ( this.isActive() ) {
		var title = getTooltip(elem);
		if (title == "") {
			title = null;
		}

		this.$("colorediff-tooltip").value = title;
		return title != null;
	} else {
		return false;
	}
}

colorediffsGlobal.scrollCallback = function(evt) {
	var ourclass = evt.target.getAttribute('class');
	var opositeClass = (ourclass == "left")?"right":"left";

	var otherSide = document.getElementsByClassName(opositeClass, evt.target.parentNode.parentNode /*TR*/)[0];
	otherSide.scrollLeft = evt.target.scrollLeft;
}

