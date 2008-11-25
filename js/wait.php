<?php header("Content-type: text/javascript"); ?>  
loaded(<?php $st = array_sum (explode (' ', microtime ()));

sleep (3);

echo round ((array_sum (explode (' ',microtime ())) - $st), 7); ?>
, '<?php echo $_GET["name"]; ?>');