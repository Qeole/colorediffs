
function colorediffsTooltipCallback(elem) {
	var getTooltip = function (elem) {
		while( elem && elem.nodeName.toLowerCase() != "body" && elem.nodeName.toLowerCase() != "browser" && (elem.title == null || elem.title == "")	) {
			elem = elem.parentNode;
		}
		return (elem != null && elem.hasAttribute('title'))?elem.title:null;
	}

	if ( colorediffIsOn ) {
		var title = getTooltip(elem);
		if (title == "") {
			title = null;
		}

		$("colorediff-tooltip").value = title;
		return title != null;
	} else {
		return false;
	}
}

function colorediffsScrollCallback(evt) {
	var ourclass = evt.target.getAttribute('class');
	var opositeClass = (ourclass == "left")?"right":"left";

	var otherSide = document.getElementsByClassName(opositeClass, evt.target.parentNode.parentNode /*TR*/)[0];
	otherSide.scrollLeft = evt.target.scrollLeft;
}

