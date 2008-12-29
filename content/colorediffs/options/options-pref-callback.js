colorediffsGlobal.OptionsPrefCallbackModel = function(prefModel, callback) {
	this.getBoolPref = function(prop) {
		return prefModel.getBoolPref(prop);
	};

	this.setBoolPref = function(prop, value) {
		prefModel.setBoolPref(prop, value);
		callback();
	};

	this.getIntPref = function(prop) {
		return prefModel.getIntPref(prop);
	};

	this.setIntPref = function(prop, value) {
		prefModel.setIntPref(prop, value);
		callback();
	};

	this.getCharPref = function(prop) {
		return prefModel.getCharPref(prop);
	};

	this.setCharPref = function(prop, value) {
		prefModel.setCharPref(prop, value);
		callback();
	};

	this.prefHasUserValue = function(prop) {
		return prefModel.prefHasUserValue(prop);
	};
};
