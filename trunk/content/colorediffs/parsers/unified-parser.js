//diff grammar
// normal_line = \d+\n
// postfix = normal_line | normal_line postfix
// new_file = additional_file_info blank_line new_code
// new_code = normal_line | normal_line new_code

colorediffsGlobal.parsers["unified"] = {
	parse: function(text) {
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
			//postfix(result);

			return result;
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
			var file = {}
			if ( _test(/^--- NEW FILE:/)) {
				file.new_filename = _get().match(/^--- NEW FILE:\t(.*) ---$/)[1];
				new_file(file);

				result.files.push(file);
			} else {
				_try(function() {return title(file);});
				if (_try(function() {return file_info(file);})) {
					chunks(file);

					result.files.push(file);
					return true;
				} else {
					return false;
				}
			}
			return false;
		}

		// title = normal_line "==========================" | normal_line "---------------------------" | normal_line title
		function title(file) {
			var max_title_size = 5; //TODO: get this from prefs
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
			file.title = title;
			return true;
		}

		// file_info = additional_file_info old_file_info new_file_info | old_file_info new_file_info
		function file_info(file) {
			_try(function () {return additional_file_info(file);});
			if (_test(/^---/)) {
				var oldFileInfo = getFileInfo(_get());
				_next();
				var newFileInfo = getFileInfo(_get());
				_next();

				file.old_filename = oldFileInfo[0];
				file.old_version = oldFileInfo[1];

				file.new_filename = newFileInfo[0];
				file.new_version = newFileInfo[1];
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
			var r = s.match(/^[+-]{3}\s(.*)(?:\t(.*))?$/);
			return [r[1], r[2]];
		}

		// additional_file_info = normal_line | normal_line additional_file_info
		function additional_file_info(file) {
			var max_additional_info_size = 7; //TODO: get this from prefs
			var additional_file_info = "";
			var num = 0;
			while ( !_test(/^---/)) {
				if (num >= max_additional_info_size || _test(blank_line())) {
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
			file.chunks = [];
			while( _try(function() {return chunk(file);}) ) {
			}
		}

		// chunk = anchor diff_code
		function chunk(file) {
			var chunk = {'old':{code:[]}, 'new':{code:[]}};
			anchor(chunk);
			diff_code(chunk);
			file.chunks.push(chunk);
			return true;
		}

		// anchor = @@ \-\d+(,\d+)? \+\d+(,\d+)? @@
		function anchor(chunk) {
			var regExpRes = _get().match(/^@@\s+\-(\d+)(?:\,\d+)?\s+\+(\d+)(?:\,\d+)?\s+@@/);
			chunk['old'].line = Number(regExpRes[1]);
			chunk['new'].line = Number(regExpRes[2]);
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
		function diff_code(chunk) {
			function makeEqualLength() {
				while ( chunk['old'].code.length < chunk['new'].code.length ) {
					chunk['old'].code.push(null);
				}
				while ( chunk['old'].code.length > chunk['new'].code.length ) {
					chunk['new'].code.push(null);
				}
			}

			chunk['old'].doesnt_have_new_line = false;
			chunk['new'].doesnt_have_new_line = false;

			var prev_line = "";

			while(true) {
				if (_test(/^\-(.*)$/)) {
					chunk['old'].code.push(_get().substring(1));
				} else if (_test(/^\+(.*)$/)) {
					chunk['new'].code.push(_get().substring(1));
				} else if (_test(/^\\ No newline at end of file$/)) {
					//check what sign previous line has if there are any
					if ( i > 0 ) {
						if (/^\-/.test(prev_line)) {
							chunk['old'].doesnt_have_new_line = true;
						} else if (/^\+/.test(prev_line)) {
							chunk['new'].doesnt_have_new_line = true;
						}
					}
				} else if (_test(/^ (.*)$/)) {
					makeEqualLength();
					chunk['old'].code.push(_get().substring(1));
					chunk['new'].code.push(_get().substring(1));
				} else {
					break;
				}
				prev_line = _get();
				_next();
			}
			makeEqualLength();

			if (chunk['old'].doesnt_have_new_line && !chunk['new'].doesnt_have_new_line) {
				chunk['old'].code.push(null);
				chunk['new'].code.push("");
			} else if (chunk['new'].doesnt_have_new_line && !chunk['old'].doesnt_have_new_line) {
				chunk['new'].code.push(null);
				chunk['old'].code.push("");
			}
		}

		return diff();

	},
	couldParse: function(text) {
		var line_tag = /^@@\s+\-\d+(?:\,\d+)?\s\+\d+(?:\,\d+)?\s+@@/m;
		return line_tag.test(text);
	}
}
