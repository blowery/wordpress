=== Plugin Name ===
Contributors: ruperdupe
Tags: time, since, post, date
Requires at least: 2.1
Tested up to: 2.1
Stable tag: trunk

Displays the time since a particular post or page was written.

== Description ==

A plugin for displaying the time since a particular post or page was written.

*Example Output:* 1 day, 20 hours ago.

= License =
Released under the GNU General Public License.

== Installation ==

Installation takes no time at all, if this is the first plugin you've installed then be sure to read the instructions below: 

1. Download the plugin.
1. Upload wp_time_since.php to the WordPress plugin directory.
1. Activate the plugin.
1. Read the section on usage.

== Usage ==

If your local time is the same as your server’s time insert this code within ‘the post/page loop’: `<?php wp_time_since(); ?>`

If your local time differs from your servers time then read on. The first thing you’ll need to do is find the difference in hours between the server and you.

*Example 1:* Server time = 15:00 Your time = 16:00 Difference = 1

*Example 2:* Server time = 16:00 Your time = 15:00 Difference = -1

*Example 3:* Server time = 15:00 Your time = 15:00 Difference = 0

Code to find the server time: `<?php echo time(); ?>`

Then you put the difference between the two brackets in the code:

*Example 1 Code:* `<?php wp_time_since(1); ?>`

*Example 2 Code:* `<?php wp_time_since(-1); ?>`

*Example 3 Code:* `<?php wp_time_since(); ?>`

= Modifications =

You can modify the plugin to suit your own needs by clicking on edit next to the plugin’s name in your plugin management section. You’ll notice that there are a set of parameters at the top of the page which you can modify for your own needs. If you need help then leave a comment on my site and I’ll see what I can do.