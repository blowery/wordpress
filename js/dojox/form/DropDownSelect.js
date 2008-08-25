/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.form.DropDownSelect"]){
dojo._hasResource["dojox.form.DropDownSelect"]=true;
dojo.provide("dojox.form.DropDownSelect");
dojo.require("dojox.form._FormSelectWidget");
dojo.require("dojox.form._HasDropDown");
dojo.require("dijit.Menu");
dojo.requireLocalization("dijit.form","validate",null,"nb,da,pt-pt,tr,ROOT,el,sv,ru,es,pl,fi,ja,zh,ko,hu,nl,de,he,zh-tw,ar,pt,fr,cs,it");
dojo.declare("dojox.form.DropDownSelect",[dojox.form._FormSelectWidget,dojox.form._HasDropDown],{baseClass:"dojoxDropDownSelect",templateString:"<div class=\"dijit dijitReset dijitLeft dijitInline\"\n\tdojoAttachPoint=\"dropDownNode\"\n\tdojoAttachEvent=\"onmouseenter:_onMouse,onmouseleave:_onMouse,onmousedown:_onMouse\"\n\twaiRole=\"presentation\"\n\t><div class='dijitReset dijitRight' waiRole=\"presentation\"\n\t><button class=\"dijitReset dijitStretch dijitButtonNode dijitButtonContents\" type=\"button\"\n\t\tdojoAttachPoint=\"focusNode,titleNode\" waiRole=\"button\" waiState=\"haspopup-true,labelledby-${id}_label\"\n\t\t><div class=\"dijitReset dijitInline dijitButtonText\"  dojoAttachPoint=\"containerNode,popupStateNode\" waiRole=\"presentation\"\n\t\t\tid=\"${id}_label\"></div\n\t\t><div class=\"dijitReset dijitInline dijitArrowButtonInner\" waiRole=\"presentation\">&thinsp;</div\n\t\t><div class=\"dijitReset dijitInline dijitArrowButtonChar\" waiRole=\"presentation\">&#9660;</div\n\t></button\n></div></div>\n",required:false,state:"",tooltipPosition:[],emptyLabel:"",_isLoaded:false,_childrenLoaded:false,_fillContent:function(){
this.inherited(arguments);
if(this.options.length&&!this.value){
var si=this.srcNodeRef.selectedIndex;
this.value=this.options[si!=-1?si:0].value;
}
this.dropDown=new dijit.Menu();
},_getMenuItemForOption:function(_2){
if(!_2.value){
return new dijit.MenuSeparator();
}else{
var _3=dojo.hitch(this,"_setValueAttr",_2);
return new dijit.MenuItem({option:_2,label:_2.label,onClick:_3,disabled:_2.disabled||false});
}
},_addOptionItem:function(_4){
this.dropDown.addChild(this._getMenuItemForOption(_4));
},_getChildren:function(){
return this.dropDown.getChildren();
},_loadChildren:function(){
this.inherited(arguments);
var _5=this.options.length;
this._isLoaded=false;
this._childrenLoaded=true;
if(!this._iReadOnly){
this.attr("readOnly",(_5===1));
delete this._iReadOnly;
}
if(!this._iDisabled){
this.attr("disabled",(_5===0));
delete this._iDisabled;
}
this._setValueAttr(this.value);
},_setDisplay:function(_6){
this.containerNode.innerHTML="<div class=\" "+this.baseClass+"Label\">"+(_6||this.emptyLabel||"&nbsp;")+"</div>";
this._layoutHack();
},validate:function(_7){
var _8=this.isValid(_7);
this.state=_8?"":"Error";
this._setStateClass();
dijit.setWaiState(this.focusNode,"invalid",_8?"false":"true");
var _9=_8?"":this._missingMsg;
if(this._message!==_9){
this._message=_9;
dijit.hideTooltip(this.domNode);
if(_9){
dijit.showTooltip(_9,this.domNode,this.tooltipPosition);
}
}
return _8;
},isValid:function(_a){
return (!this.required||!(/^\s*$/.test(this.value)));
},reset:function(){
this.inherited(arguments);
dijit.hideTooltip(this.domNode);
this.state="";
this._setStateClass();
delete this._message;
},postMixInProperties:function(){
this.inherited(arguments);
this._missingMsg=dojo.i18n.getLocalization("dijit.form","validate",this.lang).missingMessage;
},postCreate:function(){
this.inherited(arguments);
if(dojo.attr(this.srcNodeRef,"disabled")){
this.attr("disabled",true);
}
},startup:function(){
if(this._started){
return;
}
if(!this.dropDown){
var _b=dojo.query("[widgetId]",this.dropDownContainer)[0];
this.dropDown=dijit.byNode(_b);
delete this.dropDownContainer;
}
this.inherited(arguments);
},_onMenuMouseup:function(e){
var _d=this.dropDown,t=e.target;
if(_d.onItemClick){
var _f;
while(t&&!(_f=dijit.byNode(t))){
t=t.parentNode;
}
if(_f&&_f.onClick&&_f.getParent){
_f.getParent().onItemClick(_f,e);
}
}
},isLoaded:function(){
return this._isLoaded;
},loadDropDown:function(_10){
this._loadChildren();
dojo.addClass(this.dropDown.domNode,this.baseClass+"Menu");
this._isLoaded=true;
_10();
},_setReadOnlyAttr:function(_11){
this._iReadOnly=_11;
if(!_11&&this._childrenLoaded&&this.options.length===1){
return;
}
this.readOnly=_11;
},_setDisabledAttr:function(_12){
this._iDisabled=_12;
if(!_12&&this._childrenLoaded&&this.options.length===0){
return;
}
this.inherited(arguments);
}});
}
