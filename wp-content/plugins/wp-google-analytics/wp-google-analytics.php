<?php
/**
 * Plugin Name: WP Google Analytics
 * Plugin URI: http://xavisys.com/wordpress-google-analytics-plugin/
 * Description: Lets you use <a href="http://analytics.google.com">Google Analytics</a> to track your WordPress site statistics
 * Version: 1.2.3
 * Author: Aaron D. Campbell
 * Author URI: http://xavisys.com/
 */

define('WGA_VERSION', '1.2.3');
/**
 * Changelog:
 * 06/11/2008: 1.2.3
 * 	- Changed & to &amp; to fix validation problems.
 *
 * 06/11/2008: 1.2.2
 * 	- Fixed problem with code affecting Admin Javascript such as the TinyMCE editor
 *
 * 06/08/2008: 1.2.1
 * 	- Bug fix for the stats gathering
 *
 * 06/08/2008: 1.2.0
 * 	- No longer parses outgoing links in the admin section.
 * 	- Uses get_footer instead of wp_footer.  Too many themes aren't adding the wp_footer call.
 * 	- Options page updated
 * 	- Added optional anonymous statistics collection
 *
 * 04/26/2008: 1.1.0
 *  - Major revamp to work better with the new Google Tracking Code.  It seems that outgoing links weren't being tracked properly.
 *
 * 04/17/2008: 1.0.0
 *  - Added to wordpress.org repository
 *
 * 07/03/2007: 0.2
 *  - Fixed problem with themes that do not call wp_footer().  If you are reading this and you are a theme developer, USE THE HOOKS!  That's what they're there for!
 *  - Updated how the admin section is handled
 *
 * 02/21/2007: 0.1
 *  - Original Version
 */

/*  Copyright 2006  Aaron D. Campbell  (email : wp_plugins@xavisys.com)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
*/

//If this is set to true, extra info will be dumped to the browser.
//ONLY do this if you really need it
define('WGA_DEBUG', false);

/**
 * wpGoogleAnalytics is the class that handles ALL of the plugin functionality.
 * It helps us avoid name collisions
 * http://codex.wordpress.org/Writing_a_Plugin#Avoiding_Function_Name_Collisions
 */
class wpGoogleAnalytics {

	/**
	 * This adds the options page for this plugin to the Options page
	 */
	function admin_menu() {
		add_options_page(__('Google Analytics'), __('Google Analytics'), 'manage_options', str_replace("\\", "/", __FILE__), array('wpGoogleAnalytics', 'options'));
	}

	/**
	 * This is used to display the options page for this plugin
	 */
	function options() {
		/**
		 * @var WP_Roles
		 */
		global $wp_roles;

		//Get our options
		$wga = wpGoogleAnalytics::get_options();
		//Echo debug info if needed
		if (WGA_DEBUG) {
			echo '<pre>',var_dump($wga),'</pre>';
		}
		//We will fill $roles with checkboxes to ignore each role
		$roles = '';
		foreach ($wp_roles->roles as $role=>$role_info) {
			$checked = (isset($role_info['capabilities']['wga_no_track']) && $role_info['capabilities']['wga_no_track'])? ' checked="checked"':'';
			$role_info['name'] .= (strtolower(substr($role_info['name'], -1)) != 's')? 's':'';
			$roles .= "					<label for='wga_role_{$role}'><input type='checkbox' name='wga-roles[{$role}]' value='true' id='wga_role_{$role}'{$checked} /> ".__("Do not log {$role_info['name']} when logged in")."</label><br />";
		}
?>
		<div class="wrap">
			<h2><?php _e('Google Analytics Options') ?></h2>
			<form action="options.php" method="post" id="wp_google_analytics">
				<?php wp_nonce_field('update-options'); ?>
				<p>Google Maps for WordPress will allow you to easily add maps to your posts or pages.</p>
				<table class="form-table">
					<tr valign="top">
						<th scope="row">
							<label for="wga_code"><?php _e('Paste your <a href="http://analytics.google.com">Google Analytics</a> code into the textarea:'); ?></label>
						</th>
						<td>
							<textarea name="wga[code]" id="wga_code" style="width:95%;" rows="10"><?php echo htmlentities($wga['code']); ?></textarea>
						</td>
					</tr>
					<tr valign="top">
						<th scope="row">
							<a title="<?php _e('Click for Help!'); ?>" href="#" onclick="jQuery('#wga_user_agreed_to_send_system_information_help').toggle(); return false;">
								<?php _e('System Information:') ?>
							</a>
						</th>
						<td>
							<label for="wga_user_agreed_to_send_system_information"><input type="checkbox" name="wga[user_agreed_to_send_system_information]" value="true" id="wga_user_agreed_to_send_system_information"<?php checked('true', $wga['user_agreed_to_send_system_information']); ?> /> <?php _e('I agree to send anonymous system information'); ?></label><br />
							<small id="wga_user_agreed_to_send_system_information_help" style="display:none;">
								<?php _e('You can help by sending anonymous system information that will help Xavisys make better decisions about new features.'); ?><br />
								<?php _e('The information will be sent anonymously, but a unique identifier will be sent to prevent duplicate entries from the same installation.'); ?>
							</small>
						</td>
					</tr>
					<tr valign="top">
						<th scope="row">
							<?php _e('Additional items to log:') ?>
						</th>
						<td>
							<label for="wga_log_404s"><input type="checkbox" name="wga[log_404s]" value="true" id="wga_log_404s"<?php checked('true', $wga['log_404s']); ?> /> <?php _e('Log 404 errors as /404/{url}?referrer={referrer}'); ?></label><br />
							<label for="wga_log_searches"><input type="checkbox" name="wga[log_searches]" value="true" id="wga_log_searches"<?php checked('true', $wga['log_searches']); ?> /> <?php _e('Log searches as /search/{search}?referrer={referrer}'); ?></label><br />
							<label for="wga_log_outgoing"><input type="checkbox" name="wga[log_outgoing]" value="true" id="wga_log_outgoing"<?php checked('true', $wga['log_outgoing']); ?> /> <?php _e('Log outgoing links as /outgoing/{url}?referrer={referrer}'); ?></label><br />
						</td>
					</tr>
					<tr valign="top">
						<th scope="row">
							<?php _e('Visits to ignore:') ?>
						</th>
						<td>
							<label for="wga_ignore_admin_area"><input type="checkbox" name="wga[ignore_admin_area]" value="true" id="wga_ignore_admin_area"<?php checked('true', $wga['ignore_admin_area']); ?> /> <?php _e('Do not log anything in the admin area'); ?></label><br />
<?php echo $roles; ?>
						</td>
					</tr>
				</table>
				<p class="submit">
					<input type="submit" name="Submit" value="<?php _e('Update Options &raquo;'); ?>" />
				</p>
				<input type="hidden" name="action" value="update" />
				<input type="hidden" name="page_options" value="wga,wga-roles" />
			</form>
		</div>
<?php
	}

	/**
	 * Used to generate a tracking URL
	 *
	 * @param array $track - Must have ['data'] and ['code']
	 * @return string - Tracking URL
	 */
	function get_url($track) {
		$site_url = (($_SERVER['HTTPS'] == 'on')? 'https://':'http://').$_SERVER['HTTP_HOST'];
		foreach ($track as $k=>$value) {
			if (strpos(strtolower($value), strtolower($site_url)) === 0) {
				$track[$k] = substr($track[$k], strlen($site_url));
			}
			if ($k == 'data') {
				$track[$k] = preg_replace("/^https?:\/\/|^\/+/i", "", $track[$k]);
			}

			//This way we don't lose search data.
			if ($k == 'data' && $track['code'] == 'search') {
				$track[$k] = urlencode($track[$k]);
			} else {
				$track[$k] = preg_replace("/[^a-z0-9\.\/\+\?=-]+/i", "_", $track[$k]);
			}

			$track[$k] = trim($track[$k], '_');
		}
		$char = (strpos($track['data'], '?') === false)? '?':'&amp;';
		return str_replace("'", "\'", "/{$track['code']}/{$track['data']}{$char}referer={$_SERVER['HTTP_REFERER']}");
	}

	/**
	 * This injects the Google Analytics code into the footer of the page.
	 *
	 * @param bool[optional] $output - defaults to true, false returns but does NOT echo the code
	 */
	function insert_code($output=true) {
		//If $output is not a boolean false, set it to true (default)
		$output = ($output !== false);

		//get our plugin options
		$wga = wpGoogleAnalytics::get_options();
		//If the user's role has wga_no_track set to true, return without inserting code
		if (current_user_can('wga_no_track')) {
			$ret = "<!-- Google Analytics Plugin is set to ignore your user role -->\r\n";
			if ($output) {
				echo $ret;
			}
			return $ret;
		}
		//If the Google Analytics code has been set
		if ($wga['code'] !== false) {
			//Echo debug info if needed
			if (WGA_DEBUG) {
				echo '<pre>',var_dump($wga),'</pre>';
			}

			//If $admin is true (we're in the admin_area), and we've been told to ignore_admin_area, return without inserting code
			if (is_admin() && (!isset($wga['ignore_admin_area']) || $wga['ignore_admin_area'] != 'false')) {
				$ret = "<!-- Your Google Analytics Plugin is set to ignore Admin area -->\r\n";
				if ($output) {
					echo $ret;
				}
				return $ret;
			} elseif (is_404() && (!isset($wga['log_404s']) || $wga['log_404s'] != 'false')) {
				//Set track for 404s, if it's a 404, and we are supposed to
				$track['data'] = $_SERVER['REQUEST_URI'];
				$track['code'] = '404';
			} elseif (is_search() && (!isset($wga['log_searches']) || $wga['log_searches'] != 'false')) {
				//Set track for searches, if it's a search, and we are supposed to
				$track['data'] = $_REQUEST['s'];
				$track['code'] = "search";
			}

			//If we need to generate a special tracking URL
			if (isset($track)) {
				//get the tracking URL
				$track['url'] = wpGoogleAnalytics::get_url($track);

				//adjust the code that we output, account for both types of tracking
				$wga['code'] = str_replace("urchinTracker()","urchinTracker('{$track['url']}')", $wga['code']);
				$wga['code'] = str_replace("pageTracker._trackPageview()","pageTracker._trackPageview('{$track['url']}')", $wga['code']);

				//Echo debug info if needed
				if (WGA_DEBUG) {
					echo '<pre>',var_dump($track, $site_url),'</pre>';
				}
			}
			//output the Google Analytics code
			if ($output) {
				echo $wga['code'];
			}
			return $wga['code'];
		} else {
			//If the Google Analytics code has not been set in admin area, return without inserting code
			$ret = "<!-- You need to set up the Google Analytics Plugin -->\r\n";
			if ($output) {
				echo $ret;
			}
			return $ret;
		}
	}

	/**
	 * Used to get one or all of our plugin options
	 *
	 * @param string[optional] $option - Name of options you want.  Do not use if you want ALL options
	 * @return array of options, or option value
	 */
	function get_options($option = null) {
		$o = get_option('wga');
		if (isset($option)) {
			if (isset($o[$option])) {
				return $o[$option];
			} else {
				return false;
			}
		} else {
			return $o;
		}
	}

	/**
	 * Start our output buffering with a callback, to grab all links
	 *
	 * @todo If there is a good way to tell if this is a feed, add a seperate option for tracking outgoings on feeds
	 */
	function start_ob() {
		$log_outgoing = wpGoogleAnalytics::get_options('log_outgoing');
		// Only start the output buffering if we care, and if it's NOT an XMLRPC REQUEST & NOT a tinyMCE JS file & NOT in the admin section
		if (($log_outgoing == 'true' || $log_outgoing === false) && (!defined('XMLRPC_REQUEST') || !XMLRPC_REQUEST) && !is_admin() && stripos($_SERVER['REQUEST_URI'], 'wp-includes/js/tinymce') === false) {
			ob_start(array('wpGoogleAnalytics', 'get_links'));
		}
	}

	/**
	 * Grab all links on the page.  If the code hasn't been inserted, we want to
	 * insert it just before the </body> tag
	 *
	 * @param string $b - buffer contents
	 * @return string - modified buffer contents
	 */
	function get_links($b) {
		$b = preg_replace_callback("/
			<\s*a							# anchor tag
				(?:\s[^>]*)?		# other attibutes that we don't need
				\s*href\s*=\s*	# href (required)
				(?:
					\"([^\"]*)\"	# double quoted link
				|
					'([^']*)'			# single quoted link
				|
					([^'\"\s]*)		# unquoted link
				)
				(?:\s[^>]*)?		# other attibutes that we don't need
				\s*>						#end of anchor tag
			/isUx", array('wpGoogleAnalytics', 'handle_link'), $b);
		return $b;
	}

	/**
	 * If a link is outgoing, add an onclick that runs some Google JS with a
	 * generated URL
	 *
	 * @param array $m - A match from the preg_replace_callback in self::get_links
	 * @return string - modified andchor tag
	 */
	function handle_link($m) {
		$code = wpGoogleAnalytics::get_options('code');
		//get our site url...used to see if the link is outgoing.  We can't use the wordpress setting, because wordpress might not be running at the document root.
		$site_url = (($_SERVER['HTTPS'] == 'on')? 'https://':'http://').$_SERVER['HTTP_HOST'];
		$link = array_pop($m);
		//If the link is outgoing, we modify $m[0] (the anchor tag)
		if (preg_match("/^https?:\/\//i", $link) && (strpos(strtolower($link), strtolower($site_url)) !== 0 )) {
			//get our custom link
			$track['data'] = $link;
			$track['code'] = 'outgoing';
			$track['url'] = wpGoogleAnalytics::get_url($track);

			// Check which version of the code the user is using, and user proper function
			$function = (strpos($code, 'ga.js') !== false)? 'pageTracker._trackPageview': 'urchinTracker';
			$onclick = "{$function}('{$track['url']}');";

			//If there is already an onclick, add to the beginning of it (adding to the end will not work, because too many people leave off the ; from the last statement)
			if (preg_match("/onclick\s*=\s*(['\"])/iUx",$m[0],$match)) {
				//If the onclick uses single quotes, we use double...and vice versa
				if ($match[1] == "'" ) {
					$onclick = str_replace("'", '"', $onclick);
				}
				$m[0] = str_replace($match[0], $match[0].$onclick, $m[0]);
			} else {
				$m[0] = str_replace('>', " onclick=\"{$onclick}\">", $m[0]);
			}
		}
		//return the anchor tag (modified or not)
		return $m[0];
	}

	function updateOption($oldValue, $newValue) {
		/**
		 * @var WP_Roles
		 */
		global $wp_roles;

		//Add/remove wga_no_track capability for each role
		foreach ($wp_roles->roles as $role=>$role_info) {
			if (isset($newValue[$role]) && $newValue[$role] == 'true') {
				$wp_roles->add_cap($role, 'wga_no_track', true);
			} else {
				$wp_roles->add_cap($role, 'wga_no_track', false);
			}
		}
	}

	function activatePlugin() {
		// If the wga-id has not been generated, generate one and store it.
		$o = get_option('wga');
		$wgaId = wpGoogleAnalytics::get_wgaId();
		if (!isset($o['user_agreed_to_send_system_information'])) {
			$o['user_agreed_to_send_system_information'] = 'true';
			update_option('wga', $o);
		}
	}

	function get_wgaId() {
		$wgaId = get_option('wga-id');
		if ($wgaId === false) {
			$wgaId = sha1( get_bloginfo('url') . mt_rand() );
			update_option('wga-id', $wgaId);
		}
		return $wgaId;
	}
	/**
	 * if user agrees to send system information and the last sent info is outdated outputs a bunch of stuff that sends sysinfo without interrupting
	 */
	function outputSendInfoForm()
	{
		$o = get_option('wga');
		if ($o['user_agreed_to_send_system_information'] == 'true') {
			$lastSent = get_option('wga-sysinfo');
            $sysinfo = wpGoogleAnalytics::get_sysinfo();
            if (serialize($lastSent) != serialize($sysinfo)) {
?>
	        	<iframe id="hidden_frame" name="hidden_frame" style="width:0px; height:0px; border: 0px" src="about:blank"></iframe>
		        <form id="wga_send_info_form" target="hidden_frame" method="post" action="http://xavisys.com/plugin-info.php">
		            <?php
		                foreach($sysinfo as $k=>$v)
		                {
		                    ?>
		                        <input type="hidden" name="<?php echo attribute_escape($k); ?>" value="<?php echo attribute_escape($v);?>"></input>
		                    <?php
		                }
		            ?>
		        </form>
		        <script type='text/javascript'>
		        jQuery('#wga_send_info_form').submit();
		        </script>
<?php
				update_option('wga-sysinfo', $sysinfo);
            }
	    }
	}
	function get_sysinfo()
	{
		global $wpdb;
		$s = array();
		$s['plugin'] = 'WP Google Analytics';
		$s['id'] = wpGoogleAnalytics::get_wgaId();
		$s['version'] = WGA_VERSION;

		$s['php_version'] = phpversion();
		$s['mysql_version'] = @mysql_get_server_info($wpdb->dbh);
		$s['server_software'] = $_SERVER["SERVER_SOFTWARE"];
		$s['memory_limit'] = ini_get('memory_limit');

		return $s;
	}

}

/**
 * Add the necessary hooks
 */
add_action('admin_menu', array('wpGoogleAnalytics','admin_menu'));
add_action('get_footer', array('wpGoogleAnalytics', 'insert_code'));
add_action('init', array('wpGoogleAnalytics', 'start_ob'));
add_action('update_option_wga-roles', array('wpGoogleAnalytics', 'updateOption'), null, 2);
add_action('activate_wp-google-analytics/wp-google-analytics.php', array('wpGoogleAnalytics', 'activatePlugin'));
add_action('admin_footer', array('wpGoogleAnalytics', 'outputSendInfoForm'));
?>