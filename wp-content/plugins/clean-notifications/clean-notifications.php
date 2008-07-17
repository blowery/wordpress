<?php

/*
Plugin Name: Clean Notifications
Plugin URI: http://www.mikeindustries.com/blog/clean-notifications
Description: Make e-mail notifications for new comments/pings cleaner and more readable. No configuration necessary.
Author: Mike Davidson
Version: 1.1
Author URI: http://www.mikeindustries.com/
*/

/*
    Copyright 2008 Mike Davidson

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

if ( ! function_exists('wp_notify_postauthor') ) :
function wp_notify_postauthor($comment_id, $comment_type='') {
	global $wpdb;

	$comment = get_comment($comment_id);
	$post    = get_post($comment->comment_post_ID);
	$user    = get_userdata( $post->post_author );

	if ('' == $user->user_email) return false; // If there's no email to send the comment to

	$comment_author_domain = @gethostbyaddr($comment->comment_author_IP);

	$comment_as_html = str_replace("\r\n","<br />",$comment->comment_content);

	$blogname = get_option('blogname');

	if ( empty( $comment_type ) ) $comment_type = 'comment';

	if ('comment' == $comment_type) {
		$notify_message  = sprintf( __('New comment on <a href="%2$s">"%1$s"</a>'), $post->post_title, get_permalink($comment->comment_post_ID) ) . "<br />";
		$notify_message .= sprintf( __('Author: %1$s (%2$s , %3$s)'), $comment->comment_author, $comment->comment_author_email, $comment_author_domain ) . "<br />";
		$notify_message .= sprintf( __('URL: <a href="%1$s">%1$s</a>'), $comment->comment_author_url ) . "<br /><br />";
		$notify_message .= __('Comment: ') . "<br /><br />" . $comment_as_html . "<br /><br />";
		$subject = sprintf( __('[%1$s] Comment: "%2$s"'), $blogname, $post->post_title );
	} elseif ('trackback' == $comment_type) {
		$notify_message  = sprintf( __('New trackback on <a href="%2$s">"%1$s"</a>'), $post->post_title, get_permalink($comment->comment_post_ID)  ) . "<br />";
		$notify_message .= sprintf( __('Website: %1$s (IP: %2$s , %3$s)'), $comment->comment_author, $comment->comment_author_IP, $comment_author_domain ) . "<br />";
		$notify_message .= sprintf( __('URL: <a href="%1$s">%1$s</a>'), $comment->comment_author_url ) . "<br />";
		$notify_message .= __('Excerpt: ') . "<br /><br />" . $comment_as_html . "<br /><br />";
		$subject = sprintf( __('[%1$s] Trackback: "%2$s"'), $blogname, $post->post_title );
	} elseif ('pingback' == $comment_type) {
		$notify_message  = sprintf( __('New pingback on <a href="%2$s">"%1$s"</a>'), $post->post_title, get_permalink($comment->comment_post_ID)  ) . "<br />";
		$notify_message .= sprintf( __('Website: %1$s (IP: %2$s , %3$s)'), $comment->comment_author, $comment->comment_author_IP, $comment_author_domain ) . "<br />";
		$notify_message .= sprintf( __('URL: <a href="%1$s">%1$s</a>'), $comment->comment_author_url ) . "<br />";
		$notify_message .= __('Excerpt: ') . "<br /><br />" . sprintf('[...] %s [...]', $comment_as_html ) . "<br /><br />";
		$subject = sprintf( __('[%1$s] Pingback: "%2$s"'), $blogname, $post->post_title );
	}
	$notify_message .= sprintf( __('<a href="http://ws.arin.net/cgi-bin/whois.pl?queryinput=%1$s">Lookup IP</a><br /><br />'), $comment->comment_author_IP );			
	$notify_message .= sprintf( __('<a href="%s">Delete</a>'), get_option('siteurl')."/wp-admin/comment.php?action=cdc&c=$comment_id" ) . " | ";
	$notify_message .= sprintf( __('<a href="%s">Spam</a>'), get_option('siteurl')."/wp-admin/comment.php?action=cdc&dt=spam&c=$comment_id" ) . " | ";
	$notify_message .= sprintf( __('<a href="%s">Edit</a>'), get_option('siteurl')."/wp-admin/comment.php?action=editcomment&c=$comment_id" ) ;

	$wp_email = 'wordpress@' . preg_replace('#^www\.#', '', strtolower($_SERVER['SERVER_NAME']));

	if ( '' == $comment->comment_author ) {
		$from = "From: \"$blogname\" <$wp_email>";
		if ( '' != $comment->comment_author_email )
			$reply_to = "Reply-To: $comment->comment_author_email";
	} else {
		$from = "From: \"$comment->comment_author\" <$wp_email>";
		if ( '' != $comment->comment_author_email )
			$reply_to = "Reply-To: \"$comment->comment_author_email\" <$comment->comment_author_email>";
	}

	$message_headers = "MIME-Version: 1.0\n"
		. "$from\n"
		. "Content-Type: text/html; charset=\"" . get_option('blog_charset') . "\"\n";

	if ( isset($reply_to) )
		$message_headers .= $reply_to . "\n";

	$notify_message = apply_filters('comment_notification_text', $notify_message, $comment_id);
	$subject = apply_filters('comment_notification_subject', $subject, $comment_id);
	$message_headers = apply_filters('comment_notification_headers', $message_headers, $comment_id);

	@wp_mail($user->user_email, $subject, $notify_message, $message_headers);
   
	return true;
}
endif;

if ( !function_exists('wp_notify_moderator') ) :
function wp_notify_moderator($comment_id) {
	global $wpdb;

	if( get_option( "moderation_notify" ) == 0 )
		return true; 
    
	$comment = $wpdb->get_row("SELECT * FROM $wpdb->comments WHERE comment_ID='$comment_id' LIMIT 1");
	$post = $wpdb->get_row("SELECT * FROM $wpdb->posts WHERE ID='$comment->comment_post_ID' LIMIT 1");

	$comment_as_html = str_replace("\r\n","<br />",$comment->comment_content);

	$comment_author_domain = @gethostbyaddr($comment->comment_author_IP);
	$comments_waiting = $wpdb->get_var("SELECT count(comment_ID) FROM $wpdb->comments WHERE comment_approved = '0'");

	$notify_message  = sprintf( __('A new comment on <a href="%2$s">"%1$s"</a> is PENDING APPROVAL:'), $post->post_title, get_permalink($comment->comment_post_ID) ) . "<br />";
	$notify_message .= sprintf( __('Author: %1$s (%2$s , %3$s)'), $comment->comment_author, $comment->comment_author_email, $comment_author_domain ) . "<br />";
	$notify_message .= sprintf( __('URL: <a href="%1$s">%1$s</a>'), $comment->comment_author_url ) . "<br /><br />";
	$notify_message .= __('Comment:') . "<br /><br />" . $comment->comment_content . "<br /><br />";
	$notify_message .= sprintf( __('<a href="http://ws.arin.net/cgi-bin/whois.pl?queryinput=%1$s">Lookup IP</a><br /><br />'), $comment->comment_author_IP );			
	$notify_message .= sprintf( __('<a href="%s">Approve</a>'),  get_option('siteurl')."/wp-admin/comment.php?action=mac&c=$comment_id" ) . " | ";
	$notify_message .= sprintf( __('<a href="%s">Delete</a>'), get_option('siteurl')."/wp-admin/comment.php?action=cdc&c=$comment_id" ) . " | ";
	$notify_message .= sprintf( __('<a href="%s">Spam</a>'), get_option('siteurl')."/wp-admin/comment.php?action=cdc&dt=spam&c=$comment_id" ) . "<br /><br />";
	$notify_message .= sprintf( __('Currently %1$s comments are waiting for approval. Please <a href="%2$s">visit the moderation panel</a>.'), $comments_waiting, get_option('siteurl')."/wp-admin/moderation.php" ) . "<br />";

	$subject = sprintf( __('PENDING APPROVAL - [%1$s]: "%2$s"'), get_option('blogname'), $post->post_title );
	$admin_email = get_option('admin_email');

	$notify_message = apply_filters('comment_moderation_text', $notify_message, $comment_id);
	$subject = apply_filters('comment_moderation_subject', $subject, $comment_id);

	$message_headers = "MIME-Version: 1.0\n"
		. "$from\n"
		. "Content-Type: text/html; charset=\"" . get_option('blog_charset') . "\"\n";

	@wp_mail($admin_email, $subject, $notify_message, $message_headers);

	return true;
}
endif;

?>