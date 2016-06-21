colorediffsGlobal.transformations.composite.members["add-title"] = {
	init: function(registrator, pref) {

		registrator.addListener("add-title", "file", addTitle, "find-common-name");

		function addTitle(file) {
			if (!file.title) {
				file.title = file.common_name;
			}

			return file;
		}
	}
};
