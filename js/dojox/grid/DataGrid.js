/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.grid.DataGrid"]){
dojo._hasResource["dojox.grid.DataGrid"]=true;
dojo.provide("dojox.grid.DataGrid");
dojo.require("dojox.grid._Grid");
dojo.require("dojox.grid.DataSelection");
dojo.declare("dojox.grid.DataGrid",dojox.grid._Grid,{store:null,query:null,queryOptions:null,fetchText:"...",items:null,_store_connects:null,_by_idty:null,_by_idx:null,_cache:null,_pages:null,_pending_requests:null,_bop:-1,_eop:-1,_requests:0,rowCount:0,_isLoaded:false,_isLoading:false,postCreate:function(){
this._pages=[];
this._store_connects=[];
this._by_idty={};
this._by_idx=[];
this._cache=[];
this._pending_requests={};
this._setStore(this.store);
this.inherited(arguments);
},createSelection:function(){
this.selection=new dojox.grid.DataSelection(this);
},get:function(_1,_2){
return (!_2?this.defaultValue:(!this.field?this.value:this.grid.store.getValue(_2,this.field)));
},_onSet:function(_3,_4,_5,_6){
var _7=this.getItemIndex(_3);
if(_7>-1){
this.updateRow(_7);
}
},_addItem:function(_8,_9){
var _a=this._hasIdentity?this.store.getIdentity(_8):dojo.toJson(this.query)+":idx:"+_9+":sort:"+dojo.toJson(this.getSortProps());
var o={idty:_a,item:_8};
this._by_idty[_a]=this._by_idx[_9]=o;
this.updateRow(_9);
},_onNew:function(_c,_d){
this.updateRowCount(this.rowCount+1);
this._addItem(_c,this.rowCount-1);
this.showMessage();
},_onDelete:function(_e){
var _f=this._getItemIndex(_e,true);
if(_f>=0){
var o=this._by_idx[_f];
this._by_idx.splice(_f,1);
delete this._by_idty[o.idty];
this.updateRowCount(this.rowCount-1);
if(this.rowCount===0){
this.showMessage(this.noDataMessage);
}
}
},_onRevert:function(){
this._refresh();
},setStore:function(_11,_12,_13){
this._setQuery(_12,_13);
this._setStore(_11);
this._refresh(true);
},setQuery:function(_14,_15){
this._setQuery(_14,_15);
this._refresh(true);
},setItems:function(_16){
this.items=_16;
this._setStore(this.store);
this._refresh(true);
},_setQuery:function(_17,_18){
this.query=_17||this.query;
this.queryOptions=_18||this.queryOptions;
},_setStore:function(_19){
if(this.store&&this._store_connects){
dojo.forEach(this._store_connects,function(arr){
dojo.forEach(arr,dojo.disconnect);
});
}
this.store=_19;
if(this.store){
var f=this.store.getFeatures();
var h=[];
this._canEdit=!!f["dojo.data.api.Write"]&&!!f["dojo.data.api.Identity"];
this._hasIdentity=!!f["dojo.data.api.Identity"];
if(!!f["dojo.data.api.Notification"]&&!this.items){
h.push(this.connect(this.store,"onSet","_onSet"));
h.push(this.connect(this.store,"onNew","_onNew"));
h.push(this.connect(this.store,"onDelete","_onDelete"));
}
if(this._canEdit){
h.push(this.connect(this.store,"revert","_onRevert"));
}
this._store_connects=h;
}
},_onFetchBegin:function(_1d,req){
if(this.rowCount!=_1d){
if(req.isRender){
this.scroller.init(_1d,this.keepRows,this.rowsPerPage);
this.prerender();
}
this.updateRowCount(_1d);
}
},_onFetchComplete:function(_1f,req){
if(_1f&&_1f.length>0){
dojo.forEach(_1f,function(_21,idx){
this._addItem(_21,req.start+idx);
},this);
if(req.isRender){
this.setScrollTop(0);
this.postrender();
}else{
if(this._lastScrollTop){
this.setScrollTop(this._lastScrollTop);
}
}
}
delete this._lastScrollTop;
if(!this._isLoaded){
this._isLoading=false;
this._isLoaded=true;
if(!_1f||!_1f.length){
this.showMessage(this.noDataMessage);
}else{
this.showMessage();
}
}
this._pending_requests[req.start]=false;
},_onFetchError:function(err,req){

delete this._lastScrollTop;
if(!this._isLoaded){
this._isLoading=false;
this._isLoaded=true;
this.showMessage(this.errorMessage);
}
this.onFetchError(err,req);
},onFetchError:function(err,req){
},_fetch:function(_27,_28){
var _27=_27||0;
if(this.store&&!this._pending_requests[_27]){
if(!this._isLoaded&&!this._isLoading){
this._isLoading=true;
this.showMessage(this.loadingMessage);
}
this._pending_requests[_27]=true;
try{
if(this.items){
var _29=this.items;
var _2a=this.store;
this.rowsPerPage=_29.length;
var req={start:_27,count:this.rowsPerPage,isRender:_28};
this._onFetchBegin(_29.length,req);
var _2c=0;
dojo.forEach(_29,function(i){
if(!_2a.isItemLoaded(i)){
_2c++;
}
});
if(_2c===0){
this._onFetchComplete(_29,req);
}else{
var _2e=function(_2f){
_2c--;
if(_2c===0){
this._onFetchComplete(_29,req);
}
};
dojo.forEach(_29,function(i){
if(!_2a.isItemLoaded(i)){
_2a.loadItem({item:i,onItem:_2e,scope:this});
}
},this);
}
}else{
this.store.fetch({start:_27,count:this.rowsPerPage,query:this.query,sort:this.getSortProps(),queryOptions:this.queryOptions,isRender:_28,onBegin:dojo.hitch(this,"_onFetchBegin"),onComplete:dojo.hitch(this,"_onFetchComplete"),onError:dojo.hitch(this,"_onFetchError")});
}
}
catch(e){
this._onFetchError(e);
}
}
},_clearData:function(){
this.updateRowCount(0);
this._by_idty={};
this._by_idx=[];
this._pages=[];
this._bop=this._eop=-1;
this._isLoaded=false;
this._isLoading=false;
},getItem:function(idx){
var _32=this._by_idx[idx];
if(!_32||(_32&&!_32.item)){
this._preparePage(idx);
return null;
}
return _32.item;
},getItemIndex:function(_33){
return this._getItemIndex(_33,false);
},_getItemIndex:function(_34,_35){
if(!_35&&!this.store.isItem(_34)){
return -1;
}
var _36=this._hasIdentity?this.store.getIdentity(_34):null;
for(var i=0,l=this._by_idx.length;i<l;i++){
var d=this._by_idx[i];
if(d&&((_36&&d.idty==_36)||(d.item===_34))){
return i;
}
}
return -1;
},filter:function(_3a,_3b){
this.query=_3a;
if(_3b){
this._clearData();
}
this._fetch();
},_getItemAttr:function(idx,_3d){
var _3e=this.getItem(idx);
return (!_3e?this.fetchText:this.store.getValue(_3e,_3d));
},_render:function(){
if(this.domNode.parentNode){
this.scroller.init(this.rowCount,this.keepRows,this.rowsPerPage);
this.prerender();
this._fetch(0,true);
}
},_requestsPending:function(_3f){
return this._pending_requests[_3f];
},_rowToPage:function(_40){
return (this.rowsPerPage?Math.floor(_40/this.rowsPerPage):_40);
},_pageToRow:function(_41){
return (this.rowsPerPage?this.rowsPerPage*_41:_41);
},_preparePage:function(_42){
if(_42<this._bop||_42>=this._eop){
var _43=this._rowToPage(_42);
this._needPage(_43);
this._bop=_43*this.rowsPerPage;
this._eop=this._bop+(this.rowsPerPage||this.rowCount);
}
},_needPage:function(_44){
if(!this._pages[_44]){
this._pages[_44]=true;
this._requestPage(_44);
}
},_requestPage:function(_45){
var row=this._pageToRow(_45);
var _47=Math.min(this.rowsPerPage,this.rowCount-row);
if(_47>0){
this._requests++;
if(!this._requestsPending(row)){
setTimeout(dojo.hitch(this,"_fetch",row,false),1);
}
}
},getCellName:function(_48){
return _48.field;
},_refresh:function(_49){
this._clearData();
this._fetch(0,_49);
},sort:function(){
this._lastScrollTop=this.scrollTop;
this._refresh();
},canSort:function(){
return (!this._isLoading);
},getSortProps:function(){
var c=this.getCell(this.getSortIndex());
if(!c){
return null;
}else{
var _4b=c["sortDesc"];
var si=!(this.sortInfo>0);
if(typeof _4b=="undefined"){
_4b=si;
}else{
_4b=si?!_4b:_4b;
}
return [{attribute:c.field,descending:_4b}];
}
},styleRowState:function(_4d){
if(this.store&&this.store.getState){
var _4e=this.store.getState(_4d.index),c="";
for(var i=0,ss=["inflight","error","inserting"],s;s=ss[i];i++){
if(_4e[s]){
c=" dojoxGridRow-"+s;
break;
}
}
_4d.customClasses+=c;
}
},onStyleRow:function(_53){
this.styleRowState(_53);
this.inherited(arguments);
},canEdit:function(_54,_55){
return this._canEdit;
},_copyAttr:function(idx,_57){
var row={};
var _59={};
var src=this.getItem(idx);
return this.store.getValue(src,_57);
},doStartEdit:function(_5b,_5c){
if(!this._cache[_5c]){
this._cache[_5c]=this._copyAttr(_5c,_5b.field);
}
this.onStartEdit(_5b,_5c);
},doApplyCellEdit:function(_5d,_5e,_5f){
this.store.fetchItemByIdentity({identity:this._by_idx[_5e].idty,onItem:dojo.hitch(this,function(_60){
this.store.setValue(_60,_5f,_5d);
this.onApplyCellEdit(_5d,_5e,_5f);
})});
},doCancelEdit:function(_61){
var _62=this._cache[_61];
if(_62){
this.updateRow(_61);
delete this._cache[_61];
}
this.onCancelEdit.apply(this,arguments);
},doApplyEdit:function(_63,_64){
var _65=this._cache[_63];
this.onApplyEdit(_63);
},removeSelectedRows:function(){
if(this._canEdit){
this.edit.apply();
var _66=this.selection.getSelected();
if(_66.length){
dojo.forEach(_66,this.store.deleteItem,this.store);
this.selection.clear();
}
}
}});
dojox.grid.DataGrid.markupFactory=function(_67,_68,_69,_6a){
return dojox.grid._Grid.markupFactory(_67,_68,_69,function(_6b,_6c){
var _6d=dojo.trim(dojo.attr(_6b,"field")||"");
if(_6d){
_6c.field=_6d;
}
_6c.field=_6c.field||_6c.name;
if(_6a){
_6a(_6b,_6c);
}
});
};
}
