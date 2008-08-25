/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/

/*
	This is a compiled version of Dojo, built for deployment and not for
	development. To get an editable version, please visit:

		http://dojotoolkit.org

	for documentation and information on getting the source.
*/

if(!dojo._hasResource["blowery.index"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["blowery.index"] = true;
dojo.provide("blowery.index");

/*
 *  * JavaScript Pretty Date
 *  * Copyright (c) 2008 John Resig (jquery.com)
 *  * Licensed under the MIT license.
 *  */

// Takes an ISO time and returns a string representing how
// long ago the date represents.
blowery.index.prettyDate = function(time){
  var date = new Date(time || ""),
    diff = (((new Date()).getTime() - date.getTime()) / 1000),
    day_diff = Math.floor(diff / 86400);

  if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
    return;

  return day_diff == 0 && (
           diff < 60 && "just now" ||
           diff < 120 && "1 minute ago" ||
           diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
           diff < 7200 && "1 hour ago" ||
           diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
         day_diff == 1 && "Yesterday" ||
         day_diff < 7 && day_diff + " days ago" ||
         day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
};

blowery.index.fixupDates = function(){
  function fixupDate(n){
    var d = blowery.index.prettyDate(n.title);
    if(d) n.innerHTML = d;
  }
  dojo.query("abbr.published").forEach(fixupDate);
};

dojo.addOnLoad(function(){
                 blowery.index.fixupDates();
                 setInterval(blowery.index.fixupDates, 1000);
});

}

