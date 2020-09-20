/* SPDX-License-Identifier: MPL-2.0 */

function colorizeBody() {
    document.body.setAttribute("class", "hljs");
}

function colorizeDiff() {
    /*
     * With plain text, content is under <pre> nodes. We want to insert <code>
     * nodes with .hljs class between these <pre> node and their children.
     */
    let preNodes = document.querySelectorAll("body > div > pre"); 
    for (let pre of preNodes) {
        let code = document.createElement("CODE");

        code.style.padding = "0";
        setTabStyle(code, options.tabsize);
        code.setAttribute("class", "hljs diff");

        while (pre.childNodes.length > 0)
            code.appendChild(pre.childNodes[0]);
        pre.appendChild(code);
    }

    /* Call library function, trigger highlighting */
    hljs.initHighlighting();

    /* Git-send signature is considered as a deletion, patch it */
    patchGitSendSignature(preNodes[preNodes.length - 1].lastChild.lastChild);
    /* Replace spaces and tabs if required */
    if (options.spaces) {
        for (let pre of preNodes)
            replaceSpaces(pre.firstChild, options.tabsize);
    } else if (document.getElementsByClassName("cd-s").length) {
            restoreSpaces();
    }
}
