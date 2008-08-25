/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.layout.ToggleSplitter"]){
dojo._hasResource["dojox.layout.ToggleSplitter"]=true;
dojo.provide("dojox.layout.ToggleSplitter");
dojo.experimental("dojox.layout.ToggleSplitter");
dojo.require("dijit.layout.BorderContainer");
dojo.declare("dojox.layout.ToggleSplitter",[dijit.layout._Splitter],{open:true,closedThreshold:5,openSize:"",_closedSize:"0",templateString:"<div class=\"dijitSplitter dojoxToggleSplitter\" dojoAttachEvent=\"onkeypress:_onKeyPress,onmousedown:_onMouseDown\" tabIndex=\"0\" waiRole=\"separator\"><div dojoAttachPoint=\"toggleNode\" class=\"dijitSplitterThumb dojoxToggleSplitterIcon\"></div></div>",postCreate:function(){
this.inherited(arguments);
var _1=this.region;
dojo.addClass(this.domNode,"dojoxToggleSplitter"+_1.charAt(0).toUpperCase()+_1.substring(1));
this.connect(this,"onDblClick","_toggleMe");
},startup:function(){
this.inherited(arguments);
var _2=this.child.domNode,_3=dojo.style(_2,(this.horizontal?"height":"width"));
dojo.forEach(["toggleSplitterOpen","toggleSplitterClosedThreshold","toggleSplitterOpenSize"],function(_4){
var _5=_4.substring("toggleSplitter".length);
_5=_5.charAt(0).toLowerCase()+_5.substring(1);
if(_4 in this.child){
this[_5]=this.child[_4];
}
},this);
if(!this.openSize){
this.openSize=(this.open)?_3+"px":"75px";
}
this._openStyleProps=this._getStyleProps(_2,true);
this._setOpenAttr(this.open,true);
return;
},_onMouseDown:function(_6){
if(!this.open){
return;
}
var _7=this.horizontal?_6.clientY:_6.clientX;
var _8=3;
var _9=dojo.connect(dojo.body(),"onmouseup",this,function(_a){
dojo.disconnect(_b);
dojo.disconnect(_9);
});
var _b=dojo.connect(dojo.body(),"onmousemove",this,function(_c){
var _d=Math.abs(_7-(this.horizontal?_c.clientY:_c.clientX));
if(_d>=_8){
dojo.disconnect(_b);
dojo.disconnect(_9);
this._startDrag(_c);
}
});
},_handleOnChange:function(){
var _e=this.child.domNode,_f,dim=this.horizontal?"height":"width";
if(this.open){
var _11=dojo.mixin({display:"block",overflow:"auto",visibility:"visible"},this._openStyleProps);
_11[dim]=this._openStyleProps[dim]||this.openSize;
dojo.style(_e,_11);
this.connect(this.domNode,"onmousedown","_onMouseDown");
}else{
var _12=dojo.getComputedStyle(_e);
_f=this._getStyleProps(_e,true,_12);
var _13=this._getStyleProps(_e,false,_12);
this._openStyleProps=_f;
dojo.style(_e,_13);
}
this._setStateClass();
if(this.container._started){
this.container._layoutChildren(this.region);
}
},_getStyleProps:function(_14,_15,_16){
if(!_16){
_16=dojo.getComputedStyle(_14);
}
var _17={},dim=this.horizontal?"height":"width";
_17["overflow"]=(_15)?_16["overflow"]:"hidden";
_17["visibility"]=(_15)?_16["visibility"]:"hidden";
_17[dim]=(_15)?_14.style[dim]||_16[dim]:this._closedSize;
var _19=["Top","Right","Bottom","Left"];
dojo.forEach(["padding","margin","border"],function(_1a){
for(var i=0;i<_19.length;i++){
var _1c=_1a+_19[i];
if(_1a=="border"){
_1a+="Width";
}
if(undefined!==_16[_1c]){
_17[_1c]=(_15)?_16[_1c]:0;
}
}
});
return _17;
},_setStateClass:function(){
if(this.open){
dojo.removeClass(this.domNode,"dojoxToggleSplitterClosed");
dojo.addClass(this.domNode,"dojoxToggleSplitterOpen");
dojo.removeClass(this.toggleNode,"dojoxToggleSplitterIconClosed");
dojo.addClass(this.toggleNode,"dojoxToggleSplitterIconOpen");
}else{
dojo.addClass(this.domNode,"dojoxToggleSplitterClosed");
dojo.removeClass(this.domNode,"dojoxToggleSplitterOpen");
dojo.addClass(this.toggleNode,"dojoxToggleSplitterIconClosed");
dojo.removeClass(this.toggleNode,"dojoxToggleSplitterIconOpen");
}
},_setOpenAttr:function(_1d,_1e){
if(_1e||_1d!=this.open){
this.open=_1d;
this._handleOnChange(_1d,true);
}
},_toggleMe:function(evt){
if(evt){
dojo.stopEvent(evt);
}
this.attr("open",!this.open);
},_onKeyPress:function(e){
this.inherited(arguments);
}});
dojo.extend(dijit._Widget,{toggleSplitterOpen:true,toggleSplitterClosedThreshold:5,toggleSplitterOpenSize:""});
}
