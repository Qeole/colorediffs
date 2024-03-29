# SPDX-License-Identifier: MPL-2.0

VERSION=$(shell sed -n '/"version"/ s/.*: "\(.*\)",/\1/p' manifest.json)
ADDON=colorediffs-$(VERSION).xpi

JAR=/tmp/colorediffs.cookie
HLJS_DL='https://highlightjs.org/download/'
HLJS_ZIP=/tmp/highlight.zip
HLJS_SCRIPT=hljs/highlight.min.js
HLJS_STYLES=hljs/styles/

addon: checks xpi addons-linter

checks: check_css eslint

xpi: $(ADDON)

%.xpi: \
	manifest.json \
	README.md LICENSE COPYRIGHT \
	misc/icon.png \
	options/ \
	scripts/ \
	hljs/README.md hljs/LICENSE \
	$(HLJS_SCRIPT) \
	hljs/styles/
	zip -q -r $@ $^

$(HLJS_SCRIPT):
	TOKEN=$$(curl -sL --cookie-jar "$(JAR)" $(HLJS_DL) | sed -n '/csrfmiddlewaretoken/ s/.*value="\([^"]\+\)".*/\1/p') && \
	curl -sL --referer $(HLJS_DL) --cookie "$(JAR)" --request POST --data-urlencode "csrfmiddlewaretoken=$$TOKEN" --data-urlencode 'diff.js=on' $(HLJS_DL) --output "$(HLJS_ZIP)"
	unzip -q -o "$(HLJS_ZIP)" -d hljs
	rm -- "$(JAR)" "$(HLJS_ZIP)"
	@VERSION=$$(jq .version hljs/package.json) && printf "\e[;32m[NOTE] Successfully downloaded highlight.js version $$VERSION.\e[0m\n"

$(HLJS_STYLES) hljs/README.md hljs/LICENSE: $(HLJS_SCRIPT)

check_css_list: $(HLJS_STYLES)
	@printf 'Checking that all CSS styles from highlight.js are listed in the add-on...\t'
	@error=0; for stylepath in $(HLJS_STYLES)*.min.css $(HLJS_STYLES)/base16/*.min.css; do \
		stylesheet=$$(basename $$stylepath); \
		stylename=$${stylesheet%.min.css}; \
		if ! grep -q $$stylename options/list-styles.js; then \
			[ $$error = 0 ] && printf '\n'; \
			printf '\e[1;31m[WARNING] Found missing CSS style: "%s".\e[0m\n' $$stylename; \
			error=1; \
		fi; \
	done; [ $$error = 0 ] && printf 'All good.\n' || false

check_css_files: $(HLJS_STYLES)
	@printf 'Checking that all CSS styles listed in the add-on are present in hljs/...\t'
	@error=0; for style in $$(sed -n 's/ *{ "file": "\([^"]*\)",.*/\1/p' options/list-styles.js); do \
		if ! [ -f $(HLJS_STYLES)/$${style}.min.css ]; then \
			[ $$error = 0 ] && printf '\n'; \
			printf '\e[1;31m[WARNING] Found missing CSS file: "%s".\e[0m\n' $$style; \
			error=1; \
		fi; \
	done; [ $$error = 0 ] && printf 'All good.\n' || false

check_css: check_css_list check_css_files

.PHONY: check_css check_css_list check_css_files

# https://github.com/mozilla/addons-linter
ADDONS_LINTER ?= ./node_modules/addons-linter/bin/addons-linter
addons-linter:
	$(ADDONS_LINTER) $(ADDON)

# https://eslint.org/
eslint:
	npx eslint $(FIX) scripts options

.PHONY: eslint addons-linter

clean-hljs:
	rm -rf -- hljs

clean: clean-hljs
	rm -f -- $(ADDON)

.PHONY: addon checks xpi clean clean-hljs
