/* SPDX-License-Identifier: MPL-2.0 */

import { OptionsList } from "./defaults.js";
import { FullStyleList } from "./list-styles.js";
import { changeStyle, createPreview, updateStyle, waitAndUpdateStyle } from "./preview.js";
import { resetAllOptions, restoreAllOptions, saveOptions } from "./save-restore.js";

/* Populate list of styles */
const list = document.getElementById("style");
for (const s of FullStyleList) {
    const item = document.createElement("option");
    item.value = s.file;
    item.textContent = s.name;
    list.appendChild(item);
}

document.addEventListener("DOMContentLoaded", () => {
    restoreAllOptions().then(() => {
        createPreview();
    });
});

OptionsList.forEach((option) => {
    document.getElementById(option).addEventListener("change", (e) => {
        saveOptions(e).then(() => {
            updateStyle(e);
        });
    });
});

document.getElementById("reset").addEventListener("click", () => {
    resetAllOptions().then(() => {
        waitAndUpdateStyle();
    });
});

document.getElementById("preview-prev").addEventListener("click", () => {
    changeStyle(-1);
});
document.getElementById("preview-next").addEventListener("click", () => {
    changeStyle(1);
});
