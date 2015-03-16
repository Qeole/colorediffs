This is a <a href="javascript:var%20s=document.createElement('script');s.setAttribute('src','http://jquery.com/src/jquery-latest.js');document.body.appendChild(s);s.onload=function(){jQuery.noConflict();jQuery('pre').each(function(i,el){jQuery(el).html(jQuery(el).html().replace(/^(@@\s-[\d,]+\s\+[\d,]+\s@@)\s/mg,'$1\n').replace(/^(@@\s-[\d,]+\s\+[\d,]+\s@@)$/mg,'<span%20style=\'color:blue\'>$1</span>').replace(/^(\+)$/mg,'<span%20style=\'color:green\'>$1</span>').replace(/^(\+{3}%20[^+].*)$/mg,'<span%20style=\'color:green\'>$1</span>').replace(/^(\+[^+].*)$/mg,'<span%20style=\'color:green\'>$1</span>').replace(/^(\-)$/mg,'<span%20style=\'color:red\'>$1</span>').replace(/^(\-{3}%20[^-].*)$/mg,'<span%20style=\'color:red\'>$1</span>').replace(/^(\-[^-].*)$/mg,'<span%20style=\'color:red\'>$1</span>'));});};void(s);">link</a> to bookmark

And below is nicely formatted code for it.

```
var s=document.createElement('script');
s.setAttribute('src', 'http://jquery.com/src/jquery-latest.js');
document.body.appendChild(s);
s.onload=function(){
    jQuery.noConflict();
    jQuery("pre").each(function(i, el) {
            jQuery(el).html(
                jQuery(el).html()
                .replace(/^(@@\s-[\d,]+\s\+[\d,]+\s@@)\s/mg,
                         "$1\n")
                .replace(/^(@@\s-[\d,]+\s\+[\d,]+\s@@)$/mg,
                         "<span style='color:blue'>$1</span>")
                .replace(/^(\+)$/mg,
                         "<span style='color:green'>$1</span>")
                .replace(/^(\+{3} [^+].*)$/mg,
                         "<span style='color:green'>$1</span>")
                .replace(/^(\+[^+].*)$/mg,
                         "<span style='color:green'>$1</span>")
                .replace(/^(\-)$/mg,
                         "<span style='color:red'>$1</span>")
                .replace(/^(\-{3} [^-].*)$/mg,
                         "<span style='color:red'>$1</span>")
                .replace(/^(\-[^-].*)$/mg,
                         "<span style='color:red'>$1</span>")
            );
        });
};
void(s);
```