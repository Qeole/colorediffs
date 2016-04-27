colorediffsGlobal.ilUtils = {
	chunksMap: function (file, func) {
		var result = [];
		var l = 0;
		if ( file['new'] && file['new'].chunks ) {
			l = Math.max(l, file['new'].chunks.length);
		} else if ( file['old'] && file['old'].chunks ) {
			l = Math.max(l, file['old'].chunks.length);
		}

		for (var i = 0; i < l; i++) {
			var old_chunk = null;
			if ( file['old'] && file['old'].chunks	&& file['old'].chunks[i] ) {
				old_chunk = file['old'].chunks[i];
			}

			var new_chunk = null;
			if ( file['new'] && file['new'].chunks	&& file['new'].chunks[i] ) {
				new_chunk = file['new'].chunks[i];
			}


			result.push(func(old_chunk, new_chunk));
		}

		return result;
	}
};
