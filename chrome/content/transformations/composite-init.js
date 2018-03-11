colorediffsGlobal.transformations["composite"].methods.initOthers =
	function (pref) {
		var callbacks = {};
		var dependants = {};

		for (var memberName in colorediffsGlobal.transformations.composite.members) {
			colorediffsGlobal.transformations.composite.members[memberName].init({
				addListener: function(name, type, callback, depends) {
					var node = {
						type:type,
						callback:callback,
						ancessorCount:0
					};

					callbacks[name] = node;

					if (depends) {
						if (depends instanceof Array) {
							for (var i = 0; i < depends.length; i++) {
								addDependant(depends[i], node);
							}
						} else {
							addDependant(depends, node);
						}
					} else {
						addDependant("root", node);
					}

					function addDependant(dependsOn, node) {
						if (dependants[dependsOn]) {
							dependants[dependsOn].push(node);
						} else {
							dependants[dependsOn] = [node];
						}
					}
				}
			}, pref);
		}


		var roots = buildDependenciesGraph();
		dependants = null;
		callbacks = null;

		var nodes = buildTree(["file", "chunk-pair", "chunk", "line"]);
		roots = null;

		function buildDependenciesGraph() {
			callbacks["root"] = {};

			for (var name in dependants) {
				if (callbacks[name]) {
					callbacks[name].children = dependants[name];
					if (name != "root") {
						dependants[name].forEach(function(node) {
								node.ancessorCount++;
							});
					}
				} else {//The callback we depends on isn't enabled, should go to the root
					for (var i = 0; i < dependants[name].length; i++) {
						var dependant = dependants[name][i];
						if (dependant.ancessorCount == 0) { // push only if we aren't depends on something enabled
							dependant.ancessorCount = 1;
							callbacks["root"].children.push(dependant);
						}
					}
				}
			}

			return callbacks["root"].children;
		}

		function buildTree(types) {
			var nodes = [];

			while(true) {
				var node = {
					callbacks:[]
				};

				var i = 0;
				while( i < roots.length ) {
					if ( roots[i].type == types[0] ) {
						node.callbacks.push(roots[i].callback);

						var iWasReplaced = false;
						var children = roots[i].children;
						if (children) {
							for (var j = 0; j < children.length; j++) {
								if ( --children[j].ancessorCount == 0 ) {
									if ( !iWasReplaced ) {
										roots[i] = children[j];
										iWasReplaced = true;
									} else {
										roots.push(children[j]);
									}
								}
							}
						}
						if ( !iWasReplaced ) {
							roots.splice(i, 1);
						}
					} else {
						i++;
					}
				}

				if (types.length > 1) {//recursion stop condition
					node.next = buildTree(types.slice(1));
				} else {
					node.next = null;
				}

				if (node.callbacks.length == 0 && node.next == null) {//if nothing got changed
					break;
				} else {
					nodes.push(node);
				}

				if (types.length == 1) { //There are no chance we could find something with our type now
					break;
				}
			}

			if (nodes.length == 0) {
				return null;
			} else {
				return nodes;
			}
		}

		return nodes;
	}

