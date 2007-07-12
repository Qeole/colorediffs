rm -rf build %1-build

mkdir build

call file-list.bat build\chrome

mkdir build\defaults
mkdir build\defaults\preferences
cp defaults\preferences\colorediffs.js build\defaults\preferences\

rem cp install-%1.rdf build\install.rdf
sed -e "s/${version}/%2/g" < install-%1.rdf > build\install.rdf

cp chrome.manifest.install build\chrome.manifest

cd build\chrome
zip -r colorediffs.jar content skin
cd ..\..

rm -rf build\chrome\content
rm -rf build\chrome\skin

cd build
zip -r colorediffs-%2.xpi *

rm -rf chrome defaults install.rdf chrome.manifest

cd ..

mv build %1-build