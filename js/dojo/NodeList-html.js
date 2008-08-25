/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojo.NodeList-html"]){
dojo._hasResource["dojo.NodeList-html"]=true;
dojo.provide("dojo.NodeList-html");
dojo.require("dojo.html");
dojo.extend(dojo.NodeList,{html:function(_1,_2){
var _3=new dojo.html._ContentSetter(null,_1,_2||{});
this.forEach(function(_4){
_3.node=_4;
_3.set();
_3.tearDown();
});
return this;
}});
}
