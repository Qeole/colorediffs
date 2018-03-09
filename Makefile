ADDON=colorediffs
XPI=$(ADDON)-$(shell date -u "+%Y%m%d").xpi
SRC=$(shell find chrome defaults ! -path "chrome/content/tests*")
TOPFILES=install.rdf chrome.manifest LICENSE COPYRIGHT

.PHONY: clean test

xpi: $(XPI)

%.xpi: $(SRC) $(TOPFILES)
	zip -q $@ $^

test:
	@echo 'Wait, it does not work! :('
	@#java -cp test-framework/js.jar org.mozilla.javascript.tools.shell.Main \
		#-version 170 \
		#-debug test-framework/main.js \
		#--test-directory chrome/content/tests/

clean:
	rm -f $(ADDON)-*.xpi
