//diff grammar
// normal_line = \d+\n
// postfix = normal_line | normal_line postfix
// new_file = additional_file_info blank_line new_code
// new_code = normal_line | normal_line new_code

colorediffsGlobal.parsers["unified"] = {
 parse: function(text, pref) {

		var lines = text.split("\n");
		var curr_line = 0;

		function _try(f) {
			var saved_line = curr_line;

			var res = false;
			try {
				res = f();
			} catch (e) {
			}

			if ( res ) {
				return true;
			} else {
				curr_line = saved_line;
				return false;
			}
		}

		function _should(f) {
			if (!f) {
				throw "ASSERT FAILED";
			}
		}

		function _try_many() {
			for (var i = 0; i < arguments.length; i++) {
				if (_try(arguments[i])) {
					return true;
				}
			}
			return false;
		}

		function _next() {
			curr_line++;
			if (curr_line >= lines.length) {
				throw "EOF";
			}
		}

		function _get() {
			return lines[curr_line];
		}

		function _accept(r) {ad.c
			var res = r.test(lines[curr_line]);
			if (res) _next();
			return res;

		}

		function _test(r) {
			return r.test(lines[curr_line]);
		}

		// blank_line = \n
		function blank_line() {
			return /^$/;
		}

		// diff = log blank_line code postfix
		function diff() {
			var result = {};

			log_and_code(result);
			postfix(result);

			return result;
		}

		function postfix(result) {
			var postfix = "";

			while(_get()) {
				postfix += _get() + "\n";
				try {
					_next();
				} catch (e) {
					break;
				}
			}

			result.postfix = postfix;
			return true;
		}

		// log = normal_line | normal_line log
		function log_and_code(result) {
			var log = "";
			do {
				while(!_test(blank_line())) {
					log += _get() + "\n";
					_next();
				}
				log += _get() + "\n";
				_next();
			} while( !_try(function() {return code(result);}) );

			result.log = log.trim("\n");
		}

		// code = file blank_line | file blank_line code
		function code(result) {
			result.files = [];

			try {
				do {
					//skip blank lines
					while( _test(blank_line()) ) { _next(); }
				} while( _try(function() {return file(result);}) );
			} catch (e) {
			}

			return result.files.length != 0;
		}

		// file = title file_info chunks | file_info chunks | "--- NEW FILE:" "\t" file_name " ---" new_file
		function file(result) {
			var file = {'old':{}, 'new':{}};

			function _(func) { return function() { return func(file, result); } };

			if (_try_many(
					_(patch_binary_file),
					_(normal_file),
					_(cvs_new_file),
					_(cvs_deleted_file),
					_(cvs_binary_file),
					_(svn_binary_file)
				)) {
				result.files.push(file);
				return true;
			} else {
				return false;
			}
		}

		function normal_file(file) {
			function _(func) { return function() { return func(file); } };

			_try(_(title));
			_try(_(additional_file_info));
			_should(file_info(file));
			_should(chunks(file));
			return true;
		}

		function cvs_new_file(file, result) {
			_should(_test(/^--- NEW FILE:\t.* ---$/));
			var name = _get().match(/^--- NEW FILE:\t(.*) ---$/)[1];
			_next();
			_should(new_file(file, result, name));
			return true;
		}

		function cvs_binary_file(file) {
			_should(_test(/^---\s(?:new\s)?BINARY FILE:\s.*\s---$/));
			extract_file_name_from_raw_data(file, _get());
			_next();
			_should(additional_file_info(file));
			return true;
		}

		function patch_binary_file(file) {
			_should(_test(/^Binary files .* and .* differ$/));
			var r = _get().match(/^Binary files (.*) and (.*) differ$/);
			if (r) {
				file['old'].name = r[1];
				file['new'].name = r[2];
			}
			_next();
			return true;
		}

		function cvs_deleted_file(file) {
			_should(_test(/^--- .* DELETED ---$/));
			file['old'].name = _get().match(/^--- (.*) DELETED ---$/)[1];
			_next();
			return true;
		}

		function svn_binary_file(file) {
			_should(title(file));
			_should(additional_file_info(file));

			extract_file_name_from_raw_data(file, file.title);

			return true;
		}

		function extract_file_name_from_raw_data(file, data) {
			var r = data.match(/\b(\w[\w-\/\.]+\.[\w]+\w)\b/);
			if ( r && r[1] ) {
				file['new'].name = file['old'].name = r[1];
			} else {
				file['new'].name = file['old'].name = "";
			}
		}

		// title = normal_line "==========================" | normal_line "---------------------------" | normal_line title
		function title(file) {
			var max_title_size = pref.parserMaxTitleSize.get();
			var title = "";
			var num = 0;
			do {
				title += _get() + "\n";
				_next();
				num++;

				if ( num >= max_title_size || _test(blank_line()) ) {
					return false;
				}
			} while (!_test(/^[-=]+$/));

			_next();
			file.title = title.trim("\n");
			return true;
		}

		// file_info = additional_file_info old_file_info new_file_info | old_file_info new_file_info
		function file_info(file) {
			if (_test(/^---/)) {
				var oldFileInfo = getFileInfo(_get());
				_next();
				var newFileInfo = getFileInfo(_get());
				_next();

				file['old'].name = oldFileInfo[0];
				file['old'].version = oldFileInfo[1];

				file['new'].name = newFileInfo[0];
				file['new'].version = newFileInfo[1];
				return true;
			} else {
				return false;
			}
		}

		// old_file_info = "---" old_file_name "\t" date "\t" version
		// new_file_info = "+++" new_file_name "\t" date "\t" version
		// old_file_name = file_name
		// new_file_name = file_name
		// file_name = [^\t]+
		// date = [^\t]+
		// version = [^\t]+
		function getFileInfo(s) {
			var r = s.match(/^[+-]{3}\s(.*?)(?:\t(.*))?$/);
			return [r[1], r[2]];
		}

		// additional_file_info = normal_line | normal_line additional_file_info
		function additional_file_info(file) {
			var max_additional_info_size = pref.parserMaxAdditionalInfoSize.get();
			var additional_file_info = "";
			var num = 0;
			while ( !_test(/^---/) && !_test(blank_line())) {
				if (num >= max_additional_info_size) {
					return false;
				}

				additional_file_info += _get() + "\n";
				_next();
				num++;
			}

			file.additional_info = additional_file_info;
			return true;
		}

		// chunks = chunk | chunk chunks
		function chunks(file) {
			file['old'].chunks = [];
			file['new'].chunks = [];
			while( _try(function() {return chunk(file);}) ) {
			}

			return file['old'].chunks.length == file['new'].chunks.length && file['new'].chunks.length > 0;
		}

		// chunk = anchor diff_code
		function chunk(file) {
			var old_chunk = {code:[]};
			var new_chunk = {code:[]};
			anchor(old_chunk, new_chunk);
			diff_code(old_chunk, new_chunk);
			file['old'].chunks.push(old_chunk);
			file['new'].chunks.push(new_chunk);
			return true;
		}

		// anchor = @@ \-\d+(,\d+)? \+\d+(,\d+)? @@
		function anchor(old_chunk, new_chunk) {
			var regExpRes = _get().match(/^@@\s+\-(\d+)(?:\,\d+)?\s+\+(\d+)(?:\,\d+)?\s+@@/);
			old_chunk.line = Number(regExpRes[1]);
			new_chunk.line = Number(regExpRes[2]);
			if (_test(/@@$/)) {
				_next();
			} else {
				//git adds the first line of code to the anchor line for some reason
				//TODO: do you think it is better to split the string instead of rewriting it?
				lines[curr_line] = _get().slice(regExpRes[0].length);
			}
		}

		// diff_code = diff_code_line | diff_code_line diff_code
		// diff_code_line = " " .* | "+" .* | "-" .*
		function diff_code(old_chunk, new_chunk) {
			function makeEqualLength() {
				while ( old_chunk.code.length < new_chunk.code.length ) {
					line_status[old_chunk.code.length] = "A"; //Added
					old_chunk.code.push(null);
				}
				while ( old_chunk.code.length > new_chunk.code.length ) {
					line_status[new_chunk.code.length] = "D"; //Deleted
					new_chunk.code.push(null);
				}
			}

			var line_status = [];

			old_chunk.doesnt_have_new_line = false;
			new_chunk.doesnt_have_new_line = false;

			var prev_line = null;

			while(true) {
				if (_test(/^\-(.*)$/)) {
					line_status[old_chunk.code.length] = "C"; //Changed
					old_chunk.code.push(_get().substring(1));
				} else if (_test(/^\+(.*)$/)) {
					line_status[new_chunk.code.length] = "C"; //Changed
					new_chunk.code.push(_get().substring(1));
				} else if (_test(/^\\ No newline at end of file$/)) {
					//check what sign previous line has if there are any
					if ( prev_line != null ) {
						if (/^\-/.test(prev_line)) {
							old_chunk.doesnt_have_new_line = true;
						} else if (/^\+/.test(prev_line)) {
							new_chunk.doesnt_have_new_line = true;
						} else if (/^ /.test(prev_line)) {
							old_chunk.doesnt_have_new_line = true;
							new_chunk.doesnt_have_new_line = true;
						}
					}
				} else if (_test(/^ (.*)$/)) {
					makeEqualLength();
					old_chunk.code.push(_get().substring(1));
					new_chunk.code.push(_get().substring(1));
					line_status.push("S"); //the Same
				} else {
					break;
				}
				prev_line = _get();
				try { _next(); } catch (e) {break;}
			}
			makeEqualLength();

			new_chunk.status = old_chunk.status = line_status;
		}

		function new_file(f, result, name) {
			var code = [];
			var status = [];
			try {
				while(true) {
					while(!_test(blank_line())) {
						code.push(_get());
						status.push("A");
						_next();
					}
					code.push(_get());
					status.push("A");
					_next();

					var temp_result = {files: []};

					if (_try(function() { return file(temp_result); })) {
						break;
					}
				}
			} catch (e) {
			}

			code.pop();
			status.pop();

			var new_file = {
				'new': {
					name: name,
					chunks: [{
						line:1,
						code: code,
						status: status
					}]
				},
				'old': {}
			};

			var file_to_copy;
			if (temp_result.files.length > 0) {
				result.files.push(new_file);

				file_to_copy = temp_result.files[0];
			} else {
				file_to_copy = new_file;
			}

			//copy next file to first argument
			for (var a in file_to_copy) {
				f[a] = file_to_copy[a];
			}

			return true;

		}

		return diff();

	},
	couldParse: function(text) {
		var line_tag = /^@@\s+\-\d+(?:\,\d+)?\s\+\d+(?:\,\d+)?\s+@@/m;
		var new_tag = /^--- NEW FILE:\t.* ---$/m;
		var binary_tag = /^---\s(?:new\s)?BINARY FILE:\s.*\s---$/m;
		return line_tag.test(text) || new_tag.test(text) || binary_tag.test(text);
	}
}
