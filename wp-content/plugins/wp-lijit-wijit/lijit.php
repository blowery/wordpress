<?php
/*
Plugin Name: Lijit Search
Plugin URI: http://www.lijit.com
Description: Search Powered Web Applications for Publishers. <a href="options-general.php?page=lijit.php">Click here to configure the Lijit Plugin</a>.
Version: 1.04
Author: Crowd Favorite and Lijit Networks Inc.
Author URI: http://crowdfavorite.com
*/

	/**
	 * Copyright (c) 2008 Lijit Networks, Inc. All rights reserved.
	 *
	 * Released under the GPL license
	 * http://www.opensource.org/licenses/gpl-2.0.php
	 *
	 * **********************************************************************
	 * This program is distributed in the hope that it will be useful, but
	 * WITHOUT ANY WARRANTY; without even the implied warranty of
	 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
	 * **********************************************************************
	 */

	$lijit_plugin_version = '1.04';
	
	function lijit_request_handler() {
		if(cflj_is_configured()) {
			if(get_option('lijit_search_type') == 'wijit') { 
				// register sidebar wijit
				if(!function_exists('register_sidebar_widget')) { return; }
				register_sidebar_widget('Lijit Search','lijit_std_widget');
				register_widget_control('Lijit Search','lijit_widget_control');
			}
		
			// search results hijack
			if(isset($_GET['s']) && get_option('lijit_search_type') != 'wijit' && !(is_admin()) ) { 
				add_action('pre_get_posts','cflj_clear_query_params');
			}
		}
		
		if(isset($_GET['lijit_updated'])) {
			add_action('admin_notices', 'lijit_updated_notice');
		}
		
		// get handler
		if(isset($_GET['lj_action']) && !empty($_GET['lj_action'])) {
			switch($_GET['lj_action']) {
				
				case 'lj_js_page':
					cflj_send_header('js');
					echo lijit_page_javascript($query);
					exit(); break;					
						
				case 'lj_js_std':
					cflj_send_header('js');
					echo lijit_std_javascript();
					exit(); break;
						
				case 'lj_js_admin':
					// javascript for admin page load
					cflj_send_header('js');
					echo lijit_admin_javascript();
					exit(); break;
					
				case 'lj_css_page':
					// common css
					cflj_send_header('css');
					echo lijit_page_css();
					exit(); break;
					
				case 'lj_css_admin':
					// admin css
					cflj_send_header('css');
					echo lijit_admin_css();
					exit(); break;
					
				case 'lj_check_username':
					lijit_check_valid_user();
					exit(); break;					
			}
		}
		
		// Another GET handler
		if(isset($_GET['update_failed'])) {
			add_action('admin_head','cflj_username_failed');
		}
		
		// post handler
		if(isset($_POST['lj_action']) && !empty($_POST['lj_action'])) {
			switch($_POST['lj_action']) {
				
				case 'lijit_update_settings':
					cflj_update_settings();
					break;
					
				case 'lijit_register_username':
					// registration successful via Lijit API log username
					cflj_log_username(isset($_POST['lj_aj_request']));
					break;
			}
		}
	}
	add_action('init','lijit_request_handler');

	/**
	 * Show an options-updated message
	 * warn the user if wp-cache was detected
	 * @TODO detect wp-super-cache
	 */
	function lijit_updated_notice() {
		global $file_prefix;
		echo '<div class="updated fade-ff0000">'.
			 '<p>Settings Updated</p>';
		if(isset($file_prefix) && function_exists('wp_cache_clean_cache')) {
			echo '<p><b>WP-Cache was detected.</b> If WP-Cache is enabled please clear your cache to ensure proper application of the updated settings</p>';
		}
		echo '</div>';
	}

	/**
	 * See if the plugin has been fully configured or not
	 */
	function cflj_is_configured() {
		return (get_option('lijit_username') != false && get_option('lijit_username_validated') != false && get_option('lijit_search_type') != false);
	}

	/**
	 * Since we want to override the built in wordpress search we
	 * kill all query params in the wp_db object so it doesn't 
	 * build search params into the posts query
	 */
	function cflj_clear_query_params($wp_query) {
		if(isset($wp_query->query_vars['s'])) { unset($wp_query->query_vars['s']); }
		if(isset($wp_query->query['s'])) { unset($wp_query->query['s']); }
		$wp_query->is_search = false;
	}

	/**
	 * log username from REST/AJAX call or straight form post
	 * setting username via Ajax means we're a registration and username is already valid
	 * if setting as a returning user then always force a recheck of the username 
	 * @var bool $ajax - wether we're running from an Ajax call or not
	 */
	function cflj_log_username($ajax) {
		if(isset($_POST['lijit_username']) && $_POST['lijit_username'] != '') {
			if($ajax) {
				if(update_option('lijit_username',$_POST['lijit_username']) !== false) { 
					update_option('lijit_username_validated','1'); // since this is a registration with Lijit, we're valid
					echo '{"success":true}';
					exit();
				}
			}
			else { 
				// do username validity check
				// don't redirect on fail so we still have post vars
				if(lijit_check_valid_user($_POST['lijit_username'])) {
					update_option('lijit_username',$_POST['lijit_username']); 
					update_option('lijit_username_validated','1'); 
					wp_redirect(get_bloginfo('wpurl').'/wp-admin/options-general.php?page='.basename(__FILE__)); 
				}
			}
		}
		if($ajax) { 
			echo '{"success":false}'; 
			exit();
		}
	}

	/**
	 * make sure we have an is_admin function
	 * @author Alex King
	 */ 
	if (!function_exists('is_admin_page')) {
		function is_admin_page() {
			if (function_exists('is_admin')) {
				return is_admin();
			}
			if (function_exists('check_admin_referer')) {
				return true;
			}
			else {
				return false;
			}
		}
	}
	
	/**
	 * add prep items to admin page load
	 */
	if(is_admin_page()) {
		function lijit_admin_head() {
			echo cflj_get_head_scripts(array('lj_js_admin')).
				 cflj_get_head_styles(array('lj_css_admin'));
		}
		add_action('admin_head','lijit_admin_head');
	}
	
	/**
	 * if hijacking add prep items to common page load
	 * Hijack requires a complete lijit wijit to be loaded and hidden
	 * so all the requisite functions are available
	 * Only runs if plugin is fully configured
	 */
	if(!is_admin_page() && cflj_is_configured()) {
		function lijit_page_head() {
			// handle hijack and $_GET['s']
			$hijack = (get_option('lijit_search_type') == 'hijack');
			if($hijack || isset($_GET['s'])) {
				echo PHP_EOL.cflj_get_head_scripts(array('lj_js_page'));
			}
			if($hijack) { 
				echo PHP_EOL.cflj_get_head_styles(array('lj_css_page'));
				lijit_std_widget(array('wijit'=>false)); 
			}
		}
		add_action('wp_head','lijit_page_head');
	}
	
	/**
	 * write script head items from array
	 */
	function cflj_get_head_scripts($scripts) {
		global $lijit_plugin_version;
		if(!is_array($scripts)) { return false; }
		$ret = '';
		foreach($scripts as $script) {
			$ret .= '<script type="text/javascript" src="'.
					get_bloginfo('wpurl').'/index.php?lj_action='.$script.'&ver='.$lijit_plugin_version.'"></script>'.
					PHP_EOL;
		}
		return $ret;
	}
	
	/**
	 * write css head items from array
	 */
	function cflj_get_head_styles($styles) {
		global $lijit_plugin_version;
		if(!is_array($styles)) { return false; }
		$ret = '';
		foreach($styles as $style) {
			 $ret .= '<link rel="stylesheet" type="text/css" href="'.
					 get_bloginfo('wpurl').'/index.php?wp-css&lj_action='.$style.'&ver='.$lijit_plugin_version.'" />'.
					 PHP_EOL;
		}
		return $ret;
	}
	
	/**
	 * send http headers
	 */
	function cflj_send_header($type=false) {
		if(!$type) { return false; }
		
		$ct = false;
		switch($type) {
			case 'javascript':
			case 'js':
				$ct = 'text/javascript';
				break; 
			case 'css':
				$ct = 'text/css';
				break;
			case 'html':
				$ct = 'text/html';
				break;
			case 'json': 
				$ct = 'application/json';
				break;		
			case 'text':
			default:
				$ct = 'text/plain';
		}
		
		if(!$ct) { return false; }
		else { 
			header('Content-type: '.$ct);
			//header('Cache-Control: max-age:172800, public, must-revalidate');
			return true;
		}
	}

	/**
	 * send page CSS
	 */
	function lijit_page_css() {
		echo '#lwp_main{display:none;}#lwpnet_main{display:none;}#lwp_wijit_container{display:none;}';
	}
	
	/**
	 * send Admin CSS
	 * PHP5 optimal, PHP4 compatible
	 */
	function lijit_admin_css() {
		// use the faster way, if available
		$filepath = ABSPATH.'wp-content/plugins/wp-lijit-wijit/lijit_admin_css.css';
		if(function_exists('file_get_contents')) {
			echo file_get_contents($filepath);
		}
		else {
			$h = fopen($filepath,'r');
			$contents = fread($h,filesize($filepath));
			fclose($h);
			echo $contents;
		}
	}
	
	/**
	 * send hijack javascript
	 */
	function lijit_page_javascript($query=false) {
		if(get_option('lijit_search_type') == 'hijack') {
			echo "// attach event listener for hijack
if(window.addEventListener) { window.addEventListener('load', lwp_hijack_search, false); }
else { window.attachEvent('onload', lwp_hijack_search); }
// Prep WP search form for Lijit functionality
function lwp_hijack_search() {
	if(document.getElementById('searchform')) {
		var inputText = document.getElementById('s');
		if (!inputText){var inputText = document.getElementById('search');};
		inputText.value = 'Lijit Search';
		inputText.onfocus = function(){if (inputText.value = 'Lijit Search'){inputText.value = '';}};
		document.getElementById('searchform').onsubmit = lwp_hijack_submit;
	}
}
// do the search
function lwp_hijack_submit(e) {
  if (self.lwp_dosearch)
  {
    lwp_dosearch(document.getElementById('s').value);
    return false;
    }
  else
  {
    lwpnet_dosearch(document.getElementById('s').value);
    return false;
  }
}
				";
		}
		// if we're on a search results page then initiate a search
		#if($query !== false && get_option('lijit_search_type') != 'wijit') { lijit_results_page_javascript($query); }
	}
	
	/**
	 * javascript for displaying search results on landing page...
	 */
/*	function lijit_results_page_javascript($query) {
		echo "// extend the string prototype to return get vars
String.prototype.getUrlHash = function(p){
	if(this.indexOf(p+'=') != -1) {
  		return(this.match(new RegExp(\"[?|&]?\" + p + \"=([^&]*)\"))[1]);
	}
	else { return null; }
}

var lwp_detect_s = window.location.search.getUrlHash('s');
if(window.addEventListener) { window.addEventListener('load', lijit_in_page_results, false); }
else { window.attachEvent('onload', lijit_in_page_results); }

function lijit_in_page_results() {
	if(lwp_detect_s != null && lwp_detect_s != 'undefined') {
		lwp_dosearch(lwp_detect_s);
	}
}
		";
	}
*/	
	/**
	 * add title form control to standard lijit widget
	 */
	function lijit_widget_control() {
        // Get options
        $options = get_option('widget_Lijit');
        // options exist? if not set defaults
        if ( !is_array($options) ){
            $options = array('title'=>'Lijit Search');
		}
        // form posted?
        if ( $_POST['Lijit-widget-submit'] ) {
            $options['title'] = strip_tags(stripslashes($_POST['Lijit-widget-title']));
            update_option('widget_Lijit', $options);
        }
        // Get options for form fields to show
        $title = htmlspecialchars($options['title'], ENT_QUOTES);
        // The form fields
        echo '
			<p style="text-align:right;">
            <label for="Lijit-widget-title">' . __('Title:') . '
			</label>
            <input style="width: 200px;" id="Lijit-widget-title" name="Lijit-widget-title" type="text" value="'.$title.'" />
			</p>';            
        echo '<input type="hidden" id="Lijit-widget-submit" name="Lijit-widget-submit" value="1" />';
    }
	
	/**
	 * echo std wijit javascript
	 * @var bool $wijit - if its a wijit we need all surrounding aspects, otherwise just the JS please
	 */
	function lijit_std_widget($args) {
		extract($args);
		if(!isset($wijit)) { $wijit = true;$options = get_option('widget_Lijit');$title = htmlspecialchars($options['title'], ENT_QUOTES); }
		if($wijit) { echo $before_widget.$before_title.$title.$after_title; }
		echo '<script type="text/javascript" src="http://www.lijit.com/informers/wijits?uri=http%3A%2F%2Fwww.lijit.com%2Fusers%2F'.
			 get_option('lijit_username').'&amp;js=1"></script>';
		if($wijit) {
			echo '<a style="color: #999" href="http://www.lijit.com" id="lijit_wijit_pvs_link">Lijit Search</a>'.
			     $after_widget;
		}
	}
	
	/**
	 * Send Admin Page JavaScript
	 */
	function lijit_admin_javascript() {
		echo "			
// quick function to toggle the display of widget raw code
function show_widget_code(type) {
	jQuery('#'+type).slideToggle('normal');
}

// set blog registration value
var tgt = false;
function toggle_this_one(obj) {
	if(!tgt) { tgt = document.getElementById('lijit_blog_url'); }
	if(obj.checked) {
		tgt.oldValue = tgt.value;
		tgt.value = obj.value;
	}
	else {
		if(tgt.oldValue) { tgt.value = tgt.oldValue; }
		else { tgt.value = ''; }
	}
}

// try remote registration through lijit API
function lijit_register_callback(lijitStatus){
	if(lijitStatus.success) {
		// log username locally
		jQuery.post('".get_bloginfo('wpurl')."/wp-admin/options-general.php?page=".basename(__FILE__)."',
					{'lijit_username':document.getElementById('lijit_username').value,'lj_action':'lijit_register_username','lj_aj_request':1},
					function(ret){
							if(!ret.success) { alert('An error occured while saving your usernmae to WordPress'); }
						},
					'json');
		jQuery('#lijit_register').hide();
		jQuery('#lijit_register_results').removeClass('ljnotice').html('<p><b>Registration Successful</b></p>'+ 
																	   '<p><a href=\"".get_bloginfo('wpurl')."/wp-admin/options-general.php?page=".
																	    basename(__FILE__)."\">Click here</a> after'+
																	   ' registration to complete your blog setup.</p>'+
																	   '<iframe id=\"lijit_registration\" src=\"'+lijitStatus.url+'\" scrolling=\"auto\"/>').insertAfter('#lijit_select_user_type');
	}
	else {
		jQuery('#lijit_register_results').addClass('ljnotice').html('<p><b>Registration Failed</b>: ' + lijitStatus.message + '</p>');
	}
}

// prepare info type switching
jQuery('window').ready(function(){
	jQuery('#lijit_user_type_new').click(function(){
			jQuery('#lijit_register').css('display','block');
			jQuery('#lijit_existing').css('display','none');
			return true;
		});
	jQuery('#lijit_user_type_existing').click(function(){
			jQuery('#lijit_existing').css('display','block');
			jQuery('#lijit_register').css('display','none');
			return true;
		});
	// open previously selected radio target
	//jQuery('#lijit_select_user_type input[@type=radio][@checked]').trigger('click');
	jQuery('#lijit_select_user_type input:radio:checked').trigger('click');
	
});
		";
	}

	/**
	 * Add Lijit options page and dashboard page to appropriate menus
	 */
	function lijit_menu_item() {
		if (current_user_can('manage_options')) {
			add_options_page(__('Lijit Options'),__('Lijit'),10,basename(__FILE__),'lijit_options');
			if(get_option('lijit_username') && get_option('lijit_username_validated')) {
				add_submenu_page('index.php',__('Lijit Statistics'),__('Lijit Statistics'),10,'statistics_'.basename(__FILE__),'lijit_statistics');
			}
		}
	}
	add_action('admin_menu', 'lijit_menu_item');

	/**
	 * Show Lijit Statistics Dashboard Pane
	 */
	function lijit_statistics() {
		$username = get_option('lijit_username');	
		echo '	
			<div class="wrap lijit_wrap">
				<h2>'.__('Lijit Statistics').'</h2>
				<p><a href="'.get_bloginfo('wpurl').'/wp-admin/options-general.php?page='.basename(__FILE__).'">Plugin Options</a></p>
				<br />
				<iframe id="lijit_stats" src="http://www.lijit.com/users/'.$username.'/stats" scrolling="auto"></iframe>
			</div>
			';
	}

	/**
	 * validate user input
	 */
	function cflj_update_settings() {
		//global $cfv,$file_prefix;
		global $cfv;
		require_once(ABSPATH.'wp-content/plugins/wp-lijit-wijit/cf_validate.php');
		$cfv = new cf_validate();
		$cfv->cf_update_option('lijit_search_type','Search Type',true);
		if(lijit_check_valid_user($_POST['lijit_username'])) {	
			$cfv->cf_update_text('lijit_username','User Name',true);
		}
		else {
			$cfv->set_error('lijit_username','Invalid Username. Please check your entry and try again.');
		}
		if($cfv->error == false) {
			// detect wp-cache and attempt to clear it
			/*if(isset($file_prefix) && function_exists('wp_cache_clean_cache')) {
				@wp_cache_clean_cache($file_prefix);
			}*/
			// redirect
			wp_redirect(get_bloginfo('wpurl').'/wp-admin/options-general.php?page='.basename(__FILE__).'&lijit_updated=true');
			exit();
		}
	}

	/**
	 * use post values for form display if available
	 */
	function cflj_get_option($key) {
		if(isset($_POST[$key]) && $_POST[$key] != '') { return $_POST[$key]; }
		else { return get_option($key); }
	}

	/**
	 * Direct traffic to admin or register
	 */
	function lijit_options() {
		// attempt to upgrade old users
		if(get_option('lijit_username') != false && get_option('lijit_username_validated') == false) {
			if(lijit_check_valid_user()) { update_option('lijit_username_validated',1); }
		}
		// direct traffic
		if(get_option('lijit_username') != false && get_option('lijit_username_validated') == 1) { lijit_admin(); }
		else { lijit_register(); }
	}

	/**
	 * Check the availability of the javascript for this username
	 * An invalid username will return incomplete JS, that's our cue to prompt the user to try
	 * a different user name
	 */
	function lijit_check_valid_user($username=false) {
		include_once(ABSPATH.'wp-includes/class-snoopy.php');
		$snoopy = new Snoopy();
		if(!$username) { $username = get_option('lijit_username'); }
		if($snoopy->fetch('http://www.lijit.com/informers/wijits?username='.$username.'&js=1')) {
			return strlen($snoopy->results) > 50;
		}
		return false;
	}

	/**
	 * Display and handle registration screen
	 */
	function lijit_register() {
		$existing_user_error_message = null;
		if(isset($_POST['lj_action']) && $_POST['lj_action'] == 'lijit_register_username') { 
			$existing = true; 
			if(isset($_POST['lijit_username']) && empty($_POST['lijit_username'])) {
				$existing_user_error_message = '<p>Username cannot be empty</p>';
			}
			elseif(!lijit_check_valid_user()) {
				// make sure username is valid
				$existing_user_error_message .= '<p><b>Invalid Username</b>. Please check the name and resubmit</p>';
			}
		}
		elseif(isset($_POST['lijit_group_name'])) { $existing = false; }

		// html
		echo '
			<div class="wrap lijit_wrap">
				<h2>'.__('Plugin Registration').'</h2>
				<form id="lijit_select_user_type" onsubmit="return false;">
					<fieldset>
						<legend>Select User Type</legend>
						<div>
							<p>I am:</p>
							<label for="lijit_user_type_new"> 
								<input type="radio" name="lijit_user_type" id="lijit_user_type_new" value="new" '.(isset($existing) && $existing == false ? 'checked="checked" ' : '').'/>
								'.__('A new user').'
							</label>
							<label for="lijit_user_type_existing">
								<input type="radio" name="lijit_user_type" id="lijit_user_type_existing" value="existing" '.(isset($existing) && $existing == true ? 'checked="checked" ' : '').'/>
								'.__('An existing user').'
							</label>
						</div>
					</fieldset>
				</form>
				<form id="lijit_register" method="post" action="" style="display: none;">
					<div id="lijit_register_results"></div>
					<input type="hidden" name="lijit_referer" value="http:'.$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI'].'" />
					<input type="hidden" id="lijit_group_name" name="lijit_group_name" value="wordpress_plugin_brand" />
					<fieldset>
						<legend>Register as New User</legend>
						<div>
							<label for="lijit_username">'.__('Username').'</label>
							<input type="text" name="lijit_username" id="lijit_username" />
						</div>
						<div>
							<label for="lijit_email">'.__('Email').'</label>
							<input type="text" name="lijit_email" id="lijit_email" />
						</div>
						<div>
							<label for="lijit_blog_url">'.__('Blog/Site').'</label>
							<input type="text" name="lijit_blog_url" id="lijit_blog_url" /><label class="ltw" for="lijit_this_one"><input type="checkbox" id="lijit_this_one" name="lijit_this_one" value="'.get_bloginfo('wpurl').'" onclick="toggle_this_one(this);">Register this site\'s URL</label>
						</div>
					</fieldset>
					<div class="lijit_submit">
						<input type="submit" name="submit" value="'.__('Register').'" /><div class="button-end"></div>
					</div>					
				</form>
				<form id="lijit_existing" method="post" action="" style="display: none;">
					<div id="lijit_existing_results" '.
					($existing_user_error_message != null ? ' class="ljnotice"' : '').'>'.$existing_user_error_message.'</div>
					<input type="hidden" name="lj_action" value="lijit_register_username" />
					<fieldset>
						<legend>Use Existing Account</legend>
						<div>
							<label for="lijit_existing_username">'.__('Username').'</label>
							<input type="text" name="lijit_username" id="lijit_existing_username" '.
							(isset($_POST['lijit_username']) ? 'value="'.$_POST['lijit_username'].'" ' : '').'/>
						</div>
						<div><span>Can\'t remember your user name? <a href="mailto:support@lijit.com?subject=Lost%20User%20Name%20for%20WordPress%20Install">Click here</a> to contact Lijit Support</a></span></div>
					</fieldset>
					<div class="lijit_submit">
						<input type="submit" name="submit" value="'.__('Save').'" /><div class="button-end"></div>
					</div>
				</form>
			</div>
			<script type="text/javascript" language="JavaScript" src="http://www.lijit.com/external/signupScript"></script>
			<script type="text/javascript" language="JavaScript">Lijit.SignupAPI.attachToForm("6d216d073defaa62aaf1579e85be202b","lijit_register",lijit_register_callback);</script>
			';
	}

	/**
	 * Display and handle admin screen
	 */
	function lijit_admin() {
		global $wp_registered_sidebars,$wp_registered_widgets, $cfv; 
		$username = cflj_get_option('lijit_username');
		$search_type = cflj_get_option('lijit_search_type');

		// set necessary helpers
		$sidebars = $widget = $wijit = false;
		if(is_array($wp_registered_sidebars)) {
			$sidebars = true;
			if(is_active_widget('wp_widget_search') !== false) { $widget = true; }
			if(is_active_widget('lijit_std_widget') !== false) { $wijit = true; }
		}

		// handle any processing error display
		$username_error = '';
		$options_error = '';		
		if($cfv != null) {
			if(isset($cfv->errors['lijit_username'])) {
				$username_error = '<div class="ljnotice"><p>'.$cfv->errors['lijit_username'][1].'</p></div>';
			}
			if(isset($cfv->errors['lijit_search_type'])) {
				$options_error = '<div class="ljnotice"><p>'.$cfv->errors['lijit_search_type'][1].'</p></div>';
			}
		}
		
		// start
		echo '
			<div class="wrap lijit_wrap">
				<h2>'.__('Lijit Options').'</h2>
				<form method="post" action="'.get_bloginfo('wpurl').'/wp-admin/options-general.php?page=lijit.php" id="lijitoptions" name="lijitoptions">
				<h3>'.__('Account Statistics').'</h3>
					<fieldset class="np">
						<p><a href="'.get_bloginfo('wpurl').'/wp-admin/index.php?page=statistics_lijit.php">View your account statistics</a></p>
					</fieldset>
					<input type="hidden" name="lj_action" value="lijit_update_settings" />
					<h3>'.__('User Name').'</h3>
					'.$username_error.'
					<fieldset class="options">
						<div>
							<label for="lijit_username">'.__('Lijit Username').':</label>
							<input type="text" name="lijit_username" id="lijit_username" size="30" value="'.$username.'"/>
						</div>
					</fieldset>
					<h3>'.__('Search Options').'</h3>
					'.$options_error.'
					<fieldset class="np">
						<div>
							<p>'.__('Choose which search type you would like to display').':</p>
							<label class="cbr" for="lijit_search_type_wijit">
								<input type="radio" name="lijit_search_type" id="lijit_search_type_wijit" value="wijit" '.($search_type == 'wijit' ? 'checked="checked" ' : '').'/>
								'.__('Use standard Lijit Wijit').'
								<span>Select this option to use the default Lijit Wijit in your Sidebar.</span>
							</label>
							<span>';
		// wijit help and notices
		if($search_type == 'wijit') {
			if($sidebars && $wijit) {
				echo '			<span class="notice blue"><p>The Lijit Sidebar Wijit is enabled.</p></span>';
			}
			elseif($sidebars && !$wijit) {
				echo '			<span class="notice blue"><p><b>The Lijit Sidebar Wijit has been added to the <a href="'.get_bloginfo('wpurl').'/wp-admin/widgets.php">Widget Admin Page</a>.<br />
				   					   You now need to add the Wijit to your sidebar.</b></p></span>';
			}
			elseif(!$sidebars) {
				echo '			<span class="notice">';
				$notice_sent = true;
				echo '				<p><b>It doesn\'t appear that any sidebars are enabled.</b> Enable a sidebar in the 
									   <a href="'.get_bloginfo('wpurl').'/wp-admin/widgets.php">Widget Admin Page</a> and 
									   add the Lijit Sidebar Wijit.</p>';
			}
			if(!isset($notice_sent)) {
				echo '			<span class="notice">';
			}
			echo '				 	<p><a href="#" onclick="show_widget_code(\'wijit_code_sample\'); return false;">Click here</a> if your theme is not Widget enabled or if you want to manually  
									   add the Wijit code to your theme</p>
									<span class="manual_code" id="wijit_code_sample" style="display: none;"><span>
										<p>Add this code in your theme\'s sidebar.php file:</p>
										<pre>&lt;script type="text/javascript" src="http://www.lijit.com/informers/wijits?username='.$username.'&amp;js=1"&gt;&lt;/script&gt;
&lt;a style="color: #999" href="http://www.lijit.com" id="lijit_wijit_pvs_link"&gt;Lijit Search&lt;/a&gt;</pre>
									</span></span>
								</span>';
		}
		echo '				</span>
							
							<label class="cbr" for="lijit_search_type_hijack">
								<input type="radio" name="lijit_search_type" id="lijit_search_type_hijack" value="hijack" '.($search_type == 'hijack' ? 'checked="checked" ' : '').'/>
								'.__('Override WordPress Search Widget').'
								<span>Select this option if you want to have the default WordPress search widget in your sidebar but to have it behave like the Lijit Wijit.</span>
							</label>
							<span>';
		// override help and notices
		if($search_type == 'hijack') {
			if($sidebars && $widget) {
				echo '				<span class="notice blue"><p>The WordPress Sidebar Widget is enabled and will be overidden by the Lijit Search functionality.</p></span>';
			}
			if(!$sidebars) {
				echo '			<span class="notice">';
				$notice_sent = true;
				echo '				<p><b>It doesn\'t appear that any sidebars are enabled.</b> Enable a sidebar in the 
									   <a href="'.get_bloginfo('wpurl').'/wp-admin/widgets.php">Widget Admin Page</a> and 
									   add the WordPress Search Widget.</p>';
			}
			elseif($sidebars && !$widget) {
				echo '			<span class="notice">';
				$notice_sent = true;
				echo '				<p><b>A sidebar is enabled but the WordPress Search Widget may not be.</b> If you\'re not using the default sidebar you now need to add the WordPress Search Widget to your sidebar on the <a href="'.get_bloginfo('wpurl').'/wp-admin/widgets.php">Widget Admin Page</a>.</p>';
			}
		}
		echo '				</span>
						</div>
					</fieldset>
					<p><a href="'.get_bloginfo('wpurl').'/wp-admin/widgets.php">Click here to go to the Widget Admin page</a>.</p>
					<p>More configuration options available at your <a href="http://www.lijit.com/users/'.$username.'" onclick="window.open(this.href); return false;">Lijit Profile</a>.</p>
					<div class="lijit_submit">
						<input type="submit" name="submit" value="'.__('Save Options').'" /><div class="button-end"></div>
					</div>
				</form>
			</div>
			';
	}

	/**
	 * Add jQuery in the right order
	 */
	wp_enqueue_script('jquery');
	if (!function_exists('wp_prototype_before_jquery')) {
		function wp_prototype_before_jquery( $js_array ) {
			if ( false === $jquery = array_search( 'jquery', $js_array ) )
				return $js_array;
			if ( false === $prototype = array_search( 'prototype', $js_array ) )
				return $js_array;
			if ( $prototype < $jquery )
				return $js_array;
			unset($js_array[$prototype]);
			array_splice( $js_array, $jquery, 0, 'prototype' );
			return $js_array;
		}
	    add_filter( 'print_scripts_array', 'wp_prototype_before_jquery' );
	}
?>
