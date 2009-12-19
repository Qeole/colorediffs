importFile("../globals.js");
importFile("../parsers/main-parser.js");
importFile("../parsers/unified-parser.js");
importFile("../parsers/context-parser.js");
importFile("prefHelper.js");

pref.parserMaxPostfixSize.set(15);
pref.parserMaxAdditionalInfoSize.set(7);
pref.parserMaxTitleSize.set(5);
pref.parserMinTitleDelimiterCharsCount.set(10);

test.unified = function() {
    var me = colorediffsGlobal;

    var code = "" + <r><![CDATA[
Log message

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

    var res = me.parse(code, pref);
    assert.that(res, is.eqJson({
	log:"Log message",
	postfix:"",
	files:[
	    {'additional_info' : '',
	     'new': {
		 name: "filename2",
		 version: null,
		 chunks: [
		     {line:10,
                      'status' : [
                          'S',
                          'S',
                          'C',
                          'A',
                          'S'
                      ],
		      'doesnt_have_new_line' : false,
		      code:[
			  "line1",
			  "line2",
			  "line3",
			  "line4",
			  "line5"]}]},
	     'old': {
		 name: "filename1",
		 version: null,
		 chunks: [
		     {line:10,
                      'status' : [
                          'S',
                          'S',
                          'C',
                          'A',
                          'S'
                      ],
                      'doesnt_have_new_line' : false,
		      code:[
			  "line1",
			  "line2",
			  "line3",
			  null,
			  "line5"]}]}
	    }]}));
};

test.unifiedWineStandard = function() {
    var me = colorediffsGlobal;

    var code = "" + <r><![CDATA[
Log message

diff --git a/filename b/filename
-----------------------------------------------
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
    var res = me.parse(code, pref);
    assert.that(res, is.eqJson({
	log:"Log message",
	postfix: "",
	files:[
	    {title: "diff --git a/filename b/filename",
	    'additional_info' : 'index 52352325345\n',
	    'new':{
		version: null,
		name: "b/filename",
		chunks:[{line:10,
		    'status' : [
			'S',
			'S',
			'C',
			'A',
			'S'
		    ],
		    'doesnt_have_new_line' : false,
		    code:[
			"line1",
			"line2",
			"line3",
			"line4",
			"line5"]}]},
	     'old':{
		 version: null,
		 name: "a/filename",
		 chunks: [
		     {line:10,
		     'status' : [
			 'S',
			 'S',
			 'C',
			 'A',
			 'S'
		     ],
		     'doesnt_have_new_line' : false,
		     code:[
			 "line1",
			 "line2",
			 "line3",
			 null,
			 "line5"]}]}}]}));
};

test.unifiedNoNewLine = function() {
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

    var res = me.parse(code, pref);
    assert.that(res, is.eqJson({
	postfix: "",
	log:"Log message",
	files:[
	    {title: "diff --git a/filename b/filename",
	    'additional_info' : '',
	    'old':{
		version: null,
		name: "a/filename",
		chunks: [
		    {line:10,
		    'status' : [
			'S',
			'C',
			'C'
		    ],
		    code:[
			"line2",
			"line3",
			"line41"],
			doesnt_have_new_line:true}]
	    },
	    'new':{
		version: null,
		name: "b/filename",
		chunks: [
		    {line:10,
		    'status' : [
			'S',
			'C',
			'C'
		    ],
		    code:[
			"line2",
			"line31",
			"line4"],
			doesnt_have_new_line:true}]}}]}));
};

test.unifiedNoNewLine2 = function() {
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

    var res = me.parse(code, pref);
    assert.that(res, is.eqJson({
	log:"Log message",
	postfix: "",
	files:[
	    {title: "diff --git a/filename b/filename",
	    'additional_info' : '',
	    'old':{
		name: "a/filename",
		'version' : null,
		chunks: [
		    {line:10,
		    'status' : [
			'S',
			'C',
			'C'
		    ],
		    code:[
			"line2",
			"line3",
			"line4"],
		    doesnt_have_new_line:true}]
	    },
	    'new':{
		name: "b/filename",
		'version' : null,
		chunks: [
		    {line:10,
		    'status' : [
			'S',
			'C',
			'C'
		    ],
		    code:[
			"line2",
			"line31",
			"line4"],
		    doesnt_have_new_line:false}]}}]}));
};

test.unifiedNoNewLine3 = function() {
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

    var res = me.parse(code, pref);
    assert.that(res, is.eqJson({
	'postfix': "",
	log:"Log message",
	files:[
	    {title: "diff --git a/filename b/filename",
	     'additional_info' : '',
	    'old':{
		name: "a/filename",
		'version' : null,
		chunks: [
		    {line:10,
		    'status' : [
			'S',
			'C',
			'C'
		    ],
		    code:[
			"line2",
			"line3",
			"line4"],
			doesnt_have_new_line:false}]
	    },
	    'new':{
		name: "b/filename",
		'version' : null,
		chunks: [
		    {line:10,
		    'status' : [
			'S',
			'C',
			'C'
		    ],
		    code:[
			"line2",
			"line31",
			"line4"],
			doesnt_have_new_line:true}]}}]
			       }));
};

test.context = function() {
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

    var res = me.parse(code, pref);
    assert.that(res, is.eqJson({
	log:"Log message",
	files:[
	    {title: "Index: filename\n===========\n",
	    'additional_file_info' : 'retrieving revision 1.1\nretrieving revision 1.2\ndiff -C2 -d -r1.1 -r1.2\n*** filename\n--- filename\n',
	    'old':{
		name: "filename",
		chunks: [
		    {line:10,
		    'status' : [
			'S',
			'S',
			'C',
			'A',
			'S'
		    ],
		    'doesnt_have_new_line' : false,
		    code:[
			"line1",
			"line2",
			"line3",
			null,
			"line5"]}]
	    },
	    'new':{
		name: "filename",
		chunks: [
		    {line:10,
		    'status' : [
			'S',
			'S',
			'C',
			'A',
			'S'
		    ],
		    'doesnt_have_new_line' : false,
		    code:[
			"line1",
			"line2",
			"line3",
			"line4",
			"line5"]}]
	    }}]}));
};

test.context2 = function() {
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

    var res = me.parse(code, pref);
    assert.that(res, is.eqJson({
	log:"Log message",
	files:[
	    {title: "Index: filename\n===========\n",
	    'additional_file_info' : 'retrieving revision 1.1\nretrieving revision 1.2\ndiff -C2 -d -r1.1 -r1.2\n*** filename\n--- filename\n',
	    'old':{
		name: "filename",
		chunks: [
		    {line:10,
		    'status' : [
			'S',
			'S',
			'A',
			'A',
			'S'
		    ],
		    'doesnt_have_new_line' : false,
		    code:[
			"line1",
			"line2",
			null,
			null,
			"line5"]}]
	    },
	    'new':{
		name: "filename",
		chunks: [
		    {line:10,
		    'status' : [
			'S',
			'S',
			'A',
			'A',
			'S'
		    ],
		    'doesnt_have_new_line' : false,
		    code:[
			"line1",
			"line2",
			"line3",
			"line4",
			"line5"]}]
	    }}]}));
};

test.context3 = function() {
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
    assert.that(res, is.eqJson({
	log:"Log message",
	files:[
	    {title: "Index: filename\n===========\n",
	    'additional_file_info' : 'retrieving revision 1.1\nretrieving revision 1.2\ndiff -C2 -d -r1.1 -r1.2\n*** filename	Sun Mar 25 13:20:32 2007\n--- filename	Sun Mar 25 13:20:42 2007\n',
	    'old':{
		name: "filename",
		chunks: [
		    {line:10,
		    'status' : [
			'S',
			'C',
			'A',
			'S',
			'D',
			'S',
			'A'
		    ],
		    'doesnt_have_new_line' : false,
		    code:[
			"line1",
			"line21",
			null,
			"line3",
			"line4",
			"line5",
			null]}]
	    },
	    'new':{
		name: "filename",
		chunks: [
		    {line:10,
		    'status' : [
			'S',
			'C',
			'A',
			'S',
			'D',
			'S',
			'A'
		    ],
		    'doesnt_have_new_line' : false,
		    code:[
			"line1",
			"line11",
			"line2",
			"line3",
			null,
			"line5",
			"line6"]}]
	    }}]}));
};
/*
test.contextNoNewLine = function() {
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

    var res = me.parse(code, pref);
    assert.that(res, is.eqJson({
	log:"Log message",
	files:[
	    {title: "Index: filename\n===========\n",
	    'additional_file_info' : 'retrieving revision 1.1\nretrieving revision 1.2\ndiff -C2 -d -r1.1 -r1.2\n*** filename\n--- filename\n',
	    'old': {
		name: "filename",
		chunks: [
		    {line:10,
		    'status' : [
			'S',
			'S',
			'C',
			'C',
			'A'
		    ],
		    code:[
			"line1",
			"line2",
			"line3",
			"line4",
			"line5"],
		    doesnt_have_new_line:true}]
	    },
	    'new': {
		name: "filename",
		chunks: [
		    {line:10,
		    'status' : [
			'S',
			'S',
			'C',
			'C',
			'A'
		    ],
		    code:[
			"line1",
			"line2",
			"line3",
			"line4",
			null],
		    doesnt_have_new_line:false}]
		}}]}));
};
*/
test.contextNoNewLine2 = function() {
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
    assert.that(res, is.eqJson({
	log:"Log message",
	files:[
	    {title: "Index: filename\n===========\n",
	    'additional_file_info' : 'retrieving revision 1.1\nretrieving revision 1.2\ndiff -C2 -d -r1.1 -r1.2\n*** filename\n--- filename\n',
	    'old': {
		name: "filename",
		chunks: [
		    {line:10,
		    'status' : [
			'S',
			'S',
			'D'
		    ],
		    code:[
			"line4",
			"line5",
			"line6"],
			doesnt_have_new_line:true}]
	    },
	    'new': {
		name: "filename",
		chunks: [
		    {line:10,
		    'status' : [
			'S',
			'S',
			'D'
		    ],
		    code:[
			"line4",
			"line5",
			null],
			doesnt_have_new_line:false}]
	    }}]}));
};

test.contextNoNewLine3 = function() {
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
    assert.that(res, is.eqJson({
	log:"Log message",
	files:[
	    {title: "Index: filename\n===========\n",
	    'additional_file_info' : 'retrieving revision 1.1\nretrieving revision 1.2\ndiff -C2 -d -r1.1 -r1.2\n*** filename\n--- filename\n',
	    'old': {
		name: "filename",
		chunks: [
		    {line:10,
		    'status' : [
			'S',
			'S',
			'C'
		    ],
		    code:[
			"line3",
			"line4",
			"line5"],
			doesnt_have_new_line:false}]
	    },
	    'new': {
		name: "filename",
		chunks: [
		    {line:10,
		    'status' : [
			'S',
			'S',
			'C'
		    ],
		    code:[
			"line3",
			"line4",
			"line5"],
			doesnt_have_new_line:true}]
	    }}]}));
};

test.contextNoNewLine4 = function() {
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
    assert.that(res, is.eqJson({
	log:"Log message",
	files:[
	    {title: "Index: filename\n===========\n",
	    'additional_file_info' : 'retrieving revision 1.1\nretrieving revision 1.2\ndiff -C2 -d -r1.1 -r1.2\n*** filename\n--- filename\n',
	    'old':{
		name: "filename",
		chunks: [
		    {line:10,
		    'status' : [
			'S',
			'S',
			'A'
		    ],
		    code:[
			"line2",
			"line3",
			null],
			doesnt_have_new_line:false}]
	    },
	    'new':{
		name: "filename",
		chunks: [
		    {line:10,
		    'status' : [
			'S',
			'S',
			'A'
		    ],
		    code:[
			"line2",
			"line3",
			"line4"],
			doesnt_have_new_line:true}]
	    }}]}));
};
