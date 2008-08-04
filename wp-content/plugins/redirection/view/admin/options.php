<?php if (!defined ('ABSPATH')) die ('No direct access allowed'); ?><div class="wrap">
  <h2><?php _e ('Options', 'redirection') ?></h2>
	<?php $this->submenu (true); ?>
  <form method="post" action="<?php echo $this->url ($_SERVER['REQUEST_URI']) ?>">
	
	<fieldset>
		<legend><?php _e ('General', 'redirection'); ?></legend>
	  <table cellpadding="3" width="100%">
			<tr>
	      <th valign="top" align="right"><?php _e ('Auto-generate URL', 'redirection') ?>:</th>
	      <td>
					<input type="text" name="auto_target" style="width: 95%" value="<?php echo htmlspecialchars ($options['auto_target']) ?>"/>
					<br/>
					<span class="sub"><?php _e ('This will be used to auto-generate a URL if no URL is given.  You can use the special tags $dec$ or $hex$ to have a unique ID inserted (either decimal or hex)', 'redirection'); ?></span>

				</td>
	    </tr>
			<tr>
				<th align="right" valign="top"><?php _e ('IP Lookup Service', 'redirection'); ?>:</th>
				<td>
					<input type="text" style="width: 95%" name="lookup" value="<?php echo $options['lookup'] ?>" id="lookup"/><br/>
				</td>
			</tr>
			<tr>
				<th align="right"><?php _e ('Plugin Support', 'redirection'); ?>:</th>
				<td>
					<input type="checkbox" name="support" <?php echo $this->checked ($options['support']) ?> id="support"/> 
					<label for="support"><span class="sub"><?php _e ('I\'m a nice person and I have helped support the author of this plugin', 'redirection'); ?></span></label>
				</td>
			</tr>
		</table>
	</fieldset>
	
	<fieldset>
		<legend><?php _e ('URL Monitoring', 'redirection'); ?></legend>
		<p><?php _e ('You can have Redirection detect changes in URLs and have an automatic redirection created in a specific group.', 'redirection'); ?></p>

		<table>
			<tr>
				<th><?php _e ('Post &amp; Page URLs', 'redirection'); ?>:</th>
				<td>
					<select name="monitor_post">
						<option value="0"><?php _e ('Don\'t monitor', 'redirection'); ?></option>
						<?php echo $this->select ($groups, $options['monitor_post']);?>
					</select>
				</td>
			</tr>
			<tr>
				<th><?php _e ('Category URLs', 'redirection'); ?>:</th>
				<td>
					<select name="monitor_category">
						<option value="0"><?php _e ('Don\'t monitor', 'redirection'); ?></option>
						<?php echo $this->select ($groups, $options['monitor_category']);?>
					</select>
				</td>
			</tr>
	  </table>
	</fieldset>

  <input type="submit" name="update" value="<?php _e ('Update', 'redirection') ?>"/>

  </form>
</div>

<div class="wrap">
	<h2><?php _e ('Import', 'redirection'); ?></h2>
	
	<p><?php _e ('Here you can import redirections from an existing .htaccess file, a CSV file, or a Redirection XML.', 'redirection'); ?></p>
	
	<form action="<?php echo $this->url ($_SERVER['REQUEST_URI']) ?>" method="post" accept-charset="utf-8" enctype="multipart/form-data">
		<input type="file" name="upload" value=""/>
		
		<?php _e ('Import into', 'redirection'); ?>: <select name="group">
			<?php echo $this->select ($groups);?>
		</select>
		<input type="submit" name="import" value="<?php _e ('Upload', 'redirection'); ?>"/>
	</form>
	
	<p><?php _e ('Note that the group is ignored when uploading an XML file.', 'redirection'); ?></p>
</div>

<div class="wrap">
	<h2><?php _e ('Delete Redirection', 'redirection'); ?></h2>
	<p><?php _e ('Selecting this option will delete all redirections, all logs, and any options associated with the Redirection plugin.  Make sure this is what you want to do.', 'redirection'); ?></p>

	<form action="<?php echo $this->url ($_SERVER['REQUEST_URI']) ?>" method="post" accept-charset="utf-8">
			<input type="submit" name="delete" value="<?php _e ('Delete', 'redirection') ?>"/>
	</form>
</div>