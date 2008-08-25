/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.rpc.JsonRest"]){
dojo._hasResource["dojox.rpc.JsonRest"]=true;
dojo.provide("dojox.rpc.JsonRest");
dojo.require("dojox.json.ref");
dojo.require("dojox.rpc.Rest");
(function(){
var _1=[];
var _2=dojox.rpc.Rest;
var jr=dojox.rpc.JsonRest={commit:function(_4){
var _5=[];
var _6;
_4=_4||{};
var _7=[];
var _8=_1.length;
var _9={};
for(var i=0;i<_8;i++){
var _b=_1[i];
var _c=_b.object;
var _d=false;
if(_c&&!_b.old){
_7.push({method:"post",target:{__id:jr.getServiceAndId(_c.__id).service.servicePath},content:_c});
}else{
if(!_c&&_b.old){
_7.push({method:"delete",target:_b.old});
}else{
while(!(dojox.json&&dojox.json.ref&&dojox.json.ref.useRefs)&&_c.__id.match(/[\[\.]/)){
var _e=_c.__id.match(/^[^\[\.]*/)[0];
if(_e in _9){
continue;
}
_c=_9[_e]=_2._index[_e];
}
_7.push({method:"put",target:_c,content:_c});
}
}
_5.push(_c);
}
var _f;
var _10=dojo.xhr;
_6=_7.length;
var _11;
dojo.xhr=function(_12,_13){
_13.headers=_13.headers||{};
_13.headers["X-Transaction"]=_7.length-1==i?"commit":"open";
if(_11){
_13.headers["Content-Location"]=_11;
}
return _10.apply(dojo,arguments);
};
for(i=0;i<_7.length;i++){
var _14=_7[i];
dojox.rpc.JsonRest._contentId=_14.content&&_14.content.__id;
var _15=_14.method=="post";
_11=_15&&dojox.rpc.JsonRest._contentId;
var _16=jr.getServiceAndId(_14.target.__assignedId||_14.target.__id);
var _17=_16.service;
var dfd=_14.deferred=_17[_14.method](_16.id,dojox.json.ref.toJson(_14.content,false,_17.servicePath,true));
(function(_19,dfd){
dfd.addCallback(function(_1b){
try{
var _1c=dfd.ioArgs.xhr.getResponseHeader("Location");
_19.__assignedId=_1c;
_2._index[_1c]=_19;
}
catch(e){
}
if(!(--_6)){
_1.splice(0,_8);
if(_4.onComplete){
_4.onComplete.call(_4.scope);
}
}
});
})(_15&&_14.content,dfd);
dfd.addErrback(function(_1d){
_6=-1;
var _1e=_1.splice(_8,_1.length-_8);
_8=0;
jr.revert();
_1=_1e;
if(_4.onError){
_4.onError();
}
return _1d;
});
}
dojo.xhr=_10;
return _7;
},getDirtyObjects:function(){
return _1;
},revert:function(){
while(_1.length>0){
var d=_1.pop();
if(d.object&&d.old){
for(var i in d.old){
if(d.old.hasOwnProperty(i)){
d.object[i]=d.old[i];
}
}
for(i in d.object){
if(!d.old.hasOwnProperty(i)){
delete d.object[i];
}
}
}
}
},changing:function(_21,_22){
if(!_21.__id){
return;
}
for(var i=0;i<_1.length;i++){
if(_21==_1[i].object){
return;
}
}
var old=_21 instanceof Array?[]:{};
for(i in _21){
if(_21.hasOwnProperty(i)){
old[i]=_21[i];
}
}
_1.push({object:!_22&&_21,old:old});
},deleteObject:function(_25){
this.changing(_25,true);
},getConstructor:function(_26,_27){
if(typeof _26=="string"){
var _28=_26;
_26=new dojox.rpc.Rest(_26,true);
this.registerService(_26,_28,_27);
}
if(_26._constructor){
return _26._constructor;
}
_26._constructor=function(_29){
if(_29){
dojo.mixin(this,_29);
}
var _2a=jr.getIdAttribute(_26);
_2._index[this.__id=_26.servicePath+(_29[_2a]||(_29[_2a]=Math.random().toString(16).substring(2,14)+Math.random().toString(16).substring(2,14)))]=this;
_1.push({object:this});
};
return dojo.mixin(_26._constructor,_26._schema,{load:_26});
},fetch:function(_2b){
var _2c=jr.getServiceAndId(_2b);
return this.byId(_2c.service,_2c.id);
},getIdAttribute:function(_2d){
var _2e=_2d._schema;
var _2f;
if(_2e){
if(!(_2f=_2e._idAttr)){
for(var i in _2e.properties){
if(_2e.properties[i].unique){
_2e._idAttr=_2f=i;
}
}
}
}
return _2f||"id";
},getServiceAndId:function(_31){
var _32=_31.match(/^(.*\/)([^\/]*)$/);
var svc=jr.services[_32[1]]||new dojox.rpc.Rest(_32[1]);
return {service:svc,id:_32[2]};
},services:{},schemas:{},registerService:function(_34,_35,_36){
_35=_35||_34.servicePath;
_35=_34.servicePath=_35.match(/\/$/)?_35:(_35+"/");
jr.schemas[_35]=_36||_34._schema||{};
jr.services[_35]=_34;
},byId:function(_37,id){
var _39,_3a=_2._index[(_37.servicePath||"")+id];
if(_3a&&!_3a._loadObject){
_39=new dojo.Deferred();
_39.callback(_3a);
return _39;
}
return this.query(_37,id);
},query:function(_3b,id,_3d){
var _3e=_3b(id,_3d);
_3e.addCallback(function(_3f){
if(_3f.nodeType&&_3f.cloneNode){
return _3f;
}
return dojox.json.ref.resolveJson(_3f,{defaultId:typeof id!="string"||(_3d&&(_3d.start||_3d.count))?undefined:id,index:_2._index,idPrefix:_3b.servicePath,idAttribute:jr.getIdAttribute(_3b),schemas:jr.schemas,loader:jr._loader});
});
return _3e;
},_loader:function(_40){
var _41=jr.getServiceAndId(this.__id);
var _42=this;
jr.query(_41.service,_41.id).addBoth(function(_43){
if(_43==_42){
delete _43.$ref;
delete _43._loadObject;
}else{
_42._loadObject=function(_44){
_44(_43);
};
}
_40(_43);
});
},isDirty:function(_45){
for(var i=0,l=_1.length;i<l;i++){
if(_1[i].object==_45){
return true;
}
}
return false;
}};
})();
}
