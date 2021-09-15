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

    /*
     * Signature handling:
     * Search for a div with "moz-txt-sig" class set somewhere inside the plain
     * text mail. This node holds all signatures. We will remove it from the
     * DOM to exclude it from the highlighting and add it back afterwards.
     */
    let sigParentNode;
    let signatureNodes = document.querySelectorAll("div.moz-text-plain code > div.moz-txt-sig");

    if (signatureNodes.length) {
        sigParentNode = signatureNodes[0].parentNode;
        signatureNodes[0].remove();
    }

    /* Call library function, trigger highlighting */
    hljs.configure({ ignoreUnescapedHTML: true });
    hljs.highlightAll();

    if (signatureNodes.length) {
        signatureNodes[0].className += " hljs-comment";
        sigParentNode.appendChild(signatureNodes[0]);
    }

    /* Replace spaces and tabs if required */
    if (options.spaces) {
        for (let pre of preNodes)
            replaceSpaces(pre.firstChild, options.tabsize);
    } else if (document.getElementsByClassName("cd-s").length) {
            restoreSpaces();
    }
}
