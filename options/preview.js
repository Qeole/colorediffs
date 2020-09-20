/* SPDX-License-Identifier: MPL-2.0 */

const PreviewContent =
`diff --git a/foo b/foo
index 968a86582cb3..c8b42ebfcbb9 100644
--- a/foo
+++ b/foo
@@ -1337,8 +1337,9 @@ my_function()
 		int err;
 
 		err = do_some(stuff);
-		if (err)
+		if (err) {
 			printf("Error: %s\\n",
 			       strerror(errno));
 			goto fail;
+		}
 
 		do_more(stuff);	/* so much stuff */
 		return 0;	/* exit at last */`

var hasReplacedSpaces = false;

function updateStyle(e) {
    let style = document.getElementById("style").value;
    document.getElementById("theme").href = "/hljs/styles/" + style + ".css";

    let code = document.getElementById("prevcode");
    let tabsize = document.getElementById("tabsize").value;
    setTabStyle(code, tabsize);

    let spaces = document.getElementById("spaces");
    if (spaces.checked) {
        if (!hasReplacedSpaces) {
            replaceSpaces(code, tabsize);
            hasReplacedSpaces = true;
        }
    } else if (e && e.target == spaces) {
        createPreview();
        hasReplacedSpaces = false;
    }
}

function waitAndUpdateStyle() {
    window.setTimeout(updateStyle, 200);
}

function createPreview() {
    document.getElementById("prevcode").textContent = PreviewContent;
    waitAndUpdateStyle();
    hljs.highlightBlock(document.getElementById("prevcode"));
}

function changeStyle(offset) {
    let style = document.getElementById("style").value;
    let idx = styles.findIndex((s) => { return s.file == style; });
    let newStyle = styles[(idx + offset + styles.length) % styles.length].file;
    document.getElementById("style").value = newStyle;
    let change = new Event('change');
    document.getElementById("style").dispatchEvent(change);
}
