/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/

/*
	This is a compiled version of Dojo, built for deployment and not for
	development. To get an editable version, please visit:

		http://dojotoolkit.org

	for documentation and information on getting the source.
*/

if(!dojo._hasResource["dijit._base.focus"]){
dojo._hasResource["dijit._base.focus"]=true;
dojo.provide("dijit._base.focus");
dojo.mixin(dijit,{_curFocus:null,_prevFocus:null,isCollapsed:function(){
var _1=dojo.doc;
if(_1.selection){
var s=_1.selection;
if(s.type=="Text"){
return !s.createRange().htmlText.length;
}else{
return !s.createRange().length;
}
}else{
var _3=dojo.global;
var _4=_3.getSelection();
if(dojo.isString(_4)){
return !_4;
}else{
return _4.isCollapsed||!_4.toString();
}
}
},getBookmark:function(){
var _5,_6=dojo.doc.selection;
if(_6){
var _7=_6.createRange();
if(_6.type.toUpperCase()=="CONTROL"){
if(_7.length){
_5=[];
var i=0,_9=_7.length;
while(i<_9){
_5.push(_7.item(i++));
}
}else{
_5=null;
}
}else{
_5=_7.getBookmark();
}
}else{
if(window.getSelection){
_6=dojo.global.getSelection();
if(_6){
_7=_6.getRangeAt(0);
_5=_7.cloneRange();
}
}else{
console.warn("No idea how to store the current selection for this browser!");
}
}
return _5;
},moveToBookmark:function(_a){
var _b=dojo.doc;
if(_b.selection){
var _c;
if(dojo.isArray(_a)){
_c=_b.body.createControlRange();
dojo.forEach(_a,function(n){
_c.addElement(n);
});
}else{
_c=_b.selection.createRange();
_c.moveToBookmark(_a);
}
_c.select();
}else{
var _e=dojo.global.getSelection&&dojo.global.getSelection();
if(_e&&_e.removeAllRanges){
_e.removeAllRanges();
_e.addRange(_a);
}else{
console.warn("No idea how to restore selection for this browser!");
}
}
},getFocus:function(_f,_10){
return {node:_f&&dojo.isDescendant(dijit._curFocus,_f.domNode)?dijit._prevFocus:dijit._curFocus,bookmark:!dojo.withGlobal(_10||dojo.global,dijit.isCollapsed)?dojo.withGlobal(_10||dojo.global,dijit.getBookmark):null,openedForWindow:_10};
},focus:function(_11){
if(!_11){
return;
}
var _12="node" in _11?_11.node:_11,_13=_11.bookmark,_14=_11.openedForWindow;
if(_12){
var _15=(_12.tagName.toLowerCase()=="iframe")?_12.contentWindow:_12;
if(_15&&_15.focus){
try{
_15.focus();
}
catch(e){
}
}
dijit._onFocusNode(_12);
}
if(_13&&dojo.withGlobal(_14||dojo.global,dijit.isCollapsed)){
if(_14){
_14.focus();
}
try{
dojo.withGlobal(_14||dojo.global,dijit.moveToBookmark,null,[_13]);
}
catch(e){
}
}
},_activeStack:[],registerWin:function(_16){
if(!_16){
_16=window;
}
dojo.connect(_16.document,"onmousedown",function(evt){
dijit._justMouseDowned=true;
setTimeout(function(){
dijit._justMouseDowned=false;
},0);
dijit._onTouchNode(evt.target||evt.srcElement);
});
var _18=_16.document.body||_16.document.getElementsByTagName("body")[0];
if(_18){
if(dojo.isIE){
_18.attachEvent("onactivate",function(evt){
if(evt.srcElement.tagName.toLowerCase()!="body"){
dijit._onFocusNode(evt.srcElement);
}
});
_18.attachEvent("ondeactivate",function(evt){
dijit._onBlurNode(evt.srcElement);
});
}else{
_18.addEventListener("focus",function(evt){
dijit._onFocusNode(evt.target);
},true);
_18.addEventListener("blur",function(evt){
dijit._onBlurNode(evt.target);
},true);
}
}
_18=null;
},_onBlurNode:function(_1d){
dijit._prevFocus=dijit._curFocus;
dijit._curFocus=null;
if(dijit._justMouseDowned){
return;
}
if(dijit._clearActiveWidgetsTimer){
clearTimeout(dijit._clearActiveWidgetsTimer);
}
dijit._clearActiveWidgetsTimer=setTimeout(function(){
delete dijit._clearActiveWidgetsTimer;
dijit._setStack([]);
dijit._prevFocus=null;
},100);
},_onTouchNode:function(_1e){
if(dijit._clearActiveWidgetsTimer){
clearTimeout(dijit._clearActiveWidgetsTimer);
delete dijit._clearActiveWidgetsTimer;
}
var _1f=[];
try{
while(_1e){
if(_1e.dijitPopupParent){
_1e=dijit.byId(_1e.dijitPopupParent).domNode;
}else{
if(_1e.tagName&&_1e.tagName.toLowerCase()=="body"){
if(_1e===dojo.body()){
break;
}
_1e=dijit.getDocumentWindow(_1e.ownerDocument).frameElement;
}else{
var id=_1e.getAttribute&&_1e.getAttribute("widgetId");
if(id){
_1f.unshift(id);
}
_1e=_1e.parentNode;
}
}
}
}
catch(e){
}
dijit._setStack(_1f);
},_onFocusNode:function(_21){
if(_21&&_21.tagName&&_21.tagName.toLowerCase()=="body"){
return;
}
dijit._onTouchNode(_21);
if(_21==dijit._curFocus){
return;
}
if(dijit._curFocus){
dijit._prevFocus=dijit._curFocus;
}
dijit._curFocus=_21;
dojo.publish("focusNode",[_21]);
},_setStack:function(_22){
var _23=dijit._activeStack;
dijit._activeStack=_22;
for(var _24=0;_24<Math.min(_23.length,_22.length);_24++){
if(_23[_24]!=_22[_24]){
break;
}
}
for(var i=_23.length-1;i>=_24;i--){
var _26=dijit.byId(_23[i]);
if(_26){
_26._focused=false;
_26._hasBeenBlurred=true;
if(_26._onBlur){
_26._onBlur();
}
if(_26._setStateClass){
_26._setStateClass();
}
dojo.publish("widgetBlur",[_26]);
}
}
for(i=_24;i<_22.length;i++){
_26=dijit.byId(_22[i]);
if(_26){
_26._focused=true;
if(_26._onFocus){
_26._onFocus();
}
if(_26._setStateClass){
_26._setStateClass();
}
dojo.publish("widgetFocus",[_26]);
}
}
}});
dojo.addOnLoad(dijit.registerWin);
}
if(!dojo._hasResource["dijit._base.manager"]){
dojo._hasResource["dijit._base.manager"]=true;
dojo.provide("dijit._base.manager");
dojo.declare("dijit.WidgetSet",null,{constructor:function(){
this._hash={};
},add:function(_27){
if(this._hash[_27.id]){
throw new Error("Tried to register widget with id=="+_27.id+" but that id is already registered");
}
this._hash[_27.id]=_27;
},remove:function(id){
delete this._hash[id];
},forEach:function(_29){
for(var id in this._hash){
_29(this._hash[id]);
}
},filter:function(_2b){
var res=new dijit.WidgetSet();
this.forEach(function(_2d){
if(_2b(_2d)){
res.add(_2d);
}
});
return res;
},byId:function(id){
return this._hash[id];
},byClass:function(cls){
return this.filter(function(_30){
return _30.declaredClass==cls;
});
}});
dijit.registry=new dijit.WidgetSet();
dijit._widgetTypeCtr={};
dijit.getUniqueId=function(_31){
var id;
do{
id=_31+"_"+(_31 in dijit._widgetTypeCtr?++dijit._widgetTypeCtr[_31]:dijit._widgetTypeCtr[_31]=0);
}while(dijit.byId(id));
return id;
};
if(dojo.isIE){
dojo.addOnWindowUnload(function(){
dijit.registry.forEach(function(_33){
_33.destroy();
});
});
}
dijit.byId=function(id){
return (dojo.isString(id))?dijit.registry.byId(id):id;
};
dijit.byNode=function(_35){
return dijit.registry.byId(_35.getAttribute("widgetId"));
};
dijit.getEnclosingWidget=function(_36){
while(_36){
if(_36.getAttribute&&_36.getAttribute("widgetId")){
return dijit.registry.byId(_36.getAttribute("widgetId"));
}
_36=_36.parentNode;
}
return null;
};
dijit._tabElements={area:true,button:true,input:true,object:true,select:true,textarea:true};
dijit._isElementShown=function(_37){
var _38=dojo.style(_37);
return (_38.visibility!="hidden")&&(_38.visibility!="collapsed")&&(_38.display!="none")&&(dojo.attr(_37,"type")!="hidden");
};
dijit.isTabNavigable=function(_39){
if(dojo.hasAttr(_39,"disabled")){
return false;
}
var _3a=dojo.hasAttr(_39,"tabindex");
var _3b=dojo.attr(_39,"tabindex");
if(_3a&&_3b>=0){
return true;
}
var _3c=_39.nodeName.toLowerCase();
if(((_3c=="a"&&dojo.hasAttr(_39,"href"))||dijit._tabElements[_3c])&&(!_3a||_3b>=0)){
return true;
}
return false;
};
dijit._getTabNavigable=function(_3d){
var _3e,_3f,_40,_41,_42,_43;
var _44=function(_45){
dojo.query("> *",_45).forEach(function(_46){
var _47=dijit._isElementShown(_46);
if(_47&&dijit.isTabNavigable(_46)){
var _48=dojo.attr(_46,"tabindex");
if(!dojo.hasAttr(_46,"tabindex")||_48==0){
if(!_3e){
_3e=_46;
}
_3f=_46;
}else{
if(_48>0){
if(!_40||_48<_41){
_41=_48;
_40=_46;
}
if(!_42||_48>=_43){
_43=_48;
_42=_46;
}
}
}
}
if(_47&&_46.nodeName.toUpperCase()!="SELECT"){
_44(_46);
}
});
};
if(dijit._isElementShown(_3d)){
_44(_3d);
}
return {first:_3e,last:_3f,lowest:_40,highest:_42};
};
dijit.getFirstInTabbingOrder=function(_49){
var _4a=dijit._getTabNavigable(dojo.byId(_49));
return _4a.lowest?_4a.lowest:_4a.first;
};
dijit.getLastInTabbingOrder=function(_4b){
var _4c=dijit._getTabNavigable(dojo.byId(_4b));
return _4c.last?_4c.last:_4c.highest;
};
dijit.defaultDuration=dojo.config["defaultDuration"]||200;
}
if(!dojo._hasResource["dojo.AdapterRegistry"]){
dojo._hasResource["dojo.AdapterRegistry"]=true;
dojo.provide("dojo.AdapterRegistry");
dojo.AdapterRegistry=function(_4d){
this.pairs=[];
this.returnWrappers=_4d||false;
};
dojo.extend(dojo.AdapterRegistry,{register:function(_4e,_4f,_50,_51,_52){
this.pairs[((_52)?"unshift":"push")]([_4e,_4f,_50,_51]);
},match:function(){
for(var i=0;i<this.pairs.length;i++){
var _54=this.pairs[i];
if(_54[1].apply(this,arguments)){
if((_54[3])||(this.returnWrappers)){
return _54[2];
}else{
return _54[2].apply(this,arguments);
}
}
}
throw new Error("No match found");
},unregister:function(_55){
for(var i=0;i<this.pairs.length;i++){
var _57=this.pairs[i];
if(_57[0]==_55){
this.pairs.splice(i,1);
return true;
}
}
return false;
}});
}
if(!dojo._hasResource["dijit._base.place"]){
dojo._hasResource["dijit._base.place"]=true;
dojo.provide("dijit._base.place");
dijit.getViewport=function(){
var _58=dojo.global;
var _59=dojo.doc;
var w=0,h=0;
var de=_59.documentElement;
var dew=de.clientWidth,deh=de.clientHeight;
if(dojo.isMozilla){
var _5f,_60,_61,_62;
var dbw=_59.body.clientWidth;
if(dbw>dew){
_5f=dew;
_61=dbw;
}else{
_61=dew;
_5f=dbw;
}
var dbh=_59.body.clientHeight;
if(dbh>deh){
_60=deh;
_62=dbh;
}else{
_62=deh;
_60=dbh;
}
w=(_61>_58.innerWidth)?_5f:_61;
h=(_62>_58.innerHeight)?_60:_62;
}else{
if(!dojo.isOpera&&_58.innerWidth){
w=_58.innerWidth;
h=_58.innerHeight;
}else{
if(dojo.isIE&&de&&deh){
w=dew;
h=deh;
}else{
if(dojo.body().clientWidth){
w=dojo.body().clientWidth;
h=dojo.body().clientHeight;
}
}
}
}
var _65=dojo._docScroll();
return {w:w,h:h,l:_65.x,t:_65.y};
};
dijit.placeOnScreen=function(_66,pos,_68,_69){
var _6a=dojo.map(_68,function(_6b){
return {corner:_6b,pos:pos};
});
return dijit._place(_66,_6a);
};
dijit._place=function(_6c,_6d,_6e){
var _6f=dijit.getViewport();
if(!_6c.parentNode||String(_6c.parentNode.tagName).toLowerCase()!="body"){
dojo.body().appendChild(_6c);
}
var _70=null;
dojo.some(_6d,function(_71){
var _72=_71.corner;
var pos=_71.pos;
if(_6e){
_6e(_6c,_71.aroundCorner,_72);
}
var _74=_6c.style;
var _75=_74.display;
var _76=_74.visibility;
_74.visibility="hidden";
_74.display="";
var mb=dojo.marginBox(_6c);
_74.display=_75;
_74.visibility=_76;
var _78=(_72.charAt(1)=="L"?pos.x:Math.max(_6f.l,pos.x-mb.w)),_79=(_72.charAt(0)=="T"?pos.y:Math.max(_6f.t,pos.y-mb.h)),_7a=(_72.charAt(1)=="L"?Math.min(_6f.l+_6f.w,_78+mb.w):pos.x),_7b=(_72.charAt(0)=="T"?Math.min(_6f.t+_6f.h,_79+mb.h):pos.y),_7c=_7a-_78,_7d=_7b-_79,_7e=(mb.w-_7c)+(mb.h-_7d);
if(_70==null||_7e<_70.overflow){
_70={corner:_72,aroundCorner:_71.aroundCorner,x:_78,y:_79,w:_7c,h:_7d,overflow:_7e};
}
return !_7e;
});
_6c.style.left=_70.x+"px";
_6c.style.top=_70.y+"px";
if(_70.overflow&&_6e){
_6e(_6c,_70.aroundCorner,_70.corner);
}
return _70;
};
dijit.placeOnScreenAroundNode=function(_7f,_80,_81,_82){
_80=dojo.byId(_80);
var _83=_80.style.display;
_80.style.display="";
var _84=_80.offsetWidth;
var _85=_80.offsetHeight;
var _86=dojo.coords(_80,true);
_80.style.display=_83;
return dijit._placeOnScreenAroundRect(_7f,_86.x,_86.y,_84,_85,_81,_82);
};
dijit.placeOnScreenAroundRectangle=function(_87,_88,_89,_8a){
return dijit._placeOnScreenAroundRect(_87,_88.x,_88.y,_88.width,_88.height,_89,_8a);
};
dijit._placeOnScreenAroundRect=function(_8b,x,y,_8e,_8f,_90,_91){
var _92=[];
for(var _93 in _90){
_92.push({aroundCorner:_93,corner:_90[_93],pos:{x:x+(_93.charAt(1)=="L"?0:_8e),y:y+(_93.charAt(0)=="T"?0:_8f)}});
}
return dijit._place(_8b,_92,_91);
};
dijit.placementRegistry=new dojo.AdapterRegistry();
dijit.placementRegistry.register("node",function(n,x){
return typeof x=="object"&&typeof x.offsetWidth!="undefined"&&typeof x.offsetHeight!="undefined";
},dijit.placeOnScreenAroundNode);
dijit.placementRegistry.register("rect",function(n,x){
return typeof x=="object"&&"x" in x&&"y" in x&&"width" in x&&"height" in x;
},dijit.placeOnScreenAroundRectangle);
dijit.placeOnScreenAroundElement=function(_98,_99,_9a,_9b){
return dijit.placementRegistry.match.apply(dijit.placementRegistry,arguments);
};
}
if(!dojo._hasResource["dijit._base.window"]){
dojo._hasResource["dijit._base.window"]=true;
dojo.provide("dijit._base.window");
dijit.getDocumentWindow=function(doc){
if(dojo.isIE&&window!==document.parentWindow&&!doc._parentWindow){
doc.parentWindow.execScript("document._parentWindow = window;","Javascript");
var win=doc._parentWindow;
doc._parentWindow=null;
return win;
}
return doc._parentWindow||doc.parentWindow||doc.defaultView;
};
}
if(!dojo._hasResource["dijit._base.popup"]){
dojo._hasResource["dijit._base.popup"]=true;
dojo.provide("dijit._base.popup");
dijit.popup=new function(){
var _9e=[],_9f=1000,_a0=1;
this.prepare=function(_a1){
dojo.body().appendChild(_a1);
var s=_a1.style;
if(s.display=="none"){
s.display="";
}
s.visibility="hidden";
s.position="absolute";
s.top="-9999px";
};
this.open=function(_a3){
var _a4=_a3.popup,_a5=_a3.orient||{"BL":"TL","TL":"BL"},_a6=_a3.around,id=(_a3.around&&_a3.around.id)?(_a3.around.id+"_dropdown"):("popup_"+_a0++);
var _a8=dojo.doc.createElement("div");
dijit.setWaiRole(_a8,"presentation");
_a8.id=id;
_a8.className="dijitPopup";
_a8.style.zIndex=_9f+_9e.length;
_a8.style.left=_a8.style.top="0px";
_a8.style.visibility="hidden";
if(_a3.parent){
_a8.dijitPopupParent=_a3.parent.id;
}
dojo.body().appendChild(_a8);
var s=_a4.domNode.style;
s.display="";
s.visibility="";
s.position="";
_a8.appendChild(_a4.domNode);
var _aa=new dijit.BackgroundIframe(_a8);
var _ab=_a6?dijit.placeOnScreenAroundElement(_a8,_a6,_a5,_a4.orient?dojo.hitch(_a4,"orient"):null):dijit.placeOnScreen(_a8,_a3,_a5=="R"?["TR","BR","TL","BL"]:["TL","BL","TR","BR"]);
_a8.style.visibility="visible";
var _ac=[];
var _ad=function(){
for(var pi=_9e.length-1;pi>0&&_9e[pi].parent===_9e[pi-1].widget;pi--){
}
return _9e[pi];
};
_ac.push(dojo.connect(_a8,"onkeypress",this,function(evt){
if(evt.charOrCode==dojo.keys.ESCAPE&&_a3.onCancel){
dojo.stopEvent(evt);
_a3.onCancel();
}else{
if(evt.charOrCode==dojo.keys.TAB){
dojo.stopEvent(evt);
var _b0=_ad();
if(_b0&&_b0.onCancel){
_b0.onCancel();
}
}
}
}));
if(_a4.onCancel){
_ac.push(dojo.connect(_a4,"onCancel",null,_a3.onCancel));
}
_ac.push(dojo.connect(_a4,_a4.onExecute?"onExecute":"onChange",null,function(){
var _b1=_ad();
if(_b1&&_b1.onExecute){
_b1.onExecute();
}
}));
_9e.push({wrapper:_a8,iframe:_aa,widget:_a4,parent:_a3.parent,onExecute:_a3.onExecute,onCancel:_a3.onCancel,onClose:_a3.onClose,handlers:_ac});
if(_a4.onOpen){
_a4.onOpen(_ab);
}
return _ab;
};
this.close=function(_b2){
while(dojo.some(_9e,function(_b3){
return _b3.widget==_b2;
})){
var top=_9e.pop(),_b5=top.wrapper,_b6=top.iframe,_b7=top.widget,_b8=top.onClose;
if(_b7.onClose){
_b7.onClose();
}
dojo.forEach(top.handlers,dojo.disconnect);
if(!_b7||!_b7.domNode){
return;
}
this.prepare(_b7.domNode);
_b6.destroy();
dojo._destroyElement(_b5);
if(_b8){
_b8();
}
}
};
}();
dijit._frames=new function(){
var _b9=[];
this.pop=function(){
var _ba;
if(_b9.length){
_ba=_b9.pop();
_ba.style.display="";
}else{
if(dojo.isIE){
var _bb="<iframe src='javascript:\"\"'"+" style='position: absolute; left: 0px; top: 0px;"+"z-index: -1; filter:Alpha(Opacity=\"0\");'>";
_ba=dojo.doc.createElement(_bb);
}else{
_ba=dojo.doc.createElement("iframe");
_ba.src="javascript:\"\"";
_ba.className="dijitBackgroundIframe";
}
_ba.tabIndex=-1;
dojo.body().appendChild(_ba);
}
return _ba;
};
this.push=function(_bc){
_bc.style.display="";
if(dojo.isIE){
_bc.style.removeExpression("width");
_bc.style.removeExpression("height");
}
_b9.push(_bc);
};
}();
if(dojo.isIE<7){
dojo.addOnLoad(function(){
var f=dijit._frames;
dojo.forEach([f.pop()],f.push);
});
}
dijit.BackgroundIframe=function(_be){
if(!_be.id){
throw new Error("no id");
}
if((dojo.isIE&&dojo.isIE<7)||(dojo.isFF&&dojo.isFF<3&&dojo.hasClass(dojo.body(),"dijit_a11y"))){
var _bf=dijit._frames.pop();
_be.appendChild(_bf);
if(dojo.isIE){
_bf.style.setExpression("width",dojo._scopeName+".doc.getElementById('"+_be.id+"').offsetWidth");
_bf.style.setExpression("height",dojo._scopeName+".doc.getElementById('"+_be.id+"').offsetHeight");
}
this.iframe=_bf;
}
};
dojo.extend(dijit.BackgroundIframe,{destroy:function(){
if(this.iframe){
dijit._frames.push(this.iframe);
delete this.iframe;
}
}});
}
if(!dojo._hasResource["dijit._base.scroll"]){
dojo._hasResource["dijit._base.scroll"]=true;
dojo.provide("dijit._base.scroll");
dijit.scrollIntoView=function(_c0){
_c0=dojo.byId(_c0);
var _c1=_c0.ownerDocument.body;
var _c2=_c1.parentNode;
if(dojo.isFF==2||_c0==_c1||_c0==_c2){
_c0.scrollIntoView(false);
return;
}
var rtl=!dojo._isBodyLtr();
var _c4=dojo.doc.compatMode!="BackCompat";
var _c5=(_c4&&!dojo.isSafari)?_c2:_c1;
function addPseudoAttrs(_c6){
var _c7=_c6.parentNode;
var _c8=_c6.offsetParent;
if(_c8==null){
_c6=_c5;
_c8=_c2;
_c7=null;
}
_c6._offsetParent=(_c8==_c1)?_c5:_c8;
_c6._parent=(_c7==_c1)?_c5:_c7;
_c6._start={H:_c6.offsetLeft,V:_c6.offsetTop};
_c6._scroll={H:_c6.scrollLeft,V:_c6.scrollTop};
_c6._renderedSize={H:_c6.offsetWidth,V:_c6.offsetHeight};
var bp=dojo._getBorderExtents(_c6);
_c6._borderStart={H:bp.l,V:bp.t};
_c6._borderSize={H:bp.w,V:bp.h};
_c6._clientSize=(_c6._offsetParent==_c2&&dojo.isSafari&&_c4)?{H:_c2.clientWidth,V:_c2.clientHeight}:{H:_c6.clientWidth,V:_c6.clientHeight};
_c6._scrollBarSize={V:null,H:null};
for(var dir in _c6._scrollBarSize){
var _cb=_c6._renderedSize[dir]-_c6._clientSize[dir]-_c6._borderSize[dir];
_c6._scrollBarSize[dir]=(_c6._clientSize[dir]>0&&_cb>=15&&_cb<=17)?_cb:0;
}
_c6._isScrollable={V:null,H:null};
for(dir in _c6._isScrollable){
var _cc=dir=="H"?"V":"H";
_c6._isScrollable[dir]=_c6==_c5||_c6._scroll[dir]||_c6._scrollBarSize[_cc];
}
};
var _cd=_c0;
while(_cd!=null){
addPseudoAttrs(_cd);
var _ce=_cd._parent;
if(_ce){
_ce._child=_cd;
}
_cd=_ce;
}
for(var dir in _c5._renderedSize){
_c5._renderedSize[dir]=Math.min(_c5._clientSize[dir],_c5._renderedSize[dir]);
}
var _d0=_c0;
while(_d0!=_c5){
_cd=_d0._parent;
if(_cd.tagName=="TD"){
var _d1=_cd._parent._parent._parent;
if(_d1._offsetParent==_d0._offsetParent&&_cd._offsetParent!=_d0._offsetParent){
_cd=_d1;
}
}
var _d2=_d0==_c5||(_cd._offsetParent!=_d0._offsetParent);
for(dir in _d0._start){
var _d3=dir=="H"?"V":"H";
if(rtl&&dir=="H"&&(dojo.isSafari||dojo.isIE)&&_cd._clientSize.H>0){
var _d4=_cd.scrollWidth-_cd._clientSize.H;
if(_d4>0){
_cd._scroll.H-=_d4;
}
}
if(dojo.isIE&&_cd._offsetParent.tagName=="TABLE"){
_cd._start[dir]-=_cd._offsetParent._borderStart[dir];
_cd._borderStart[dir]=_cd._borderSize[dir]=0;
}
if(_cd._clientSize[dir]==0){
_cd._renderedSize[dir]=_cd._clientSize[dir]=_cd._child._clientSize[dir];
if(rtl&&dir=="H"){
_cd._start[dir]-=_cd._renderedSize[dir];
}
}else{
_cd._renderedSize[dir]-=_cd._borderSize[dir]+_cd._scrollBarSize[dir];
}
_cd._start[dir]+=_cd._borderStart[dir];
var _d5=_d0._start[dir]-(_d2?0:_cd._start[dir])-_cd._scroll[dir];
var _d6=_d5+_d0._renderedSize[dir]-_cd._renderedSize[dir];
var _d7,_d8=(dir=="H")?"scrollLeft":"scrollTop";
var _d9=(dir=="H"&&rtl);
var _da=_d9?-_d6:_d5;
var _db=_d9?-_d5:_d6;
if(_da<=0){
_d7=_da;
}else{
if(_db<=0){
_d7=0;
}else{
if(_da<_db){
_d7=_da;
}else{
_d7=_db;
}
}
}
var _dc=0;
if(_d7!=0){
var _dd=_cd[_d8];
_cd[_d8]+=_d9?-_d7:_d7;
_dc=_cd[_d8]-_dd;
_d5-=_dc;
_db-=_d9?-_dc:_dc;
}
_cd._renderedSize[dir]=_d0._renderedSize[dir]+_cd._scrollBarSize[dir]-((_cd._isScrollable[dir]&&_db>0)?_db:0);
_cd._start[dir]+=(_d5>=0||!_cd._isScrollable[dir])?_d5:0;
}
_d0=_cd;
}
};
}
if(!dojo._hasResource["dijit._base.sniff"]){
dojo._hasResource["dijit._base.sniff"]=true;
dojo.provide("dijit._base.sniff");
(function(){
var d=dojo;
var ie=d.isIE;
var _e0=d.isOpera;
var maj=Math.floor;
var ff=d.isFF;
var _e3=d.boxModel.replace(/-/,"");
var _e4={dj_ie:ie,dj_ie6:maj(ie)==6,dj_ie7:maj(ie)==7,dj_iequirks:ie&&d.isQuirks,dj_opera:_e0,dj_opera8:maj(_e0)==8,dj_opera9:maj(_e0)==9,dj_khtml:d.isKhtml,dj_safari:d.isSafari,dj_gecko:d.isMozilla,dj_ff2:maj(ff)==2,dj_ff3:maj(ff)==3};
_e4["dj_"+_e3]=true;
var _e5=dojo.doc.documentElement;
for(var p in _e4){
if(_e4[p]){
if(_e5.className){
_e5.className+=" "+p;
}else{
_e5.className=p;
}
}
}
dojo._loaders.unshift(function(){
if(!dojo._isBodyLtr()){
_e5.className+=" dijitRtl";
for(var p in _e4){
if(_e4[p]){
_e5.className+=" "+p+"-rtl";
}
}
}
});
})();
}
if(!dojo._hasResource["dijit._base.typematic"]){
dojo._hasResource["dijit._base.typematic"]=true;
dojo.provide("dijit._base.typematic");
dijit.typematic={_fireEventAndReload:function(){
this._timer=null;
this._callback(++this._count,this._node,this._evt);
this._currentTimeout=(this._currentTimeout<0)?this._initialDelay:((this._subsequentDelay>1)?this._subsequentDelay:Math.round(this._currentTimeout*this._subsequentDelay));
this._timer=setTimeout(dojo.hitch(this,"_fireEventAndReload"),this._currentTimeout);
},trigger:function(evt,_e9,_ea,_eb,obj,_ed,_ee){
if(obj!=this._obj){
this.stop();
this._initialDelay=_ee||500;
this._subsequentDelay=_ed||0.9;
this._obj=obj;
this._evt=evt;
this._node=_ea;
this._currentTimeout=-1;
this._count=-1;
this._callback=dojo.hitch(_e9,_eb);
this._fireEventAndReload();
}
},stop:function(){
if(this._timer){
clearTimeout(this._timer);
this._timer=null;
}
if(this._obj){
this._callback(-1,this._node,this._evt);
this._obj=null;
}
},addKeyListener:function(_ef,_f0,_f1,_f2,_f3,_f4){
if(_f0.keyCode){
_f0.charOrCode=_f0.keyCode;
dojo.deprecated("keyCode attribute parameter for dijit.typematic.addKeyListener is deprecated. Use charOrCode instead.","","2.0");
}else{
if(_f0.charCode){
_f0.charOrCode=String.fromCharCode(_f0.charCode);
dojo.deprecated("charCode attribute parameter for dijit.typematic.addKeyListener is deprecated. Use charOrCode instead.","","2.0");
}
}
return [dojo.connect(_ef,"onkeypress",this,function(evt){
if(evt.charOrCode==_f0.charOrCode&&(_f0.ctrlKey===undefined||_f0.ctrlKey==evt.ctrlKey)&&(_f0.altKey===undefined||_f0.altKey==evt.ctrlKey)&&(_f0.shiftKey===undefined||_f0.shiftKey==evt.ctrlKey)){
dojo.stopEvent(evt);
dijit.typematic.trigger(_f0,_f1,_ef,_f2,_f0,_f3,_f4);
}else{
if(dijit.typematic._obj==_f0){
dijit.typematic.stop();
}
}
}),dojo.connect(_ef,"onkeyup",this,function(evt){
if(dijit.typematic._obj==_f0){
dijit.typematic.stop();
}
})];
},addMouseListener:function(_f7,_f8,_f9,_fa,_fb){
var dc=dojo.connect;
return [dc(_f7,"mousedown",this,function(evt){
dojo.stopEvent(evt);
dijit.typematic.trigger(evt,_f8,_f7,_f9,_f7,_fa,_fb);
}),dc(_f7,"mouseup",this,function(evt){
dojo.stopEvent(evt);
dijit.typematic.stop();
}),dc(_f7,"mouseout",this,function(evt){
dojo.stopEvent(evt);
dijit.typematic.stop();
}),dc(_f7,"mousemove",this,function(evt){
dojo.stopEvent(evt);
}),dc(_f7,"dblclick",this,function(evt){
dojo.stopEvent(evt);
if(dojo.isIE){
dijit.typematic.trigger(evt,_f8,_f7,_f9,_f7,_fa,_fb);
setTimeout(dojo.hitch(this,dijit.typematic.stop),50);
}
})];
},addListener:function(_102,_103,_104,_105,_106,_107,_108){
return this.addKeyListener(_103,_104,_105,_106,_107,_108).concat(this.addMouseListener(_102,_105,_106,_107,_108));
}};
}
if(!dojo._hasResource["dijit._base.wai"]){
dojo._hasResource["dijit._base.wai"]=true;
dojo.provide("dijit._base.wai");
dijit.wai={onload:function(){
var div=dojo.doc.createElement("div");
div.id="a11yTestNode";
div.style.cssText="border: 1px solid;"+"border-color:red green;"+"position: absolute;"+"height: 5px;"+"top: -999px;"+"background-image: url(\""+(dojo.config.blankGif||dojo.moduleUrl("dojo","resources/blank.gif"))+"\");";
dojo.body().appendChild(div);
var cs=dojo.getComputedStyle(div);
if(cs){
var _10b=cs.backgroundImage;
var _10c=(cs.borderTopColor==cs.borderRightColor)||(_10b!=null&&(_10b=="none"||_10b=="url(invalid-url:)"));
dojo[_10c?"addClass":"removeClass"](dojo.body(),"dijit_a11y");
if(dojo.isIE){
div.outerHTML="";
}else{
dojo.body().removeChild(div);
}
}
}};
if(dojo.isIE||dojo.isMoz){
dojo._loaders.unshift(dijit.wai.onload);
}
dojo.mixin(dijit,{_XhtmlRoles:/banner|contentinfo|definition|main|navigation|search|note|secondary|seealso/,hasWaiRole:function(elem,role){
var _10f=this.getWaiRole(elem);
if(role){
return (_10f.indexOf(role)>-1);
}else{
return (_10f.length>0);
}
},getWaiRole:function(elem){
return dojo.trim((dojo.attr(elem,"role")||"").replace(this._XhtmlRoles,"").replace("wairole:",""));
},setWaiRole:function(elem,role){
var _113=(theRole=dojo.attr(elem,"role"))?theRole:"";
if(dojo.isFF<3||!this._XhtmlRoles.test(_113)){
dojo.attr(elem,"role",dojo.isFF<3?"wairole:"+role:role);
}else{
if((" "+_113+" ").indexOf(" "+role+" ")<0){
var _114=dojo.trim(_113.replace(this._XhtmlRoles,""));
var _115=dojo.trim(_113.replace(_114,""));
dojo.attr(elem,"role",_115+(_115?" ":"")+role);
}
}
},removeWaiRole:function(elem,role){
var _118=dojo.attr(elem,"role");
if(!_118){
return;
}
if(role){
var _119=dojo.isFF<3?"wairole:"+role:role;
var t=dojo.trim((" "+_118+" ").replace(" "+_119+" "," "));
dojo.attr(elem,"role",t);
}else{
elem.removeAttribute("role");
}
},hasWaiState:function(elem,_11c){
if(dojo.isFF<3){
return elem.hasAttributeNS("http://www.w3.org/2005/07/aaa",_11c);
}else{
return elem.hasAttribute?elem.hasAttribute("aria-"+_11c):!!elem.getAttribute("aria-"+_11c);
}
},getWaiState:function(elem,_11e){
if(dojo.isFF<3){
return elem.getAttributeNS("http://www.w3.org/2005/07/aaa",_11e);
}else{
var _11f=elem.getAttribute("aria-"+_11e);
return _11f?_11f:"";
}
},setWaiState:function(elem,_121,_122){
if(dojo.isFF<3){
elem.setAttributeNS("http://www.w3.org/2005/07/aaa","aaa:"+_121,_122);
}else{
elem.setAttribute("aria-"+_121,_122);
}
},removeWaiState:function(elem,_124){
if(dojo.isFF<3){
elem.removeAttributeNS("http://www.w3.org/2005/07/aaa",_124);
}else{
elem.removeAttribute("aria-"+_124);
}
}});
}
if(!dojo._hasResource["dijit._base"]){
dojo._hasResource["dijit._base"]=true;
dojo.provide("dijit._base");
}
if(!dojo._hasResource["dojo.date.stamp"]){
dojo._hasResource["dojo.date.stamp"]=true;
dojo.provide("dojo.date.stamp");
dojo.date.stamp.fromISOString=function(_125,_126){
if(!dojo.date.stamp._isoRegExp){
dojo.date.stamp._isoRegExp=/^(?:(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(.\d+)?)?((?:[+-](\d{2}):(\d{2}))|Z)?)?$/;
}
var _127=dojo.date.stamp._isoRegExp.exec(_125);
var _128=null;
if(_127){
_127.shift();
if(_127[1]){
_127[1]--;
}
if(_127[6]){
_127[6]*=1000;
}
if(_126){
_126=new Date(_126);
dojo.map(["FullYear","Month","Date","Hours","Minutes","Seconds","Milliseconds"],function(prop){
return _126["get"+prop]();
}).forEach(function(_12a,_12b){
if(_127[_12b]===undefined){
_127[_12b]=_12a;
}
});
}
_128=new Date(_127[0]||1970,_127[1]||0,_127[2]||1,_127[3]||0,_127[4]||0,_127[5]||0,_127[6]||0);
var _12c=0;
var _12d=_127[7]&&_127[7].charAt(0);
if(_12d!="Z"){
_12c=((_127[8]||0)*60)+(Number(_127[9])||0);
if(_12d!="-"){
_12c*=-1;
}
}
if(_12d){
_12c-=_128.getTimezoneOffset();
}
if(_12c){
_128.setTime(_128.getTime()+_12c*60000);
}
}
return _128;
};
dojo.date.stamp.toISOString=function(_12e,_12f){
var _=function(n){
return (n<10)?"0"+n:n;
};
_12f=_12f||{};
var _132=[];
var _133=_12f.zulu?"getUTC":"get";
var date="";
if(_12f.selector!="time"){
var year=_12e[_133+"FullYear"]();
date=["0000".substr((year+"").length)+year,_(_12e[_133+"Month"]()+1),_(_12e[_133+"Date"]())].join("-");
}
_132.push(date);
if(_12f.selector!="date"){
var time=[_(_12e[_133+"Hours"]()),_(_12e[_133+"Minutes"]()),_(_12e[_133+"Seconds"]())].join(":");
var _137=_12e[_133+"Milliseconds"]();
if(_12f.milliseconds){
time+="."+(_137<100?"0":"")+_(_137);
}
if(_12f.zulu){
time+="Z";
}else{
if(_12f.selector!="time"){
var _138=_12e.getTimezoneOffset();
var _139=Math.abs(_138);
time+=(_138>0?"-":"+")+_(Math.floor(_139/60))+":"+_(_139%60);
}
}
_132.push(time);
}
return _132.join("T");
};
}
if(!dojo._hasResource["dojo.parser"]){
dojo._hasResource["dojo.parser"]=true;
dojo.provide("dojo.parser");
dojo.parser=new function(){
var d=dojo;
var _13b=d._scopeName+"Type";
var qry="["+_13b+"]";
function val2type(_13d){
if(d.isString(_13d)){
return "string";
}
if(typeof _13d=="number"){
return "number";
}
if(typeof _13d=="boolean"){
return "boolean";
}
if(d.isFunction(_13d)){
return "function";
}
if(d.isArray(_13d)){
return "array";
}
if(_13d instanceof Date){
return "date";
}
if(_13d instanceof d._Url){
return "url";
}
return "object";
};
function str2obj(_13e,type){
switch(type){
case "string":
return _13e;
case "number":
return _13e.length?Number(_13e):NaN;
case "boolean":
return typeof _13e=="boolean"?_13e:!(_13e.toLowerCase()=="false");
case "function":
if(d.isFunction(_13e)){
_13e=_13e.toString();
_13e=d.trim(_13e.substring(_13e.indexOf("{")+1,_13e.length-1));
}
try{
if(_13e.search(/[^\w\.]+/i)!=-1){
_13e=d.parser._nameAnonFunc(new Function(_13e),this);
}
return d.getObject(_13e,false);
}
catch(e){
return new Function();
}
case "array":
return _13e?_13e.split(/\s*,\s*/):[];
case "date":
switch(_13e){
case "":
return new Date("");
case "now":
return new Date();
default:
return d.date.stamp.fromISOString(_13e);
}
case "url":
return d.baseUrl+_13e;
default:
return d.fromJson(_13e);
}
};
var _140={};
function getClassInfo(_141){
if(!_140[_141]){
var cls=d.getObject(_141);
if(!d.isFunction(cls)){
throw new Error("Could not load class '"+_141+"'. Did you spell the name correctly and use a full path, like 'dijit.form.Button'?");
}
var _143=cls.prototype;
var _144={};
for(var name in _143){
if(name.charAt(0)=="_"){
continue;
}
var _146=_143[name];
_144[name]=val2type(_146);
}
_140[_141]={cls:cls,params:_144};
}
return _140[_141];
};
this._functionFromScript=function(_147){
var _148="";
var _149="";
var _14a=_147.getAttribute("args");
if(_14a){
d.forEach(_14a.split(/\s*,\s*/),function(part,idx){
_148+="var "+part+" = arguments["+idx+"]; ";
});
}
var _14d=_147.getAttribute("with");
if(_14d&&_14d.length){
d.forEach(_14d.split(/\s*,\s*/),function(part){
_148+="with("+part+"){";
_149+="}";
});
}
return new Function(_148+_147.innerHTML+_149);
};
this.instantiate=function(_14f){
var _150=[];
d.forEach(_14f,function(node){
if(!node){
return;
}
var type=node.getAttribute(_13b);
if((!type)||(!type.length)){
return;
}
var _153=getClassInfo(type);
var _154=_153.cls;
var ps=_154._noScript||_154.prototype._noScript;
var _156={};
var _157=node.attributes;
for(var name in _153.params){
var item=_157.getNamedItem(name);
if(!item||(!item.specified&&(!dojo.isIE||name.toLowerCase()!="value"))){
continue;
}
var _15a=item.value;
switch(name){
case "class":
_15a=node.className;
break;
case "style":
_15a=node.style&&node.style.cssText;
}
var _15b=_153.params[name];
_156[name]=str2obj(_15a,_15b);
}
if(!ps){
var _15c=[],_15d=[];
d.query("> script[type^='dojo/']",node).orphan().forEach(function(_15e){
var _15f=_15e.getAttribute("event"),type=_15e.getAttribute("type"),nf=d.parser._functionFromScript(_15e);
if(_15f){
if(type=="dojo/connect"){
_15c.push({event:_15f,func:nf});
}else{
_156[_15f]=nf;
}
}else{
_15d.push(nf);
}
});
}
var _161=_154["markupFactory"];
if(!_161&&_154["prototype"]){
_161=_154.prototype["markupFactory"];
}
var _162=_161?_161(_156,node,_154):new _154(_156,node);
_150.push(_162);
var _163=node.getAttribute("jsId");
if(_163){
d.setObject(_163,_162);
}
if(!ps){
d.forEach(_15c,function(_164){
d.connect(_162,_164.event,null,_164.func);
});
d.forEach(_15d,function(func){
func.call(_162);
});
}
});
d.forEach(_150,function(_166){
if(_166&&_166.startup&&!_166._started&&(!_166.getParent||!_166.getParent())){
_166.startup();
}
});
return _150;
};
this.parse=function(_167){
var list=d.query(qry,_167);
var _169=this.instantiate(list);
return _169;
};
}();
(function(){
var _16a=function(){
if(dojo.config["parseOnLoad"]==true){
dojo.parser.parse();
}
};
if(dojo.exists("dijit.wai.onload")&&(dijit.wai.onload===dojo._loaders[0])){
dojo._loaders.splice(1,0,_16a);
}else{
dojo._loaders.unshift(_16a);
}
})();
dojo.parser._anonCtr=0;
dojo.parser._anon={};
dojo.parser._nameAnonFunc=function(_16b,_16c){
var jpn="$joinpoint";
var nso=(_16c||dojo.parser._anon);
if(dojo.isIE){
var cn=_16b["__dojoNameCache"];
if(cn&&nso[cn]===_16b){
return _16b["__dojoNameCache"];
}
}
var ret="__"+dojo.parser._anonCtr++;
while(typeof nso[ret]!="undefined"){
ret="__"+dojo.parser._anonCtr++;
}
nso[ret]=_16b;
return ret;
};
}
if(!dojo._hasResource["dijit._Widget"]){
dojo._hasResource["dijit._Widget"]=true;
dojo.provide("dijit._Widget");
dojo.require("dijit._base");
dojo.connect(dojo,"connect",function(_171,_172){
if(_171&&dojo.isFunction(_171._onConnect)){
_171._onConnect(_172);
}
});
dijit._connectOnUseEventHandler=function(_173){
};
(function(){
var _174={};
var _175=function(dc){
if(!_174[dc]){
var r=[];
var _178;
var _179=dojo.getObject(dc).prototype;
for(var _17a in _179){
if(dojo.isFunction(_179[_17a])&&(_178=_17a.match(/^_set([a-zA-Z]*)Attr$/))&&_178[1]){
r.push(_178[1].charAt(0).toLowerCase()+_178[1].substr(1));
}
}
_174[dc]=r;
}
return _174[dc]||[];
};
dojo.declare("dijit._Widget",null,{id:"",lang:"",dir:"","class":"",style:"",title:"",srcNodeRef:null,domNode:null,containerNode:null,attributeMap:{id:"",dir:"",lang:"","class":"",style:"",title:""},_deferredConnects:{onClick:"",onDblClick:"",onKeyDown:"",onKeyPress:"",onKeyUp:"",onMouseMove:"",onMouseDown:"",onMouseOut:"",onMouseOver:"",onMouseLeave:"",onMouseEnter:"",onMouseUp:""},onClick:dijit._connectOnUseEventHandler,onDblClick:dijit._connectOnUseEventHandler,onKeyDown:dijit._connectOnUseEventHandler,onKeyPress:dijit._connectOnUseEventHandler,onKeyUp:dijit._connectOnUseEventHandler,onMouseDown:dijit._connectOnUseEventHandler,onMouseMove:dijit._connectOnUseEventHandler,onMouseOut:dijit._connectOnUseEventHandler,onMouseOver:dijit._connectOnUseEventHandler,onMouseLeave:dijit._connectOnUseEventHandler,onMouseEnter:dijit._connectOnUseEventHandler,onMouseUp:dijit._connectOnUseEventHandler,_blankGif:(dojo.config.blankGif||dojo.moduleUrl("dojo","resources/blank.gif")),postscript:function(_17b,_17c){
this.create(_17b,_17c);
},create:function(_17d,_17e){
this.srcNodeRef=dojo.byId(_17e);
this._connects=[];
this._deferredConnects=dojo.clone(this._deferredConnects);
for(var attr in this.attributeMap){
delete this._deferredConnects[attr];
}
for(attr in this._deferredConnects){
if(this[attr]!==dijit._connectOnUseEventHandler){
delete this._deferredConnects[attr];
}
}
if(this.srcNodeRef&&(typeof this.srcNodeRef.id=="string")){
this.id=this.srcNodeRef.id;
}
if(_17d){
this.params=_17d;
dojo.mixin(this,_17d);
}
this.postMixInProperties();
if(!this.id){
this.id=dijit.getUniqueId(this.declaredClass.replace(/\./g,"_"));
}
dijit.registry.add(this);
this.buildRendering();
if(this.domNode){
this._applyAttributes();
for(attr in this.params){
this._onConnect(attr);
}
}
if(this.domNode){
this.domNode.setAttribute("widgetId",this.id);
}
this.postCreate();
if(this.srcNodeRef&&!this.srcNodeRef.parentNode){
delete this.srcNodeRef;
}
this._created=true;
},_applyAttributes:function(){
var _180=function(attr,_182){
if((_182.params&&attr in _182.params)||_182[attr]){
_182.attr(attr,_182[attr]);
}
};
for(var attr in this.attributeMap){
_180(attr,this);
}
dojo.forEach(_175(this.declaredClass),function(a){
if(!(a in this.attributeMap)){
_180(a,this);
}
},this);
},postMixInProperties:function(){
},buildRendering:function(){
this.domNode=this.srcNodeRef||dojo.doc.createElement("div");
},postCreate:function(){
},startup:function(){
this._started=true;
},destroyRecursive:function(_185){
this.destroyDescendants(_185);
this.destroy(_185);
},destroy:function(_186){
this.uninitialize();
dojo.forEach(this._connects,function(_187){
dojo.forEach(_187,dojo.disconnect);
});
dojo.forEach(this._supportingWidgets||[],function(w){
if(w.destroy){
w.destroy();
}
});
this.destroyRendering(_186);
dijit.registry.remove(this.id);
},destroyRendering:function(_189){
if(this.bgIframe){
this.bgIframe.destroy(_189);
delete this.bgIframe;
}
if(this.domNode){
if(!_189){
dojo._destroyElement(this.domNode);
}
delete this.domNode;
}
if(this.srcNodeRef){
if(!_189){
dojo._destroyElement(this.srcNodeRef);
}
delete this.srcNodeRef;
}
},destroyDescendants:function(_18a){
dojo.forEach(this.getDescendants(),function(_18b){
if(_18b.destroy){
_18b.destroy(_18a);
}
});
},uninitialize:function(){
return false;
},onFocus:function(){
},onBlur:function(){
},_onFocus:function(e){
this.onFocus();
},_onBlur:function(){
this.onBlur();
},_onConnect:function(_18d){
if(_18d in this._deferredConnects){
var _18e=this[this._deferredConnects[_18d]||"domNode"];
this.connect(_18e,_18d.toLowerCase(),this[_18d]);
delete this._deferredConnects[_18d];
}
},_setClassAttr:function(_18f){
var _190=this[this.attributeMap["class"]||"domNode"];
dojo.removeClass(_190,this["class"]);
this["class"]=_18f;
dojo.addClass(_190,_18f);
},_setStyleAttr:function(_191){
var _192=this[this.attributeMap["style"]||"domNode"];
if(_192.style.cssText){
_192.style.cssText+="; "+_191;
}else{
_192.style.cssText=_191;
}
this["style"]=_191;
},setAttribute:function(attr,_194){
dojo.deprecated(this.declaredClass+"::setAttribute() is deprecated. Use attr() instead.","","2.0");
this.attr(attr,_194);
},_attrToDom:function(attr,_196){
var _197=this.attributeMap[attr];
dojo.forEach(dojo.isArray(_197)?_197:[_197],function(_198){
var _199=this[_198.node||_198||"domNode"];
var type=_198.type||"attribute";
switch(type){
case "attribute":
if(dojo.isFunction(_196)){
_196=dojo.hitch(this,_196);
}
if(/^on[A-Z][a-zA-Z]*$/.test(attr)){
attr=attr.toLowerCase();
}
dojo.attr(_199,attr,_196);
break;
case "innerHTML":
_199.innerHTML=_196;
break;
case "class":
dojo.removeClass(_199,this[attr]);
dojo.addClass(_199,_196);
break;
}
},this);
this[attr]=_196;
},attr:function(name,_19c){
var args=arguments.length;
if(args==1&&!dojo.isString(name)){
for(var x in name){
this.attr(x,name[x]);
}
return this;
}
var _19f=this._getAttrNames(name);
if(args==2){
if(this[_19f.s]){
return this[_19f.s](_19c)||this;
}else{
if(name in this.attributeMap){
this._attrToDom(name,_19c);
}
this[name]=_19c;
}
return this;
}else{
if(this[_19f.g]){
return this[_19f.g]();
}else{
return this[name];
}
}
},_attrPairNames:{},_getAttrNames:function(name){
var apn=this._attrPairNames;
if(apn[name]){
return apn[name];
}
var uc=name.charAt(0).toUpperCase()+name.substr(1);
return apn[name]={n:name+"Node",s:"_set"+uc+"Attr",g:"_get"+uc+"Attr"};
},toString:function(){
return "[Widget "+this.declaredClass+", "+(this.id||"NO ID")+"]";
},getDescendants:function(){
if(this.containerNode){
var list=dojo.query("[widgetId]",this.containerNode);
return list.map(dijit.byNode);
}else{
return [];
}
},nodesWithKeyClick:["input","button"],connect:function(obj,_1a5,_1a6){
var d=dojo;
var dco=d.hitch(d,"connect",obj);
var _1a9=[];
if(_1a5=="ondijitclick"){
if(!this.nodesWithKeyClick[obj.nodeName]){
var m=d.hitch(this,_1a6);
_1a9.push(dco("onkeydown",this,function(e){
if(!d.isFF&&e.keyCode==d.keys.ENTER){
return m(e);
}else{
if(e.keyCode==d.keys.SPACE){
d.stopEvent(e);
}
}
}),dco("onkeyup",this,function(e){
if(e.keyCode==d.keys.SPACE){
return m(e);
}
}));
if(d.isFF){
_1a9.push(dco("onkeypress",this,function(e){
if(e.keyCode==d.keys.ENTER){
return m(e);
}
}));
}
}
_1a5="onclick";
}
_1a9.push(dco(_1a5,this,_1a6));
this._connects.push(_1a9);
return _1a9;
},disconnect:function(_1ae){
for(var i=0;i<this._connects.length;i++){
if(this._connects[i]==_1ae){
dojo.forEach(_1ae,dojo.disconnect);
this._connects.splice(i,1);
return;
}
}
},isLeftToRight:function(){
return dojo._isBodyLtr();
},isFocusable:function(){
return this.focus&&(dojo.style(this.domNode,"display")!="none");
},placeAt:function(_1b0,_1b1){
if(_1b0["declaredClass"]&&_1b0["addChild"]){
_1b0.addChild(this,_1b1);
}else{
dojo.place(this.domNode,_1b0,_1b1);
}
return this;
}});
})();
}
if(!dojo._hasResource["dojo.string"]){
dojo._hasResource["dojo.string"]=true;
dojo.provide("dojo.string");
dojo.string.rep=function(str,num){
if(num<=0||!str){
return "";
}
var buf=[];
for(;;){
if(num&1){
buf.push(str);
}
if(!(num>>=1)){
break;
}
str+=str;
}
return buf.join("");
};
dojo.string.pad=function(text,size,ch,end){
if(!ch){
ch="0";
}
var out=String(text),pad=dojo.string.rep(ch,Math.ceil((size-out.length)/ch.length));
return end?out+pad:pad+out;
};
dojo.string.substitute=function(_1bb,map,_1bd,_1be){
_1be=_1be||dojo.global;
_1bd=(!_1bd)?function(v){
return v;
}:dojo.hitch(_1be,_1bd);
return _1bb.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g,function(_1c0,key,_1c2){
var _1c3=dojo.getObject(key,false,map);
if(_1c2){
_1c3=dojo.getObject(_1c2,false,_1be).call(_1be,_1c3,key);
}
return _1bd(_1c3,key).toString();
});
};
dojo.string.trim=function(str){
str=str.replace(/^\s+/,"");
for(var i=str.length-1;i>=0;i--){
if(/\S/.test(str.charAt(i))){
str=str.substring(0,i+1);
break;
}
}
return str;
};
}
if(!dojo._hasResource["dijit._Templated"]){
dojo._hasResource["dijit._Templated"]=true;
dojo.provide("dijit._Templated");
dojo.declare("dijit._Templated",null,{templateNode:null,templateString:null,templatePath:null,widgetsInTemplate:false,_skipNodeCache:false,_stringRepl:function(tmpl){
var _1c7=this.declaredClass,_1c8=this;
return dojo.string.substitute(tmpl,this,function(_1c9,key){
if(key.charAt(0)=="!"){
_1c9=_1c8[key.substr(1)];
}
if(typeof _1c9=="undefined"){
throw new Error(_1c7+" template:"+key);
}
if(!_1c9){
return "";
}
return key.charAt(0)=="!"?_1c9:_1c9.toString().replace(/"/g,"&quot;");
},this);
},buildRendering:function(){
var _1cb=dijit._Templated.getCachedTemplate(this.templatePath,this.templateString,this._skipNodeCache);
var node;
if(dojo.isString(_1cb)){
node=dijit._Templated._createNodesFromText(this._stringRepl(_1cb))[0];
}else{
node=_1cb.cloneNode(true);
}
this.domNode=node;
this._attachTemplateNodes(node);
var _1cd=this.srcNodeRef;
if(_1cd&&_1cd.parentNode){
_1cd.parentNode.replaceChild(node,_1cd);
}
if(this.widgetsInTemplate){
var cw=this._supportingWidgets=dojo.parser.parse(node);
this._attachTemplateNodes(cw,function(n,p){
return n[p];
});
}
this._fillContent(_1cd);
},_fillContent:function(_1d1){
var dest=this.containerNode;
if(_1d1&&dest){
while(_1d1.hasChildNodes()){
dest.appendChild(_1d1.firstChild);
}
}
},_attachTemplateNodes:function(_1d3,_1d4){
_1d4=_1d4||function(n,p){
return n.getAttribute(p);
};
var _1d7=dojo.isArray(_1d3)?_1d3:(_1d3.all||_1d3.getElementsByTagName("*"));
var x=dojo.isArray(_1d3)?0:-1;
var _1d9={};
for(;x<_1d7.length;x++){
var _1da=(x==-1)?_1d3:_1d7[x];
if(this.widgetsInTemplate&&_1d4(_1da,"dojoType")){
continue;
}
var _1db=_1d4(_1da,"dojoAttachPoint");
if(_1db){
var _1dc,_1dd=_1db.split(/\s*,\s*/);
while((_1dc=_1dd.shift())){
if(dojo.isArray(this[_1dc])){
this[_1dc].push(_1da);
}else{
this[_1dc]=_1da;
}
}
}
var _1de=_1d4(_1da,"dojoAttachEvent");
if(_1de){
var _1df,_1e0=_1de.split(/\s*,\s*/);
var trim=dojo.trim;
while((_1df=_1e0.shift())){
if(_1df){
var _1e2=null;
if(_1df.indexOf(":")!=-1){
var _1e3=_1df.split(":");
_1df=trim(_1e3[0]);
_1e2=trim(_1e3[1]);
}else{
_1df=trim(_1df);
}
if(!_1e2){
_1e2=_1df;
}
this.connect(_1da,_1df,_1e2);
}
}
}
var role=_1d4(_1da,"waiRole");
if(role){
dijit.setWaiRole(_1da,role);
}
var _1e5=_1d4(_1da,"waiState");
if(_1e5){
dojo.forEach(_1e5.split(/\s*,\s*/),function(_1e6){
if(_1e6.indexOf("-")!=-1){
var pair=_1e6.split("-");
dijit.setWaiState(_1da,pair[0],pair[1]);
}
});
}
}
}});
dijit._Templated._templateCache={};
dijit._Templated.getCachedTemplate=function(_1e8,_1e9,_1ea){
var _1eb=dijit._Templated._templateCache;
var key=_1e9||_1e8;
var _1ed=_1eb[key];
if(_1ed){
if(!_1ed.ownerDocument||_1ed.ownerDocument==dojo.doc){
return _1ed;
}
dojo._destroyElement(_1ed);
}
if(!_1e9){
_1e9=dijit._Templated._sanitizeTemplateString(dojo._getText(_1e8));
}
_1e9=dojo.string.trim(_1e9);
if(_1ea||_1e9.match(/\$\{([^\}]+)\}/g)){
return (_1eb[key]=_1e9);
}else{
return (_1eb[key]=dijit._Templated._createNodesFromText(_1e9)[0]);
}
};
dijit._Templated._sanitizeTemplateString=function(_1ee){
if(_1ee){
_1ee=_1ee.replace(/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,"");
var _1ef=_1ee.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
if(_1ef){
_1ee=_1ef[1];
}
}else{
_1ee="";
}
return _1ee;
};
if(dojo.isIE){
dojo.addOnWindowUnload(function(){
var _1f0=dijit._Templated._templateCache;
for(var key in _1f0){
var _1f2=_1f0[key];
if(!isNaN(_1f2.nodeType)){
dojo._destroyElement(_1f2);
}
delete _1f0[key];
}
});
}
(function(){
var _1f3={cell:{re:/^<t[dh][\s\r\n>]/i,pre:"<table><tbody><tr>",post:"</tr></tbody></table>"},row:{re:/^<tr[\s\r\n>]/i,pre:"<table><tbody>",post:"</tbody></table>"},section:{re:/^<(thead|tbody|tfoot)[\s\r\n>]/i,pre:"<table>",post:"</table>"}};
var tn;
dijit._Templated._createNodesFromText=function(text){
if(tn&&tn.ownerDocument!=dojo.doc){
dojo._destroyElement(tn);
tn=undefined;
}
if(!tn){
tn=dojo.doc.createElement("div");
tn.style.display="none";
dojo.body().appendChild(tn);
}
var _1f6="none";
var _1f7=text.replace(/^\s+/,"");
for(var type in _1f3){
var map=_1f3[type];
if(map.re.test(_1f7)){
_1f6=type;
text=map.pre+text+map.post;
break;
}
}
tn.innerHTML=text;
if(tn.normalize){
tn.normalize();
}
var tag={cell:"tr",row:"tbody",section:"table"}[_1f6];
var _1fb=(typeof tag!="undefined")?tn.getElementsByTagName(tag)[0]:tn;
var _1fc=[];
while(_1fb.firstChild){
_1fc.push(_1fb.removeChild(_1fb.firstChild));
}
tn.innerHTML="";
return _1fc;
};
})();
dojo.extend(dijit._Widget,{dojoAttachEvent:"",dojoAttachPoint:"",waiRole:"",waiState:""});
}
if(!dojo._hasResource["dijit._Container"]){
dojo._hasResource["dijit._Container"]=true;
dojo.provide("dijit._Container");
dojo.declare("dijit._Contained",null,{getParent:function(){
for(var p=this.domNode.parentNode;p;p=p.parentNode){
var id=p.getAttribute&&p.getAttribute("widgetId");
if(id){
var _1ff=dijit.byId(id);
return _1ff.isContainer?_1ff:null;
}
}
return null;
},_getSibling:function(_200){
var node=this.domNode;
do{
node=node[_200+"Sibling"];
}while(node&&node.nodeType!=1);
if(!node){
return null;
}
var id=node.getAttribute("widgetId");
return dijit.byId(id);
},getPreviousSibling:function(){
return this._getSibling("previous");
},getNextSibling:function(){
return this._getSibling("next");
},getIndexInParent:function(){
var p=this.getParent();
if(!p||!p.getIndexOfChild){
return -1;
}
return p.getIndexOfChild(this);
}});
dojo.declare("dijit._Container",null,{isContainer:true,buildRendering:function(){
this.inherited(arguments);
if(!this.containerNode){
this.containerNode=this.domNode;
}
},addChild:function(_204,_205){
if(_205===undefined){
_205="last";
}
var _206=this.containerNode;
if(_205&&typeof _205=="number"){
var _207=dojo.query("> [widgetId]",_206);
if(_207&&_207.length>=_205){
_206=_207[_205-1];
_205="after";
}
}
dojo.place(_204.domNode,_206,_205);
if(this._started&&!_204._started){
_204.startup();
}
},removeChild:function(_208){
if(typeof _208=="number"&&_208>0){
_208=this.getChildren()[_208];
}
if(!_208||!_208.domNode){
return;
}
var node=_208.domNode;
node.parentNode.removeChild(node);
},_nextElement:function(node){
do{
node=node.nextSibling;
}while(node&&node.nodeType!=1);
return node;
},_firstElement:function(node){
node=node.firstChild;
if(node&&node.nodeType!=1){
node=this._nextElement(node);
}
return node;
},getChildren:function(){
return dojo.query("> [widgetId]",this.containerNode).map(dijit.byNode);
},hasChildren:function(){
return !!this._firstElement(this.containerNode);
},destroyDescendants:function(_20c){
dojo.forEach(this.getChildren(),function(_20d){
_20d.destroyRecursive(_20c);
});
},_getSiblingOfChild:function(_20e,dir){
var node=_20e.domNode;
var _211=(dir>0?"nextSibling":"previousSibling");
do{
node=node[_211];
}while(node&&(node.nodeType!=1||!dijit.byNode(node)));
return node?dijit.byNode(node):null;
},getIndexOfChild:function(_212){
var _213=this.getChildren();
for(var i=0,c;c=_213[i];i++){
if(c==_212){
return i;
}
}
return -1;
}});
dojo.declare("dijit._KeyNavContainer",[dijit._Container],{_keyNavCodes:{},connectKeyNavHandlers:function(_216,_217){
var _218=this._keyNavCodes={};
var prev=dojo.hitch(this,this.focusPrev);
var next=dojo.hitch(this,this.focusNext);
dojo.forEach(_216,function(code){
_218[code]=prev;
});
dojo.forEach(_217,function(code){
_218[code]=next;
});
this.connect(this.domNode,"onkeypress","_onContainerKeypress");
this.connect(this.domNode,"onfocus","_onContainerFocus");
},startupKeyNavChildren:function(){
dojo.forEach(this.getChildren(),dojo.hitch(this,"_startupChild"));
},addChild:function(_21d,_21e){
dijit._KeyNavContainer.superclass.addChild.apply(this,arguments);
this._startupChild(_21d);
},focus:function(){
this.focusFirstChild();
},focusFirstChild:function(){
this.focusChild(this._getFirstFocusableChild());
},focusNext:function(){
if(this.focusedChild&&this.focusedChild.hasNextFocalNode&&this.focusedChild.hasNextFocalNode()){
this.focusedChild.focusNext();
return;
}
var _21f=this._getNextFocusableChild(this.focusedChild,1);
if(_21f.getFocalNodes){
this.focusChild(_21f,_21f.getFocalNodes()[0]);
}else{
this.focusChild(_21f);
}
},focusPrev:function(){
if(this.focusedChild&&this.focusedChild.hasPrevFocalNode&&this.focusedChild.hasPrevFocalNode()){
this.focusedChild.focusPrev();
return;
}
var _220=this._getNextFocusableChild(this.focusedChild,-1);
if(_220.getFocalNodes){
var _221=_220.getFocalNodes();
this.focusChild(_220,_221[_221.length-1]);
}else{
this.focusChild(_220);
}
},focusChild:function(_222,node){
if(_222){
if(this.focusedChild&&_222!==this.focusedChild){
this._onChildBlur(this.focusedChild);
}
this.focusedChild=_222;
if(node&&_222.focusFocalNode){
_222.focusFocalNode(node);
}else{
_222.focus();
}
}
},_startupChild:function(_224){
if(_224.getFocalNodes){
dojo.forEach(_224.getFocalNodes(),function(node){
dojo.attr(node,"tabindex",-1);
this._connectNode(node);
},this);
}else{
var node=_224.focusNode||_224.domNode;
if(_224.isFocusable()){
dojo.attr(node,"tabindex",-1);
}
this._connectNode(node);
}
},_connectNode:function(node){
this.connect(node,"onfocus","_onNodeFocus");
this.connect(node,"onblur","_onNodeBlur");
},_onContainerFocus:function(evt){
if(evt.target===this.domNode){
this.focusFirstChild();
}
},_onContainerKeypress:function(evt){
if(evt.ctrlKey||evt.altKey){
return;
}
var func=this._keyNavCodes[evt.charOrCode];
if(func){
func();
dojo.stopEvent(evt);
}
},_onNodeFocus:function(evt){
dojo.attr(this.domNode,"tabindex",-1);
var _22c=dijit.getEnclosingWidget(evt.target);
if(_22c&&_22c.isFocusable()){
this.focusedChild=_22c;
}
dojo.stopEvent(evt);
},_onNodeBlur:function(evt){
if(this.tabIndex){
dojo.attr(this.domNode,"tabindex",this.tabIndex);
}
dojo.stopEvent(evt);
},_onChildBlur:function(_22e){
},_getFirstFocusableChild:function(){
return this._getNextFocusableChild(null,1);
},_getNextFocusableChild:function(_22f,dir){
if(_22f){
_22f=this._getSiblingOfChild(_22f,dir);
}
var _231=this.getChildren();
for(var i=0;i<_231.length;i++){
if(!_22f){
_22f=_231[(dir>0)?0:(_231.length-1)];
}
if(_22f.isFocusable()){
return _22f;
}
_22f=this._getSiblingOfChild(_22f,dir);
}
return null;
}});
}
if(!dojo._hasResource["dijit.layout._LayoutWidget"]){
dojo._hasResource["dijit.layout._LayoutWidget"]=true;
dojo.provide("dijit.layout._LayoutWidget");
dojo.declare("dijit.layout._LayoutWidget",[dijit._Widget,dijit._Container,dijit._Contained],{baseClass:"dijitLayoutContainer",isLayoutContainer:true,postCreate:function(){
dojo.addClass(this.domNode,"dijitContainer");
dojo.addClass(this.domNode,this.baseClass);
},startup:function(){
if(this._started){
return;
}
dojo.forEach(this.getChildren(),function(_233){
_233.startup();
});
if(!this.getParent||!this.getParent()){
this.resize();
this.connect(dojo.global,"onresize","resize");
}
this.inherited(arguments);
},resize:function(_234,_235){
var node=this.domNode;
if(_234){
dojo.marginBox(node,_234);
if(_234.t){
node.style.top=_234.t+"px";
}
if(_234.l){
node.style.left=_234.l+"px";
}
}
var mb=_235||{};
dojo.mixin(mb,_234||{});
if(!("h" in mb)||!("w" in mb)){
mb=dojo.mixin(dojo.marginBox(node),mb);
}
var cs=dojo.getComputedStyle(node);
var me=dojo._getMarginExtents(node,cs);
var be=dojo._getBorderExtents(node,cs);
var bb=this._borderBox={w:mb.w-(me.w+be.w),h:mb.h-(me.h+be.h)};
var pe=dojo._getPadExtents(node,cs);
this._contentBox={l:dojo._toPixelValue(node,cs.paddingLeft),t:dojo._toPixelValue(node,cs.paddingTop),w:bb.w-pe.w,h:bb.h-pe.h};
this.layout();
},layout:function(){
},_setupChild:function(_23d){
if(_23d.baseClass){
dojo.addClass(_23d.domNode,this.baseClass+"-"+_23d.baseClass);
}
},addChild:function(_23e,_23f){
this.inherited(arguments);
if(this._started){
this._setupChild(_23e);
}
},removeChild:function(_240){
if(_240.baseClass){
dojo.removeClass(_240.domNode,this.baseClass+"-"+_240.baseClass);
}
this.inherited(arguments);
}});
dijit.layout.marginBox2contentBox=function(node,mb){
var cs=dojo.getComputedStyle(node);
var me=dojo._getMarginExtents(node,cs);
var pb=dojo._getPadBorderExtents(node,cs);
return {l:dojo._toPixelValue(node,cs.paddingLeft),t:dojo._toPixelValue(node,cs.paddingTop),w:mb.w-(me.w+pb.w),h:mb.h-(me.h+pb.h)};
};
(function(){
var _246=function(word){
return word.substring(0,1).toUpperCase()+word.substring(1);
};
var size=function(_249,dim){
_249.resize?_249.resize(dim):dojo.marginBox(_249.domNode,dim);
dojo.mixin(_249,dojo.marginBox(_249.domNode));
dojo.mixin(_249,dim);
};
dijit.layout.layoutChildren=function(_24b,dim,_24d){
dim=dojo.mixin({},dim);
dojo.addClass(_24b,"dijitLayoutContainer");
_24d=dojo.filter(_24d,function(item){
return item.layoutAlign!="client";
}).concat(dojo.filter(_24d,function(item){
return item.layoutAlign=="client";
}));
dojo.forEach(_24d,function(_250){
var elm=_250.domNode,pos=_250.layoutAlign;
var _253=elm.style;
_253.left=dim.l+"px";
_253.top=dim.t+"px";
_253.bottom=_253.right="auto";
dojo.addClass(elm,"dijitAlign"+_246(pos));
if(pos=="top"||pos=="bottom"){
size(_250,{w:dim.w});
dim.h-=_250.h;
if(pos=="top"){
dim.t+=_250.h;
}else{
_253.top=dim.t+dim.h+"px";
}
}else{
if(pos=="left"||pos=="right"){
size(_250,{h:dim.h});
dim.w-=_250.w;
if(pos=="left"){
dim.l+=_250.w;
}else{
_253.left=dim.l+dim.w+"px";
}
}else{
if(pos=="client"){
size(_250,dim);
}
}
}
});
};
})();
}
if(!dojo._hasResource["dijit.form._FormWidget"]){
dojo._hasResource["dijit.form._FormWidget"]=true;
dojo.provide("dijit.form._FormWidget");
dojo.declare("dijit.form._FormWidget",[dijit._Widget,dijit._Templated],{baseClass:"",name:"",alt:"",value:"",type:"text",tabIndex:"0",disabled:false,readOnly:false,intermediateChanges:false,attributeMap:dojo.mixin(dojo.clone(dijit._Widget.prototype.attributeMap),{value:"focusNode",disabled:"focusNode",readOnly:"focusNode",id:"focusNode",tabIndex:"focusNode",alt:"focusNode"}),_setDisabledAttr:function(_254){
this.disabled=_254;
dojo.attr(this.focusNode,"disabled",_254);
dijit.setWaiState(this.focusNode,"disabled",_254);
if(_254){
this._hovering=false;
this._active=false;
this.focusNode.removeAttribute("tabIndex");
}else{
this.focusNode.setAttribute("tabIndex",this.tabIndex);
}
this._setStateClass();
},setDisabled:function(_255){
dojo.deprecated("setDisabled("+_255+") is deprecated. Use attr('disabled',"+_255+") instead.","","2.0");
this.attr("disabled",_255);
},_onFocus:function(e){
dijit.scrollIntoView(this.domNode);
this.inherited(arguments);
},_onMouse:function(_257){
var _258=_257.currentTarget;
if(_258&&_258.getAttribute){
this.stateModifier=_258.getAttribute("stateModifier")||"";
}
if(!this.disabled){
switch(_257.type){
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
var _259=this.connect(dojo.body(),"onmouseup",function(){
if(this._mouseDown&&this.isFocusable()){
this.focus();
}
this._active=false;
this._mouseDown=false;
this._setStateClass();
this.disconnect(_259);
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
var _25a=this.baseClass.split(" ");
function multiply(_25b){
_25a=_25a.concat(dojo.map(_25a,function(c){
return c+_25b;
}),"dijit"+_25b);
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
(this.stateNode||this.domNode).className=this.staticClass+" "+_25a.join(" ");
},compare:function(val1,val2){
if((typeof val1=="number")&&(typeof val2=="number")){
return (isNaN(val1)&&isNaN(val2))?0:(val1-val2);
}else{
if(val1>val2){
return 1;
}else{
if(val1<val2){
return -1;
}else{
return 0;
}
}
}
},onChange:function(_25f){
},_onChangeActive:false,_handleOnChange:function(_260,_261){
this._lastValue=_260;
if(this._lastValueReported==undefined&&(_261===null||!this._onChangeActive)){
this._resetValue=this._lastValueReported=_260;
}
if((this.intermediateChanges||_261||_261===undefined)&&((typeof _260!=typeof this._lastValueReported)||this.compare(_260,this._lastValueReported)!=0)){
this._lastValueReported=_260;
if(this._onChangeActive){
this.onChange(_260);
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
},setValue:function(_262){
dojo.deprecated("dijit.form._FormWidget:setValue("+_262+") is deprecated.  Use attr('value',"+_262+") instead.","","2.0");
this.attr("value",_262);
},getValue:function(){
dojo.deprecated(this.declaredClass+"::getValue() is deprecated. Use attr('value') instead.","","2.0");
return this.attr("value");
},_layoutHack:function(){
if(dojo.isFF==2){
var node=this.domNode;
var old=node.style.opacity;
node.style.opacity="0.999";
this._layoutHackHandle=setTimeout(dojo.hitch(this,function(){
this._layoutHackHandle=null;
node.style.opacity=old;
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
},_setValueAttr:function(_265,_266){
this.value=_265;
this._handleOnChange(_265,_266);
},_getValueAttr:function(_267){
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
var _26d=this;
setTimeout(function(){
_26d._handleOnChange(_26d.attr("value"),false);
},0);
}
}
return true;
}});
}
if(!dojo._hasResource["dijit.dijit"]){
dojo._hasResource["dijit.dijit"]=true;
dojo.provide("dijit.dijit");
}
