/* SPDX-License-Identifier: MPL-2.0 */

document.addEventListener('DOMContentLoaded', () => {
    restoreAllOptions().then(() => { createPreview(); });
});

OptionsList.forEach((option) => {
    document.getElementById(option).addEventListener("change", (e) => {
        saveOptions(e).then(() => { updateStyle(e); });
    });
});

document.getElementById("reset").addEventListener("click", () => {
    resetAllOptions().then(() => { waitAndUpdateStyle() });
});

document.getElementById("preview-prev").addEventListener("click", () => { changeStyle(-1); });
document.getElementById("preview-next").addEventListener("click", () => { changeStyle(1); });
