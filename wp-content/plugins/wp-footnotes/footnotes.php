<?php
/*
Plugin Name: WP-Footnotes
Plugin URI: http://www.elvery.net/drzax/more-things/wordpress-footnotes-plugin/
Version: 3.2
Description: Allows a user to easily add footnotes to a post.
Author: Simon Elvery
Author URI: http://www.elvery.net/drzax/
*/

/*
 * This file is part of WP-Footnotes a plugin for Word Press
 * Copyright (C) 2007 Simon Elvery
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

// Some important constants
define('WP_FOOTNOTES_OPEN', " ((");  //You can change this if you really have to, but I wouldn't recommend it.
define('WP_FOOTNOTES_CLOSE', "))");  //Same with this one.
define('WP_FOOTNOTES_VERSION', '3.2');

// Instantiate the class 
$swas_wp_footnotes = new swas_wp_footnotes();

// Encapsulate in a class
class swas_wp_footnotes {
	var $current_options;
	var $default_options;
	
	/**
	 * Constructor.
	 */
	function swas_wp_footnotes() {		
	
		// Define the implemented option styles		
		$this->styles = array(
			'decimal' => '1,2...10',
			'decimal-leading-zero' => '01, 02...10',
			'lower-alpha' => 'a,b...j',
			'upper-alpha' => 'A,B...J',
			'lower-roman' => 'i,ii...x',
			'upper-roman' => 'I,II...X', 
			'symbol' => 'Symbol'
		);
		
		// Define default options
		$this->default_options = array('superscript'=>true,
									  'pre_backlink'=>' [',
									  'backlink'=>'&#8617;',
									  'post_backlink'=>']',
									  'pre_identifier'=>'',
									  'list_style_type'=>'decimal',
									  'list_style_symbol'=>'&dagger;',
									  'post_identifier'=>'',
									  'pre_footnotes'=>'',
									  'post_footnotes'=>'',
									  'style_rules'=>'ol.footnotes{font-size:0.8em; color:#666666;}',
									  'no_display_home'=>false,
									  'no_display_archive'=>false,
									  'no_display_date'=>false,
									  'no_display_category'=>false,
									  'no_display_search'=>false,
									  'no_display_feed'=>false,
									  'combine_identical_notes'=>false,
									  'priority'=>10,
									  'version'=>WP_FOOTNOTES_VERSION);
		
		// Get the current settings or setup some defaults if needed
		if (!$this->current_options = get_option('swas_footnote_options')){
			$this->current_options = $this->default_options;
		} else { 
			
			// Set any unset options
			if ($this->current_options['version'] != WP_FOOTNOTES_VERSION) {
				foreach ($this->default_options as $key => $value) {
					if (!isset($this->current_options[$key])) {
						$this->current_options[$key] = $value;
					}
				}
				$this->current_options['version'] = WP_FOOTNOTES_VERSION;
				update_option('swas_footnote_options', $this->current_options);
			}
		}
		
		if (!empty($_POST['save_options'])){
			$footnotes_options['superscript'] = (array_key_exists('superscript', $_POST)) ? true : false;
		
			$footnotes_options['pre_backlink'] = $_POST['pre_backlink'];
			$footnotes_options['backlink'] = $_POST['backlink'];
			$footnotes_options['post_backlink'] = $_POST['post_backlink'];
			
			$footnotes_options['pre_identifier'] = $_POST['pre_identifier'];
			$footnotes_options['list_style_type'] = $_POST['list_style_type'];
			$footnotes_options['post_identifier'] = $_POST['post_identifier'];
			$footnotes_options['list_style_symbol'] = $_POST['list_style_symbol'];
		
			$footnotes_options['pre_footnotes'] = stripslashes($_POST['pre_footnotes']);
			$footnotes_options['post_footnotes'] = stripslashes($_POST['post_footnotes']);
			$footnotes_options['style_rules'] = stripslashes($_POST['style_rules']);
			
			$footnotes_options['no_display_home'] = (array_key_exists('no_display_home', $_POST)) ? true : false;
			$footnotes_options['no_display_archive'] = (array_key_exists('no_display_archive', $_POST)) ? true : false;
			$footnotes_options['no_display_date'] = (array_key_exists('no_display_date', $_POST)) ? true : false;
			$footnotes_options['no_display_category'] = (array_key_exists('no_display_category', $_POST)) ? true : false;
			$footnotes_options['no_display_search'] = (array_key_exists('no_display_search', $_POST)) ? true : false;
			$footnotes_options['no_display_feed'] = (array_key_exists('no_display_feed', $_POST)) ? true : false;
			
			$footnotes_options['combine_identical_notes'] = (array_key_exists('combine_identical_notes', $_POST)) ? true : false;
			$footnotes_options['priority'] = $_POST['priority'];
			
			update_option('swas_footnote_options', $footnotes_options);
		}elseif(!empty($_POST['reset_options'])){
			update_option('swas_footnote_options', '');
			update_option('swas_footnote_options', $this->default_options);
		}
		
		// Hook me up
		add_action('the_content', array($this, 'process'), $this->current_options['priority']);
		add_action('admin_menu', array($this, 'add_options_page')); 		// Insert the Admin panel.
		add_action('wp_head', array($this, 'insert_styles'));
	}
	
	
	/**
	 * Searches the text and extracts footnotes. 
	 * Adds the identifier links and creats footnotes list.
	 * @param $data string The content of the post.
	 * @return string The new content with footnotes generated.
	 */
	function process($data) {
		global $post;
		
		// Check for and setup the starting number
		$start_number = (preg_match("|<!\-\-startnum=(\d+)\-\->|",$data,$start_number_array)==1) ? $start_number_array[1] : 1;
	
		// Regex extraction of all footnotes (or return if there are none)
		if (!preg_match_all("/(".preg_quote(WP_FOOTNOTES_OPEN)."|<footnote>)(.*)(".preg_quote(WP_FOOTNOTES_CLOSE)."|<\/footnote>)/Us", $data, $identifiers, PREG_SET_ORDER)) {
			return $data;
		}
		
		// Check whether we are displaying them or not
		$display = true;
		if ($this->current_options['no_display_home'] && is_home()) $display = false;
		if ($this->current_options['no_display_archive'] && is_archive()) $display = false;
		if ($this->current_options['no_display_date'] && is_date()) $display = false;
		if ($this->current_options['no_display_category'] && is_category()) $display = false;
		if ($this->current_options['no_display_search'] && is_search()) $display = false;
		if ($this->current_options['no_display_feed'] && is_feed()) $display = false;
		
		$footnotes = array();
		
		// Check if this post is using a different list style to the settings
		if ( array_key_exists(get_post_meta($post->ID, 'footnote_style', true), $this->styles) ) {
			$style = get_post_meta($post->ID, 'footnote_style', true);
		} else {
			$style = $this->current_options['list_style_type'];
		}
		
		// Create 'em
		for ($i=0; $i<count($identifiers); $i++){
			// Look for ref: and replace in identifiers array.
			if (substr($identifiers[$i][2],0,4) == 'ref:'){
				$ref = (int)substr($identifiers[$i][2],4);
				$identifiers[$i]['text'] = $identifiers[$ref-1][2];
			}else{
				$identifiers[$i]['text'] = $identifiers[$i][2];
			}
			
			// if we're combining identical notes check if we've already got one like this & record keys
			if ($this->current_options['combine_identical_notes']){
				for ($j=0; $j<count($footnotes); $j++){
					if ($footnotes[$j]['text'] == $identifiers[$i]['text']){
						$identifiers[$i]['use_footnote'] = $j;
						$footnotes[$j]['identifiers'][] = $i;
						break;
					}
				}
			}
			
			
			
			if (!isset($identifiers[$i]['use_footnote'])){
				// Add footnote and record the key
				$identifiers[$i]['use_footnote'] = count($footnotes);
				$footnotes[$identifiers[$i]['use_footnote']]['text'] = $identifiers[$i]['text'];
				$footnotes[$identifiers[$i]['use_footnote']]['symbol'] = $identifiers[$i]['symbol'];
				$footnotes[$identifiers[$i]['use_footnote']]['identifiers'][] = $i;
			}
		}
		
		// Footnotes and identifiers are stored in the array
		
		// Display identifiers		
		foreach ($identifiers as $key => $value) {
			$id_id = "identifier_".$key."_".$post->ID;
			$id_num = ($style == 'decimal') ? $value['use_footnote']+$start_number : $this->convert_num($value['use_footnote']+$start_number, $style, count($footnotes));
			$id_href = get_permalink($post->ID)."#footnote_".$value['use_footnote']."_".$post->ID;
			$id_title = str_replace('"', "&quot;", strip_tags($value['text']));
			if (is_feed()){
				$id_replace = $this->current_options['pre_identifier'].$id_num.$this->current_options['post_identifier'];
			}else{
				$id_replace = $this->current_options['pre_identifier'].'<a href="'.$id_href.'" id="'.$id_id.'" class="footnote-link footnote-identifier-link" title="'.$id_title.'">'.$id_num.'</a>'.$this->current_options['post_identifier'];
			}
			if ($this->current_options['superscript']) $id_replace = '<sup>'.$id_replace.'</sup>';
			if ($display) $data = substr_replace($data, $id_replace, strpos($data,$value[0]),strlen($value[0]));
			else $data = substr_replace($data, '', strpos($data,$value[0]),strlen($value[0]));
		}
		
		// Display footnotes
		if ($display) {
			$start = ($start_number != 1) ? 'start="'.$start_number.'" ' : '';
			$data = $data.$this->current_options['pre_footnotes'];
			
			$data = $data . '<ol '.$start.'class="footnotes">';	
			foreach ($footnotes as $key => $value) {
				$data = $data.'<li id="footnote_'.$key.'_'.$post->ID.'" class="footnote"';
				if ($style == 'symbol') {
					$data = $data . ' style="list-style-type:none;"';
				} elseif($style != $this->current_options['list_style_type']) {
					$data = $data . ' style="list-style-type:' . $style . ';"';
				}
				$data = $data . '>';
				if ($style == 'symbol') {
					$data = $data . '<span class="symbol">' . $this->convert_num($key+$start_number, $style, count($footnotes)) . '</span> ';
				}
				$data = $data.$value['text'];
				if (!is_feed()){
					foreach($value['identifiers'] as $identifier){
						$data = $data.$this->current_options['pre_backlink'].'<a href="'.get_permalink($post->ID).'#identifier_'.$identifier.'_'.$post->ID.'" class="footnote-link footnote-back-link">'.$this->current_options['backlink'].'</a>'.$this->current_options['post_backlink'];
					}
				}
				$data = $data . '</li>';
			}
			$data = $data . '</ol>' . $this->current_options['post_footnotes'];
		}
		
		return $data;
	}
	
	/**
	 * Really insert the options page.
	 */
	function footnotes_options_page() { 
		$this->current_options = get_option('swas_footnote_options');
		foreach ($this->current_options as $key=>$setting) {
			$new_setting[$key] = htmlentities($setting);
		}
		$this->current_options = $new_setting;
		unset($new_setting);
?>

<script type="text/javascript" language="javascript">
	/* <![CDATA[ */
	
	jQuery(document).ready(function() {
		jQuery('#list_style_type').change(function() {
			if (jQuery(this).val() == 'symbol') {
				jQuery('#list_style_symbol_container').slideDown();
			} else {
				jQuery('#list_style_symbol_container').slideUp();
			}
		});
	});
	
	/* ]]> */
</script>

<?php if (!empty($_POST['save_options'])): ?>
<div class="updated"><p><strong>Options saved.</strong></p></div>
<?php elseif (!empty($_POST['reset_options'])): ?>
<div class="updated"><p><strong>Options reset.</strong></p></div>
<?php endif; ?>

<div class="wrap">
	<h2>WP-Footnotes Options</h2>
	<div id="footnotes-options-sidebar" style="float:right; width:220px;" class="side-info submitbox">
		<div  style="background-color:#EAF3FA;">
			<div id="previewview"> </div>
			<div style="padding:0 8px;">
				<h5>Bug Reports / Feature Requests</h5>
				<p>You should report any bugs you find and submit feature requests to <a href="http://dev.wp-plugins.org/newticket?component=wp-footnotes&owner=drzax">the WP-Plugins.org bug tracker</a> (if you're not already you will need to be <a href="http://wordpress.org/extend/plugins/register.php" title="Sign up to the WordPress Plings Directory">signed up</a> and signed in at wordpress.org/extend/plugins).</p>
				<h5>Donations</h5>
				<p>If you want to share the love, or if you want to see your feature request moved to the top of my to-do list, hit me up with a donation. It would be most appreciated.</p>
			</div>
			<div class="submit">
				<form action="https://www.paypal.com/cgi-bin/webscr" method="post">
					<input type="hidden" name="cmd" value="_s-xclick" />
					<input type="image" src="https://www.paypal.com/en_US/i/btn/x-click-but04.gif" border="0" name="submit" alt="Make payments with PayPal - it's fast, free and secure!" />
					<img alt="" border="0" src="https://www.paypal.com/en_AU/i/scr/pixel.gif" width="1" height="1" style="display:block; margin:auto;" />
					<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----" />
				</form>
			</div>
		</div>
		<div>
			<h5>Documentation</h5>
			<p>You can view <a href="http://elvery.net/drzax/more-things/wordpress-footnotes-plugin/" title="WP-Footnotes documentation">the documentation</a> at <a href="http://elvery.net/drzax" title="sw'as">sw'as</a>, the author's website.</p>
			<h5>Licensing Info</h5>
			<p>WP-Footnotes, Copyright &copy; 2007 Simon Elvery</p>
			<p>WP-Footnotes is licensed under the <a href="http://www.gnu.org/licenses/gpl.html">GNU GPL</a>. WP-Footnotes comes with ABSOLUTELY NO WARRANTY. This is free software, and you are welcome to redistribute it under certain conditions. See the <a href="http://www.gnu.org/licenses/gpl.html">license</a> for details.</p>
			<p>The Smooth Scroll feature in WP-Footnotes makes use of jQuery and a <a href="http://www.learningjquery.com/2007/09/animated-scrolling-with-jquery-12">neat little bit of code</a> written by <a href="http://www.englishrules.com/">Karl Swedberg</a></p>
			
		</div>
	</div>
	<div id="footnotes-options" style="margin-right:230px;">
		<form method="post">
			<h3>Identifier</h3>
			<fieldset style="border:none; border-bottom:solid 8px #fff; line-height:20px; margin-bottom:9px; padding:10px; background:#EAF3FA;">
				<table>
					<tr>
						<th><label for="pre_identifier">Before</label></th>
						<th><label for="list_style_type">Style</label></th>
						<th><label for="post_identifier">After</label></th>
						<th>&nbsp;</th>
					</tr>
					<tr>
						<td><input type="text" id="pre_identifier" name="pre_identifier" size="3" value="<?php echo $this->current_options['pre_identifier']; ?>" /></td>
						<td>
							<select name="list_style_type" id="list_style_type">
								<?php foreach ($this->styles as $key => $val): ?>
								<option value="<?php echo $key; ?>" <?php if ($this->current_options['list_style_type'] == $key) echo 'selected="selected"'; ?> ><?php echo $val; ?></option>
								<?php endforeach; ?>
							</select>
						</td>
						<td><input type="text" name="post_identifier" id="post_identifier" size="3" value="<?php echo $this->current_options['post_identifier']; ?>"  /></td>
						<td><input type="checkbox" name="superscript" id="superscript" <?php if($this->current_options['superscript'] == true) echo 'checked'; ?> /> <label for="superscript">Make note identifier superscript? </label></td>
					</tr>
				</table>
				<div id="list_style_symbol_container" <?php if ($this->current_options['list_style_type'] != 'symbol'): ?>style="display:none;"<?php endif; ?>>
					<p>It's not usually a good idea to choose this type unless you never have more than a couple of footnotes per post.</p>
					<table>
						<tr>
							<th><label for="list_style_symbol">Symbol to use for footnotes:</label></th>
							<td><input type="text" id="list_style_symbol" name="list_style_symbol" value="<?php echo $this->current_options['list_style_symbol']; ?>" /></td>
						</tr>
					</table>
				</div>
			</fieldset>
			<h3>Back-link </h3>
			<fieldset style="border:none; border-bottom:solid 8px #fff; line-height:20px; margin-bottom:9px; padding:10px; background:#EAF3FA;">
				<p>These options affect how the back-links after each footnote look. A good back-link character is &amp;#8617; (&#8617). If you want to remove the back-links all together, you can effectively do so by making all these settings blank.</p>
				<table>
					<tr>
						<th><label for="pre_backlink">Before</label></th>
						<th><label for="backlink">Link</label></th>
						<th><label for="post_backlink">After</label></th>
					</tr>
					<tr>
						<td><input type="text" id="pre_backlink" name="pre_backlink" size="3" value="<?php echo $this->current_options['pre_backlink']; ?>" /></td>
						<td><input type="text" id="backlink" name="backlink" size="10" value="<?php echo $this->current_options['backlink']; ?>"  /></td>
						<td><input type="text" id="post_backlink" name="post_backlink" size="3" value="<?php echo $this->current_options['post_backlink']; ?>"  /></td>
					</tr>
				</table>
			</fieldset>
			<h3>Other Options</h3>
			<table class="form-table">
				<tr>
					<th><label for="pre_footnotes">Anything to be displayed <strong>before</strong> the footnotes at the bottom of the post can go here:</label></th>
					<td><textarea rows="3" cols="60" name="pre_footnotes"><?php echo $this->current_options['pre_footnotes']; ?></textarea></td>
				</tr>
				<tr>
					<th><label for="post_footnotes">Anything to be displayed <strong>after</strong> the footnotes at the bottom of the post can go here:</label></th>
					<td><textarea rows="3" cols="60" name="post_footnotes"><?php echo $this->current_options['post_footnotes']; ?></textarea></td>
				</tr>
				<tr>
					<th><label for="style_rules">Some CSS to style the footnotes (or anything else on the page for that matter):</label></th>
					<td><textarea rows="3" cols="60" name="style_rules"><?php echo $this->current_options['style_rules']; ?></textarea></td>
				</tr>
				<tr>
					<th>Do not display footnotes at all when the page being shown is:</th>
					<td>
						<ul style="list-style-type:none;">
							<li><label for="no_display_home"><input type="checkbox" name="no_display_home" id="no_display_home" <?php if($this->current_options['no_display_home'] == true) echo 'checked'; ?> /> the home page</label></li>
							<li><label for="no_display_search"><input type="checkbox" name="no_display_search" id="no_display_search" <?php if($this->current_options['no_display_search'] == true) echo 'checked'; ?> /> search results</label></li>
							<li><label for="no_display_feed"><input type="checkbox" name="no_display_feed" id="no_display_feed" <?php if($this->current_options['no_display_feed'] == true) echo 'checked'; ?> /> a feed (RSS, Atom, etc)</label></li>
							<li><label for="no_display_archive"><input type="checkbox" name="no_display_archive" id="no_display_archive" <?php if($this->current_options['no_display_archive'] == true) echo 'checked'; ?> /> an archive page of any kind</label></li>
							<li>
								<ul style="list-style-type:none;">
									<li><label for="no_display_category"><input type="checkbox" name="no_display_category" id="no_display_category" <?php if($this->current_options['no_display_category'] == true) echo 'checked'; ?> /> a category archive</label></li>
									<li><label for="no_display_date"><input type="checkbox" name="no_display_date" id="no_display_date" <?php if($this->current_options['no_display_date'] == true) echo 'checked'; ?> /> a date based archive page</label></li>
								</ul>
							</li>
						</ul>
					</td>
				</tr>
				<tr>
					<th><label for="combine_identical_notes">Combine identical notes? </label></th>
					<td><input type="checkbox" name="combine_identical_notes" id="combine_identical_notes" <?php if ($this->current_options['combine_identical_notes'] == true): ?> checked="checked"<?php endif; ?> /></td>
				</tr>
				<tr>
					<th><label for="priority">Priority: </label></th>
					<td>
						<input size="3" type="text" name="priority" id="priority" value="<?php echo $this->current_options['priority']; ?>" /> (Default: 10)
						<p><small>(This setting controls the order in which the WP-Footnotes plugin executes in relation to other plugins. Modifying this setting may affect the behaviour of other plugins.)</small></p>
					</td>
				</tr>
			</table>
			<p class="submit"><input type="submit" name="reset_options" value="Reset Options to Defaults" /> <input type="submit" name="save_options" value="Update Options &raquo;" /></p>
		</form>
	</div>
</div>
	
<?php
	}
	
	/**
	 * Insert the options page into the admin area.
	 */
	function add_options_page() {
		// Add a new menu under Options:
		add_options_page('Footnotes', 'Footnotes', 8, __FILE__, array($this, 'footnotes_options_page'));
	}
	
	
	function upgrade_post($data){
		$data = str_replace('<footnote>',WP_FOOTNOTES_OPEN,$data);
		$data = str_replace('</footnote>',WP_FOOTNOTES_CLOSE,$data);
		return $data;
	}
	
	function insert_styles(){
		?>
		<style type="text/css">
			<?php if ($this->current_options['list_style_type'] != 'symbol'): ?>
			ol.footnotes li {list-style-type:<?php echo $this->current_options['list_style_type']; ?>;}
			<?php endif; ?>
			<?php echo $this->current_options['style_rules'];?>
		</style>
		<?php
	}
	
	function convert_num ($num, $style, $total){
		switch ($style) {
			case 'decimal-leading-zero' :
				$width = max(2, strlen($total));
				return sprintf("%0{$width}d", $num);
			case 'lower-roman' :
				return $this->roman($num, 'lower');
			case 'upper-roman' :
				return $this->roman($num);
			case 'lower-alpha' :
				return $this->alpha($num, 'lower');
			case 'upper-alpha' :
				return $this->alpha($num);
			case 'symbol' :
				$sym = '';
				for ($i = 0; $i<$num; $i++) {
					$sym .= $this->current_options['list_style_symbol'];
				}
				return $sym;
		}
	}
	
	function roman($num, $case= 'upper'){
		$num = (int) $num;
		$conversion = array(1=>'I', 5=>'V', 10=>'X', 50=>'L', 100=>'C', 500=>'D', 1000=>'M');
		$roman = '';
		
		for ($i = 1000; floor($i)>0; $i=$i/10){
			switch (floor($num/$i)) {
				case 1 :
					$roman .= $conversion[$i];
					break;
				case 2 :
					$roman .= $conversion[$i].$conversion[$i];
					break;
				case 3 :
					$roman .= $conversion[$i].$conversion[$i].$conversion[$i];
					break;
				case 4 :
					$range = $i*5;
					$num2 = '4';
					
					while(strlen($num2) < strlen($range)){
						$num2 .= '0';
					}
					$in_front = $range-$num2;
					$roman .= $conversion[$in_front].$conversion[$range];
					$num = $num - $num2;
					
					break;
				case 5 :
					$roman .= $conversion[$i*5];
					break;
				case 6 :
					$roman .= $conversion[$i*5].$conversion[$i];
					break;
				case 7 :
					$roman .= $conversion[$i*5].$conversion[$i].$conversion[$i];
					break;
				case 8 :
					$roman .= $conversion[$i*5].$conversion[$i].$conversion[$i].$conversion[$i];
					break;
				case 9 :
					$range = $i*10;
					$num2 = '9';
					for ($j=1; $j<strlen($num); $j++){
						if (substr($num, $j, 1) == '9') {
							$num2 .= '9';
						}elseif (substr($num, $j, 1) == '5') {
							$num2 .= '5';
							break;
						}else{
							break;
						}
					}
					while(strlen($num2) < strlen($range)-1){
						$num2 .= '0';
					}
					$in_front = $range-$num2;
					if ($range/$in_front > 10){
						$num2 = '9';
						while(strlen($num2) < strlen($range)-1){
							$num2 .= '0';
						}
						$in_front = $range-$num2;
					}				
					$roman .= $conversion[$in_front].$conversion[$range];
					$num = $num - $num2;
					break;
			}
			// Take away what we've already dealt with
			$num = $num - $i*floor($num/$i);
		}
		if ($case == 'lower') $roman = strtolower($roman);
		return $roman;
	}
	
	function alpha($num, $case='upper'){
		$j = 1;
		for ($i = 'A'; $i <= 'ZZ'; $i++){
			if ($j == $num){
				if ($case == 'lower')
					return strtolower($i);
				else
					return $i;
			}
			$j++;
		}
		
	}
}