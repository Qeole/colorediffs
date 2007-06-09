colorediffsGlobal.transformations["replace-file-names"] = {
	run: function(il) {
		il.files.forEach(function(file) {
				il.log = il.log.replace(new RegExp("([\/\.a-zA-Z0-9-]*" + file.name + ")"), "<a href='#" + file.name + "'>$1</a>");
			});

		return il;
	}
};
