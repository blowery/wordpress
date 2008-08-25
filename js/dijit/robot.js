/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dijit.robot"]){
dojo._hasResource["dijit.robot"]=true;
dojo.provide("dijit.robot");
dojo.require("dojo.robot");
dojo.require("dijit._base.scroll");
dojo.mixin(doh.robot,{_scrollIntoView:function(_1){
if(typeof _1=="function"){
_1=_1();
}
dijit.scrollIntoView(_1);
}});
}
