rm -rf build %1-build

mkdir build

mkdir build\chrome
mkdir build\chrome\content
mkdir build\chrome\content\colorediffs

cp content\colorediffs\callbacks.js build\chrome\content\colorediffs\
cp content\colorediffs\colorediffs.js build\chrome\content\colorediffs\
cp content\colorediffs\contents.rdf build\chrome\content\colorediffs\
cp content\colorediffs\dom.js build\chrome\content\colorediffs\
cp content\colorediffs\globals.js build\chrome\content\colorediffs\
cp content\colorediffs\icon.png build\chrome\content\colorediffs\
cp content\colorediffs\ilUtils.js build\chrome\content\colorediffs\
cp content\colorediffs\main-overlay.xul build\chrome\content\colorediffs\
cp content\colorediffs\msgwindowoverlay.xul build\chrome\content\colorediffs\
cp content\colorediffs\overlay.js build\chrome\content\colorediffs\
cp content\colorediffs\overlay.xul build\chrome\content\colorediffs\
cp content\colorediffs\prefs.js build\chrome\content\colorediffs\
cp content\colorediffs\toolbar.js build\chrome\content\colorediffs\

mkdir build\chrome\content\colorediffs\bindings
cp content\colorediffs\bindings\bindings.css build\chrome\content\colorediffs\bindings\
cp content\colorediffs\bindings\colorpicker.css build\chrome\content\colorediffs\bindings\
cp content\colorediffs\bindings\main-bindings.xbl build\chrome\content\colorediffs\bindings\

mkdir build\chrome\content\colorediffs\options
cp content\colorediffs\options\context-view-options.xul build\chrome\content\colorediffs\options\
cp content\colorediffs\options\unified-view-options.xul build\chrome\content\colorediffs\options\
cp content\colorediffs\options\side-by-side-view-options.xul build\chrome\content\colorediffs\options\
cp content\colorediffs\options\options.css build\chrome\content\colorediffs\options\
cp content\colorediffs\options\options.js build\chrome\content\colorediffs\options\
cp content\colorediffs\options\options.xul build\chrome\content\colorediffs\options\
cp content\colorediffs\options\options-pref.js build\chrome\content\colorediffs\options\
cp content\colorediffs\options\options-pref-callback.js build\chrome\content\colorediffs\options\

mkdir build\chrome\content\colorediffs\parsers
cp content\colorediffs\parsers\main-parser.js build\chrome\content\colorediffs\parsers
cp content\colorediffs\parsers\context-parser.js build\chrome\content\colorediffs\parsers
cp content\colorediffs\parsers\unified-parser.js build\chrome\content\colorediffs\parsers

mkdir build\chrome\content\colorediffs\transformations
cp content\colorediffs\transformations\composite-transformation.js build\chrome\content\colorediffs\transformations
cp content\colorediffs\transformations\make-lines-equal-length.js build\chrome\content\colorediffs\transformations
cp content\colorediffs\transformations\find-common-name.js build\chrome\content\colorediffs\transformations
cp content\colorediffs\transformations\detect-old-new-files.js build\chrome\content\colorediffs\transformations
cp content\colorediffs\transformations\select-old-new-files.js build\chrome\content\colorediffs\transformations
cp content\colorediffs\transformations\add-title.js build\chrome\content\colorediffs\transformations
cp content\colorediffs\transformations\main-transformation.js build\chrome\content\colorediffs\transformations
cp content\colorediffs\transformations\escape-html-special-characters-transformation.js build\chrome\content\colorediffs\transformations
cp content\colorediffs\transformations\replace-file-names-transformation.js build\chrome\content\colorediffs\transformations
cp content\colorediffs\transformations\show-whitespaces-transformation.js build\chrome\content\colorediffs\transformations

mkdir build\chrome\content\colorediffs\views
cp content\colorediffs\views\main-view.js build\chrome\content\colorediffs\views
cp content\colorediffs\views\side-by-side-view.js build\chrome\content\colorediffs\views
cp content\colorediffs\views\unified-view.js build\chrome\content\colorediffs\views
cp content\colorediffs\views\context-view.js build\chrome\content\colorediffs\views

mkdir build\chrome\skin
cp skin\colorediffs.css build\chrome\skin\
cp skin\white-space.png build\chrome\skin\
cp skin\options.png build\chrome\skin\

mkdir build\defaults
mkdir build\defaults\preferences
cp defaults\preferences\colorediffs.js build\defaults\preferences\

rem cp install-%1.rdf build\install.rdf
sed -e "s/${version}/%2/g" < install-%1.rdf > build\install.rdf

cp chrome.manifest.install build\chrome.manifest

cd build\chrome
zip -r colorediffs.jar content\ skin\
cd ..\..

rm -rf build\chrome\content
rm -rf build\chrome\skin

cd build
zip -r colorediffs-%2.xpi *

rm -rf chrome defaults install.rdf chrome.manifest

cd ..

mv build %1-build