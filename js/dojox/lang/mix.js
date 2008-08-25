/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.lang.mix"]){
dojo._hasResource["dojox.lang.mix"]=true;
dojo.provide("dojox.lang.mix");
(function(){
var _1={},_2=[],_3=dojox.lang.mix;
dojo.mixin(_3,{copyProps:function(_4,_5,_6,_7){
if(_4&&_5){
var _8=_2,i,j,l,p;
if(!_6){
_6=_1;
}
if(_7){
if(dojo.isArray(_7)){
p={};
for(j=0,l=_7.length;j<l;++j){
p[_7[j]]=1;
}
_7=p;
}
}else{
_7=_1;
}
for(i in _5){
if(_5.hasOwnProperty(i)&&!_7.hasOwnProperty(i)){
_4[_6.hasOwnProperty(i)?_6[i]:i]=_5[i];
}
}
if(dojo.isIE&&!_7.hasOwnProperty("toString")){
p=_5.toString;
if(p){
if(typeof p=="function"&&p!==_4.toString&&p!==_1.toString&&p!="\nfunction toString() {\n    [native code]\n}\n"){
_4[_6.hasOwnProperty("toString")?_6.toString:"toString"]=p;
}
}
}
}
return _4;
},cloneProps:function(_d,_e,_f){
return _3.copyProps({},_d,_e,_f);
},processProps:function(_10,_11,_12){
if(_10){
var t,i,j,l;
if(_12){
if(dojo.isArray(_12)){
for(j=0,l=_12.length;j<l;++j){
delete _10[_12[j]];
}
}else{
for(var i in _12){
if(_12.hasOwnProperty(i)){
delete _10[i];
}
}
}
}
if(_11){
for(i in _11){
if(_11.hasOwnProperty(i)&&_10.hasOwnProperty(i)){
t=_10[i];
delete _10[i];
_10[_11[i]]=t;
}
}
}
}
return _10;
}});
})();
}
