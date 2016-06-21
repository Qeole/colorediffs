colorediffsGlobal.transformations["composite"].methods.proceedIL =
	function (il, nodes) {
		il.files.forEach(function(file) {proceedFile(file, nodes);});

		function proceedFile(file, nodes) {
			for (var i = 0; i < nodes.length; i++) {
				nodes[i].callbacks.forEach(
					function(callback) {
						callback(file, il);
					}
				);

				if (nodes[i].next) {
					var l = 0;

					if ( file['old'] && file['old'].chunks ) {
						l = file['old'].chunks.length;
					} else if ( file['new'] && file['new'].chunks ) {
						l = file['new'].chunks.length;
					}

					for (var j = 0; j < l; j++) {
						var old_chunk = null;
						var new_chunk = null;

						if ( file['old'] && file['old'].chunks ) {
							old_chunk = file['old'].chunks[j];
						}

						if ( file['new'] && file['new'].chunks ) {
							new_chunk = file['new'].chunks[j];
						}

						proceedChunkPair(file, old_chunk, new_chunk, nodes[i].next);
					}
				}
			}
		}

		function proceedChunkPair(file, old_chunk, new_chunk, nodes) {
			for (var i = 0; i < nodes.length; i++) {
				nodes[i].callbacks.forEach(
					function(callback) {
						callback(old_chunk, new_chunk, file);
					}
				);

				if (nodes[i].next) {
					if (old_chunk) {
						proceedChunk(file, old_chunk, nodes[i].next);
					}

					if (new_chunk) {
						proceedChunk(file, new_chunk, nodes[i].next);
					}
				}
			}
		}

		function proceedChunk(file, chunk, nodes) {
			for (var i = 0; i < nodes.length; i++) {
				nodes[i].callbacks.forEach(
					function(callback) {
						callback(chunk, file);
					}
				);

				if (nodes[i].next) {
					chunk.code = chunk.code.map(
						function(line, j) {
							return proceedLine(file, chunk, line, j, nodes[i].next);
						}
					);
				}
			}
		}

		function proceedLine(file, chunk, line, index, nodes) {
			for (var i = 0; i < nodes.length; i++) {
				nodes[i].callbacks.forEach(
					function(callback) {
						line = callback(line, index, chunk, file);
					}
				);
			}
			return line;
		}
	}

