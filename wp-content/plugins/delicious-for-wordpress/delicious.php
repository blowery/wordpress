<?php

/*
Plugin Name: del.icio.us for Wordpress
Version: 2.0.2
Plugin URI: http://rick.jinlabs.com/code/delicious
Description: Displays your recently listened links. Based on <a href="http://cavemonkey50.com/code/pownce/">Pownce for Wordpress</a> by <a href="http://cavemonkey50.com/">Cavemonkey50</a>. 
Author: Ricardo Gonz&aacute;lez
Author URI: http://rick.jinlabs.com/
*/

/*  Copyright 2007  Ricardo González Castro (rick[in]jinlabs.com)

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
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/


//define('MAGPIE_CACHE_AGE', 120);
define('MAGPIE_CACHE_ON', 0); //2.7 Cache Bug
define('MAGPIE_INPUT_ENCODING', 'UTF-8');
define('MAGPIE_OUTPUT_ENCODING', 'UTF-8');


$delicious_options['widget_fields']['title'] = array('label'=>'Title:', 'type'=>'text', 'default'=>'');
$delicious_options['widget_fields']['username'] = array('label'=>'Username:', 'type'=>'text', 'default'=>'');
$delicious_options['widget_fields']['num'] = array('label'=>'Number of links:', 'type'=>'text', 'default'=>'');
$delicious_options['widget_fields']['update'] = array('label'=>'Show timestamps:', 'type'=>'checkbox', 'default'=>false);
$delicious_options['widget_fields']['tags'] = array('label'=>'Show tags:', 'type'=>'checkbox', 'default'=>false);
$delicious_options['widget_fields']['filtertag'] = array('label'=>'Filter Tag(s) [cats+dogs+birds]: ', 'type'=>'text', 'default'=>'');
$delicious_options['widget_fields']['displaydesc'] = array('label'=>'Show descriptions:', 'type'=>'checkbox', 'default'=>false);
$delicious_options['widget_fields']['nodisplaytag'] = array('label'=>'No display tag(s) [cats+dogs+birds]:', 'type'=>'text', 'default'=>'');
$delicious_options['widget_fields']['globaltag'] = array('label'=>'Global tags:', 'type'=>'checkbox', 'default'=>false);
$delicious_options['widget_fields']['encode_utf8'] = array('label'=>'UTF8 Encode:', 'type'=>'checkbox', 'default'=>false);

$delicious_options['prefix'] = 'delicious';
$delicious_options['rss_url'] = 'http://feeds.delicious.com/v2/rss/';
$delicious_options['tag_url'] = 'http://delicious.com/tag/';

// Display del.icio.us recently bookmarked links.

function delicious_bookmarks($username = '', $num = 5, $list = true, $update = true, $tags = false, $filtertag = '', $displaydesc = false, $nodisplaytag = '', $globaltag = false, $encode_utf8 = false ) {
	
	global $delicious_options;
	include_once(ABSPATH . WPINC . '/rss.php');
	
	$rss = $delicious_options['rss_url'].$username;
	
	if($filtertag != '') { $rss .= '/'.$filtertag; }

	$bookmarks = fetch_rss($rss);

	if ($list) echo '<ul class="delicious">';
	
	if ($username == '') {
		if ($list) echo '<li>';
		echo 'Username not configured';
		if ($list) echo '</li>';
	} else {
		if ( empty($bookmarks->items) ) {
			if ($list) echo '<li>';
			echo 'No bookmarks avaliable.';
			if ($list) echo '</li>';
		} else {
			foreach ( $bookmarks->items as $bookmark ) {
				$msg = $bookmark['title'];
				if($encode_utf8) utf8_encode($msg);					
				$link = $bookmark['link'];
				$desc = $bookmark['description'];
			
				if ($list) echo '<li class="delicious-item">'; elseif ($num != 1) echo '<p class="delicious">';
        		echo '<a href="'.$link.'" class="delicious-link">'.$msg.'</a>'; // Puts a link to the... link.

        if($update) {				
          $time = strtotime($bookmark['pubdate']);
          
          if ( ( abs( time() - $time) ) < 86400 )
            $h_time = sprintf( __('%s ago'), human_time_diff( $time ) );
          else
            $h_time = date(__('Y/m/d'), $time);

          echo sprintf( '%s',' <span class="delicious-timestamp"><abbr title="' . date(__('Y/m/d H:i:s'), $time) . '">' . $h_time . '</abbr></span>' );
         }      
				
				if ($displaydesc && $desc != '') {
        			echo '<br />';
        			echo '<span class="delicious-desc">'.$desc.'</span>';
				}
				
				if ($tags) {
					echo '<br />';
					echo '<div class="delicious-tags">';
					$tagged = explode(' ', $bookmark['dc']['subject']);
					$ndtags = explode('+', $nodisplaytag);
					if ($globaltag) { $gttemp = 'tag'; } else { $gttemp = $username; }
					foreach ($tagged as $tag) {
					  if (!in_array($tag,$ndtags)) {
       			  echo '<a href="http://del.icio.us/'.$gttemp.'/'.$tag.'" class="delicious-link-tag">'.$tag.'</a> '; // Puts a link to the tag.              
            }
					}
					echo '</div>';
				}
					
				if ($list) echo '</li>'; elseif ($num != 1) echo '</p>';
			
				$i++;
				if ( $i >= $num ) break;
			}
		}	
  }
	if ($list) echo '</ul>';  
}
	
	
// delicious widget stuff
function widget_delicious_init() {
	
	if ( !function_exists('register_sidebar_widget') )
		return;
	
	$check_options = get_option('widget_delicious');
  if ($check_options['number']=='') {
    $check_options['number'] = 1;
    update_option('widget_delicious', $check_options);
  }
  	
	function widget_delicious($args, $number = 1) {
		
		global $delicious_options;
		
		// $args is an array of strings that help widgets to conform to
		// the active theme: before_widget, before_title, after_widget,
		// and after_title are the array keys. Default tags: li and h2.
		extract($args);

		// Each widget can store its own options. We keep strings here.
		include_once(ABSPATH . WPINC . '/rss.php');
		$options = get_option('widget_delicious');
		
		// fill options with default values if value is not set
		$item = $options[$number];
		foreach($delicious_options['widget_fields'] as $key => $field) {
			if (! isset($item[$key])) {
				$item[$key] = $field['default'];
			}
		}
		$bookmarks = fetch_rss($delicious_options['rss_url'] . $username);

		// These lines generate our output.
		echo $before_widget . $before_title . '<a href="http://delicious.com/'.$item['username'] . '" class="delicious_title_link">'. $item['title'] . '</a>' . $after_title;
		delicious_bookmarks($item['username'], $item['num'], true, $item['update'], $item['tags'], $item['filtertag'], $item['displaydesc'], $item['nodisplaytag'], $item['globaltag'], $item['encode_utf8']);
		echo $after_widget;
	}



	// This is the function that outputs the form.
	function widget_delicious_control($number) {
		
		global $delicious_options;
		
		// Get our options and see if we're handling a form submission.
		$options = get_option('widget_delicious');


		if ( isset($_POST['delicious-submit']) ) {

			foreach($delicious_options['widget_fields'] as $key => $field) {
				$options[$number][$key] = $field['default'];
				$field_name = sprintf('%s_%s_%s', $delicious_options['prefix'], $key, $number);

				if ($field['type'] == 'text') {
					$options[$number][$key] = strip_tags(stripslashes($_POST[$field_name]));
				} elseif ($field['type'] == 'checkbox') {
					$options[$number][$key] = isset($_POST[$field_name]);
				}
			}

			update_option('widget_delicious', $options);
		}

		foreach($delicious_options['widget_fields'] as $key => $field) {
			
			$field_name = sprintf('%s_%s_%s', $delicious_options['prefix'], $key, $number);
			$field_checked = '';
			if ($field['type'] == 'text') {
				$field_value = htmlspecialchars($options[$number][$key], ENT_QUOTES);
			} elseif ($field['type'] == 'checkbox') {
				$field_value = 1;
				if (! empty($options[$number][$key])) {
					$field_checked = 'checked="checked"';
				}
			}
			
			printf('<p style="text-align:right;" class="delicious_field"><label for="%s">%s <input id="%s" name="%s" type="%s" value="%s" class="%s" %s /></label></p>',
				$field_name, __($field['label']), $field_name, $field_name, $field['type'], $field_value, $field['type'], $field_checked);
		}
		echo '<input type="hidden" id="delicious-submit" name="delicious-submit" value="1" />';
	}


	function widget_delicious_setup() {
		$options = $newoptions = get_option('widget_delicious');
		
		//echo '<style type="text/css">.delicious_field { text-align:right; } .delicious_field .text { width:200px; }</style>';
		
		if ( isset($_POST['delicious-number-submit']) ) {
			$number = (int) $_POST['delicious-number'];
			$newoptions['number'] = $number;
		}
		
		if ( $options != $newoptions ) {
			update_option('widget_delicious', $newoptions);
			widget_delicious_register();
		}
	}
	
	
	function widget_delicious_page() {
		$options = $newoptions = get_option('widget_delicious');
	?>
		<div class="wrap">
			<form method="POST">
				<h2><?php _e('del.icio.us Widgets'); ?></h2>
				<p style="line-height: 30px;"><?php _e('How many del.icio.us widgets would you like?'); ?>
				<select id="delicious-number" name="delicious-number" value="<?php echo $options['number']; ?>">
	<?php for ( $i = 1; $i < 10; ++$i ) echo "<option value='$i' ".($options['number']==$i ? "selected='selected'" : '').">$i</option>"; ?>
				</select>
				<span class="submit"><input type="submit" name="delicious-number-submit" id="delicious-number-submit" value="<?php echo attribute_escape(__('Save')); ?>" /></span></p>
			</form>
		</div>
	<?php
	}
	
	
	function widget_delicious_register() {
		
		$options = get_option('widget_delicious');
		$dims = array('width' => 300, 'height' => 400);
		$class = array('classname' => 'widget_delicious');

		for ($i = 1; $i <= 9; $i++) {
			$name = sprintf(__('del.icio.us #%d'), $i);
			$id = "delicious-$i"; // Never never never translate an id
			wp_register_sidebar_widget($id, $name, $i <= $options['number'] ? 'widget_delicious' : /* unregister */ '', $class, $i);
			wp_register_widget_control($id, $name, $i <= $options['number'] ? 'widget_delicious_control' : /* unregister */ '', $dims, $i);
		}
		
		add_action('sidebar_admin_setup', 'widget_delicious_setup');
		add_action('sidebar_admin_page', 'widget_delicious_page');
	}

	widget_delicious_register();
}

// Run our code later in case this loads prior to any required plugins.
add_action('widgets_init', 'widget_delicious_init');

?>