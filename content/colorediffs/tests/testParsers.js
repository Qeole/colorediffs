importFile("../globals.js");
importFile("../parsers/main-parser.js");
importFile("../parsers/unified-parser.js");
importFile("../prefs.js");

function Pref() {
    var boolPrefs = {};
    var charPrefs = {};
    var intPrefs = {};

    var getPref = function(hash, prop) {
	return hash[prop];
    };

    var setPref = function(hash, prop, value) {
	hash[prop] = value;
    };

    var hasPref = function(prop) {
	return boolPrefs[prop] != undefined || charPrefs[prop] != undefined;
    };

    this.getBoolPref = function(prop) {
	return getPref(boolPrefs, prop);
    };

    this.setBoolPref = function(prop, value) {
	setPref(boolPrefs, prop, value);
    };

    this.getIntPref = function(prop) {
	return getPref(intPrefs, prop);
    };

    this.setIntPref = function(prop, value) {
	setPref(intPrefs, prop, value);
    };

    this.getCharPref = function(prop) {
	return getPref(charPrefs, prop);
    };

    this.setCharPref = function(prop, value) {
	setPref(charPrefs, prop, value);
    };

    this.prefHasUserValue = function(prop) {
	return hasPref(prop);
    };
}

let globalPref = new Pref();
let pref = new colorediffsGlobal.Pref(globalPref);

pref.parserMaxPostfixSize.set(15);
pref.parserMaxAdditionalInfoSize.set(7);
pref.parserMaxTitleSize.set(5);
pref.parserMinTitleDelimiterCharsCount.set(10);

ignore("globalPref");
ignore("Pref");
ignore("pref");

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

// test.unifiedWineStandard = function() {
//     log(pref);
// 	var me = colorediffsGlobal;

// 	var code = "" + <r><![CDATA[
//  Log message

// diff --git a/filename b/filename
// ------------------------------
// index 52352325345
// --- a/filename
// +++ b/filename
// @@ -10,5 +10,5 @@ line1
//  line2
// -line3
// +line3
// +line4
//  line5
// ]]></r>;

// 	code = code.trim("\n");

// 	var res = me.parse(code);
// 	assert.that(res, is.eqJson({
// 		log:" Log message",
// 		files:[
// 			{title: "diff --git a/filename b/filename",
// 			 'new':{
// 				name: "b/filename",
// 				chunks:[{
// 					line:10,
// 					code:[
// 						"line1",
// 						"line2",
// 						"line3",
// 						"line4",
// 						"line5"]}]},
// 			 'old':{
// 				name: "a/filename",
// 				chunks: [
// 					{line:10,
// 					 code:[
// 						 "line1",
// 						 "line2",
// 						 "line3",
// 						 null,
// 						 "line5"]}]}}]}));
// };

// function testUnifiedNoNewLine() {
// 	var me = colorediffsGlobal;

// 	var code = "" + <r><![CDATA[
//  Log message

// diff --git a/filename b/filename
// --------------------------------
// --- a/filename
// +++ b/filename
// @@ -10,5 +10,5 @@
//  line2
// -line3
// +line31
// -line41
// \ No newline at end of file
// +line4
// \ No newline at end of file
// ]]></r>;

// 	code = code.trim("\n");

// 	var res = me.parse(code);
// 	smartAssertEquals("test unified ", {
// 		log:" Log message",
// 		files:[
// 			{title: "diff --git a/filename b/filename",
// 			 'old':{
// 				name: "a/filename",
// 				chunks: [
// 					 {line:10,
// 					  code:[
// 						  "line2",
// 						  "line3",
// 						  "line41"],
// 					  doesnt_have_new_line:true}],
// 				},
// 			 'new':{
// 				name: "b/filename",
// 				chunks: [
// 					 {line:10,
// 					  code:[
// 						  "line2",
// 						  "line31",
// 						  "line4"],
// 					  doesnt_have_new_line:true}]}}]},
// 		res);
// }

// function testUnifiedNoNewLine2() {
// 	var me = colorediffsGlobal;

// 	var code = "" + <r><![CDATA[
//  Log message

// diff --git a/filename b/filename
// --------------------------------
// --- a/filename
// +++ b/filename
// @@ -10,5 +10,5 @@
//  line2
// -line3
// +line31
// -line4
// \ No newline at end of file
// +line4
// ]]></r>;

// 	code = code.trim("\n");

// 	var res = me.parse(code);
// 	smartAssertEquals("test unified ", {
// 		log:" Log message",
// 		files:[
// 			{title: "diff --git a/filename b/filename",
// 			 'old':{
// 				name: "a/filename",
// 				chunks: [
// 					{line:10,
// 					 code:[
// 						 "line2",
// 						 "line3",
// 						 "line4",
// 						 null],
// 					  doesnt_have_new_line:true}],
// 			  },
// 			  'new':{
// 				name: "b/filename",
// 				chunks: [
// 					{line:10,
// 					 code:[
// 						 "line2",
// 						 "line31",
// 						 "line4",
// 						 ""],
// 							doesnt_have_new_line:false}]}}]},
// 		res);
// }

// function testUnifiedNoNewLine3() {
// 	var me = colorediffsGlobal;

// 	var code = "" + <r><![CDATA[
//  Log message

// diff --git a/filename b/filename
// --------------------------------
// --- a/filename
// +++ b/filename
// @@ -10,5 +10,5 @@
//  line2
// -line3
// +line31
// -line4
// +line4
// \ No newline at end of file
// ]]></r>;

// 	code = code.trim("\n");

// 	var res = me.parse(code);
// 	smartAssertEquals("test unified ", {
// 		log:" Log message",
// 		files:[
// 			{title: "diff --git a/filename b/filename",
// 			 'old':{
// 				name: "a/filename",
// 				chunks: [
// 					{line:10,
// 					 code:[
// 						 "line2",
// 						 "line3",
// 						 "line4",
// 						 ""],
// 					 doesnt_have_new_line:false}],
// 				},
// 			 'new':{
// 				name: "b/filename",
// 				chunks: [
// 					{line:10,
// 					 code:[
// 						 "line2",
// 						 "line31",
// 						 "line4",
// 						 null],
// 					 doesnt_have_new_line:true}]}}],
// 				},
// 		res);
// }

// function testContext() {
// 	var me = colorediffsGlobal;

// 	var code = "" + <r><![CDATA[
// Log message

// Index: filename
// ===========
// retrieving revision 1.1
// retrieving revision 1.2
// diff -C2 -d -r1.1 -r1.2
// *** filename
// --- filename
// ***************
// *** 10,5 ****
//   line1
//   line2
// ! line3
//   line5
// --- 10,5 ----
//   line1
//   line2
// ! line3
// ! line4
//   line5
// ]]></r>;

// 	code = code.trim("\n");

// 	var res = me.parse(code);
// 	smartAssertEquals("test context ", {
// 		log:"Log message",
// 		files:[
// 			{title: "Index: filename\n===========\n",
// 			 'old':{
// 				name: "filename",
// 				chunks: [
// 					{line:10,
// 					 code:[
// 						 "line1",
// 						 "line2",
// 						 "line3",
// 						 null,
// 						 "line5"]}],
// 			 },
// 			 'new':{
// 				name: "filename",
// 				chunks: [
// 					{line:10,
// 					 code:[
// 						 "line1",
// 						 "line2",
// 						 "line3",
// 						 "line4",
// 						 "line5"]}],
// 			 }}]},
// 		res);
// }

// function testContext2() {
// 	var me = colorediffsGlobal;

// 	var code = "" + <r><![CDATA[
// Log message

// Index: filename
// ===========
// retrieving revision 1.1
// retrieving revision 1.2
// diff -C2 -d -r1.1 -r1.2
// *** filename
// --- filename
// ***************
// *** 10,5 ****
// --- 10,5 ----
//   line1
//   line2
// + line3
// + line4
//   line5
// ]]></r>;

// 	code = code.ltrim("\n");

// 	var res = me.parse(code);
// 	smartAssertEquals("test context ", {
// 		log:"Log message",
// 		files:[
// 			{title: "Index: filename\n===========\n",
// 			 'old':{
// 				name: "filename",
// 				chunks: [
// 					{line:10,
// 					 code:[
// 						 "line1",
// 						 "line2",
// 						 null,
// 						 null,
// 						 "line5"]}],
// 			 },
// 			 'new':{
// 				name: "filename",
// 				chunks: [
// 					{line:10,
// 					 code:[
// 						 "line1",
// 						 "line2",
// 						 "line3",
// 						 "line4",
// 						 "line5"]}],
// 		}}]},
// 		res);
// }

// function testContext3() {
// 	var me = colorediffsGlobal;

// 	var code = "" + <r><![CDATA[
// Log message

// Index: filename
// ===========
// retrieving revision 1.1
// retrieving revision 1.2
// diff -C2 -d -r1.1 -r1.2
// *** filename	Sun Mar 25 13:20:32 2007
// --- filename	Sun Mar 25 13:20:42 2007
// ***************
// *** 10,5 ****
//   line1
// ! line21
//   line3
// - line4
//   line5
// --- 10,6 ----
//   line1
// ! line11
// ! line2
//   line3
//   line5
// + line6
// ]]></r>;

// 	code = code.trim("\n");

// 	var res = me.parse(code);
// 	smartAssertEquals("test context ", {
// 		log:"Log message",
// 		files:[
// 			{title: "Index: filename\n===========\n",
// 			 'old':{
// 				name: "filename",
// 				chunks: [
// 					{line:10,
// 					 code:[
// 						 "line1",
// 						 "line21",
// 						 null,
// 						 "line3",
// 						 "line4",
// 						 "line5",
// 						 null]}],
// 			 },
// 			 'new':{
// 				name: "filename",
// 				chunks: [
// 					{line:10,
// 					 code:[
// 						 "line1",
// 						 "line11",
// 						 "line2",
// 						 "line3",
// 						 null,
// 						 "line5",
// 						 "line6"]}]
// 		}}]},
// 		res);
// }

// function testContextNoNewLine() {
// 	var me = colorediffsGlobal;

// 	var code = "" + <r><![CDATA[
// Log message

// Index: filename
// ===========
// retrieving revision 1.1
// retrieving revision 1.2
// diff -C2 -d -r1.1 -r1.2
// *** filename
// --- filename
// ***************
// *** 10,5 ****
//   line1
//   line2
// ! line3
// ! line5
// \ No newline at end of file
// --- 10,5 ----
//   line1
//   line2
// ! line3
// ! line4
// ! line5
// ]]></r>;

// 	code = code.ltrim("\n");

// 	var res = me.parse(code);
// 	smartAssertEquals("test context ", {
// 		log:"Log message",
// 		files:[
// 			{title: "Index: filename\n===========\n",
// 			 'old': {
// 				name: "filename",
// 				chunks: [
// 					{line:10,
// 					 code:[
// 						 "line1",
// 						 "line2",
// 						 "line3",
// 						 "line5",
// 						 null,
// 						 null],
// 					 doesnt_have_new_line:true}],
// 			 },
// 			 'new': {
// 				name: "filename",
// 				chunks: [
// 					{line:10,
// 					 code:[
// 						 "line1",
// 						 "line2",
// 						 "line3",
// 						 "line4",
// 						 "line5",
// 						 ""],
// 					 doesnt_have_new_line:false}],
// 		}}]},
// 		res);
// }

// function testContextNoNewLine2() {
// 	var me = colorediffsGlobal;

// 	var code = "" + <r><![CDATA[
// Log message

// Index: filename
// ===========
// retrieving revision 1.1
// retrieving revision 1.2
// diff -C2 -d -r1.1 -r1.2
// *** filename
// --- filename
// ***************
// *** 10,5 ****
//   line4
//   line5
// - line6
// \ No newline at end of file
// --- 10,5 ----
// ]]></r>;

// 	code = code.trim("\n");

// 	var res = me.parse(code);
// 	smartAssertEquals("test context ", {
// 		log:"Log message",
// 		files:[
// 			{title: "Index: filename\n===========\n",
// 			 'old': {
// 				name: "filename",
// 				chunks: [
// 					{line:10,
// 					 code:[
// 						 "line4",
// 						 "line5",
// 						 "line6",
// 						 null],
// 					 doesnt_have_new_line:true}],
// 				},
// 			 'new': {
// 				name: "filename",
// 				chunks: [
// 					{line:10,
// 					 code:[
// 						 "line4",
// 						 "line5",
// 						 null,
// 						 ""],
// 					 doesnt_have_new_line:false}],
// 			 }}]},
// 		res);
// }

// function testContextNoNewLine3() {
// 	var me = colorediffsGlobal;

// 	var code = "" + <r><![CDATA[
// Log message

// Index: filename
// ===========
// retrieving revision 1.1
// retrieving revision 1.2
// diff -C2 -d -r1.1 -r1.2
// *** filename
// --- filename
// ***************
// *** 10,5 ****
//   line3
//   line4
// ! line5
// --- 10,5 ----
//   line3
//   line4
// ! line5
// \ No newline at end of file
// ]]></r>;

// 	code = code.trim("\n");

// 	var res = me.parse(code);
// 	smartAssertEquals("test context ", {
// 		log:"Log message",
// 		files:[
// 			{title: "Index: filename\n===========\n",
// 			 'old': {
// 				name: "filename",
// 				chunks: [
// 					 {line:10,
// 					  code:[
// 						  "line3",
// 						  "line4",
// 						  "line5",
// 						  ""],
// 					  doesnt_have_new_line:false}],
// 			 },
// 			 'new': {
// 				name: "filename",
// 				chunks: [
// 					{line:10,
// 					 code:[
// 						 "line3",
// 						 "line4",
// 						 "line5",
// 						 null],
// 					 doesnt_have_new_line:true}],
// 		}}]},
// 		res);
// }

// function testContextNoNewLine4() {
// 	var me = colorediffsGlobal;

// 	var code = "" + <r><![CDATA[
// Log message

// Index: filename
// ===========
// retrieving revision 1.1
// retrieving revision 1.2
// diff -C2 -d -r1.1 -r1.2
// *** filename
// --- filename
// ***************
// *** 10,5 ****
// --- 10,5 ----
//   line2
//   line3
// + line4
// \ No newline at end of file
// ]]></r>;

// 	code = code.trim("\n");

// 	var res = me.parse(code);
// 	smartAssertEquals("test context ", {
// 		log:"Log message",
// 		files:[
// 			{title: "Index: filename\n===========\n",
// 			 'old':{
// 				name: "filename",
// 				chunks: [
// 					{line:10,
// 					 code:[
// 						 "line2",
// 						 "line3",
// 						 null,
// 						 ""],
// 					 doesnt_have_new_line:false}],
// 			 },
// 			 'new':{
// 				name: "filename",
// 				chunks: [
// 					{line:10,
// 					 code:[
// 						 "line2",
// 						 "line3",
// 						 "line4",
// 						 null],
// 					 doesnt_have_new_line:true}],
// 		}}]},
// 		res);
// }
