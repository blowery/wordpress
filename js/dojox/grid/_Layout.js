/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.grid._Layout"]){
dojo._hasResource["dojox.grid._Layout"]=true;
dojo.provide("dojox.grid._Layout");
dojo.require("dojox.grid.cells");
dojo.require("dojox.grid._RowSelector");
dojo.declare("dojox.grid._Layout",null,{constructor:function(_1){
this.grid=_1;
},cells:[],structure:null,defaultWidth:"6em",moveColumn:function(_2,_3,_4,_5,_6){
var _7=this.structure[_2].cells[0];
var _8=this.structure[_3].cells[0];
var _9=null;
var _a=0;
var _b=0;
for(var i=0,c;c=_7[i];i++){
if(c.index==_4){
_a=i;
break;
}
}
_9=_7.splice(_a,1)[0];
_9.view=this.grid.views.views[_3];
for(i=0,c=null;c=_8[i];i++){
if(c.index==_5){
_b=i;
break;
}
}
if(!_6){
_b+=1;
}
_8.splice(_b,0,_9);
this.cells=[];
var _4=0;
for(var i=0,v;v=this.structure[i];i++){
for(var j=0,cs;cs=v.cells[j];j++){
for(var k=0,c;c=cs[k];k++){
c.index=_4;
this.cells.push(c);
_4++;
}
}
}
this.grid.setupHeaderMenu();
},setColumnVisibility:function(_12,_13){
var _14=this.cells[_12];
if(_14.hidden==_13){
_14.hidden=!_13;
var v=_14.view,w=v.viewWidth;
v.convertColPctToFixed();
if(w&&w!="auto"){
v._togglingColumn=dojo.marginBox(_14.getHeaderNode()).w||0;
}
v.update();
return true;
}else{
return false;
}
},addCellDef:function(_17,_18,_19){
var _1a=this;
var _1b=function(_1c){
var w=0;
if(_1c.colSpan>1){
w=0;
}else{
if(!isNaN(_1c.width)){
w=_1c.width+"em";
}else{
w=_1c.width||_1a.defaultWidth;
}
}
return w;
};
var _1e={grid:this.grid,subrow:_17,layoutIndex:_18,index:this.cells.length};
if(_19&&_19 instanceof dojox.grid.cells._Base){
_1e.unitWidth=_1b(_19._props);
_19=dojo.mixin(_19,this._defaultCellProps,_19._props,_1e);
return _19;
}
var _1f=_19.type||this._defaultCellProps.type||dojox.grid.cells.Cell;
_1e.unitWidth=_1b(_19);
return new _1f(dojo.mixin({},this._defaultCellProps,_19,_1e));
},addRowDef:function(_20,_21){
var _22=[];
var _23=0,_24=0,_25=true;
for(var i=0,def,_28;(def=_21[i]);i++){
_28=this.addCellDef(_20,i,def);
_22.push(_28);
this.cells.push(_28);
if(_25&&_28.relWidth){
_23+=_28.relWidth;
}else{
if(_28.width){
var w=_28.width;
if(typeof w=="string"&&w.slice(-1)=="%"){
_24+=window.parseInt(w,10);
}else{
if(w=="auto"){
_25=false;
}
}
}
}
}
if(_23&&_25){
dojo.forEach(_22,function(_2a){
if(_2a.relWidth){
_2a.width=_2a.unitWidth=((_2a.relWidth/_23)*(100-_24))+"%";
}
});
}
return _22;
},addRowsDef:function(_2b){
var _2c=[];
if(dojo.isArray(_2b)){
if(dojo.isArray(_2b[0])){
for(var i=0,row;_2b&&(row=_2b[i]);i++){
_2c.push(this.addRowDef(i,row));
}
}else{
_2c.push(this.addRowDef(0,_2b));
}
}
return _2c;
},addViewDef:function(_2f){
this._defaultCellProps=_2f.defaultCell||{};
return dojo.mixin({},_2f,{cells:this.addRowsDef(_2f.rows||_2f.cells)});
},setStructure:function(_30){
this.fieldIndex=0;
this.cells=[];
var s=this.structure=[];
if(this.grid.rowSelector){
var sel={type:dojox._scopeName+".grid._RowSelector"};
if(dojo.isString(this.grid.rowSelector)){
var _33=this.grid.rowSelector;
if(_33=="false"){
sel=null;
}else{
if(_33!="true"){
sel["width"]=_33;
}
}
}else{
if(!this.grid.rowSelector){
sel=null;
}
}
if(sel){
s.push(this.addViewDef(sel));
}
}
var _34=function(def){
return ("name" in def||"field" in def||"get" in def);
};
var _36=function(def){
if(dojo.isArray(def)){
if(dojo.isArray(def[0])||_34(def[0])){
return true;
}
}
return false;
};
var _38=function(def){
return (def!=null&&dojo.isObject(def)&&("cells" in def||"rows" in def||("type" in def&&!_34(def))));
};
if(dojo.isArray(_30)){
var _3a=false;
for(var i=0,st;(st=_30[i]);i++){
if(_38(st)){
_3a=true;
break;
}
}
if(!_3a){
s.push(this.addViewDef({cells:_30}));
}else{
for(var i=0,st;(st=_30[i]);i++){
if(_36(st)){
s.push(this.addViewDef({cells:st}));
}else{
if(_38(st)){
s.push(this.addViewDef(st));
}
}
}
}
}else{
if(_38(_30)){
s.push(this.addViewDef(_30));
}
}
this.cellCount=this.cells.length;
this.grid.setupHeaderMenu();
}});
}
