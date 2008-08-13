=== Small caps ===
Contributors: chetan
Donate link: http://ckunte.com/
Tags: smallcaps, abbr, typography
Requires at least: 2.0.2
Tested up to: 2.6.1
Stable tag: trunk

Encloses capitalized words within `<abbr> </abbr>` tags, so that abbr tags could be styled to display small caps--for typographical effect.

== Description ==

Encloses capitalized words with three or characters more within `<abbr> </abbr>` tags, so that abbr tags could be styled to display small caps--for typographical effect. More here: http://ckunte.com/archives/small-caps .

== Installation ==

1. Upload `small-caps.php` to the `/wp-content/plugins/` folder.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Add the following styling to your style.css file:

abbr { text-transform:lowercase; font-variant:small-caps }

Optional: If you prefer this to be automatically added to the header of your template, across the themes without editing them yourself manually to add the above styling, then, you may uncomment lines 32 through to 38 in the plugin file `small-caps.php` .

== Frequently Asked Questions ==

= Does this plugin modify the database? =

No, it does not. So it's safe.

= Is small-caps styling visible in the feed too? =

I believe it is.

== Screenshots ==

None.