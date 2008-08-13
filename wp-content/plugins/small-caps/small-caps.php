<?php
/*
Plugin Name: Small caps
Plugin URI: http://ckunte.com/archives/small-caps
Description: This plugin looks for sequences of 3 or more uppercase letters or numbers, such as CSS, HTML and W3C, and wraps an <abbr> tag around them. Small caps for capitalized words. Credits to <a href="http://webtypography.net/">Webtypography--a practical guide to web typography</a> for the function, and for inspiration.
Version: 1.0
Author: Chetan Kunte
Author URI: http://ckunte.com/
*/
//
// This function looks for sequences of 3 or more uppercase letters or numbers, 
// such as CSS, HTML and W3C, and wraps an <abbr> tag around them.
//
function ckunte_smallcaps($text) {
        $search = "/\b([A-Z][A-Z0-9]{2,})\b/";
        $replace = "<abbr>$1</abbr>";
        $text = preg_replace($search,$replace,$text);
        return $text;
}
//
if (function_exists('add_filter')) {
        add_filter('the_content', 'ckunte_smallcaps');
}
// 
// Adding styling to template's head section. 
// Intentionally excluded for users' freedom to style.
// See: http://ckunte.com/archives/small-caps
// 
// Styling abbr to lowercase first, and then to small-caps.
//
// Uncomment following lines (take out those //s, if you prefer automatic styling as specified below.
// function ckunte_smallcaps_wp_head () {
//      echo "\n<style type=\"text/css\">abbr{text-transform:lowercase; font-variant:small-caps;}</style>\n";
// }
//
// if (function_exists('add_action')) {
//    add_action( 'wp_head', 'ckunte_smallcaps_wp_head' );
// }
//
?>