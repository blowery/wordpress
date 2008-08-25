/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dijit._editor.RichText"]){
dojo._hasResource["dijit._editor.RichText"]=true;
dojo.provide("dijit._editor.RichText");
dojo.require("dijit._Widget");
dojo.require("dijit._editor.selection");
dojo.require("dijit._editor.range");
dojo.require("dijit._editor.html");
dojo.require("dojo.i18n");
dojo.requireLocalization("dijit.form","Textarea",null,"nb,da,pt-pt,tr,ROOT,el,sv,ru,es,pl,fi,ja,zh,ko,hu,nl,de,he,zh-tw,ar,pt,fr,cs,it");
if(!dojo.config["useXDomain"]||dojo.config["allowXdRichTextSave"]){
if(dojo._postLoad){
(function(){
var _1=dojo.doc.createElement("textarea");
_1.id=dijit._scopeName+"._editor.RichText.savedContent";
var s=_1.style;
s.display="none";
s.position="absolute";
s.top="-100px";
s.left="-100px";
s.height="3px";
s.width="3px";
dojo.body().appendChild(_1);
})();
}else{
try{
dojo.doc.write("<textarea id=\""+dijit._scopeName+"._editor.RichText.savedContent\" "+"style=\"display:none;position:absolute;top:-100px;left:-100px;height:3px;width:3px;overflow:hidden;\"></textarea>");
}
catch(e){
}
}
}
dijit._editor.RichTextIframeMixin={_writeOpen:function(_3){
if(dojo.isIE||dojo.isSafari||dojo.isOpera){
if(dojo.config["useXDomain"]&&!dojo.config["dojoBlankHtmlUrl"]){
console.warn("dijit._editor.RichText: When using cross-domain Dojo builds,"+" please save dojo/resources/blank.html to your domain and set djConfig.dojoBlankHtmlUrl"+" to the path on your domain to blank.html");
}
var _4=dojo.config["dojoBlankHtmlUrl"]||(dojo.moduleUrl("dojo","resources/blank.html")+"");
var _5=this.editorObject=this.iframe=dojo.doc.createElement("iframe");
_5.id=this.id+"_iframe";
_5.src=_4;
_5.style.border="none";
_5.style.width="100%";
_5.frameBorder=0;
this.editingArea.appendChild(_5);
var h=null;
var _7=dojo.hitch(this,function(){
if(h){
dojo.disconnect(h);
h=null;
}
this.window=_5.contentWindow;
var d=this.document=this.window.document;
d.open();
d.write(this._getIframeDocTxt(_3));
d.close();
if(dojo.isIE>=7){
if(this.height){
_5.style.height=this.height;
}
if(this.minHeight){
_5.style.minHeight=this.minHeight;
}
}else{
_5.style.height=this.height?this.height:this.minHeight;
}
if(dojo.isIE){
this._localizeEditorCommands();
}
this.onLoad();
this.savedContent=this.getValue(true);
});
if(dojo.isIE<7){
var t=setInterval(function(){
if(_5.contentWindow.isLoaded){
clearInterval(t);
_7();
}
},100);
}else{
h=dojo.connect(((dojo.isIE)?_5.contentWindow:_5),"onload",_7);
}
}else{
this._drawIframe(_3);
this.savedContent=this.getValue(true);
}
},_getIframeDocTxt:function(_a){
var _b=dojo.getComputedStyle(this.domNode);
if(!this.height&&!dojo.isMoz){
_a="<div>"+_a+"</div>";
}
var _c=[_b.fontWeight,_b.fontSize,_b.fontFamily].join(" ");
var _d=_b.lineHeight;
if(_d.indexOf("px")>=0){
_d=parseFloat(_d)/parseFloat(_b.fontSize);
}else{
if(_d.indexOf("em")>=0){
_d=parseFloat(_d);
}else{
_d="1.0";
}
}
return [this.isLeftToRight()?"<html><head>":"<html dir='rtl'><head>",(dojo.isMoz?"<title>"+this._localizedIframeTitles.iframeEditTitle+"</title>":""),"<style>","body,html {","\tbackground:transparent;","\tpadding: 0;","\tmargin: 0;","}","body{","\ttop:0px; left:0px; right:0px;",((this.height||dojo.isOpera)?"":"position: fixed;"),"\tfont:",_c,";","\tmin-height:",this.minHeight,";","\tline-height:",_d,"}","p{ margin: 1em 0 !important; }",(this.height?"":"body,html{overflow-y:hidden;/*for IE*/} body > div {overflow-x:auto;/*for FF to show vertical scrollbar*/}"),"li > ul:-moz-first-node, li > ol:-moz-first-node{ padding-top: 1.2em; } ","li{ min-height:1.2em; }","</style>",this._applyEditingAreaStyleSheets(),"</head><body>"+_a+"</body></html>"].join("");
},_drawIframe:function(_e){
if(!this.iframe){
var _f=this.iframe=dojo.doc.createElement("iframe");
_f.id=this.id+"_iframe";
var _10=_f.style;
_10.border="none";
_10.lineHeight="0";
_10.verticalAlign="bottom";
this.editorObject=this.iframe;
this._localizedIframeTitles=dojo.i18n.getLocalization("dijit.form","Textarea");
var _11=dojo.query("label[for=\""+this.id+"\"]");
if(_11.length){
this._localizedIframeTitles.iframeEditTitle=_11[0].innerHTML+" "+this._localizedIframeTitles.iframeEditTitle;
}
}
this.iframe.style.width=this.inheritWidth?this._oldWidth:"100%";
if(this.height){
this.iframe.style.height=this.height;
}else{
this.iframe.height=this._oldHeight;
}
var _12;
if(this.textarea){
_12=this.srcNodeRef;
}else{
_12=dojo.doc.createElement("div");
_12.style.display="none";
_12.innerHTML=_e;
this.editingArea.appendChild(_12);
}
this.editingArea.appendChild(this.iframe);
var _13=dojo.hitch(this,function(){
if(!this.editNode){
if(!this.document){
try{
if(this.iframe.contentWindow){
this.window=this.iframe.contentWindow;
this.document=this.iframe.contentWindow.document;
}else{
if(this.iframe.contentDocument){
this.window=this.iframe.contentDocument.window;
this.document=this.iframe.contentDocument;
}
}
}
catch(e){
setTimeout(_13,50);
return;
}
if(!this.document){
setTimeout(_13,50);
return;
}
var _14=this.document;
_14.open();
_14.write(this._getIframeDocTxt(_e));
_14.close();
dojo._destroyElement(_12);
}
if(!this.document.body){
setTimeout(_13,50);
return;
}
this.onLoad();
}else{
dojo._destroyElement(_12);
this.editNode.innerHTML=_e;
this.onDisplayChanged();
}
this._preDomFilterContent(this.editNode);
});
_13();
},onLoad:function(e){
this.focusNode=this.editNode=(this.height||dojo.isMoz)?this.document.body:this.document.body.firstChild;
dijit._editor.RichText.prototype.onLoad.call(this,e);
},_applyEditingAreaStyleSheets:function(){
var _16=[];
if(this.styleSheets){
_16=this.styleSheets.split(";");
this.styleSheets="";
}
_16=_16.concat(this.editingAreaStyleSheets);
this.editingAreaStyleSheets=[];
var _17="",i=0,url;
while((url=_16[i++])){
var _1a=(new dojo._Url(dojo.global.location,url)).toString();
this.editingAreaStyleSheets.push(_1a);
_17+="<link rel=\"stylesheet\" type=\"text/css\" href=\""+_1a+"\">";
}
return _17;
},addStyleSheet:function(uri){
var url=uri.toString();
if(url.charAt(0)=="."||(url.charAt(0)!="/"&&!uri.host)){
url=(new dojo._Url(dojo.global.location,url)).toString();
}
if(dojo.indexOf(this.editingAreaStyleSheets,url)>-1){
return;
}
this.editingAreaStyleSheets.push(url);
if(this.document.createStyleSheet){
this.document.createStyleSheet(url);
}else{
var _1d=this.document.getElementsByTagName("head")[0];
var _1e=this.document.createElement("link");
with(_1e){
rel="stylesheet";
type="text/css";
href=url;
}
_1d.appendChild(_1e);
}
},removeStyleSheet:function(uri){
var url=uri.toString();
if(url.charAt(0)=="."||(url.charAt(0)!="/"&&!uri.host)){
url=(new dojo._Url(dojo.global.location,url)).toString();
}
var _21=dojo.indexOf(this.editingAreaStyleSheets,url);
if(_21==-1){
return;
}
delete this.editingAreaStyleSheets[_21];
dojo.withGlobal(this.window,"query",dojo,["link:[href=\""+url+"\"]"]).orphan();
},_setDisabledAttr:function(_22){
if(!this.document||!this.editNode||"_delayedDisabled" in this){
this._delayedDisabled=_22;
return;
}
_22=Boolean(_22);
if(dojo.isMoz){
this.document.designMode=_22?"off":"on";
}
dijit._editor.RichText.prototype._setDisabledAttr.call(this,_22);
},blur:function(){
this.window.blur();
}};
dojo.declare("dijit._editor.RichText",dijit._Widget,{constructor:function(_23){
this.contentPreFilters=[];
this.contentPostFilters=[];
this.contentDomPreFilters=[];
this.contentDomPostFilters=[];
this.editingAreaStyleSheets=[];
this._keyHandlers={};
this.contentPreFilters.push(dojo.hitch(this,"_preFixUrlAttributes"));
if(dojo.isMoz){
this.contentPreFilters.push(this._fixContentForMoz);
this.contentPostFilters.push(this._removeMozBogus);
}
if(dojo.isSafari){
this.contentPostFilters.push(this._removeSafariBogus);
}
this.onLoadDeferred=new dojo.Deferred();
this.useIframe=(dojo.isFF&&(dojo.isFF<3))||_23["useIframe"]||_23["styleSheets"];
if(this.useIframe){
dojo.mixin(this,dijit._editor.RichTextIframeMixin);
}
},inheritWidth:false,focusOnLoad:false,name:"",styleSheets:"",useIframe:false,_content:"",height:"300px",minHeight:"1em",isClosed:true,isLoaded:false,_SEPARATOR:"@@**%%__RICHTEXTBOUNDRY__%%**@@",onLoadDeferred:null,isTabIndent:false,postCreate:function(){
if("textarea"==this.domNode.tagName.toLowerCase()){
console.warn("RichText should not be used with the TEXTAREA tag.  See dijit._editor.RichText docs.");
}
dojo.publish(dijit._scopeName+"._editor.RichText::init",[this]);
this.open();
this.setupDefaultShortcuts();
},setupDefaultShortcuts:function(){
var _24=dojo.hitch(this,function(cmd,arg){
return function(){
return !this.execCommand(cmd,arg);
};
});
var _27={b:_24("bold"),i:_24("italic"),u:_24("underline"),a:_24("selectall"),s:function(){
this.save(true);
},m:function(){
this.isTabIndent=!this.isTabIndent;
},"1":_24("formatblock","h1"),"2":_24("formatblock","h2"),"3":_24("formatblock","h3"),"4":_24("formatblock","h4"),"\\":_24("insertunorderedlist")};
if(!dojo.isIE){
_27.Z=_24("redo");
}
for(var key in _27){
this.addKeyHandler(key,true,false,_27[key]);
}
},events:["onKeyPress","onKeyDown","onKeyUp","onClick"],captureEvents:[],_editorCommandsLocalized:false,_localizeEditorCommands:function(){
if(this._editorCommandsLocalized){
return;
}
this._editorCommandsLocalized=true;
var _29=["div","p","pre","h1","h2","h3","h4","h5","h6","ol","ul","address"];
var _2a="",_2b,i=0;
while((_2b=_29[i++])){
if(_2b.charAt(1)!="l"){
_2a+="<"+_2b+"><span>content</span></"+_2b+"><br/>";
}else{
_2a+="<"+_2b+"><li>content</li></"+_2b+"><br/>";
}
}
var div=dojo.doc.createElement("div");
dojo.style(div,{position:"absolute",left:"-2000px",top:"-2000px"});
dojo.doc.body.appendChild(div);
div.innerHTML=_2a;
var _2e=div.firstChild;
while(_2e){
dijit._editor.selection.selectElement(_2e.firstChild);
dojo.withGlobal(this.window,"selectElement",dijit._editor.selection,[_2e.firstChild]);
var _2f=_2e.tagName.toLowerCase();
this._local2NativeFormatNames[_2f]=document.queryCommandValue("formatblock");
this._native2LocalFormatNames[this._local2NativeFormatNames[_2f]]=_2f;
_2e=_2e.nextSibling.nextSibling;
}
dojo.body().removeChild(div);
},open:function(_30){
if((!this.onLoadDeferred)||(this.onLoadDeferred.fired>=0)){
this.onLoadDeferred=new dojo.Deferred();
}
if(!this.isClosed){
this.close();
}
dojo.publish(dijit._scopeName+"._editor.RichText::open",[this]);
this._content="";
if((arguments.length==1)&&(_30["nodeName"])){
this.domNode=_30;
}
var dn=this.domNode;
var _32;
if((dn["nodeName"])&&(dn.nodeName.toLowerCase()=="textarea")){
var ta=this.textarea=dn;
this.name=ta.name;
_32=this._preFilterContent(ta.value);
dn=this.domNode=dojo.doc.createElement("div");
dn.setAttribute("widgetId",this.id);
ta.removeAttribute("widgetId");
dn.cssText=ta.cssText;
dn.className+=" "+ta.className;
dojo.place(dn,ta,"before");
var _34=dojo.hitch(this,function(){
with(ta.style){
display="block";
position="absolute";
left=top="-1000px";
if(dojo.isIE){
this.__overflow=overflow;
overflow="hidden";
}
}
});
if(dojo.isIE){
setTimeout(_34,10);
}else{
_34();
}
if(ta.form){
dojo.connect(ta.form,"onsubmit",this,function(){
ta.value=this.getValue();
});
}
}else{
_32=this._preFilterContent(dijit._editor.getChildrenHtml(dn));
dn.innerHTML="";
}
if(_32==""){
_32="&nbsp;";
}
var _35=dojo.contentBox(dn);
this._oldHeight=_35.h;
this._oldWidth=_35.w;
this.savedContent=_32;
if((dn["nodeName"])&&(dn.nodeName=="LI")){
dn.innerHTML=" <br>";
}
this.editingArea=dn.ownerDocument.createElement("div");
dn.appendChild(this.editingArea);
if(this.name!=""&&(!dojo.config["useXDomain"]||dojo.config["allowXdRichTextSave"])){
var _36=dojo.byId(dijit._scopeName+"._editor.RichText.savedContent");
if(_36.value!=""){
var _37=_36.value.split(this._SEPARATOR),i=0,dat;
while((dat=_37[i++])){
var _3a=dat.split(":");
if(_3a[0]==this.name){
_32=_3a[1];
_37.splice(i,1);
break;
}
}
}
this.connect(window,"onbeforeunload","_saveContent");
}
this.isClosed=false;
this._writeOpen(_32);
if(dn.nodeName=="LI"){
dn.lastChild.style.marginTop="-1.2em";
}
if(this.domNode.nodeName=="LI"){
this.domNode.lastChild.style.marginTop="-1.2em";
}
dojo.addClass(this.domNode,"RichTextEditable");
},_writeOpen:function(_3b){
var en=this.focusNode=this.editNode=this.editingArea;
en.id=this.id;
en.className="dijitEditorArea";
en.innerHTML=_3b;
en.contentEditable=true;
if(this.height){
en.style.height=this.height;
}
if(this.height){
en.style.overflowY="auto";
}
this.window=dojo.global;
this.document=dojo.doc;
if(dojo.isIE){
this._localizeEditorCommands();
}
this.onLoad();
},_local2NativeFormatNames:{},_native2LocalFormatNames:{},_localizedIframeTitles:null,disabled:true,_mozSettingProps:{"styleWithCSS":false},_setDisabledAttr:function(_3d){
if(!this.editNode||"_delayedDisabled" in this){
this._delayedDisabled=_3d;
return;
}
_3d=Boolean(_3d);
this.editNode.contentEditable=!_3d;
this.disabled=_3d;
if(!_3d&&this._mozSettingProps){
var ps=this._mozSettingProps;
for(var n in ps){
if(ps.hasOwnProperty(n)){
try{
this.document.execCommand(n,false,ps[n]);
}
catch(e){
}
}
}
}
},setDisabled:function(_40){
dojo.deprecated("dijit.Editor::setDisabled is deprecated","use dijit.Editor::attr(\"disabled\",boolean) instead",2);
this.attr("disabled",_40);
},_setValueAttr:function(_41){
this.setValue(_41);
},_isResized:function(){
return false;
},onLoad:function(e){
this.isLoaded=true;
if(!this.window.__registeredWindow){
this.window.__registeredWindow=true;
dijit.registerWin(this.window);
}
try{
this.attr("disabled",true);
this.attr("disabled",false);
}
catch(e){
var _43=dojo.connect(this,"onClick",this,function(){
this.attr("disabled",false);
dojo.disconnect(_43);
});
}
this._preDomFilterContent(this.editNode);
var _44=this.events.concat(this.captureEvents);
var ap=(this.iframe)?this.document:this.editNode;
dojo.forEach(_44,function(_46){
this.connect(ap,_46.toLowerCase(),_46);
},this);
if(dojo.isIE){
this.editNode.style.zoom=1;
}
if(this.focusOnLoad){
setTimeout(dojo.hitch(this,"focus"),0);
}
this.onDisplayChanged(e);
if(this.onLoadDeferred){
this.onLoadDeferred.callback(true);
}
if("_delayedDisabled" in this){
var d=this._delayedDisabled;
delete this._delayedDisabled;
this.attr("disabled",d);
}
},onKeyDown:function(e){
if(dojo.isIE){
if(e.keyCode===dojo.keys.BACKSPACE&&this.document.selection.type==="Control"){
dojo.stopEvent(e);
this.execCommand("delete");
}
}
return true;
},onKeyUp:function(e){
return true;
},onKeyPress:function(e){
var c=e.keyChar.toLowerCase()||e.keyCode;
var _4c=this._keyHandlers[c];
var _4d=arguments;
if(_4c){
dojo.forEach(_4c,function(h){
if((!!h.shift==!!e.shiftKey)&&(!!h.ctrl==!!e.ctrlKey)){
if(!h.handler.apply(this,_4d)){
e.preventDefault();
}
}
},this);
}
if(!this._onKeyHitch){
this._onKeyHitch=dojo.hitch(this,"onKeyPressed");
}
setTimeout(this._onKeyHitch,1);
return true;
},addKeyHandler:function(key,_50,_51,_52){
if(!dojo.isArray(this._keyHandlers[key])){
this._keyHandlers[key]=[];
}
this._keyHandlers[key].push({shift:_51||false,ctrl:_50||false,handler:_52});
},onKeyPressed:function(){
this.onDisplayChanged();
},onClick:function(e){
this.onDisplayChanged(e);
},_onMouseDown:function(e){
if(!this._focused&&!this.disabled){
this.focus();
}
},_savedSelection:null,_onBlur:function(e){
this._savedSelection=dijit.range.getSelection(this.window);
this.inherited(arguments);
var _c=this.getValue(true);
if(_c!=this.savedContent){
this.onChange(_c);
this.savedContent=_c;
}
if(dojo.isMoz&&this.iframe){
this.iframe.contentDocument.title=this._localizedIframeTitles.iframeEditTitle;
}
},_initialFocus:true,_onFocus:function(e){
this._savedSelection=null;
if(dojo.isMoz&&this._initialFocus){
this._initialFocus=false;
if(this.editNode.innerHTML.replace(/^\s+|\s+$/g,"")=="&nbsp;"){
this.placeCursorAtStart();
}
}
this.inherited(arguments);
},blur:function(){
this.editNode.blur();
},focus:function(){
if(!this.iframe&&dojo.isSafari){
this._restoreSelection();
return;
}
if(this.iframe&&!dojo.isIE){
dijit.focus(this.iframe);
}else{
if(this.editNode&&this.editNode.focus){
this.editNode.focus();
}
}
},updateInterval:200,_updateTimer:null,onDisplayChanged:function(e){
if(this._updateTimer){
clearTimeout(this._updateTimer);
}
if(!this._updateHandler){
this._updateHandler=dojo.hitch(this,"onNormalizedDisplayChanged");
}
this._updateTimer=setTimeout(this._updateHandler,this.updateInterval);
},onNormalizedDisplayChanged:function(){
delete this._updateTimer;
},onChange:function(_59){
},_normalizeCommand:function(cmd){
var _5b=cmd.toLowerCase();
if(_5b=="formatblock"){
if(dojo.isSafari){
_5b="heading";
}
}else{
if(_5b=="hilitecolor"&&!dojo.isMoz){
_5b="backcolor";
}
}
return _5b;
},_qcaCache:{},queryCommandAvailable:function(_5c){
var ca=this._qcaCache[_5c];
if(ca!=undefined){
return ca;
}
return this._qcaCache[_5c]=this._queryCommandAvailable(_5c);
},_queryCommandAvailable:function(_5e){
var ie=1;
var _60=1<<1;
var _61=1<<2;
var _62=1<<3;
var _63=1<<4;
var _64=dojo.isSafari;
function isSupportedBy(_65){
return {ie:Boolean(_65&ie),mozilla:Boolean(_65&_60),safari:Boolean(_65&_61),safari420:Boolean(_65&_63),opera:Boolean(_65&_62)};
};
var _66=null;
switch(_5e.toLowerCase()){
case "bold":
case "italic":
case "underline":
case "subscript":
case "superscript":
case "fontname":
case "fontsize":
case "forecolor":
case "hilitecolor":
case "justifycenter":
case "justifyfull":
case "justifyleft":
case "justifyright":
case "delete":
case "selectall":
case "toggledir":
_66=isSupportedBy(_60|ie|_61|_62);
break;
case "createlink":
case "unlink":
case "removeformat":
case "inserthorizontalrule":
case "insertimage":
case "insertorderedlist":
case "insertunorderedlist":
case "indent":
case "outdent":
case "formatblock":
case "inserthtml":
case "undo":
case "redo":
case "strikethrough":
case "tabindent":
_66=isSupportedBy(_60|ie|_62|_63);
break;
case "blockdirltr":
case "blockdirrtl":
case "dirltr":
case "dirrtl":
case "inlinedirltr":
case "inlinedirrtl":
_66=isSupportedBy(ie);
break;
case "cut":
case "copy":
case "paste":
_66=isSupportedBy(ie|_60|_63);
break;
case "inserttable":
_66=isSupportedBy(_60|ie);
break;
case "insertcell":
case "insertcol":
case "insertrow":
case "deletecells":
case "deletecols":
case "deleterows":
case "mergecells":
case "splitcell":
_66=isSupportedBy(ie|_60);
break;
default:
return false;
}
return (dojo.isIE&&_66.ie)||(dojo.isMoz&&_66.mozilla)||(dojo.isSafari&&_66.safari)||(_64&&_66.safari420)||(dojo.isOpera&&_66.opera);
},execCommand:function(_67,_68){
var _69;
this.focus();
_67=this._normalizeCommand(_67);
if(_68!=undefined){
if(_67=="heading"){
throw new Error("unimplemented");
}else{
if((_67=="formatblock")&&dojo.isIE){
_68="<"+_68+">";
}
}
}
if(_67=="inserthtml"){
_68=this._preFilterContent(_68);
_69=true;
if(dojo.isIE){
var _6a=this.document.selection.createRange();
_6a.pasteHTML(_68);
_6a.select();
}else{
if(dojo.isMoz&&!_68.length){
this._sCall("remove");
_69=true;
}else{
_69=this.document.execCommand(_67,false,_68);
}
}
}else{
if((_67=="unlink")&&(this.queryCommandEnabled("unlink"))&&(dojo.isMoz||dojo.isSafari)){
var a=this._sCall("getAncestorElement",["a"]);
this._sCall("selectElement",[a]);
_69=this.document.execCommand("unlink",false,null);
}else{
if((_67=="hilitecolor")&&(dojo.isMoz)){
this.document.execCommand("styleWithCSS",false,true);
_69=this.document.execCommand(_67,false,_68);
this.document.execCommand("styleWithCSS",false,false);
}else{
if((dojo.isIE)&&((_67=="backcolor")||(_67=="forecolor"))){
_68=arguments.length>1?_68:null;
_69=this.document.execCommand(_67,false,_68);
}else{
_68=arguments.length>1?_68:null;

if(_68||_67!="createlink"){
_69=this.document.execCommand(_67,false,_68);
}
}
}
}
}
this.onDisplayChanged();
return _69;
},queryCommandEnabled:function(_6c){
if(this.disabled){
return false;
}
_6c=this._normalizeCommand(_6c);
if(dojo.isMoz||dojo.isSafari){
if(_6c=="unlink"){
this._sCall("hasAncestorElement",["a"]);
}else{
if(_6c=="inserttable"){
return true;
}
}
}
if(dojo.isSafari){
if(_6c=="copy"){
_6c="cut";
}else{
if(_6c=="paste"){
return true;
}
}
}
if(_6c=="indent"){
var li=this._sCall("getAncestorElement",["li"]);
var n=li&&li.previousSibling;
while(n){
if(n.nodeType==1){
return true;
}
n=n.previousSibling;
}
return false;
}else{
if(_6c=="outdent"){
return this._sCall("hasAncestorElement",["li"]);
}
}
var _6f=dojo.isIE?this.document.selection.createRange():this.document;
return _6f.queryCommandEnabled(_6c);
},queryCommandState:function(_70){
if(this.disabled){
return false;
}
_70=this._normalizeCommand(_70);
this.editNode.contentEditable=true;
return this.document.queryCommandState(_70);
},queryCommandValue:function(_71){
if(this.disabled){
return false;
}
var r;
_71=this._normalizeCommand(_71);
if(dojo.isIE&&_71=="formatblock"){
r=this._native2LocalFormatNames[this.document.queryCommandValue(_71)];
}else{
r=this.document.queryCommandValue(_71);
}
return this.document.queryCommandValue(_71);
},_sCall:function(_73,_74){
dojo.withGlobal(this.window,_73,dijit._editor.selection,_74);
},placeCursorAtStart:function(){
this.focus();
var _75=false;
if(dojo.isMoz){
var _76=this.editNode.firstChild;
while(_76){
if(_76.nodeType==3){
if(_76.nodeValue.replace(/^\s+|\s+$/g,"").length>0){
_75=true;
this._sCall("selectElement",[_76]);
break;
}
}else{
if(_76.nodeType==1){
_75=true;
this._sCall("selectElementChildren",[_76]);
break;
}
}
_76=_76.nextSibling;
}
}else{
_75=true;
this._sCall("selectElementChildren",[this.editNode]);
}
if(_75){
this._sCall("collapse",[true]);
}
},placeCursorAtEnd:function(){
this.focus();
var _77=false;
if(dojo.isMoz){
var _78=this.editNode.lastChild;
while(_78){
if(_78.nodeType==3){
if(_78.nodeValue.replace(/^\s+|\s+$/g,"").length>0){
_77=true;
this._sCall("selectElement",[_78]);
break;
}
}else{
if(_78.nodeType==1){
_77=true;
if(_78.lastChild){
this._sCall("selectElement",[_78.lastChild]);
}else{
this._sCall("selectElement",[_78]);
}
break;
}
}
_78=_78.previousSibling;
}
}else{
_77=true;
this._sCall("selectElementChildren",[this.editNode]);
}
if(_77){
this._sCall("collapse",[false]);
}
},getValue:function(_79){
if(this.textarea){
if(this.isClosed||!this.isLoaded){
return this.textarea.value;
}
}
return this._postFilterContent(null,_79);
},_getValueAttr:function(){
return this.getValue();
},setValue:function(_7a){
if(this.textarea&&(this.isClosed||!this.isLoaded)){
this.textarea.value=_7a;
}else{
_7a=this._preFilterContent(_7a);
var _7b=this.isClosed?this.domNode:this.editNode;
_7b.innerHTML=_7a;
this._preDomFilterContent(_7b);
}
this.onDisplayChanged();
},replaceValue:function(_7c){
if(this.isClosed){
this.setValue(_7c);
}else{
if(this.window&&this.window.getSelection&&!dojo.isMoz){
this.setValue(_7c);
}else{
if(this.window&&this.window.getSelection){
_7c=this._preFilterContent(_7c);
this.execCommand("selectall");
if(dojo.isMoz&&!_7c){
_7c="&nbsp;";
}
this.execCommand("inserthtml",_7c);
this._preDomFilterContent(this.editNode);
}else{
if(this.document&&this.document.selection){
this.setValue(_7c);
}
}
}
}
},_preFilterContent:function(_7d){
var ec=_7d;
dojo.forEach(this.contentPreFilters,function(ef){
if(ef){
ec=ef(ec);
}
});
return ec;
},_preDomFilterContent:function(dom){
dom=dom||this.editNode;
dojo.forEach(this.contentDomPreFilters,function(ef){
if(ef&&dojo.isFunction(ef)){
ef(dom);
}
},this);
},_postFilterContent:function(dom,_83){
var ec;
if(!dojo.isString(dom)){
dom=dom||this.editNode;
if(this.contentDomPostFilters.length){
if(_83){
dom=dojo.clone(dom);
}
dojo.forEach(this.contentDomPostFilters,function(ef){
dom=ef(dom);
});
}
ec=dijit._editor.getChildrenHtml(dom);
}else{
ec=dom;
}
if(!dojo.trim(ec.replace(/^\xA0\xA0*/,"").replace(/\xA0\xA0*$/,"")).length){
ec="";
}
dojo.forEach(this.contentPostFilters,function(ef){
ec=ef(ec);
});
return ec;
},_saveContent:function(e){
var _88=dojo.byId(dijit._scopeName+"._editor.RichText.savedContent");
_88.value+=this._SEPARATOR+this.name+":"+this.getValue();
},escapeXml:function(str,_8a){
str=str.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;").replace(/"/gm,"&quot;");
if(!_8a){
str=str.replace(/'/gm,"&#39;");
}
return str;
},getNodeHtml:function(_8b){
dojo.deprecated("dijit.Editor::getNodeHtml is deprecated","use dijit._editor.getNodeHtml instead",2);
return dijit._editor.getNodeHtml(_8b);
},getNodeChildrenHtml:function(dom){
dojo.deprecated("dijit.Editor::getNodeChildrenHtml is deprecated","use dijit._editor.getChildrenHtml instead",2);
return dijit._editor.getChildrenHtml(dom);
},close:function(_8d,_8e){
if(this.isClosed){
return false;
}
if(!arguments.length){
_8d=true;
}
this._content=this.getValue();
var _8f=(this.savedContent!=this._content);
if(this.interval){
clearInterval(this.interval);
}
if(this.textarea){
with(this.textarea.style){
position="";
left=top="";
if(dojo.isIE){
overflow=this.__overflow;
this.__overflow=null;
}
}
this.textarea.value=_8d?this._content:this.savedContent;
dojo._destroyElement(this.domNode);
this.domNode=this.textarea;
}else{
this.domNode.innerHTML=_8d?this._content:this.savedContent;
}
dojo.removeClass(this.domNode,"RichTextEditable");
this.isClosed=true;
this.isLoaded=false;
delete this.editNode;
if(this.window&&this.window._frameElement){
this.window._frameElement=null;
}
this.window=null;
this.document=null;
this.editingArea=null;
this.editorObject=null;
return _8f;
},destroyRendering:function(){
},destroy:function(){
this.destroyRendering();
if(!this.isClosed){
this.close(false);
}
this.inherited("destroy",arguments);
},_removeMozBogus:function(_90){
return _90.replace(/\stype="_moz"/gi,"").replace(/\s_moz_dirty=""/gi,"");
},_removeSafariBogus:function(_91){
return _91.replace(/\sclass="webkit-block-placeholder"/gi,"");
},_fixContentForMoz:function(_92){
return _92.replace(/<(\/)?strong([ \>])/gi,"<$1b$2").replace(/<(\/)?em([ \>])/gi,"<$1i$2");
},_preFixUrlAttributes:function(_93){
return _93.replace(/(?:(<a(?=\s).*?\shref=)("|')(.*?)\2)|(?:(<a\s.*?href=)([^"'][^ >]+))/gi,"$1$4$2$3$5$2 _djrealurl=$2$3$5$2").replace(/(?:(<img(?=\s).*?\ssrc=)("|')(.*?)\2)|(?:(<img\s.*?src=)([^"'][^ >]+))/gi,"$1$4$2$3$5$2 _djrealurl=$2$3$5$2");
}});
}
