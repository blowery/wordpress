/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


dojox.embed.Flash.place=function(_1,_2){
var o=dojox.embed.Flash.__ie_markup__(_1);
_2=dojo.byId(_2);
if(!_2){
_2=dojo.doc.createElement("div");
_2.id=o.id+"-container";
dojo.body().appendChild(_2);
}
if(o){
_2.innerHTML=o.markup;
return o.id;
}
return null;
};
dojox.embed.Flash.onInitialize();
