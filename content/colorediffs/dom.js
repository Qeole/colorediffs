colorediffsGlobal.domHelper = function() {

	var htmlDocument;

	function prepareDocument() {
		if ( !htmlDocument ) {
			if ( document instanceof XULDocument ) {
				htmlDocument = colorediffsGlobal.getMessagePane().contentDocument;
			} else {
				htmlDocument = document;
			}
		}
	}

	function addElements(element, start_index, array) {
		var length = array.length;
		for(var i = start_index; i < length; ++i) {
			var arg = array[i];
			switch(typeof arg) {
				case "string":
					element.innerHTML += arg;
					break;
				case "object":
					if (arg instanceof XULElement || arg instanceof HTMLElement) {
						element.appendChild(arg);
					} else if (arg instanceof Array) {
						arguments.callee(element, 0, arg);
					}
					break;
				case "function":
					element.appendChild(arg());
					break;
			}
		}
	}

	return {
		createElement:function(tag, attributes) {
			prepareDocument();

			var element = htmlDocument.createElement(tag);
			for (var attribute in attributes) {
				element.setAttribute(attribute, attributes[attribute]);
			}

			addElements(element, 2, arguments);

			return element;
		},
		createDocumentFragment:function() {
			prepareDocument();

			var element = htmlDocument.createDocumentFragment();
			addElements(element, 0, arguments);
			return element;
		}
	};
}();
