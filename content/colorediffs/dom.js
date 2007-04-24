colorediffsGlobal.domHelper = {
 createElement:function(tag, attributes) {
		var element = document.createElement(tag);
		for (var attribute in attributes) {
			element.setAttribute(attribute, attributes[attribute]);
		}

		function addElements(start_index, array) {
			var length = array.length;
			for(var i = start_index; i < length; ++i) {
				var arg = array[i];
				switch(typeof arg) {
					case "string":
						element.appendChild(document.createTextNode(arg));
						break;
					case "object":
						if (arg instanceof HTMLElement) {
							element.appendChild(arg);
						} else if (arg instanceof Array) {
							arguments.callee(0, arg);
						}
						break;
					case "function":
						element.appendChild(arg());
						break;
				}
			}
		}
		addElements(2, arguments);

		return element;

	}
}
