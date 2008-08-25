/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojo.robot"]){
dojo._hasResource["dojo.robot"]=true;
dojo.provide("dojo.robot");
dojo.experimental("dojo.robot");
dojo.require("doh.robot");
(function(){
dojo.mixin(doh.robot,{_scrollIntoView:function(_1){
if(typeof _1=="function"){
_1=_1();
}
_1.scrollIntoView(false);
},scrollIntoView:function(_2,_3){
doh.robot.sequence(function(){
doh.robot._scrollIntoView(_2);
},_3);
},mouseMoveAt:function(_4,_5,_6,_7,_8){
doh.robot._assertRobot();
_8=_8||100;
this.sequence(function(){
if(typeof _4=="function"){
_4=_4();
}
if(!_4){
return;
}
_4=dojo.byId(_4);
if(_7===undefined){
var _9=dojo.contentBox(_4);
_6=_9.w/2;
_7=_9.h/2;
}
var x=_6;
var y=_7;
doh.robot._scrollIntoView(_4);
var c=dojo.coords(_4);
x+=c.x;
y+=c.y;
doh.robot._mouseMove(x,y,false,_8);
},_5,_8);
}});
})();
}
