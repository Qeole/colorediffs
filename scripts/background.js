/* SPDX-License-Identifier: MPL-2.0 */

import { DefaultOptions, defaultError } from "../options/defaults.js";

const options = {};
let wantColors = true;

let port;
let scriptsPromise;
let cssPromise;

function reloadOption (id) {
    return browser.storage.local.get(id).then((res) => {
        if (res[id] !== undefined) {
            options[id] = res[id];
        } else {
            options[id] = DefaultOptions[id];
        }
    }, defaultError);
}

async function reloadAllOptions () {
    await reloadOption("style");
    await reloadOption("tabsize");
    await reloadOption("spaces");
    await reloadOption("colorall");
}

function processCommand (msg) {
    switch (msg.command) {
    case "toggleSpaces":
        options.spaces = !options.spaces;
        unregisterScripts().then(registerScripts);
        break;
    case "toggleColor":
        wantColors = !wantColors;
        unregisterScripts().then(registerScripts);
        if (wantColors) {
            registerCss();
        } else {
            unregisterCss();
        }
        break;
    default:
        break;
    }
}

function registerCss () {
    cssPromise = browser.messageDisplayScripts.register({
        css: [{
            file: "/hljs/styles/" + options.style + ".min.css",
        }],
    });
}

function registerScripts () {
    const contentScripts = {
        js: [
            {
                code: "var options = " + JSON.stringify(options) + ";",
            },
        ],
    };
    if (wantColors) {
        contentScripts.js.push(
            {
                file: "/hljs/highlight.min.js",
            },
            {
                file: "/scripts/transformations.js",
            },
            {
                file: "/scripts/coloring.js",
            }
        );
    }
    contentScripts.js.push(
        {
            file: "/scripts/content.js",
        }
    );
    scriptsPromise = browser.messageDisplayScripts.register(contentScripts);
}

async function unregisterCss () {
    await cssPromise.then(css => css.unregister());
}

async function unregisterScripts () {
    await scriptsPromise.then(script => script.unregister());
}

async function reset () {
    await unregisterScripts();
    await unregisterCss();
    await init();
}

function init () {
    reloadAllOptions().then(registerCss).then(registerScripts);
}

browser.storage.onChanged.addListener(reset);
browser.runtime.onConnect.addListener((p) => {
    port = p;
    port.onMessage.addListener(processCommand);
});

init();
