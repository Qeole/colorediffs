/* SPDX-License-Identifier: MPL-2.0 */

var port;

function connectPort() {
    if (port)
        return;
    port = browser.runtime.connect({
        name: "contentToBackground",
    });
}

function addToolbar() {
    let div = document.getElementById("colorediffsToolbar");
    if (div)
        return;

    let toolbarHeight = "5ex";
    document.body.childNodes[1].style.margin = "8px 8px calc(" + toolbarHeight + " + 8px) 8px";
    document.body.style.margin = "0";
    document.body.style.padding = "0";

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

    let toolbarCss = `
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
    let style = document.createElement("style");
    style.setAttribute("type", "text/css");
    let styleTextNode = document.createTextNode(toolbarCss);
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
function isPlainText() {
    let bodyNodes = document.body.childNodes;
    let bodyLength = bodyNodes.length;
    if (!(bodyLength == 3 ||
          (bodyLength == 4 && bodyNodes[bodyLength - 1].id == "colorediffsToolbar")))
        return false;
    if (bodyNodes[1].tagName != "DIV")
        return false;
    let firstChildClass = bodyNodes[1].className;
    if (firstChildClass != "moz-text-plain" && firstChildClass != "moz-text-flowed")
        return false;

    return true;
}

/* Check whether this message contains diff snippets */
function hasDiff() {
    /* These patterns were kept from the old version of the add-on */
    let contextLineTag = /^(?:\*|\-){3}\s+(\d+)\,\d+\s+(?:\*|\-){4}$/m;
    let unifiedLineTag = /^@@\s+\-\d+(?:\,\d+)?\s\+\d+(?:\,\d+)?\s+@@/m;
    let unifiedNewTag = /^--- NEW FILE:\s.* ---$/m;
    let unifiedBinaryTag = /^---\s(?:new\s)?BINARY FILE:\s.*\s---$/m;
    let textBody = document.body.textContent;

    for (tag of
         [contextLineTag, unifiedLineTag, unifiedNewTag, unifiedBinaryTag]) {
        if (tag.test(textBody))
            return true;
    }

    return false;
}

/* Trigger checks, toolbar, and coloring */
(function () {
    if (!isPlainText())
        return;

    /* Do not colorize twice, but do update toolbar color */
    if (document.getElementsByClassName("hljs").length)
        return addToolbar();

    /* Check whether coloring code was injected by background script */
    let doColors = typeof(colorizeDiff) != 'undefined';

    /*
     * If options.colorall is enabled, color as fast as we can to avoid white
     * flashes with dark backgrounds
     */
    if (options.colorall && doColors)
        colorizeBody();

    let msgWithDiff = hasDiff();
    if (!options.colorall && msgWithDiff && doColors)
        colorizeBody();

    if (options.colorall || msgWithDiff)
        addToolbar();

    if (msgWithDiff && doColors)
        colorizeDiff();
})();
