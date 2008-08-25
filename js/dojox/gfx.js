/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.gfx"]){
dojo._hasResource["dojox.gfx"]=true;
dojo.provide("dojox.gfx");
dojo.require("dojox.gfx.matrix");
dojo.require("dojox.gfx._base");
dojo.loadInit(function(){
var _1=dojo.getObject("dojox.gfx",true),sl,_3;
if(!_1.renderer){
var _4=(typeof dojo.config["gfxRenderer"]=="string"?dojo.config["gfxRenderer"]:"svg,vml,silverlight,canvas").split(",");
for(var i=0;i<_4.length;++i){
switch(_4[i]){
case "svg":
if(!dojo.isIE&&(navigator.userAgent.indexOf("iPhone")<0)&&(navigator.userAgent.indexOf("iPod")<0)){
dojox.gfx.renderer="svg";
}
break;
case "vml":
if(dojo.isIE){
dojox.gfx.renderer="vml";
}
break;
case "silverlight":
try{
if(dojo.isIE){
sl=new ActiveXObject("AgControl.AgControl");
if(sl&&sl.IsVersionSupported("1.0")){
_3=true;
}
}else{
if(navigator.plugins["Silverlight Plug-In"]){
_3=true;
}
}
}
catch(e){
_3=false;
}
finally{
sl=null;
}
if(_3){
dojox.gfx.renderer="silverlight";
}
break;
case "canvas":
if(!dojo.isIE){
dojox.gfx.renderer="canvas";
}
break;
}
if(dojox.gfx.renderer){
break;
}
}

}
});
dojo.requireIf(dojox.gfx.renderer=="svg","dojox.gfx.svg");
dojo.requireIf(dojox.gfx.renderer=="vml","dojox.gfx.vml");
dojo.requireIf(dojox.gfx.renderer=="silverlight","dojox.gfx.silverlight");
dojo.requireIf(dojox.gfx.renderer=="canvas","dojox.gfx.canvas");
}
