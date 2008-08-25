/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojo._firebug.firebug"]){
dojo._hasResource["dojo._firebug.firebug"]=true;
dojo.provide("dojo._firebug.firebug");
dojo.deprecated=function(_1,_2,_3){
var _4="DEPRECATED: "+_1;
if(_2){
_4+=" "+_2;
}
if(_3){
_4+=" -- will be removed in version: "+_3;
}
console.warn(_4);
};
dojo.experimental=function(_5,_6){
var _7="EXPERIMENTAL: "+_5+" -- APIs subject to change without notice.";
if(_6){
_7+=" "+_6;
}
console.warn(_7);
};
if(!dojo.isFF||(dojo.isFF&&!("console" in window))||(dojo.isFF&&!(window.loadFirebugConsole||console.firebug))&&!dojo.config.noFirebugLite){
(function(){
try{
if(window!=window.parent){
if(window.parent["console"]){
window.console=window.parent.console;
}
return;
}
}
catch(e){
}
window.console={_connects:[],log:function(){
logFormatted(arguments,"");
},debug:function(){
logFormatted(arguments,"debug");
},info:function(){
logFormatted(arguments,"info");
},warn:function(){
logFormatted(arguments,"warning");
},error:function(){
logFormatted(arguments,"error");
},assert:function(_8,_9){
if(!_8){
var _a=[];
for(var i=1;i<arguments.length;++i){
_a.push(arguments[i]);
}
logFormatted(_a.length?_a:["Assertion Failure"],"error");
throw _9?_9:"Assertion Failure";
}
},dir:function(_c){
var _d=printObject(_c);
_d=_d.replace(/\n/g,"<br />");
_d=_d.replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;");
logRow([_d],"dir");
},dirxml:function(_e){
var _f=[];
appendNode(_e,_f);
logRow(_f,"dirxml");
},group:function(){
logRow(arguments,"group",pushGroup);
},groupEnd:function(){
logRow(arguments,"",popGroup);
},time:function(_10){
_11[_10]=new Date().getTime();
},timeEnd:function(_12){
if(_12 in _11){
var _13=(new Date()).getTime()-_11[_12];
logFormatted([_12+":",_13+"ms"]);
delete _11[_12];
}
},count:function(){
this.warn(["count() not supported."]);
},trace:function(){
this.warn(["trace() not supported."]);
},profile:function(){
this.warn(["profile() not supported."]);
},profileEnd:function(){
},clear:function(){
while(_14.childNodes.length){
dojo._destroyElement(_14.firstChild);
}
dojo.forEach(this._connects,dojo.disconnect);
},open:function(){
toggleConsole(true);
},close:function(){
if(_15){
toggleConsole();
}
},_restoreBorder:function(){
if(_16){
_16.style.border=_17;
}
},openDomInspector:function(){
_inspectionEnabled=true;
_14.style.display="none";
consoleDomInspector.style.display="block";
consoleObjectInspector.style.display="none";
document.body.style.cursor="pointer";
_inspectionMoveConnection=dojo.connect(document,"mousemove",function(evt){
if(!_inspectionEnabled){
return;
}
if(!_inspectionTimer){
_inspectionTimer=setTimeout(function(){
_inspectionTimer=null;
},50);
}else{
return;
}
var _19=evt.target;
if(_19&&(_16!==_19)){
var _1a=true;
console._restoreBorder();
var _1b=[];
appendNode(_19,_1b);
consoleDomInspector.innerHTML=_1b.join("");
_16=_19;
_17=_16.style.border;
_16.style.border="#0000FF 1px solid";
}
});
setTimeout(function(){
_inspectionClickConnection=dojo.connect(document,"click",function(evt){
document.body.style.cursor="";
_1d=!_1d;
dojo.disconnect(_1e);
});
},30);
},_closeDomInspector:function(){
document.body.style.cursor="";
dojo.disconnect(_1f);
dojo.disconnect(_1e);
_1d=false;
console._restoreBorder();
},openConsole:function(){
_14.style.display="block";
_20.style.display="none";
_21.style.display="none";
console._closeDomInspector();
},openObjectInspector:function(){
_14.style.display="none";
_20.style.display="none";
_21.style.display="block";
console._closeDomInspector();
},recss:function(){
var i,a,s;
a=document.getElementsByTagName("link");
for(i=0;i<a.length;i++){
s=a[i];
if(s.rel.toLowerCase().indexOf("stylesheet")>=0&&s.href){
var h=s.href.replace(/(&|%5C?)forceReload=\d+/,"");
s.href=h+(h.indexOf("?")>=0?"&":"?")+"forceReload="+new Date().valueOf();
}
}
}};
var _26=document;
var _27=window;
var _28=0;
var _29=null;
var _14=null;
var _21=null;
var _2a=null;
var _2b=null;
var _2c=null;
var _15=false;
var _2d=[];
var _2e=[];
var _11={};
var _20=null;
var _1f;
var _1e;
var _1d=false;
var _2f=null;
var _30=document.createElement("div");
var _16;
var _17;
function toggleConsole(_31){
_15=_31||!_15;
if(_29){
_29.style.display=_15?"block":"none";
}
};
function focusCommandLine(){
toggleConsole(true);
if(_2b){
_2b.focus();
}
};
function openWin(x,y,w,h){
var win=window.open("","_firebug","status=0,menubar=0,resizable=1,top="+y+",left="+x+",width="+w+",height="+h+",scrollbars=1,addressbar=0");
if(!win){
var msg="Firebug Lite could not open a pop-up window, most likely because of a blocker.\n"+"Either enable pop-ups for this domain, or change the djConfig to popup=false.";
alert(msg);
}
createResizeHandler(win);
var _38=win.document;
var _39="<html style=\"height:100%;\"><head><title>Firebug Lite</title></head>\n"+"<body bgColor=\"#ccc\" style=\"height:97%;\" onresize=\"opener.onFirebugResize()\">\n"+"<div id=\"fb\"></div>"+"</body></html>";
_38.write(_39);
_38.close();
return win;
};
function createResizeHandler(wn){
var d=new Date();
d.setTime(d.getTime()+(60*24*60*60*1000));
d=d.toUTCString();
var dc=wn.document,_3d;
if(wn.innerWidth){
_3d=function(){
return {w:wn.innerWidth,h:wn.innerHeight};
};
}else{
if(dc.documentElement&&dc.documentElement.clientWidth){
_3d=function(){
return {w:dc.documentElement.clientWidth,h:dc.documentElement.clientHeight};
};
}else{
if(dc.body){
_3d=function(){
return {w:dc.body.clientWidth,h:dc.body.clientHeight};
};
}
}
}
window.onFirebugResize=function(){
layout(_3d().h);
clearInterval(wn._firebugWin_resize);
wn._firebugWin_resize=setTimeout(function(){
var x=wn.screenLeft,y=wn.screenTop,w=wn.outerWidth||wn.document.body.offsetWidth,h=wn.outerHeight||wn.document.body.offsetHeight;
document.cookie="_firebugPosition="+[x,y,w,h].join(",")+"; expires="+d+"; path=/";
},5000);
};
};
function createFrame(){
if(_29){
return;
}
if(dojo.config.popup){
var _42="100%";
var _43=document.cookie.match(/(?:^|; )_firebugPosition=([^;]*)/);
var p=_43?_43[1].split(","):[2,2,320,480];
_27=openWin(p[0],p[1],p[2],p[3]);
_26=_27.document;
djConfig.debugContainerId="fb";
_27.console=window.console;
_27.dojo=window.dojo;
}else{
_26=document;
_42=(dojo.config.debugHeight||300)+"px";
}
var _45=_26.createElement("link");
_45.href=dojo.moduleUrl("dojo._firebug","firebug.css");
_45.rel="stylesheet";
_45.type="text/css";
var _46=_26.getElementsByTagName("head");
if(_46){
_46=_46[0];
}
if(!_46){
_46=_26.getElementsByTagName("html")[0];
}
if(dojo.isIE){
window.setTimeout(function(){
_46.appendChild(_45);
},0);
}else{
_46.appendChild(_45);
}
if(dojo.config.debugContainerId){
_29=_26.getElementById(dojo.config.debugContainerId);
}
if(!_29){
_29=_26.createElement("div");
_26.body.appendChild(_29);
}
_29.className+=" firebug";
_29.style.height=_42;
_29.style.display=(_15?"block":"none");
var _47=function(_48,_49,_4a,_4b){
return "<li class=\""+_4b+"\"><a href=\"javascript:void(0);\" onclick=\"console."+_4a+"(); return false;\" title=\""+_49+"\">"+_48+"</a></li>";
};
_29.innerHTML="<div id=\"firebugToolbar\">"+"  <ul id=\"fireBugTabs\" class=\"tabs\">"+_47("Clear","Remove All Console Logs","clear","")+_47("ReCSS","Refresh CSS without reloading page","recss","")+_47("Console","Show Console Logs","openConsole","gap")+_47("DOM","Show DOM Inspector","openDomInspector","")+_47("Object","Show Object Inspector","openObjectInspector","")+((dojo.config.popup)?"":_47("Close","Close the console","close","gap"))+"\t</ul>"+"</div>"+"<input type=\"text\" id=\"firebugCommandLine\" />"+"<div id=\"firebugLog\"></div>"+"<div id=\"objectLog\" style=\"display:none;\">Click on an object in the Log display</div>"+"<div id=\"domInspect\" style=\"display:none;\">Hover over HTML elements in the main page. Click to hold selection.</div>";
_2c=_26.getElementById("firebugToolbar");
_2b=_26.getElementById("firebugCommandLine");
addEvent(_2b,"keydown",onCommandLineKeyDown);
addEvent(_26,dojo.isIE||dojo.isSafari?"keydown":"keypress",onKeyDown);
_14=_26.getElementById("firebugLog");
_21=_26.getElementById("objectLog");
_20=_26.getElementById("domInspect");
_2a=_26.getElementById("fireBugTabs");
layout();
flush();
};
dojo.addOnLoad(createFrame);
function clearFrame(){
_26=null;
if(_27.console){
_27.console.clear();
}
_27=null;
_29=null;
_14=null;
_21=null;
_20=null;
_2b=null;
_2d=[];
_2e=[];
_11={};
};
dojo.addOnUnload(clearFrame);
function evalCommandLine(){
var _4c=_2b.value;
_2b.value="";
logRow([">  ",_4c],"command");
var _4d;
try{
_4d=eval(_4c);
}
catch(e){

}

};
function layout(h){
var _4f=25;
var _50=h?h-(_4f+_2b.offsetHeight+25+(h*0.01))+"px":(_29.offsetHeight-_4f-_2b.offsetHeight)+"px";
_14.style.top=_4f+"px";
_14.style.height=_50;
_21.style.height=_50;
_21.style.top=_4f+"px";
_20.style.height=_50;
_20.style.top=_4f+"px";
_2b.style.bottom=0;
};
function logRow(_51,_52,_53){
if(_14){
writeMessage(_51,_52,_53);
}else{
_2d.push([_51,_52,_53]);
}
};
function flush(){
var _54=_2d;
_2d=[];
for(var i=0;i<_54.length;++i){
writeMessage(_54[i][0],_54[i][1],_54[i][2]);
}
};
function writeMessage(_56,_57,_58){
var _59=_14.scrollTop+_14.offsetHeight>=_14.scrollHeight;
_58=_58||writeRow;
_58(_56,_57);
if(_59){
_14.scrollTop=_14.scrollHeight-_14.offsetHeight;
}
};
function appendRow(row){
var _5b=_2e.length?_2e[_2e.length-1]:_14;
_5b.appendChild(row);
};
function writeRow(_5c,_5d){
var row=_14.ownerDocument.createElement("div");
row.className="logRow"+(_5d?" logRow-"+_5d:"");
row.innerHTML=_5c.join("");
appendRow(row);
};
function pushGroup(_5f,_60){
logFormatted(_5f,_60);
var _61=_14.ownerDocument.createElement("div");
_61.className="logGroupBox";
appendRow(_61);
_2e.push(_61);
};
function popGroup(){
_2e.pop();
};
function logFormatted(_62,_63){
var _64=[];
var _65=_62[0];
var _66=0;
if(typeof (_65)!="string"){
_65="";
_66=-1;
}
var _67=parseFormat(_65);
for(var i=0;i<_67.length;++i){
var _69=_67[i];
if(_69&&typeof _69=="object"){
_69.appender(_62[++_66],_64);
}else{
appendText(_69,_64);
}
}
var ids=[];
var obs=[];
for(i=_66+1;i<_62.length;++i){
appendText(" ",_64);
var _6c=_62[i];
if(_6c===undefined||_6c===null){
appendNull(_6c,_64);
}else{
if(typeof (_6c)=="string"){
appendText(_6c,_64);
}else{
if(_6c instanceof Date){
appendText(_6c.toString(),_64);
}else{
if(_6c.nodeType==9){
appendText("[ XmlDoc ]",_64);
}else{
var id="_a"+_28++;
ids.push(id);
obs.push(_6c);
var str="<a id=\""+id+"\" href=\"javascript:void(0);\">"+getObjectAbbr(_6c)+"</a>";
appendLink(str,_64);
}
}
}
}
}
logRow(_64,_63);
for(i=0;i<ids.length;i++){
var btn=_26.getElementById(ids[i]);
if(!btn){
continue;
}
btn.obj=obs[i];
_27.console._connects.push(dojo.connect(btn,"onclick",function(){
console.openObjectInspector();
try{
printObject(this.obj);
}
catch(e){
this.obj=e;
}
_21.innerHTML="<pre>"+printObject(this.obj)+"</pre>";
}));
}
};
function parseFormat(_70){
var _71=[];
var reg=/((^%|[^\\]%)(\d+)?(\.)([a-zA-Z]))|((^%|[^\\]%)([a-zA-Z]))/;
var _73={s:appendText,d:appendInteger,i:appendInteger,f:appendFloat};
for(var m=reg.exec(_70);m;m=reg.exec(_70)){
var _75=m[8]?m[8]:m[5];
var _76=_75 in _73?_73[_75]:appendObject;
var _77=m[3]?parseInt(m[3]):(m[4]=="."?-1:0);
_71.push(_70.substr(0,m[0][0]=="%"?m.index:m.index+1));
_71.push({appender:_76,precision:_77});
_70=_70.substr(m.index+m[0].length);
}
_71.push(_70);
return _71;
};
function escapeHTML(_78){
function replaceChars(ch){
switch(ch){
case "<":
return "&lt;";
case ">":
return "&gt;";
case "&":
return "&amp;";
case "'":
return "&#39;";
case "\"":
return "&quot;";
}
return "?";
};
return String(_78).replace(/[<>&"']/g,replaceChars);
};
function objectToString(_7a){
try{
return _7a+"";
}
catch(e){
return null;
}
};
function appendLink(_7b,_7c){
_7c.push(objectToString(_7b));
};
function appendText(_7d,_7e){
_7e.push(escapeHTML(objectToString(_7d)));
};
function appendNull(_7f,_80){
_80.push("<span class=\"objectBox-null\">",escapeHTML(objectToString(_7f)),"</span>");
};
function appendString(_81,_82){
_82.push("<span class=\"objectBox-string\">&quot;",escapeHTML(objectToString(_81)),"&quot;</span>");
};
function appendInteger(_83,_84){
_84.push("<span class=\"objectBox-number\">",escapeHTML(objectToString(_83)),"</span>");
};
function appendFloat(_85,_86){
_86.push("<span class=\"objectBox-number\">",escapeHTML(objectToString(_85)),"</span>");
};
function appendFunction(_87,_88){
_88.push("<span class=\"objectBox-function\">",getObjectAbbr(_87),"</span>");
};
function appendObject(_89,_8a){
try{
if(_89===undefined){
appendNull("undefined",_8a);
}else{
if(_89===null){
appendNull("null",_8a);
}else{
if(typeof _89=="string"){
appendString(_89,_8a);
}else{
if(typeof _89=="number"){
appendInteger(_89,_8a);
}else{
if(typeof _89=="function"){
appendFunction(_89,_8a);
}else{
if(_89.nodeType==1){
appendSelector(_89,_8a);
}else{
if(typeof _89=="object"){
appendObjectFormatted(_89,_8a);
}else{
appendText(_89,_8a);
}
}
}
}
}
}
}
}
catch(e){
}
};
function appendObjectFormatted(_8b,_8c){
var _8d=objectToString(_8b);
var _8e=/\[object (.*?)\]/;
var m=_8e.exec(_8d);
_8c.push("<span class=\"objectBox-object\">",m?m[1]:_8d,"</span>");
};
function appendSelector(_90,_91){
_91.push("<span class=\"objectBox-selector\">");
_91.push("<span class=\"selectorTag\">",escapeHTML(_90.nodeName.toLowerCase()),"</span>");
if(_90.id){
_91.push("<span class=\"selectorId\">#",escapeHTML(_90.id),"</span>");
}
if(_90.className){
_91.push("<span class=\"selectorClass\">.",escapeHTML(_90.className),"</span>");
}
_91.push("</span>");
};
function appendNode(_92,_93){
if(_92.nodeType==1){
_93.push("<div class=\"objectBox-element\">","&lt;<span class=\"nodeTag\">",_92.nodeName.toLowerCase(),"</span>");
for(var i=0;i<_92.attributes.length;++i){
var _95=_92.attributes[i];
if(!_95.specified){
continue;
}
_93.push("&nbsp;<span class=\"nodeName\">",_95.nodeName.toLowerCase(),"</span>=&quot;<span class=\"nodeValue\">",escapeHTML(_95.nodeValue),"</span>&quot;");
}
if(_92.firstChild){
_93.push("&gt;</div><div class=\"nodeChildren\">");
for(var _96=_92.firstChild;_96;_96=_96.nextSibling){
appendNode(_96,_93);
}
_93.push("</div><div class=\"objectBox-element\">&lt;/<span class=\"nodeTag\">",_92.nodeName.toLowerCase(),"&gt;</span></div>");
}else{
_93.push("/&gt;</div>");
}
}else{
if(_92.nodeType==3){
_93.push("<div class=\"nodeText\">",escapeHTML(_92.nodeValue),"</div>");
}
}
};
function addEvent(_97,_98,_99){
if(document.all){
_97.attachEvent("on"+_98,_99);
}else{
_97.addEventListener(_98,_99,false);
}
};
function removeEvent(_9a,_9b,_9c){
if(document.all){
_9a.detachEvent("on"+_9b,_9c);
}else{
_9a.removeEventListener(_9b,_9c,false);
}
};
function cancelEvent(_9d){
if(document.all){
_9d.cancelBubble=true;
}else{
_9d.stopPropagation();
}
};
function onError(msg,_9f,_a0){
var _a1=_9f.lastIndexOf("/");
var _a2=_a1==-1?_9f:_9f.substr(_a1+1);
var _a3=["<span class=\"errorMessage\">",msg,"</span>","<div class=\"objectBox-sourceLink\">",_a2," (line ",_a0,")</div>"];
logRow(_a3,"error");
};
var _a4=new Date().getTime();
function onKeyDown(_a5){
var _a6=(new Date()).getTime();
if(_a6>_a4+200){
_a5=dojo.fixEvent(_a5);
var _a7=dojo.keys;
var ekc=_a5.keyCode;
_a4=_a6;
if(ekc==_a7.F12){
toggleConsole();
}else{
if((ekc==_a7.NUMPAD_ENTER||ekc==76)&&_a5.shiftKey&&(_a5.metaKey||_a5.ctrlKey)){
focusCommandLine();
}else{
return;
}
}
cancelEvent(_a5);
}
};
function onCommandLineKeyDown(e){
var dk=dojo.keys;
if(e.keyCode==13&&_2b.value){
addToHistory(_2b.value);
evalCommandLine();
}else{
if(e.keyCode==27){
_2b.value="";
}else{
if(e.keyCode==dk.UP_ARROW||e.charCode==dk.UP_ARROW){
navigateHistory("older");
}else{
if(e.keyCode==dk.DOWN_ARROW||e.charCode==dk.DOWN_ARROW){
navigateHistory("newer");
}else{
if(e.keyCode==dk.HOME||e.charCode==dk.HOME){
_ab=1;
navigateHistory("older");
}else{
if(e.keyCode==dk.END||e.charCode==dk.END){
_ab=999999;
navigateHistory("newer");
}
}
}
}
}
}
};
var _ab=-1;
var _ac=null;
function addToHistory(_ad){
var _ae=cookie("firebug_history");
_ae=(_ae)?dojo.fromJson(_ae):[];
var pos=dojo.indexOf(_ae,_ad);
if(pos!=-1){
_ae.splice(pos,1);
}
_ae.push(_ad);
cookie("firebug_history",dojo.toJson(_ae),30);
while(_ae.length&&!cookie("firebug_history")){
_ae.shift();
cookie("firebug_history",dojo.toJson(_ae),30);
}
_ac=null;
_ab=-1;
};
function navigateHistory(_b0){
var _b1=cookie("firebug_history");
_b1=(_b1)?dojo.fromJson(_b1):[];
if(!_b1.length){
return;
}
if(_ac===null){
_ac=_2b.value;
}
if(_ab==-1){
_ab=_b1.length;
}
if(_b0=="older"){
--_ab;
if(_ab<0){
_ab=0;
}
}else{
if(_b0=="newer"){
++_ab;
if(_ab>_b1.length){
_ab=_b1.length;
}
}
}
if(_ab==_b1.length){
_2b.value=_ac;
_ac=null;
}else{
_2b.value=_b1[_ab];
}
};
function cookie(_b2,_b3){
var c=document.cookie;
if(arguments.length==1){
var _b5=c.match(new RegExp("(?:^|; )"+_b2+"=([^;]*)"));
return _b5?decodeURIComponent(_b5[1]):undefined;
}else{
var d=new Date();
d.setMonth(d.getMonth()+1);
document.cookie=_b2+"="+encodeURIComponent(_b3)+((d.toUtcString)?"; expires="+d.toUTCString():"");
}
};
function isArray(it){
return it&&it instanceof Array||typeof it=="array";
};
function objectLength(o){
var cnt=0;
for(var nm in o){
cnt++;
}
return cnt;
};
function printObject(o,i,txt,_be){
var ind=" \t";
txt=txt||"";
i=i||ind;
_be=_be||[];
var _c0;
if(o&&o.nodeType==1){
var _c1=[];
appendNode(o,_c1);
return _c1.join("");
}
var br=",\n",cnt=0,_c4=objectLength(o);
if(o instanceof Date){
return i+o.toString()+br;
}
looking:
for(var nm in o){
cnt++;
if(cnt==_c4){
br="\n";
}
if(o[nm]===window||o[nm]===document){
continue;
}else{
if(o[nm]===null){
txt+=i+nm+" : NULL"+br;
}else{
if(o[nm]&&o[nm].nodeType){
if(o[nm].nodeType==1){
}else{
if(o[nm].nodeType==3){
txt+=i+nm+" : [ TextNode "+o[nm].data+" ]"+br;
}
}
}else{
if(typeof o[nm]=="object"&&(o[nm] instanceof String||o[nm] instanceof Number||o[nm] instanceof Boolean)){
txt+=i+nm+" : "+o[nm]+","+br;
}else{
if(o[nm] instanceof Date){
txt+=i+nm+" : "+o[nm].toString()+br;
}else{
if(typeof (o[nm])=="object"&&o[nm]){
for(var j=0,_c7;_c7=_be[j];j++){
if(o[nm]===_c7){
txt+=i+nm+" : RECURSION"+br;
continue looking;
}
}
_be.push(o[nm]);
_c0=(isArray(o[nm]))?["[","]"]:["{","}"];
txt+=i+nm+" : "+_c0[0]+"\n";
txt+=printObject(o[nm],i+ind,"",_be);
txt+=i+_c0[1]+br;
}else{
if(typeof o[nm]=="undefined"){
txt+=i+nm+" : undefined"+br;
}else{
if(nm=="toString"&&typeof o[nm]=="function"){
var _c8=o[nm]();
if(typeof _c8=="string"&&_c8.match(/function ?(.*?)\(/)){
_c8=escapeHTML(getObjectAbbr(o[nm]));
}
txt+=i+nm+" : "+_c8+br;
}else{
txt+=i+nm+" : "+escapeHTML(getObjectAbbr(o[nm]))+br;
}
}
}
}
}
}
}
}
}
return txt;
};
function getObjectAbbr(obj){
var _ca=(obj instanceof Error);
if(obj.nodeType==1||obj.nodeType==3){
return escapeHTML("< "+obj.tagName.toLowerCase()+" id=\""+obj.id+"\" />");
}
var nm=(obj&&(obj.id||obj.name||obj.ObjectID||obj.widgetId));
if(!_ca&&nm){
return "{"+nm+"}";
}
var _cc=2;
var _cd=4;
var cnt=0;
if(_ca){
nm="[ Error: "+(obj.message||obj.description||obj)+" ]";
}else{
if(isArray(obj)){
nm="["+obj.slice(0,_cd).join(",");
if(obj.length>_cd){
nm+=" ... ("+obj.length+" items)";
}
nm+="]";
}else{
if(typeof obj=="function"){
nm=obj+"";
var reg=/function\s*([^\(]*)(\([^\)]*\))[^\{]*\{/;
var m=reg.exec(nm);
if(m){
if(!m[1]){
m[1]="function";
}
nm=m[1]+m[2];
}else{
nm="function()";
}
}else{
if(typeof obj!="object"||typeof obj=="string"){
nm=obj+"";
}else{
nm="{";
for(var i in obj){
cnt++;
if(cnt>_cc){
break;
}
nm+=i+":"+escapeHTML(obj[i])+"  ";
}
nm+="}";
}
}
}
}
return nm;
};
window.onerror=onError;
addEvent(document,dojo.isIE||dojo.isSafari?"keydown":"keypress",onKeyDown);
if((document.documentElement.getAttribute("debug")=="true")||(dojo.config.isDebug)){
toggleConsole(true);
}
if(dojo.config.noFirebugLite){
console.warn("DEPRECATED: dojo.config.noFirebugLite - use djConfig.isDebug=false instead");
}
if(dojo.isFF&&!window.loadFirebugConsole&&!dojo.config.allowFirebugLite){

}
})();
}
}
