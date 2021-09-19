/* SPDX-License-Identifier: MPL-2.0 */

let port;

function connectPort () {
    if (port) {
        return;
    }
    port = browser.runtime.connect({
        name: "contentToBackground",
    });
}

function addToolbar () {
    let div = document.getElementById("colorediffsToolbar");
    if (div) {
        return;
    }

    const toolbarHeight = "5ex";

    div = document.createElement("DIV");
    div.id = "colorediffsToolbar";

    colorButton = document.createElement("BUTTON");
    spaceButton = document.createElement("BUTTON");
    colorButton.id = "toggleColor";
    spaceButton.id = "toggleSpaces";
    colorButton.className = "toolbarButton";
    spaceButton.className = "toolbarButton";
    colorButton.innerHTML = "<span style='color: green;'>+</span><span style='color: red;'>-</span>";
    spaceButton.textContent = "›·";
    div.appendChild(colorButton);
    div.appendChild(spaceButton);

    const toolbarCss = `
    #colorediffsToolbar {
        position: fixed;
        bottom: 0;
        right: 0;
        height: ` + toolbarHeight + `;
        margin: 0;
        opacity: .3;
        transition: opacity .2s;
    }
    #colorediffsToolbar:hover {
        opacity: 1;
    }
    .toolbarButton {
        padding: 0;
        margin-right: 8px;
        font-weight: 800;
        min-width: 3em;
    }`;
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    const styleTextNode = document.createTextNode(toolbarCss);
    style.appendChild(styleTextNode);
    document.head.appendChild(style);

    document.body.appendChild(div);

    document.getElementById("toggleSpaces").addEventListener("click", () => {
        toggleSpaces();
        connectPort();
        port.postMessage({
            command: "toggleSpaces",
        });
    });
    document.getElementById("toggleColor").addEventListener("click", () => {
        connectPort();
        port.postMessage({
            command: "toggleColor",
        });
    });
}

/* Check that this is a plain text email. We don't do HTML. */
function isPlainText () {
    const bodyNodes = document.body.childNodes;

    for (const node of bodyNodes) {
        if (node.className === "moz-text-plain") {
            return true;
        }
    }

    return false;
}

/* Check whether this message contains diff snippets */
function hasDiff () {
    /* These patterns were kept from the old version of the add-on */
    const contextLineTag = /^(?:\*|-){3}\s+(\d+),\d+\s+(?:\*|-){4}$/m;
    const unifiedLineTag = /^@@\s+-\d+(?:,\d+)?\s\+\d+(?:,\d+)?\s+@@/m;
    const unifiedNewTag = /^--- NEW FILE:\s.* ---$/m;
    const unifiedBinaryTag = /^---\s(?:new\s)?BINARY FILE:\s.*\s---$/m;
    const textBody = document.body.textContent;

    for (const tag of
        [contextLineTag, unifiedLineTag, unifiedNewTag, unifiedBinaryTag]) {
        if (tag.test(textBody)) {
            return true;
        }
    }

    return false;
}

/* Trigger checks, toolbar, and coloring */
(function () {
    if (!isPlainText()) {
        return;
    }

    /* Do not colorize twice, but do update toolbar color */
    if (document.getElementsByClassName("hljs").length) {
        return addToolbar();
    }

    /* Check whether coloring code was injected by background script */
    const doColors = typeof (colorizeDiff) !== "undefined";

    /*
     * If options.colorall is enabled, color as fast as we can to avoid white
     * flashes with dark backgrounds
     */
    if (options.colorall && doColors) {
        colorizeBody();
    }

    const msgWithDiff = hasDiff();
    if (!options.colorall && msgWithDiff && doColors) {
        colorizeBody();
    }

    if (options.colorall || msgWithDiff) {
        addToolbar();
    }

    if (msgWithDiff && doColors) {
        colorizeDiff();
    }
})();
