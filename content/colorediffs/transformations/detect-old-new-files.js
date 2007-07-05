colorediffsGlobal.transformations.composite.members["detect-old-new-files"] = {
	init: function(registrator, pref) {

		registrator.addFileListener(1, detectOldNewFiles);

		function detectOldNewFiles(file, il) {

			if (file['new'] && file['new'].chunks && file['old'] && file['old'].chunks) {
				deleteSide('new', 'old');
				deleteSide('old', 'new');
			}

			function deleteSide(side_to_delete, other_side) {
				if ( file[side_to_delete].chunks[0].line == 0 ) { //Old
					file[side_to_delete].chunks = null;
				}
			}


			return file;
		}


		function replace(name, id, il) {
			il.log = il.log.replace(new RegExp("([\/\.a-zA-Z0-9-]*" + name + ")"), "<a href='#" + id + "'>$1</a>");
		}
	}
};
