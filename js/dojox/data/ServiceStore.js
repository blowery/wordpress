/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.data.ServiceStore"]){
dojo._hasResource["dojox.data.ServiceStore"]=true;
dojo.provide("dojox.data.ServiceStore");
dojo.declare("dojox.data.ServiceStore",dojox.data.ClientFilter,{constructor:function(_1){
this.byId=this.fetchItemByIdentity;
this._index={};
if(_1){
dojo.mixin(this,_1);
}
this.idAttribute=this.idAttribute||(this.schema&&this.schema._idAttr);
this.labelAttribute=this.labelAttribute||"label";
},getSchema:function(){
return this.schema;
},loadLazyValues:true,getValue:function(_2,_3,_4){
var _5=_2[_3];
return _5||(_3 in _2?_5:_2._loadObject?(dojox.rpc._sync=true)&&arguments.callee.call(this,dojox.data.ServiceStore.prototype.loadItem({item:_2})||{},_3,_4):_4);
},getValues:function(_6,_7){
var _8=this.getValue(_6,_7);
return _8 instanceof Array?_8:[_8];
},getAttributes:function(_9){
var _a=[];
for(var i in _9){
_a.push(i);
}
return _a;
},hasAttribute:function(_c,_d){
return _d in _c;
},containsValue:function(_e,_f,_10){
return dojo.indexOf(this.getValues(_e,_f),_10)>-1;
},isItem:function(_11){
return typeof _11=="object";
},isItemLoaded:function(_12){
return _12&&!_12._loadObject;
},loadItem:function(_13){
var _14;
if(_13.item._loadObject){
_13.item._loadObject(function(_15){
_14=_15;
delete _14._loadObject;
var _16=_15 instanceof Error?_13.onError:_13.onItem;
if(_16){
_16.call(_13.scope,_15);
}
});
}
return _14;
},_currentId:0,_processResults:function(_17,_18){
if(_17 instanceof Array){
for(var i=0;i<_17.length;i++){
_17[i]=this._processResults(_17[i],_18).items;
}
}else{
if(_17&&typeof _17=="object"){
var id=_17.__id;
if(!id){
if(this.idAttribute){
id=_17[this.idAttribute];
}else{
id=this._currentId++;
}
var _1b=this._index[id];
if(_1b){
for(var j in _1b){
delete _1b[j];
}
_17=dojo.mixin(_1b,_17);
}
_17.__id=id;
this._index[id]=_17;
}
}
}
var _1d=_17.length;
return {totalCount:_18.request.count==_1d?_1d*2:_1d,items:_17};
},close:function(_1e){
return _1e&&_1e.abort&&_1e.abort();
},fetch:function(_1f){
_1f=_1f||{};
if("syncMode" in _1f?_1f.syncMode:this.syncMode){
dojox.rpc._sync=true;
}
var _20=this;
var _21=_1f.scope||_20;
var _22=this.cachingFetch?this.cachingFetch(_1f):this._doQuery(_1f);
_22.request=_1f;
_22.addCallback(function(_23){
if(_1f.clientQuery){
_23=_20.clientSideFetch({query:_1f.clientFetch,sort:_1f.sort,start:_1f.start,count:_1f.count},_23);
}
var _24=_20._processResults(_23,_22);
_23=_1f.results=_24.items;
if(_1f.onBegin){
_1f.onBegin.call(_21,_24.totalCount,_1f);
}
if(_1f.onItem){
for(var i=0;i<_23.length;i++){
_1f.onItem.call(_21,_23[i],_1f);
}
}
if(_1f.onComplete){
_1f.onComplete.call(_21,_1f.onItem?null:_23,_1f);
}
return _23;
});
_22.addErrback(_1f.onError&&dojo.hitch(_21,_1f.onError));
_1f.abort=function(){
_22.ioArgs.xhr.abort();
};
_1f.store=this;
return _1f;
},_doQuery:function(_26){
var _27=typeof _26.queryStr=="string"?_26.queryStr:_26.query;
return this.service(_27);
},getFeatures:function(){
return {"dojo.data.api.Read":true,"dojo.data.api.Identity":true,"dojo.data.api.Schema":this.schema};
},getLabel:function(_28){
return this.getValue(_28,this.labelAttribute);
},getLabelAttributes:function(_29){
return [this.labelAttribute];
},getIdentity:function(_2a){
if(!("__id" in _2a)){
throw new Error("Identity attribute not found");
}
return _2a.__id;
},getIdentityAttributes:function(_2b){
return [this.idAttribute];
},fetchItemByIdentity:function(_2c){
var _2d=this._index[(_2c._prefix||"")+_2c.identity];
if(_2d){
_2c.onItem.call(_2c.scope,_2d);
}else{
return this.fetch({query:_2c.identity,onComplete:_2c.onItem,useIndexCache:true}).results;
}
return _2d;
}});
}
