
function colorediffsTooltipCallback(elem) {
	var getTooltip = function (elem) {
		while( elem && elem.nodeName.toLowerCase() != "body" && elem.nodeName.toLowerCase() != "browser" && (elem.title == null || elem.title == "")	) {
			elem = elem.parentNode;
		}
		return elem && elem.getAttribute('title');
	}

	if ( $("colorediff-mode").value ) {
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
