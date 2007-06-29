colorediffsGlobal.transformations.composite.members["add-title"] = {
	init: function(registrator, pref) {

		registrator.addFileListener(1, addTitle);

		function addTitle(file) {
			if (!file.title) {
				file.title = file.common_name;
			}

			return file;
		}
	}
};
