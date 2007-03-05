rm -rf build %1-build

mkdir build

mkdir build\chrome
mkdir build\chrome\content
mkdir build\chrome\content\colorediffs
cp content\colorediffs\diff-parser.js build\chrome\content\colorediffs\
cp content\colorediffs\side-by-side-mode.js build\chrome\content\colorediffs\
cp content\colorediffs\unified-mode.js build\chrome\content\colorediffs\
cp content\colorediffs\colorediffs.js build\chrome\content\colorediffs\
cp content\colorediffs\contents.rdf build\chrome\content\colorediffs\
cp content\colorediffs\globals.js build\chrome\content\colorediffs\
cp content\colorediffs\icon.png build\chrome\content\colorediffs\
cp content\colorediffs\msgwindowoverlay.xul build\chrome\content\colorediffs\
cp content\colorediffs\options.css build\chrome\content\colorediffs\
cp content\colorediffs\options.js build\chrome\content\colorediffs\
cp content\colorediffs\options.xul build\chrome\content\colorediffs\
cp content\colorediffs\overlay.js build\chrome\content\colorediffs\
cp content\colorediffs\overlay.xul build\chrome\content\colorediffs\
cp content\colorediffs\toolbar.js build\chrome\content\colorediffs\
cp content\colorediffs\callbacks.js build\chrome\content\colorediffs\

mkdir build\chrome\skin
cp skin\colorediffs.css build\chrome\skin\
cp skin\white-space.png build\chrome\skin\

mkdir build\defaults
mkdir build\defaults\preferences
cp defaults\preferences\colorediffs.js build\defaults\preferences\

cp install-%1.rdf build\install.rdf
cp chrome.manifest.install build\chrome.manifest

cd build\chrome
zip -r colorediffs.jar content\ skin\
cd ..\..

rm -rf build\chrome\content
rm -rf build\chrome\skin

cd build
zip -r colorediffs-%2.xpi *

rm -rf chrome defaults install.rdf

cd ..

mv build %1-build