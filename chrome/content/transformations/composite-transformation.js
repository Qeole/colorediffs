colorediffsGlobal.transformations["composite"] = {
	run: function (il, pref) {

		//add transformations
		var nodes = colorediffsGlobal.transformations.composite.methods.initOthers(pref);

		//proceed
		colorediffsGlobal.transformations.composite.methods.proceedIL(il, nodes);

		return il;
	}
};

colorediffsGlobal.transformations.composite.members = {};
colorediffsGlobal.transformations.composite.methods = {};
