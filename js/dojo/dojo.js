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

(function(){
var _1=null;
if((_1||(typeof djConfig!="undefined"&&djConfig.scopeMap))&&(typeof window!="undefined")){
var _2="",_3="",_4="",_5={},_6={};
_1=_1||djConfig.scopeMap;
for(var i=0;i<_1.length;i++){
var _8=_1[i];
_2+="var "+_8[0]+" = {}; "+_8[1]+" = "+_8[0]+";"+_8[1]+"._scopeName = '"+_8[1]+"';";
_3+=(i==0?"":",")+_8[0];
_4+=(i==0?"":",")+_8[1];
_5[_8[0]]=_8[1];
_6[_8[1]]=_8[0];
}
eval(_2+"dojo._scopeArgs = ["+_4+"];");
dojo._scopePrefixArgs=_3;
dojo._scopePrefix="(function("+_3+"){";
dojo._scopeSuffix="})("+_4+")";
dojo._scopeMap=_5;
dojo._scopeMapRev=_6;
}
(function(){
if(!this["console"]){
this.console={log:function(){
}};
}
var cn=["assert","count","debug","dir","dirxml","error","group","groupEnd","info","profile","profileEnd","time","timeEnd","trace","warn","log"];
var i=0,tn;
while((tn=cn[i++])){
if(!console[tn]){
(function(){
var _c=tn+"";
console[_c]=function(){
var a=Array.apply({},arguments);
a.unshift(_c+":");
console["log"](a.join(" "));
};
})();
}
}
if(typeof dojo=="undefined"){
this.dojo={_scopeName:"dojo",_scopePrefix:"",_scopePrefixArgs:"",_scopeSuffix:"",_scopeMap:{},_scopeMapRev:{}};
}
var d=dojo;
if(typeof dijit=="undefined"){
this.dijit={_scopeName:"dijit"};
}
if(typeof dojox=="undefined"){
this.dojox={_scopeName:"dojox"};
}
if(!d._scopeArgs){
d._scopeArgs=[dojo,dijit,dojox];
}
d.global=this;
d.config={isDebug:false,debugAtAllCosts:false};
if(typeof djConfig!="undefined"){
for(var _f in djConfig){
d.config[_f]=djConfig[_f];
}
}
var _10=["Browser","Rhino","Spidermonkey","Mobile"];
var t;
while((t=_10.shift())){
d["is"+t]=false;
}
dojo.locale=d.config.locale;
var rev="$Rev: 14879 $".match(/\d+/);
dojo.version={major:1,minor:2,patch:0,flag:"-blowery",revision:rev?+rev[0]:999999,toString:function(){
with(d.version){
return major+"."+minor+"."+patch+flag+" ("+revision+")";
}
}};
if(typeof OpenAjax!="undefined"){
OpenAjax.hub.registerLibrary(dojo._scopeName,"http://dojotoolkit.org",d.version.toString());
}
dojo._mixin=function(obj,_14){
var _15={};
for(var x in _14){
if(_15[x]===undefined||_15[x]!=_14[x]){
obj[x]=_14[x];
}
}
if(d["isIE"]&&_14){
var p=_14.toString;
if(typeof p=="function"&&p!=obj.toString&&p!=_15.toString&&p!="\nfunction toString() {\n    [native code]\n}\n"){
obj.toString=_14.toString;
}
}
return obj;
};
dojo.mixin=function(obj,_19){
for(var i=1,l=arguments.length;i<l;i++){
d._mixin(obj,arguments[i]);
}
return obj;
};
dojo._getProp=function(_1c,_1d,_1e){
var obj=_1e||d.global;
for(var i=0,p;obj&&(p=_1c[i]);i++){
if(i==0&&this._scopeMap[p]){
p=this._scopeMap[p];
}
obj=(p in obj?obj[p]:(_1d?obj[p]={}:undefined));
}
return obj;
};
dojo.setObject=function(_22,_23,_24){
var _25=_22.split("."),p=_25.pop(),obj=d._getProp(_25,true,_24);
return obj&&p?(obj[p]=_23):undefined;
};
dojo.getObject=function(_28,_29,_2a){
return d._getProp(_28.split("."),_29,_2a);
};
dojo.exists=function(_2b,obj){
return !!d.getObject(_2b,false,obj);
};
dojo["eval"]=function(_2d){
return d.global.eval?d.global.eval(_2d):eval(_2d);
};
d.deprecated=d.experimental=function(){
};
})();
(function(){
var d=dojo;
d.mixin(d,{_loadedModules:{},_inFlightCount:0,_hasResource:{},_modulePrefixes:{dojo:{name:"dojo",value:"."},doh:{name:"doh",value:"../util/doh"},tests:{name:"tests",value:"tests"}},_moduleHasPrefix:function(_2f){
var mp=this._modulePrefixes;
return !!(mp[_2f]&&mp[_2f].value);
},_getModulePrefix:function(_31){
var mp=this._modulePrefixes;
if(this._moduleHasPrefix(_31)){
return mp[_31].value;
}
return _31;
},_loadedUrls:[],_postLoad:false,_loaders:[],_unloaders:[],_loadNotifying:false});
dojo._loadPath=function(_33,_34,cb){
var uri=((_33.charAt(0)=="/"||_33.match(/^\w+:/))?"":this.baseUrl)+_33;
try{
return !_34?this._loadUri(uri,cb):this._loadUriAndCheck(uri,_34,cb);
}
catch(e){
console.error(e);
return false;
}
};
dojo._loadUri=function(uri,cb){
if(this._loadedUrls[uri]){
return true;
}
var _39=this._getText(uri,true);
if(!_39){
return false;
}
this._loadedUrls[uri]=true;
this._loadedUrls.push(uri);
if(cb){
_39="("+_39+")";
}else{
_39=this._scopePrefix+_39+this._scopeSuffix;
}
if(d.isMoz){
_39+="\r\n//@ sourceURL="+uri;
}
var _3a=d["eval"](_39);
if(cb){
cb(_3a);
}
return true;
};
dojo._loadUriAndCheck=function(uri,_3c,cb){
var ok=false;
try{
ok=this._loadUri(uri,cb);
}
catch(e){
console.error("failed loading "+uri+" with error: "+e);
}
return !!(ok&&this._loadedModules[_3c]);
};
dojo.loaded=function(){
this._loadNotifying=true;
this._postLoad=true;
var mll=d._loaders;
this._loaders=[];
for(var x=0;x<mll.length;x++){
mll[x]();
}
this._loadNotifying=false;
if(d._postLoad&&d._inFlightCount==0&&mll.length){
d._callLoaded();
}
};
dojo.unloaded=function(){
var mll=this._unloaders;
while(mll.length){
(mll.pop())();
}
};
d._onto=function(arr,obj,fn){
if(!fn){
arr.push(obj);
}else{
if(fn){
var _45=(typeof fn=="string")?obj[fn]:fn;
arr.push(function(){
_45.call(obj);
});
}
}
};
dojo.addOnLoad=function(obj,_47){
d._onto(d._loaders,obj,_47);
if(d._postLoad&&d._inFlightCount==0&&!d._loadNotifying){
d._callLoaded();
}
};
var dca=d.config.addOnLoad;
if(dca){
d.addOnLoad[(dca instanceof Array?"apply":"call")](d,dca);
}
dojo.addOnUnload=function(obj,_4a){
d._onto(d._unloaders,obj,_4a);
};
dojo._modulesLoaded=function(){
if(d._postLoad){
return;
}
if(d._inFlightCount>0){
console.warn("files still in flight!");
return;
}
d._callLoaded();
};
dojo._callLoaded=function(){
if(typeof setTimeout=="object"||(dojo.config.useXDomain&&d.isOpera)){
if(dojo.isAIR){
setTimeout(function(){
dojo.loaded();
},0);
}else{
setTimeout(dojo._scopeName+".loaded();",0);
}
}else{
d.loaded();
}
};
dojo._getModuleSymbols=function(_4b){
var _4c=_4b.split(".");
for(var i=_4c.length;i>0;i--){
var _4e=_4c.slice(0,i).join(".");
if((i==1)&&!this._moduleHasPrefix(_4e)){
_4c[0]="../"+_4c[0];
}else{
var _4f=this._getModulePrefix(_4e);
if(_4f!=_4e){
_4c.splice(0,i,_4f);
break;
}
}
}
return _4c;
};
dojo._global_omit_module_check=false;
dojo.loadInit=function(_50){
_50();
};
dojo._loadModule=dojo.require=function(_51,_52){
_52=this._global_omit_module_check||_52;
var _53=this._loadedModules[_51];
if(_53){
return _53;
}
var _54=this._getModuleSymbols(_51).join("/")+".js";
var _55=(!_52)?_51:null;
var ok=this._loadPath(_54,_55);
if(!ok&&!_52){
throw new Error("Could not load '"+_51+"'; last tried '"+_54+"'");
}
if(!_52&&!this._isXDomain){
_53=this._loadedModules[_51];
if(!_53){
throw new Error("symbol '"+_51+"' is not defined after loading '"+_54+"'");
}
}
return _53;
};
dojo.provide=function(_57){
_57=_57+"";
return (d._loadedModules[_57]=d.getObject(_57,true));
};
dojo.platformRequire=function(_58){
var _59=_58.common||[];
var _5a=_59.concat(_58[d._name]||_58["default"]||[]);
for(var x=0;x<_5a.length;x++){
var _5c=_5a[x];
if(_5c.constructor==Array){
d._loadModule.apply(d,_5c);
}else{
d._loadModule(_5c);
}
}
};
dojo.requireIf=function(_5d,_5e){
if(_5d===true){
var _5f=[];
for(var i=1;i<arguments.length;i++){
_5f.push(arguments[i]);
}
d.require.apply(d,_5f);
}
};
dojo.requireAfterIf=d.requireIf;
dojo.registerModulePath=function(_61,_62){
d._modulePrefixes[_61]={name:_61,value:_62};
};
dojo.requireLocalization=function(_63,_64,_65,_66){
d.require("dojo.i18n");
d.i18n._requireLocalization.apply(d.hostenv,arguments);
};
var ore=new RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$");
var ire=new RegExp("^((([^\\[:]+):)?([^@]+)@)?(\\[([^\\]]+)\\]|([^\\[:]*))(:([0-9]+))?$");
dojo._Url=function(){
var n=null;
var _a=arguments;
var uri=[_a[0]];
for(var i=1;i<_a.length;i++){
if(!_a[i]){
continue;
}
var _6d=new d._Url(_a[i]+"");
var _6e=new d._Url(uri[0]+"");
if(_6d.path==""&&!_6d.scheme&&!_6d.authority&&!_6d.query){
if(_6d.fragment!=n){
_6e.fragment=_6d.fragment;
}
_6d=_6e;
}else{
if(!_6d.scheme){
_6d.scheme=_6e.scheme;
if(!_6d.authority){
_6d.authority=_6e.authority;
if(_6d.path.charAt(0)!="/"){
var _6f=_6e.path.substring(0,_6e.path.lastIndexOf("/")+1)+_6d.path;
var _70=_6f.split("/");
for(var j=0;j<_70.length;j++){
if(_70[j]=="."){
if(j==_70.length-1){
_70[j]="";
}else{
_70.splice(j,1);
j--;
}
}else{
if(j>0&&!(j==1&&_70[0]=="")&&_70[j]==".."&&_70[j-1]!=".."){
if(j==(_70.length-1)){
_70.splice(j,1);
_70[j-1]="";
}else{
_70.splice(j-1,2);
j-=2;
}
}
}
}
_6d.path=_70.join("/");
}
}
}
}
uri=[];
if(_6d.scheme){
uri.push(_6d.scheme,":");
}
if(_6d.authority){
uri.push("//",_6d.authority);
}
uri.push(_6d.path);
if(_6d.query){
uri.push("?",_6d.query);
}
if(_6d.fragment){
uri.push("#",_6d.fragment);
}
}
this.uri=uri.join("");
var r=this.uri.match(ore);
this.scheme=r[2]||(r[1]?"":n);
this.authority=r[4]||(r[3]?"":n);
this.path=r[5];
this.query=r[7]||(r[6]?"":n);
this.fragment=r[9]||(r[8]?"":n);
if(this.authority!=n){
r=this.authority.match(ire);
this.user=r[3]||n;
this.password=r[4]||n;
this.host=r[6]||r[7];
this.port=r[9]||n;
}
};
dojo._Url.prototype.toString=function(){
return this.uri;
};
dojo.moduleUrl=function(_73,url){
var loc=d._getModuleSymbols(_73).join("/");
if(!loc){
return null;
}
if(loc.lastIndexOf("/")!=loc.length-1){
loc+="/";
}
var _76=loc.indexOf(":");
if(loc.charAt(0)!="/"&&(_76==-1||_76>loc.indexOf("/"))){
loc=d.baseUrl+loc;
}
return new d._Url(loc,url);
};
})();
if(typeof window!="undefined"){
dojo.isBrowser=true;
dojo._name="browser";
(function(){
var d=dojo;
if(document&&document.getElementsByTagName){
var _78=document.getElementsByTagName("script");
var _79=/dojo(\.xd)?\.js(\W|$)/i;
for(var i=0;i<_78.length;i++){
var src=_78[i].getAttribute("src");
if(!src){
continue;
}
var m=src.match(_79);
if(m){
if(!d.config.baseUrl){
d.config.baseUrl=src.substring(0,m.index);
}
var cfg=_78[i].getAttribute("djConfig");
if(cfg){
var _7e=eval("({ "+cfg+" })");
for(var x in _7e){
dojo.config[x]=_7e[x];
}
}
break;
}
}
}
d.baseUrl=d.config.baseUrl;
var n=navigator;
var dua=n.userAgent;
var dav=n.appVersion;
var tv=parseFloat(dav);
if(dua.indexOf("Opera")>=0){
d.isOpera=tv;
}
var _84=Math.max(dav.indexOf("WebKit"),dav.indexOf("Safari"),0);
if(_84){
d.isSafari=parseFloat(dav.split("Version/")[1])||(parseFloat(dav.substr(_84+7))>419.3)?3:2;
}
if(dua.indexOf("AdobeAIR")>=0){
d.isAIR=1;
}
if(dav.indexOf("Konqueror")>=0||d.isSafari){
d.isKhtml=tv;
}
if(dua.indexOf("Gecko")>=0&&!d.isKhtml){
d.isMozilla=d.isMoz=tv;
}
if(d.isMoz){
d.isFF=parseFloat(dua.split("Firefox/")[1])||undefined;
}
if(document.all&&!d.isOpera){
d.isIE=parseFloat(dav.split("MSIE ")[1])||undefined;
}
if(dojo.isIE&&window.location.protocol==="file:"){
dojo.config.ieForceActiveXXhr=true;
}
var cm=document.compatMode;
d.isQuirks=cm=="BackCompat"||cm=="QuirksMode"||d.isIE<6;
d.locale=dojo.config.locale||(d.isIE?n.userLanguage:n.language).toLowerCase();
d._XMLHTTP_PROGIDS=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"];
d._xhrObj=function(){
var _86=null;
var _87=null;
if(!dojo.isIE||!dojo.config.ieForceActiveXXhr){
try{
_86=new XMLHttpRequest();
}
catch(e){
}
}
if(!_86){
for(var i=0;i<3;++i){
var _89=d._XMLHTTP_PROGIDS[i];
try{
_86=new ActiveXObject(_89);
}
catch(e){
_87=e;
}
if(_86){
d._XMLHTTP_PROGIDS=[_89];
break;
}
}
}
if(!_86){
throw new Error("XMLHTTP not available: "+_87);
}
return _86;
};
d._isDocumentOk=function(_8a){
var _8b=_8a.status||0;
return (_8b>=200&&_8b<300)||_8b==304||_8b==1223||(!_8b&&(location.protocol=="file:"||location.protocol=="chrome:"));
};
var _8c=window.location+"";
var _8d=document.getElementsByTagName("base");
var _8e=(_8d&&_8d.length>0);
d._getText=function(uri,_90){
var _91=this._xhrObj();
if(!_8e&&dojo._Url){
uri=(new dojo._Url(_8c,uri)).toString();
}
if(d.config.cacheBust){
uri+="";
uri+=(uri.indexOf("?")==-1?"?":"&")+String(d.config.cacheBust).replace(/\W+/g,"");
}
_91.open("GET",uri,false);
try{
_91.send(null);
if(!d._isDocumentOk(_91)){
var err=Error("Unable to load "+uri+" status:"+_91.status);
err.status=_91.status;
err.responseText=_91.responseText;
throw err;
}
}
catch(e){
if(_90){
return null;
}
throw e;
}
return _91.responseText;
};
d._windowUnloaders=[];
d.windowUnloaded=function(){
var mll=this._windowUnloaders;
while(mll.length){
(mll.pop())();
}
};
d.addOnWindowUnload=function(obj,_95){
d._onto(d._windowUnloaders,obj,_95);
};
})();
dojo._initFired=false;
dojo._loadInit=function(e){
dojo._initFired=true;
var _97=(e&&e.type)?e.type.toLowerCase():"load";
if(arguments.callee.initialized||(_97!="domcontentloaded"&&_97!="load")){
return;
}
arguments.callee.initialized=true;
if("_khtmlTimer" in dojo){
clearInterval(dojo._khtmlTimer);
delete dojo._khtmlTimer;
}
if(dojo._inFlightCount==0){
dojo._modulesLoaded();
}
};
dojo._fakeLoadInit=function(){
dojo._loadInit({type:"load"});
};
if(!dojo.config.afterOnLoad){
if(document.addEventListener){
if(dojo.isOpera||dojo.isFF>=3||(dojo.isMoz&&dojo.config.enableMozDomContentLoaded===true)){
document.addEventListener("DOMContentLoaded",dojo._loadInit,null);
}
window.addEventListener("load",dojo._loadInit,null);
}
if(dojo.isAIR){
window.addEventListener("load",dojo._loadInit,null);
}else{
if(/(WebKit|khtml)/i.test(navigator.userAgent)){
dojo._khtmlTimer=setInterval(function(){
if(/loaded|complete/.test(document.readyState)){
dojo._loadInit();
}
},10);
}
}
}
(function(){
var _w=window;
var _99=function(_9a,fp){
var _9c=_w[_9a]||function(){
};
_w[_9a]=function(){
fp.apply(_w,arguments);
_9c.apply(_w,arguments);
};
};
if(dojo.isIE){
if(!dojo.config.afterOnLoad){
document.write("<scr"+"ipt defer src=\"//:\" "+"onreadystatechange=\"if(this.readyState=='complete'){"+dojo._scopeName+"._loadInit();}\">"+"</scr"+"ipt>");
}
try{
document.namespaces.add("v","urn:schemas-microsoft-com:vml");
document.createStyleSheet().addRule("v\\:*","behavior:url(#default#VML)");
}
catch(e){
}
}
_99("onbeforeunload",function(){
dojo.unloaded();
});
_99("onunload",function(){
dojo.windowUnloaded();
});
})();
}
(function(){
var mp=dojo.config["modulePaths"];
if(mp){
for(var _9e in mp){
dojo.registerModulePath(_9e,mp[_9e]);
}
}
})();
if(dojo.config.isDebug){
dojo.require("dojo._firebug.firebug");
}
if(dojo.config.debugAtAllCosts){
dojo.config.useXDomain=true;
dojo.require("dojo._base._loader.loader_xd");
dojo.require("dojo._base._loader.loader_debug");
dojo.require("dojo.i18n");
}
if(!dojo._hasResource["dojo._base.lang"]){
dojo._hasResource["dojo._base.lang"]=true;
dojo.provide("dojo._base.lang");
dojo.isString=function(it){
return !!arguments.length&&it!=null&&(typeof it=="string"||it instanceof String);
};
dojo.isArray=function(it){
return it&&(it instanceof Array||typeof it=="array");
};
dojo.isFunction=(function(){
var _a1=function(it){
return it&&(typeof it=="function"||it instanceof Function);
};
return dojo.isSafari?function(it){
if(typeof it=="function"&&it=="[object NodeList]"){
return false;
}
return _a1(it);
}:_a1;
})();
dojo.isObject=function(it){
return it!==undefined&&(it===null||typeof it=="object"||dojo.isArray(it)||dojo.isFunction(it));
};
dojo.isArrayLike=function(it){
var d=dojo;
return it&&it!==undefined&&!d.isString(it)&&!d.isFunction(it)&&!(it.tagName&&it.tagName.toLowerCase()=="form")&&(d.isArray(it)||isFinite(it.length));
};
dojo.isAlien=function(it){
return it&&!dojo.isFunction(it)&&/\{\s*\[native code\]\s*\}/.test(String(it));
};
dojo.extend=function(_a8,_a9){
for(var i=1,l=arguments.length;i<l;i++){
dojo._mixin(_a8.prototype,arguments[i]);
}
return _a8;
};
dojo._hitchArgs=function(_ac,_ad){
var pre=dojo._toArray(arguments,2);
var _af=dojo.isString(_ad);
return function(){
var _b0=dojo._toArray(arguments);
var f=_af?(_ac||dojo.global)[_ad]:_ad;
return f&&f.apply(_ac||this,pre.concat(_b0));
};
};
dojo.hitch=function(_b2,_b3){
if(arguments.length>2){
return dojo._hitchArgs.apply(dojo,arguments);
}
if(!_b3){
_b3=_b2;
_b2=null;
}
if(dojo.isString(_b3)){
_b2=_b2||dojo.global;
if(!_b2[_b3]){
throw (["dojo.hitch: scope[\"",_b3,"\"] is null (scope=\"",_b2,"\")"].join(""));
}
return function(){
return _b2[_b3].apply(_b2,arguments||[]);
};
}
return !_b2?_b3:function(){
return _b3.apply(_b2,arguments||[]);
};
};
dojo.delegate=dojo._delegate=(function(){
function TMP(){
};
return function(obj,_b5){
TMP.prototype=obj;
var tmp=new TMP();
if(_b5){
dojo._mixin(tmp,_b5);
}
return tmp;
};
})();
(function(){
var _b7=function(obj,_b9,_ba){
return (_ba||[]).concat(Array.prototype.slice.call(obj,_b9||0));
};
var _bb=function(obj,_bd,_be){
var arr=_be||[];
for(var x=_bd||0;x<obj.length;x++){
arr.push(obj[x]);
}
return arr;
};
dojo._toArray=(!dojo.isIE)?_b7:function(obj){
return ((obj.item)?_bb:_b7).apply(this,arguments);
};
})();
dojo.partial=function(_c2){
var arr=[null];
return dojo.hitch.apply(dojo,arr.concat(dojo._toArray(arguments)));
};
dojo.clone=function(o){
if(!o){
return o;
}
if(dojo.isArray(o)){
var r=[];
for(var i=0;i<o.length;++i){
r.push(dojo.clone(o[i]));
}
return r;
}
if(!dojo.isObject(o)){
return o;
}
if(o.nodeType&&o.cloneNode){
return o.cloneNode(true);
}
if(o instanceof Date){
return new Date(o.getTime());
}
var r=new o.constructor();
for(var i in o){
if(!(i in r)||r[i]!=o[i]){
r[i]=dojo.clone(o[i]);
}
}
return r;
};
dojo.trim=function(str){
return str.replace(/^\s\s*/,"").replace(/\s\s*$/,"");
};
}
if(!dojo._hasResource["dojo._base.declare"]){
dojo._hasResource["dojo._base.declare"]=true;
dojo.provide("dojo._base.declare");
dojo.declare=function(_c8,_c9,_ca){
var dd=arguments.callee,_cc;
if(dojo.isArray(_c9)){
_cc=_c9;
_c9=_cc.shift();
}
if(_cc){
dojo.forEach(_cc,function(m){
if(!m){
throw (_c8+": mixin #"+i+" is null");
}
_c9=dd._delegate(_c9,m);
});
}
var _ce=dd._delegate(_c9);
_ca=_ca||{};
_ce.extend(_ca);
dojo.extend(_ce,{declaredClass:_c8,_constructor:_ca.constructor});
_ce.prototype.constructor=_ce;
return dojo.setObject(_c8,_ce);
};
dojo.mixin(dojo.declare,{_delegate:function(_cf,_d0){
var bp=(_cf||0).prototype,mp=(_d0||0).prototype,dd=dojo.declare;
var _d4=dd._makeCtor();
dojo.mixin(_d4,{superclass:bp,mixin:mp,extend:dd._extend});
if(_cf){
_d4.prototype=dojo._delegate(bp);
}
dojo.extend(_d4,dd._core,mp||0,{_constructor:null,preamble:null});
_d4.prototype.constructor=_d4;
_d4.prototype.declaredClass=(bp||0).declaredClass+"_"+(mp||0).declaredClass;
return _d4;
},_extend:function(_d5){
var i,fn;
for(i in _d5){
if(dojo.isFunction(fn=_d5[i])&&!0[i]){
fn.nom=i;
fn.ctor=this;
}
}
dojo.extend(this,_d5);
},_makeCtor:function(){
return function(){
this._construct(arguments);
};
},_core:{_construct:function(_d8){
var c=_d8.callee,s=c.superclass,ct=s&&s.constructor,m=c.mixin,mct=m&&m.constructor,a=_d8,ii,fn;
if(a[0]){
if(((fn=a[0].preamble))){
a=fn.apply(this,a)||a;
}
}
if((fn=c.prototype.preamble)){
a=fn.apply(this,a)||a;
}
if(ct&&ct.apply){
ct.apply(this,a);
}
if(mct&&mct.apply){
mct.apply(this,a);
}
if((ii=c.prototype._constructor)){
ii.apply(this,_d8);
}
if(this.constructor.prototype==c.prototype&&(ct=this.postscript)){
ct.apply(this,_d8);
}
},_findMixin:function(_e1){
var c=this.constructor,p,m;
while(c){
p=c.superclass;
m=c.mixin;
if(m==_e1||(m instanceof _e1.constructor)){
return p;
}
if(m&&m._findMixin&&(m=m._findMixin(_e1))){
return m;
}
c=p&&p.constructor;
}
},_findMethod:function(_e5,_e6,_e7,has){
var p=_e7,c,m,f;
do{
c=p.constructor;
m=c.mixin;
if(m&&(m=this._findMethod(_e5,_e6,m,has))){
return m;
}
if((f=p[_e5])&&(has==(f==_e6))){
return p;
}
p=c.superclass;
}while(p);
return !has&&(p=this._findMixin(_e7))&&this._findMethod(_e5,_e6,p,has);
},inherited:function(_ed,_ee,_ef){
var a=arguments;
if(!dojo.isString(a[0])){
_ef=_ee;
_ee=_ed;
_ed=_ee.callee.nom;
}
a=_ef||_ee;
var c=_ee.callee,p=this.constructor.prototype,fn,mp;
if(this[_ed]!=c||p[_ed]==c){
mp=(c.ctor||0).superclass||this._findMethod(_ed,c,p,true);
if(!mp){
throw (this.declaredClass+": inherited method \""+_ed+"\" mismatch");
}
p=this._findMethod(_ed,c,mp,false);
}
fn=p&&p[_ed];
if(!fn){
throw (mp.declaredClass+": inherited method \""+_ed+"\" not found");
}
return fn.apply(this,a);
}}});
}
if(!dojo._hasResource["dojo._base.connect"]){
dojo._hasResource["dojo._base.connect"]=true;
dojo.provide("dojo._base.connect");
dojo._listener={getDispatcher:function(){
return function(){
var ap=Array.prototype,c=arguments.callee,ls=c._listeners,t=c.target;
var r=t&&t.apply(this,arguments);
var lls=[].concat(ls);
for(var i in lls){
if(!(i in ap)){
lls[i].apply(this,arguments);
}
}
return r;
};
},add:function(_fc,_fd,_fe){
_fc=_fc||dojo.global;
var f=_fc[_fd];
if(!f||!f._listeners){
var d=dojo._listener.getDispatcher();
d.target=f;
d._listeners=[];
f=_fc[_fd]=d;
}
return f._listeners.push(_fe);
},remove:function(_101,_102,_103){
var f=(_101||dojo.global)[_102];
if(f&&f._listeners&&_103--){
delete f._listeners[_103];
}
}};
dojo.connect=function(obj,_106,_107,_108,_109){
var a=arguments,args=[],i=0;
args.push(dojo.isString(a[0])?null:a[i++],a[i++]);
var a1=a[i+1];
args.push(dojo.isString(a1)||dojo.isFunction(a1)?a[i++]:null,a[i++]);
for(var l=a.length;i<l;i++){
args.push(a[i]);
}
return dojo._connect.apply(this,args);
};
dojo._connect=function(obj,_10f,_110,_111){
var l=dojo._listener,h=l.add(obj,_10f,dojo.hitch(_110,_111));
return [obj,_10f,h,l];
};
dojo.disconnect=function(_114){
if(_114&&_114[0]!==undefined){
dojo._disconnect.apply(this,_114);
delete _114[0];
}
};
dojo._disconnect=function(obj,_116,_117,_118){
_118.remove(obj,_116,_117);
};
dojo._topics={};
dojo.subscribe=function(_119,_11a,_11b){
return [_119,dojo._listener.add(dojo._topics,_119,dojo.hitch(_11a,_11b))];
};
dojo.unsubscribe=function(_11c){
if(_11c){
dojo._listener.remove(dojo._topics,_11c[0],_11c[1]);
}
};
dojo.publish=function(_11d,args){
var f=dojo._topics[_11d];
if(f){
f.apply(this,args||[]);
}
};
dojo.connectPublisher=function(_120,obj,_122){
var pf=function(){
dojo.publish(_120,arguments);
};
return (_122)?dojo.connect(obj,_122,pf):dojo.connect(obj,pf);
};
}
if(!dojo._hasResource["dojo._base.Deferred"]){
dojo._hasResource["dojo._base.Deferred"]=true;
dojo.provide("dojo._base.Deferred");
dojo.Deferred=function(_124){
this.chain=[];
this.id=this._nextId();
this.fired=-1;
this.paused=0;
this.results=[null,null];
this.canceller=_124;
this.silentlyCancelled=false;
};
dojo.extend(dojo.Deferred,{_nextId:(function(){
var n=1;
return function(){
return n++;
};
})(),cancel:function(){
var err;
if(this.fired==-1){
if(this.canceller){
err=this.canceller(this);
}else{
this.silentlyCancelled=true;
}
if(this.fired==-1){
if(!(err instanceof Error)){
var res=err;
err=new Error("Deferred Cancelled");
err.dojoType="cancel";
err.cancelResult=res;
}
this.errback(err);
}
}else{
if((this.fired==0)&&(this.results[0] instanceof dojo.Deferred)){
this.results[0].cancel();
}
}
},_resback:function(res){
this.fired=((res instanceof Error)?1:0);
this.results[this.fired]=res;
this._fire();
},_check:function(){
if(this.fired!=-1){
if(!this.silentlyCancelled){
throw new Error("already called!");
}
this.silentlyCancelled=false;
return;
}
},callback:function(res){
this._check();
this._resback(res);
},errback:function(res){
this._check();
if(!(res instanceof Error)){
res=new Error(res);
}
this._resback(res);
},addBoth:function(cb,cbfn){
var _12d=dojo.hitch.apply(dojo,arguments);
return this.addCallbacks(_12d,_12d);
},addCallback:function(cb,cbfn){
return this.addCallbacks(dojo.hitch.apply(dojo,arguments));
},addErrback:function(cb,cbfn){
return this.addCallbacks(null,dojo.hitch.apply(dojo,arguments));
},addCallbacks:function(cb,eb){
this.chain.push([cb,eb]);
if(this.fired>=0){
this._fire();
}
return this;
},_fire:function(){
var _134=this.chain;
var _135=this.fired;
var res=this.results[_135];
var self=this;
var cb=null;
while((_134.length>0)&&(this.paused==0)){
var f=_134.shift()[_135];
if(!f){
continue;
}
var func=function(){
var ret=f(res);
if(typeof ret!="undefined"){
res=ret;
}
_135=((res instanceof Error)?1:0);
if(res instanceof dojo.Deferred){
cb=function(res){
self._resback(res);
self.paused--;
if((self.paused==0)&&(self.fired>=0)){
self._fire();
}
};
this.paused++;
}
};
if(dojo.config.isDebug){
func.call(this);
}else{
try{
func.call(this);
}
catch(err){
_135=1;
res=err;
}
}
}
this.fired=_135;
this.results[_135]=res;
if((cb)&&(this.paused)){
res.addBoth(cb);
}
}});
}
if(!dojo._hasResource["dojo._base.json"]){
dojo._hasResource["dojo._base.json"]=true;
dojo.provide("dojo._base.json");
dojo.fromJson=function(json){
return eval("("+json+")");
};
dojo._escapeString=function(str){
return ("\""+str.replace(/(["\\])/g,"\\$1")+"\"").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r");
};
dojo.toJsonIndentStr="\t";
dojo.toJson=function(it,_140,_141){
if(it===undefined){
return "undefined";
}
var _142=typeof it;
if(_142=="number"||_142=="boolean"){
return it+"";
}
if(it===null){
return "null";
}
if(dojo.isString(it)){
return dojo._escapeString(it);
}
var _143=arguments.callee;
var _144;
_141=_141||"";
var _145=_140?_141+dojo.toJsonIndentStr:"";
var tf=it.__json__||it.json;
if(dojo.isFunction(tf)){
_144=tf.call(it);
if(it!==_144){
return _143(_144,_140,_145);
}
}
if(it.nodeType&&it.cloneNode){
throw new Error("Can't serialize DOM nodes");
}
var sep=_140?" ":"";
var _148=_140?"\n":"";
if(dojo.isArray(it)){
var res=dojo.map(it,function(obj){
var val=_143(obj,_140,_145);
if(typeof val!="string"){
val="undefined";
}
return _148+_145+val;
});
return "["+res.join(","+sep)+_148+_141+"]";
}
if(_142=="function"){
return null;
}
var _14c=[],key;
for(key in it){
var _14e,val;
if(typeof key=="number"){
_14e="\""+key+"\"";
}else{
if(typeof key=="string"){
_14e=dojo._escapeString(key);
}else{
continue;
}
}
val=_143(it[key],_140,_145);
if(typeof val!="string"){
continue;
}
_14c.push(_148+_145+_14e+":"+sep+val);
}
return "{"+_14c.join(","+sep)+_148+_141+"}";
};
}
if(!dojo._hasResource["dojo._base.array"]){
dojo._hasResource["dojo._base.array"]=true;
dojo.provide("dojo._base.array");
(function(){
var _150=function(arr,obj,cb){
return [dojo.isString(arr)?arr.split(""):arr,obj||dojo.global,dojo.isString(cb)?new Function("item","index","array",cb):cb];
};
dojo.mixin(dojo,{indexOf:function(_154,_155,_156,_157){
var step=1,end=_154.length||0,i=0;
if(_157){
i=end-1;
step=end=-1;
}
if(_156!=undefined){
i=_156;
}
if((_157&&i>end)||i<end){
for(;i!=end;i+=step){
if(_154[i]==_155){
return i;
}
}
}
return -1;
},lastIndexOf:function(_15a,_15b,_15c){
return dojo.indexOf(_15a,_15b,_15c,true);
},forEach:function(arr,_15e,_15f){
if(!arr||!arr.length){
return;
}
var _p=_150(arr,_15f,_15e);
arr=_p[0];
for(var i=0,l=arr.length;i<l;++i){
_p[2].call(_p[1],arr[i],i,arr);
}
},_everyOrSome:function(_163,arr,_165,_166){
var _p=_150(arr,_166,_165);
arr=_p[0];
for(var i=0,l=arr.length;i<l;++i){
var _16a=!!_p[2].call(_p[1],arr[i],i,arr);
if(_163^_16a){
return _16a;
}
}
return _163;
},every:function(arr,_16c,_16d){
return this._everyOrSome(true,arr,_16c,_16d);
},some:function(arr,_16f,_170){
return this._everyOrSome(false,arr,_16f,_170);
},map:function(arr,_172,_173){
var _p=_150(arr,_173,_172);
arr=_p[0];
var _175=(arguments[3]?(new arguments[3]()):[]);
for(var i=0,l=arr.length;i<l;++i){
_175.push(_p[2].call(_p[1],arr[i],i,arr));
}
return _175;
},filter:function(arr,_179,_17a){
var _p=_150(arr,_17a,_179);
arr=_p[0];
var _17c=[];
for(var i=0,l=arr.length;i<l;++i){
if(_p[2].call(_p[1],arr[i],i,arr)){
_17c.push(arr[i]);
}
}
return _17c;
}});
})();
}
if(!dojo._hasResource["dojo._base.Color"]){
dojo._hasResource["dojo._base.Color"]=true;
dojo.provide("dojo._base.Color");
dojo.Color=function(_17f){
if(_17f){
this.setColor(_17f);
}
};
dojo.Color.named={black:[0,0,0],silver:[192,192,192],gray:[128,128,128],white:[255,255,255],maroon:[128,0,0],red:[255,0,0],purple:[128,0,128],fuchsia:[255,0,255],green:[0,128,0],lime:[0,255,0],olive:[128,128,0],yellow:[255,255,0],navy:[0,0,128],blue:[0,0,255],teal:[0,128,128],aqua:[0,255,255]};
dojo.extend(dojo.Color,{r:255,g:255,b:255,a:1,_set:function(r,g,b,a){
var t=this;
t.r=r;
t.g=g;
t.b=b;
t.a=a;
},setColor:function(_185){
var d=dojo;
if(d.isString(_185)){
d.colorFromString(_185,this);
}else{
if(d.isArray(_185)){
d.colorFromArray(_185,this);
}else{
this._set(_185.r,_185.g,_185.b,_185.a);
if(!(_185 instanceof d.Color)){
this.sanitize();
}
}
}
return this;
},sanitize:function(){
return this;
},toRgb:function(){
var t=this;
return [t.r,t.g,t.b];
},toRgba:function(){
var t=this;
return [t.r,t.g,t.b,t.a];
},toHex:function(){
var arr=dojo.map(["r","g","b"],function(x){
var s=this[x].toString(16);
return s.length<2?"0"+s:s;
},this);
return "#"+arr.join("");
},toCss:function(_18c){
var t=this,rgb=t.r+", "+t.g+", "+t.b;
return (_18c?"rgba("+rgb+", "+t.a:"rgb("+rgb)+")";
},toString:function(){
return this.toCss(true);
}});
dojo.blendColors=function(_18f,end,_191,obj){
var d=dojo,t=obj||new dojo.Color();
d.forEach(["r","g","b","a"],function(x){
t[x]=_18f[x]+(end[x]-_18f[x])*_191;
if(x!="a"){
t[x]=Math.round(t[x]);
}
});
return t.sanitize();
};
dojo.colorFromRgb=function(_196,obj){
var m=_196.toLowerCase().match(/^rgba?\(([\s\.,0-9]+)\)/);
return m&&dojo.colorFromArray(m[1].split(/\s*,\s*/),obj);
};
dojo.colorFromHex=function(_199,obj){
var d=dojo,t=obj||new d.Color(),bits=(_199.length==4)?4:8,mask=(1<<bits)-1;
_199=Number("0x"+_199.substr(1));
if(isNaN(_199)){
return null;
}
d.forEach(["b","g","r"],function(x){
var c=_199&mask;
_199>>=bits;
t[x]=bits==4?17*c:c;
});
t.a=1;
return t;
};
dojo.colorFromArray=function(a,obj){
var t=obj||new dojo.Color();
t._set(Number(a[0]),Number(a[1]),Number(a[2]),Number(a[3]));
if(isNaN(t.a)){
t.a=1;
}
return t.sanitize();
};
dojo.colorFromString=function(str,obj){
var a=dojo.Color.named[str];
return a&&dojo.colorFromArray(a,obj)||dojo.colorFromRgb(str,obj)||dojo.colorFromHex(str,obj);
};
}
if(!dojo._hasResource["dojo._base"]){
dojo._hasResource["dojo._base"]=true;
dojo.provide("dojo._base");
}
if(!dojo._hasResource["dojo._base.window"]){
dojo._hasResource["dojo._base.window"]=true;
dojo.provide("dojo._base.window");
dojo.doc=window["document"]||null;
dojo.body=function(){
return dojo.doc.body||dojo.doc.getElementsByTagName("body")[0];
};
dojo.setContext=function(_1a7,_1a8){
dojo.global=_1a7;
dojo.doc=_1a8;
};
dojo._fireCallback=function(_1a9,_1aa,_1ab){
if(_1aa&&dojo.isString(_1a9)){
_1a9=_1aa[_1a9];
}
return _1a9.apply(_1aa,_1ab||[]);
};
dojo.withGlobal=function(_1ac,_1ad,_1ae,_1af){
var rval;
var _1b1=dojo.global;
var _1b2=dojo.doc;
try{
dojo.setContext(_1ac,_1ac.document);
rval=dojo._fireCallback(_1ad,_1ae,_1af);
}
finally{
dojo.setContext(_1b1,_1b2);
}
return rval;
};
dojo.withDoc=function(_1b3,_1b4,_1b5,_1b6){
var rval;
var _1b8=dojo.doc;
try{
dojo.doc=_1b3;
rval=dojo._fireCallback(_1b4,_1b5,_1b6);
}
finally{
dojo.doc=_1b8;
}
return rval;
};
}
if(!dojo._hasResource["dojo._base.event"]){
dojo._hasResource["dojo._base.event"]=true;
dojo.provide("dojo._base.event");
(function(){
var del=(dojo._event_listener={add:function(node,name,fp){
if(!node){
return;
}
name=del._normalizeEventName(name);
fp=del._fixCallback(name,fp);
var _1bd=name;
if(!dojo.isIE&&(name=="mouseenter"||name=="mouseleave")){
var ofp=fp;
name=(name=="mouseenter")?"mouseover":"mouseout";
fp=function(e){
try{
e.relatedTarget.tagName;
}
catch(e2){
return;
}
if(!dojo.isDescendant(e.relatedTarget,node)){
return ofp.call(this,e);
}
};
}
node.addEventListener(name,fp,false);
return fp;
},remove:function(node,_1c1,_1c2){
if(node){
node.removeEventListener(del._normalizeEventName(_1c1),_1c2,false);
}
},_normalizeEventName:function(name){
return name.slice(0,2)=="on"?name.slice(2):name;
},_fixCallback:function(name,fp){
return name!="keypress"?fp:function(e){
return fp.call(this,del._fixEvent(e,this));
};
},_fixEvent:function(evt,_1c8){
switch(evt.type){
case "keypress":
del._setKeyChar(evt);
break;
}
return evt;
},_setKeyChar:function(evt){
evt.keyChar=evt.charCode?String.fromCharCode(evt.charCode):"";
evt.charOrCode=evt.keyChar||evt.keyCode;
}});
dojo.fixEvent=function(evt,_1cb){
return del._fixEvent(evt,_1cb);
};
dojo.stopEvent=function(evt){
evt.preventDefault();
evt.stopPropagation();
};
var _1cd=dojo._listener;
dojo._connect=function(obj,_1cf,_1d0,_1d1,_1d2){
var _1d3=obj&&(obj.nodeType||obj.attachEvent||obj.addEventListener);
var lid=!_1d3?0:(!_1d2?1:2),l=[dojo._listener,del,_1cd][lid];
var h=l.add(obj,_1cf,dojo.hitch(_1d0,_1d1));
return [obj,_1cf,h,lid];
};
dojo._disconnect=function(obj,_1d8,_1d9,_1da){
([dojo._listener,del,_1cd][_1da]).remove(obj,_1d8,_1d9);
};
dojo.keys={BACKSPACE:8,TAB:9,CLEAR:12,ENTER:13,SHIFT:16,CTRL:17,ALT:18,PAUSE:19,CAPS_LOCK:20,ESCAPE:27,SPACE:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT_ARROW:37,UP_ARROW:38,RIGHT_ARROW:39,DOWN_ARROW:40,INSERT:45,DELETE:46,HELP:47,LEFT_WINDOW:91,RIGHT_WINDOW:92,SELECT:93,NUMPAD_0:96,NUMPAD_1:97,NUMPAD_2:98,NUMPAD_3:99,NUMPAD_4:100,NUMPAD_5:101,NUMPAD_6:102,NUMPAD_7:103,NUMPAD_8:104,NUMPAD_9:105,NUMPAD_MULTIPLY:106,NUMPAD_PLUS:107,NUMPAD_ENTER:108,NUMPAD_MINUS:109,NUMPAD_PERIOD:110,NUMPAD_DIVIDE:111,F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123,F13:124,F14:125,F15:126,NUM_LOCK:144,SCROLL_LOCK:145};
if(dojo.isIE){
var _1db=function(e,code){
try{
return (e.keyCode=code);
}
catch(e){
return 0;
}
};
var iel=dojo._listener;
var _1df=dojo._ieListenersName="_"+dojo._scopeName+"_listeners";
if(!dojo.config._allow_leaks){
_1cd=iel=dojo._ie_listener={handlers:[],add:function(_1e0,_1e1,_1e2){
_1e0=_1e0||dojo.global;
var f=_1e0[_1e1];
if(!f||!f[_1df]){
var d=dojo._getIeDispatcher();
d.target=f&&(ieh.push(f)-1);
d[_1df]=[];
f=_1e0[_1e1]=d;
}
return f[_1df].push(ieh.push(_1e2)-1);
},remove:function(_1e6,_1e7,_1e8){
var f=(_1e6||dojo.global)[_1e7],l=f&&f[_1df];
if(f&&l&&_1e8--){
delete ieh[l[_1e8]];
delete l[_1e8];
}
}};
var ieh=iel.handlers;
}
dojo.mixin(del,{add:function(node,_1ec,fp){
if(!node){
return;
}
_1ec=del._normalizeEventName(_1ec);
if(_1ec=="onkeypress"){
var kd=node.onkeydown;
if(!kd||!kd[_1df]||!kd._stealthKeydownHandle){
var h=del.add(node,"onkeydown",del._stealthKeyDown);
kd=node.onkeydown;
kd._stealthKeydownHandle=h;
kd._stealthKeydownRefs=1;
}else{
kd._stealthKeydownRefs++;
}
}
return iel.add(node,_1ec,del._fixCallback(fp));
},remove:function(node,_1f1,_1f2){
_1f1=del._normalizeEventName(_1f1);
iel.remove(node,_1f1,_1f2);
if(_1f1=="onkeypress"){
var kd=node.onkeydown;
if(--kd._stealthKeydownRefs<=0){
iel.remove(node,"onkeydown",kd._stealthKeydownHandle);
delete kd._stealthKeydownHandle;
}
}
},_normalizeEventName:function(_1f4){
return _1f4.slice(0,2)!="on"?"on"+_1f4:_1f4;
},_nop:function(){
},_fixEvent:function(evt,_1f6){
if(!evt){
var w=_1f6&&(_1f6.ownerDocument||_1f6.document||_1f6).parentWindow||window;
evt=w.event;
}
if(!evt){
return (evt);
}
evt.target=evt.srcElement;
evt.currentTarget=(_1f6||evt.srcElement);
evt.layerX=evt.offsetX;
evt.layerY=evt.offsetY;
var se=evt.srcElement,doc=(se&&se.ownerDocument)||document;
var _1fa=((dojo.isIE<6)||(doc["compatMode"]=="BackCompat"))?doc.body:doc.documentElement;
var _1fb=dojo._getIeDocumentElementOffset();
evt.pageX=evt.clientX+dojo._fixIeBiDiScrollLeft(_1fa.scrollLeft||0)-_1fb.x;
evt.pageY=evt.clientY+(_1fa.scrollTop||0)-_1fb.y;
if(evt.type=="mouseover"){
evt.relatedTarget=evt.fromElement;
}
if(evt.type=="mouseout"){
evt.relatedTarget=evt.toElement;
}
evt.stopPropagation=del._stopPropagation;
evt.preventDefault=del._preventDefault;
return del._fixKeys(evt);
},_fixKeys:function(evt){
switch(evt.type){
case "keypress":
var c=("charCode" in evt?evt.charCode:evt.keyCode);
if(c==10){
c=0;
evt.keyCode=13;
}else{
if(c==13||c==27){
c=0;
}else{
if(c==3){
c=99;
}
}
}
evt.charCode=c;
del._setKeyChar(evt);
break;
}
return evt;
},_punctMap:{106:42,111:47,186:59,187:43,188:44,189:45,190:46,191:47,192:96,219:91,220:92,221:93,222:39},_stealthKeyDown:function(evt){
var kp=evt.currentTarget.onkeypress;
if(!kp||!kp[_1df]){
return;
}
var k=evt.keyCode;
var _201=(k!=13)&&(k!=32)&&(k!=27)&&(k<48||k>90)&&(k<96||k>111)&&(k<186||k>192)&&(k<219||k>222);
if(_201||evt.ctrlKey){
var c=_201?0:k;
if(evt.ctrlKey){
if(k==3||k==13){
return;
}else{
if(c>95&&c<106){
c-=48;
}else{
if((!evt.shiftKey)&&(c>=65&&c<=90)){
c+=32;
}else{
c=del._punctMap[c]||c;
}
}
}
}
var faux=del._synthesizeEvent(evt,{type:"keypress",faux:true,charCode:c});
kp.call(evt.currentTarget,faux);
evt.cancelBubble=faux.cancelBubble;
evt.returnValue=faux.returnValue;
_1db(evt,faux.keyCode);
}
},_stopPropagation:function(){
this.cancelBubble=true;
},_preventDefault:function(){
this.bubbledKeyCode=this.keyCode;
if(this.ctrlKey){
_1db(this,0);
}
this.returnValue=false;
}});
dojo.stopEvent=function(evt){
evt=evt||window.event;
del._stopPropagation.call(evt);
del._preventDefault.call(evt);
};
}
del._synthesizeEvent=function(evt,_206){
var faux=dojo.mixin({},evt,_206);
del._setKeyChar(faux);
faux.preventDefault=function(){
evt.preventDefault();
};
faux.stopPropagation=function(){
evt.stopPropagation();
};
return faux;
};
if(dojo.isOpera){
dojo.mixin(del,{_fixEvent:function(evt,_209){
switch(evt.type){
case "keypress":
var c=evt.which;
if(c==3){
c=99;
}
c=((c<41)&&(!evt.shiftKey)?0:c);
if((evt.ctrlKey)&&(!evt.shiftKey)&&(c>=65)&&(c<=90)){
c+=32;
}
return del._synthesizeEvent(evt,{charCode:c});
}
return evt;
}});
}
if(dojo.isSafari){
dojo.mixin(del,{_fixEvent:function(evt,_20c){
switch(evt.type){
case "keypress":
var c=evt.charCode,s=evt.shiftKey,k=evt.keyCode;
k=k||_210[evt.keyIdentifier]||0;
if(evt.keyIdentifier=="Enter"){
c=0;
}else{
if((evt.ctrlKey)&&(c>0)&&(c<27)){
c+=96;
}else{
if(c==dojo.keys.SHIFT_TAB){
c=dojo.keys.TAB;
s=true;
}else{
c=(c>=32&&c<63232?c:0);
}
}
}
return del._synthesizeEvent(evt,{charCode:c,shiftKey:s,keyCode:k});
}
return evt;
}});
dojo.mixin(dojo.keys,{SHIFT_TAB:25,UP_ARROW:63232,DOWN_ARROW:63233,LEFT_ARROW:63234,RIGHT_ARROW:63235,F1:63236,F2:63237,F3:63238,F4:63239,F5:63240,F6:63241,F7:63242,F8:63243,F9:63244,F10:63245,F11:63246,F12:63247,PAUSE:63250,DELETE:63272,HOME:63273,END:63275,PAGE_UP:63276,PAGE_DOWN:63277,INSERT:63302,PRINT_SCREEN:63248,SCROLL_LOCK:63249,NUM_LOCK:63289});
var dk=dojo.keys,_210={"Up":dk.UP_ARROW,"Down":dk.DOWN_ARROW,"Left":dk.LEFT_ARROW,"Right":dk.RIGHT_ARROW,"PageUp":dk.PAGE_UP,"PageDown":dk.PAGE_DOWN};
}
})();
if(dojo.isIE){
dojo._ieDispatcher=function(args,_213){
var ap=Array.prototype,h=dojo._ie_listener.handlers,c=args.callee,ls=c[dojo._ieListenersName],t=h[c.target];
var r=t&&t.apply(_213,args);
var lls=[].concat(ls);
for(var i in lls){
if(!(i in ap)){
h[lls[i]].apply(_213,args);
}
}
return r;
};
dojo._getIeDispatcher=function(){
return new Function(dojo._scopeName+"._ieDispatcher(arguments, this)");
};
dojo._event_listener._fixCallback=function(fp){
var f=dojo._event_listener._fixEvent;
return function(e){
return fp.call(this,f(e,this));
};
};
}
}
if(!dojo._hasResource["dojo._base.html"]){
dojo._hasResource["dojo._base.html"]=true;
dojo.provide("dojo._base.html");
try{
document.execCommand("BackgroundImageCache",false,true);
}
catch(e){
}
if(dojo.isIE||dojo.isOpera){
dojo.byId=function(id,doc){
if(dojo.isString(id)){
var _d=doc||dojo.doc;
var te=_d.getElementById(id);
if(te&&te.attributes.id.value==id){
return te;
}else{
var eles=_d.all[id];
if(!eles||!eles.length){
return eles;
}
var i=0;
while((te=eles[i++])){
if(te.attributes.id.value==id){
return te;
}
}
}
}else{
return id;
}
};
}else{
dojo.byId=function(id,doc){
return dojo.isString(id)?(doc||dojo.doc).getElementById(id):id;
};
}
(function(){
var d=dojo;
var _228=null;
dojo.addOnWindowUnload(function(){
_228=null;
});
dojo._destroyElement=function(node){
node=d.byId(node);
try{
if(!_228||_228.ownerDocument!=node.ownerDocument){
_228=node.ownerDocument.createElement("div");
}
_228.appendChild(node.parentNode?node.parentNode.removeChild(node):node);
_228.innerHTML="";
}
catch(e){
}
};
dojo.isDescendant=function(node,_22b){
try{
node=d.byId(node);
_22b=d.byId(_22b);
while(node){
if(node===_22b){
return true;
}
node=node.parentNode;
}
}
catch(e){
}
return false;
};
dojo.setSelectable=function(node,_22d){
node=d.byId(node);
if(d.isMozilla){
node.style.MozUserSelect=_22d?"":"none";
}else{
if(d.isKhtml){
node.style.KhtmlUserSelect=_22d?"auto":"none";
}else{
if(d.isIE){
var v=(node.unselectable=_22d?"":"on");
d.query("*",node).forEach("item.unselectable = '"+v+"'");
}
}
}
};
var _22f=function(node,ref){
ref.parentNode.insertBefore(node,ref);
return true;
};
var _232=function(node,ref){
var pn=ref.parentNode;
if(ref==pn.lastChild){
pn.appendChild(node);
}else{
return _22f(node,ref.nextSibling);
}
return true;
};
dojo.place=function(node,_237,_238){
if(!node||!_237||_238===undefined){
return false;
}
node=d.byId(node);
_237=d.byId(_237);
if(typeof _238=="number"){
var cn=_237.childNodes;
if((!_238&&!cn.length)||cn.length==_238){
_237.appendChild(node);
return true;
}
if(!_238){
return _22f(node,_237.firstChild);
}
return _232(node,cn[_238-1]);
}
switch(_238.toLowerCase()){
case "before":
return _22f(node,_237);
case "after":
return _232(node,_237);
case "first":
if(_237.firstChild){
return _22f(node,_237.firstChild);
}
default:
_237.appendChild(node);
return true;
}
};
dojo.boxModel="content-box";
if(d.isIE){
var _dcm=document.compatMode;
d.boxModel=_dcm=="BackCompat"||_dcm=="QuirksMode"||d.isIE<6?"border-box":"content-box";
}
var gcs;
if(d.isSafari){
gcs=function(node){
var s;
if(node instanceof HTMLElement){
var dv=node.ownerDocument.defaultView;
s=dv.getComputedStyle(node,null);
if(!s&&node.style){
node.style.display="";
s=dv.getComputedStyle(node,null);
}
}
return s||{};
};
}else{
if(d.isIE){
gcs=function(node){
return node.nodeType==1?node.currentStyle:{};
};
}else{
gcs=function(node){
return node instanceof HTMLElement?node.ownerDocument.defaultView.getComputedStyle(node,null):{};
};
}
}
dojo.getComputedStyle=gcs;
if(!d.isIE){
dojo._toPixelValue=function(_241,_242){
return parseFloat(_242)||0;
};
}else{
dojo._toPixelValue=function(_243,_244){
if(!_244){
return 0;
}
if(_244=="medium"){
return 4;
}
if(_244.slice&&(_244.slice(-2)=="px")){
return parseFloat(_244);
}
with(_243){
var _245=style.left;
var _246=runtimeStyle.left;
runtimeStyle.left=currentStyle.left;
try{
style.left=_244;
_244=style.pixelLeft;
}
catch(e){
_244=0;
}
style.left=_245;
runtimeStyle.left=_246;
}
return _244;
};
}
var px=d._toPixelValue;
var astr="DXImageTransform.Microsoft.Alpha";
var af=function(n,f){
try{
return n.filters.item(astr);
}
catch(e){
return f?{}:null;
}
};
dojo._getOpacity=d.isIE?function(node){
try{
return af(node).Opacity/100;
}
catch(e){
return 1;
}
}:function(node){
return gcs(node).opacity;
};
dojo._setOpacity=d.isIE?function(node,_24f){
var ov=_24f*100;
node.style.zoom=1;
if(_24f==1){
af(node,1).Enabled=false;
}else{
af(node,1).Enabled=true;
if(!af(node)){
node.style.filter+=" progid:"+astr+"(Opacity="+ov+")";
}else{
af(node,1).Opacity=ov;
}
}
if(node.nodeName.toLowerCase()=="tr"){
d.query("> td",node).forEach(function(i){
d._setOpacity(i,_24f);
});
}
return _24f;
}:function(node,_253){
return node.style.opacity=_253;
};
var _254={left:true,top:true};
var _255=/margin|padding|width|height|max|min|offset/;
var _256=function(node,type,_259){
type=type.toLowerCase();
if(d.isIE){
if(_259=="auto"){
if(type=="height"){
return node.offsetHeight;
}
if(type=="width"){
return node.offsetWidth;
}
}
if(type=="fontweight"){
switch(_259){
case 700:
return "bold";
case 400:
default:
return "normal";
}
}
}
if(!(type in _254)){
_254[type]=_255.test(type);
}
return _254[type]?px(node,_259):_259;
};
var _25a=d.isIE?"styleFloat":"cssFloat";
var _25b={"cssFloat":_25a,"styleFloat":_25a,"float":_25a};
dojo.style=function(node,_25d,_25e){
var n=d.byId(node),args=arguments.length,op=(_25d=="opacity");
_25d=_25b[_25d]||_25d;
if(args==3){
return op?d._setOpacity(n,_25e):n.style[_25d]=_25e;
}
if(args==2&&op){
return d._getOpacity(n);
}
var s=gcs(n);
if(args==2&&!d.isString(_25d)){
for(var x in _25d){
d.style(node,x,_25d[x]);
}
return s;
}
return (args==1)?s:_256(n,_25d,s[_25d]||n.style[_25d]);
};
dojo._getPadExtents=function(n,_265){
var s=_265||gcs(n),l=px(n,s.paddingLeft),t=px(n,s.paddingTop);
return {l:l,t:t,w:l+px(n,s.paddingRight),h:t+px(n,s.paddingBottom)};
};
dojo._getBorderExtents=function(n,_26a){
var ne="none",s=_26a||gcs(n),bl=(s.borderLeftStyle!=ne?px(n,s.borderLeftWidth):0),bt=(s.borderTopStyle!=ne?px(n,s.borderTopWidth):0);
return {l:bl,t:bt,w:bl+(s.borderRightStyle!=ne?px(n,s.borderRightWidth):0),h:bt+(s.borderBottomStyle!=ne?px(n,s.borderBottomWidth):0)};
};
dojo._getPadBorderExtents=function(n,_270){
var s=_270||gcs(n),p=d._getPadExtents(n,s),b=d._getBorderExtents(n,s);
return {l:p.l+b.l,t:p.t+b.t,w:p.w+b.w,h:p.h+b.h};
};
dojo._getMarginExtents=function(n,_275){
var s=_275||gcs(n),l=px(n,s.marginLeft),t=px(n,s.marginTop),r=px(n,s.marginRight),b=px(n,s.marginBottom);
if(d.isSafari&&(s.position!="absolute")){
r=l;
}
return {l:l,t:t,w:l+r,h:t+b};
};
dojo._getMarginBox=function(node,_27c){
var s=_27c||gcs(node),me=d._getMarginExtents(node,s);
var l=node.offsetLeft-me.l,t=node.offsetTop-me.t,p=node.parentNode;
if(d.isMoz){
var sl=parseFloat(s.left),st=parseFloat(s.top);
if(!isNaN(sl)&&!isNaN(st)){
l=sl,t=st;
}else{
if(p&&p.style){
var pcs=gcs(p);
if(pcs.overflow!="visible"){
var be=d._getBorderExtents(p,pcs);
l+=be.l,t+=be.t;
}
}
}
}else{
if(d.isOpera){
if(p){
var be=d._getBorderExtents(p);
l-=be.l;
t-=be.t;
}
}
}
return {l:l,t:t,w:node.offsetWidth+me.w,h:node.offsetHeight+me.h};
};
dojo._getContentBox=function(node,_287){
var s=_287||gcs(node),pe=d._getPadExtents(node,s),be=d._getBorderExtents(node,s),w=node.clientWidth,h;
if(!w){
w=node.offsetWidth,h=node.offsetHeight;
}else{
h=node.clientHeight,be.w=be.h=0;
}
if(d.isOpera){
pe.l+=be.l;
pe.t+=be.t;
}
return {l:pe.l,t:pe.t,w:w-pe.w-be.w,h:h-pe.h-be.h};
};
dojo._getBorderBox=function(node,_28e){
var s=_28e||gcs(node),pe=d._getPadExtents(node,s),cb=d._getContentBox(node,s);
return {l:cb.l-pe.l,t:cb.t-pe.t,w:cb.w+pe.w,h:cb.h+pe.h};
};
dojo._setBox=function(node,l,t,w,h,u){
u=u||"px";
var s=node.style;
if(!isNaN(l)){
s.left=l+u;
}
if(!isNaN(t)){
s.top=t+u;
}
if(w>=0){
s.width=w+u;
}
if(h>=0){
s.height=h+u;
}
};
dojo._isButtonTag=function(node){
return node.tagName=="BUTTON"||node.tagName=="INPUT"&&node.getAttribute("type").toUpperCase()=="BUTTON";
};
dojo._usesBorderBox=function(node){
var n=node.tagName;
return d.boxModel=="border-box"||n=="TABLE"||dojo._isButtonTag(node);
};
dojo._setContentSize=function(node,_29d,_29e,_29f){
if(d._usesBorderBox(node)){
var pb=d._getPadBorderExtents(node,_29f);
if(_29d>=0){
_29d+=pb.w;
}
if(_29e>=0){
_29e+=pb.h;
}
}
d._setBox(node,NaN,NaN,_29d,_29e);
};
dojo._setMarginBox=function(node,_2a2,_2a3,_2a4,_2a5,_2a6){
var s=_2a6||gcs(node);
var bb=d._usesBorderBox(node),pb=bb?_2aa:d._getPadBorderExtents(node,s);
if(dojo.isSafari){
if(dojo._isButtonTag(node)){
var ns=node.style;
if(_2a4>=0&&!ns.width){
ns.width="4px";
}
if(_2a5>=0&&!ns.height){
ns.height="4px";
}
}
}
var mb=d._getMarginExtents(node,s);
if(_2a4>=0){
_2a4=Math.max(_2a4-pb.w-mb.w,0);
}
if(_2a5>=0){
_2a5=Math.max(_2a5-pb.h-mb.h,0);
}
d._setBox(node,_2a2,_2a3,_2a4,_2a5);
};
var _2aa={l:0,t:0,w:0,h:0};
dojo.marginBox=function(node,box){
var n=d.byId(node),s=gcs(n),b=box;
return !b?d._getMarginBox(n,s):d._setMarginBox(n,b.l,b.t,b.w,b.h,s);
};
dojo.contentBox=function(node,box){
var n=d.byId(node),s=gcs(n),b=box;
return !b?d._getContentBox(n,s):d._setContentSize(n,b.w,b.h,s);
};
var _2b7=function(node,prop){
if(!(node=(node||0).parentNode)){
return 0;
}
var val,_2bb=0,_b=d.body();
while(node&&node.style){
if(gcs(node).position=="fixed"){
return 0;
}
val=node[prop];
if(val){
_2bb+=val-0;
if(node==_b){
break;
}
}
node=node.parentNode;
}
return _2bb;
};
dojo._docScroll=function(){
var _b=d.body(),_w=d.global,de=d.doc.documentElement;
return {y:(_w.pageYOffset||de.scrollTop||_b.scrollTop||0),x:(_w.pageXOffset||d._fixIeBiDiScrollLeft(de.scrollLeft)||_b.scrollLeft||0)};
};
dojo._isBodyLtr=function(){
return !("_bodyLtr" in d)?d._bodyLtr=gcs(d.body()).direction=="ltr":d._bodyLtr;
};
dojo._getIeDocumentElementOffset=function(){
var de=d.doc.documentElement;
return (d.isIE>=7)?{x:de.getBoundingClientRect().left,y:de.getBoundingClientRect().top}:{x:d._isBodyLtr()||window.parent==window?de.clientLeft:de.offsetWidth-de.clientWidth-de.clientLeft,y:de.clientTop};
};
dojo._fixIeBiDiScrollLeft=function(_2c1){
var dd=d.doc;
if(d.isIE&&!dojo._isBodyLtr()){
var de=dd.compatMode=="BackCompat"?dd.body:dd.documentElement;
return _2c1+de.clientWidth-de.scrollWidth;
}
return _2c1;
};
dojo._abs=function(node,_2c5){
var _2c6=node.ownerDocument;
var ret={x:0,y:0};
var db=d.body();
if(d.isIE||(d.isFF>=3)){
var _2c9=node.getBoundingClientRect();
var cs;
if(d.isFF){
var dv=node.ownerDocument.defaultView;
cs=dv.getComputedStyle(db.parentNode,null);
}
var _2cc=(d.isIE)?d._getIeDocumentElementOffset():{x:px(db.parentNode,cs.marginLeft),y:px(db.parentNode,cs.marginTop)};
ret.x=_2c9.left-_2cc.x;
ret.y=_2c9.top-_2cc.y;
}else{
if(node["offsetParent"]){
var _2cd;
if(d.isSafari&&(gcs(node).position=="absolute")&&(node.parentNode==db)){
_2cd=db;
}else{
_2cd=db.parentNode;
}
var cs=gcs(node);
var n=node;
if(d.isOpera&&cs.position!="absolute"){
n=n.offsetParent;
}
ret.x-=_2b7(n,"scrollLeft");
ret.y-=_2b7(n,"scrollTop");
var _2cf=node;
do{
var n=_2cf.offsetLeft;
if(!d.isOpera||n>0){
ret.x+=isNaN(n)?0:n;
}
var t=_2cf.offsetTop;
ret.y+=isNaN(t)?0:t;
var cs=gcs(_2cf);
if(_2cf!=node){
if(d.isSafari){
ret.x+=px(_2cf,cs.borderLeftWidth);
ret.y+=px(_2cf,cs.borderTopWidth);
}else{
if(d.isFF){
ret.x+=2*px(_2cf,cs.borderLeftWidth);
ret.y+=2*px(_2cf,cs.borderTopWidth);
}
}
}
if(d.isFF&&cs.position=="static"){
var _2d1=_2cf.parentNode;
while(_2d1!=_2cf.offsetParent){
var pcs=gcs(_2d1);
if(pcs.position=="static"){
ret.x+=px(_2cf,pcs.borderLeftWidth);
ret.y+=px(_2cf,pcs.borderTopWidth);
}
_2d1=_2d1.parentNode;
}
}
_2cf=_2cf.offsetParent;
}while((_2cf!=_2cd)&&_2cf);
}else{
if(node.x&&node.y){
ret.x+=isNaN(node.x)?0:node.x;
ret.y+=isNaN(node.y)?0:node.y;
}
}
}
if(_2c5){
var _2d3=d._docScroll();
ret.y+=_2d3.y;
ret.x+=_2d3.x;
}
return ret;
};
dojo.coords=function(node,_2d5){
var n=d.byId(node),s=gcs(n),mb=d._getMarginBox(n,s);
var abs=d._abs(n,_2d5);
mb.x=abs.x;
mb.y=abs.y;
return mb;
};
var _2da=d.isIE<8;
var _2db=function(name){
switch(name.toLowerCase()){
case "tabindex":
return _2da?"tabIndex":"tabindex";
case "for":
case "htmlfor":
return _2da?"htmlFor":"for";
case "class":
return d.isIE?"className":"class";
default:
return name;
}
};
var _2dd={colspan:"colSpan",enctype:"enctype",frameborder:"frameborder",method:"method",rowspan:"rowSpan",scrolling:"scrolling",shape:"shape",span:"span",type:"type",valuetype:"valueType"};
dojo.hasAttr=function(node,name){
node=d.byId(node);
var _2e0=_2db(name);
_2e0=_2e0=="htmlFor"?"for":_2e0;
var attr=node.getAttributeNode&&node.getAttributeNode(_2e0);
return attr?attr.specified:false;
};
var _2e2={};
var _ctr=0;
var _2e4=dojo._scopeName+"attrid";
dojo.attr=function(node,name,_2e7){
var args=arguments.length;
if(args==2&&!d.isString(name)){
for(var x in name){
d.attr(node,x,name[x]);
}
return;
}
node=d.byId(node);
name=_2db(name);
if(args==3){
if(d.isFunction(_2e7)){
var _2ea=d.attr(node,_2e4);
if(!_2ea){
_2ea=_ctr++;
d.attr(node,_2e4,_2ea);
}
if(!_2e2[_2ea]){
_2e2[_2ea]={};
}
var h=_2e2[_2ea][name];
if(h){
d.disconnect(h);
}else{
try{
delete node[name];
}
catch(e){
}
}
_2e2[_2ea][name]=d.connect(node,name,_2e7);
}else{
if((typeof _2e7=="boolean")||(name=="innerHTML")){
node[name]=_2e7;
}else{
if((name=="style")&&(!d.isString(_2e7))){
d.style(node,_2e7);
}else{
node.setAttribute(name,_2e7);
}
}
}
return;
}else{
var prop=_2dd[name.toLowerCase()];
if(prop){
return node[prop];
}else{
var _2ed=node[name];
return (typeof _2ed=="boolean"||typeof _2ed=="function")?_2ed:(d.hasAttr(node,name)?node.getAttribute(name):null);
}
}
};
dojo.removeAttr=function(node,name){
d.byId(node).removeAttribute(_2db(name));
};
var _2f0="className";
dojo.hasClass=function(node,_2f2){
return ((" "+d.byId(node)[_2f0]+" ").indexOf(" "+_2f2+" ")>=0);
};
dojo.addClass=function(node,_2f4){
node=d.byId(node);
var cls=node[_2f0];
if((" "+cls+" ").indexOf(" "+_2f4+" ")<0){
node[_2f0]=cls+(cls?" ":"")+_2f4;
}
};
dojo.removeClass=function(node,_2f7){
node=d.byId(node);
var t=d.trim((" "+node[_2f0]+" ").replace(" "+_2f7+" "," "));
if(node[_2f0]!=t){
node[_2f0]=t;
}
};
dojo.toggleClass=function(node,_2fa,_2fb){
if(_2fb===undefined){
_2fb=!d.hasClass(node,_2fa);
}
d[_2fb?"addClass":"removeClass"](node,_2fa);
};
})();
}
if(!dojo._hasResource["dojo._base.NodeList"]){
dojo._hasResource["dojo._base.NodeList"]=true;
dojo.provide("dojo._base.NodeList");
(function(){
var d=dojo;
var tnl=function(arr){
arr.constructor=dojo.NodeList;
dojo._mixin(arr,dojo.NodeList.prototype);
return arr;
};
var _2ff=function(func,_301){
return function(){
var _a=arguments;
var aa=d._toArray(_a,0,[null]);
var s=this.map(function(i){
aa[0]=i;
return d[func].apply(d,aa);
});
return (_301||((_a.length>1)||!d.isString(_a[0])))?this:s;
};
};
dojo.NodeList=function(){
return tnl(Array.apply(null,arguments));
};
dojo.NodeList._wrap=tnl;
dojo.extend(dojo.NodeList,{slice:function(){
var a=d._toArray(arguments);
return tnl(a.slice.apply(this,a));
},splice:function(){
var a=d._toArray(arguments);
return tnl(a.splice.apply(this,a));
},concat:function(){
var a=d._toArray(arguments,0,[this]);
return tnl(a.concat.apply([],a));
},indexOf:function(_309,_30a){
return d.indexOf(this,_309,_30a);
},lastIndexOf:function(){
return d.lastIndexOf.apply(d,d._toArray(arguments,0,[this]));
},every:function(_30b,_30c){
return d.every(this,_30b,_30c);
},some:function(_30d,_30e){
return d.some(this,_30d,_30e);
},map:function(func,obj){
return d.map(this,func,obj,d.NodeList);
},forEach:function(_311,_312){
d.forEach(this,_311,_312);
return this;
},coords:function(){
return d.map(this,d.coords);
},attr:_2ff("attr"),style:_2ff("style"),addClass:_2ff("addClass",true),removeClass:_2ff("removeClass",true),toggleClass:_2ff("toggleClass",true),connect:_2ff("connect",true),place:function(_313,_314){
var item=d.query(_313)[0];
return this.forEach(function(i){
d.place(i,item,(_314||"last"));
});
},orphan:function(_317){
return (_317?d._filterQueryResult(this,_317):this).forEach("if(item.parentNode){ item.parentNode.removeChild(item); }");
},adopt:function(_318,_319){
var item=this[0];
return d.query(_318).forEach(function(ai){
d.place(ai,item,_319||"last");
});
},query:function(_31c){
if(!_31c){
return this;
}
var ret=d.NodeList();
this.forEach(function(item){
ret=ret.concat(d.query(_31c,item).filter(function(_31f){
return (_31f!==undefined);
}));
});
return ret;
},filter:function(_320){
var _321=this;
var _a=arguments;
var r=d.NodeList();
var rp=function(t){
if(t!==undefined){
r.push(t);
}
};
if(d.isString(_320)){
_321=d._filterQueryResult(this,_a[0]);
if(_a.length==1){
return _321;
}
_a.shift();
}
d.forEach(d.filter(_321,_a[0],_a[1]),rp);
return r;
},addContent:function(_326,_327){
var ta=d.doc.createElement("span");
if(d.isString(_326)){
ta.innerHTML=_326;
}else{
ta.appendChild(_326);
}
if(_327===undefined){
_327="last";
}
var ct=(_327=="first"||_327=="after")?"lastChild":"firstChild";
this.forEach(function(item){
var tn=ta.cloneNode(true);
while(tn[ct]){
d.place(tn[ct],item,_327);
}
});
return this;
},empty:function(){
return this.forEach("item.innerHTML='';");
},instantiate:function(_32c,_32d){
var c=d.isFunction(_32c)?_32c:d.getObject(_32c);
return this.forEach(function(i){
new c(_32d||{},i);
});
},at:function(){
var nl=new dojo.NodeList();
dojo.forEach(arguments,function(i){
if(this[i]){
nl.push(this[i]);
}
},this);
return nl;
}});
d.forEach(["blur","focus","click","keydown","keypress","keyup","mousedown","mouseenter","mouseleave","mousemove","mouseout","mouseover","mouseup","submit","load","error"],function(evt){
var _oe="on"+evt;
d.NodeList.prototype[_oe]=function(a,b){
return this.connect(_oe,a,b);
};
});
})();
}
if(!dojo._hasResource["dojo._base.query"]){
dojo._hasResource["dojo._base.query"]=true;
dojo.provide("dojo._base.query");
(function(){
var d=dojo;
var _337=dojo.isIE?"children":"childNodes";
var _338=false;
var _339=function(_33a){
if(">~+".indexOf(_33a.charAt(_33a.length-1))>=0){
_33a+=" *";
}
_33a+=" ";
var ts=function(s,e){
return d.trim(_33a.slice(s,e));
};
var _33e=[];
var _33f=-1;
var _340=-1;
var _341=-1;
var _342=-1;
var _343=-1;
var inId=-1;
var _345=-1;
var lc="";
var cc="";
var _348;
var x=0;
var ql=_33a.length;
var _34b=null;
var _cp=null;
var _34d=function(){
if(_345>=0){
var tv=(_345==x)?null:ts(_345,x);
_34b[(">~+".indexOf(tv)<0)?"tag":"oper"]=tv;
_345=-1;
}
};
var _34f=function(){
if(inId>=0){
_34b.id=ts(inId,x).replace(/\\/g,"");
inId=-1;
}
};
var _350=function(){
if(_343>=0){
_34b.classes.push(ts(_343+1,x).replace(/\\/g,""));
_343=-1;
}
};
var _351=function(){
_34f();
_34d();
_350();
};
for(;lc=cc,cc=_33a.charAt(x),x<ql;x++){
if(lc=="\\"){
continue;
}
if(!_34b){
_348=x;
_34b={query:null,pseudos:[],attrs:[],classes:[],tag:null,oper:null,id:null};
_345=x;
}
if(_33f>=0){
if(cc=="]"){
if(!_cp.attr){
_cp.attr=ts(_33f+1,x);
}else{
_cp.matchFor=ts((_341||_33f+1),x);
}
var cmf=_cp.matchFor;
if(cmf){
if((cmf.charAt(0)=="\"")||(cmf.charAt(0)=="'")){
_cp.matchFor=cmf.substring(1,cmf.length-1);
}
}
_34b.attrs.push(_cp);
_cp=null;
_33f=_341=-1;
}else{
if(cc=="="){
var _353=("|~^$*".indexOf(lc)>=0)?lc:"";
_cp.type=_353+cc;
_cp.attr=ts(_33f+1,x-_353.length);
_341=x+1;
}
}
}else{
if(_340>=0){
if(cc==")"){
if(_342>=0){
_cp.value=ts(_340+1,x);
}
_342=_340=-1;
}
}else{
if(cc=="#"){
_351();
inId=x+1;
}else{
if(cc=="."){
_351();
_343=x;
}else{
if(cc==":"){
_351();
_342=x;
}else{
if(cc=="["){
_351();
_33f=x;
_cp={};
}else{
if(cc=="("){
if(_342>=0){
_cp={name:ts(_342+1,x),value:null};
_34b.pseudos.push(_cp);
}
_340=x;
}else{
if(cc==" "&&lc!=cc){
_351();
if(_342>=0){
_34b.pseudos.push({name:ts(_342+1,x)});
}
_34b.hasLoops=(_34b.pseudos.length||_34b.attrs.length||_34b.classes.length);
_34b.query=ts(_348,x);
_34b.otag=_34b.tag=(_34b["oper"])?null:(_34b.tag||"*");
if(_34b.tag){
_34b.tag=_34b.tag.toUpperCase();
}
_33e.push(_34b);
_34b=null;
}
}
}
}
}
}
}
}
}
return _33e;
};
var _354={"*=":function(attr,_356){
return "[contains(@"+attr+", '"+_356+"')]";
},"^=":function(attr,_358){
return "[starts-with(@"+attr+", '"+_358+"')]";
},"$=":function(attr,_35a){
return "[substring(@"+attr+", string-length(@"+attr+")-"+(_35a.length-1)+")='"+_35a+"']";
},"~=":function(attr,_35c){
return "[contains(concat(' ',@"+attr+",' '), ' "+_35c+" ')]";
},"|=":function(attr,_35e){
return "[contains(concat(' ',@"+attr+",' '), ' "+_35e+"-')]";
},"=":function(attr,_360){
return "[@"+attr+"='"+_360+"']";
}};
var _361=function(_362,_363,_364,_365){
d.forEach(_363.attrs,function(attr){
var _367;
if(attr.type&&_362[attr.type]){
_367=_362[attr.type](attr.attr,attr.matchFor);
}else{
if(attr.attr.length){
_367=_364(attr.attr);
}
}
if(_367){
_365(_367);
}
});
};
var _368=function(_369){
var _36a=".";
var _36b=_339(d.trim(_369));
while(_36b.length){
var tqp=_36b.shift();
var _36d;
var _36e="";
if(tqp.oper==">"){
_36d="/";
tqp=_36b.shift();
}else{
if(tqp.oper=="~"){
_36d="/following-sibling::";
tqp=_36b.shift();
}else{
if(tqp.oper=="+"){
_36d="/following-sibling::";
_36e="[position()=1]";
tqp=_36b.shift();
}else{
_36d="//";
}
}
}
_36a+=_36d+tqp.tag+_36e;
if(tqp.id){
_36a+="[@id='"+tqp.id+"'][1]";
}
d.forEach(tqp.classes,function(cn){
var cnl=cn.length;
var _371=" ";
if(cn.charAt(cnl-1)=="*"){
_371="";
cn=cn.substr(0,cnl-1);
}
_36a+="[contains(concat(' ',@class,' '), ' "+cn+_371+"')]";
});
_361(_354,tqp,function(_372){
return "[@"+_372+"]";
},function(_373){
_36a+=_373;
});
}
return _36a;
};
var _374={};
var _375=function(path){
if(_374[path]){
return _374[path];
}
var doc=d.doc;
var _378=_368(path);
var tf=function(_37a){
var ret=[];
var _37c;
var tdoc=doc;
if(_37a){
tdoc=(_37a.nodeType==9)?_37a:_37a.ownerDocument;
}
try{
_37c=tdoc.evaluate(_378,_37a,null,XPathResult.ANY_TYPE,null);
}
catch(e){
}
var _37e=_37c.iterateNext();
while(_37e){
ret.push(_37e);
_37e=_37c.iterateNext();
}
return ret;
};
return _374[path]=tf;
};
var _37f={};
var _380={};
var _381=function(_382,_383){
if(!_382){
return _383;
}
if(!_383){
return _382;
}
return function(){
return _382.apply(window,arguments)&&_383.apply(window,arguments);
};
};
var _384=function(root){
var ret=[];
var te,x=0,tret=root[_337];
while((te=tret[x++])){
if(te.nodeType==1){
ret.push(te);
}
}
return ret;
};
var _38a=function(root,_38c){
var ret=[];
var te=root;
while(te=te.nextSibling){
if(te.nodeType==1){
ret.push(te);
if(_38c){
break;
}
}
}
return ret;
};
var _38f=function(_390,_391,_392,idx){
var nidx=idx+1;
var _395=(_391.length==nidx);
var tqp=_391[idx];
if(tqp.oper){
var ecn=(tqp.oper==">")?_384(_390):_38a(_390,(tqp.oper=="+"));
if(!ecn||!ecn.length){
return;
}
nidx++;
_395=(_391.length==nidx);
var tf=_399(_391[idx+1]);
for(var x=0,ecnl=ecn.length,te;x<ecnl,te=ecn[x];x++){
if(tf(te)){
if(_395){
_392.push(te);
}else{
_38f(te,_391,_392,nidx);
}
}
}
}
var _39d=_39e(tqp)(_390);
if(_395){
while(_39d.length){
_392.push(_39d.shift());
}
}else{
while(_39d.length){
_38f(_39d.shift(),_391,_392,nidx);
}
}
};
var _39f=function(_3a0,_3a1){
var ret=[];
var x=_3a0.length-1,te;
while((te=_3a0[x--])){
_38f(te,_3a1,ret,0);
}
return ret;
};
var _399=function(q){
if(_37f[q.query]){
return _37f[q.query];
}
var ff=null;
if(q.tag){
if(q.tag=="*"){
ff=_381(ff,function(elem){
return (elem.nodeType==1);
});
}else{
ff=_381(ff,function(elem){
return ((elem.nodeType==1)&&(q[_338?"otag":"tag"]==elem.tagName));
});
}
}
if(q.id){
ff=_381(ff,function(elem){
return ((elem.nodeType==1)&&(elem.id==q.id));
});
}
if(q.hasLoops){
ff=_381(ff,_3aa(q));
}
return _37f[q.query]=ff;
};
var _3ab=function(node){
var pn=node.parentNode;
var pnc=pn.childNodes;
var nidx=-1;
var _3b0=pn.firstChild;
if(!_3b0){
return nidx;
}
var ci=node["__cachedIndex"];
var cl=pn["__cachedLength"];
if(((typeof cl=="number")&&(cl!=pnc.length))||(typeof ci!="number")){
pn["__cachedLength"]=pnc.length;
var idx=1;
do{
if(_3b0===node){
nidx=idx;
}
if(_3b0.nodeType==1){
_3b0["__cachedIndex"]=idx;
idx++;
}
_3b0=_3b0.nextSibling;
}while(_3b0);
}else{
nidx=ci;
}
return nidx;
};
var _3b4=0;
var _3b5="";
var _3b6=function(elem,attr){
if(attr=="class"){
return elem.className||_3b5;
}
if(attr=="for"){
return elem.htmlFor||_3b5;
}
if(attr=="style"){
return elem.style.cssText||_3b5;
}
return elem.getAttribute(attr,2)||_3b5;
};
var _3b9={"*=":function(attr,_3bb){
return function(elem){
return (_3b6(elem,attr).indexOf(_3bb)>=0);
};
},"^=":function(attr,_3be){
return function(elem){
return (_3b6(elem,attr).indexOf(_3be)==0);
};
},"$=":function(attr,_3c1){
var tval=" "+_3c1;
return function(elem){
var ea=" "+_3b6(elem,attr);
return (ea.lastIndexOf(_3c1)==(ea.length-_3c1.length));
};
},"~=":function(attr,_3c6){
var tval=" "+_3c6+" ";
return function(elem){
var ea=" "+_3b6(elem,attr)+" ";
return (ea.indexOf(tval)>=0);
};
},"|=":function(attr,_3cb){
var _3cc=" "+_3cb+"-";
return function(elem){
var ea=" "+(elem.getAttribute(attr,2)||"");
return ((ea==_3cb)||(ea.indexOf(_3cc)==0));
};
},"=":function(attr,_3d0){
return function(elem){
return (_3b6(elem,attr)==_3d0);
};
}};
var _3d2={"checked":function(name,_3d4){
return function(elem){
return !!d.attr(elem,"checked");
};
},"first-child":function(name,_3d7){
return function(elem){
if(elem.nodeType!=1){
return false;
}
var fc=elem.previousSibling;
while(fc&&(fc.nodeType!=1)){
fc=fc.previousSibling;
}
return (!fc);
};
},"last-child":function(name,_3db){
return function(elem){
if(elem.nodeType!=1){
return false;
}
var nc=elem.nextSibling;
while(nc&&(nc.nodeType!=1)){
nc=nc.nextSibling;
}
return (!nc);
};
},"empty":function(name,_3df){
return function(elem){
var cn=elem.childNodes;
var cnl=elem.childNodes.length;
for(var x=cnl-1;x>=0;x--){
var nt=cn[x].nodeType;
if((nt==1)||(nt==3)){
return false;
}
}
return true;
};
},"contains":function(name,_3e6){
return function(elem){
if(_3e6.charAt(0)=="\""||_3e6.charAt(0)=="'"){
_3e6=_3e6.substr(1,_3e6.length-2);
}
return (elem.innerHTML.indexOf(_3e6)>=0);
};
},"not":function(name,_3e9){
var ntf=_399(_339(_3e9)[0]);
return function(elem){
return (!ntf(elem));
};
},"nth-child":function(name,_3ed){
var pi=parseInt;
if(_3ed=="odd"){
_3ed="2n+1";
}else{
if(_3ed=="even"){
_3ed="2n";
}
}
if(_3ed.indexOf("n")!=-1){
var _3ef=_3ed.split("n",2);
var pred=_3ef[0]?(_3ef[0]=="-"?-1:pi(_3ef[0])):1;
var idx=_3ef[1]?pi(_3ef[1]):0;
var lb=0,ub=-1;
if(pred>0){
if(idx<0){
idx=(idx%pred)&&(pred+(idx%pred));
}else{
if(idx>0){
if(idx>=pred){
lb=idx-idx%pred;
}
idx=idx%pred;
}
}
}else{
if(pred<0){
pred*=-1;
if(idx>0){
ub=idx;
idx=idx%pred;
}
}
}
if(pred>0){
return function(elem){
var i=_3ab(elem);
return (i>=lb)&&(ub<0||i<=ub)&&((i%pred)==idx);
};
}else{
_3ed=idx;
}
}
var _3f6=pi(_3ed);
return function(elem){
return (_3ab(elem)==_3f6);
};
}};
var _3f8=(d.isIE)?function(cond){
var clc=cond.toLowerCase();
return function(elem){
return elem[cond]||elem[clc];
};
}:function(cond){
return function(elem){
return (elem&&elem.getAttribute&&elem.hasAttribute(cond));
};
};
var _3aa=function(_3fe){
var _3ff=(_380[_3fe.query]||_37f[_3fe.query]);
if(_3ff){
return _3ff;
}
var ff=null;
if(_3fe.id){
if(_3fe.tag!="*"){
ff=_381(ff,function(elem){
return (elem.tagName==_3fe[_338?"otag":"tag"]);
});
}
}
d.forEach(_3fe.classes,function(_402,idx,arr){
var _405=_402.charAt(_402.length-1)=="*";
if(_405){
_402=_402.substr(0,_402.length-1);
}
var re=new RegExp("(?:^|\\s)"+_402+(_405?".*":"")+"(?:\\s|$)");
ff=_381(ff,function(elem){
return re.test(elem.className);
});
ff.count=idx;
});
d.forEach(_3fe.pseudos,function(_408){
if(_3d2[_408.name]){
ff=_381(ff,_3d2[_408.name](_408.name,_408.value));
}
});
_361(_3b9,_3fe,_3f8,function(_409){
ff=_381(ff,_409);
});
if(!ff){
ff=function(){
return true;
};
}
return _380[_3fe.query]=ff;
};
var _40a={};
var _39e=function(_40b,root){
var fHit=_40a[_40b.query];
if(fHit){
return fHit;
}
if(_40b.id&&!_40b.hasLoops&&!_40b.tag){
return _40a[_40b.query]=function(root){
return [d.byId(_40b.id)];
};
}
var _40f=_3aa(_40b);
var _410;
if(_40b.tag&&_40b.id&&!_40b.hasLoops){
_410=function(root){
var te=d.byId(_40b.id,(root.ownerDocument||root));
if(_40f(te)){
return [te];
}
};
}else{
var tret;
if(!_40b.hasLoops){
_410=function(root){
var ret=[];
var te,x=0,tret=root.getElementsByTagName(_40b[_338?"otag":"tag"]);
while((te=tret[x++])){
ret.push(te);
}
return ret;
};
}else{
_410=function(root){
var ret=[];
var te,x=0,tret=root.getElementsByTagName(_40b[_338?"otag":"tag"]);
while((te=tret[x++])){
if(_40f(te)){
ret.push(te);
}
}
return ret;
};
}
}
return _40a[_40b.query]=_410;
};
var _41c={};
var _41d={"*":d.isIE?function(root){
return root.all;
}:function(root){
return root.getElementsByTagName("*");
},"~":_38a,"+":function(root){
return _38a(root,true);
},">":_384};
var _421=function(_422){
var _423=_339(d.trim(_422));
if(_423.length==1){
var tt=_39e(_423[0]);
tt.nozip=true;
return tt;
}
var sqf=function(root){
var _427=_423.slice(0);
var _428;
if(_427[0].oper==">"){
_428=[root];
}else{
_428=_39e(_427.shift())(root);
}
return _39f(_428,_427);
};
return sqf;
};
var _429=((document["evaluate"]&&!d.isSafari)?function(_42a,root){
var _42c=_42a.split(" ");
if((!_338)&&(document["evaluate"])&&(_42a.indexOf(":")==-1)&&(_42a.indexOf("+")==-1)){
if(((_42c.length>2)&&(_42a.indexOf(">")==-1))||(_42c.length>3)||(_42a.indexOf("[")>=0)||((1==_42c.length)&&(0<=_42a.indexOf(".")))){
return _375(_42a);
}
}
return _421(_42a);
}:_421);
var _42d=function(_42e){
var qcz=_42e.charAt(0);
if(d.doc["querySelectorAll"]&&((!d.isSafari)||(d.isSafari>3.1))&&(">+~".indexOf(qcz)==-1)){
return function(root){
var r=root.querySelectorAll(_42e);
r.nozip=true;
return r;
};
}
if(_41d[_42e]){
return _41d[_42e];
}
if(0>_42e.indexOf(",")){
return _41d[_42e]=_429(_42e);
}else{
var _432=_42e.split(/\s*,\s*/);
var tf=function(root){
var _435=0;
var ret=[];
var tp;
while((tp=_432[_435++])){
ret=ret.concat(_429(tp,tp.indexOf(" "))(root));
}
return ret;
};
return _41d[_42e]=tf;
}
};
var _438=0;
var _zip=function(arr){
if(arr&&arr.nozip){
return d.NodeList._wrap(arr);
}
var ret=new d.NodeList();
if(!arr){
return ret;
}
if(arr[0]){
ret.push(arr[0]);
}
if(arr.length<2){
return ret;
}
_438++;
if(d.isIE&&_338){
var _43c=_438+"";
arr[0].setAttribute("_zipIdx",_43c);
for(var x=1,te;te=arr[x];x++){
if(arr[x].getAttribute("_zipIdx")!=_43c){
ret.push(te);
}
te.setAttribute("_zipIdx",_43c);
}
}else{
arr[0]["_zipIdx"]=_438;
for(var x=1,te;te=arr[x];x++){
if(arr[x]["_zipIdx"]!=_438){
ret.push(te);
}
te["_zipIdx"]=_438;
}
}
return ret;
};
d.query=function(_43f,root){
if(_43f.constructor==d.NodeList){
return _43f;
}
if(!d.isString(_43f)){
return new d.NodeList(_43f);
}
if(d.isString(root)){
root=d.byId(root);
}
root=root||d.doc;
var od=root.ownerDocument||root.documentElement;
_338=(root.contentType&&root.contentType=="application/xml")||(!!od)&&(d.isIE?od.xml:(root.xmlVersion||od.xmlVersion));
return _zip(_42d(_43f)(root));
};
d.query.pseudos=_3d2;
d._filterQueryResult=function(_442,_443){
var tnl=new d.NodeList();
var ff=(_443)?_399(_339(_443)[0]):function(){
return true;
};
for(var x=0,te;te=_442[x];x++){
if(ff(te)){
tnl.push(te);
}
}
return tnl;
};
})();
}
if(!dojo._hasResource["dojo._base.xhr"]){
dojo._hasResource["dojo._base.xhr"]=true;
dojo.provide("dojo._base.xhr");
(function(){
var _d=dojo;
function setValue(obj,name,_44b){
var val=obj[name];
if(_d.isString(val)){
obj[name]=[val,_44b];
}else{
if(_d.isArray(val)){
val.push(_44b);
}else{
obj[name]=_44b;
}
}
};
dojo.formToObject=function(_44d){
var ret={};
var _44f="file|submit|image|reset|button|";
_d.forEach(dojo.byId(_44d).elements,function(item){
var _in=item.name;
var type=(item.type||"").toLowerCase();
if(_in&&type&&_44f.indexOf(type)==-1&&!item.disabled){
if(type=="radio"||type=="checkbox"){
if(item.checked){
setValue(ret,_in,item.value);
}
}else{
if(item.multiple){
ret[_in]=[];
_d.query("option",item).forEach(function(opt){
if(opt.selected){
setValue(ret,_in,opt.value);
}
});
}else{
setValue(ret,_in,item.value);
if(type=="image"){
ret[_in+".x"]=ret[_in+".y"]=ret[_in].x=ret[_in].y=0;
}
}
}
}
});
return ret;
};
dojo.objectToQuery=function(map){
var enc=encodeURIComponent;
var _456=[];
var _457={};
for(var name in map){
var _459=map[name];
if(_459!=_457[name]){
var _45a=enc(name)+"=";
if(_d.isArray(_459)){
for(var i=0;i<_459.length;i++){
_456.push(_45a+enc(_459[i]));
}
}else{
_456.push(_45a+enc(_459));
}
}
}
return _456.join("&");
};
dojo.formToQuery=function(_45c){
return _d.objectToQuery(_d.formToObject(_45c));
};
dojo.formToJson=function(_45d,_45e){
return _d.toJson(_d.formToObject(_45d),_45e);
};
dojo.queryToObject=function(str){
var ret={};
var qp=str.split("&");
var dec=decodeURIComponent;
_d.forEach(qp,function(item){
if(item.length){
var _464=item.split("=");
var name=dec(_464.shift());
var val=dec(_464.join("="));
if(_d.isString(ret[name])){
ret[name]=[ret[name]];
}
if(_d.isArray(ret[name])){
ret[name].push(val);
}else{
ret[name]=val;
}
}
});
return ret;
};
dojo._blockAsync=false;
dojo._contentHandlers={"text":function(xhr){
return xhr.responseText;
},"json":function(xhr){
return _d.fromJson(xhr.responseText||null);
},"json-comment-filtered":function(xhr){
if(!dojo.config.useCommentedJson){
console.warn("Consider using the standard mimetype:application/json."+" json-commenting can introduce security issues. To"+" decrease the chances of hijacking, use the standard the 'json' handler and"+" prefix your json with: {}&&\n"+"Use djConfig.useCommentedJson=true to turn off this message.");
}
var _46a=xhr.responseText;
var _46b=_46a.indexOf("/*");
var _46c=_46a.lastIndexOf("*/");
if(_46b==-1||_46c==-1){
throw new Error("JSON was not comment filtered");
}
return _d.fromJson(_46a.substring(_46b+2,_46c));
},"javascript":function(xhr){
return _d.eval(xhr.responseText);
},"xml":function(xhr){
var _46f=xhr.responseXML;
if(_d.isIE&&(!_46f||_46f.documentElement==null)){
_d.forEach(["MSXML2","Microsoft","MSXML","MSXML3"],function(_470){
try{
var dom=new ActiveXObject(_470+".XMLDOM");
dom.async=false;
dom.loadXML(xhr.responseText);
_46f=dom;
}
catch(e){
}
});
}
return _46f;
}};
dojo._contentHandlers["json-comment-optional"]=function(xhr){
var _473=_d._contentHandlers;
if(xhr.responseText&&xhr.responseText.indexOf("/*")!=-1){
return _473["json-comment-filtered"](xhr);
}else{
return _473["json"](xhr);
}
};
dojo._ioSetArgs=function(args,_475,_476,_477){
var _478={args:args,url:args.url};
var _479=null;
if(args.form){
var form=_d.byId(args.form);
var _47b=form.getAttributeNode("action");
_478.url=_478.url||(_47b?_47b.value:null);
_479=_d.formToObject(form);
}
var _47c=[{}];
if(_479){
_47c.push(_479);
}
if(args.content){
_47c.push(args.content);
}
if(args.preventCache){
_47c.push({"dojo.preventCache":new Date().valueOf()});
}
_478.query=_d.objectToQuery(_d.mixin.apply(null,_47c));
_478.handleAs=args.handleAs||"text";
var d=new _d.Deferred(_475);
d.addCallbacks(_476,function(_47e){
return _477(_47e,d);
});
var ld=args.load;
if(ld&&_d.isFunction(ld)){
d.addCallback(function(_480){
return ld.call(args,_480,_478);
});
}
var err=args.error;
if(err&&_d.isFunction(err)){
d.addErrback(function(_482){
return err.call(args,_482,_478);
});
}
var _483=args.handle;
if(_483&&_d.isFunction(_483)){
d.addBoth(function(_484){
return _483.call(args,_484,_478);
});
}
d.ioArgs=_478;
return d;
};
var _485=function(dfd){
dfd.canceled=true;
var xhr=dfd.ioArgs.xhr;
var _at=typeof xhr.abort;
if(_at=="function"||_at=="object"||_at=="unknown"){
xhr.abort();
}
var err=dfd.ioArgs.error;
if(!err){
err=new Error("xhr cancelled");
err.dojoType="cancel";
}
return err;
};
var _48a=function(dfd){
var ret=_d._contentHandlers[dfd.ioArgs.handleAs](dfd.ioArgs.xhr);
return (typeof ret=="undefined")?null:ret;
};
var _48d=function(_48e,dfd){
return _48e;
};
var _490=null;
var _491=[];
var _492=function(){
var now=(new Date()).getTime();
if(!_d._blockAsync){
for(var i=0,tif;i<_491.length&&(tif=_491[i]);i++){
var dfd=tif.dfd;
var func=function(){
if(!dfd||dfd.canceled||!tif.validCheck(dfd)){
_491.splice(i--,1);
}else{
if(tif.ioCheck(dfd)){
_491.splice(i--,1);
tif.resHandle(dfd);
}else{
if(dfd.startTime){
if(dfd.startTime+(dfd.ioArgs.args.timeout||0)<now){
_491.splice(i--,1);
var err=new Error("timeout exceeded");
err.dojoType="timeout";
dfd.errback(err);
dfd.cancel();
}
}
}
}
};
if(dojo.config.isDebug){
func.call(this);
}else{
try{
func.call(this);
}
catch(e){
dfd.errback(e);
}
}
}
}
if(!_491.length){
clearInterval(_490);
_490=null;
return;
}
};
dojo._ioCancelAll=function(){
try{
_d.forEach(_491,function(i){
try{
i.dfd.cancel();
}
catch(e){
}
});
}
catch(e){
}
};
if(_d.isIE){
_d.addOnWindowUnload(_d._ioCancelAll);
}
_d._ioWatch=function(dfd,_49b,_49c,_49d){
if(dfd.ioArgs.args.timeout){
dfd.startTime=(new Date()).getTime();
}
_491.push({dfd:dfd,validCheck:_49b,ioCheck:_49c,resHandle:_49d});
if(!_490){
_490=setInterval(_492,50);
}
_492();
};
var _49e="application/x-www-form-urlencoded";
var _49f=function(dfd){
return dfd.ioArgs.xhr.readyState;
};
var _4a1=function(dfd){
return 4==dfd.ioArgs.xhr.readyState;
};
var _4a3=function(dfd){
var xhr=dfd.ioArgs.xhr;
if(_d._isDocumentOk(xhr)){
dfd.callback(dfd);
}else{
var err=new Error("Unable to load "+dfd.ioArgs.url+" status:"+xhr.status);
err.status=xhr.status;
err.responseText=xhr.responseText;
dfd.errback(err);
}
};
dojo._ioAddQueryToUrl=function(_4a7){
if(_4a7.query.length){
_4a7.url+=(_4a7.url.indexOf("?")==-1?"?":"&")+_4a7.query;
_4a7.query=null;
}
};
dojo.xhr=function(_4a8,args,_4aa){
var dfd=_d._ioSetArgs(args,_485,_48a,_48d);
dfd.ioArgs.xhr=_d._xhrObj(dfd.ioArgs.args);
if(_4aa){
if("postData" in args){
dfd.ioArgs.query=args.postData;
}else{
if("putData" in args){
dfd.ioArgs.query=args.putData;
}
}
}else{
_d._ioAddQueryToUrl(dfd.ioArgs);
}
var _4ac=dfd.ioArgs;
var xhr=_4ac.xhr;
xhr.open(_4a8,_4ac.url,args.sync!==true,args.user||undefined,args.password||undefined);
if(args.headers){
for(var hdr in args.headers){
if(hdr.toLowerCase()==="content-type"&&!args.contentType){
args.contentType=args.headers[hdr];
}else{
xhr.setRequestHeader(hdr,args.headers[hdr]);
}
}
}
xhr.setRequestHeader("Content-Type",args.contentType||_49e);
if(!args.headers||!args.headers["X-Requested-With"]){
xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");
}
if(dojo.config.isDebug){
xhr.send(_4ac.query);
}else{
try{
xhr.send(_4ac.query);
}
catch(e){
dfd.ioArgs.error=e;
dfd.cancel();
}
}
_d._ioWatch(dfd,_49f,_4a1,_4a3);
xhr=null;
return dfd;
};
dojo.xhrGet=function(args){
return _d.xhr("GET",args);
};
dojo.rawXhrPost=dojo.xhrPost=function(args){
return _d.xhr("POST",args,true);
};
dojo.rawXhrPut=dojo.xhrPut=function(args){
return _d.xhr("PUT",args,true);
};
dojo.xhrDelete=function(args){
return _d.xhr("DELETE",args);
};
})();
}
if(!dojo._hasResource["dojo._base.fx"]){
dojo._hasResource["dojo._base.fx"]=true;
dojo.provide("dojo._base.fx");
(function(){
var d=dojo;
dojo._Line=function(_4b4,end){
this.start=_4b4;
this.end=end;
this.getValue=function(n){
return ((this.end-this.start)*n)+this.start;
};
};
d.declare("dojo._Animation",null,{constructor:function(args){
d.mixin(this,args);
if(d.isArray(this.curve)){
this.curve=new d._Line(this.curve[0],this.curve[1]);
}
},duration:350,repeat:0,rate:10,_percent:0,_startRepeatCount:0,_fire:function(evt,args){
if(this[evt]){
if(dojo.config.isDebug){
this[evt].apply(this,args||[]);
}else{
try{
this[evt].apply(this,args||[]);
}
catch(e){
console.error("exception in animation handler for:",evt);
console.error(e);
}
}
}
return this;
},play:function(_4ba,_4bb){
var _t=this;
if(_4bb){
_t._stopTimer();
_t._active=_t._paused=false;
_t._percent=0;
}else{
if(_t._active&&!_t._paused){
return _t;
}
}
_t._fire("beforeBegin");
var de=_4ba||_t.delay;
var _p=dojo.hitch(_t,"_play",_4bb);
if(de>0){
setTimeout(_p,de);
return _t;
}
_p();
return _t;
},_play:function(_4bf){
var _t=this;
_t._startTime=new Date().valueOf();
if(_t._paused){
_t._startTime-=_t.duration*_t._percent;
}
_t._endTime=_t._startTime+_t.duration;
_t._active=true;
_t._paused=false;
var _4c1=_t.curve.getValue(_t._percent);
if(!_t._percent){
if(!_t._startRepeatCount){
_t._startRepeatCount=_t.repeat;
}
_t._fire("onBegin",[_4c1]);
}
_t._fire("onPlay",[_4c1]);
_t._cycle();
return _t;
},pause:function(){
this._stopTimer();
if(!this._active){
return this;
}
this._paused=true;
this._fire("onPause",[this.curve.getValue(this._percent)]);
return this;
},gotoPercent:function(_4c2,_4c3){
this._stopTimer();
this._active=this._paused=true;
this._percent=_4c2;
if(_4c3){
this.play();
}
return this;
},stop:function(_4c4){
if(!this._timer){
return this;
}
this._stopTimer();
if(_4c4){
this._percent=1;
}
this._fire("onStop",[this.curve.getValue(this._percent)]);
this._active=this._paused=false;
return this;
},status:function(){
if(this._active){
return this._paused?"paused":"playing";
}
return "stopped";
},_cycle:function(){
var _t=this;
if(_t._active){
var curr=new Date().valueOf();
var step=(curr-_t._startTime)/(_t._endTime-_t._startTime);
if(step>=1){
step=1;
}
_t._percent=step;
if(_t.easing){
step=_t.easing(step);
}
_t._fire("onAnimate",[_t.curve.getValue(step)]);
if(_t._percent<1){
_t._startTimer();
}else{
_t._active=false;
if(_t.repeat>0){
_t.repeat--;
_t.play(null,true);
}else{
if(_t.repeat==-1){
_t.play(null,true);
}else{
if(_t._startRepeatCount){
_t.repeat=_t._startRepeatCount;
_t._startRepeatCount=0;
}
}
}
_t._percent=0;
_t._fire("onEnd");
_t._stopTimer();
}
}
return _t;
}});
var ctr=0;
var _4c9=[];
var _4ca={run:function(){
}};
var _4cb=null;
dojo._Animation.prototype._startTimer=function(){
if(!this._timer){
this._timer=d.connect(_4ca,"run",this,"_cycle");
ctr++;
}
if(!_4cb){
_4cb=setInterval(d.hitch(_4ca,"run"),this.rate);
}
};
dojo._Animation.prototype._stopTimer=function(){
if(this._timer){
d.disconnect(this._timer);
this._timer=null;
ctr--;
}
if(ctr<=0){
clearInterval(_4cb);
_4cb=null;
ctr=0;
}
};
var _4cc=(d.isIE)?function(node){
var ns=node.style;
if(!ns.width.length&&d.style(node,"width")=="auto"){
ns.width="auto";
}
}:function(){
};
dojo._fade=function(args){
args.node=d.byId(args.node);
var _4d0=d.mixin({properties:{}},args);
var _4d1=(_4d0.properties.opacity={});
_4d1.start=!("start" in _4d0)?function(){
return Number(d.style(_4d0.node,"opacity"));
}:_4d0.start;
_4d1.end=_4d0.end;
var anim=d.animateProperty(_4d0);
d.connect(anim,"beforeBegin",d.partial(_4cc,_4d0.node));
return anim;
};
dojo.fadeIn=function(args){
return d._fade(d.mixin({end:1},args));
};
dojo.fadeOut=function(args){
return d._fade(d.mixin({end:0},args));
};
dojo._defaultEasing=function(n){
return 0.5+((Math.sin((n+1.5)*Math.PI))/2);
};
var _4d6=function(_4d7){
this._properties=_4d7;
for(var p in _4d7){
var prop=_4d7[p];
if(prop.start instanceof d.Color){
prop.tempColor=new d.Color();
}
}
this.getValue=function(r){
var ret={};
for(var p in this._properties){
var prop=this._properties[p];
var _4de=prop.start;
if(_4de instanceof d.Color){
ret[p]=d.blendColors(_4de,prop.end,r,prop.tempColor).toCss();
}else{
if(!d.isArray(_4de)){
ret[p]=((prop.end-_4de)*r)+_4de+(p!="opacity"?prop.units||"px":"");
}
}
}
return ret;
};
};
dojo.animateProperty=function(args){
args.node=d.byId(args.node);
if(!args.easing){
args.easing=d._defaultEasing;
}
var anim=new d._Animation(args);
d.connect(anim,"beforeBegin",anim,function(){
var pm={};
for(var p in this.properties){
if(p=="width"||p=="height"){
this.node.display="block";
}
var prop=this.properties[p];
prop=pm[p]=d.mixin({},(d.isObject(prop)?prop:{end:prop}));
if(d.isFunction(prop.start)){
prop.start=prop.start();
}
if(d.isFunction(prop.end)){
prop.end=prop.end();
}
var _4e4=(p.toLowerCase().indexOf("color")>=0);
function getStyle(node,p){
var v=({height:node.offsetHeight,width:node.offsetWidth})[p];
if(v!==undefined){
return v;
}
v=d.style(node,p);
return (p=="opacity")?Number(v):(_4e4?v:parseFloat(v));
};
if(!("end" in prop)){
prop.end=getStyle(this.node,p);
}else{
if(!("start" in prop)){
prop.start=getStyle(this.node,p);
}
}
if(_4e4){
prop.start=new d.Color(prop.start);
prop.end=new d.Color(prop.end);
}else{
prop.start=(p=="opacity")?Number(prop.start):parseFloat(prop.start);
}
}
this.curve=new _4d6(pm);
});
d.connect(anim,"onAnimate",d.hitch(d,"style",anim.node));
return anim;
};
dojo.anim=function(node,_4e9,_4ea,_4eb,_4ec,_4ed){
return d.animateProperty({node:node,duration:_4ea||d._Animation.prototype.duration,properties:_4e9,easing:_4eb,onEnd:_4ec}).play(_4ed||0);
};
})();
}
if(!dojo._hasResource["dojo._base.browser"]){
dojo._hasResource["dojo._base.browser"]=true;
dojo.provide("dojo._base.browser");
if(dojo.config.require){
dojo.forEach(dojo.config.require,"dojo['require'](item);");
}
}
if(dojo.config.afterOnLoad&&dojo.isBrowser){
window.setTimeout(dojo._fakeLoadInit,1000);
}
})();
