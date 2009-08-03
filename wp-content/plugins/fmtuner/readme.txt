=== fmTuner ===
Contributors: command_tab
Donate link: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=533819
Tags: music,last.fm,sidebar,mp3
Requires at least: 2.5
Tested up to: 2.7.1
Stable tag: 1.0.7

fmTuner displays recent, top, or loved Last.fm tracks in a customizable format.

== Description ==

fmTuner pulls track information from your Last.fm account, including recent tracks, loved tracks, and top tracks.  Using built-in options and simple tags, you can fully customize how tracks appear on your site.

= Features =

* Choose between recent, loved, and top tracks
* Limit how many tracks are shown
* Adjust how often tracks get pulled from Last.fm
* Customize track appearance using HTML and placeholders

= Requirements =

* A Last.fm account to which you "scrobble" (publish) music details
* WordPress 2.5 or greater
* PHP 5 or greater

== Installation ==

Installation of fmTuner is straightforward, however it does require PHP 5 or greater.

1. Upload `fmtuner.php` to your `/wp-content/plugins/` directory, within a directory like `fmtuner`.
1. Ensure `/wp-content/plugins/fmtuner/` is writable by your webserver (`chmod 755 fmtuner`).
1. Activate the plugin through the 'Plugins' page in the WordPress admin.
1. Set your fmTuner preferences in the "Settings" menu in WordPress.
1. Place `<?php if(function_exists('fmtuner')) { fmtuner(); } ?>` in your desired template.

== Frequently Asked Questions ==

= How does fmTuner work? =

fmTuner pulls your latest tracks from Last.fm according to the settings page in the WordPress administration area.  Tracks get pulled from Last.fm when a visitor comes to your site, and are then cached for future visits.  If the cache has expired (that is, the cache's age has passed the Update Frequency you've chosen), it gets pulled again, and your page is updated.  Track information is displayed using HTML and fmTuner Tags, also in settings page. 

= What are fmTuner Tags? =

fmTuner tags are simple placeholders that can be sprinkled among HTML to customize the album display format used for each track.  Tags can be used more than once, or completely left out, depending on your preferences.  A default example is provided when you install fmTuner, so you won't be left in the dark if you have even basic HTML knowledge.

* `[::album::]` Album name (Only available for Recent tracks.)
* `[::artist::]` Artist name
* `[::image::]` Album artwork address (Usually ~120 pixels in size, but may not be square. If used, only tracks with artwork will be shown.)
* `[::number::]` Track number within the fmTuner set (e.g. for a numbered list)
* `[::title::]` Track title
* `[::url::]` Last.fm track address

Using CSS and/or JavaScript, you can do even more, limited only by your skills and imagination.  See [this tutorial](http://www.komodomedia.com/blog/2009/03/sexy-music-album-overlays/ "Sexy Music Album Overlays at KomodoMedia") for details on how to make albums look gorgeous with transparent overlay images and a little CSS.

= Can I customize the HTML around fmTuner tracks? =

Absolutely. While the customizable Display Format and fmTuner Tags are used for each track, you can place any additional HTML around the `<?php if(function_exists('fmtuner')) { fmtuner(); } ?>` call.

= How many tracks can I display? =

The number of tracks to be displayed can be set in the fmTuner Settings page in the WordPress administration area.  Between 1 and 10 is recommended, just to keep things looking under control.

== Troubleshooting ==

**Why are no tracks displayed?**

1. Make sure fmTuner is installed and activated by visiting your Manage Plugins page in the WordPress administration area.
1. Ensure your Last.fm username is set in the fmTuner Settings page, as well as any other necessary options (e.g. Recent Tracks instead of Loved Tracks if you have no Loved Tracks).
1. Confirm that `<?php if(function_exists('fmtuner')) { fmtuner(); } ?>` exists somewhere in your current template.
1. Listen to some music and mark some tracks as Loved to make sure you have available tunes.

If all else fails, It's possible that your music is so underground/indie/obscure that Last.fm has no album artwork to display (only when using the `[::image::]` tag).  Try listening to something a _little_ more mainstream ;-)

**Why does the number of tracks displayed not match my setting?**

Occasionally, you may find that the number of displayed tracks does not match the number you set in the fmTuner Settings page.  This is most often attributed to the `[::image::]` fmTuner tag.  Because fmTuner cannot know in advance which tracks don't have images, it will simply "cut out" the ones that don't have artwork, resulting in a reduced set but a better-looking blog.

**Why do I get PHP errors?**

fmTuner needs certain PHP functions to talk to Last.fm and handle responses, and while it takes precautions to avoid blatant errors, it's possible your server doesn't meet the necessary requirements.

1. Ensure your server is running PHP 5 or later.  If using a hosted environment, your provider may be able to do this for you.
1. Set `allow_url_fopen`="On" in your php.ini file, or confirm that the cURL extension is installed.  fmTuner will try one method of fetching track listings, and fall back when required.

== Removal ==

Sorry to see you go!  Here's how to remove fmTuner:

1. Deactivate the plugin through the 'Plugins' menu in WordPress.
1. Delete the `fmtuner` directory from your `/wp-content/plugins/` directory.

Be sure to [get in touch](http://www.command-tab.com/) if there's something that you think would make fmTuner better!

== Screenshots ==

1. fmTuner Settings interface in WordPress 2.7.1.
1. One of many possible display options. You are free to configure fmTuner how you prefer!