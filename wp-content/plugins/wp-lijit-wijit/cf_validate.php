<?php

/**
 * Simple data validation & save class
 * Copyright (c) 2008 Crowd Favorite. All rights reserved.
 *
 * Released under the GPL license & MIT License
 * http://www.opensource.org/licenses/gpl-2.0.php
 * http://www.opensource.org/licenses/mit-license.php
 *
 * **********************************************************************
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * **********************************************************************
 */
class cf_validate {
	var $error = false;
	var $errors = array();
	var $action_requested = false;
	
	/**
	 * update data from a text field
	 * 
	 * @var	string	$field_name - the form name of the option
	 * @var	string	$field_display_name - a display name for showing errors
	 * @var	bool	$required - whether the field is required or not
	 * @var bool	$strip_html - whether we want to strip html from the entry or not
	 * @return bool
	 */	
	function cf_update_text($field_name, $field_display_name, $required=false, $strip_html=true) {
		// check to see if we're changing values, if not, don't do anything
		$previous = get_option($field_name);
		if(!empty($previous) && $previous == $_POST[$field_name]) { return true; }		
		
		if(!isset($_POST[$field_name]) || empty($_POST[$field_name])) {
			if($required) { $this->set_error($field_name,'Please enter a '.$field_display_name); }
			return false;
		}
		elseif(isset($_POST[$field_name]) && !empty($_POST[$field_name]) && $val = $_POST[$field_name]) {
			if($strip_html) { $val = strip_tags($val); }
			if(!empty($val) && update_option($field_name,$val)) { return true; }
			else {
				$this->set_error($field_name,$field_display_name.' could not be saved. Please check the value and try again');
				return false;
			}
		}
	}
	
	/**
	 * update data from a checkbox or radio set
	 * 
	 * @var	string	$option_name - the form name of the option
	 * @var	string	$option_display_name - a display name for showing errors
	 * @var	bool	$required - if the field is required or not
	 * @return bool
	 */
	function cf_update_option($option_name, $option_display_name, $required=false) {
		// check to see if we're changing values, if not, don't do anything
		$previous = get_option($option_name);
		if(!empty($previous) && $previous == $_POST[$option_name]) { return true; }
		
		if(isset($_POST[$option_name])) { 
			if(update_option($option_name,$_POST[$option_name])) { return true; }
			else {
				$this->set_error($option_name, $display_name.' could not be saved. Please check the item and try again');
				return false;
			}
		}
		elseif(!isset($_POST[$option_name]) || empty($_POST[$option_name])) {
			if($required) { $this->set_error($option_name,'Please select a '.$option_display_name); }
			return false;
		}		
	}
	
	/**
	 * check a field against already stored data, require unique
	 *
	 * @var	string	$field_name - the form name of the option
	 * @var	string	$field_display_name - a display name for showing errors
	 * @var	bool	$required - whether the field is required or not
	 * @var bool	$strip_html - whether we want to strip html from the entry or not
	 * @return bool
	 */	
	function cf_update_new_value($field_name, $field_display_name, $required=false, $strip_html=true) {
		$previous = get_option($field_name);
		if($previous == $_POST[$field_name]) {
			$this->set_error($field_name,$field_display_name.' must be a new value. Please enter a new value and try again.');
			return false;
		}
		
		return $this->cf_update_text($field_name, $field_display_name, $required, $strip_html);
	}
	
	/**
	 * check a field against user entered verification (ie: 2nd form field)
	 *
	 * @var	string	$field_name - the form name of the option
	 * @var	string	$field_display_name - a display name for showing errors
	 * @var	bool	$required - whether the field is required or not
	 * @var bool	$strip_html - whether we want to strip html from the entry or not
	 * @return bool
	 */
	function cf_update_verified($field_name, $field_display_name, $required=false, $strip_html=true) {
		// check to see if we're changing values, if not, don't do anything
		$previous = get_option($field_name);
		if(!empty($previous) && $previous == $_POST[$field_name]) { return true; }
		
		// make sure the field and verification fields match
		if((isset($_POST[$field_name.'_verify']) && isset($_POST[$field_name])) && (!empty($_POST[$field_name.'_verify']) && !empty($_POST[$field_name]))) {
			if($_POST[$field_name.'_verify'] != $_POST[$field_name]) {
				$this->set_error($field_name,$field_display_name.' entries do not match. Please check your entries and try again');
				return false;
			}
		}
		else {
			$this->set_error($field_name,'Please verify your '.$field_display_name);
			return false;
		}

		return $this->cf_update_text($field_name, $field_display_name, $required, $strip_html);		
	}
	
	/**
	 * Set errors for later display
	 *
	 * @var string	$name - field name of the offending field
	 * @var string	$value - error string to display to the user
	 * @return bool
	 */
	function set_error($name,$value) {
		$this->error = true;
		$this->errors[$name] = array($name,$value);
		if(!$this->action_requested) {
			add_action('admin_notices',array($this,'show_errors'));
			$this->action_requested = true;
		}
		return true;
	}
	
	/**
	 * Show errors
	 * default targeted towards admin_head
	 *
	 * @var	array 	$wrap - items to append and prepend to block
	 * @var	array 	$wrap_list - items to append and prepend to items list
	 * @var	array 	$wrap_each - items to append and prepend to each item
	 */
	function show_errors($a = true, $wrap = array('<div class="updated fade-ff0000">','</div>'), $wrap_list = array('<ol class="form_errors">','</ol>'), $wrap_each = array('<li>','</li>')) {
		echo $wrap[0].PHP_EOL.
			 '<p><b>There '.
			 (count($this->errors) > 1 ? 'were' : 'was an').
			 ' error'.
			 (count($this->errors) > 1 ? 's' : '').
			 ' processing this request:</b></p>'.
			 $wrap_list[0].PHP_EOL;
		foreach($this->errors as $error) {
			echo $wrap_each[0].$error[1].$wrap_each[1].PHP_EOL;
		}
		echo $wrap_list[1].PHP_EOL.
			 $wrap[1].PHP_EOL;
	}
}

?>