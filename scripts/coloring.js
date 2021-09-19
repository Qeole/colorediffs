/* SPDX-License-Identifier: MPL-2.0 */

/* eslint-disable-next-line no-unused-vars */
const coloring = {
    colorizeBody: function () {
        document.body.setAttribute("class", "hljs");
    },

    colorizeDiff: function () {
        /*
         * With plain text, content is under <pre> nodes. We want to insert <code>
         * nodes with .hljs class between these <pre> node and their children.
         */
        const preNodes = document.querySelectorAll("body > div > pre");
        for (const pre of preNodes) {
            const code = document.createElement("CODE");

            code.style.padding = "0";
            transformations.setTabStyle(code, options.tabsize);
            code.setAttribute("class", "hljs diff");

            while (pre.childNodes.length > 0) {
                code.appendChild(pre.childNodes[0]);
            }
            pre.appendChild(code);
        }

        /*
         * Signature handling:
         * Search for a div with "moz-txt-sig" class set somewhere inside the plain
         * text mail. This node holds all signatures. We will remove it from the
         * DOM to exclude it from the highlighting and add it back afterwards.
         */
        let sigParentNode;
        const signatureNodes = document.querySelectorAll("div.moz-text-plain code > div.moz-txt-sig");

        if (signatureNodes.length) {
            sigParentNode = signatureNodes[0].parentNode;
            signatureNodes[0].remove();
        }

        /* Call library function, trigger highlighting */
        hljs.configure({ ignoreUnescapedHTML: true });
        hljs.highlightAll();

        /* Re-add signature, highlighted with "comment" color */
        if (signatureNodes.length) {
            signatureNodes[0].className += " hljs-comment";
            sigParentNode.appendChild(signatureNodes[0]);
        }

        /* Replace spaces and tabs if required */
        if (options.spaces) {
            for (const pre of preNodes) {
                transformations.replaceSpaces(pre.firstChild, options.tabsize);
            }
        } else if (document.getElementsByClassName("cd-s").length) {
            transformations.restoreSpaces();
        }
    },
};
