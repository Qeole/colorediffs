/* SPDX-License-Identifier: MPL-2.0 */

function setTabStyle(node, tabsize) {
    if (!tabsize)
        return;

    node.style["-moz-tab-size"] = tabsize;
}

function replaceSpaces(root, tabsize) {
    function replacer(match, spaces, offset, string) {
        /* Space on first column, likely generated for the diff, abort */
        if (match == " " && (offset == 0 || string[offset - 1] == '\n'))
            return " ";

        let content = "<span class='hljs-comment cd-s'>";
        if (match[0] == '\t') {
            content += "›";
            let lastNewLine = string.slice(0, offset).lastIndexOf("\n");
            let lastTab = string.slice(0, offset).lastIndexOf("\t");
            let offsetInLine = offset - Math.max(lastNewLine + 1, lastTab + 1);
            if (offsetInLine % tabsize != tabsize - 1)
                content += "\t";
            content += "›\t".repeat(match.length - 1);
        } else {
            content += (offset == 0 || string[offset - 1] == '\n' ? " " : "·")
            content += "·".repeat(match.length - 1);
        }
        content += "</span>";
        return content;
    };

    function doReplace(node) {
        node.textContent = node.textContent.replace(/&/g,'&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        node.innerHTML = node.textContent.replace(/( +|\t+)/g, replacer);
    };

    function spanify(node) {
        let span = document.createElement("SPAN");
        span.className = 'cd-s';
        span.textContent = node.textContent;
        node.parentNode.insertBefore(span, node);
        node.remove();
        return span;
    };

    function processNeighbour(neighbour) {
        if (neighbour && neighbour.nodeType == Node.TEXT_NODE)
            doReplace(spanify(neighbour));
    };

    function processSpan(span) {
        doReplace(span);

        /* For context: replace in closest siblings if they are text nodes */
        processNeighbour(span.previousSibling);
        processNeighbour(span.nextSibling);
    };

    let addSpans = root.getElementsByClassName("hljs-addition");
    for (let span of addSpans)
        processSpan(span);

    let delSpans = root.getElementsByClassName("hljs-deletion");
    for (let span of delSpans)
        processSpan(span);
}

function restoreSpaces() {
    let spans = document.getElementsByClassName("cd-s");
    while (spans.length) {
        let span = spans[0];
        let content = span.textContent.replace(/›\t?/g, '\t').replace(/·/g, ' ');
        let spaces = document.createTextNode(content);
        span.parentNode.insertBefore(spaces, span);
        span.remove();
    }
}

function toggleSpaces(pre) {
    if (document.getElementsByClassName("cd-s").length) {
        restoreSpaces();
    } else {
        for (let pre of document.querySelectorAll("body > div > pre"))
            replaceSpaces(pre.firstChild, options.tabsize);
    }
}

/* Do not consider signature marker as a deleted line */
function patchGitSendSignature(node) {
    if (node.className != "moz-txt-sig")
        return;
    if (node.childNodes.length != 2)
        return;

    let marker = node.childNodes[0];
    let version = node.childNodes[1];
    let versionPattern = /^\n\d+\.\d+\.\S+\n+$/;

    if (marker.textContent != "-- ")
        return;
    if (!versionPattern.test(version.textContent))
        return;

    marker.className = "hljs-comment";
    marker.textContent += version.textContent;
    version.remove();
}

/* Wait for the hljs object from the highlight.js script to be loaded */
function waitForHljs() {
    return new Promise((resolve, reject) => {
        (function pollHljs() {
            if (typeof(hljs) !== 'undefined')
                return resolve();
            setTimeout(pollHljs, 10);
        })();
    });
}
