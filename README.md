This is an extension that colors boring diffs sent by notifiers for Subversion, CVS, Mercurial, etc.

## Prerequisites ##
A lot of developers use CVS and/or SVN version control systems. Most of also receive special notifications from the system about changes other people do. They might be useful in various ways: someone wants to check if there are bugs in the new code, someone just wants to keep knowledge of code base up-to-date. But looking over that black-on-white letter is so boring. That's why I decided to color it up a bit.
## What it can do already ##
![Transformation](transformation.png)

Well, not so much... It can color your diffs, it can show them in side-by-side mode if you like. Also it converts all the filenames in message log into links so you can quickly jump to the file you want to review. Ah, and it can make space and tabs chars visible.
You can look through list of SupportedFormats and if your format isn't there write me an email.
## What it will do ##
In the future I want this extension to be able to do following:
  1. Highlight the actual difference between the lines
  1. Color the syntax of the language used
  1. Check new code against few rules in order to estimate quality of it
But that's pretty big tasks, it could take a while to implement them.

## Contribution ##
If you know how to do something better, whether it's code, icons, default color scheme, just contact me. Also please visit the [issues list](https://github.com/jglick/colorediffs/issues) and comment on issues you'd really like to be done first.

## Firefox extension ##
There isn't one and probably never will be, sorry. I could make it work for diff in `<pre>` sections (most mail lists archives format them like this) but it would never work in GMail and other Web mail systems where it would be actually useful. It's just plain hard to find the code between the lines of normal text.
But you could ease you pain with [Bookmarklet](Bookmarklet.md) I wrote when your needs is simple (like mail list archives) and [GreaseMonkey script](http://userscripts.org/scripts/show/26684) written by Fabrice Bellingard for GMail. Thanks for understanding.

## Note ##
Version 0.5 is the last one with support for Thunderbird 2. I'm too tired of more than two years old JavaScript engine.
