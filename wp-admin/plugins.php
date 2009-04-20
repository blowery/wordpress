<?php
/**
 * Plugins administration panel.
 *
 * @package WordPress
 * @subpackage Administration
 */

/** WordPress Administration Bootstrap */
require_once('admin.php');

if ( isset($_POST['clear-recent-list']) )
	$action = 'clear-recent-list';
elseif ( isset($_GET['action']) )
	$action = $_GET['action'];
elseif ( isset($_POST['action']) )
	$action = $_POST['action'];
else
	$action = false;

$plugin = isset($_REQUEST['plugin']) ? $_REQUEST['plugin'] : '';

if( !empty($action) ) {
	switch( $action ) {
		case 'activate':
			check_admin_referer('activate-plugin_' . $plugin);
			$result = activate_plugin($plugin, 'plugins.php?error=true&plugin=' . $plugin);
			if ( is_wp_error( $result ) )
				wp_die($result);
			$recent = (array)get_option('recently_activated');
			if ( isset($recent[ $plugin ]) ) {
				unset($recent[ $plugin ]);
				update_option('recently_activated', $recent);
			}
			wp_redirect('plugins.php?activate=true'); // overrides the ?error=true one above
			exit;
			break;
		case 'activate-selected':
			check_admin_referer('bulk-manage-plugins');
			activate_plugins($_POST['checked'], 'plugins.php?error=true');

			$recent = (array)get_option('recently_activated');
			foreach( (array)$_POST['checked'] as $plugin => $time) {
				if ( isset($recent[ $plugin ]) )
					unset($recent[ $plugin ]);
			}
			if( $recent != get_option('recently_activated') ) //If array changed, update it.
				update_option('recently_activated', $recent);

			wp_redirect('plugins.php?activate-multi=true');
			exit;
			break;
		case 'error_scrape':
			check_admin_referer('plugin-activation-error_' . $plugin);
			$valid = validate_plugin($plugin);
			if ( is_wp_error($valid) )
				wp_die($valid);
			error_reporting( E_ALL ^ E_NOTICE );
			@ini_set('display_errors', true); //Ensure that Fatal errors are displayed.
			include(WP_PLUGIN_DIR . '/' . $plugin);
			do_action('activate_' . $plugin);
			exit;
			break;
		case 'deactivate':
			check_admin_referer('deactivate-plugin_' . $plugin);
			deactivate_plugins($plugin);
			update_option('recently_activated', array($plugin => time()) + (array)get_option('recently_activated'));
			wp_redirect('plugins.php?deactivate=true');
			exit;
			break;
		case 'deactivate-selected':
			check_admin_referer('bulk-manage-plugins');
			deactivate_plugins($_POST['checked']);
			$deactivated = array();
			foreach ( (array)$_POST['checked'] as $plugin )
				$deactivated[ $plugin ] = time();
			update_option('recently_activated', $deactivated + (array)get_option('recently_activated'));
			wp_redirect('plugins.php?deactivate-multi=true');
			exit;
			break;
		case 'delete-selected':
			if ( ! current_user_can('delete_plugins') )
				wp_die(__('You do not have sufficient permissions to delete plugins for this blog.'));

			check_admin_referer('bulk-manage-plugins');

			$plugins = $_REQUEST['checked']; //$_POST = from the plugin form; $_GET = from the FTP details screen.
			include(ABSPATH . 'wp-admin/update.php');

			$title = __('Delete Plugin');
			$parent_file = 'plugins.php';

			if ( ! isset($_REQUEST['verify-delete']) ) {
				wp_enqueue_script('jquery');
				require_once('admin-header.php');
				?>
			<div class="wrap">
				<h2><?php _e('Delete Plugin(s)'); ?></h2>
				<?php
					$files_to_delete = $plugin_info = array();
					foreach ( (array) $plugins as $plugin ) {
						if ( '.' == dirname($plugin) ) {
							$files_to_delete[] = WP_PLUGIN_DIR . '/' . $plugin;
							if( $data = get_plugin_data(WP_PLUGIN_DIR . '/' . $plugin) )
								$plugin_info[ $plugin ] = $data;
						} else {
							//Locate all the files in that folder:
							$files = list_files( WP_PLUGIN_DIR . '/' . dirname($plugin) );
							if( $files ) {
								$files_to_delete = array_merge($files_to_delete, $files);
							}
							//Get plugins list from that folder
							if ( $folder_plugins = get_plugins( '/' . dirname($plugin)) )
								$plugin_info = array_merge($plugin_info, $folder_plugins);
						}
					}
				?>
				<p><?php _e('Deleting the selected plugins will remove the following plugin(s) and their files:'); ?></p>
					<ul>
						<?php
						foreach ( $plugin_info as $plugin )
							echo '<li>', sprintf(__('%s by %s'), $plugin['Name'], $plugin['Author']), '</li>';
						?>
					</ul>
				<p><?php _e('Are you sure you wish to delete these files?') ?></p>
				<form method="post" action="<?php echo clean_url($_SERVER['REQUEST_URI']); ?>" style="display:inline;">
					<input type="hidden" name="verify-delete" value="1" />
					<input type="hidden" name="action" value="delete-selected" />
					<?php
						foreach ( (array)$plugins as $plugin )
							echo '<input type="hidden" name="checked[]" value="' . attribute_escape($plugin) . '" />';
					?>
					<?php wp_nonce_field('bulk-manage-plugins') ?>
					<input type="submit" name="submit" value="<?php _e('Yes, Delete these files') ?>" class="button" />
				</form>
				<form method="post" action="<?php echo clean_url(wp_get_referer()); ?>" style="display:inline;">
					<input type="submit" name="submit" value="<?php _e('No, Return me to the plugin list') ?>" class="button" />
				</form>

				<p><a href="#" onclick="jQuery('#files-list').toggle(); return false;"><?php _e('Click to view entire list of files which will be deleted'); ?></a></p>
				<div id="files-list" style="display:none;">
					<ul>
					<?php
						foreach ( (array)$files_to_delete as $file )
							echo '<li>' . str_replace(WP_PLUGIN_DIR, '', $file) . '</li>';
					?>
					</ul>
				</div>
			</div>
				<?php
				require_once('admin-footer.php');
				exit;
			} //Endif verify-delete
			$delete_result = delete_plugins($plugins);

			wp_cache_delete('plugins', 'plugins');
			break;
		case 'clear-recent-list':
			update_option('recently_activated', array());
			break;
	}
}

wp_enqueue_script('plugin-install');
add_thickbox();

$help = '<p>' . __('Plugins extend and expand the functionality of WordPress. Once a plugin is installed, you may activate it or deactivate it here.') . '</p>';
$help .= '<p>' . sprintf(__('If something goes wrong with a plugin and you can&#8217;t use WordPress, delete or rename that file in the <code>%s</code> directory and it will be automatically deactivated.'), WP_PLUGIN_DIR) . '</p>';
$help .= '<p>' . sprintf(__('You can find additional plugins for your site by using the new <a href="%1$s">Plugin Browser/Installer</a> functionality or by browsing the <a href="http://wordpress.org/extend/plugins/">WordPress Plugin Directory</a> directly and installing manually.  To <em>manually</em> install a plugin you generally just need to upload the plugin file into your <code>%2$s</code> directory.  Once a plugin has been installed, you may activate it here.'), 'plugin-install.php', WP_PLUGIN_DIR) . '</p>';

add_contextual_help('plugins', $help);

$title = __('Manage Plugins');
require_once('admin-header.php');

$invalid = validate_active_plugins();
if ( !empty($invalid) )
	foreach ( $invalid as $plugin_file => $error )
		echo '<div id="message" class="error"><p>' . sprintf(__('The plugin <code>%s</code> has been <strong>deactivated</strong> due to an error: %s'), wp_specialchars($plugin_file), $error->get_error_message()) . '</p></div>';
?>

<?php if ( isset($_GET['error']) ) : ?>
	<div id="message" class="updated fade"><p><?php _e('Plugin could not be activated because it triggered a <strong>fatal error</strong>.') ?></p>
	<?php
		if ( wp_verify_nonce($_GET['_error_nonce'], 'plugin-activation-error_' . $plugin) ) { ?>
	<iframe style="border:0" width="100%" height="70px" src="<?php echo admin_url('plugins.php?action=error_scrape&amp;plugin=' . attribute_escape($plugin) . '&amp;_wpnonce=' . attribute_escape($_GET['_error_nonce'])); ?>"></iframe>
	<?php
		}
	?>
	</div>
<?php elseif ( 'delete-selected' == $action ) :
		if ( is_wp_error($delete_result) ) : ?>
		<div id="message" class="updated fade"><p><?php printf( __('Plugin could not be deleted due to an error: %s'), $delete_result->get_error_message() ); ?></p></div>
		<?php else : ?>
		<div id="message" class="updated fade"><p><?php _e('The selected plugins have been <strong>deleted</strong>.'); ?></p></div>
		<?php endif; ?>
<?php elseif ( isset($_GET['activate']) ) : ?>
	<div id="message" class="updated fade"><p><?php _e('Plugin <strong>activated</strong>.') ?></p></div>
<?php elseif (isset($_GET['activate-multi'])) : ?>
	<div id="message" class="updated fade"><p><?php _e('Selected plugins <strong>activated</strong>.'); ?></p></div>
<?php elseif ( isset($_GET['deactivate']) ) : ?>
	<div id="message" class="updated fade"><p><?php _e('Plugin <strong>deactivated</strong>.') ?></p></div>
<?php elseif (isset($_GET['deactivate-multi'])) : ?>
	<div id="message" class="updated fade"><p><?php _e('Selected plugins <strong>deactivated</strong>.'); ?></p></div>
<?php endif; ?>

<div class="wrap">
<?php screen_icon(); ?>
	<h2><?php echo wp_specialchars( $title ); ?></h2>

<?php

$all_plugins = get_plugins();
$search_plugins = array();
$active_plugins = array();
$inactive_plugins = array();
$recent_plugins = array();
$recently_activated = get_option('recently_activated', array());
$upgrade_plugins = array();

set_transient( 'plugin_slugs', array_keys($all_plugins), 86400 );

// Clean out any plugins which were deactivated over a week ago.
foreach ( $recently_activated as $key => $time )
	if ( $time + (7*24*60*60) < time() ) //1 week
		unset($recently_activated[ $key ]);
if ( $recently_activated != get_option('recently_activated') ) //If array changed, update it.
	update_option('recently_activated', $recently_activated);
$current = get_transient( 'update_plugins' );

foreach ( (array)$all_plugins as $plugin_file => $plugin_data) {

	//Translate, Apply Markup, Sanitize HTML
	$plugin_data = _get_plugin_data_markup_translate($plugin_file, $plugin_data, true, true);
	$all_plugins[ $plugin_file ] = $plugin_data;

	//Filter into individual sections
	if ( is_plugin_active($plugin_file) ) {
		$active_plugins[ $plugin_file ] = $plugin_data;
	} else {
		if ( isset( $recently_activated[ $plugin_file ] ) ) // Was the plugin recently activated?
			$recent_plugins[ $plugin_file ] = $plugin_data;
		$inactive_plugins[ $plugin_file ] = $plugin_data;
	}

    if ( isset( $current->response[ $plugin_file ] ) )
        $upgrade_plugins[ $plugin_file ] = $plugin_data;
}

$total_all_plugins = count($all_plugins);
$total_inactive_plugins = count($inactive_plugins);
$total_active_plugins = count($active_plugins);
$total_recent_plugins = count($recent_plugins);
$total_upgrade_plugins = count($upgrade_plugins);

//Searching.
if ( isset($_GET['s']) ) {
	function _search_plugins_filter_callback($plugin) {
		static $term;
		if ( is_null($term) )
			$term = stripslashes($_GET['s']);
		if ( 	stripos($plugin['Name'], $term) !== false ||
				stripos($plugin['Description'], $term) !== false ||
				stripos($plugin['Author'], $term) !== false ||
				stripos($plugin['PluginURI'], $term) !== false ||
				stripos($plugin['AuthorURI'], $term) !== false ||
				stripos($plugin['Version'], $term) !== false )
			return true;
		else
			return false;
	}
	$_GET['plugin_status'] = 'search';
	$search_plugins = array_filter($all_plugins, '_search_plugins_filter_callback');
	$total_search_plugins = count($search_plugins);
}

$status = isset($_GET['plugin_status']) ? $_GET['plugin_status'] : 'all';
if ( !in_array($status, array('all', 'active', 'inactive', 'recent', 'upgrade', 'search')) )
	$status = 'all';
$plugin_array_name = "${status}_plugins";
$plugins = &$$plugin_array_name;

//Paging.
$page = isset($_GET['paged']) ? $_GET['paged'] : 1;
$total_this_page = "total_{$status}_plugins";
$total_this_page = $$total_this_page;
$plugins_per_page = apply_filters('plugins_per_page', 20, $status);

$start = ($page - 1) * $plugins_per_page;

$page_links = paginate_links( array(
	'base' => add_query_arg( 'paged', '%#%' ),
	'format' => '',
	'prev_text' => __('&laquo;'),
	'next_text' => __('&raquo;'),
	'total' => ceil($total_this_page / $plugins_per_page),
	'current' => $page
));
$page_links_text = sprintf( '<span class="displaying-num">' . __( 'Displaying %s&#8211;%s of %s' ) . '</span>%s',
	number_format_i18n( $start + 1 ),
	number_format_i18n( min( $page * $plugins_per_page, $total_this_page ) ),
	'<span class="total-type-count">' . number_format_i18n( $total_this_page ) . '</span>',
	$page_links
);

/**
 * @ignore
 *
 * @param array $plugins
 * @param string $context
 */
function print_plugins_table($plugins, $context = '') {
?>
<table class="widefat" cellspacing="0" id="<?php echo $context ?>-plugins-table">
	<thead>
	<tr>
		<th scope="col" class="manage-column check-column"><input type="checkbox" /></th>
		<th scope="col" class="manage-column"><?php _e('Plugin'); ?></th>
		<th scope="col" class="manage-column num"><?php _e('Version'); ?></th>
		<th scope="col" class="manage-column"><?php _e('Description'); ?></th>
	</tr>
	</thead>

	<tfoot>
	<tr>
		<th scope="col" class="manage-column check-column"><input type="checkbox" /></th>
		<th scope="col" class="manage-column"><?php _e('Plugin'); ?></th>
		<th scope="col" class="manage-column num"><?php _e('Version'); ?></th>
		<th scope="col" class="manage-column"><?php _e('Description'); ?></th>
	</tr>
	</tfoot>

	<tbody class="plugins">
<?php

	if ( empty($plugins) ) {
		echo '<tr>
			<td colspan="6">' . __('No plugins to show') . '</td>
		</tr>';
	}
	foreach ( (array)$plugins as $plugin_file => $plugin_data) {
		$actions = array();
		$is_active = is_plugin_active($plugin_file);

		if ( $is_active )
			$actions[] = '<a href="' . wp_nonce_url('plugins.php?action=deactivate&amp;plugin=' . $plugin_file, 'deactivate-plugin_' . $plugin_file) . '" title="' . __('Deactivate this plugin') . '">' . __('Deactivate') . '</a>';
		else //Inactive or Recently deactivated
			$actions[] = '<a href="' . wp_nonce_url('plugins.php?action=activate&amp;plugin=' . $plugin_file, 'activate-plugin_' . $plugin_file) . '" title="' . __('Activate this plugin') . '" class="edit">' . __('Activate') . '</a>';

		if ( current_user_can('edit_plugins') && is_writable(WP_PLUGIN_DIR . '/' . $plugin_file) )
			$actions[] = '<a href="plugin-editor.php?file=' . $plugin_file . '" title="' . __('Open this file in the Plugin Editor') . '" class="edit">' . __('Edit') . '</a>';

		$actions = apply_filters( 'plugin_action_links', $actions, $plugin_file, $plugin_data, $context );
		$actions = apply_filters( "plugin_action_links_$plugin_file", $actions, $plugin_file, $plugin_data, $context );
		$action_count = count($actions);
		$class = $is_active ? 'active' : 'inactive';
		echo "
	<tr class='$class'>
		<th scope='row' class='check-column'><input type='checkbox' name='checked[]' value='" . attribute_escape($plugin_file) . "' /></th>
		<td class='plugin-title'><strong>{$plugin_data['Title']}</strong>";
		$i = 0;
		echo '<div class="row-actions">';
		foreach ( $actions as $action => $link ) {
			++$i;
			( $i == $action_count ) ? $sep = '' : $sep = ' | ';
			echo "<span class='$action'>$link$sep</span>";
		}
		echo '</div>';
		echo "</td>
		<td class='vers'>{$plugin_data['Version']}</td>
		<td class='desc'><p>{$plugin_data['Description']}</p>";
		echo '</td>
	</tr>';
		do_action( 'after_plugin_row', $plugin_file, $plugin_data, $context );
		do_action( "after_plugin_row_$plugin_file", $plugin_file, $plugin_data, $context );
	}
?>
	</tbody>
</table>
<?php
} //End print_plugins_table()

/**
 * @ignore
 *
 * @param string $context
 */
function print_plugin_actions($context) {
?>
	<div class="alignleft actions">
		<select name="action">
			<option value="" selected="selected"><?php _e('Bulk Actions'); ?></option>
	<?php if( 'active' != $context ) : ?>
			<option value="activate-selected"><?php _e('Activate'); ?></option>
	<?php endif; ?>
	<?php if ( 'active' == $context ) : ?>
			<option value="deactivate-selected"><?php _e('Deactivate'); ?></option>
	<?php endif; ?>
	<?php if( current_user_can('delete_plugins') && ( 'recent' == $context || 'inactive' == $context ) ) : ?>
			<option value="delete-selected"><?php _e('Delete'); ?></option>
	<?php endif; ?>
		</select>
		<input type="submit" name="doaction_active" value="<?php _e('Apply'); ?>" class="button-secondary action" />
	<?php if( 'recent' == $context ) : ?>
		<input type="submit" name="clear-recent-list" value="<?php _e('Clear List') ?>" class="button-secondary" />
	<?php endif; ?>
	</div>
<?php
}
?>

<form method="get" action="">
<p class="search-box">
	<label class="hidden" for="plugin-search-input"><?php _e( 'Search Plugins' ); ?>:</label>
	<input type="text" id="plugin-search-input" name="s" value="<?php _admin_search_query(); ?>" />
	<input type="submit" value="<?php _e( 'Search Plugins' ); ?>" class="button" />
</p>
</form>

<form method="post" action="<?php echo admin_url('plugins.php') ?>">
<?php wp_nonce_field('bulk-manage-plugins') ?>

<ul class="subsubsub">
<?php
$status_links = array();
$class = ( 'all' == $status ) ? ' class="current"' : '';
$status_links[] = "<li><a href='plugins.php' $class>" . sprintf( _n( 'All <span class="count">(%s)</span>', 'All <span class="count">(%s)</span>', $total_all_plugins ), number_format_i18n( $total_all_plugins ) ) . '</a>';
if ( ! empty($active_plugins) ) {
	$class = ( 'active' == $status ) ? ' class="current"' : '';
	$status_links[] = "<li><a href='plugins.php?plugin_status=active' $class>" . sprintf( _n( 'Active <span class="count">(%s)</span>', 'Active <span class="count">(%s)</span>', $total_active_plugins ), number_format_i18n( $total_active_plugins ) ) . '</a>';
}
if ( ! empty($recent_plugins) ) {
	$class = ( 'recent' == $status ) ? ' class="current"' : '';
	$status_links[] = "<li><a href='plugins.php?plugin_status=recent' $class>" . sprintf( _n( 'Recently Active <span class="count">(%s)</span>', 'Recently Active <span class="count">(%s)</span>', $total_recent_plugins ), number_format_i18n( $total_recent_plugins ) ) . '</a>';
}
if ( ! empty($inactive_plugins) ) {
	$class = ( 'inactive' == $status ) ? ' class="current"' : '';
	$status_links[] = "<li><a href='plugins.php?plugin_status=inactive' $class>" . sprintf( _n( 'Inactive <span class="count">(%s)</span>', 'Inactive <span class="count">(%s)</span>', $total_inactive_plugins ), number_format_i18n( $total_inactive_plugins ) ) . '</a>';
}
if ( ! empty($upgrade_plugins) ) {
	$class = ( 'upgrade' == $status ) ? ' class="current"' : '';
	$status_links[] = "<li><a href='plugins.php?plugin_status=upgrade' $class>" . sprintf( _n( 'Upgrade Available <span class="count">(%s)</span>', 'Upgrade Available <span class="count">(%s)</span>', $total_upgrade_plugins ), number_format_i18n( $total_upgrade_plugins ) ) . '</a>';
}
if ( ! empty($search_plugins) ) {
	$class = ( 'search' == $status ) ? ' class="current"' : '';
	$term = isset($_REQUEST['s']) ? urlencode(stripslashes($_REQUEST['s'])) : '';
	$status_links[] = "<li><a href='plugins.php?s=$term' $class>" . sprintf( _n( 'Search Results <span class="count">(%s)</span>', 'Search Results <span class="count">(%s)</span>', $total_search_plugins ), number_format_i18n( $total_search_plugins ) ) . '</a>';
}
echo implode( " |</li>\n", $status_links ) . '</li>';
unset( $status_links );
?>
</ul>

<div class="tablenav">
<?php
if ( $page_links )
	echo '<div class="tablenav-pages">', $page_links_text, '</div>';

print_plugin_actions($status);
?>
</div>
<div class="clear"></div>
<?php
	if ( $total_this_page > $plugins_per_page )
		$plugins = array_slice($plugins, $start, $plugins_per_page);
	
	print_plugins_table($plugins, $status);
?>
<div class="tablenav">
<?php
if ( $page_links )
	echo "<div class='tablenav-pages'>$page_links_text</div>";
?>
<div class="alignleft actions">
<!-- TODO lower bulk actions. -->
</div>
</div>
</form>

<?php if ( empty($all_plugins) ) : ?>
<p><?php _e('You do not appear to have any plugins available at this time.') ?></p>
<?php endif; ?>

</div>

<?php
include('admin-footer.php');
?>
