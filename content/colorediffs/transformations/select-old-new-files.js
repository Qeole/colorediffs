colorediffsGlobal.transformations.composite.members["select-old-new-files"] = {
	init: function(registrator, pref) {

		switch( pref.diffMode.get() ) {
			case "new":
				registrator.addFileListener(1, function(file) {return selectSide('old', file);});
				break;
			case "old":
				registrator.addFileListener(1, function(file) {return selectSide('new', file);});
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
