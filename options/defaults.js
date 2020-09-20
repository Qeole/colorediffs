/* SPDX-License-Identifier: MPL-2.0 */

const DefaultOptions = {
    style: "idea",
    tabsize: 8,
    spaces: false,
    colorall: false,
}

const OptionsList = Object.keys(DefaultOptions);

function defaultError(error) {
    console.error("[colorediffs]: Error:", error);
}
