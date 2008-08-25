/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.form.BusyButton"]){
dojo._hasResource["dojox.form.BusyButton"]=true;
dojo.provide("dojox.form.BusyButton");
dojo.require("dijit.form.Button");
dojo.requireLocalization("dijit","loading",null,"nb,da,pt-pt,tr,el,sv,ru,ROOT,es,pl,fi,ja,zh,ko,hu,nl,de,he,zh-tw,ar,pt,fr,cs,it");
dojo.declare("dojox.form.BusyButton",[dijit.form.Button],{isBusy:false,busyLabel:"",timeout:null,useIcon:true,postMixInProperties:function(){
this.inherited(arguments);
if(!this.busyLabel){
this.busyLabel=dojo.i18n.getLocalization("dijit","loading",this.lang).loadingState;
}
},postCreate:function(){
this._label=this.containerNode.innerHTML;
this._initTimeout=this.timeout;
if(this.isBusy){
this.makeBusy();
}
},makeBusy:function(){
this.isBusy=true;
this.attr("disabled",true);
this.setLabel(this.busyLabel,this.timeout);
},cancel:function(){
this.attr("disabled",false);
this.isBusy=false;
this.setLabel(this._label);
if(this._timeout){
clearTimeout(this._timeout);
}
this.timeout=this._initTimeout;
},resetTimeout:function(_1){
if(this._timeout){
clearTimeout(this._timeout);
}
if(_1){
this._timeout=setTimeout(dojo.hitch(this,function(){
this.cancel();
}),_1);
}else{
if(_1==undefined||_1===0){
this.cancel();
}
}
},setLabel:function(_2,_3){
this.label=_2;
while(this.containerNode.firstChild){
this.containerNode.removeChild(this.containerNode.firstChild);
}
this.containerNode.appendChild(document.createTextNode(this.label));
this._layoutHack();
if(this.showLabel==false&&!(dojo.attr(this.domNode,"title"))){
this.titleNode.title=dojo.trim(this.containerNode.innerText||this.containerNode.textContent||"");
}
if(_3){
this.resetTimeout(_3);
}else{
this.timeout=null;
}
if(this.useIcon&&this.isBusy){
var _4=new Image();
_4.src=this._blankGif;
dojo.attr(_4,"id",this.id+"_icon");
dojo.addClass(_4,"dojoxBusyButtonIcon");
this.containerNode.appendChild(_4);
}
},_clicked:function(e){
if(!this.isBusy){
this.makeBusy();
}
}});
}
