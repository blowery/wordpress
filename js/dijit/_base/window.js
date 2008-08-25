/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dijit._base.window"]){
dojo._hasResource["dijit._base.window"]=true;
dojo.provide("dijit._base.window");
dijit.getDocumentWindow=function(_1){
if(dojo.isIE&&window!==document.parentWindow&&!_1._parentWindow){
_1.parentWindow.execScript("document._parentWindow = window;","Javascript");
var _2=_1._parentWindow;
_1._parentWindow=null;
return _2;
}
return _1._parentWindow||_1.parentWindow||_1.defaultView;
};
}
