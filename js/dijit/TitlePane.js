/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dijit.TitlePane"]){
dojo._hasResource["dijit.TitlePane"]=true;
dojo.provide("dijit.TitlePane");
dojo.require("dojo.fx");
dojo.require("dijit._Templated");
dojo.require("dijit.layout.ContentPane");
dojo.declare("dijit.TitlePane",[dijit.layout.ContentPane,dijit._Templated],{title:"",open:true,duration:dijit.defaultDuration,baseClass:"dijitTitlePane",templateString:"<div class=\"${baseClass}\">\n\t<div dojoAttachEvent=\"onclick:toggle,onkeypress: _onTitleKey,onfocus:_handleFocus,onblur:_handleFocus\" tabindex=\"0\"\n\t\t\twaiRole=\"button\" class=\"dijitTitlePaneTitle\" dojoAttachPoint=\"titleBarNode,focusNode\">\n\t\t<span dojoAttachPoint=\"arrowNode\" class=\"dijitInline dijitArrowNode\"><span dojoAttachPoint=\"arrowNodeInner\" class=\"dijitArrowNodeInner\"></span></span\n\t\t><span dojoAttachPoint=\"titleNode\" class=\"dijitTitlePaneTextNode\"></span>\n\t</div>\n\t<div class=\"dijitTitlePaneContentOuter\" dojoAttachPoint=\"hideNode\">\n\t\t<div class=\"dijitReset\" dojoAttachPoint=\"wipeNode\">\n\t\t\t<div class=\"dijitTitlePaneContentInner\" dojoAttachPoint=\"containerNode\" waiRole=\"region\" tabindex=\"-1\">\n\t\t\t\t<!-- nested divs because wipeIn()/wipeOut() doesn't work right on node w/padding etc.  Put padding on inner div. -->\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n",attributeMap:dojo.mixin(dojo.clone(dijit.layout.ContentPane.prototype.attributeMap),{title:{node:"titleNode",type:"innerHTML"}}),postCreate:function(){
if(!this.open){
this.hideNode.style.display=this.wipeNode.style.display="none";
}
this._setCss();
dojo.setSelectable(this.titleNode,false);
dijit.setWaiState(this.containerNode,"labelledby",this.titleNode.id);
dijit.setWaiState(this.focusNode,"haspopup","true");
var _1=this.hideNode,_2=this.wipeNode;
this._wipeIn=dojo.fx.wipeIn({node:this.wipeNode,duration:this.duration,beforeBegin:function(){
_1.style.display="";
}});
this._wipeOut=dojo.fx.wipeOut({node:this.wipeNode,duration:this.duration,onEnd:function(){
_1.style.display="none";
}});
this.inherited(arguments);
},_setOpenAttr:function(_3){
if(this.open!==_3){
this.toggle();
}
},_setContentAttr:function(_4){
if(!this.open||this._wipeOut.status()=="playing"){
this.inherited(arguments);
}else{
if(this._wipeIn.status()=="playing"){
this._wipeIn.stop();
}
dojo.marginBox(this.wipeNode,{h:dojo.marginBox(this.wipeNode).h});
this.inherited(arguments);
this._wipeIn.play();
}
},toggle:function(){
dojo.forEach([this._wipeIn,this._wipeOut],function(_5){
if(_5.status()=="playing"){
_5.stop();
}
});
this[this.open?"_wipeOut":"_wipeIn"].play();
this.open=!this.open;
this._loadCheck();
this._setCss();
},_setCss:function(){
var _6=["dijitClosed","dijitOpen"];
var _7=this.open;
var _8=this.titleBarNode||this.focusNode;
dojo.removeClass(_8,_6[!_7+0]);
_8.className+=" "+_6[_7+0];
this.arrowNodeInner.innerHTML=this.open?"-":"+";
},_onTitleKey:function(e){
if(e.charOrCode==dojo.keys.ENTER||e.charOrCode==" "){
this.toggle();
}else{
if(e.charOrCode==dojo.keys.DOWN_ARROW&&this.open){
this.containerNode.focus();
e.preventDefault();
}
}
},_handleFocus:function(e){
dojo[(e.type=="focus"?"addClass":"removeClass")](this.focusNode,this.baseClass+"Focused");
},setTitle:function(_b){
dojo.deprecated("dijit.TitlePane.setTitle() is deprecated.  Use attr('title', ...) instead.","","2.0");
this.titleNode.innerHTML=_b;
}});
}
