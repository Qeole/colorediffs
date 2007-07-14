colorediffsGlobal.transformations.composite.members["truncate-file-names"] = {
	init: function(registrator, pref) {

		registrator.addListener("truncate-file-names", "file", truncateFileNames, ["find-common-name", "select-old-new-files"]);

		function truncateFileNames(file, il) {
			if (file.common_name) {
				file.commonNameTruncated = truncateFileName(file.common_name, 80);
			}

			if (file['new'] && file['new'].name) {
				file['new'].name15Truncated = truncateFileName(file['new'].name, 80);
				if (pref.mode.get() == "unified" && file['old'] && file['old'].name) {
					file['new'].name7Truncated = truncateFileName(file['new'].name, 30);
				}
			}

			if (file['old'] && file['old'].name) {
				file['old'].name15Truncated = truncateFileName(file['old'].name, 80);
				if (pref.mode.get() == "unified" && file['new'] && file['new'].name) {
					file['old'].name7Truncated = truncateFileName(file['old'].name, 30);
				}
			}

			return file;
		}

		function truncateFileName(name, length) {
			var nameLength = name.length;

			length -= 3;

			if ( nameLength <= length ) {
				return name;
			} else {
				var nextIndex = -1;
				var lastIndex = nameLength;
				do {
					var a = skipLastComponent();
					var b = skipNextComponent();
				} while(a || b);

				if ( nextIndex == lastIndex ) {
					return name;
				} else {
					return name.substring(0, nextIndex + 1) + "..." + name.substring(lastIndex);
				}
			}


			function skipNextComponent() {
				var i1 = name.indexOf("/", nextIndex + 1);
				var i2 = name.indexOf("\\", nextIndex + 1);

				var i = Math.max(i1, i2);

				if ( i > 0 && nextIndex <= lastIndex && calcLenght(i, lastIndex) <= length ) {
					nextIndex = i;
					return true;
				} else {
					return false;
				}
			}

			function skipLastComponent() {
				var i1 = name.lastIndexOf("/", lastIndex - 1);
				var i2 = name.lastIndexOf("\\", lastIndex - 1);

				var i = Math.max(i1, i2);

				if ( i > 0 && nextIndex <= lastIndex && calcLenght(nextIndex, i) <= length ) {
					lastIndex = i;
					return true;
				} else {
					return false;
				}
			}

			function calcLenght(nextIndex, lastIndex) {
				return nameLength - lastIndex + nextIndex + 1;
			}

			return name;
		}

	}
};
