<?php
/*
Plugin Name: WP-PluginsUsed
Plugin URI: http://lesterchan.net/portfolio/programming/php/
Description: Display WordPress plugins that you currently have (both active and inactive) onto a post/page.
Version: 1.50
Author: Lester 'GaMerZ' Chan
Author URI: http://lesterchan.net
*/


/*  
	Copyright 2009  Lester Chan  (email : lesterchan@gmail.com)

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


### Define: Show Plugin Version Number?
define('PLUGINSUSED_SHOW_VERSION', true);


### Variable: Plugins To Hide?
$pluginsused_hidden_plugins = array();


### Create Text Domain For Translations
add_action('init', 'pluginsused_textdomain');
function pluginsused_textdomain() {
	load_plugin_textdomain('wp-pluginsused', false, 'wp-pluginsused');
}


### Function: WordPress Get Plugin Data
function get_pluginsused_data($plugin_file) {
	$plugin_data = implode('', file($plugin_file));
	preg_match("|Plugin Name:(.*)|i", $plugin_data, $plugin_name);
	preg_match("|Plugin URI:(.*)|i", $plugin_data, $plugin_uri);
	preg_match("|Description:(.*)|i", $plugin_data, $description);
	preg_match("|Author:(.*)|i", $plugin_data, $author_name);
	preg_match("|Author URI:(.*)|i", $plugin_data, $author_uri);
	if (preg_match("|Version:(.*)|i", $plugin_data, $version)) {
		$version = trim($version[1]);
	} else {
		$version = '';
	}
	$plugin_name = trim($plugin_name[1]);
	$plugin_uri = trim($plugin_uri[1]);
	$description = wptexturize(trim($description[1]));
	$author = trim($author_name[1]);
	$author_uri = trim($author_uri[1]);
	return array('Plugin_Name' => $plugin_name, 'Plugin_URI' => $plugin_uri, 'Description' => $description, 'Author' => $author, 'Author_URI' => $author_uri, 'Version' => $version);
}


### Function: WordPress Get Plugins
function get_pluginsused() {
	global $wp_plugins;
	if (isset($wp_plugins)) {
		return $wp_plugins;
	}
	$wp_plugins = array();
	$plugin_root = WP_PLUGIN_DIR;
	$plugins_dir = @ dir($plugin_root);
	if($plugins_dir) {
		while(($file = $plugins_dir->read()) !== false) {
			if (substr($file, 0, 1) == '.') {
				continue;
			}
			if (is_dir($plugin_root.'/'.$file)) {
				$plugins_subdir = @ dir($plugin_root.'/'.$file);
				if ($plugins_subdir) {
					while (($subfile = $plugins_subdir->read()) !== false) {
						if (substr($subfile, 0, 1) == '.') {
							continue;
						}
						if (substr($subfile, -4) == '.php') {
							$plugin_files[] = "$file/$subfile";
						}
					}
				}
			} else {
				if (substr($file, -4) == '.php') {
					$plugin_files[] = $file;
				}
			}
		}
	}
	if (!$plugins_dir || !$plugin_files) {
		return $wp_plugins;
	}
	foreach ($plugin_files as $plugin_file) {
		if (!is_readable("$plugin_root/$plugin_file")) {
			continue;
		}
		$plugin_data = get_pluginsused_data("$plugin_root/$plugin_file");
		if (empty($plugin_data['Plugin_Name'])) {
			continue;
		}
		$wp_plugins[plugin_basename($plugin_file)] = $plugin_data;
	}
	uasort($wp_plugins, create_function('$a, $b', 'return strnatcasecmp($a["Plugin_Name"], $b["Plugin_Name"]);'));
	return $wp_plugins;
}


### Function: Process Plugins Used
function process_pluginsused() {
	global $plugins_used, $pluginsused_hidden_plugins;
	if(empty($plugins_used)) {
		$plugins_used = array();
		$active_plugins = get_option('active_plugins');
		$plugins = get_pluginsused();
		$plugins_allowedtags = array('a' => array('href' => array(),'title' => array()),'abbr' => array('title' => array()),'acronym' => array('title' => array()),'code' => array(),'em' => array(),'strong' => array());
		foreach($plugins as $plugin_file => $plugin_data) {
			if(!in_array($plugin_data['Plugin_Name'], $pluginsused_hidden_plugins)) {
				$plugin_data['Plugin_Name'] = wp_kses($plugin_data['Plugin_Name'], $plugins_allowedtags);
				$plugin_data['Plugin_URI'] = wp_kses($plugin_data['Plugin_URI'], $plugins_allowedtags);
				$plugin_data['Description'] = wp_kses($plugin_data['Description'], $plugins_allowedtags);
				$plugin_data['Author'] = wp_kses($plugin_data['Author'], $plugins_allowedtags);
				$plugin_data['Author_URI'] = wp_kses($plugin_data['Author_URI'], $plugins_allowedtags);
				if(PLUGINSUSED_SHOW_VERSION) {
					$plugin_data['Version'] = wp_kses($plugin_data['Version'], $plugins_allowedtags);
				} else {
					$plugin_data['Version'] = '';
				}
				if (!empty($active_plugins) && in_array($plugin_file, $active_plugins)) {
					$plugins_used['active'][] = $plugin_data;
				} else {
					$plugins_used['inactive'][] = $plugin_data;
				}
			}
		}
	}
}


### Function: Display Plugins
function display_pluginsused($type, $display = false) {
	global $plugins_used;
	$temp = '';
	if(empty($plugins_used)) {
		process_pluginsused();
	}
	if($type == 'stats') {
		$total_active_pluginsused = sizeof($plugins_used['active']);
		$total_inactive_pluginsused = sizeof($plugins_used['inactive']);
		$total_pluginsused = ($total_active_pluginsused+$total_inactive_pluginsused);
		$temp = sprintf(_n('There is <strong>%s</strong> plugin used:', 'There are <strong>%s</strong> plugins used:', $total_pluginsused, 'wp-pluginsused'), number_format_i18n($total_pluginsused)).' '.sprintf(_n('<strong>%s active plugin</strong>','<strong>%s active plugins</strong>', $total_active_pluginsused, 'wp-pluginsused'), number_format_i18n($total_active_pluginsused)).' '.__('and', 'wp-pluginsused').' '.sprintf(_n('<strong>%s inactive plugin</strong>.', '<strong>%s inactive plugins</strong>.', $total_inactive_pluginsused, 'wp-pluginsused'), number_format_i18n($total_inactive_pluginsused));
	} else if($type == 'active') {
		if($plugins_used['active']) {
			foreach($plugins_used['active'] as $active_plugins) {
				$active_plugins['Plugin_Name'] = strip_tags($active_plugins['Plugin_Name']);
				$active_plugins['Plugin_URI'] = strip_tags($active_plugins['Plugin_URI']);
				$active_plugins['Description'] = strip_tags($active_plugins['Description']);
				$active_plugins['Version'] = strip_tags($active_plugins['Version']);
				$active_plugins['Author'] = strip_tags($active_plugins['Author']);
				$active_plugins['Author_URI'] = strip_tags($active_plugins['Author_URI']);
				$active_plugins['Version'] = strip_tags($active_plugins['Version']);
				$temp .= '<p><img src="'.plugins_url('wp-pluginsused/images/plugin_active.gif').'" alt="'.$active_plugins['Plugin_Name'].' '.$active_plugins['Version'].'" title="'.$active_plugins['Plugin_Name'].' '.$active_plugins['Version'].'" style="vertical-align: middle;" />&nbsp;&nbsp;<strong><a href="'.$active_plugins['Plugin_URI'].'" title="'.$active_plugins['Plugin_Name'].' '.$active_plugins['Version'].'">'.$active_plugins['Plugin_Name'].' '.$active_plugins['Version'].'</a></strong><br /><strong>&raquo; '.$active_plugins['Author'].' (<a href="'.$active_plugins['Author_URI'].'" title="'.$active_plugins['Author'].'">'.__('url', 'wp-pluginsused').'</a>)</strong><br />'.$active_plugins['Description'].'</p>';
			}
		}
	} else{
		if($plugins_used['inactive']) {
			foreach($plugins_used['inactive'] as $inactive_plugins) {
				$inactive_plugins['Plugin_Name'] = strip_tags($inactive_plugins['Plugin_Name']);
				$inactive_plugins['Plugin_URI'] = strip_tags($inactive_plugins['Plugin_URI']);
				$inactive_plugins['Description'] = strip_tags($inactive_plugins['Description']);
				$inactive_plugins['Version'] = strip_tags($inactive_plugins['Version']);
				$inactive_plugins['Author'] = strip_tags($inactive_plugins['Author']);
				$inactive_plugins['Author_URI'] = strip_tags($inactive_plugins['Author_URI']);
				$inactive_plugins['Version'] = strip_tags($inactive_plugins['Version']);
				$temp .= '<p><img src="'.plugins_url('wp-pluginsused/images/plugin_inactive.gif').'" alt="'.$inactive_plugins['Plugin_Name'].' '.$inactive_plugins['Version'].'" title="'.$inactive_plugins['Plugin_Name'].' '.$inactive_plugins['Version'].'" style="vertical-align: middle;" />&nbsp;&nbsp;<strong><a href="'.$inactive_plugins['Plugin_URI'].'" title="'.$inactive_plugins['Plugin_Name'].' '.$inactive_plugins['Version'].'">'.$inactive_plugins['Plugin_Name'].' '.$inactive_plugins['Version'].'</a></strong><br /><strong>&raquo; '.$inactive_plugins['Author'].' (<a href="'.$inactive_plugins['Author_URI'].'" title="'.$inactive_plugins['Author'].'">'.__('url', 'wp-pluginsused').'</a>)</strong><br />'.$inactive_plugins['Description'].'</p>';
			}
		}
	}
	if($display) {
		echo $temp;
	} else {
		return $temp;
	}
}


### Function: Short Code For Inserting Plugins Used Into Page
add_shortcode('stats_pluginsused', 'pluginsused_stats_shortcode');
add_shortcode('active_pluginsused', 'pluginsused_active_shortcode');
add_shortcode('inactive_pluginsused', 'pluginsused_inactive_shortcode');
function pluginsused_stats_shortcode($atts) {
	return display_pluginsused('stats');
}
function pluginsused_active_shortcode($atts) {
	return display_pluginsused('active');
}
function pluginsused_inactive_shortcode($atts) {
	return display_pluginsused('inactive');
}
?>