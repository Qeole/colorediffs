mkdir %1
mkdir %1\content
mkdir %1\content\colorediffs

cp content\colorediffs\callbacks.js %1\content\colorediffs\
cp content\colorediffs\colorediffs.js %1\content\colorediffs\
cp content\colorediffs\contents.rdf %1\content\colorediffs\
cp content\colorediffs\dom.js %1\content\colorediffs\
cp content\colorediffs\globals.js %1\content\colorediffs\
cp content\colorediffs\icon.png %1\content\colorediffs\
cp content\colorediffs\ilUtils.js %1\content\colorediffs\
cp content\colorediffs\main-overlay.xul %1\content\colorediffs\
cp content\colorediffs\msgwindowoverlay.xul %1\content\colorediffs\
cp content\colorediffs\overlay.js %1\content\colorediffs\
cp content\colorediffs\overlay.xul %1\content\colorediffs\
cp content\colorediffs\prefs.js %1\content\colorediffs\
cp content\colorediffs\toolbar.js %1\content\colorediffs\

mkdir %1\content\colorediffs\bindings
cp content\colorediffs\bindings\bindings.css %1\content\colorediffs\bindings\
cp content\colorediffs\bindings\colorpicker.css %1\content\colorediffs\bindings\
cp content\colorediffs\bindings\main-bindings.xbl %1\content\colorediffs\bindings\

mkdir %1\content\colorediffs\options
cp content\colorediffs\options\context-view-options.xul %1\content\colorediffs\options\
cp content\colorediffs\options\unified-view-options.xul %1\content\colorediffs\options\
cp content\colorediffs\options\side-by-side-view-options.xul %1\content\colorediffs\options\
cp content\colorediffs\options\options.css %1\content\colorediffs\options\
cp content\colorediffs\options\options.js %1\content\colorediffs\options\
cp content\colorediffs\options\options.xul %1\content\colorediffs\options\
cp content\colorediffs\options\options-pref.js %1\content\colorediffs\options\
cp content\colorediffs\options\options-pref-callback.js %1\content\colorediffs\options\

mkdir %1\content\colorediffs\parsers
cp content\colorediffs\parsers\main-parser.js %1\content\colorediffs\parsers
cp content\colorediffs\parsers\context-parser.js %1\content\colorediffs\parsers
cp content\colorediffs\parsers\unified-parser.js %1\content\colorediffs\parsers

mkdir %1\content\colorediffs\transformations
cp content\colorediffs\transformations\composite-transformation.js %1\content\colorediffs\transformations
cp content\colorediffs\transformations\make-lines-equal-length.js %1\content\colorediffs\transformations
cp content\colorediffs\transformations\find-common-name.js %1\content\colorediffs\transformations
cp content\colorediffs\transformations\detect-old-new-files.js %1\content\colorediffs\transformations
cp content\colorediffs\transformations\select-old-new-files.js %1\content\colorediffs\transformations
cp content\colorediffs\transformations\truncate-file-names.js %1\content\colorediffs\transformations
cp content\colorediffs\transformations\add-title.js %1\content\colorediffs\transformations
cp content\colorediffs\transformations\main-transformation.js %1\content\colorediffs\transformations
cp content\colorediffs\transformations\escape-html-special-characters-transformation.js %1\content\colorediffs\transformations
cp content\colorediffs\transformations\replace-file-names-transformation.js %1\content\colorediffs\transformations
cp content\colorediffs\transformations\show-whitespaces-transformation.js %1\content\colorediffs\transformations

mkdir %1\content\colorediffs\views
cp content\colorediffs\views\main-view.js %1\content\colorediffs\views
cp content\colorediffs\views\side-by-side-view.js %1\content\colorediffs\views
cp content\colorediffs\views\unified-view.js %1\content\colorediffs\views
cp content\colorediffs\views\context-view.js %1\content\colorediffs\views

mkdir %1\skin
cp skin\colorediffs.css %1\skin\
cp skin\white-space.png %1\skin\
cp skin\options.png %1\skin\
