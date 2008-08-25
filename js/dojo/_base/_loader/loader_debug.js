/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojo._base._loader.loader_debug"]){
dojo._hasResource["dojo._base._loader.loader_debug"]=true;
dojo.provide("dojo._base._loader.loader_debug");
dojo.nonDebugProvide=dojo.provide;
dojo.provide=function(_1){
var _2=dojo["_xdDebugQueue"];
if(_2&&_2.length>0&&_1==_2["currentResourceName"]){
if(dojo.isAIR){
window.setTimeout(function(){
dojo._xdDebugFileLoaded(_1);
},1);
}else{
window.setTimeout(dojo._scopeName+"._xdDebugFileLoaded('"+_1+"')",1);
}
}
return dojo.nonDebugProvide.apply(dojo,arguments);
};
dojo._xdDebugFileLoaded=function(_3){
if(!this._xdDebugScopeChecked){
if(dojo._scopeName!="dojo"){
window.dojo=window[dojo.config.scopeMap[0][1]];
window.dijit=window[dojo.config.scopeMap[1][1]];
window.dojox=window[dojo.config.scopeMap[2][1]];
}
this._xdDebugScopeChecked=true;
}
var _4=this._xdDebugQueue;
if(_3&&_3==_4.currentResourceName){
_4.shift();
}
if(_4.length==0){
_4.currentResourceName=null;
this._xdNotifyLoaded();
}else{
if(_3==_4.currentResourceName){
_4.currentResourceName=_4[0].resourceName;
var _5=document.createElement("script");
_5.type="text/javascript";
_5.src=_4[0].resourcePath;
document.getElementsByTagName("head")[0].appendChild(_5);
}
}
};
}
