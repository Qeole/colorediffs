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
            let i, j = -1;

            for (i = 0; i < pre.childNodes.length && j < 0; i++) {
                if (pre.childNodes[i].nodeName === "#text") {
                    /*
                     * man git-format-patch: The log message and the patch are
                     * separated by a line with a three-dash line.
                     */
                    j = pre.childNodes[i].textContent.search(/^---$/m);
                }
            }
            if (j >= 0) {
                pre.childNodes[i - 1].splitText(j + '---'.length);
            }
            for (; i < pre.childNodes.length; i++) {
                if (pre.childNodes[i].nodeName === "#text") {
                    const span = document.createElement("SPAN");

                    span.style.padding = "0";
                    transformations.setTabStyle(span, options.tabsize);
                    span.setAttribute("class", "hljs diff colorediffs");

                    span.appendChild(pre.childNodes[i]);
                    pre.insertBefore(span, pre.childNodes[i]);
                }
            }
        }

        /* Call library function, trigger highlighting */
        hljs.configure({
            ignoreUnescapedHTML: true,
            cssSelector: ".colorediffs",
        });
        hljs.highlightAll();

        /* Replace spaces and tabs if required */
        if (options.spaces) {
            for (const pre of preNodes) {
                transformations.replaceSpaces(pre, options.tabsize);
            }
        } else if (document.getElementsByClassName("cd-s").length) {
            transformations.restoreSpaces();
        }
    },
};
