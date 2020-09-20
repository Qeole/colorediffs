/* SPDX-License-Identifier: MPL-2.0 */

function saveOptions(e) {
    e.preventDefault();

    let tabsize = Number(document.getElementById("tabsize").value);
    if (!Number.isInteger(tabsize) || tabsize <= 0)
        tabsize = DefaultOptions.tabsize;

    return browser.storage.local.set({
        style: document.getElementById("style").value,
        tabsize: tabsize,
        spaces: document.getElementById("spaces").checked,
        colorall: document.getElementById("colorall").checked,
    });
}

function restoreOption(id) {
    return browser.storage.local.get(id).then((res) => {
        let element = document.getElementById(id);
        if (element.type && element.type == "checkbox")
            element.checked = res[id] || DefaultOptions[id];
        else
            element.value = res[id] || DefaultOptions[id];
    }, defaultError);
}

async function restoreAllOptions() {
    await restoreOption("style");
    await restoreOption("tabsize");
    await restoreOption("spaces");
    await restoreOption("colorall");
}

function resetAllOptions() {
    return browser.storage.local.remove(OptionsList).then(() => {
        restoreAllOptions();
    });
}
