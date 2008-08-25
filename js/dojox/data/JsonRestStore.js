/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.data.JsonRestStore"]){
dojo._hasResource["dojox.data.JsonRestStore"]=true;
dojo.provide("dojox.data.JsonRestStore");
dojo.require("dojox.data.ServiceStore");
dojo.require("dojox.rpc.JsonRest");
dojo.declare("dojox.data.JsonRestStore",dojox.data.ServiceStore,{constructor:function(_1){
dojo.connect(dojox.rpc.Rest._index,"onUpdate",this,function(_2,_3,_4,_5){
var _6=this.service.servicePath;
if(!_2.__id){

}else{
if(_2.__id.substring(0,_6.length)==_6){
this.onSet(_2,_3,_4,_5);
}
}
});
this.idAttribute=this.idAttribute||"id";
if(typeof this.target=="string"&&!this.service){
this.service=dojox.rpc.Rest(this.target,true);
}
dojox.rpc.JsonRest.registerService(this.service,this.target,this.schema);
this.schema=this.service._schema=this.schema||this.service._schema||{};
this.service._store=this;
this.schema._idAttr=this.idAttribute;
this._constructor=dojox.rpc.JsonRest.getConstructor(this.service);
this._index=dojox.rpc.Rest._index;
},newItem:function(_7,_8){
_7=new this._constructor(_7);
if(_8){
var _9=this.getValue(_8.parent,_8.attribute,[]);
this.setValue(_8.parent,_8.attribute,_9.concat([_7]));
}
this.onNew(_7);
return _7;
},deleteItem:function(_a){
dojox.rpc.JsonRest.deleteObject(_a);
var _b=dojox.data._getStoreForItem(_a);
_b._doDelete(_a);
},_doDelete:function(_c){
this.onDelete(_c);
},changing:function(_d,_e){
dojox.rpc.JsonRest.changing(_d,_e);
},setValue:function(_f,_10,_11){
var old=_f[_10];
var _13=dojox.data._getStoreForItem(_f);
if(dojox.json.schema&&_13.schema&&_13.schema.properties){
var _14=dojox.json.schema.checkPropertyChange(_11,_13.schema.properties[_10]);
if(!_14.valid){
throw new Error(dojo.map(_14.errors,function(_15){
return _15.message;
}).join(","));
}
}
if(old!=_11){
_13.changing(_f);
_f[_10]=_11;
_13.onSet(_f,_10,old,_11);
}
},setValues:function(_16,_17,_18){
if(!dojo.isArray(_18)){
throw new Error("setValues expects to be passed an Array object as its value");
}
this.setValue(_16,_17,_18);
},unsetAttribute:function(_19,_1a){
this.changing(_19);
var old=_19[_1a];
delete _19[_1a];
this.onSet(_19,_1a,old,undefined);
},save:function(_1c){
var _1d=dojox.rpc.JsonRest.commit(_1c);
this.serverVersion=this._updates&&this._updates.length;
return _1d;
},revert:function(){
var _1e=dojox.rpc.JsonRest.getDirtyObjects().concat([]);
while(_1e.length>0){
var d=_1e.pop();
if(!d.object){
this.onNew(d.old);
}else{
if(!d.old){
this.onDelete(d.object);
}else{
}
}
}
dojox.rpc.JsonRest.revert();
},isDirty:function(_20){
return dojox.rpc.JsonRest.isDirty(_20);
},isItem:function(_21){
return _21&&_21.__id&&this.service==dojox.rpc.JsonRest.getServiceAndId(_21.__id).service;
},_doQuery:function(_22){
var _23=typeof _22.queryStr=="string"?_22.queryStr:_22.query;
return dojox.rpc.JsonRest.query(this.service,_23,_22);
},_processResults:function(_24,_25){
var _26=_24.length;
return {totalCount:_25.fullLength||(_25.request.count==_26?_26*2:_26),items:_24};
},getConstructor:function(){
return this._constructor;
},getIdentity:function(_27){
var id=_27.__id;
if(!id){
this.inherited(arguments);
}
var _29=this.service.servicePath;
return id.substring(0,_29.length)!=_29?id:id.substring(_29.length);
},fetchItemByIdentity:function(_2a){
var id=_2a.identity;
var _2c=this;
if(id.match(/^(\w*:)?\//)){
var _2d=dojox.rpc.JsonRest.getServiceAndId(id);
_2c=_2d.service._store;
_2a.identity=_2d.id;
}
_2a._prefix=_2c.service.servicePath;
_2c.inherited(arguments);
},onSet:function(){
},onNew:function(){
},onDelete:function(){
},getFeatures:function(){
var _2e=this.inherited(arguments);
_2e["dojo.data.api.Write"]=true;
_2e["dojo.data.api.Notification"]=true;
return _2e;
}});
dojox.data._getStoreForItem=function(_2f){
return dojox.rpc.JsonRest.services[_2f.__id.match(/.*\//)[0]]._store;
};
}
