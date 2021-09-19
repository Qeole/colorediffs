/* SPDX-License-Identifier: MPL-2.0 */

function setTabStyle (node, tabsize) {
    if (!tabsize) {
        return;
    }

    node.style["-moz-tab-size"] = tabsize;
}

function replaceSpaces (root, tabsize) {
    function replacer (match, spaces, offset, string) {
        /* Space on first column, likely generated for the diff, abort */
        if (match == " " && (offset == 0 || string[offset - 1] == "\n")) {
            return " ";
        }

        let content = "<span class='hljs-comment cd-s'>";
        if (match[0] == "\t") {
            content += "›";
            const lastNewLine = string.slice(0, offset).lastIndexOf("\n");
            const lastTab = string.slice(0, offset).lastIndexOf("\t");
            const offsetInLine = offset - Math.max(lastNewLine + 1, lastTab + 1);
            if (offsetInLine % tabsize != tabsize - 1) {
                content += "\t";
            }
            content += "›\t".repeat(match.length - 1);
        } else {
            content += (offset == 0 || string[offset - 1] == "\n" ? " " : "·");
            content += "·".repeat(match.length - 1);
        }
        content += "</span>";
        return content;
    };

    function doReplace (node) {
        node.textContent = node.textContent.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        node.innerHTML = node.textContent.replace(/( +|\t+)/g, replacer);
    };

    function spanify (node) {
        const span = document.createElement("SPAN");
        span.className = "cd-s";
        span.textContent = node.textContent;
        node.parentNode.insertBefore(span, node);
        node.remove();
        return span;
    };

    function processNeighbour (neighbour) {
        if (neighbour && neighbour.nodeType == Node.TEXT_NODE) {
            doReplace(spanify(neighbour));
        }
    };

    function processSpan (span) {
        doReplace(span);

        /* For context: replace in closest siblings if they are text nodes */
        processNeighbour(span.previousSibling);
        processNeighbour(span.nextSibling);
    };

    const addSpans = root.getElementsByClassName("hljs-addition");
    for (const span of addSpans) {
        processSpan(span);
    }

    const delSpans = root.getElementsByClassName("hljs-deletion");
    for (const span of delSpans) {
        processSpan(span);
    }
}

function restoreSpaces () {
    const spans = document.getElementsByClassName("cd-s");
    while (spans.length) {
        const span = spans[0];
        const content = span.textContent.replace(/›\t?/g, "\t").replace(/·/g, " ");
        const spaces = document.createTextNode(content);
        span.parentNode.insertBefore(spaces, span);
        span.remove();
    }
}

function toggleSpaces (pre) {
    if (document.getElementsByClassName("cd-s").length) {
        restoreSpaces();
    } else {
        for (const pre of document.querySelectorAll("body > div > pre")) {
            replaceSpaces(pre.firstChild, options.tabsize);
        }
    }
}

/* Wait for the hljs object from the highlight.js script to be loaded */
function waitForHljs () {
    return new Promise((resolve, reject) => {
        (function pollHljs () {
            if (typeof (hljs) !== "undefined") {
                return resolve();
            }
            setTimeout(pollHljs, 10);
        })();
    });
}
