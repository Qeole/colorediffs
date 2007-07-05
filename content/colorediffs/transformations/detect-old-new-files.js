colorediffsGlobal.transformations.composite.members["detect-old-new-files"] = {
	init: function(registrator, pref) {

		registrator.addFileListener(1, detectOldNewFiles);

		function detectOldNewFiles(file, il) {

			if (file['new'] && file['new'].chunks && file['old'] && file['old'].chunks) {
				deleteSide('new');
				deleteSide('old');
			}

			function deleteSide(side_to_delete) {
				if ( file[side_to_delete].chunks[0].line == 0 ) {
					file[side_to_delete].chunks = null;
				}
			}


			return file;
		}

	}
};
