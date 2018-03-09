colorediffsGlobal.transformations.composite.members["replace-file-names"] = {
	init: function(registrator, pref) {

		registrator.addListener("replace-file-names", "file", replaceFilesInLog, "find-common-name");

		function replaceFilesInLog(file, il) {
			replace(file.common_name, file.id, il);

			return file;
		}


		function replace(name, id, il) {
		    if (name) {
			il.log = il.log.replace(new RegExp("([\\/\\.a-zA-Z0-9-]*\\b" + name.replace(/./g, "\\.") + "\\b)"), "<a href='#" + id + "'>$1</a>");
		    }
		}
	}
};

