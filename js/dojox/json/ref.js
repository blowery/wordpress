/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.json.ref"]){
dojo._hasResource["dojox.json.ref"]=true;
dojo.provide("dojox.json.ref");
dojo.require("dojo.date.stamp");
dojox.json.ref.resolveJson=function(_1,_2){
_2=_2||{};
var _3=_2.idAttribute||"id";
var _4=_2.idPrefix||"/";
var _5=_2.index||{};
var _6,_7=[];
var _8=/^(.*\/)?(\w+:\/\/)|[^\/\.]+\/\.\.\/|^.*\/(\/)/;
function walk(it,_a,_b){
var _c,_d,id=it[_3]||_b;
if(id!==undefined){
id=(_4+id).replace(_8,"$2$3");
}
var _f=it;
if(id!==undefined){
it.__id=id;
if(_5[id]&&((it instanceof Array)==(_5[id] instanceof Array))){
_f=_5[id];
delete _f.$ref;
_c=true;
}else{
var _10=_2.schemas&&(!(it instanceof Array))&&(_d=id.match(/^(.+\/)[^\.\[]*$/))&&(_d=_2.schemas[_d[1]])&&_d.prototype;
if(_10){
var F=function(){
};
F.prototype=_10;
_f=new F();
}
}
_5[id]=_f;
}
for(var i in it){
if((typeof (_d=it[i])=="object")&&_d){
_6=_d.$ref;
if(_6){
var _13=_6.replace(/\\./g,"@").replace(/"[^"\\\n\r]*"/g,"");
if(/[\w\[\]\.\$ \/\r\n\t]/.test(_13)&&!/\=|((^|\W)new\W)/.test(_13)){
delete it[i];
var _14=_6.match(/(^\.*[^\.\[]+)([\.\[].*)?/);
if((_6=(_14[1]=="$"||_14[1]=="this")?_1:_5[(_4+_14[1]).replace(_8,"$2$3")])&&(_6=_14[2]?eval("ref"+_14[2].replace(/\.([^\.]+)/g,"[\"$1\"]")):_6)){
_d=_6;
}else{
if(!_a){
var _15;
if(!_15){
_7.push(_f);
}
_15=true;
}else{
_d=walk(_d,false,_d.$ref);
_d._loadObject=_2.loader;
}
}
}
}else{
if(!_a){
_d=walk(_d,_7==it,id&&(id+("["+dojo._escapeString(i)+"]")));
}
}
}
it[i]=_d;
if(_f!=it){
var old=_f[i];
_f[i]=_d;
if(_c&&_d!==old){
if(_5.onUpdate){
_5.onUpdate(_f,i,old,_d);
}
}
}
}
if(_c){
for(i in _f){
if(!it.hasOwnProperty(i)&&i!="__id"&&!(_f instanceof Array&&isNaN(i))){
if(_5.onUpdate){
_5.onUpdate(_f,i,_f[i],undefined);
}
delete _f[i];
while(_f instanceof Array&&_f.length&&_f[_f.length-1]===undefined){
_f.length--;
}
}
}
}else{
if(_5.onLoad){
_5.onLoad(_f);
}
}
return _f;
};
if(_1&&typeof _1=="object"){
_1=walk(_1,false,_2.defaultId);
walk(_7,false);
}
return _1;
};
dojox.json.ref.fromJson=function(str,_18){
function ref(_19){
return {$ref:_19};
};
var _1a=eval("("+str+")");
if(_1a){
return this.resolveJson(_1a,_18);
}
return _1a;
};
dojox.json.ref.toJson=function(it,_1c,_1d,_1e){
var _1f=dojox.json.ref.useRefs;
_1d=_1d||"";
var _20={};
function serialize(it,_22,_23){
if(typeof it=="object"&&it){
var _24;
if(it instanceof Date){
return "\""+dojo.date.stamp.toISOString(it,{zulu:true})+"\"";
}
var id=it.__id;
if(id){
if(_22!="$"&&(_1f||_20[id])){
var ref=id;
if(id.charAt(0)!="$"){
if(id.substring(0,_1d.length)==_1d){
ref=id.substring(_1d.length);
}else{
ref=id;
}
}
return serialize({$ref:ref});
}
_22=id;
}else{
it.__id=_22;
_20[_22]=it;
}
_23=_23||"";
var _27=_1c?_23+dojo.toJsonIndentStr:"";
var _28=_1c?"\n":"";
var sep=_1c?" ":"";
if(it instanceof Array){
var res=dojo.map(it,function(obj,i){
var val=serialize(obj,_22+"["+i+"]",_27);
if(typeof val!="string"){
val="undefined";
}
return _28+_27+val;
});
return "["+res.join(","+sep)+_28+_23+"]";
}
var _2e=[];
for(var i in it){
if(it.hasOwnProperty(i)){
var _30;
if(typeof i=="number"){
_30="\""+i+"\"";
}else{
if(typeof i=="string"&&i.charAt(0)!="_"){
_30=dojo._escapeString(i);
}else{
continue;
}
}
var val=serialize(it[i],_22+(i.match(/^[a-zA-Z]\w*$/)?("."+i):("["+dojo._escapeString(i)+"]")),_27);
if(typeof val!="string"){
continue;
}
_2e.push(_28+_27+_30+":"+sep+val);
}
}
return "{"+_2e.join(","+sep)+_28+_23+"}";
}else{
if(typeof it=="function"&&dojox.json.ref.serializeFunctions){
return it.toString();
}
}
return dojo.toJson(it);
};
var _32=serialize(it,"$","");
if(!_1e){
for(i in _20){
delete _20[i].__id;
}
}
return _32;
};
dojox.json.ref.useRefs=false;
dojox.json.ref.serializeFunctions=false;
}
