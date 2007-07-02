colorediffsGlobal.transformations["composite"] = {
	run: function (il, pref) {

		//init state
		var fileEvents = [];
		var chunkEvents = [];
		var lineEvents = [];

		//add transformations
		initOthers();

		//proceed
		proceedIL(il);

		return il;

		//private methods
		function initOthers() {
			function add(event, priority, callback) {
				if (!event[priority]) {
					event[priority] = [];
				}
				event[priority].push(callback);
			}

			for each (var member in colorediffsGlobal.transformations.composite.members) {
				member.init({
					addFileListener: function(priority, callback) {
						add(fileEvents, priority, callback);
					},
					addChunkListener: function(priority, callback) {
						add(chunkEvents, priority, callback);
					},
					addLineListener: function(priority, callback) {
						add(lineEvents, priority, callback);
					}
				}, pref);
			}
		}

		function proceed(object, event) {
			for (var i=0; i < event.length; i++) {
				var members = event[i];
				if (members) {
					for (var j=0; j < members.length; j++) {
						object = members[j](object, il);
					}
				}
			}
			return object;
		}

		function proceedLine(line) {
			return proceed(line, lineEvents);
		}

		function proceedChunk(chunk) {
			proceed(chunk, chunkEvents);

			chunk.code = chunk.code.map(proceedLine);
		}

		function proceedFile(file) {
			proceed(file, fileEvents);

			if (file['old'] && file['old'].chunks) { file['old'].chunks.forEach(proceedChunk); }
			if (file['new'] && file['new'].chunks) { file['new'].chunks.forEach(proceedChunk); }
		}

		function proceedIL(il) {
			il.files.forEach(proceedFile);
		}

		//Heh. It doesn't understand that return on top of that function will be called in all the cases
		return null;
	}
};

colorediffsGlobal.transformations.composite.members = {};
