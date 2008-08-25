/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.grid._FocusManager"]){
dojo._hasResource["dojox.grid._FocusManager"]=true;
dojo.provide("dojox.grid._FocusManager");
dojo.require("dojox.grid.util");
dojo.declare("dojox.grid._FocusManager",null,{constructor:function(_1){
this.grid=_1;
this.cell=null;
this.rowIndex=-1;
this._connects=[];
this._connects.push(dojo.connect(this.grid.domNode,"onfocus",this,"doFocus"));
this._connects.push(dojo.connect(this.grid.domNode,"onblur",this,"doBlur"));
this._connects.push(dojo.connect(this.grid.lastFocusNode,"onfocus",this,"doLastNodeFocus"));
this._connects.push(dojo.connect(this.grid.lastFocusNode,"onblur",this,"doLastNodeBlur"));
},destroy:function(){
dojo.forEach(this._connects,dojo.disconnect);
delete this.grid;
delete this.cell;
},_colHeadNode:null,tabbingOut:false,focusClass:"dojoxGridCellFocus",focusView:null,initFocusView:function(){
this.focusView=this.grid.views.getFirstScrollingView();
this._initColumnHeaders();
},isFocusCell:function(_2,_3){
return (this.cell==_2)&&(this.rowIndex==_3);
},isLastFocusCell:function(){
return (this.rowIndex==this.grid.rowCount-1)&&(this.cell.index==this.grid.layout.cellCount-1);
},isFirstFocusCell:function(){
return (this.rowIndex==0)&&(this.cell.index==0);
},isNoFocusCell:function(){
return (this.rowIndex<0)||!this.cell;
},isNavHeader:function(){
return (!!this._colHeadNode);
},getHeaderIndex:function(){
if(this._colHeadNode){
return dojo.indexOf(this._findHeaderCells(),this._colHeadNode);
}else{
return -1;
}
},_focusifyCellNode:function(_4){
var n=this.cell&&this.cell.getNode(this.rowIndex);
if(n){
dojo.toggleClass(n,this.focusClass,_4);
if(_4){
this.scrollIntoView();
try{
if(!this.grid.edit.isEditing()){
dojox.grid.util.fire(n,"focus");
}
}
catch(e){
}
}
}
},_initColumnHeaders:function(){
this._connects.push(dojo.connect(this.grid.viewsHeaderNode,"onblur",this,"doBlurHeader"));
var _6=this._findHeaderCells();
for(var i=0;i<_6.length;i++){
this._connects.push(dojo.connect(_6[i],"onfocus",this,"doColHeaderFocus"));
this._connects.push(dojo.connect(_6[i],"onblur",this,"doColHeaderBlur"));
}
},_findHeaderCells:function(){
var _8=dojo.query("th",this.grid.viewsHeaderNode);
var _9=[];
for(var i=0;i<_8.length;i++){
var _b=_8[i];
var _c=dojo.hasAttr(_b,"tabindex");
var _d=dojo.attr(_b,"tabindex");
if(_c&&_d<0){
_9.push(_b);
}
}
return _9;
},scrollIntoView:function(){
var _e=(this.cell?this._scrollInfo(this.cell):null);
if(!_e){
return;
}
var rt=this.grid.scroller.findScrollTop(this.rowIndex);
if(_e.n.offsetLeft+_e.n.offsetWidth>_e.sr.l+_e.sr.w){
_e.s.scrollLeft=_e.n.offsetLeft+_e.n.offsetWidth-_e.sr.w;
}else{
if(_e.n.offsetLeft<_e.sr.l){
_e.s.scrollLeft=_e.n.offsetLeft;
}
}
if(rt+_e.r.offsetHeight>_e.sr.t+_e.sr.h){
this.grid.setScrollTop(rt+_e.r.offsetHeight-_e.sr.h);
}else{
if(rt<_e.sr.t){
this.grid.setScrollTop(rt);
}
}
},_scrollInfo:function(_10,_11){
if(_10){
var cl=_10,sbn=cl.view.scrollboxNode,_14={w:sbn.clientWidth,l:sbn.scrollLeft,t:sbn.scrollTop,h:sbn.clientHeight},rn=cl.view.getRowNode(this.rowIndex);
return {c:cl,s:sbn,sr:_14,n:(_11?_11:_10.getNode(this.rowIndex)),r:rn};
}else{
return null;
}
},_scrollHeader:function(_16){
var _17=null;
if(this._colHeadNode){
_17=this._scrollInfo(this.grid.getCell(_16),this._colHeadNode);
}
if(_17){
if(_17.n.offsetLeft+_17.n.offsetWidth>_17.sr.l+_17.sr.w){
_17.s.scrollLeft=_17.n.offsetLeft+_17.n.offsetWidth-_17.sr.w;
}else{
if(_17.n.offsetLeft<_17.sr.l){
_17.s.scrollLeft=_17.n.offsetLeft;
}
}
}
},styleRow:function(_18){
return;
},setFocusIndex:function(_19,_1a){
this.setFocusCell(this.grid.getCell(_1a),_19);
},setFocusCell:function(_1b,_1c){
if(_1b&&!this.isFocusCell(_1b,_1c)){
this.tabbingOut=false;
this._colHeadNode=null;
this.focusGridView();
this._focusifyCellNode(false);
this.cell=_1b;
this.rowIndex=_1c;
this._focusifyCellNode(true);
}
if(dojo.isOpera){
setTimeout(dojo.hitch(this.grid,"onCellFocus",this.cell,this.rowIndex),1);
}else{
this.grid.onCellFocus(this.cell,this.rowIndex);
}
},next:function(){
var row=this.rowIndex,col=this.cell.index+1,cc=this.grid.layout.cellCount-1,rc=this.grid.rowCount-1;
if(col>cc){
col=0;
row++;
}
if(row>rc){
col=cc;
row=rc;
}
this.setFocusIndex(row,col);
},previous:function(){
var row=(this.rowIndex||0),col=(this.cell.index||0)-1;
if(col<0){
col=this.grid.layout.cellCount-1;
row--;
}
if(row<0){
row=0;
col=0;
}
this.setFocusIndex(row,col);
},move:function(_23,_24){
if(this.isNavHeader()){
var _25=this._findHeaderCells();
var _26=dojo.indexOf(_25,this._colHeadNode);
_26+=_24;
if((_26>=0)&&(_26<_25.length)){
this._colHeadNode=_25[_26];
this._colHeadNode.focus();
this._scrollHeader(_26);
}
}else{
var rc=this.grid.rowCount-1,cc=this.grid.layout.cellCount-1,r=this.rowIndex,i=this.cell.index,row=Math.min(rc,Math.max(0,r+_23)),col=Math.min(cc,Math.max(0,i+_24));
this.setFocusIndex(row,col);
if(_23){
this.grid.updateRow(r);
}
}
},previousKey:function(e){
if(!this.isNavHeader()){
this.focusHeader();
dojo.stopEvent(e);
}else{
this.tabOut(this.grid.domNode);
}
},nextKey:function(e){
if(e.target===this.grid.domNode){
this.focusHeader();
dojo.stopEvent(e);
}else{
if(this.isNavHeader()){
this._colHeadNode=null;
if(this.isNoFocusCell()){
this.setFocusIndex(0,0);
}else{
if(this.cell){
this.focusGrid();
}
}
}else{
this.tabOut(this.grid.lastFocusNode);
}
}
},tabOut:function(_2f){
this.tabbingOut=true;
_2f.focus();
},focusGridView:function(){
dojox.grid.util.fire(this.focusView,"focus");
},focusGrid:function(_30){
this.focusGridView();
this._focusifyCellNode(true);
},focusHeader:function(){
var _31=this._findHeaderCells();
if(this.isNoFocusCell()){
this._colHeadNode=_31[0];
}else{
this._colHeadNode=_31[this.cell.index];
}
if(this._colHeadNode){
this._colHeadNode.focus();
this._focusifyCellNode(false);
}
},doFocus:function(e){
if(e&&e.target!=e.currentTarget){
dojo.stopEvent(e);
return;
}
if(!this.tabbingOut){
this.focusHeader();
}
this.tabbingOut=false;
dojo.stopEvent(e);
},doBlur:function(e){
dojo.stopEvent(e);
},doBlurHeader:function(e){
dojo.stopEvent(e);
},doLastNodeFocus:function(e){
if(this.tabbingOut){
this._focusifyCellNode(false);
}else{
this._focusifyCellNode(true);
}
this.tabbingOut=false;
dojo.stopEvent(e);
},doLastNodeBlur:function(e){
dojo.stopEvent(e);
},doColHeaderFocus:function(e){
dojo.toggleClass(e.target,this.focusClass,true);
},doColHeaderBlur:function(e){
dojo.toggleClass(e.target,this.focusClass,false);
}});
}
