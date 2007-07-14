colorediffsGlobal.transformations.composite.members["select-old-new-files"] = {
	init: function(registrator, pref) {

		function register(func) {
			registrator.addListener("select-old-new-files", "file", func, "find-common-name");
		}


		switch( pref.diffMode.get() ) {
			case "new":
				register(function(file) {return selectSide('old', file);});
				break;
			case "old":
				register(function(file) {return selectSide('new', file);});
				break;
		}

		function selectSide(side, file) {

			if (file[side] && file[side].chunks) {
				file[side].chunks = null;
			}

			return file;
		}
	}
};
