/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.lang.aspect.cflow"]){
dojo._hasResource["dojox.lang.aspect.cflow"]=true;
dojo.provide("dojox.lang.aspect.cflow");
(function(){
var _1=dojox.lang.aspect;
_1.cflow=function(_2,_3){
if(arguments.length>1&&!(_3 instanceof Array)){
_3=[_3];
}
var _4=_1.getContextStack();
for(var i=_4.length-1;i>=0;--i){
var c=_4[i];
if(_2&&c.instance!=_2){
continue;
}
if(!_3){
return true;
}
var n=c.joinPoint.targetName;
for(var j=_3.length-1;j>=0;--j){
var m=_3[j];
if(m instanceof RegExp){
if(m.test(n)){
return true;
}
}else{
if(n==m){
return true;
}
}
}
}
return false;
};
})();
}
