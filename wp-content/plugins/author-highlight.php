<?php
/*
Plugin Name: Author Highlight
Plugin URI: http://dev.wp-plugins.org/wiki/AuthorHighlight
Description: Author Highlight is a plugin that prints out a user-specified class attribute if the comment is made by the specified author. It is useful if you would like to apply a different style to comments made by yourself.
Version: 1.0
Author: Jonathan Leighton
Author URI: http://turnipspatch.com/
Licence: This WordPress plugin is licenced under the GNU General Public Licence. For more information see: http://www.gnu.org/copyleft/gpl.html

For documentation, please visit http://dev.wp-plugins.org/wiki/AuthorHighlight
*/
$author_highlight = array
	(
		"class_name_highlight" => "highlighted",
		"class_name_else" => "",
		"email" => "blog@blowery.org",
		"author" => "Ben"
	);

function author_highlight() {
	global $comment, $author_highlight;
	if (empty($author_highlight["author"]) || empty($author_highlight["email"]) || empty($author_highlight["class_name_highlight"]))
		return;
	$author = $comment->comment_author;
	$email = $comment->comment_author_email;
	if (strcasecmp($author, $author_highlight["author"]) == 0 && strcasecmp($email, $author_highlight["email"]) == 0)
		echo $author_highlight["class_name_highlight"];
	else
		echo $author_highlight["class_name_else"];
}
?>
