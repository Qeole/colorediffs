colorediffsGlobal.transformations["replace-file-names"] = {
	run: function(il) {
		function replace(name) {
			il.log = il.log.replace(new RegExp("([\/\.a-zA-Z0-9-]*" + name + ")"), "<a href='#" + name + "'>$1</a>");
		}

		il.files.forEach(function(file) {
				replace(file['new'].name);
				if (file['new'].name != file['old'].name) {
					replace(file['old'].name);
				}
			});

		return il;
	}
};
