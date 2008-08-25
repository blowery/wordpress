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

if(!dojo._hasResource["blowery.index"]){
dojo._hasResource["blowery.index"]=true;
dojo.provide("blowery.index");
blowery.index.prettyDate=function(_1){
var _2=new Date(_1||""),_3=(((new Date()).getTime()-_2.getTime())/1000),_4=Math.floor(_3/86400);
if(isNaN(_4)||_4<0||_4>=31){
return;
}
return _4==0&&(_3<60&&"just now"||_3<120&&"1 minute ago"||_3<3600&&Math.floor(_3/60)+" minutes ago"||_3<7200&&"1 hour ago"||_3<86400&&Math.floor(_3/3600)+" hours ago")||_4==1&&"Yesterday"||_4<7&&_4+" days ago"||_4<31&&Math.ceil(_4/7)+" weeks ago";
};
blowery.index.fixupDates=function(){
function fixupDate(n){
var d=blowery.index.prettyDate(n.title);
if(d){
n.innerHTML=d;
}
};
dojo.query("abbr.published").forEach(fixupDate);
};
dojo.addOnLoad(function(){
blowery.index.fixupDates();
setInterval(blowery.index.fixupDates,1000);
});
}
