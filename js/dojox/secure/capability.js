/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.secure.capability"]){
dojo._hasResource["dojox.secure.capability"]=true;
dojo.provide("dojox.secure.capability");
dojox.secure.badProps=/^__|^(apply|call|callee|caller|constructor|eval|prototype|this|unwatch|valueOf|watch)$|__$/;
dojox.secure.capability={keywords:["break","case","catch","const","continue","debugger","default","delete","do","else","enum","false","finally","for","function","if","in","instanceof","new","null","yield","return","switch","throw","true","try","typeof","var","void","while"],validate:function(_1,_2,_3){
var _4=this.keywords;
for(var i=0;i<_4.length;i++){
_3[_4[i]]=true;
}
var _6="|this| keyword in object literal without a Class call";
var _7=[];
if(_1.match(/[\u200c-\u200f\u202a-\u202e\u206a-\u206f\uff00-\uffff]/)){
throw new Error("Illegal unicode characters detected");
}
if(_1.match(/\/\*@cc_on/)){
throw new Error("Conditional compilation token is not allowed");
}
_1=_1.replace(/\\["'\\\/bfnrtu]/g,"@").replace(/\/\/.*|\/\*[\w\W]*?\*\/|\/(\\[\/\\]|[^*\/])(\\.|[^\/\n\\])*\/[gim]*|("[^"]*")|('[^']*')/g,function(t){
return t.match(/^\/\/|^\/\*/)?" ":"0";
}).replace(/\.\s*([a-z\$_A-Z][\w\$_]*)|([;,{])\s*([a-z\$_A-Z][\w\$_]*\s*):/g,function(t,_a,_b,_c){
_a=_a||_c;
if(/^__|^(apply|call|callee|caller|constructor|eval|prototype|this|unwatch|valueOf|watch)$|__$/.test(_a)){
throw new Error("Illegal property name "+_a);
}
return (_b&&(_b+"0:"))||"~";
});
if((i=_1.match(/((\Wreturn|\S)\s*\[)|([^=!][=!]=[^=])/g))){
if(!i[0].match(/(\Wreturn|[=\&\|\:\?\,])\s*\[/)){
throw new Error("Illegal operator "+i[0].substring(1));
}
}
_1=_1.replace(new RegExp("("+_2.join("|")+")[\\s~]*\\(","g"),function(_d){
return "new(";
});
function findOuterRefs(_e,_f){
var _10={};
_e.replace(/#\d/g,function(b){
var _12=_7[b.substring(1)];
for(var i in _12){
if(i==_6){
throw i;
}
if(i=="this"&&_12[":method"]&&_12["this"]==1){
i=_6;
}
if(i!=":method"){
_10[i]=2;
}
}
});
_e.replace(/(\W|^)([a-z_\$A-Z][\w_\$]*)/g,function(t,a,_16){
if(_16.charAt(0)=="_"){
throw new Error("Names may not start with _");
}
_10[_16]=1;
});
return _10;
};
var _17,_18;
function parseBlock(t,_1a,a,b,_1d,_1e){
_1e.replace(/(^|,)0:\s*function#(\d)/g,function(t,a,b){
var _22=_7[b];
_22[":method"]=1;
});
_1e=_1e.replace(/(^|[^_\w\$])Class\s*\(\s*([_\w\$]+\s*,\s*)*#(\d)/g,function(t,p,a,b){
var _27=_7[b];
delete _27[_6];
return (p||"")+(a||"")+"#"+b;
});
_18=findOuterRefs(_1e,_1a);
function parseVars(t,a,b,_2b){
_2b.replace(/,?([a-z\$A-Z][_\w\$]*)/g,function(t,_2d){
if(_2d=="Class"){
throw new Error("Class is reserved");
}
delete _18[_2d];
});
};
if(_1a){
parseVars(t,a,a,_1d);
}
_1e.replace(/(\W|^)(var) ([ \t,_\w\$]+)/g,parseVars);
return (a||"")+(b||"")+"#"+(_7.push(_18)-1);
};
do{
_17=_1.replace(/((function|catch)(\s+[_\w\$]+)?\s*\(([^\)]*)\)\s*)?{([^{}]*)}/g,parseBlock);
}while(_17!=_1&&(_1=_17));
parseBlock(0,0,0,0,0,_1);
for(i in _18){
if(!(i in _3)){
throw new Error("Illegal reference to "+i);
}
}
}};
}
