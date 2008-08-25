/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dijit.form._FormWidget"]){
dojo._hasResource["dijit.form._FormWidget"]=true;
dojo.provide("dijit.form._FormWidget");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.declare("dijit.form._FormWidget",[dijit._Widget,dijit._Templated],{baseClass:"",name:"",alt:"",value:"",type:"text",tabIndex:"0",disabled:false,readOnly:false,intermediateChanges:false,attributeMap:dojo.mixin(dojo.clone(dijit._Widget.prototype.attributeMap),{value:"focusNode",disabled:"focusNode",readOnly:"focusNode",id:"focusNode",tabIndex:"focusNode",alt:"focusNode"}),_setDisabledAttr:function(_1){
this.disabled=_1;
dojo.attr(this.focusNode,"disabled",_1);
dijit.setWaiState(this.focusNode,"disabled",_1);
if(_1){
this._hovering=false;
this._active=false;
this.focusNode.removeAttribute("tabIndex");
}else{
this.focusNode.setAttribute("tabIndex",this.tabIndex);
}
this._setStateClass();
},setDisabled:function(_2){
dojo.deprecated("setDisabled("+_2+") is deprecated. Use attr('disabled',"+_2+") instead.","","2.0");
this.attr("disabled",_2);
},_onFocus:function(e){
dijit.scrollIntoView(this.domNode);
this.inherited(arguments);
},_onMouse:function(_4){
var _5=_4.currentTarget;
if(_5&&_5.getAttribute){
this.stateModifier=_5.getAttribute("stateModifier")||"";
}
if(!this.disabled){
switch(_4.type){
case "mouseenter":
case "mouseover":
this._hovering=true;
this._active=this._mouseDown;
break;
case "mouseout":
case "mouseleave":
this._hovering=false;
this._active=false;
break;
case "mousedown":
this._active=true;
this._mouseDown=true;
var _6=this.connect(dojo.body(),"onmouseup",function(){
if(this._mouseDown&&this.isFocusable()){
this.focus();
}
this._active=false;
this._mouseDown=false;
this._setStateClass();
this.disconnect(_6);
});
break;
}
this._setStateClass();
}
},isFocusable:function(){
return !this.disabled&&!this.readOnly&&this.focusNode&&(dojo.style(this.domNode,"display")!="none");
},focus:function(){
dijit.focus(this.focusNode);
},_setStateClass:function(){
if(!("staticClass" in this)){
this.staticClass=(this.stateNode||this.domNode).className;
}
var _7=this.baseClass.split(" ");
function multiply(_8){
_7=_7.concat(dojo.map(_7,function(c){
return c+_8;
}),"dijit"+_8);
};
if(this.checked){
multiply("Checked");
}
if(this.state){
multiply(this.state);
}
if(this.selected){
multiply("Selected");
}
if(this.disabled){
multiply("Disabled");
}else{
if(this.readOnly){
multiply("ReadOnly");
}else{
if(this._active){
multiply(this.stateModifier+"Active");
}else{
if(this._focused){
multiply("Focused");
}
if(this._hovering){
multiply(this.stateModifier+"Hover");
}
}
}
}
(this.stateNode||this.domNode).className=this.staticClass+" "+_7.join(" ");
},compare:function(_a,_b){
if((typeof _a=="number")&&(typeof _b=="number")){
return (isNaN(_a)&&isNaN(_b))?0:(_a-_b);
}else{
if(_a>_b){
return 1;
}else{
if(_a<_b){
return -1;
}else{
return 0;
}
}
}
},onChange:function(_c){
},_onChangeActive:false,_handleOnChange:function(_d,_e){
this._lastValue=_d;
if(this._lastValueReported==undefined&&(_e===null||!this._onChangeActive)){
this._resetValue=this._lastValueReported=_d;
}
if((this.intermediateChanges||_e||_e===undefined)&&((typeof _d!=typeof this._lastValueReported)||this.compare(_d,this._lastValueReported)!=0)){
this._lastValueReported=_d;
if(this._onChangeActive){
this.onChange(_d);
}
}
},create:function(){
this.inherited(arguments);
this._onChangeActive=true;
this._setStateClass();
},destroy:function(){
if(this._layoutHackHandle){
clearTimeout(this._layoutHackHandle);
}
this.inherited(arguments);
},setValue:function(_f){
dojo.deprecated("dijit.form._FormWidget:setValue("+_f+") is deprecated.  Use attr('value',"+_f+") instead.","","2.0");
this.attr("value",_f);
},getValue:function(){
dojo.deprecated(this.declaredClass+"::getValue() is deprecated. Use attr('value') instead.","","2.0");
return this.attr("value");
},_layoutHack:function(){
if(dojo.isFF==2){
var _10=this.domNode;
var old=_10.style.opacity;
_10.style.opacity="0.999";
this._layoutHackHandle=setTimeout(dojo.hitch(this,function(){
this._layoutHackHandle=null;
_10.style.opacity=old;
}),0);
}
}});
dojo.declare("dijit.form._FormValueWidget",dijit.form._FormWidget,{attributeMap:dojo.mixin(dojo.clone(dijit.form._FormWidget.prototype.attributeMap),{value:""}),postCreate:function(){
if(dojo.isIE||dojo.isSafari){
this.connect(this.focusNode||this.domNode,"onkeydown",this._onKeyDown);
}
if(this._resetValue===undefined){
this._resetValue=this.value;
}
},_setValueAttr:function(_12,_13){
this.value=_12;
this._handleOnChange(_12,_13);
},_getValueAttr:function(_14){
return this._lastValue;
},undo:function(){
this._setValueAttr(this._lastValueReported,false);
},reset:function(){
this._hasBeenBlurred=false;
this._setValueAttr(this._resetValue,true);
},_valueChanged:function(){
var v=this.attr("value");
var lv=this._lastValueReported;
return ((v!==null&&(v!==undefined)&&v.toString)?v.toString():"")!==((lv!==null&&(lv!==undefined)&&lv.toString)?lv.toString():"");
},_onKeyDown:function(e){
if(e.keyCode==dojo.keys.ESCAPE&&!e.ctrlKey&&!e.altKey){
var te;
if(dojo.isIE){
e.preventDefault();
te=document.createEventObject();
te.keyCode=dojo.keys.ESCAPE;
te.shiftKey=e.shiftKey;
e.srcElement.fireEvent("onkeypress",te);
}else{
if(dojo.isSafari){
te=document.createEvent("Events");
te.initEvent("keypress",true,true);
te.keyCode=dojo.keys.ESCAPE;
te.shiftKey=e.shiftKey;
e.target.dispatchEvent(te);
}
}
}
},_onKeyPress:function(e){
if(e.charOrCode==dojo.keys.ESCAPE&&!e.ctrlKey&&!e.altKey&&this._valueChanged()){
this.undo();
dojo.stopEvent(e);
return false;
}else{
if(this.intermediateChanges){
var _1a=this;
setTimeout(function(){
_1a._handleOnChange(_1a.attr("value"),false);
},0);
}
}
return true;
}});
}
