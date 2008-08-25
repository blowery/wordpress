/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dijit.layout.ContentPane"]){
dojo._hasResource["dijit.layout.ContentPane"]=true;
dojo.provide("dijit.layout.ContentPane");
dojo.require("dijit._Widget");
dojo.require("dijit.layout._LayoutWidget");
dojo.require("dojo.parser");
dojo.require("dojo.string");
dojo.requireLocalization("dijit","loading",null,"nb,da,pt-pt,tr,el,sv,ru,ROOT,es,pl,fi,ja,zh,ko,hu,nl,de,he,zh-tw,ar,pt,fr,cs,it");
dojo.declare("dijit.layout.ContentPane",dijit._Widget,{href:"",extractContent:false,parseOnLoad:true,preventCache:false,preload:false,refreshOnShow:false,loadingMessage:"<span class='dijitContentPaneLoading'>${loadingState}</span>",errorMessage:"<span class='dijitContentPaneError'>${errorState}</span>",isLoaded:false,baseClass:"dijitContentPane",doLayout:"auto",postMixInProperties:function(){
this.inherited(arguments);
var _1=dojo.i18n.getLocalization("dijit","loading",this.lang);
this.loadingMessage=dojo.string.substitute(this.loadingMessage,_1);
this.errorMessage=dojo.string.substitute(this.errorMessage,_1);
},buildRendering:function(){
this.inherited(arguments);
if(!this.containerNode){
this.containerNode=this.domNode;
}
},postCreate:function(){
this.domNode.title="";
if(!dijit.hasWaiRole(this.domNode)){
dijit.setWaiRole(this.domNode,"group");
}
dojo.addClass(this.domNode,this.baseClass);
},startup:function(){
if(this._started){
return;
}
if(this.doLayout!="false"&&this.doLayout!==false){
this._checkIfSingleChild();
if(this._singleChild){
this._singleChild.startup();
}
}
this._loadCheck();
this.inherited(arguments);
},_checkIfSingleChild:function(){
var _2=dojo.query(">",this.containerNode),_3=_2.filter("[widgetId]");
if(_2.length==1&&_3.length==1){
this.isContainer=true;
this._singleChild=dijit.byNode(_3[0]);
}else{
delete this.isContainer;
delete this._singleChild;
}
},refresh:function(){
return this._prepareLoad(true);
},setHref:function(_4){
dojo.deprecated("dijit.layout.ContentPane.setHref() is deprecated.  Use attr('href', ...) instead.","","2.0");
return this.attr("href",_4);
},_setHrefAttr:function(_5){
this.href=_5;
if(this._created){
return this._prepareLoad();
}
},setContent:function(_6){
dojo.deprecated("dijit.layout.ContentPane.setContent() is deprecated.  Use attr('content', ...) instead.","","2.0");
this.attr("content",_6);
},_setContentAttr:function(_7){
if(!this._isDownloaded){
this.href="";
this._onUnloadHandler();
}
this._setContent(_7||"");
this._isDownloaded=false;
if(this.parseOnLoad){
this._createSubWidgets();
}
if(this.doLayout!="false"&&this.doLayout!==false){
this._checkIfSingleChild();
if(this._singleChild&&this._singleChild.resize){
this._singleChild.startup();
var cb=this._contentBox||dojo.contentBox(this.containerNode);
this._singleChild.resize({w:cb.w,h:cb.h});
}
}
this._onLoadHandler();
},_getContentAttr:function(){
return this.containerNode.innerHTML;
},cancel:function(){
if(this._xhrDfd&&(this._xhrDfd.fired==-1)){
this._xhrDfd.cancel();
}
delete this._xhrDfd;
},destroy:function(){
if(this._beingDestroyed){
return;
}
this._onUnloadHandler();
this._beingDestroyed=true;
this.inherited(arguments);
},resize:function(_9){
dojo.marginBox(this.domNode,_9);
var _a=this.containerNode,mb=dojo.mixin(dojo.marginBox(_a),_9||{});
var cb=this._contentBox=dijit.layout.marginBox2contentBox(_a,mb);
if(this._singleChild&&this._singleChild.resize){
this._singleChild.resize({w:cb.w,h:cb.h});
}
},_prepareLoad:function(_d){
this.cancel();
this.isLoaded=false;
this._loadCheck(_d);
},_isShown:function(){
if("open" in this){
return this.open;
}else{
var _e=this.domNode;
return (_e.style.display!="none")&&(_e.style.visibility!="hidden");
}
},_loadCheck:function(_f){
var _10=this._isShown();
if(this.href&&(_f||(this.preload&&!this.isLoaded&&!this._xhrDfd)||(this.refreshOnShow&&_10&&!this._xhrDfd)||(!this.isLoaded&&_10&&!this._xhrDfd))){
this._downloadExternalContent();
}
},_downloadExternalContent:function(){
this._onUnloadHandler();
this._setContent(this.onDownloadStart.call(this));
var _11=this;
var _12={preventCache:(this.preventCache||this.refreshOnShow),url:this.href,handleAs:"text"};
if(dojo.isObject(this.ioArgs)){
dojo.mixin(_12,this.ioArgs);
}
var _13=this._xhrDfd=(this.ioMethod||dojo.xhrGet)(_12);
_13.addCallback(function(_14){
try{
_11.onDownloadEnd.call(_11);
_11._isDownloaded=true;
_11.attr.call(_11,"content",_14);
}
catch(err){
_11._onError.call(_11,"Content",err);
}
delete _11._xhrDfd;
return _14;
});
_13.addErrback(function(err){
if(!_13.cancelled){
_11._onError.call(_11,"Download",err);
}
delete _11._xhrDfd;
return err;
});
},_onLoadHandler:function(){
this.isLoaded=true;
try{
this.onLoad.call(this);
}
catch(e){
console.error("Error "+this.widgetId+" running custom onLoad code");
}
},_onUnloadHandler:function(){
this.isLoaded=false;
this.cancel();
try{
this.onUnload.call(this);
}
catch(e){
console.error("Error "+this.widgetId+" running custom onUnload code");
}
},_setContent:function(_16){
this.destroyDescendants();
try{
var _17=this.containerNode;
while(_17.firstChild){
dojo._destroyElement(_17.firstChild);
}
if(typeof _16=="string"){
if(this.extractContent){
var _18=_16.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
if(_18){
_16=_18[1];
}
}
_17.innerHTML=_16;
}else{
if(_16.domNode){
_17.appendChild(_16.domNode);
}else{
if(_16.nodeType){
_17.appendChild(_16);
}else{
dojo.forEach(_16,function(n){
_17.appendChild(n.cloneNode(true));
});
}
}
}
}
catch(e){
var _1a=this.onContentError(e);
try{
_17.innerHTML=_1a;
}
catch(e){
console.error("Fatal "+this.id+" could not change content due to "+e.message,e);
}
}
},_onError:function(_1b,err,_1d){
var _1e=this["on"+_1b+"Error"].call(this,err);
if(_1d){
console.error(_1d,err);
}else{
if(_1e){
this._setContent.call(this,_1e);
}
}
},_createSubWidgets:function(){
try{
dojo.parser.parse(this.containerNode,true);
}
catch(e){
this._onError("Content",e,"Couldn't create widgets in "+this.id+(this.href?" from "+this.href:""));
}
},onLoad:function(e){
},onUnload:function(e){
},onDownloadStart:function(){
return this.loadingMessage;
},onContentError:function(_21){
},onDownloadError:function(_22){
return this.errorMessage;
},onDownloadEnd:function(){
}});
}
