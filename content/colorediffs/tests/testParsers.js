function assertArray(prefix, target, source, func) {
	assertEquals(prefix, target.length, source.length);
	for (var i = 0; i < target.length; i++ ) {
		func(prefix + " " + i, target[i], source[i]);
	}
}

function assertParsedTree(prefix, target, source) {
	assertEquals(prefix + "check log message", target.log, source.log);
	assertArray(prefix + "check files", target.files, source.files, function(prefix, target, source) {
			assertEquals(prefix + " file name", target.name, source.name);
			assertEquals(prefix + " file title", target.title, source.title);

			assertArray(prefix + " file chunks ", target.chunks, source.chunks, function(prefix, target, source) {
					assertEquals(prefix + " old line", target.old.line, source.old.line);
					assertEquals(prefix + " new line", source.new.line, target.new.line);

					assertArray(prefix + " old code", target.old.code, source.old.code, assertEquals);
					assertArray(prefix + " new code", target.new.code, source.new.code, assertEquals);
				});
		});
}

function testUnified() {
	var me = colorediffsGlobal;

	var code = "" + <r><![CDATA[
Log message

File title
==============
--- filename
+++ filename
@@ -10,5 +10,5 @@
 line1
 line2
-line3
+line3
+line4
 line5
]]></r>;

	code = code.trim("\n");

	var res = me.unifiedParser(code);
	assertParsedTree("test unified ", {
		log:"Log message",
		files:[
			{name: "filename",
			 title: "File title\n==============\n",
			 chunks: [
				 {old:
					 {line:10,
					  code:[
						  "line1",
						  "line2",
						  "line3",
						  null,
						  "line5"]},
				  new:{line:10,
					   code:[
						   "line1",
						   "line2",
						   "line3",
						   "line4",
						   "line5"]}}]}]},
		res);
}

function testUnifiedWineStandard() {
	var me = colorediffsGlobal;

	var code = "" + <r><![CDATA[
 Log message

diff --git a/filename b/filename
index 52352325345
--- a/filename
+++ b/filename
@@ -10,5 +10,5 @@ line1
 line2
-line3
+line3
+line4
 line5
]]></r>;

	code = code.trim("\n");

	var res = me.unifiedParser(code);
	assertParsedTree("test unified ", {
		log:" Log message",
		files:[
			{name: "filename",
			 title: "diff --git a/filename b/filename",
			 chunks: [
				 {old:
					 {line:10,
					  code:[
						  "line1",
						  "line2",
						  "line3",
						  null,
						  "line5"]},
				  new:{line:10,
					   code:[
						   "line1",
						   "line2",
						   "line3",
						   "line4",
						   "line5"]}}]}]},
		res);
}

function testContext() {
	var me = colorediffsGlobal;

	var code = "" + <r><![CDATA[
Log message

Index: filename
===========
retrieving revision 1.1
retrieving revision 1.2
diff -C2 -d -r1.1 -r1.2
*** filename
--- filename
***************
*** 10,5 ****
  line1
  line2
! line3
  line5
--- 10,5 ----
  line1
  line2
! line3
! line4
line5
]]></r>;

	code = code.trim("\n");

	var res = me.contextParser(code);
	assertParsedTree("test context ", {
		log:"Log message",
		files:[
			{name: "filename",
			 title: "Index: filename\n===========\n",
			 chunks: [
				 {old:
					 {line:10,
					  code:[
						  "line1",
						  "line2",
						  "line3",
						  null,
						  "line5"]},
				  new:{line:10,
					   code:[
						   "line1",
						   "line2",
						   "line3",
						   "line4",
						   "line5"]}}]}]},
		res);
}

function testContext2() {
	var me = colorediffsGlobal;

	var code = "" + <r><![CDATA[
Log message

Index: filename
===========
retrieving revision 1.1
retrieving revision 1.2
diff -C2 -d -r1.1 -r1.2
*** filename
--- filename
***************
*** 10,5 ****
--- 10,5 ----
  line1
  line2
+ line3
+ line4
  line5
]]></r>;

	code = code.trim("\n");

	var res = me.contextParser(code);
	assertParsedTree("test context ", {
		log:"Log message",
		files:[
			{name: "filename",
			 title: "Index: filename\n===========\n",
			 chunks: [
				 {old:
					 {line:10,
					  code:[
						  "line1",
						  "line2",
						  null,
						  null,
						  "line5"]},
				  new:{line:10,
					   code:[
						   "line1",
						   "line2",
						   "line3",
						   "line4",
						   "line5"]}}]}]},
		res);
}

function testContext3() {
	var me = colorediffsGlobal;

	var code = "" + <r><![CDATA[
Log message

Index: filename
===========
retrieving revision 1.1
retrieving revision 1.2
diff -C2 -d -r1.1 -r1.2
*** filename	Sun Mar 25 13:20:32 2007
--- filename	Sun Mar 25 13:20:42 2007
***************
*** 10,5 ****
  line1
! line21
  line3
- line4
  line5
--- 10,6 ----
  line1
! line11
! line2
  line3
  line5
+ line6
]]></r>;

	code = code.trim("\n");

	var res = me.contextParser(code);
	assertParsedTree("test context ", {
		log:"Log message",
		files:[
			{name: "filename",
			 title: "Index: filename\n===========\n",
			 chunks: [
				 {old:
					 {line:10,
					  code:[
						  "line1",
						  "line21",
						  null,
						  "line3",
						  "line4",
						  "line5",
						  null]},
				  new:{line:10,
					   code:[
						   "line1",
						   "line11",
						   "line2",
						   "line3",
						   null,
						   "line5",
						   "line6"]}}]}]},
		res);
}
