function smartAssertEquals(prefix, target, source) {
	assertEquals(prefix + " check types", typeof(target), typeof(source));

	if (source instanceof Array) {
		assert(prefix + "check types", target instanceof Array);
		return assertEqualsArray(prefix, target, source);
	} else {
		switch (typeof (source)) {
			case "object":
				return assertEqualsObject(prefix, target, source);
			default:
				return assertEquals(prefix, target, source);
		}
	}
}

function assertEqualsArray(prefix, target, source) {
	assertEquals(prefix + " check length", target.length, source.length);
	for (var i = 0; i < target.length; i++ ) {
		smartAssertEquals(prefix + "[" + i + "]", target[i], source[i]);
	}
}

function assertEqualsObject(prefix, target, source) {
	for (var i in target) {
		//check that target[i] equals source[i]
		smartAssertEquals(prefix + " " + i, target[i], source[i]);
	}
}

function testUnified() {
	var me = colorediffsGlobal;

	var code = "" + <r><![CDATA[
Log message

File title
==============
--- filename1
+++ filename2
@@ -10,5 +10,5 @@
 line1
 line2
-line3
+line3
+line4
 line5
]]></r>;

	code = code.trim("\n");

	var res = me.parse(code);
	smartAssertEquals("test unified ", {
		log:"Log message",
		files:[
			{title: "File title",
			 'new': {
				name: "filename2",
				chunks: [
				  {line:10,
				   code:[
					   "line1",
					   "line2",
					   "line3",
					   "line4",
					   "line5"]}]},
			 'old': {
				name: "filename1",
				chunks: [
					{line:10,
					 code:[
						 "line1",
						 "line2",
						 "line3",
						 null,
						 "line5"]}]},
		 }]},
		res);
}

function testUnifiedWineStandard() {
	var me = colorediffsGlobal;

	var code = "" + <r><![CDATA[
 Log message

diff --git a/filename b/filename
--------------------------------
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

	var res = me.parse(code);
	smartAssertEquals("test unified ", {
		log:" Log message",
		files:[
			{title: "diff --git a/filename b/filename",
			 'new':{
				name: "b/filename",
				chunks:[{
					line:10,
					code:[
						"line1",
						"line2",
						"line3",
						"line4",
						"line5"]}]},
			 'old':{
				name: "a/filename",
				chunks: [
					{line:10,
					 code:[
						 "line1",
						 "line2",
						 "line3",
						 null,
						 "line5"]}]}}]},
		res);
}

function testUnifiedNoNewLine() {
	var me = colorediffsGlobal;

	var code = "" + <r><![CDATA[
 Log message

diff --git a/filename b/filename
--------------------------------
--- a/filename
+++ b/filename
@@ -10,5 +10,5 @@
 line2
-line3
+line31
-line41
\ No newline at end of file
+line4
\ No newline at end of file
]]></r>;

	code = code.trim("\n");

	var res = me.parse(code);
	smartAssertEquals("test unified ", {
		log:" Log message",
		files:[
			{title: "diff --git a/filename b/filename",
			 'old':{
				name: "a/filename",
				chunks: [
					 {line:10,
					  code:[
						  "line2",
						  "line3",
						  "line41"],
					  doesnt_have_new_line:true}],
				},
			 'new':{
				name: "b/filename",
				chunks: [
					 {line:10,
					  code:[
						  "line2",
						  "line31",
						  "line4"],
					  doesnt_have_new_line:true}]}}]},
		res);
}

function testUnifiedNoNewLine2() {
	var me = colorediffsGlobal;

	var code = "" + <r><![CDATA[
 Log message

diff --git a/filename b/filename
--------------------------------
--- a/filename
+++ b/filename
@@ -10,5 +10,5 @@
 line2
-line3
+line31
-line4
\ No newline at end of file
+line4
]]></r>;

	code = code.trim("\n");

	var res = me.parse(code);
	smartAssertEquals("test unified ", {
		log:" Log message",
		files:[
			{title: "diff --git a/filename b/filename",
			 'old':{
				name: "a/filename",
				chunks: [
					{line:10,
					 code:[
						 "line2",
						 "line3",
						 "line4",
						 null],
					  doesnt_have_new_line:true}],
			  },
			  'new':{
				name: "b/filename",
				chunks: [
					{line:10,
					 code:[
						 "line2",
						 "line31",
						 "line4",
						 ""],
							doesnt_have_new_line:false}]}}]},
		res);
}

function testUnifiedNoNewLine3() {
	var me = colorediffsGlobal;

	var code = "" + <r><![CDATA[
 Log message

diff --git a/filename b/filename
--------------------------------
--- a/filename
+++ b/filename
@@ -10,5 +10,5 @@
 line2
-line3
+line31
-line4
+line4
\ No newline at end of file
]]></r>;

	code = code.trim("\n");

	var res = me.parse(code);
	smartAssertEquals("test unified ", {
		log:" Log message",
		files:[
			{title: "diff --git a/filename b/filename",
			 'old':{
				name: "a/filename",
				chunks: [
					{line:10,
					 code:[
						 "line2",
						 "line3",
						 "line4",
						 ""],
					 doesnt_have_new_line:false}],
				},
			 'new':{
				name: "b/filename",
				chunks: [
					{line:10,
					 code:[
						 "line2",
						 "line31",
						 "line4",
						 null],
					 doesnt_have_new_line:true}]}}],
				},
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

	var res = me.parse(code);
	smartAssertEquals("test context ", {
		log:"Log message",
		files:[
			{title: "Index: filename\n===========\n",
			 'old':{
				name: "filename",
				chunks: [
					{line:10,
					 code:[
						 "line1",
						 "line2",
						 "line3",
						 null,
						 "line5"]}],
			 },
			 'new':{
				name: "filename",
				chunks: [
					{line:10,
					 code:[
						 "line1",
						 "line2",
						 "line3",
						 "line4",
						 "line5"]}],
			 }}]},
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

	code = code.ltrim("\n");

	var res = me.parse(code);
	smartAssertEquals("test context ", {
		log:"Log message",
		files:[
			{title: "Index: filename\n===========\n",
			 'old':{
				name: "filename",
				chunks: [
					{line:10,
					 code:[
						 "line1",
						 "line2",
						 null,
						 null,
						 "line5"]}],
			 },
			 'new':{
				name: "filename",
				chunks: [
					{line:10,
					 code:[
						 "line1",
						 "line2",
						 "line3",
						 "line4",
						 "line5"]}],
		}}]},
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

	var res = me.parse(code);
	smartAssertEquals("test context ", {
		log:"Log message",
		files:[
			{title: "Index: filename\n===========\n",
			 'old':{
				name: "filename",
				chunks: [
					{line:10,
					 code:[
						 "line1",
						 "line21",
						 null,
						 "line3",
						 "line4",
						 "line5",
						 null]}],
			 },
			 'new':{
				name: "filename",
				chunks: [
					{line:10,
					 code:[
						 "line1",
						 "line11",
						 "line2",
						 "line3",
						 null,
						 "line5",
						 "line6"]}]
		}}]},
		res);
}

function testContextNoNewLine() {
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
! line5
\ No newline at end of file
--- 10,5 ----
  line1
  line2
! line3
! line4
! line5
]]></r>;

	code = code.ltrim("\n");

	var res = me.parse(code);
	smartAssertEquals("test context ", {
		log:"Log message",
		files:[
			{title: "Index: filename\n===========\n",
			 'old': {
				name: "filename",
				chunks: [
					{line:10,
					 code:[
						 "line1",
						 "line2",
						 "line3",
						 "line5",
						 null,
						 null],
					 doesnt_have_new_line:true}],
			 },
			 'new': {
				name: "filename",
				chunks: [
					{line:10,
					 code:[
						 "line1",
						 "line2",
						 "line3",
						 "line4",
						 "line5",
						 ""],
					 doesnt_have_new_line:false}],
		}}]},
		res);
}

function testContextNoNewLine2() {
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
  line4
  line5
- line6
\ No newline at end of file
--- 10,5 ----
]]></r>;

	code = code.trim("\n");

	var res = me.parse(code);
	smartAssertEquals("test context ", {
		log:"Log message",
		files:[
			{title: "Index: filename\n===========\n",
			 'old': {
				name: "filename",
				chunks: [
					{line:10,
					 code:[
						 "line4",
						 "line5",
						 "line6",
						 null],
					 doesnt_have_new_line:true}],
				},
			 'new': {
				name: "filename",
				chunks: [
					{line:10,
					 code:[
						 "line4",
						 "line5",
						 null,
						 ""],
					 doesnt_have_new_line:false}],
			 }}]},
		res);
}

function testContextNoNewLine3() {
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
  line3
  line4
! line5
--- 10,5 ----
  line3
  line4
! line5
\ No newline at end of file
]]></r>;

	code = code.trim("\n");

	var res = me.parse(code);
	smartAssertEquals("test context ", {
		log:"Log message",
		files:[
			{title: "Index: filename\n===========\n",
			 'old': {
				name: "filename",
				chunks: [
					 {line:10,
					  code:[
						  "line3",
						  "line4",
						  "line5",
						  ""],
					  doesnt_have_new_line:false}],
			 },
			 'new': {
				name: "filename",
				chunks: [
					{line:10,
					 code:[
						 "line3",
						 "line4",
						 "line5",
						 null],
					 doesnt_have_new_line:true}],
		}}]},
		res);
}

function testContextNoNewLine4() {
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
  line2
  line3
+ line4
\ No newline at end of file
]]></r>;

	code = code.trim("\n");

	var res = me.parse(code);
	smartAssertEquals("test context ", {
		log:"Log message",
		files:[
			{title: "Index: filename\n===========\n",
			 'old':{
				name: "filename",
				chunks: [
					{line:10,
					 code:[
						 "line2",
						 "line3",
						 null,
						 ""],
					 doesnt_have_new_line:false}],
			 },
			 'new':{
				name: "filename",
				chunks: [
					{line:10,
					 code:[
						 "line2",
						 "line3",
						 "line4",
						 null],
					 doesnt_have_new_line:true}],
		}}]},
		res);
}
