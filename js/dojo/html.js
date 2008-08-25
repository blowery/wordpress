/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojo.html"]){
dojo._hasResource["dojo.html"]=true;
dojo.provide("dojo.html");
dojo.require("dojo.parser");
(function(){
var _1=0;
dojo.html._secureForInnerHtml=function(_2){
return _2.replace(/(?:\s*<!DOCTYPE\s[^>]+>|<title[^>]*>[\s\S]*?<\/title>)/ig,"");
};
dojo.html._emptyNode=function(_3){
while(_3.firstChild){
dojo._destroyElement(_3.firstChild);
}
};
dojo.html._setNodeContent=function(_4,_5,_6){
if(_6){
dojo.html._emptyNode(_4);
}
if(typeof _5=="string"){
var _7="",_8="",_9=0,_a=_4.nodeName.toLowerCase();
switch(_a){
case "tr":
_7="<tr>";
_8="</tr>";
_9+=1;
case "tbody":
case "thead":
_7="<tbody>"+_7;
_8+="</tbody>";
_9+=1;
case "table":
_7="<table>"+_7;
_8+="</table>";
_9+=1;
break;
}
if(_9){
var n=_4.ownerDocument.createElement("div");
n.innerHTML=_7+_5+_8;
do{
n=n.firstChild;
}while(--_9);
dojo.forEach(n.childNodes,function(n){
_4.appendChild(n.cloneNode(true));
});
}else{
_4.innerHTML=_5;
}
}else{
if(_5.nodeType){
_4.appendChild(_5);
}else{
dojo.forEach(_5,function(n){
_4.appendChild(n.cloneNode(true));
});
}
}
return _4;
};
dojo.declare("dojo.html._ContentSetter",null,{node:"",content:"",id:"",cleanContent:false,extractContent:false,parseContent:false,parseOnLoad:false,constructor:function(_e,_f){
dojo.mixin(this,_e||{});
var _f=this.node=dojo.byId(this.node||_f);
if(!this.id){
this.id=["Setter",(_f)?_f.id||_f.tagName:"",_1++].join("_");
}
if(!(this.node||_f)){
new Error(this.declaredClass+": no node provided to "+this.id);
}
},set:function(_10,_11){
if(undefined!==_10){
this.content=_10;
}
if(_11){
this._mixin(_11);
}
this.onBegin();
this.setContent();
this.onEnd();
return this.node;
},setContent:function(){
var _12=this.node;
try{
_12=dojo.html._setNodeContent(_12,this.content);
}
catch(e){
var _13=this.onContentError(e);
try{
_12.innerHTML=_13;
}
catch(e){
console.error("Fatal "+this.declaredClass+".setContent could not change content due to "+e.message,e);
}
}
this.node=_12;
},onBegin:function(){
var _14=this.content;
if(dojo.isString(_14)){
if(this.cleanContent){
_14=dojo.html._secureForInnerHtml(_14);
}
if(this.extractContent){
var _15=_14.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
if(_15){
_14=_15[1];
}
}
}
dojo.html._emptyNode(this.node);
this.content=_14;
return this.node;
},onEnd:function(){
if(this.parseContent||this.parseOnLoad){
this._parse();
}
return this.node;
},tearDown:function(){
delete this.parseResults;
delete this.node;
delete this.content;
},onContentError:function(err){
return "Error occured setting content: "+err;
},_mixin:function(_17){
var _18={},key;
for(key in _17){
if(key in _18){
continue;
}
this[key]=_17[key];
}
},_parse:function(){
var _1a=this.node;
try{
this.parseResults=dojo.parser.parse(_1a,true);
}
catch(e){
this._onError("Content",e,"Error parsing in _ContentSetter#"+this.id);
}
},_onError:function(_1b,err,_1d){
var _1e=this["on"+_1b+"Error"].call(this,err);
if(_1d){
console.error(_1d,err);
}else{
if(_1e){
dojo.html._setNodeContent(this.domNode,_1e,true);
}
}
}});
dojo.html.set=function(_1f,_20,_21){
if(!_21){
return dojo.html._setNodeContent(_1f,_20,true);
}else{
var op=new dojo.html._ContentSetter(dojo.mixin(_21,{content:_20,node:_1f}));
return op.set();
}
};
})();
}
