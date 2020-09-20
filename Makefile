# SPDX-License-Identifier: MPL-2.0

VERSION=$(shell sed -n '/"version"/ s/.*: "\(.*\)",/\1/p' manifest.json)
ADDON=colorediffs-$(VERSION).xpi

xpi: $(ADDON) check_css_list

%.xpi: \
	manifest.json \
	README.md LICENSE COPYRIGHT \
	misc/icon.png \
	options/ \
	scripts/ \
	hljs/README.md hljs/LICENSE \
	hljs/highlight.pack.js \
	hljs/styles/
	zip -q -r $@ $^

JAR=/tmp/colorediffs.cookie
HLJS_DL='https://highlightjs.org/download/'
HLJS_ZIP=/tmp/highlight.zip
HLJS_SCRIPT=hljs/highlight.pack.js
HLJS_STYLES=hljs/styles/

$(HLJS_SCRIPT):
	TOKEN=$$(curl -sL --cookie-jar "$(JAR)" $(HLJS_DL) | sed -n '/csrfmiddlewaretoken/ s/.*value="\([^"]\+\)".*/\1/p') && \
	curl -sL --referer $(HLJS_DL) --cookie "$(JAR)" --request POST --data-urlencode "csrfmiddlewaretoken=$$TOKEN" --data-urlencode 'diff.js=on' $(HLJS_DL) --output "$(HLJS_ZIP)"
	unzip -q -o "$(HLJS_ZIP)" -d hljs
	rm -- "$(JAR)" "$(HLJS_ZIP)"
	@VERSION=$$(sed -n 's/.*versionString="\([^\"]\+\)".*/\1/p' $@) && printf "\e[;32m[NOTE] Successfully downloaded highlight.js version $$VERSION.\e[0m\n"

$(HLJS_STYLES) hljs/README.md hljs/LICENSE: $(HLJS_SCRIPT)

check_css_list: $(HLJS_STYLES)
	@printf 'Checking that all CSS styles from highlight.js are listed in the add-on...\t'
	@error=0; for stylepath in $(HLJS_STYLES)*.css; do \
		stylesheet=$$(basename $$stylepath); \
		stylename=$${stylesheet%.css}; \
		if ! grep -q $$stylename options/fill-css-list.js; then \
			[ $$error = 0 ] && printf '\n'; \
			printf '\e[1;31m[WARNING] Found missing CSS style: "%s".\e[0m\n' $$stylename; \
			error=1; \
		fi; \
	done; [ $$error = 0 ] && printf 'All good.\n' || false

clean-hljs:
	rm -rf -- hljs

clean: clean-hljs
	rm -f -- $(ADDON)

.PHONY: xpi clean clean-hljs check_css_list
