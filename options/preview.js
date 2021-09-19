/* SPDX-License-Identifier: MPL-2.0 */

/* eslint-disable no-tabs */
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
 		return 0;	/* exit at last */`;
/* eslint-disable no-tabs */

let hasReplacedSpaces = false;

function updateStyle (e) {
    const style = document.getElementById("style").value;
    document.getElementById("theme").href = "/hljs/styles/" + style + ".min.css";

    const code = document.getElementById("prevcode");
    const tabsize = document.getElementById("tabsize").value;
    transformations.setTabStyle(code, tabsize);

    const spaces = document.getElementById("spaces");
    if (spaces.checked) {
        if (!hasReplacedSpaces) {
            transformations.replaceSpaces(code, tabsize);
            hasReplacedSpaces = true;
        }
    } else if (e && e.target === spaces) {
        createPreview();
        hasReplacedSpaces = false;
    }
}

function waitAndUpdateStyle () {
    window.setTimeout(updateStyle, 200);
}

function createPreview () {
    document.getElementById("prevcode").textContent = PreviewContent;
    waitAndUpdateStyle();
    hljs.highlightElement(document.getElementById("prevcode"));
}

function changeStyle (offset) {
    const style = document.getElementById("style").value;
    const idx = styles.findIndex((s) => {
        return s.file === style;
    });
    const newStyle = styles[(idx + offset + styles.length) % styles.length].file;
    document.getElementById("style").value = newStyle;
    const change = new Event("change");
    document.getElementById("style").dispatchEvent(change);
}
