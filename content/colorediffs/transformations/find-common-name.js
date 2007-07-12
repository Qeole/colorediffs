colorediffsGlobal.transformations.composite.members["find-common-name"] = {
	init: function(registrator, pref) {

		registrator.addFileListener(0, findCommonName);

		function findCommonName(file, il) {
			if ( file['new'].name || file['old'].name ) {
				//get common part of the names
				var commonPart = returnCommonPart(file['new'].name, file['old'].name);

				//try all the combinations of it on the log until found something
				//common_name = found_part
				file.common_name = checkCombinations(il.log, commonPart) || commonPart;

				file.id = file.common_name;
			}

			return file;
		}

		function returnCommonPart(s1, s2) {
			if ( !s2 ) {
				return s1;
			}
			if ( !s1 ) {
				return s2;
			}
			var s1i = s1.length - 1;
			var s2i = s2.length - 1;

			while (s1i >= 0 && s2i >= 0 && s1[s1i] == s2[s2i]) {
				s1i--;
				s2i--;
			}

			s1i++;
			return s1.substring(s1i);
		}

		function skipNextComponent(s) {
			var i1 = s.indexOf("/");
			var i2 = s.indexOf("\\");

			var i = Math.max(i1, i2) + 1;

			if ( i > 0 ) {
				return s.substring(i);
			} else {
				return "";
			}
		}

		function checkCombinations(log, name) {
			do {
				if ( log.indexOf(name) >= 0 ) {
					return name;
				}

				name = skipNextComponent(name);
			} while( name != "" );
			return null;
		}
	}
};
