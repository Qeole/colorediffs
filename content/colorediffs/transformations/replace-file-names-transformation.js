colorediffsGlobal.transformations["replace-file-names"] = {
	run: function(il) {
		function replace(name, id) {
			il.log = il.log.replace(new RegExp("([\/\.a-zA-Z0-9-]*" + name + ")"), "<a href='#" + id + "'>$1</a>");
		}

		il.files.forEach(function(file) {
				replace(file['new'].name, file['new'].name);
				if (file['new'].name != file['old'].name) {
					replace(file['old'].name, file['new'].name);
				}
			});

		return il;
	}
};
