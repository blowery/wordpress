<?php
/**
 * General template tags that can go anywhere in a template.
 *
 * @package WordPress
 * @subpackage Template
 */

/**
 * Load header template.
 *
 * Includes the header template for a theme or if a name is specified then a
 * specialised header will be included. If the theme contains no header.php file
 * then the header from the default theme will be included.
 *
 * For the parameter, if the file is called "header-special.php" then specify
 * "special".
 *
 * @uses locate_template()
 * @since 1.5.0
 * @uses do_action() Calls 'get_header' action.
 *
 * @param string $name The name of the specialised header.
 */
function get_header( $name = null ) {
	do_action( 'get_header' );

	$templates = array();
	if ( isset($name) )
		$templates[] = "header-{$name}.php";

	$templates[] = "header.php";

	if ('' == locate_template($templates, true))
		load_template( get_theme_root() . '/default/header.php');
}

/**
 * Load footer template.
 *
 * Includes the footer template for a theme or if a name is specified then a
 * specialised footer will be included. If the theme contains no footer.php file
 * then the footer from the default theme will be included.
 *
 * For the parameter, if the file is called "footer-special.php" then specify
 * "special".
 *
 * @uses locate_template()
 * @since 1.5.0
 * @uses do_action() Calls 'get_footer' action.
 *
 * @param string $name The name of the specialised footer.
 */
function get_footer( $name = null ) {
	do_action( 'get_footer' );

	$templates = array();
	if ( isset($name) )
		$templates[] = "footer-{$name}.php";

	$templates[] = "footer.php";

	if ('' == locate_template($templates, true))
		load_template( get_theme_root() . '/default/footer.php');
}

/**
 * Load sidebar template.
 *
 * Includes the sidebar template for a theme or if a name is specified then a
 * specialised sidebar will be included. If the theme contains no sidebar.php
 * file then the sidebar from the default theme will be included.
 *
 * For the parameter, if the file is called "sidebar-special.php" then specify
 * "special".
 *
 * @uses locate_template()
 * @since 1.5.0
 * @uses do_action() Calls 'get_sidebar' action.
 *
 * @param string $name The name of the specialised sidebar.
 */
function get_sidebar( $name = null ) {
	do_action( 'get_sidebar' );

	$templates = array();
	if ( isset($name) )
		$templates[] = "sidebar-{$name}.php";

	$templates[] = "sidebar.php";

	if ('' == locate_template($templates, true))
		load_template( get_theme_root() . '/default/sidebar.php');
}

/**
 * Display the Log In/Out link.
 *
 * Displays a link, which allows the user to navigate to the Login page to login
 * or logout depending on whether or not they are currently logged in.
 *
 * @since 1.5.0
 * @uses apply_filters() Calls 'loginout' hook on HTML link content.
 */
function wp_loginout() {
	if ( ! is_user_logged_in() )
		$link = '<a href="' . site_url('wp-login.php', 'login') . '">' . __('Log in') . '</a>';
	else
		$link = '<a href="' . site_url('wp-login.php?action=logout', 'login') . '">' . __('Log out') . '</a>';

	echo apply_filters('loginout', $link);
}

/**
 * Display the Registration or Admin link.
 *
 * Display a link which allows the user to navigate to the registration page if
 * not logged in and registration is enabled or to the dashboard if logged in.
 * 
 * @since 1.5.0
 * @uses apply_filters() Calls 'register' hook on register / admin link content.
 *
 * @param string $before Text to output before the link (defaults to <li>).
 * @param string $after Text to output after the link (defaults to </li>).
 */
function wp_register( $before = '<li>', $after = '</li>' ) {

	if ( ! is_user_logged_in() ) {
		if ( get_option('users_can_register') )
			$link = $before . '<a href="' . site_url('wp-login.php?action=register', 'login') . '">' . __('Register') . '</a>' . $after;
		else
			$link = '';
	} else {
		$link = $before . '<a href="' . admin_url() . '">' . __('Site Admin') . '</a>' . $after;
	}

	echo apply_filters('register', $link);
}

/**
 * Theme container function for the 'wp_meta' action.
 *
 * The 'wp_meta' action can have several purposes, depending on how you use it,
 * but one purpose might have been to allow for theme switching.
 *
 * @since 1.5.0
 * @link http://trac.wordpress.org/ticket/1458 Explanation of 'wp_meta' action.
 * @uses do_action() Calls 'wp_meta' hook.
 */
function wp_meta() {
	do_action('wp_meta');
}

/**
 * Display information about the blog.
 *
 * @see get_bloginfo() For possible values for the parameter.
 * @since 0.71
 *
 * @param string $show What to display.
 */
function bloginfo($show='') {
	echo get_bloginfo($show, 'display');
}

/**
 * Retrieve information about the blog.
 *
 * Some show parameter values are deprecated and will be removed in future
 * versions. Care should be taken to check the function contents and know what
 * the deprecated blog info options are. Options without "// DEPRECATED" are
 * the preferred and recommended ways to get the information.
 *
 * The possible values for the 'show' parameter are listed below.
 * <ol>
 * <li><strong>url<strong> - Blog URI to homepage.</li>
 * <li><strong>wpurl</strong> - Blog URI path to WordPress.</li>
 * <li><strong>description</strong> - Secondary title</li>
 * </ol>
 *
 * The feed URL options can be retrieved from 'rdf_url' (RSS 0.91),
 * 'rss_url' (RSS 1.0), 'rss2_url' (RSS 2.0), or 'atom_url' (Atom feed). The
 * comment feeds can be retrieved from the 'comments_atom_url' (Atom comment
 * feed) or 'comments_rss2_url' (RSS 2.0 comment feed).
 *
 * There are many other options and you should check the function contents:
 * {@source 32 37}
 *
 * @since 0.71
 *
 * @param string $show Blog info to retrieve.
 * @param string $filter How to filter what is retrieved.
 * @return string Mostly string values, might be empty.
 */
function get_bloginfo($show = '', $filter = 'raw') {

	switch($show) {
		case 'url' :
		case 'home' : // DEPRECATED
		case 'siteurl' : // DEPRECATED
			$output = get_option('home');
			break;
		case 'wpurl' :
			$output = get_option('siteurl');
			break;
		case 'description':
			$output = get_option('blogdescription');
			break;
		case 'rdf_url':
			$output = get_feed_link('rdf');
			break;
		case 'rss_url':
			$output = get_feed_link('rss');
			break;
		case 'rss2_url':
			$output = get_feed_link('rss2');
			break;
		case 'atom_url':
			$output = get_feed_link('atom');
			break;
		case 'comments_atom_url':
			$output = get_feed_link('comments_atom');
			break;
		case 'comments_rss2_url':
			$output = get_feed_link('comments_rss2');
			break;
		case 'pingback_url':
			$output = get_option('siteurl') .'/xmlrpc.php';
			break;
		case 'stylesheet_url':
			$output = get_stylesheet_uri();
			break;
		case 'stylesheet_directory':
			$output = get_stylesheet_directory_uri();
			break;
		case 'template_directory':
		case 'template_url':
			$output = get_template_directory_uri();
			break;
		case 'admin_email':
			$output = get_option('admin_email');
			break;
		case 'charset':
			$output = get_option('blog_charset');
			if ('' == $output) $output = 'UTF-8';
			break;
		case 'html_type' :
			$output = get_option('html_type');
			break;
		case 'version':
			global $wp_version;
			$output = $wp_version;
			break;
		case 'language':
			$output = get_locale();
			$output = str_replace('_', '-', $output);
			break;
		case 'text_direction':
			global $wp_locale;
			$output = $wp_locale->text_direction;
			break;
		case 'name':
		default:
			$output = get_option('blogname');
			break;
	}

	$url = true;
	if (strpos($show, 'url') === false &&
		strpos($show, 'directory') === false &&
		strpos($show, 'home') === false)
		$url = false;

	if ( 'display' == $filter ) {
		if ( $url )
			$output = apply_filters('bloginfo_url', $output, $show);
		else
			$output = apply_filters('bloginfo', $output, $show);
	}

	return $output;
}

/**
 * {@internal Missing Short Description}}
 *
 * {@internal Missing Long Description}}
 *
 * @since 1.0.0
 *
 * @param unknown_type $sep
 * @param unknown_type $display
 * @return unknown
 */
function wp_title($sep = '&raquo;', $display = true, $seplocation = '') {
	global $wpdb, $wp_locale, $wp_query;

	$cat = get_query_var('cat');
	$tag = get_query_var('tag_id');
	$category_name = get_query_var('category_name');
	$author = get_query_var('author');
	$author_name = get_query_var('author_name');
	$m = get_query_var('m');
	$year = get_query_var('year');
	$monthnum = get_query_var('monthnum');
	$day = get_query_var('day');
	$title = '';

	// If there's a category
	if ( !empty($cat) ) {
			// category exclusion
			if ( !stristr($cat,'-') )
				$title = apply_filters('single_cat_title', get_the_category_by_ID($cat));
	} elseif ( !empty($category_name) ) {
		if ( stristr($category_name,'/') ) {
				$category_name = explode('/',$category_name);
				if ( $category_name[count($category_name)-1] )
					$category_name = $category_name[count($category_name)-1]; // no trailing slash
				else
					$category_name = $category_name[count($category_name)-2]; // there was a trailling slash
		}
		$cat = get_term_by('slug', $category_name, 'category', OBJECT, 'display');
		if ( $cat )
			$title = apply_filters('single_cat_title', $cat->name);
	}

	if ( !empty($tag) ) {
		$tag = get_term($tag, 'post_tag', OBJECT, 'display');
		if ( is_wp_error( $tag ) )
			return $tag;
		if ( ! empty($tag->name) )
			$title = apply_filters('single_tag_title', $tag->name);
	}

	// If there's an author
	if ( !empty($author) ) {
		$title = get_userdata($author);
		$title = $title->display_name;
	}
	if ( !empty($author_name) ) {
		// We do a direct query here because we don't cache by nicename.
		$title = $wpdb->get_var($wpdb->prepare("SELECT display_name FROM $wpdb->users WHERE user_nicename = %s", $author_name));
	}

	// If there's a month
	if ( !empty($m) ) {
		$my_year = substr($m, 0, 4);
		$my_month = $wp_locale->get_month(substr($m, 4, 2));
		$my_day = intval(substr($m, 6, 2));
		$title = "$my_year" . ($my_month ? "$sep $my_month" : "") . ($my_day ? "$sep $my_day" : "");
	}

	if ( !empty($year) ) {
		$title = $year;
		if ( !empty($monthnum) )
			$title .= " $sep " . $wp_locale->get_month($monthnum);
		if ( !empty($day) )
			$title .= " $sep " . zeroise($day, 2);
	}

	// If there is a post
	if ( is_single() || is_page() ) {
		$post = $wp_query->get_queried_object();
		$title = strip_tags( apply_filters( 'single_post_title', $post->post_title ) );
	}

	// If there's a taxonomy
	if ( is_tax() ) {
		$taxonomy = get_query_var( 'taxonomy' );
		$tax = get_taxonomy( $taxonomy );
		$tax = $tax->label;
		$term = $wp_query->get_queried_object();
		$term = $term->name;
		if ( 'right' == $seplocation )
			$title = "$term $sep $tax";
		else
			$title = "$tax $sep $term";
	}

	$prefix = '';
	if ( !empty($title) )
		$prefix = " $sep ";

 	// Determines position of the separator
	if ( 'right' == $seplocation )
		$title = $title . $prefix;
	else
		$title = $prefix . $title;

	$title = apply_filters('wp_title', $title, $sep, $seplocation);

	// Send it out
	if ( $display )
		echo $title;
	else
		return $title;

}

/**
 * {@internal Missing Short Description}}
 *
 * {@internal Missing Long Description}}
 *
 * @since 0.71
 * @uses $wpdb
 *
 * @param unknown_type $prefix
 * @param unknown_type $display
 * @return unknown
 */
function single_post_title($prefix = '', $display = true) {
	global $wpdb;
	$p = get_query_var('p');
	$name = get_query_var('name');

	if ( intval($p) || '' != $name ) {
		if ( !$p )
			$p = $wpdb->get_var($wpdb->prepare("SELECT ID FROM $wpdb->posts WHERE post_name = %s", $name));
		$post = & get_post($p);
		$title = $post->post_title;
		$title = apply_filters('single_post_title', $title);
		if ( $display )
			echo $prefix.strip_tags($title);
		else
			return strip_tags($title);
	}
}

/**
 * {@internal Missing Short Description}}
 *
 * {@internal Missing Long Description}}
 *
 * @since 0.71
 *
 * @param unknown_type $prefix
 * @param unknown_type $display
 * @return unknown
 */
function single_cat_title($prefix = '', $display = true ) {
	$cat = intval( get_query_var('cat') );
	if ( !empty($cat) && !(strtoupper($cat) == 'ALL') ) {
		$my_cat_name = apply_filters('single_cat_title', get_the_category_by_ID($cat));
		if ( !empty($my_cat_name) ) {
			if ( $display )
				echo $prefix.strip_tags($my_cat_name);
			else
				return strip_tags($my_cat_name);
		}
	} else if ( is_tag() ) {
		return single_tag_title($prefix, $display);
	}
}

/**
 * {@internal Missing Short Description}}
 *
 * {@internal Missing Long Description}}
 *
 * @since 2.3.0
 *
 * @param unknown_type $prefix
 * @param unknown_type $display
 * @return unknown
 */
function single_tag_title($prefix = '', $display = true ) {
	if ( !is_tag() )
		return;

	$tag_id = intval( get_query_var('tag_id') );

	if ( !empty($tag_id) ) {
		$my_tag = &get_term($tag_id, 'post_tag', OBJECT, 'display');
		if ( is_wp_error( $my_tag ) )
			return false;
		$my_tag_name = apply_filters('single_tag_title', $my_tag->name);
		if ( !empty($my_tag_name) ) {
			if ( $display )
				echo $prefix . $my_tag_name;
			else
				return $my_tag_name;
		}
	}
}

/**
 * {@internal Missing Short Description}}
 *
 * {@internal Missing Long Description}}
 *
 * @since 0.71
 *
 * @param unknown_type $prefix
 * @param unknown_type $display
 * @return unknown
 */
function single_month_title($prefix = '', $display = true ) {
	global $wp_locale;

	$m = get_query_var('m');
	$year = get_query_var('year');
	$monthnum = get_query_var('monthnum');

	if ( !empty($monthnum) && !empty($year) ) {
		$my_year = $year;
		$my_month = $wp_locale->get_month($monthnum);
	} elseif ( !empty($m) ) {
		$my_year = substr($m, 0, 4);
		$my_month = $wp_locale->get_month(substr($m, 4, 2));
	}

	if ( empty($my_month) )
		return false;

	$result = $prefix . $my_month . $prefix . $my_year;

	if ( !$display )
		return $result;
	echo $result;
}

/**
 * {@internal Missing Short Description}}
 *
 * {@internal Missing Long Description}}
 *
 * @since 1.0.0
 * @author Orien
 * @link http://icecode.com/ link navigation hack by Orien
 *
 * @param unknown_type $url
 * @param unknown_type $text
 * @param unknown_type $format
 * @param unknown_type $before
 * @param unknown_type $after
 * @return unknown
 */
function get_archives_link($url, $text, $format = 'html', $before = '', $after = '') {
	$text = wptexturize($text);
	$title_text = attribute_escape($text);
	$url = clean_url($url);

	if ('link' == $format)
		$link_html = "\t<link rel='archives' title='$title_text' href='$url' />\n";
	elseif ('option' == $format)
		$link_html = "\t<option value='$url'>$before $text $after</option>\n";
	elseif ('html' == $format)
		$link_html = "\t<li>$before<a href='$url' title='$title_text'>$text</a>$after</li>\n";
	else // custom
		$link_html = "\t$before<a href='$url' title='$title_text'>$text</a>$after\n";

	$link_html = apply_filters( "get_archives_link", $link_html );

	return $link_html;
}

/**
 * {@internal Missing Short Description}}
 *
 * {@internal Missing Long Description}}
 *
 * @since 1.2.0
 *
 * @param unknown_type $args
 */
function wp_get_archives($args = '') {
	global $wpdb, $wp_locale;

	$defaults = array(
		'type' => 'monthly', 'limit' => '',
		'format' => 'html', 'before' => '',
		'after' => '', 'show_post_count' => false
	);

	$r = wp_parse_args( $args, $defaults );
	extract( $r, EXTR_SKIP );

	if ( '' == $type )
		$type = 'monthly';

	if ( '' != $limit ) {
		$limit = absint($limit);
		$limit = ' LIMIT '.$limit;
	}

	// this is what will separate dates on weekly archive links
	$archive_week_separator = '&#8211;';

	// over-ride general date format ? 0 = no: use the date format set in Options, 1 = yes: over-ride
	$archive_date_format_over_ride = 0;

	// options for daily archive (only if you over-ride the general date format)
	$archive_day_date_format = 'Y/m/d';

	// options for weekly archive (only if you over-ride the general date format)
	$archive_week_start_date_format = 'Y/m/d';
	$archive_week_end_date_format	= 'Y/m/d';

	if ( !$archive_date_format_over_ride ) {
		$archive_day_date_format = get_option('date_format');
		$archive_week_start_date_format = get_option('date_format');
		$archive_week_end_date_format = get_option('date_format');
	}

	//filters
	$where = apply_filters('getarchives_where', "WHERE post_type = 'post' AND post_status = 'publish'", $r );
	$join = apply_filters('getarchives_join', "", $r);

	if ( 'monthly' == $type ) {
		$query = "SELECT DISTINCT YEAR(post_date) AS `year`, MONTH(post_date) AS `month`, count(ID) as posts FROM $wpdb->posts $join $where GROUP BY YEAR(post_date), MONTH(post_date) ORDER BY post_date DESC $limit";
		$key = md5($query);
		$cache = wp_cache_get( 'wp_get_archives' , 'general');
		if ( !isset( $cache[ $key ] ) ) {
			$arcresults = $wpdb->get_results($query);
			$cache[ $key ] = $arcresults;
			wp_cache_add( 'wp_get_archives', $cache, 'general' );
		} else {
			$arcresults = $cache[ $key ];
		}
		if ( $arcresults ) {
			$afterafter = $after;
			foreach ( (array) $arcresults as $arcresult ) {
				$url	= get_month_link($arcresult->year,	$arcresult->month);
				$text = sprintf(__('%1$s %2$d'), $wp_locale->get_month($arcresult->month), $arcresult->year);
				if ( $show_post_count )
					$after = '&nbsp;('.$arcresult->posts.')' . $afterafter;
				echo get_archives_link($url, $text, $format, $before, $after);
			}
		}
	} elseif ('yearly' == $type) {
		$query = "SELECT DISTINCT YEAR(post_date) AS `year`, count(ID) as posts FROM $wpdb->posts $join $where GROUP BY YEAR(post_date) ORDER BY post_date DESC $limit";
		$key = md5($query);
		$cache = wp_cache_get( 'wp_get_archives' , 'general');
		if ( !isset( $cache[ $key ] ) ) {
			$arcresults = $wpdb->get_results($query);
			$cache[ $key ] = $arcresults;
			wp_cache_add( 'wp_get_archives', $cache, 'general' );
		} else {
			$arcresults = $cache[ $key ];
		}
		if ($arcresults) {
			$afterafter = $after;
			foreach ( (array) $arcresults as $arcresult) {
				$url = get_year_link($arcresult->year);
				$text = sprintf('%d', $arcresult->year);
				if ($show_post_count)
					$after = '&nbsp;('.$arcresult->posts.')' . $afterafter;
				echo get_archives_link($url, $text, $format, $before, $after);
			}
		}
	} elseif ( 'daily' == $type ) {
		$query = "SELECT DISTINCT YEAR(post_date) AS `year`, MONTH(post_date) AS `month`, DAYOFMONTH(post_date) AS `dayofmonth`, count(ID) as posts FROM $wpdb->posts $join $where GROUP BY YEAR(post_date), MONTH(post_date), DAYOFMONTH(post_date) ORDER BY post_date DESC $limit";
		$key = md5($query);
		$cache = wp_cache_get( 'wp_get_archives' , 'general');
		if ( !isset( $cache[ $key ] ) ) {
			$arcresults = $wpdb->get_results($query);
			$cache[ $key ] = $arcresults;
			wp_cache_add( 'wp_get_archives', $cache, 'general' );
		} else {
			$arcresults = $cache[ $key ];
		}
		if ( $arcresults ) {
			$afterafter = $after;
			foreach ( (array) $arcresults as $arcresult ) {
				$url	= get_day_link($arcresult->year, $arcresult->month, $arcresult->dayofmonth);
				$date = sprintf('%1$d-%2$02d-%3$02d 00:00:00', $arcresult->year, $arcresult->month, $arcresult->dayofmonth);
				$text = mysql2date($archive_day_date_format, $date);
				if ($show_post_count)
					$after = '&nbsp;('.$arcresult->posts.')'.$afterafter;
				echo get_archives_link($url, $text, $format, $before, $after);
			}
		}
	} elseif ( 'weekly' == $type ) {
		$start_of_week = get_option('start_of_week');
		$query = "SELECT DISTINCT WEEK(post_date, $start_of_week) AS `week`, YEAR(post_date) AS yr, DATE_FORMAT(post_date, '%Y-%m-%d') AS yyyymmdd, count(ID) as posts FROM $wpdb->posts $join $where GROUP BY WEEK(post_date, $start_of_week), YEAR(post_date) ORDER BY post_date DESC $limit";
		$key = md5($query);
		$cache = wp_cache_get( 'wp_get_archives' , 'general');
		if ( !isset( $cache[ $key ] ) ) {
			$arcresults = $wpdb->get_results($query);
			$cache[ $key ] = $arcresults;
			wp_cache_add( 'wp_get_archives', $cache, 'general' );
		} else {
			$arcresults = $cache[ $key ];
		}
		$arc_w_last = '';
		$afterafter = $after;
		if ( $arcresults ) {
				foreach ( (array) $arcresults as $arcresult ) {
					if ( $arcresult->week != $arc_w_last ) {
						$arc_year = $arcresult->yr;
						$arc_w_last = $arcresult->week;
						$arc_week = get_weekstartend($arcresult->yyyymmdd, get_option('start_of_week'));
						$arc_week_start = date_i18n($archive_week_start_date_format, $arc_week['start']);
						$arc_week_end = date_i18n($archive_week_end_date_format, $arc_week['end']);
						$url  = sprintf('%1$s/%2$s%3$sm%4$s%5$s%6$sw%7$s%8$d', get_option('home'), '', '?', '=', $arc_year, '&amp;', '=', $arcresult->week);
						$text = $arc_week_start . $archive_week_separator . $arc_week_end;
						if ($show_post_count)
							$after = '&nbsp;('.$arcresult->posts.')'.$afterafter;
						echo get_archives_link($url, $text, $format, $before, $after);
					}
				}
		}
	} elseif ( ( 'postbypost' == $type ) || ('alpha' == $type) ) {
		('alpha' == $type) ? $orderby = "post_title ASC " : $orderby = "post_date DESC ";
		$query = "SELECT * FROM $wpdb->posts $join $where ORDER BY $orderby $limit";
		$key = md5($query);
		$cache = wp_cache_get( 'wp_get_archives' , 'general');
		if ( !isset( $cache[ $key ] ) ) {
			$arcresults = $wpdb->get_results($query);
			$cache[ $key ] = $arcresults;
			wp_cache_add( 'wp_get_archives', $cache, 'general' );
		} else {
			$arcresults = $cache[ $key ];
		}
		if ( $arcresults ) {
			foreach ( (array) $arcresults as $arcresult ) {
				if ( $arcresult->post_date != '0000-00-00 00:00:00' ) {
					$url  = get_permalink($arcresult);
					$arc_title = $arcresult->post_title;
					if ( $arc_title )
						$text = strip_tags(apply_filters('the_title', $arc_title));
					else
						$text = $arcresult->ID;
					echo get_archives_link($url, $text, $format, $before, $after);
				}
			}
		}
	}
}

/**
 * {@internal Missing Short Description}}
 *
 * {@internal Missing Long Description}}
 *
 * @since 1.5.0
 * @usedby get_calendar()
 *
 * @param int $num Number of day.
 * @return int
 */
function calendar_week_mod($num) {
	$base = 7;
	return ($num - $base*floor($num/$base));
}

/**
 * {@internal Missing Short Description}}
 *
 * {@internal Missing Long Description}}
 *
 * @since 1.0.0
 *
 * @param unknown_type $initial
 */
function get_calendar($initial = true) {
	global $wpdb, $m, $monthnum, $year, $wp_locale, $posts;

	$key = md5( $m . $monthnum . $year );
	if ( $cache = wp_cache_get( 'get_calendar', 'calendar' ) ) {
		if ( isset( $cache[ $key ] ) ) {
			echo $cache[ $key ];
			return;
		}
	}

	ob_start();
	// Quick check. If we have no posts at all, abort!
	if ( !$posts ) {
		$gotsome = $wpdb->get_var("SELECT ID from $wpdb->posts WHERE post_type = 'post' AND post_status = 'publish' ORDER BY post_date DESC LIMIT 1");
		if ( !$gotsome )
			return;
	}

	if ( isset($_GET['w']) )
		$w = ''.intval($_GET['w']);

	// week_begins = 0 stands for Sunday
	$week_begins = intval(get_option('start_of_week'));

	// Let's figure out when we are
	if ( !empty($monthnum) && !empty($year) ) {
		$thismonth = ''.zeroise(intval($monthnum), 2);
		$thisyear = ''.intval($year);
	} elseif ( !empty($w) ) {
		// We need to get the month from MySQL
		$thisyear = ''.intval(substr($m, 0, 4));
		$d = (($w - 1) * 7) + 6; //it seems MySQL's weeks disagree with PHP's
		$thismonth = $wpdb->get_var("SELECT DATE_FORMAT((DATE_ADD('${thisyear}0101', INTERVAL $d DAY) ), '%m')");
	} elseif ( !empty($m) ) {
		$thisyear = ''.intval(substr($m, 0, 4));
		if ( strlen($m) < 6 )
				$thismonth = '01';
		else
				$thismonth = ''.zeroise(intval(substr($m, 4, 2)), 2);
	} else {
		$thisyear = gmdate('Y', current_time('timestamp'));
		$thismonth = gmdate('m', current_time('timestamp'));
	}

	$unixmonth = mktime(0, 0 , 0, $thismonth, 1, $thisyear);

	// Get the next and previous month and year with at least one post
	$previous = $wpdb->get_row("SELECT DISTINCT MONTH(post_date) AS month, YEAR(post_date) AS year
		FROM $wpdb->posts
		WHERE post_date < '$thisyear-$thismonth-01'
		AND post_type = 'post' AND post_status = 'publish'
			ORDER BY post_date DESC
			LIMIT 1");
	$next = $wpdb->get_row("SELECT	DISTINCT MONTH(post_date) AS month, YEAR(post_date) AS year
		FROM $wpdb->posts
		WHERE post_date >	'$thisyear-$thismonth-01'
		AND MONTH( post_date ) != MONTH( '$thisyear-$thismonth-01' )
		AND post_type = 'post' AND post_status = 'publish'
			ORDER	BY post_date ASC
			LIMIT 1");

	echo '<table id="wp-calendar" summary="' . __('Calendar') . '">
	<caption>' . sprintf(_c('%1$s %2$s|Used as a calendar caption'), $wp_locale->get_month($thismonth), date('Y', $unixmonth)) . '</caption>
	<thead>
	<tr>';

	$myweek = array();

	for ( $wdcount=0; $wdcount<=6; $wdcount++ ) {
		$myweek[] = $wp_locale->get_weekday(($wdcount+$week_begins)%7);
	}

	foreach ( $myweek as $wd ) {
		$day_name = (true == $initial) ? $wp_locale->get_weekday_initial($wd) : $wp_locale->get_weekday_abbrev($wd);
		echo "\n\t\t<th abbr=\"$wd\" scope=\"col\" title=\"$wd\">$day_name</th>";
	}

	echo '
	</tr>
	</thead>

	<tfoot>
	<tr>';

	if ( $previous ) {
		echo "\n\t\t".'<td abbr="' . $wp_locale->get_month($previous->month) . '" colspan="3" id="prev"><a href="' .
		get_month_link($previous->year, $previous->month) . '" title="' . sprintf(__('View posts for %1$s %2$s'), $wp_locale->get_month($previous->month),
			date('Y', mktime(0, 0 , 0, $previous->month, 1, $previous->year))) . '">&laquo; ' . $wp_locale->get_month_abbrev($wp_locale->get_month($previous->month)) . '</a></td>';
	} else {
		echo "\n\t\t".'<td colspan="3" id="prev" class="pad">&nbsp;</td>';
	}

	echo "\n\t\t".'<td class="pad">&nbsp;</td>';

	if ( $next ) {
		echo "\n\t\t".'<td abbr="' . $wp_locale->get_month($next->month) . '" colspan="3" id="next"><a href="' .
		get_month_link($next->year, $next->month) . '" title="' . sprintf(__('View posts for %1$s %2$s'), $wp_locale->get_month($next->month),
			date('Y', mktime(0, 0 , 0, $next->month, 1, $next->year))) . '">' . $wp_locale->get_month_abbrev($wp_locale->get_month($next->month)) . ' &raquo;</a></td>';
	} else {
		echo "\n\t\t".'<td colspan="3" id="next" class="pad">&nbsp;</td>';
	}

	echo '
	</tr>
	</tfoot>

	<tbody>
	<tr>';

	// Get days with posts
	$dayswithposts = $wpdb->get_results("SELECT DISTINCT DAYOFMONTH(post_date)
		FROM $wpdb->posts WHERE MONTH(post_date) = '$thismonth'
		AND YEAR(post_date) = '$thisyear'
		AND post_type = 'post' AND post_status = 'publish'
		AND post_date < '" . current_time('mysql') . '\'', ARRAY_N);
	if ( $dayswithposts ) {
		foreach ( (array) $dayswithposts as $daywith ) {
			$daywithpost[] = $daywith[0];
		}
	} else {
		$daywithpost = array();
	}

	if (strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== false || strpos(strtolower($_SERVER['HTTP_USER_AGENT']), 'camino') !== false || strpos(strtolower($_SERVER['HTTP_USER_AGENT']), 'safari') !== false)
		$ak_title_separator = "\n";
	else
		$ak_title_separator = ', ';

	$ak_titles_for_day = array();
	$ak_post_titles = $wpdb->get_results("SELECT post_title, DAYOFMONTH(post_date) as dom "
		."FROM $wpdb->posts "
		."WHERE YEAR(post_date) = '$thisyear' "
		."AND MONTH(post_date) = '$thismonth' "
		."AND post_date < '".current_time('mysql')."' "
		."AND post_type = 'post' AND post_status = 'publish'"
	);
	if ( $ak_post_titles ) {
		foreach ( (array) $ak_post_titles as $ak_post_title ) {

				$post_title = apply_filters( "the_title", $ak_post_title->post_title );
				$post_title = str_replace('"', '&quot;', wptexturize( $post_title ));

				if ( empty($ak_titles_for_day['day_'.$ak_post_title->dom]) )
					$ak_titles_for_day['day_'.$ak_post_title->dom] = '';
				if ( empty($ak_titles_for_day["$ak_post_title->dom"]) ) // first one
					$ak_titles_for_day["$ak_post_title->dom"] = $post_title;
				else
					$ak_titles_for_day["$ak_post_title->dom"] .= $ak_title_separator . $post_title;
		}
	}


	// See how much we should pad in the beginning
	$pad = calendar_week_mod(date('w', $unixmonth)-$week_begins);
	if ( 0 != $pad )
		echo "\n\t\t".'<td colspan="'.$pad.'" class="pad">&nbsp;</td>';

	$daysinmonth = intval(date('t', $unixmonth));
	for ( $day = 1; $day <= $daysinmonth; ++$day ) {
		if ( isset($newrow) && $newrow )
			echo "\n\t</tr>\n\t<tr>\n\t\t";
		$newrow = false;

		if ( $day == gmdate('j', (time() + (get_option('gmt_offset') * 3600))) && $thismonth == gmdate('m', time()+(get_option('gmt_offset') * 3600)) && $thisyear == gmdate('Y', time()+(get_option('gmt_offset') * 3600)) )
			echo '<td id="today">';
		else
			echo '<td>';

		if ( in_array($day, $daywithpost) ) // any posts today?
				echo '<a href="' . get_day_link($thisyear, $thismonth, $day) . "\" title=\"$ak_titles_for_day[$day]\">$day</a>";
		else
			echo $day;
		echo '</td>';

		if ( 6 == calendar_week_mod(date('w', mktime(0, 0 , 0, $thismonth, $day, $thisyear))-$week_begins) )
			$newrow = true;
	}

	$pad = 7 - calendar_week_mod(date('w', mktime(0, 0 , 0, $thismonth, $day, $thisyear))-$week_begins);
	if ( $pad != 0 && $pad != 7 )
		echo "\n\t\t".'<td class="pad" colspan="'.$pad.'">&nbsp;</td>';

	echo "\n\t</tr>\n\t</tbody>\n\t</table>";

	$output = ob_get_contents();
	ob_end_clean();
	echo $output;
	$cache[ $key ] = $output;
	wp_cache_set( 'get_calendar', $cache, 'calendar' );
}

/**
 * Purge the cached results of get_calendar.
 * 
 * @see get_calendar
 * @since 2.1.0
 */
function delete_get_calendar_cache() {
	wp_cache_delete( 'get_calendar', 'calendar' );
}
add_action( 'save_post', 'delete_get_calendar_cache' );
add_action( 'delete_post', 'delete_get_calendar_cache' );
add_action( 'update_option_start_of_week', 'delete_get_calendar_cache' );
add_action( 'update_option_gmt_offset', 'delete_get_calendar_cache' );
add_action( 'update_option_start_of_week', 'delete_get_calendar_cache' );

/**
 * {@internal Missing Short Description}}
 *
 * {@internal Missing Long Description}}
 *
 * @since 1.0.1
 * @uses $allowedtags
 *
 * @return unknown
 */
function allowed_tags() {
	global $allowedtags;
	$allowed = '';
	foreach ( (array) $allowedtags as $tag => $attributes ) {
		$allowed .= '<'.$tag;
		if ( 0 < count($attributes) ) {
			foreach ( $attributes as $attribute => $limits ) {
				$allowed .= ' '.$attribute.'=""';
			}
		}
		$allowed .= '> ';
	}
	return htmlentities($allowed);
}

/***** Date/Time tags *****/

/**
 * Outputs the date in iso8601 format for xml files.
 *
 * @since 1.0.0
 */
function the_date_xml() {
	global $post;
	echo mysql2date('Y-m-d', $post->post_date);
}

/**
 * Display or Retrieve the date the post was written.
 *
 * Will only output the date if the current post's date is different from the
 * previous one output.
 *
 * @since 0.71
 *
 * @param string $d Optional. PHP date format defaults to the date_format option if not specified.
 * @param string $before Optional. Output before the date.
 * @param string $after Optional. Output after the date.
 * @param bool $echo Optional, default is display. Whether to echo the date or return it.
 * @return string|null Null if displaying, string if retrieving.
 */
function the_date($d='', $before='', $after='', $echo = true) {
	global $post, $day, $previousday;
	$the_date = '';
	if ( $day != $previousday ) {
		$the_date .= $before;
		if ( $d=='' )
			$the_date .= mysql2date(get_option('date_format'), $post->post_date);
		else
			$the_date .= mysql2date($d, $post->post_date);
		$the_date .= $after;
		$previousday = $day;
	}
	$the_date = apply_filters('the_date', $the_date, $d, $before, $after);
	if ( $echo )
		echo $the_date;
	else
		return $the_date;
}

/**
 * Display the date on which the post was last modified.
 *
 * @since 2.1.0
 *
 * @param string $d Optional. PHP date format.
 * @return string
 */
function the_modified_date($d = '') {
	echo apply_filters('the_modified_date', get_the_modified_date($d), $d);
}

/**
 * Retrieve the date on which the post was last modified.
 *
 * @since 2.1.0
 *
 * @param string $d Optional. PHP date format. Defaults to the "date_format" option
 * @return string
 */
function get_the_modified_date($d = '') {
	if ( '' == $d )
		$the_time = get_post_modified_time(get_option('date_format'));
	else
		$the_time = get_post_modified_time($d);
	return apply_filters('get_the_modified_date', $the_time, $d);
}

/**
 * Display the time at which the post was written.
 *
 * @since 0.71
 *
 * @param string $d Either 'G', 'U', or php date format.
 */
function the_time( $d = '' ) {
	echo apply_filters('the_time', get_the_time( $d ), $d);
}

/**
 * Retrieve the time at which the post was written.
 *
 * @since 1.5.0
 *
 * @param string $d Either 'G', 'U', or php date format defaults to the value specified in the time_format option.
 * @return string
 */
function get_the_time( $d = '' ) {
	if ( '' == $d )
		$the_time = get_post_time(get_option('time_format'));
	else
		$the_time = get_post_time($d);
	return apply_filters('get_the_time', $the_time, $d);
}

/**
 * Retrieve the time at which the post was written.
 *
 * @since 2.0.0
 *
 * @param string $d Either 'G', 'U', or php date format.
 * @param bool $gmt Whether of not to return the gmt time.
 * @return string
 */
function get_post_time( $d = 'U', $gmt = false ) { // returns timestamp
	global $post;
	if ( $gmt )
		$time = $post->post_date_gmt;
	else
		$time = $post->post_date;

	$time = mysql2date($d, $time);
	return apply_filters('get_post_time', $time, $d, $gmt);
}

/**
 * Display the time at which the post was last modified.
 *
 * @since 2.0.0
 *
 * @param string $d Either 'G', 'U', or php date format defaults to the value specified in the time_format option.
 */
function the_modified_time($d = '') {
	echo apply_filters('the_modified_time', get_the_modified_time($d), $d);
}

/**
 * Retrieve the time at which the post was last modified.
 *
 * @since 2.0.0
 *
 * @param string $d Either 'G', 'U', or php date format defaults to the value specified in the time_format option.
 * @return string
 */
function get_the_modified_time($d = '') {
	if ( '' == $d )
		$the_time = get_post_modified_time(get_option('time_format'));
	else
		$the_time = get_post_modified_time($d);
	return apply_filters('get_the_modified_time', $the_time, $d);
}

/**
 * Retrieve the time at which the post was last modified.
 *
 * @since 2.0.0
 *
 * @param string $d Either 'G', 'U', or php date format.
 * @param bool $gmt Whether of not to return the gmt time.
 * @return string Returns timestamp
 */
function get_post_modified_time( $d = 'U', $gmt = false ) {
	global $post;

	if ( $gmt )
		$time = $post->post_modified_gmt;
	else
		$time = $post->post_modified;
	$time = mysql2date($d, $time);

	return apply_filters('get_the_modified_time', $time, $d, $gmt);
}

/**
 * Display the weekday on which the post was written.
 *
 * @since 0.71
 * @uses $wp_locale
 * @uses $post
 */
function the_weekday() {
	global $wp_locale, $post;
	$the_weekday = $wp_locale->get_weekday(mysql2date('w', $post->post_date));
	$the_weekday = apply_filters('the_weekday', $the_weekday);
	echo $the_weekday;
}

/**
 * Display the weekday on which the post was written.
 *
 * Will only output the weekday if the current post's weekday is different from
 * the previous one output.
 *
 * @since 0.71
 *
 * @param string $before output before the date.
 * @param string $after output after the date.
  */
function the_weekday_date($before='',$after='') {
	global $wp_locale, $post, $day, $previousweekday;
	$the_weekday_date = '';
	if ( $day != $previousweekday ) {
		$the_weekday_date .= $before;
		$the_weekday_date .= $wp_locale->get_weekday(mysql2date('w', $post->post_date));
		$the_weekday_date .= $after;
		$previousweekday = $day;
	}
	$the_weekday_date = apply_filters('the_weekday_date', $the_weekday_date, $before, $after);
	echo $the_weekday_date;
}

/**
 * Fire the wp_head action
 *
 * @since 1.2.0
 * @uses do_action() Calls 'wp_head' hook.
 */
function wp_head() {
	do_action('wp_head');
}

/**
 * Fire the wp_footer action
 *
 * @since 1.5.1
 * @uses do_action() Calls 'wp_footer' hook.
 */
function wp_footer() {
	do_action('wp_footer');
}

/**
 * Display the link to the Really Simple Discovery service endpoint.
 *
 * @link http://archipelago.phrasewise.com/rsd
 * @since 2.0.0
 */
function rsd_link() {
	echo '<link rel="EditURI" type="application/rsd+xml" title="RSD" href="' . get_bloginfo('wpurl') . "/xmlrpc.php?rsd\" />\n";
}

/**
 * Display the link to the Windows Live Writer manifest file.
 *
 * @link http://msdn.microsoft.com/en-us/library/bb463265.aspx
 * @since 2.3.1
 */
function wlwmanifest_link() {
	echo '<link rel="wlwmanifest" type="application/wlwmanifest+xml" href="'
		. get_bloginfo('wpurl') . '/wp-includes/wlwmanifest.xml" /> ' . "\n";
}

/**
 * Display a noindex meta tag if required by the blog configuration.
 *
 * If a blog is marked as not being public then the noindex meta tag will be
 * output to tell web robots not to index the page content.
 *
 * @since 2.1.0
 */
function noindex() {
	// If the blog is not public, tell robots to go away.
	if ( '0' == get_option('blog_public') )
		echo "<meta name='robots' content='noindex,nofollow' />\n";
}

/**
 * Determine if TinyMCE is available.
 *
 * Checks to see if the user has deleted the tinymce files to slim down there WordPress install.
 *
 * @since 2.1.0
 *
 * @return bool Whether of not TinyMCE exists.
 */
function rich_edit_exists() {
	global $wp_rich_edit_exists;
	if ( !isset($wp_rich_edit_exists) )
		$wp_rich_edit_exists = file_exists(ABSPATH . WPINC . '/js/tinymce/tiny_mce.js');
	return $wp_rich_edit_exists;
}

/**
 * Whether or not the user should have a WYSIWIG editor.
 *
 * Checks that the user requires a WYSIWIG editor and that the editor is
 * supported in the users browser.
 *
 * @since 2.0.0
 *
 * @return bool
 */
function user_can_richedit() {
	global $wp_rich_edit, $pagenow;

	if ( !isset( $wp_rich_edit) ) {
		if ( get_user_option( 'rich_editing' ) == 'true' &&
			( ( preg_match( '!AppleWebKit/(\d+)!', $_SERVER['HTTP_USER_AGENT'], $match ) && intval($match[1]) >= 420 ) ||
				!preg_match( '!opera[ /][2-8]|konqueror|safari!i', $_SERVER['HTTP_USER_AGENT'] ) )
				&& 'comment.php' != $pagenow ) {
			$wp_rich_edit = true;
		} else {
			$wp_rich_edit = false;
		}
	}

	return apply_filters('user_can_richedit', $wp_rich_edit);
}

/**
 * Find out which editor should be displayed by default.
 *
 * Works out which of the two editors to display as the current editor for a
 * user.
 *
 * @since 2.5.0
 *
 * @return string Either 'tinymce', or 'html', or 'test'
 */
function wp_default_editor() {
	$r = user_can_richedit() ? 'tinymce' : 'html'; // defaults
	if ( $user = wp_get_current_user() ) { // look for cookie
		$ed = get_user_setting('editor', 'tinymce');
		$r = ( in_array($ed, array('tinymce', 'html', 'test') ) ) ? $ed : $r;
	}
	return apply_filters( 'wp_default_editor', $r ); // filter
}

/**
 * {@internal Missing Short Description}}
 *
 * {@internal Missing Long Description}}
 *
 * @since 2.1.0
 *
 * @param unknown_type $content
 * @param unknown_type $id
 * @param unknown_type $prev_id
 */
function the_editor($content, $id = 'content', $prev_id = 'title', $media_buttons = true, $tab_index = 2) {
	$rows = get_option('default_post_edit_rows');
	if (($rows < 3) || ($rows > 100))
		$rows = 12;

	$rows = "rows='$rows'";	?>
	<div id="editor-toolbar">
	<?php if ( user_can_richedit() ) {
		$wp_default_editor = wp_default_editor(); ?>
		<div class="zerosize"><input accesskey="e" type="button" onclick="switchEditors.go('<?php echo $id; ?>')" /></div>
		<?php if ( 'tinymce' == $wp_default_editor ) {
			add_filter('the_editor_content', 'wp_richedit_pre'); ?>
			<a id="edButtonHTML" onclick="switchEditors.go('<?php echo $id; ?>');"><?php _e('HTML'); ?></a>
			<a id="edButtonPreview" class="active"><?php _e('Visual'); ?></a>
		<?php } elseif ( 'html' == $wp_default_editor ) {
			add_filter('the_editor_content', 'wp_htmledit_pre'); ?>
			<a id="edButtonHTML" class="active"><?php _e('HTML'); ?></a>
			<a id="edButtonPreview" onclick="switchEditors.go('<?php echo $id; ?>');"><?php _e('Visual'); ?></a>
		<?php }
	}

/*	if ( $media_buttons ) { ?>
		<div id="media-buttons" class="hide-if-no-js">
		<?php do_action( 'media_buttons' ); ?>
		</div>
	<?php } */ ?>
	</div>

	<div id="quicktags">
	<?php wp_print_scripts( 'quicktags' ); ?>
	<script type="text/javascript">edToolbar()</script>
	</div>

	<?php $the_editor = apply_filters('the_editor', "<div id='editorcontainer'><textarea $rows cols='40' name='$id' tabindex='$tab_index' id='$id'>%s</textarea></div>\n");
	$the_editor_content = apply_filters('the_editor_content', $content);

	printf($the_editor, $the_editor_content);

	?>
	<script type="text/javascript">
	// <![CDATA[
	edCanvas = document.getElementById('<?php echo $id; ?>');
	<?php if ( user_can_richedit() && $prev_id ) { ?>
	// If tinyMCE is defined.
	if ( typeof tinyMCE != 'undefined' ) {
		// This code is meant to allow tabbing from Title to Post (TinyMCE).
		document.getElementById('<?php echo $prev_id; ?>').onkeydown = function (e) {
			e = e || window.event;
			if (e.keyCode == 9 && !e.shiftKey && !e.controlKey && !e.altKey) {
				if ( tinyMCE.activeEditor ) {
					if ( (jQuery("#post_ID").val() < 1) && (jQuery("#title").val().length > 0) ) { autosave(); }
					e = null;
					if ( tinyMCE.activeEditor.isHidden() ) return true;
					tinyMCE.activeEditor.focus();
					return false;
				}
				return true;
			}
		}
	}
	<?php } ?>
	// ]]>
	</script>
	<?php
}

/**
 * Retrieve the contents of the search WordPress query variable.
 *
 * @since 2.3.0
 *
 * @return string
 */
function get_search_query() {
	return apply_filters( 'get_search_query', stripslashes( get_query_var( 's' ) ) );
}

/**
 * Display the contents of the search query variable.
 * 
 * The search query string is passed through {@link attribute_escape()}
 * to ensure that it is safe for placing in an html attribute.
 *
 * @uses attribute_escape
 * @since 2.1.0
 */
function the_search_query() {
	echo attribute_escape( apply_filters( 'the_search_query', get_search_query() ) );
}

/**
 * Display the language attributes for the html tag.
 *
 * Builds up a set of html attributes containing the text direction and language
 * information for the page.
 *
 * @since 2.1.0
 *
 * @param string $doctype The type of html document (xhtml|html).
 */
function language_attributes($doctype = 'html') {
	$attributes = array();
	$output = '';

	if ( $dir = get_bloginfo('text_direction') )
		$attributes[] = "dir=\"$dir\"";

	if ( $lang = get_bloginfo('language') ) {
		if ( get_option('html_type') == 'text/html' || $doctype == 'xhtml' )
			$attributes[] = "lang=\"$lang\"";

		if ( get_option('html_type') != 'text/html' || $doctype == 'xhtml' )
			$attributes[] = "xml:lang=\"$lang\"";
	}

	$output = implode(' ', $attributes);
	$output = apply_filters('language_attributes', $output);
	echo $output;
}

/**
 * {@internal Missing Short Description}}
 *
 * {@internal Missing Long Description}}
 *
 * @since 2.1.0
 *
 * @param unknown_type $args
 * @return unknown
 */
function paginate_links( $args = '' ) {
	$defaults = array(
		'base' => '%_%', // http://example.com/all_posts.php%_% : %_% is replaced by format (below)
		'format' => '?page=%#%', // ?page=%#% : %#% is replaced by the page number
		'total' => 1,
		'current' => 0,
		'show_all' => false,
		'prev_next' => true,
		'prev_text' => __('&laquo; Previous'),
		'next_text' => __('Next &raquo;'),
		'end_size' => 1, // How many numbers on either end including the end
		'mid_size' => 2, // How many numbers to either side of current not including current
		'type' => 'plain',
		'add_args' => false // array of query args to aadd
	);

	$args = wp_parse_args( $args, $defaults );
	extract($args, EXTR_SKIP);

	// Who knows what else people pass in $args
	$total	= (int) $total;
	if ( $total < 2 )
		return;
	$current  = (int) $current;
	$end_size = 0  < (int) $end_size ? (int) $end_size : 1; // Out of bounds?  Make it the default.
	$mid_size = 0 <= (int) $mid_size ? (int) $mid_size : 2;
	$add_args = is_array($add_args) ? $add_args : false;
	$r = '';
	$page_links = array();
	$n = 0;
	$dots = false;

	if ( $prev_next && $current && 1 < $current ) :
		$link = str_replace('%_%', 2 == $current ? '' : $format, $base);
		$link = str_replace('%#%', $current - 1, $link);
		if ( $add_args )
			$link = add_query_arg( $add_args, $link );
		$page_links[] = "<a class='prev page-numbers' href='" . clean_url($link) . "'>$prev_text</a>";
	endif;
	for ( $n = 1; $n <= $total; $n++ ) :
		if ( $n == $current ) :
			$page_links[] = "<span class='page-numbers current'>$n</span>";
			$dots = true;
		else :
			if ( $show_all || ( $n <= $end_size || ( $current && $n >= $current - $mid_size && $n <= $current + $mid_size ) || $n > $total - $end_size ) ) :
				$link = str_replace('%_%', 1 == $n ? '' : $format, $base);
				$link = str_replace('%#%', $n, $link);
				if ( $add_args )
					$link = add_query_arg( $add_args, $link );
				$page_links[] = "<a class='page-numbers' href='" . clean_url($link) . "'>$n</a>";
				$dots = true;
			elseif ( $dots && !$show_all ) :
				$page_links[] = "<span class='page-numbers dots'>...</span>";
				$dots = false;
			endif;
		endif;
	endfor;
	if ( $prev_next && $current && ( $current < $total || -1 == $total ) ) :
		$link = str_replace('%_%', $format, $base);
		$link = str_replace('%#%', $current + 1, $link);
		if ( $add_args )
			$link = add_query_arg( $add_args, $link );
		$page_links[] = "<a class='next page-numbers' href='" . clean_url($link) . "'>$next_text</a>";
	endif;
	switch ( $type ) :
		case 'array' :
			return $page_links;
			break;
		case 'list' :
			$r .= "<ul class='page-numbers'>\n\t<li>";
			$r .= join("</li>\n\t<li>", $page_links);
			$r .= "</li>\n</ul>\n";
			break;
		default :
			$r = join("\n", $page_links);
			break;
	endswitch;
	return $r;
}

/**
 * Registers an admin colour scheme css file.
 *
 * Allows a plugin to register a new admin colour scheme. For example:
 * <code>
 * wp_admin_css_color('classic', __('Classic'), admin_url("css/colors-classic.css"),
 * array('#07273E', '#14568A', '#D54E21', '#2683AE'));
 * </code>
 *
 * @since 2.5.0
 *
 * @param string $key The unique key for this theme.
 * @param string $name The name of the theme.
 * @param string $url The url of the css file containing the colour scheme.
 * @param array @colors An array of CSS color definitions which are used to give the user a feel for the theme.
 */
function wp_admin_css_color($key, $name, $url, $colors = array()) {
	global $_wp_admin_css_colors;

	if ( !isset($_wp_admin_css_colors) )
		$_wp_admin_css_colors = array();

	$_wp_admin_css_colors[$key] = (object) array('name' => $name, 'url' => $url, 'colors' => $colors);
}

/**
 * Display the URL of a WordPress admin CSS file.
 *
 * @see WP_Styles::_css_href and its style_loader_src filter.
 *
 * @since 2.3.0
 *
 * @param string $file file relative to wp-admin/ without its ".css" extension.
 */
function wp_admin_css_uri( $file = 'wp-admin' ) {
	if ( defined('WP_INSTALLING') ) {
		$_file = "./$file.css";
	} else {
		$_file = admin_url("$file.css");
	}
	$_file = add_query_arg( 'version', get_bloginfo( 'version' ),  $_file );

	return apply_filters( 'wp_admin_css_uri', $_file, $file );
}

/**
 * Enqueues or directly prints a stylesheet link to the specified CSS file.
 *
 * "Intelligently" decides to enqueue or to print the CSS file. If the
 * 'wp_print_styles' action has *not* yet been called, the CSS file will be
 * enqueued. If the wp_print_styles action *has* been called, the CSS link will
 * be printed. Printing may be forced by passing TRUE as the $force_echo
 * (second) parameter.
 *
 * For backward compatibility with WordPress 2.3 calling method: If the $file
 * (first) parameter does not correspond to a registered CSS file, we assume
 * $file is a file relative to wp-admin/ without its ".css" extension. A
 * stylesheet link to that generated URL is printed.
 *
 * @package WordPress
 * @since 2.3.0
 * @uses $wp_styles WordPress Styles Object
 *
 * @param string $file Style handle name or file name (without ".css" extension) relative to wp-admin/
 * @param bool $force_echo Optional.  Force the stylesheet link to be printed rather than enqueued.
 */

function wp_admin_css( $file = 'wp-admin', $force_echo = false ) {
	global $wp_styles;
	if ( !is_a($wp_styles, 'WP_Styles') )
		$wp_styles = new WP_Styles();

	// For backward compatibility
	$handle = 0 === strpos( $file, 'css/' ) ? substr( $file, 4 ) : $file;

	if ( $wp_styles->query( $handle ) ) {
		if ( $force_echo || did_action( 'wp_print_styles' ) ) // we already printed the style queue.  Print this one immediately
			wp_print_styles( $handle );
		else // Add to style queue
			wp_enqueue_style( $handle );
		return;
	}

	echo apply_filters( 'wp_admin_css', "<link rel='stylesheet' href='" . clean_url( wp_admin_css_uri( $file ) ) . "' type='text/css' />\n", $file );
	if ( 'rtl' == get_bloginfo( 'text_direction' ) )
		echo apply_filters( 'wp_admin_css', "<link rel='stylesheet' href='" . clean_url( wp_admin_css_uri( "$file-rtl" ) ) . "' type='text/css' />\n", "$file-rtl" );
}

/**
 * Enqueues the default ThickBox js and css. 
 * 
 * If any of the settings need to be changed, this can be done with another js
 * file similar to media-upload.js and theme-preview.js. That file should
 * require array('thickbox') to ensure it is loaded after.
 *
 * @since 2.5.0
 */
function add_thickbox() {
	wp_enqueue_script( 'thickbox' );
	wp_enqueue_style( 'thickbox' );
}

/**
 * Display the XHTML generator that is generated on the wp_head hook.
 *
 * @since 2.5.0
 */
function wp_generator() {
	the_generator( apply_filters( 'wp_generator_type', 'xhtml' ) );
}

/**
 * Display the generator XML or Comment for RSS, ATOM, etc.
 *
 * Returns the correct generator type for the requested output format. Allows
 * for a plugin to filter generators overall the the_generator filter.
 *
 * @since 2.5.0
 * @uses apply_filters() Calls 'the_generator' hook.
 *
 * @param string $type The type of generator to output - (html|xhtml|atom|rss2|rdf|comment|export).
 */
function the_generator( $type ) {
	echo apply_filters('the_generator', get_the_generator($type), $type) . "\n";
}

/**
 * Creates the generator XML or Comment for RSS, ATOM, etc.
 *
 * Returns the correct generator type for the requested output format. Allows
 * for a plugin to filter generators on an individual basis using the
 * 'get_the_generator_{$type}' filter.
 *
 * @since 2.5.0
 * @uses apply_filters() Calls 'get_the_generator_$type' hook.
 *
 * @param string $type The type of generator to return - (html|xhtml|atom|rss2|rdf|comment|export).
 * @return string The HTML content for the generator.
 */
function get_the_generator( $type ) {
	switch ($type) {
		case 'html':
			$gen = '<meta name="generator" content="WordPress ' . get_bloginfo( 'version' ) . '">' . "\n";
			break;
		case 'xhtml':
			$gen = '<meta name="generator" content="WordPress ' . get_bloginfo( 'version' ) . '" />' . "\n";
			break;
		case 'atom':
			$gen = '<generator uri="http://wordpress.org/" version="' . get_bloginfo_rss( 'version' ) . '">WordPress</generator>';
			break;
		case 'rss2':
			$gen = '<generator>http://wordpress.org/?v=' . get_bloginfo_rss( 'version' ) . '</generator>';
			break;
		case 'rdf':
			$gen = '<admin:generatorAgent rdf:resource="http://wordpress.org/?v=' . get_bloginfo_rss( 'version' ) . '" />';
			break;
		case 'comment':
			$gen = '<!-- generator="WordPress/' . get_bloginfo( 'version' ) . '" -->';
			break;
		case 'export':
			$gen = '<!-- generator="WordPress/' . get_bloginfo_rss('version') . '" created="'. date('Y-m-d H:i') . '"-->';
			break;
	}
	return apply_filters( "get_the_generator_{$type}", $gen, $type );
}

?>
