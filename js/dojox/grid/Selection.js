/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.grid.Selection"]){
dojo._hasResource["dojox.grid.Selection"]=true;
dojo.provide("dojox.grid.Selection");
dojo.declare("dojox.grid.Selection",null,{constructor:function(_1){
this.grid=_1;
this.selected=[];
},multiSelect:true,selected:null,updating:0,selectedIndex:-1,onCanSelect:function(_2){
return this.grid.onCanSelect(_2);
},onCanDeselect:function(_3){
return this.grid.onCanDeselect(_3);
},onSelected:function(_4){
return this.grid.onSelected(_4);
},onDeselected:function(_5){
return this.grid.onDeselected(_5);
},onChanging:function(){
},onChanged:function(){
return this.grid.onSelectionChanged();
},isSelected:function(_6){
return this.selected[_6];
},getFirstSelected:function(){
if(!this.selected.length){
return -1;
}
for(var i=0,l=this.selected.length;i<l;i++){
if(this.selected[i]){
return i;
}
}
return -1;
},getNextSelected:function(_9){
for(var i=_9+1,l=this.selected.length;i<l;i++){
if(this.selected[i]){
return i;
}
}
return -1;
},getSelected:function(){
var _c=[];
for(var i=0,l=this.selected.length;i<l;i++){
if(this.selected[i]){
_c.push(i);
}
}
return _c;
},getSelectedCount:function(){
var c=0;
for(var i=0;i<this.selected.length;i++){
if(this.selected[i]){
c++;
}
}
return c;
},_beginUpdate:function(){
if(this.updating==0){
this.onChanging();
}
this.updating++;
},_endUpdate:function(){
this.updating--;
if(this.updating==0){
this.onChanged();
}
},select:function(_11){
if(!this.multiSelect){
this.deselectAll(_11);
}
this.addToSelection(_11);
},addToSelection:function(_12){
_12=Number(_12);
if(this.selected[_12]){
this.selectedIndex=_12;
}else{
if(this.onCanSelect(_12)!==false){
this.selectedIndex=_12;
this._beginUpdate();
this.selected[_12]=true;
this.grid.onSelected(_12);
this._endUpdate();
}
}
},deselect:function(_13){
_13=Number(_13);
if(this.selectedIndex==_13){
this.selectedIndex=-1;
}
if(this.selected[_13]){
if(this.onCanDeselect(_13)===false){
return;
}
this._beginUpdate();
delete this.selected[_13];
this.grid.onDeselected(_13);
this._endUpdate();
}
},setSelected:function(_14,_15){
this[(_15?"addToSelection":"deselect")](_14);
},toggleSelect:function(_16){
this.setSelected(_16,!this.selected[_16]);
},_range:function(_17,_18,_19){
var s=(_17>=0?_17:_18),e=_18;
if(s>e){
e=s;
s=_18;
}
for(var i=s;i<=e;i++){
_19(i);
}
},selectRange:function(_1d,_1e){
this._range(_1d,_1e,dojo.hitch(this,"addToSelection"));
},deselectRange:function(_1f,_20){
this._range(_1f,_20,dojo.hitch(this,"deselect"));
},insert:function(_21){
this.selected.splice(_21,0,false);
if(this.selectedIndex>=_21){
this.selectedIndex++;
}
},remove:function(_22){
this.selected.splice(_22,1);
if(this.selectedIndex>=_22){
this.selectedIndex--;
}
},deselectAll:function(_23){
for(var i in this.selected){
if((i!=_23)&&(this.selected[i]===true)){
this.deselect(i);
}
}
},clickSelect:function(_25,_26,_27){
this._beginUpdate();
if(!this.multiSelect){
this.select(_25);
}else{
var _28=this.selectedIndex;
if(!_26){
this.deselectAll(_25);
}
if(_27){
this.selectRange(_28,_25);
}else{
if(_26){
this.toggleSelect(_25);
}else{
this.addToSelection(_25);
}
}
}
this._endUpdate();
},clickSelectEvent:function(e){
this.clickSelect(e.rowIndex,e.ctrlKey,e.shiftKey);
},clear:function(){
this._beginUpdate();
this.deselectAll();
this._endUpdate();
}});
}
