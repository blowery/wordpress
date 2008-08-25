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

if(!dojo._hasResource["dojo.fx"]){
dojo._hasResource["dojo.fx"]=true;
dojo.provide("dojo.fx");
dojo.provide("dojo.fx.Toggler");
(function(){
var _1={_fire:function(_2,_3){
if(this[_2]){
this[_2].apply(this,_3||[]);
}
return this;
}};
var _4=function(_5){
this._index=-1;
this._animations=_5||[];
this._current=this._onAnimateCtx=this._onEndCtx=null;
this.duration=0;
dojo.forEach(this._animations,function(a){
this.duration+=a.duration;
if(a.delay){
this.duration+=a.delay;
}
},this);
};
dojo.extend(_4,{_onAnimate:function(){
this._fire("onAnimate",arguments);
},_onEnd:function(){
dojo.disconnect(this._onAnimateCtx);
dojo.disconnect(this._onEndCtx);
this._onAnimateCtx=this._onEndCtx=null;
if(this._index+1==this._animations.length){
this._fire("onEnd");
}else{
this._current=this._animations[++this._index];
this._onAnimateCtx=dojo.connect(this._current,"onAnimate",this,"_onAnimate");
this._onEndCtx=dojo.connect(this._current,"onEnd",this,"_onEnd");
this._current.play(0,true);
}
},play:function(_7,_8){
if(!this._current){
this._current=this._animations[this._index=0];
}
if(!_8&&this._current.status()=="playing"){
return this;
}
var _9=dojo.connect(this._current,"beforeBegin",this,function(){
this._fire("beforeBegin");
}),_a=dojo.connect(this._current,"onBegin",this,function(_b){
this._fire("onBegin",arguments);
}),_c=dojo.connect(this._current,"onPlay",this,function(_d){
this._fire("onPlay",arguments);
dojo.disconnect(_9);
dojo.disconnect(_a);
dojo.disconnect(_c);
});
if(this._onAnimateCtx){
dojo.disconnect(this._onAnimateCtx);
}
this._onAnimateCtx=dojo.connect(this._current,"onAnimate",this,"_onAnimate");
if(this._onEndCtx){
dojo.disconnect(this._onEndCtx);
}
this._onEndCtx=dojo.connect(this._current,"onEnd",this,"_onEnd");
this._current.play.apply(this._current,arguments);
return this;
},pause:function(){
if(this._current){
var e=dojo.connect(this._current,"onPause",this,function(_f){
this._fire("onPause",arguments);
dojo.disconnect(e);
});
this._current.pause();
}
return this;
},gotoPercent:function(_10,_11){
this.pause();
var _12=this.duration*_10;
this._current=null;
dojo.some(this._animations,function(a){
if(a.duration<=_12){
this._current=a;
return true;
}
_12-=a.duration;
return false;
});
if(this._current){
this._current.gotoPercent(_12/this._current.duration,_11);
}
return this;
},stop:function(_14){
if(this._current){
if(_14){
for(;this._index+1<this._animations.length;++this._index){
this._animations[this._index].stop(true);
}
this._current=this._animations[this._index];
}
var e=dojo.connect(this._current,"onStop",this,function(arg){
this._fire("onStop",arguments);
dojo.disconnect(e);
});
this._current.stop();
}
return this;
},status:function(){
return this._current?this._current.status():"stopped";
},destroy:function(){
if(this._onAnimateCtx){
dojo.disconnect(this._onAnimateCtx);
}
if(this._onEndCtx){
dojo.disconnect(this._onEndCtx);
}
}});
dojo.extend(_4,_1);
dojo.fx.chain=function(_17){
return new _4(_17);
};
var _18=function(_19){
this._animations=_19||[];
this._connects=[];
this._finished=0;
this.duration=0;
dojo.forEach(_19,function(a){
var _1b=a.duration;
if(a.delay){
_1b+=a.delay;
}
if(this.duration<_1b){
this.duration=_1b;
}
this._connects.push(dojo.connect(a,"onEnd",this,"_onEnd"));
},this);
this._pseudoAnimation=new dojo._Animation({curve:[0,1],duration:this.duration});
dojo.forEach(["beforeBegin","onBegin","onPlay","onAnimate","onPause","onStop"],function(evt){
this._connects.push(dojo.connect(this._pseudoAnimation,evt,dojo.hitch(this,"_fire",evt)));
},this);
};
dojo.extend(_18,{_doAction:function(_1d,_1e){
dojo.forEach(this._animations,function(a){
a[_1d].apply(a,_1e);
});
return this;
},_onEnd:function(){
if(++this._finished==this._animations.length){
this._fire("onEnd");
}
},_call:function(_20,_21){
var t=this._pseudoAnimation;
t[_20].apply(t,_21);
},play:function(_23,_24){
this._finished=0;
this._doAction("play",arguments);
this._call("play",arguments);
return this;
},pause:function(){
this._doAction("pause",arguments);
this._call("pause",arguments);
return this;
},gotoPercent:function(_25,_26){
var ms=this.duration*_25;
dojo.forEach(this._animations,function(a){
a.gotoPercent(a.duration<ms?1:(ms/a.duration),_26);
});
this._call("gotoPercent",arguments);
return this;
},stop:function(_29){
this._doAction("stop",arguments);
this._call("stop",arguments);
return this;
},status:function(){
return this._pseudoAnimation.status();
},destroy:function(){
dojo.forEach(this._connects,dojo.disconnect);
}});
dojo.extend(_18,_1);
dojo.fx.combine=function(_2a){
return new _18(_2a);
};
})();
dojo.declare("dojo.fx.Toggler",null,{constructor:function(_2b){
var _t=this;
dojo.mixin(_t,_2b);
_t.node=_2b.node;
_t._showArgs=dojo.mixin({},_2b);
_t._showArgs.node=_t.node;
_t._showArgs.duration=_t.showDuration;
_t.showAnim=_t.showFunc(_t._showArgs);
_t._hideArgs=dojo.mixin({},_2b);
_t._hideArgs.node=_t.node;
_t._hideArgs.duration=_t.hideDuration;
_t.hideAnim=_t.hideFunc(_t._hideArgs);
dojo.connect(_t.showAnim,"beforeBegin",dojo.hitch(_t.hideAnim,"stop",true));
dojo.connect(_t.hideAnim,"beforeBegin",dojo.hitch(_t.showAnim,"stop",true));
},node:null,showFunc:dojo.fadeIn,hideFunc:dojo.fadeOut,showDuration:200,hideDuration:200,show:function(_2d){
return this.showAnim.play(_2d||0);
},hide:function(_2e){
return this.hideAnim.play(_2e||0);
}});
dojo.fx.wipeIn=function(_2f){
_2f.node=dojo.byId(_2f.node);
var _30=_2f.node,s=_30.style,o;
var _33=dojo.animateProperty(dojo.mixin({properties:{height:{start:function(){
o=s.overflow;
s.overflow="hidden";
if(s.visibility=="hidden"||s.display=="none"){
s.height="1px";
s.display="";
s.visibility="";
return 1;
}else{
var _34=dojo.style(_30,"height");
return Math.max(_34,1);
}
},end:function(){
return _30.scrollHeight;
}}}},_2f));
dojo.connect(_33,"onEnd",function(){
s.height="auto";
s.overflow=o;
});
return _33;
};
dojo.fx.wipeOut=function(_35){
var _36=_35.node=dojo.byId(_35.node);
var s=_36.style;
var o;
var _39=dojo.animateProperty(dojo.mixin({properties:{height:{end:1}}},_35));
dojo.connect(_39,"beforeBegin",function(){
o=s.overflow;
s.overflow="hidden";
s.display="";
});
dojo.connect(_39,"onEnd",function(){
s.overflow=o;
s.height="auto";
s.display="none";
});
return _39;
};
dojo.fx.slideTo=function(_3a){
var _3b=(_3a.node=dojo.byId(_3a.node));
var top=null;
var _3d=null;
var _3e=(function(n){
return function(){
var cs=dojo.getComputedStyle(n);
var pos=cs.position;
top=(pos=="absolute"?n.offsetTop:parseInt(cs.top)||0);
_3d=(pos=="absolute"?n.offsetLeft:parseInt(cs.left)||0);
if(pos!="absolute"&&pos!="relative"){
var ret=dojo.coords(n,true);
top=ret.y;
_3d=ret.x;
n.style.position="absolute";
n.style.top=top+"px";
n.style.left=_3d+"px";
}
};
})(_3b);
_3e();
var _43=dojo.animateProperty(dojo.mixin({properties:{top:{end:_3a.top||0},left:{end:_3a.left||0}}},_3a));
dojo.connect(_43,"beforeBegin",_43,_3e);
return _43;
};
}
if(!dojo._hasResource["dojox.gfx.matrix"]){
dojo._hasResource["dojox.gfx.matrix"]=true;
dojo.provide("dojox.gfx.matrix");
(function(){
var m=dojox.gfx.matrix;
m._degToRad=function(_45){
return Math.PI*_45/180;
};
m._radToDeg=function(_46){
return _46/Math.PI*180;
};
m.Matrix2D=function(arg){
if(arg){
if(typeof arg=="number"){
this.xx=this.yy=arg;
}else{
if(arg instanceof Array){
if(arg.length>0){
var _48=m.normalize(arg[0]);
for(var i=1;i<arg.length;++i){
var l=_48,r=dojox.gfx.matrix.normalize(arg[i]);
_48=new m.Matrix2D();
_48.xx=l.xx*r.xx+l.xy*r.yx;
_48.xy=l.xx*r.xy+l.xy*r.yy;
_48.yx=l.yx*r.xx+l.yy*r.yx;
_48.yy=l.yx*r.xy+l.yy*r.yy;
_48.dx=l.xx*r.dx+l.xy*r.dy+l.dx;
_48.dy=l.yx*r.dx+l.yy*r.dy+l.dy;
}
dojo.mixin(this,_48);
}
}else{
dojo.mixin(this,arg);
}
}
}
};
dojo.extend(m.Matrix2D,{xx:1,xy:0,yx:0,yy:1,dx:0,dy:0});
dojo.mixin(m,{identity:new m.Matrix2D(),flipX:new m.Matrix2D({xx:-1}),flipY:new m.Matrix2D({yy:-1}),flipXY:new m.Matrix2D({xx:-1,yy:-1}),translate:function(a,b){
if(arguments.length>1){
return new m.Matrix2D({dx:a,dy:b});
}
return new m.Matrix2D({dx:a.x,dy:a.y});
},scale:function(a,b){
if(arguments.length>1){
return new m.Matrix2D({xx:a,yy:b});
}
if(typeof a=="number"){
return new m.Matrix2D({xx:a,yy:a});
}
return new m.Matrix2D({xx:a.x,yy:a.y});
},rotate:function(_50){
var c=Math.cos(_50);
var s=Math.sin(_50);
return new m.Matrix2D({xx:c,xy:-s,yx:s,yy:c});
},rotateg:function(_53){
return m.rotate(m._degToRad(_53));
},skewX:function(_54){
return new m.Matrix2D({xy:Math.tan(_54)});
},skewXg:function(_55){
return m.skewX(m._degToRad(_55));
},skewY:function(_56){
return new m.Matrix2D({yx:Math.tan(_56)});
},skewYg:function(_57){
return m.skewY(m._degToRad(_57));
},reflect:function(a,b){
if(arguments.length==1){
b=a.y;
a=a.x;
}
var a2=a*a,b2=b*b,n2=a2+b2,xy=2*a*b/n2;
return new m.Matrix2D({xx:2*a2/n2-1,xy:xy,yx:xy,yy:2*b2/n2-1});
},project:function(a,b){
if(arguments.length==1){
b=a.y;
a=a.x;
}
var a2=a*a,b2=b*b,n2=a2+b2,xy=a*b/n2;
return new m.Matrix2D({xx:a2/n2,xy:xy,yx:xy,yy:b2/n2});
},normalize:function(_64){
return (_64 instanceof m.Matrix2D)?_64:new m.Matrix2D(_64);
},clone:function(_65){
var obj=new m.Matrix2D();
for(var i in _65){
if(typeof (_65[i])=="number"&&typeof (obj[i])=="number"&&obj[i]!=_65[i]){
obj[i]=_65[i];
}
}
return obj;
},invert:function(_68){
var M=m.normalize(_68),D=M.xx*M.yy-M.xy*M.yx,M=new m.Matrix2D({xx:M.yy/D,xy:-M.xy/D,yx:-M.yx/D,yy:M.xx/D,dx:(M.xy*M.dy-M.yy*M.dx)/D,dy:(M.yx*M.dx-M.xx*M.dy)/D});
return M;
},_multiplyPoint:function(_6b,x,y){
return {x:_6b.xx*x+_6b.xy*y+_6b.dx,y:_6b.yx*x+_6b.yy*y+_6b.dy};
},multiplyPoint:function(_6e,a,b){
var M=m.normalize(_6e);
if(typeof a=="number"&&typeof b=="number"){
return m._multiplyPoint(M,a,b);
}
return m._multiplyPoint(M,a.x,a.y);
},multiply:function(_72){
var M=m.normalize(_72);
for(var i=1;i<arguments.length;++i){
var l=M,r=m.normalize(arguments[i]);
M=new m.Matrix2D();
M.xx=l.xx*r.xx+l.xy*r.yx;
M.xy=l.xx*r.xy+l.xy*r.yy;
M.yx=l.yx*r.xx+l.yy*r.yx;
M.yy=l.yx*r.xy+l.yy*r.yy;
M.dx=l.xx*r.dx+l.xy*r.dy+l.dx;
M.dy=l.yx*r.dx+l.yy*r.dy+l.dy;
}
return M;
},_sandwich:function(_77,x,y){
return m.multiply(m.translate(x,y),_77,m.translate(-x,-y));
},scaleAt:function(a,b,c,d){
switch(arguments.length){
case 4:
return m._sandwich(m.scale(a,b),c,d);
case 3:
if(typeof c=="number"){
return m._sandwich(m.scale(a),b,c);
}
return m._sandwich(m.scale(a,b),c.x,c.y);
}
return m._sandwich(m.scale(a),b.x,b.y);
},rotateAt:function(_7e,a,b){
if(arguments.length>2){
return m._sandwich(m.rotate(_7e),a,b);
}
return m._sandwich(m.rotate(_7e),a.x,a.y);
},rotategAt:function(_81,a,b){
if(arguments.length>2){
return m._sandwich(m.rotateg(_81),a,b);
}
return m._sandwich(m.rotateg(_81),a.x,a.y);
},skewXAt:function(_84,a,b){
if(arguments.length>2){
return m._sandwich(m.skewX(_84),a,b);
}
return m._sandwich(m.skewX(_84),a.x,a.y);
},skewXgAt:function(_87,a,b){
if(arguments.length>2){
return m._sandwich(m.skewXg(_87),a,b);
}
return m._sandwich(m.skewXg(_87),a.x,a.y);
},skewYAt:function(_8a,a,b){
if(arguments.length>2){
return m._sandwich(m.skewY(_8a),a,b);
}
return m._sandwich(m.skewY(_8a),a.x,a.y);
},skewYgAt:function(_8d,a,b){
if(arguments.length>2){
return m._sandwich(m.skewYg(_8d),a,b);
}
return m._sandwich(m.skewYg(_8d),a.x,a.y);
}});
})();
dojox.gfx.Matrix2D=dojox.gfx.matrix.Matrix2D;
}
if(!dojo._hasResource["dojox.gfx._base"]){
dojo._hasResource["dojox.gfx._base"]=true;
dojo.provide("dojox.gfx._base");
(function(){
var g=dojox.gfx,b=g._base;
g._hasClass=function(_92,_93){
return ((" "+_92.getAttribute("className")+" ").indexOf(" "+_93+" ")>=0);
};
g._addClass=function(_94,_95){
var cls=_94.getAttribute("className");
if((" "+cls+" ").indexOf(" "+_95+" ")<0){
_94.setAttribute("className",cls+(cls?" ":"")+_95);
}
};
g._removeClass=function(_97,_98){
_97.setAttribute("className",_97.getAttribute("className").replace(new RegExp("(^|\\s+)"+_98+"(\\s+|$)"),"$1$2"));
};
b._getFontMeasurements=function(){
var _99={"1em":0,"1ex":0,"100%":0,"12pt":0,"16px":0,"xx-small":0,"x-small":0,"small":0,"medium":0,"large":0,"x-large":0,"xx-large":0};
if(dojo.isIE){
dojo.doc.documentElement.style.fontSize="100%";
}
var div=dojo.doc.createElement("div");
div.style.position="absolute";
div.style.left="-100px";
div.style.top="0";
div.style.width="30px";
div.style.height="1000em";
div.style.border="0";
div.style.margin="0";
div.style.padding="0";
div.style.outline="0";
div.style.lineHeight="1";
div.style.overflow="hidden";
dojo.body().appendChild(div);
for(var p in _99){
div.style.fontSize=p;
_99[p]=Math.round(div.offsetHeight*12/16)*16/12/1000;
}
dojo.body().removeChild(div);
div=null;
return _99;
};
var _9c=null;
b._getCachedFontMeasurements=function(_9d){
if(_9d||!_9c){
_9c=b._getFontMeasurements();
}
return _9c;
};
var _9e=null,_9f={};
b._getTextBox=function(_a0,_a1,_a2){
var m;
if(!_9e){
m=_9e=dojo.doc.createElement("div");
m.style.position="absolute";
m.style.left="-10000px";
m.style.top="0";
dojo.body().appendChild(m);
}else{
m=_9e;
}
m.className="";
m.style.border="0";
m.style.margin="0";
m.style.padding="0";
m.style.outline="0";
if(arguments.length>1&&_a1){
for(var i in _a1){
if(i in _9f){
continue;
}
m.style[i]=_a1[i];
}
}
if(arguments.length>2&&_a2){
m.className=_a2;
}
m.innerHTML=_a0;
return dojo.marginBox(m);
};
var _a5=0;
b._getUniqueId=function(){
var id;
do{
id=dojo._scopeName+"Unique"+(++_a5);
}while(dojo.byId(id));
return id;
};
})();
dojo.mixin(dojox.gfx,{defaultPath:{type:"path",path:""},defaultPolyline:{type:"polyline",points:[]},defaultRect:{type:"rect",x:0,y:0,width:100,height:100,r:0},defaultEllipse:{type:"ellipse",cx:0,cy:0,rx:200,ry:100},defaultCircle:{type:"circle",cx:0,cy:0,r:100},defaultLine:{type:"line",x1:0,y1:0,x2:100,y2:100},defaultImage:{type:"image",x:0,y:0,width:0,height:0,src:""},defaultText:{type:"text",x:0,y:0,text:"",align:"start",decoration:"none",rotated:false,kerning:true},defaultTextPath:{type:"textpath",text:"",align:"start",decoration:"none",rotated:false,kerning:true},defaultStroke:{type:"stroke",color:"black",style:"solid",width:1,cap:"butt",join:4},defaultLinearGradient:{type:"linear",x1:0,y1:0,x2:100,y2:100,colors:[{offset:0,color:"black"},{offset:1,color:"white"}]},defaultRadialGradient:{type:"radial",cx:0,cy:0,r:100,colors:[{offset:0,color:"black"},{offset:1,color:"white"}]},defaultPattern:{type:"pattern",x:0,y:0,width:0,height:0,src:""},defaultFont:{type:"font",style:"normal",variant:"normal",weight:"normal",size:"10pt",family:"serif"},normalizeColor:function(_a7){
return (_a7 instanceof dojo.Color)?_a7:new dojo.Color(_a7);
},normalizeParameters:function(_a8,_a9){
if(_a9){
var _aa={};
for(var x in _a8){
if(x in _a9&&!(x in _aa)){
_a8[x]=_a9[x];
}
}
}
return _a8;
},makeParameters:function(_ac,_ad){
if(!_ad){
return dojo.clone(_ac);
}
var _ae={};
for(var i in _ac){
if(!(i in _ae)){
_ae[i]=dojo.clone((i in _ad)?_ad[i]:_ac[i]);
}
}
return _ae;
},formatNumber:function(x,_b1){
var val=x.toString();
if(val.indexOf("e")>=0){
val=x.toFixed(4);
}else{
var _b3=val.indexOf(".");
if(_b3>=0&&val.length-_b3>5){
val=x.toFixed(4);
}
}
if(x<0){
return val;
}
return _b1?" "+val:val;
},makeFontString:function(_b4){
return _b4.style+" "+_b4.variant+" "+_b4.weight+" "+_b4.size+" "+_b4.family;
},splitFontString:function(str){
var _b6=dojo.clone(dojox.gfx.defaultFont);
var t=str.split(/\s+/);
do{
if(t.length<5){
break;
}
_b6.style=t[0];
_b6.varian=t[1];
_b6.weight=t[2];
var i=t[3].indexOf("/");
_b6.size=i<0?t[3]:t[3].substring(0,i);
var j=4;
if(i<0){
if(t[4]=="/"){
j=6;
break;
}
if(t[4].substr(0,1)=="/"){
j=5;
break;
}
}
if(j+3>t.length){
break;
}
_b6.size=t[j];
_b6.family=t[j+1];
}while(false);
return _b6;
},cm_in_pt:72/2.54,mm_in_pt:7.2/2.54,px_in_pt:function(){
return dojox.gfx._base._getCachedFontMeasurements()["12pt"]/12;
},pt2px:function(len){
return len*dojox.gfx.px_in_pt();
},px2pt:function(len){
return len/dojox.gfx.px_in_pt();
},normalizedLength:function(len){
if(len.length==0){
return 0;
}
if(len.length>2){
var _bd=dojox.gfx.px_in_pt();
var val=parseFloat(len);
switch(len.slice(-2)){
case "px":
return val;
case "pt":
return val*_bd;
case "in":
return val*72*_bd;
case "pc":
return val*12*_bd;
case "mm":
return val*dojox.gfx.mm_in_pt*_bd;
case "cm":
return val*dojox.gfx.cm_in_pt*_bd;
}
}
return parseFloat(len);
},pathVmlRegExp:/([A-Za-z]+)|(\d+(\.\d+)?)|(\.\d+)|(-\d+(\.\d+)?)|(-\.\d+)/g,pathSvgRegExp:/([A-Za-z])|(\d+(\.\d+)?)|(\.\d+)|(-\d+(\.\d+)?)|(-\.\d+)/g,equalSources:function(a,b){
return a&&b&&a==b;
}});
}
if(!dojo._hasResource["dojox.gfx"]){
dojo._hasResource["dojox.gfx"]=true;
dojo.provide("dojox.gfx");
dojo.loadInit(function(){
var gfx=dojo.getObject("dojox.gfx",true),sl,_c3;
if(!gfx.renderer){
var _c4=(typeof dojo.config["gfxRenderer"]=="string"?dojo.config["gfxRenderer"]:"svg,vml,silverlight,canvas").split(",");
for(var i=0;i<_c4.length;++i){
switch(_c4[i]){
case "svg":
if(!dojo.isIE&&(navigator.userAgent.indexOf("iPhone")<0)&&(navigator.userAgent.indexOf("iPod")<0)){
dojox.gfx.renderer="svg";
}
break;
case "vml":
if(dojo.isIE){
dojox.gfx.renderer="vml";
}
break;
case "silverlight":
try{
if(dojo.isIE){
sl=new ActiveXObject("AgControl.AgControl");
if(sl&&sl.IsVersionSupported("1.0")){
_c3=true;
}
}else{
if(navigator.plugins["Silverlight Plug-In"]){
_c3=true;
}
}
}
catch(e){
_c3=false;
}
finally{
sl=null;
}
if(_c3){
dojox.gfx.renderer="silverlight";
}
break;
case "canvas":
if(!dojo.isIE){
dojox.gfx.renderer="canvas";
}
break;
}
if(dojox.gfx.renderer){
break;
}
}
}
});
dojo.requireIf(dojox.gfx.renderer=="svg","dojox.gfx.svg");
dojo.requireIf(dojox.gfx.renderer=="vml","dojox.gfx.vml");
dojo.requireIf(dojox.gfx.renderer=="silverlight","dojox.gfx.silverlight");
dojo.requireIf(dojox.gfx.renderer=="canvas","dojox.gfx.canvas");
}
if(!dojo._hasResource["dojox.lang.functional.lambda"]){
dojo._hasResource["dojox.lang.functional.lambda"]=true;
dojo.provide("dojox.lang.functional.lambda");
(function(){
var df=dojox.lang.functional;
var _c7="ab".split(/a*/).length>1?String.prototype.split:function(sep){
var r=this.split.call(this,sep),m=sep.exec(this);
if(m&&m.index==0){
r.unshift("");
}
return r;
};
var _cb=function(s){
var _cd=[],_ce=_c7.call(s,/\s*->\s*/m);
if(_ce.length>1){
while(_ce.length){
s=_ce.pop();
_cd=_ce.pop().split(/\s*,\s*|\s+/m);
if(_ce.length){
_ce.push("(function("+_cd+"){return ("+s+")})");
}
}
}else{
if(s.match(/\b_\b/)){
_cd=["_"];
}else{
var l=s.match(/^\s*(?:[+*\/%&|\^\.=<>]|!=)/m),r=s.match(/[+\-*\/%&|\^\.=<>!]\s*$/m);
if(l||r){
if(l){
_cd.push("$1");
s="$1"+s;
}
if(r){
_cd.push("$2");
s=s+"$2";
}
}else{
var _d1=s.replace(/(?:\b[A-Z]|\.[a-zA-Z_$])[a-zA-Z_$\d]*|[a-zA-Z_$][a-zA-Z_$\d]*:|this|true|false|null|undefined|typeof|instanceof|in|delete|new|void|arguments|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|escape|eval|isFinite|isNaN|parseFloat|parseInt|unescape|dojo|dijit|dojox|window|document|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g,"").match(/([a-z_$][a-z_$\d]*)/gi)||[];
var t={};
dojo.forEach(_d1,function(v){
if(!(v in t)){
_cd.push(v);
t[v]=1;
}
});
}
}
}
return {args:_cd,body:s};
};
var _d4=function(a){
return a.length?function(){
var i=a.length-1,x=df.lambda(a[i]).apply(this,arguments);
for(--i;i>=0;--i){
x=df.lambda(a[i]).call(this,x);
}
return x;
}:function(x){
return x;
};
};
dojo.mixin(df,{rawLambda:function(s){
return _cb(s);
},buildLambda:function(s){
s=_cb(s);
return "function("+s.args.join(",")+"){return ("+s.body+");}";
},lambda:function(s){
if(typeof s=="function"){
return s;
}
if(s instanceof Array){
return _d4(s);
}
s=_cb(s);
return new Function(s.args,"return ("+s.body+");");
}});
})();
}
if(!dojo._hasResource["dojox.lang.functional.array"]){
dojo._hasResource["dojox.lang.functional.array"]=true;
dojo.provide("dojox.lang.functional.array");
(function(){
var d=dojo,df=dojox.lang.functional,_de={};
d.mixin(df,{filter:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
var t=[],v;
if(d.isArray(a)){
for(var i=0,n=a.length;i<n;++i){
v=a[i];
if(f.call(o,v,i,a)){
t.push(v);
}
}
}else{
for(var i=0;a.hasNext();){
v=a.next();
if(f.call(o,v,i++,a)){
t.push(v);
}
}
}
return t;
},forEach:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
if(d.isArray(a)){
for(var i=0,n=a.length;i<n;f.call(o,a[i],i,a),++i){
}
}else{
if(typeof a.hasNext=="function"&&typeof a.next=="function"){
for(var i=0;a.hasNext();f.call(o,a.next(),i++,a)){
}
}else{
for(var i in a){
if(i in _de){
continue;
}
f.call(o,a[i],i,a);
}
}
}
return o;
},map:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
var t,n;
if(d.isArray(a)){
t=new Array(n=a.length);
for(var i=0;i<n;t[i]=f.call(o,a[i],i,a),++i){
}
}else{
t=[];
for(var i=0;a.hasNext();t.push(f.call(o,a.next(),i++,a))){
}
}
return t;
},every:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
if(d.isArray(a)){
for(var i=0,n=a.length;i<n;++i){
if(!f.call(o,a[i],i,a)){
return false;
}
}
}else{
if(typeof a.hasNext=="function"&&typeof a.next=="function"){
for(var i=0;a.hasNext();){
if(!f.call(o,a.next(),i++,a)){
return false;
}
}
}else{
for(var i in a){
if(i in _de){
continue;
}
if(!f.call(o,a[i],i,a)){
return false;
}
}
}
}
return true;
},some:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
if(d.isArray(a)){
for(var i=0,n=a.length;i<n;++i){
if(f.call(o,a[i],i,a)){
return true;
}
}
}else{
if(typeof a.hasNext=="function"&&typeof a.next=="function"){
for(var i=0;a.hasNext();){
if(f.call(o,a.next(),i++,a)){
return true;
}
}
}else{
for(var i in a){
if(i in _de){
continue;
}
if(f.call(o,a[i],i,a)){
return true;
}
}
}
}
return false;
}});
})();
}
if(!dojo._hasResource["dojox.lang.functional.object"]){
dojo._hasResource["dojox.lang.functional.object"]=true;
dojo.provide("dojox.lang.functional.object");
(function(){
var d=dojo,df=dojox.lang.functional,_fd={};
d.mixin(df,{keys:function(obj){
var t=[];
for(var i in obj){
if(i in _fd){
continue;
}
t.push(i);
}
return t;
},values:function(obj){
var t=[];
for(var i in obj){
if(i in _fd){
continue;
}
t.push(obj[i]);
}
return t;
},filterIn:function(obj,f,o){
o=o||d.global;
f=df.lambda(f);
var t={},v;
for(var i in obj){
if(i in _fd){
continue;
}
v=obj[i];
if(f.call(o,v,i,obj)){
t[i]=v;
}
}
return t;
},forIn:function(obj,f,o){
o=o||d.global;
f=df.lambda(f);
for(var i in obj){
if(i in _fd){
continue;
}
f.call(o,obj[i],i,obj);
}
return o;
},mapIn:function(obj,f,o){
o=o||d.global;
f=df.lambda(f);
var t={};
for(var i in obj){
if(i in _fd){
continue;
}
t[i]=f.call(o,obj[i],i,obj);
}
return t;
}});
})();
}
if(!dojo._hasResource["dojox.lang.functional"]){
dojo._hasResource["dojox.lang.functional"]=true;
dojo.provide("dojox.lang.functional");
}
if(!dojo._hasResource["dojox.lang.functional.fold"]){
dojo._hasResource["dojox.lang.functional.fold"]=true;
dojo.provide("dojox.lang.functional.fold");
(function(){
var d=dojo,df=dojox.lang.functional,_115={};
d.mixin(df,{foldl:function(a,f,z,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
if(d.isArray(a)){
for(var i=0,n=a.length;i<n;z=f.call(o,z,a[i],i,a),++i){
}
}else{
if(typeof a.hasNext=="function"&&typeof a.next=="function"){
for(var i=0;a.hasNext();z=f.call(o,z,a.next(),i++,a)){
}
}else{
for(var i in a){
if(i in _115){
continue;
}
z=f.call(o,z,a[i],i,a);
}
}
}
return z;
},foldl1:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
var z;
if(d.isArray(a)){
z=a[0];
for(var i=1,n=a.length;i<n;z=f.call(o,z,a[i],i,a),++i){
}
}else{
if(typeof a.hasNext=="function"&&typeof a.next=="function"){
if(a.hasNext()){
z=a.next();
for(var i=1;a.hasNext();z=f.call(o,z,a.next(),i++,a)){
}
}
}else{
var _122=true;
for(var i in a){
if(i in _115){
continue;
}
if(_122){
z=a[i];
_122=false;
}else{
z=f.call(o,z,a[i],i,a);
}
}
}
}
return z;
},foldr:function(a,f,z,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
for(var i=a.length;i>0;--i,z=f.call(o,z,a[i],i,a)){
}
return z;
},foldr1:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
var n=a.length,z=a[n-1];
for(var i=n-1;i>0;--i,z=f.call(o,z,a[i],i,a)){
}
return z;
},reduce:function(a,f,z){
return arguments.length<3?df.foldl1(a,f):df.foldl(a,f,z);
},reduceRight:function(a,f,z){
return arguments.length<3?df.foldr1(a,f):df.foldr(a,f,z);
},unfold:function(pr,f,g,z,o){
o=o||d.global;
f=df.lambda(f);
g=df.lambda(g);
pr=df.lambda(pr);
var t=[];
for(;!pr.call(o,z);t.push(f.call(o,z)),z=g.call(o,z)){
}
return t;
}});
})();
}
if(!dojo._hasResource["dojox.lang.functional.reversed"]){
dojo._hasResource["dojox.lang.functional.reversed"]=true;
dojo.provide("dojox.lang.functional.reversed");
(function(){
var d=dojo,df=dojox.lang.functional;
d.mixin(df,{filterRev:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
var t=[],v;
for(var i=a.length-1;i>=0;--i){
v=a[i];
if(f.call(o,v,i,a)){
t.push(v);
}
}
return t;
},forEachRev:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
for(var i=a.length-1;i>=0;f.call(o,a[i],i,a),--i){
}
},mapRev:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
var n=a.length,t=new Array(n);
for(var i=n-1,j=0;i>=0;t[j++]=f.call(o,a[i],i,a),--i){
}
return t;
},everyRev:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
for(var i=a.length-1;i>=0;--i){
if(!f.call(o,a[i],i,a)){
return false;
}
}
return true;
},someRev:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
for(var i=a.length-1;i>=0;--i){
if(f.call(o,a[i],i,a)){
return true;
}
}
return false;
}});
})();
}
if(!dojo._hasResource["dojo.colors"]){
dojo._hasResource["dojo.colors"]=true;
dojo.provide("dojo.colors");
(function(){
var _155=function(m1,m2,h){
if(h<0){
++h;
}
if(h>1){
--h;
}
var h6=6*h;
if(h6<1){
return m1+(m2-m1)*h6;
}
if(2*h<1){
return m2;
}
if(3*h<2){
return m1+(m2-m1)*(2/3-h)*6;
}
return m1;
};
dojo.colorFromRgb=function(_15a,obj){
var m=_15a.toLowerCase().match(/^(rgba?|hsla?)\(([\s\.\-,%0-9]+)\)/);
if(m){
var c=m[2].split(/\s*,\s*/),l=c.length,t=m[1];
if((t=="rgb"&&l==3)||(t=="rgba"&&l==4)){
var r=c[0];
if(r.charAt(r.length-1)=="%"){
var a=dojo.map(c,function(x){
return parseFloat(x)*2.56;
});
if(l==4){
a[3]=c[3];
}
return dojo.colorFromArray(a,obj);
}
return dojo.colorFromArray(c,obj);
}
if((t=="hsl"&&l==3)||(t=="hsla"&&l==4)){
var H=((parseFloat(c[0])%360)+360)%360/360,S=parseFloat(c[1])/100,L=parseFloat(c[2])/100,m2=L<=0.5?L*(S+1):L+S-L*S,m1=2*L-m2,a=[_155(m1,m2,H+1/3)*256,_155(m1,m2,H)*256,_155(m1,m2,H-1/3)*256,1];
if(l==4){
a[3]=c[3];
}
return dojo.colorFromArray(a,obj);
}
}
return null;
};
var _168=function(c,low,high){
c=Number(c);
return isNaN(c)?high:c<low?low:c>high?high:c;
};
dojo.Color.prototype.sanitize=function(){
var t=this;
t.r=Math.round(_168(t.r,0,255));
t.g=Math.round(_168(t.g,0,255));
t.b=Math.round(_168(t.b,0,255));
t.a=_168(t.a,0,1);
return this;
};
})();
dojo.colors.makeGrey=function(g,a){
return dojo.colorFromArray([g,g,g,a]);
};
dojo.Color.named=dojo.mixin({aliceblue:[240,248,255],antiquewhite:[250,235,215],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],blanchedalmond:[255,235,205],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],greenyellow:[173,255,47],grey:[128,128,128],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],oldlace:[253,245,230],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],thistle:[216,191,216],tomato:[255,99,71],transparent:[0,0,0,0],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],whitesmoke:[245,245,245],yellowgreen:[154,205,50]},dojo.Color.named);
}
if(!dojo._hasResource["dojox.color._base"]){
dojo._hasResource["dojox.color._base"]=true;
dojo.provide("dojox.color._base");
dojox.color.Color=dojo.Color;
dojox.color.blend=dojo.blendColors;
dojox.color.fromRgb=dojo.colorFromRgb;
dojox.color.fromHex=dojo.colorFromHex;
dojox.color.fromArray=dojo.colorFromArray;
dojox.color.fromString=dojo.colorFromString;
dojox.color.greyscale=dojo.colors.makeGrey;
dojo.mixin(dojox.color,{fromCmy:function(cyan,_170,_171){
if(dojo.isArray(cyan)){
_170=cyan[1],_171=cyan[2],cyan=cyan[0];
}else{
if(dojo.isObject(cyan)){
_170=cyan.m,_171=cyan.y,cyan=cyan.c;
}
}
cyan/=100,_170/=100,_171/=100;
var r=1-cyan,g=1-_170,b=1-_171;
return new dojox.color.Color({r:Math.round(r*255),g:Math.round(g*255),b:Math.round(b*255)});
},fromCmyk:function(cyan,_176,_177,_178){
if(dojo.isArray(cyan)){
_176=cyan[1],_177=cyan[2],_178=cyan[3],cyan=cyan[0];
}else{
if(dojo.isObject(cyan)){
_176=cyan.m,_177=cyan.y,_178=cyan.b,cyan=cyan.c;
}
}
cyan/=100,_176/=100,_177/=100,_178/=100;
var r,g,b;
r=1-Math.min(1,cyan*(1-_178)+_178);
g=1-Math.min(1,_176*(1-_178)+_178);
b=1-Math.min(1,_177*(1-_178)+_178);
return new dojox.color.Color({r:Math.round(r*255),g:Math.round(g*255),b:Math.round(b*255)});
},fromHsl:function(hue,_17d,_17e){
if(dojo.isArray(hue)){
_17d=hue[1],_17e=hue[2],hue=hue[0];
}else{
if(dojo.isObject(hue)){
_17d=hue.s,_17e=hue.l,hue=hue.h;
}
}
_17d/=100;
_17e/=100;
while(hue<0){
hue+=360;
}
while(hue>=360){
hue-=360;
}
var r,g,b;
if(hue<120){
r=(120-hue)/60,g=hue/60,b=0;
}else{
if(hue<240){
r=0,g=(240-hue)/60,b=(hue-120)/60;
}else{
r=(hue-240)/60,g=0,b=(360-hue)/60;
}
}
r=2*_17d*Math.min(r,1)+(1-_17d);
g=2*_17d*Math.min(g,1)+(1-_17d);
b=2*_17d*Math.min(b,1)+(1-_17d);
if(_17e<0.5){
r*=_17e,g*=_17e,b*=_17e;
}else{
r=(1-_17e)*r+2*_17e-1;
g=(1-_17e)*g+2*_17e-1;
b=(1-_17e)*b+2*_17e-1;
}
return new dojox.color.Color({r:Math.round(r*255),g:Math.round(g*255),b:Math.round(b*255)});
},fromHsv:function(hue,_183,_184){
if(dojo.isArray(hue)){
_183=hue[1],_184=hue[2],hue=hue[0];
}else{
if(dojo.isObject(hue)){
_183=hue.s,_184=hue.v,hue=hue.h;
}
}
if(hue==360){
hue=0;
}
_183/=100;
_184/=100;
var r,g,b;
if(_183==0){
r=_184,b=_184,g=_184;
}else{
var _188=hue/60,i=Math.floor(_188),f=_188-i;
var p=_184*(1-_183);
var q=_184*(1-(_183*f));
var t=_184*(1-(_183*(1-f)));
switch(i){
case 0:
r=_184,g=t,b=p;
break;
case 1:
r=q,g=_184,b=p;
break;
case 2:
r=p,g=_184,b=t;
break;
case 3:
r=p,g=q,b=_184;
break;
case 4:
r=t,g=p,b=_184;
break;
case 5:
r=_184,g=p,b=q;
break;
}
}
return new dojox.color.Color({r:Math.round(r*255),g:Math.round(g*255),b:Math.round(b*255)});
}});
dojo.extend(dojox.color.Color,{toCmy:function(){
var cyan=1-(this.r/255),_18f=1-(this.g/255),_190=1-(this.b/255);
return {c:Math.round(cyan*100),m:Math.round(_18f*100),y:Math.round(_190*100)};
},toCmyk:function(){
var cyan,_192,_193,_194;
var r=this.r/255,g=this.g/255,b=this.b/255;
_194=Math.min(1-r,1-g,1-b);
cyan=(1-r-_194)/(1-_194);
_192=(1-g-_194)/(1-_194);
_193=(1-b-_194)/(1-_194);
return {c:Math.round(cyan*100),m:Math.round(_192*100),y:Math.round(_193*100),b:Math.round(_194*100)};
},toHsl:function(){
var r=this.r/255,g=this.g/255,b=this.b/255;
var min=Math.min(r,b,g),max=Math.max(r,g,b);
var _19d=max-min;
var h=0,s=0,l=(min+max)/2;
if(l>0&&l<1){
s=_19d/((l<0.5)?(2*l):(2-2*l));
}
if(_19d>0){
if(max==r&&max!=g){
h+=(g-b)/_19d;
}
if(max==g&&max!=b){
h+=(2+(b-r)/_19d);
}
if(max==b&&max!=r){
h+=(4+(r-g)/_19d);
}
h*=60;
}
return {h:h,s:Math.round(s*100),l:Math.round(l*100)};
},toHsv:function(){
var r=this.r/255,g=this.g/255,b=this.b/255;
var min=Math.min(r,b,g),max=Math.max(r,g,b);
var _1a6=max-min;
var h=null,s=(max==0)?0:(_1a6/max);
if(s==0){
h=0;
}else{
if(r==max){
h=60*(g-b)/_1a6;
}else{
if(g==max){
h=120+60*(b-r)/_1a6;
}else{
h=240+60*(r-g)/_1a6;
}
}
if(h<0){
h+=360;
}
}
return {h:h,s:Math.round(s*100),v:Math.round(max*100)};
}});
}
if(!dojo._hasResource["dojox.color"]){
dojo._hasResource["dojox.color"]=true;
dojo.provide("dojox.color");
}
if(!dojo._hasResource["dojox.color.Palette"]){
dojo._hasResource["dojox.color.Palette"]=true;
dojo.provide("dojox.color.Palette");
(function(){
var dxc=dojox.color;
dxc.Palette=function(base){
this.colors=[];
if(base instanceof dojox.color.Palette){
this.colors=base.colors.slice(0);
}else{
if(base instanceof dojox.color.Color){
this.colors=[null,null,base,null,null];
}else{
if(dojo.isArray(base)){
this.colors=dojo.map(base.slice(0),function(item){
if(dojo.isString(item)){
return new dojox.color.Color(item);
}
return item;
});
}else{
if(dojo.isString(base)){
this.colors=[null,null,new dojox.color.Color(base),null,null];
}
}
}
}
};
function tRGBA(p,_1ad,val){
var ret=new dojox.color.Palette();
ret.colors=[];
dojo.forEach(p.colors,function(item){
var r=(_1ad=="dr")?item.r+val:item.r,g=(_1ad=="dg")?item.g+val:item.g,b=(_1ad=="db")?item.b+val:item.b,a=(_1ad=="da")?item.a+val:item.a;
ret.colors.push(new dojox.color.Color({r:Math.min(255,Math.max(0,r)),g:Math.min(255,Math.max(0,g)),b:Math.min(255,Math.max(0,b)),a:Math.min(1,Math.max(0,a))}));
});
return ret;
};
function tCMY(p,_1b6,val){
var ret=new dojox.color.Palette();
ret.colors=[];
dojo.forEach(p.colors,function(item){
var o=item.toCmy(),c=(_1b6=="dc")?o.c+val:o.c,m=(_1b6=="dm")?o.m+val:o.m,y=(_1b6=="dy")?o.y+val:o.y;
ret.colors.push(dojox.color.fromCmy(Math.min(100,Math.max(0,c)),Math.min(100,Math.max(0,m)),Math.min(100,Math.max(0,y))));
});
return ret;
};
function tCMYK(p,_1bf,val){
var ret=new dojox.color.Palette();
ret.colors=[];
dojo.forEach(p.colors,function(item){
var o=item.toCmyk(),c=(_1bf=="dc")?o.c+val:o.c,m=(_1bf=="dm")?o.m+val:o.m,y=(_1bf=="dy")?o.y+val:o.y,k=(_1bf=="dk")?o.b+val:o.b;
ret.colors.push(dojox.color.fromCmyk(Math.min(100,Math.max(0,c)),Math.min(100,Math.max(0,m)),Math.min(100,Math.max(0,y)),Math.min(100,Math.max(0,k))));
});
return ret;
};
function tHSL(p,_1c9,val){
var ret=new dojox.color.Palette();
ret.colors=[];
dojo.forEach(p.colors,function(item){
var o=item.toHsl(),h=(_1c9=="dh")?o.h+val:o.h,s=(_1c9=="ds")?o.s+val:o.s,l=(_1c9=="dl")?o.l+val:o.l;
ret.colors.push(dojox.color.fromHsl(h%360,Math.min(100,Math.max(0,s)),Math.min(100,Math.max(0,l))));
});
return ret;
};
function tHSV(p,_1d2,val){
var ret=new dojox.color.Palette();
ret.colors=[];
dojo.forEach(p.colors,function(item){
var o=item.toHsv(),h=(_1d2=="dh")?o.h+val:o.h,s=(_1d2=="ds")?o.s+val:o.s,v=(_1d2=="dv")?o.v+val:o.v;
ret.colors.push(dojox.color.fromHsv(h%360,Math.min(100,Math.max(0,s)),Math.min(100,Math.max(0,v))));
});
return ret;
};
function rangeDiff(val,low,high){
return high-((high-val)*((high-low)/high));
};
dojo.extend(dxc.Palette,{transform:function(_1dd){
var fn=tRGBA;
if(_1dd.use){
var use=_1dd.use.toLowerCase();
if(use.indexOf("hs")==0){
if(use.charAt(2)=="l"){
fn=tHSL;
}else{
fn=tHSV;
}
}else{
if(use.indexOf("cmy")==0){
if(use.charAt(3)=="k"){
fn=tCMYK;
}else{
fn=tCMY;
}
}
}
}else{
if("dc" in _1dd||"dm" in _1dd||"dy" in _1dd){
if("dk" in _1dd){
fn=tCMYK;
}else{
fn=tCMY;
}
}else{
if("dh" in _1dd||"ds" in _1dd){
if("dv" in _1dd){
fn=tHSV;
}else{
fn=tHSL;
}
}
}
}
var _1e0=this;
for(var p in _1dd){
if(p=="use"){
continue;
}
_1e0=fn(_1e0,p,_1dd[p]);
}
return _1e0;
},clone:function(){
return new dxc.Palette(this);
}});
dojo.mixin(dxc.Palette,{generators:{analogous:function(args){
var high=args.high||60,low=args.low||18,base=dojo.isString(args.base)?new dojox.color.Color(args.base):args.base,hsv=base.toHsv();
var h=[(hsv.h+low+360)%360,(hsv.h+Math.round(low/2)+360)%360,hsv.h,(hsv.h-Math.round(high/2)+360)%360,(hsv.h-high+360)%360];
var s1=Math.max(10,(hsv.s<=95)?hsv.s+5:(100-(hsv.s-95))),s2=(hsv.s>1)?hsv.s-1:21-hsv.s,v1=(hsv.v>=92)?hsv.v-9:Math.max(hsv.v+9,20),v2=(hsv.v<=90)?Math.max(hsv.v+5,20):(95+Math.ceil((hsv.v-90)/2)),s=[s1,s2,hsv.s,s1,s1],v=[v1,v2,hsv.v,v1,v2];
return new dxc.Palette(dojo.map(h,function(hue,i){
return dojox.color.fromHsv(hue,s[i],v[i]);
}));
},monochromatic:function(args){
var base=dojo.isString(args.base)?new dojox.color.Color(args.base):args.base,hsv=base.toHsv();
var s1=(hsv.s-30>9)?hsv.s-30:hsv.s+30,s2=hsv.s,v1=rangeDiff(hsv.v,20,100),v2=(hsv.v-20>20)?hsv.v-20:hsv.v+60,v3=(hsv.v-50>20)?hsv.v-50:hsv.v+30;
return new dxc.Palette([dojox.color.fromHsv(hsv.h,s1,v1),dojox.color.fromHsv(hsv.h,s2,v3),base,dojox.color.fromHsv(hsv.h,s1,v3),dojox.color.fromHsv(hsv.h,s2,v2)]);
},triadic:function(args){
var base=dojo.isString(args.base)?new dojox.color.Color(args.base):args.base,hsv=base.toHsv();
var h1=(hsv.h+57+360)%360,h2=(hsv.h-157+360)%360,s1=(hsv.s>20)?hsv.s-10:hsv.s+10,s2=(hsv.s>90)?hsv.s-10:hsv.s+10,s3=(hsv.s>95)?hsv.s-5:hsv.s+5,v1=(hsv.v-20>20)?hsv.v-20:hsv.v+20,v2=(hsv.v-30>20)?hsv.v-30:hsv.v+30,v3=(hsv.v-30>70)?hsv.v-30:hsv.v+30;
return new dxc.Palette([dojox.color.fromHsv(h1,s1,hsv.v),dojox.color.fromHsv(hsv.h,s2,v2),base,dojox.color.fromHsv(h2,s2,v1),dojox.color.fromHsv(h2,s3,v3)]);
},complementary:function(args){
var base=dojo.isString(args.base)?new dojox.color.Color(args.base):args.base,hsv=base.toHsv();
var h1=((hsv.h*2)+137<360)?(hsv.h*2)+137:Math.floor(hsv.h/2)-137,s1=Math.max(hsv.s-10,0),s2=rangeDiff(hsv.s,10,100),s3=Math.min(100,hsv.s+20),v1=Math.min(100,hsv.v+30),v2=(hsv.v>20)?hsv.v-30:hsv.v+30;
return new dxc.Palette([dojox.color.fromHsv(hsv.h,s1,v1),dojox.color.fromHsv(hsv.h,s2,v2),base,dojox.color.fromHsv(h1,s3,v2),dojox.color.fromHsv(h1,hsv.s,hsv.v)]);
},splitComplementary:function(args){
var base=dojo.isString(args.base)?new dojox.color.Color(args.base):args.base,_20e=args.da||30,hsv=base.toHsv();
var _210=((hsv.h*2)+137<360)?(hsv.h*2)+137:Math.floor(hsv.h/2)-137,h1=(_210-_20e+360)%360,h2=(_210+_20e)%360,s1=Math.max(hsv.s-10,0),s2=rangeDiff(hsv.s,10,100),s3=Math.min(100,hsv.s+20),v1=Math.min(100,hsv.v+30),v2=(hsv.v>20)?hsv.v-30:hsv.v+30;
return new dxc.Palette([dojox.color.fromHsv(h1,s1,v1),dojox.color.fromHsv(h1,s2,v2),base,dojox.color.fromHsv(h2,s3,v2),dojox.color.fromHsv(h2,hsv.s,hsv.v)]);
},compound:function(args){
var base=dojo.isString(args.base)?new dojox.color.Color(args.base):args.base,hsv=base.toHsv();
var h1=((hsv.h*2)+18<360)?(hsv.h*2)+18:Math.floor(hsv.h/2)-18,h2=((hsv.h*2)+120<360)?(hsv.h*2)+120:Math.floor(hsv.h/2)-120,h3=((hsv.h*2)+99<360)?(hsv.h*2)+99:Math.floor(hsv.h/2)-99,s1=(hsv.s-40>10)?hsv.s-40:hsv.s+40,s2=(hsv.s-10>80)?hsv.s-10:hsv.s+10,s3=(hsv.s-25>10)?hsv.s-25:hsv.s+25,v1=(hsv.v-40>10)?hsv.v-40:hsv.v+40,v2=(hsv.v-20>80)?hsv.v-20:hsv.v+20,v3=Math.max(hsv.v,20);
return new dxc.Palette([dojox.color.fromHsv(h1,s1,v1),dojox.color.fromHsv(h1,s2,v2),base,dojox.color.fromHsv(h2,s3,v3),dojox.color.fromHsv(h3,s2,v2)]);
},shades:function(args){
var base=dojo.isString(args.base)?new dojox.color.Color(args.base):args.base,hsv=base.toHsv();
var s=(hsv.s==100&&hsv.v==0)?0:hsv.s,v1=(hsv.v-50>20)?hsv.v-50:hsv.v+30,v2=(hsv.v-25>=20)?hsv.v-25:hsv.v+55,v3=(hsv.v-75>=20)?hsv.v-75:hsv.v+5,v4=Math.max(hsv.v-10,20);
return new dxc.Palette([new dojox.color.fromHsv(hsv.h,s,v1),new dojox.color.fromHsv(hsv.h,s,v2),base,new dojox.color.fromHsv(hsv.h,s,v3),new dojox.color.fromHsv(hsv.h,s,v4)]);
}},generate:function(base,type){
if(dojo.isFunction(type)){
return type({base:base});
}else{
if(dxc.Palette.generators[type]){
return dxc.Palette.generators[type]({base:base});
}
}
throw new Error("dojox.color.Palette.generate: the specified generator ('"+type+"') does not exist.");
}});
})();
}
if(!dojo._hasResource["dojox.charting.Theme"]){
dojo._hasResource["dojox.charting.Theme"]=true;
dojo.provide("dojox.charting.Theme");
(function(){
var dxc=dojox.charting;
dxc.Theme=function(_22f){
_22f=_22f||{};
var def=dxc.Theme._def;
dojo.forEach(["chart","plotarea","axis","series","marker"],function(n){
this[n]=dojo.mixin(dojo.clone(def[n]),_22f[n]||{});
},this);
this.markers=dojo.mixin(dojo.clone(dxc.Theme.Markers),_22f.markers||{});
this.colors=[];
this.antiAlias=("antiAlias" in _22f)?_22f.antiAlias:true;
this.assignColors=("assignColors" in _22f)?_22f.assignColors:true;
this.assignMarkers=("assignMarkers" in _22f)?_22f.assignMarkers:true;
_22f.colors=_22f.colors||def.colors;
dojo.forEach(_22f.colors,function(item){
this.colors.push(item);
},this);
this._current={color:0,marker:0};
this._markers=[];
this._buildMarkerArray();
};
dxc.Theme.Markers={CIRCLE:"m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0",SQUARE:"m-3,-3 l0,6 6,0 0,-6 z",DIAMOND:"m0,-3 l3,3 -3,3 -3,-3 z",CROSS:"m0,-3 l0,6 m-3,-3 l6,0",X:"m-3,-3 l6,6 m0,-6 l-6,6",TRIANGLE:"m-3,3 l3,-6 3,6 z",TRIANGLE_INVERTED:"m-3,-3 l3,6 3,-6 z"};
dxc.Theme._def={chart:{stroke:null,fill:"white"},plotarea:{stroke:null,fill:"white"},axis:{stroke:{color:"#333",width:1},line:{color:"#ccc",width:1,style:"Dot",cap:"round"},majorTick:{color:"#666",width:1,length:6,position:"center"},minorTick:{color:"#666",width:0.8,length:3,position:"center"},font:"normal normal normal 7pt Tahoma",fontColor:"#333"},series:{outline:{width:0.1,color:"#ccc"},stroke:{width:1.5,color:"#333"},fill:"#ccc",font:"normal normal normal 7pt Tahoma",fontColor:"#000"},marker:{stroke:{width:1},fill:"#333",font:"normal normal normal 7pt Tahoma",fontColor:"#000"},colors:["#000","#111","#222","#333","#444","#555","#666","#777","#888","#999","#aaa","#bbb","#ccc"]};
dojo.extend(dxc.Theme,{defineColors:function(obj){
var _234=obj||{};
var c=[],n=_234.num||5;
if(_234.colors){
var l=_234.colors.length;
for(var i=0;i<n;i++){
c.push(_234.colors[i%l]);
}
this.colors=c;
}else{
if(_234.hue){
var s=_234.saturation||100;
var st=_234.low||30;
var end=_234.high||90;
var l=(end+st)/2;
this.colors=dojox.color.Palette.generate(dojox.color.fromHsv(_234.hue,s,l),"monochromatic").colors;
}else{
if(_234.generator){
this.colors=dojox.color.Palette.generate(_234.base,_234.generator).colors;
}
}
}
},_buildMarkerArray:function(){
this._markers=[];
for(var p in this.markers){
this._markers.push(this.markers[p]);
}
this._current.marker=0;
},addMarker:function(name,_23e){
this.markers[name]=_23e;
this._buildMarkerArray();
},setMarkers:function(obj){
this.markers=obj;
this._buildMarkerArray();
},next:function(type){
if(type=="marker"){
return this._markers[this._current.marker++%this._markers.length];
}else{
return this.colors[this._current.color++%this.colors.length];
}
},clear:function(){
this._current={color:0,marker:0};
}});
})();
}
if(!dojo._hasResource["dojox.charting.Element"]){
dojo._hasResource["dojox.charting.Element"]=true;
dojo.provide("dojox.charting.Element");
dojo.declare("dojox.charting.Element",null,{constructor:function(_241){
this.chart=_241;
this.group=null;
this.htmlElements=[];
this.dirty=true;
},createGroup:function(_242){
if(!_242){
_242=this.chart.surface;
}
if(!this.group){
this.group=_242.createGroup();
}
return this;
},purgeGroup:function(){
this.destroyHtmlElements();
if(this.group){
this.group.clear();
this.group.removeShape();
this.group=null;
}
this.dirty=true;
return this;
},cleanGroup:function(_243){
this.destroyHtmlElements();
if(!_243){
_243=this.chart.surface;
}
if(this.group){
this.group.clear();
}else{
this.group=_243.createGroup();
}
this.dirty=true;
return this;
},destroyHtmlElements:function(){
if(this.htmlElements.length){
dojo.forEach(this.htmlElements,dojo._destroyElement);
this.htmlElements=[];
}
},destroy:function(){
this.purgeGroup();
}});
}
if(!dojo._hasResource["dojox.charting.Series"]){
dojo._hasResource["dojox.charting.Series"]=true;
dojo.provide("dojox.charting.Series");
dojo.declare("dojox.charting.Series",dojox.charting.Element,{constructor:function(_244,data,_246){
dojo.mixin(this,_246);
if(typeof this.plot!="string"){
this.plot="default";
}
this.data=data;
this.dirty=true;
this.clear();
},clear:function(){
this.dyn={};
}});
}
if(!dojo._hasResource["dojox.charting.scaler.common"]){
dojo._hasResource["dojox.charting.scaler.common"]=true;
dojo.provide("dojox.charting.scaler.common");
(function(){
var eq=function(a,b){
return Math.abs(a-b)<=0.000001*(Math.abs(a)+Math.abs(b));
};
dojo.mixin(dojox.charting.scaler.common,{findString:function(val,text){
val=val.toLowerCase();
for(var i=0;i<text.length;++i){
if(val==text[i]){
return true;
}
}
return false;
},getNumericLabel:function(_24d,_24e,_24f){
if(_24f.labels){
var l=_24f.labels,lo=0,hi=l.length;
while(lo<hi){
var mid=Math.floor((lo+hi)/2),val=l[mid].value;
if(val<_24d){
lo=mid+1;
}else{
hi=mid;
}
}
if(lo<l.length&&eq(l[lo].value,_24d)){
return l[lo].text;
}
--lo;
if(lo>=0&&lo<l.length&&eq(l[lo].value,_24d)){
return l[lo].text;
}
lo+=2;
if(lo<l.length&&eq(l[lo].value,_24d)){
return l[lo].text;
}
}
return _24f.fixed?_24d.toFixed(_24e<0?-_24e:0):_24d.toString();
}});
})();
}
if(!dojo._hasResource["dojox.charting.scaler.linear"]){
dojo._hasResource["dojox.charting.scaler.linear"]=true;
dojo.provide("dojox.charting.scaler.linear");
(function(){
var _255=3,dc=dojox.charting,dcs=dc.scaler,dcsc=dcs.common,_259=dcsc.findString,_25a=dcsc.getNumericLabel;
var _25b=function(min,max,_25e,_25f,_260,_261,span){
_25e=dojo.clone(_25e);
if(!_25f){
if(_25e.fixUpper=="major"){
_25e.fixUpper="minor";
}
if(_25e.fixLower=="major"){
_25e.fixLower="minor";
}
}
if(!_260){
if(_25e.fixUpper=="minor"){
_25e.fixUpper="micro";
}
if(_25e.fixLower=="minor"){
_25e.fixLower="micro";
}
}
if(!_261){
if(_25e.fixUpper=="micro"){
_25e.fixUpper="none";
}
if(_25e.fixLower=="micro"){
_25e.fixLower="none";
}
}
var _263=_259(_25e.fixLower,["major"])?Math.floor(_25e.min/_25f)*_25f:_259(_25e.fixLower,["minor"])?Math.floor(_25e.min/_260)*_260:_259(_25e.fixLower,["micro"])?Math.floor(_25e.min/_261)*_261:_25e.min,_264=_259(_25e.fixUpper,["major"])?Math.ceil(_25e.max/_25f)*_25f:_259(_25e.fixUpper,["minor"])?Math.ceil(_25e.max/_260)*_260:_259(_25e.fixUpper,["micro"])?Math.ceil(_25e.max/_261)*_261:_25e.max;
if(_25e.useMin){
min=_263;
}
if(_25e.useMax){
max=_264;
}
var _265=(!_25f||_25e.useMin&&_259(_25e.fixLower,["major"]))?min:Math.ceil(min/_25f)*_25f,_266=(!_260||_25e.useMin&&_259(_25e.fixLower,["major","minor"]))?min:Math.ceil(min/_260)*_260,_267=(!_261||_25e.useMin&&_259(_25e.fixLower,["major","minor","micro"]))?min:Math.ceil(min/_261)*_261,_268=!_25f?0:(_25e.useMax&&_259(_25e.fixUpper,["major"])?Math.round((max-_265)/_25f):Math.floor((max-_265)/_25f))+1,_269=!_260?0:(_25e.useMax&&_259(_25e.fixUpper,["major","minor"])?Math.round((max-_266)/_260):Math.floor((max-_266)/_260))+1,_26a=!_261?0:(_25e.useMax&&_259(_25e.fixUpper,["major","minor","micro"])?Math.round((max-_267)/_261):Math.floor((max-_267)/_261))+1,_26b=_260?Math.round(_25f/_260):0,_26c=_261?Math.round(_260/_261):0,_26d=_25f?Math.floor(Math.log(_25f)/Math.LN10):0,_26e=_260?Math.floor(Math.log(_260)/Math.LN10):0,_26f=span/(max-min);
if(!isFinite(_26f)){
_26f=1;
}
return {bounds:{lower:_263,upper:_264,from:min,to:max,scale:_26f,span:span},major:{tick:_25f,start:_265,count:_268,prec:_26d},minor:{tick:_260,start:_266,count:_269,prec:_26e},micro:{tick:_261,start:_267,count:_26a,prec:0},minorPerMajor:_26b,microPerMinor:_26c,scaler:dcs.linear};
};
dojo.mixin(dojox.charting.scaler.linear,{buildScaler:function(min,max,span,_273){
var h={fixUpper:"none",fixLower:"none",natural:false};
if(_273){
if("fixUpper" in _273){
h.fixUpper=String(_273.fixUpper);
}
if("fixLower" in _273){
h.fixLower=String(_273.fixLower);
}
if("natural" in _273){
h.natural=Boolean(_273.natural);
}
}
if("min" in _273){
min=_273.min;
}
if("max" in _273){
max=_273.max;
}
if(_273.includeZero){
if(min>0){
min=0;
}
if(max<0){
max=0;
}
}
h.min=min;
h.useMin=true;
h.max=max;
h.useMax=true;
if("from" in _273){
min=_273.from;
h.useMin=false;
}
if("to" in _273){
max=_273.to;
h.useMax=false;
}
if(max<=min){
return _25b(min,max,h,0,0,0,span);
}
var mag=Math.floor(Math.log(max-min)/Math.LN10),_276=_273&&("majorTickStep" in _273)?_273.majorTickStep:Math.pow(10,mag),_277=0,_278=0,_279;
if(_273&&("minorTickStep" in _273)){
_277=_273.minorTickStep;
}else{
do{
_277=_276/10;
if(!h.natural||_277>0.9){
_279=_25b(min,max,h,_276,_277,0,span);
if(_279.bounds.scale*_279.minor.tick>_255){
break;
}
}
_277=_276/5;
if(!h.natural||_277>0.9){
_279=_25b(min,max,h,_276,_277,0,span);
if(_279.bounds.scale*_279.minor.tick>_255){
break;
}
}
_277=_276/2;
if(!h.natural||_277>0.9){
_279=_25b(min,max,h,_276,_277,0,span);
if(_279.bounds.scale*_279.minor.tick>_255){
break;
}
}
return _25b(min,max,h,_276,0,0,span);
}while(false);
}
if(_273&&("microTickStep" in _273)){
_278=_273.microTickStep;
_279=_25b(min,max,h,_276,_277,_278,span);
}else{
do{
_278=_277/10;
if(!h.natural||_278>0.9){
_279=_25b(min,max,h,_276,_277,_278,span);
if(_279.bounds.scale*_279.micro.tick>_255){
break;
}
}
_278=_277/5;
if(!h.natural||_278>0.9){
_279=_25b(min,max,h,_276,_277,_278,span);
if(_279.bounds.scale*_279.micro.tick>_255){
break;
}
}
_278=_277/2;
if(!h.natural||_278>0.9){
_279=_25b(min,max,h,_276,_277,_278,span);
if(_279.bounds.scale*_279.micro.tick>_255){
break;
}
}
_278=0;
}while(false);
}
return _278?_279:_25b(min,max,h,_276,_277,0,span);
},buildTicks:function(_27a,_27b){
var step,next,tick,_27f=_27a.major.start,_280=_27a.minor.start,_281=_27a.micro.start;
if(_27b.microTicks&&_27a.micro.tick){
step=_27a.micro.tick,next=_281;
}else{
if(_27b.minorTicks&&_27a.minor.tick){
step=_27a.minor.tick,next=_280;
}else{
if(_27a.major.tick){
step=_27a.major.tick,next=_27f;
}else{
return null;
}
}
}
var _282=[],_283=[],_284=[];
while(next<=_27a.bounds.to+1/_27a.bounds.scale){
if(Math.abs(_27f-next)<step/2){
tick={value:_27f};
if(_27b.majorLabels){
tick.label=_25a(_27f,_27a.major.prec,_27b);
}
_282.push(tick);
_27f+=_27a.major.tick;
_280+=_27a.minor.tick;
_281+=_27a.micro.tick;
}else{
if(Math.abs(_280-next)<step/2){
if(_27b.minorTicks){
tick={value:_280};
if(_27b.minorLabels&&(_27a.minMinorStep<=_27a.minor.tick*_27a.bounds.scale)){
tick.label=_25a(_280,_27a.minor.prec,_27b);
}
_283.push(tick);
}
_280+=_27a.minor.tick;
_281+=_27a.micro.tick;
}else{
if(_27b.microTicks){
_284.push({value:_281});
}
_281+=_27a.micro.tick;
}
}
next+=step;
}
return {major:_282,minor:_283,micro:_284};
},getTransformerFromModel:function(_285){
var _286=_285.bounds.from,_287=_285.bounds.scale;
return function(x){
return (x-_286)*_287;
};
},getTransformerFromPlot:function(_289){
var _28a=_289.bounds.from,_28b=_289.bounds.scale;
return function(x){
return x/_28b+_28a;
};
}});
})();
}
if(!dojo._hasResource["dojox.charting.axis2d.common"]){
dojo._hasResource["dojox.charting.axis2d.common"]=true;
dojo.provide("dojox.charting.axis2d.common");
(function(){
var g=dojox.gfx;
function clearNode(s){
s.marginLeft="0px";
s.marginTop="0px";
s.marginRight="0px";
s.marginBottom="0px";
s.paddingLeft="0px";
s.paddingTop="0px";
s.paddingRight="0px";
s.paddingBottom="0px";
s.borderLeftWidth="0px";
s.borderTopWidth="0px";
s.borderRightWidth="0px";
s.borderBottomWidth="0px";
};
dojo.mixin(dojox.charting.axis2d.common,{createText:{gfx:function(_28f,_290,x,y,_293,text,font,_296){
return _290.createText({x:x,y:y,text:text,align:_293}).setFont(font).setFill(_296);
},html:function(_297,_298,x,y,_29b,text,font,_29e){
var p=dojo.doc.createElement("div"),s=p.style;
clearNode(s);
s.font=font;
p.innerHTML=String(text).replace(/\s/g,"&nbsp;");
s.color=_29e;
s.position="absolute";
s.left="-10000px";
dojo.body().appendChild(p);
var size=g.normalizedLength(g.splitFontString(font).size),box=dojo.marginBox(p);
dojo.body().removeChild(p);
s.position="relative";
switch(_29b){
case "middle":
s.left=Math.floor(x-box.w/2)+"px";
break;
case "end":
s.left=Math.floor(x-box.w)+"px";
break;
default:
s.left=Math.floor(x)+"px";
break;
}
s.top=Math.floor(y-size)+"px";
var wrap=dojo.doc.createElement("div"),w=wrap.style;
clearNode(w);
w.width="0px";
w.height="0px";
wrap.appendChild(p);
_297.node.insertBefore(wrap,_297.node.firstChild);
return wrap;
}}});
})();
}
if(!dojo._hasResource["dojox.charting.axis2d.Base"]){
dojo._hasResource["dojox.charting.axis2d.Base"]=true;
dojo.provide("dojox.charting.axis2d.Base");
dojo.declare("dojox.charting.axis2d.Base",dojox.charting.Element,{constructor:function(_2a5,_2a6){
this.vertical=_2a6&&_2a6.vertical;
},clear:function(){
return this;
},initialized:function(){
return false;
},calculate:function(min,max,span){
return this;
},getScaler:function(){
return null;
},getTicks:function(){
return null;
},getOffsets:function(){
return {l:0,r:0,t:0,b:0};
},render:function(dim,_2ab){
return this;
}});
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
dojo.string.substitute=function(_2b5,map,_2b7,_2b8){
_2b8=_2b8||dojo.global;
_2b7=(!_2b7)?function(v){
return v;
}:dojo.hitch(_2b8,_2b7);
return _2b5.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g,function(_2ba,key,_2bc){
var _2bd=dojo.getObject(key,false,map);
if(_2bc){
_2bd=dojo.getObject(_2bc,false,_2b8).call(_2b8,_2bd,key);
}
return _2b7(_2bd,key).toString();
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
if(!dojo._hasResource["dojox.lang.utils"]){
dojo._hasResource["dojox.lang.utils"]=true;
dojo.provide("dojox.lang.utils");
(function(){
var _2c0={},du=dojox.lang.utils;
dojo.mixin(du,{coerceType:function(_2c2,_2c3){
switch(typeof _2c2){
case "number":
return Number(eval("("+_2c3+")"));
case "string":
return String(_2c3);
case "boolean":
return Boolean(eval("("+_2c3+")"));
}
return eval("("+_2c3+")");
},updateWithObject:function(_2c4,_2c5,conv){
if(!_2c5){
return _2c4;
}
for(var x in _2c4){
if(x in _2c5&&!(x in _2c0)){
var t=_2c4[x];
if(t&&typeof t=="object"){
du.updateObject(t,_2c5[x]);
}else{
_2c4[x]=conv?du.coerceType(t,_2c5[x]):dojo.clone(_2c5[x]);
}
}
}
return _2c4;
},updateWithPattern:function(_2c9,_2ca,_2cb,conv){
if(!_2ca||!_2cb){
return _2c9;
}
for(var x in _2cb){
if(x in _2ca&&!(x in _2c0)){
_2c9[x]=conv?du.coerceType(_2cb[x],_2ca[x]):dojo.clone(_2ca[x]);
}
}
return _2c9;
}});
})();
}
if(!dojo._hasResource["dojox.charting.axis2d.Default"]){
dojo._hasResource["dojox.charting.axis2d.Default"]=true;
dojo.provide("dojox.charting.axis2d.Default");
(function(){
var dc=dojox.charting,df=dojox.lang.functional,du=dojox.lang.utils,g=dojox.gfx,lin=dc.scaler.linear,_2d3=4;
dojo.declare("dojox.charting.axis2d.Default",dojox.charting.axis2d.Base,{defaultParams:{vertical:false,fixUpper:"none",fixLower:"none",natural:false,leftBottom:true,includeZero:false,fixed:true,majorLabels:true,minorTicks:true,minorLabels:true,microTicks:false,htmlLabels:true},optionalParams:{min:0,max:1,from:0,to:1,majorTickStep:4,minorTickStep:2,microTickStep:1,labels:[],stroke:{},majorTick:{},minorTick:{},font:"",fontColor:""},constructor:function(_2d4,_2d5){
this.opt=dojo.clone(this.defaultParams);
du.updateWithObject(this.opt,_2d5);
du.updateWithPattern(this.opt,_2d5,this.optionalParams);
},dependOnData:function(){
return !("min" in this.opt)||!("max" in this.opt);
},clear:function(){
delete this.scaler;
delete this.ticks;
this.dirty=true;
return this;
},initialized:function(){
return "scaler" in this&&!(this.dirty&&this.dependOnData());
},setWindow:function(_2d6,_2d7){
this.scale=_2d6;
this.offset=_2d7;
return this.clear();
},getWindowScale:function(){
return "scale" in this?this.scale:1;
},getWindowOffset:function(){
return "offset" in this?this.offset:0;
},calculate:function(min,max,span,_2db){
if(this.initialized()){
return this;
}
this.labels="labels" in this.opt?this.opt.labels:_2db;
this.scaler=lin.buildScaler(min,max,span,this.opt);
if("scale" in this){
this.opt.from=this.scaler.bounds.lower+this.offset;
this.opt.to=(this.scaler.bounds.upper-this.scaler.bounds.lower)/this.scale+this.opt.from;
if(!isFinite(this.opt.from)||isNaN(this.opt.from)||!isFinite(this.opt.to)||isNaN(this.opt.to)||this.opt.to-this.opt.from>=this.scaler.bounds.upper-this.scaler.bounds.lower){
delete this.opt.from;
delete this.opt.to;
delete this.scale;
delete this.offset;
}else{
if(this.opt.from<this.scaler.bounds.lower){
this.opt.to+=this.scaler.bounds.lower-this.opt.from;
this.opt.from=this.scaler.bounds.lower;
}else{
if(this.opt.to>this.scaler.bounds.upper){
this.opt.from+=this.scaler.bounds.upper-this.opt.to;
this.opt.to=this.scaler.bounds.upper;
}
}
this.offset=this.opt.from-this.scaler.bounds.lower;
}
this.scaler=lin.buildScaler(min,max,span,this.opt);
if(this.scale==1&&this.offset==0){
delete this.scale;
delete this.offset;
}
}
var _2dc=0,ta=this.chart.theme.axis,_2de="font" in this.opt?this.opt.font:ta.font,size=_2de?g.normalizedLength(g.splitFontString(_2de).size):0;
if(this.vertical){
if(size){
_2dc=size+_2d3;
}
}else{
if(size){
var _2e0,i;
if(this.labels){
_2e0=df.foldl(df.map(this.labels,function(_2e2){
return dojox.gfx._base._getTextBox(_2e2.text,{font:_2de}).w;
}),"Math.max(a, b)",0);
}else{
var _2e3=Math.ceil(Math.log(Math.max(Math.abs(this.scaler.bounds.from),Math.abs(this.scaler.bounds.to)))/Math.LN10),t=[];
if(this.scaler.bounds.from<0||this.scaler.bounds.to<0){
t.push("-");
}
t.push(dojo.string.rep("9",_2e3));
var _2e5=Math.floor(Math.log(this.scaler.bounds.to-this.scaler.bounds.from)/Math.LN10);
if(_2e5>0){
t.push(".");
for(i=0;i<_2e5;++i){
t.push("9");
}
}
_2e0=dojox.gfx._base._getTextBox(t.join(""),{font:_2de}).w;
}
_2dc=_2e0+_2d3;
}
}
this.scaler.minMinorStep=_2dc;
this.ticks=lin.buildTicks(this.scaler,this.opt);
return this;
},getScaler:function(){
return this.scaler;
},getTicks:function(){
return this.ticks;
},getOffsets:function(){
var _2e6={l:0,r:0,t:0,b:0},s,_2e8,a,b,c,d,gtb=dojox.gfx._base._getTextBox,gl=dc.scaler.common.getNumericLabel,_2ef=0,ta=this.chart.theme.axis,_2f1="font" in this.opt?this.opt.font:ta.font,_2f2="majorTick" in this.opt?this.opt.majorTick:ta.majorTick,_2f3="minorTick" in this.opt?this.opt.minorTick:ta.minorTick,size=_2f1?g.normalizedLength(g.splitFontString(_2f1).size):0;
if(this.vertical){
if(size){
s=this.scaler;
if(this.labels){
_2e8=df.foldl(df.map(this.labels,function(_2f5){
return dojox.gfx._base._getTextBox(_2f5.text,{font:_2f1}).w;
}),"Math.max(a, b)",0);
}else{
a=gtb(gl(s.major.start,s.major.prec,this.opt),{font:_2f1}).w;
b=gtb(gl(s.major.start+s.major.count*s.major.tick,s.major.prec,this.opt),{font:_2f1}).w;
c=gtb(gl(s.minor.start,s.minor.prec,this.opt),{font:_2f1}).w;
d=gtb(gl(s.minor.start+s.minor.count*s.minor.tick,s.minor.prec,this.opt),{font:_2f1}).w;
_2e8=Math.max(a,b,c,d);
}
_2ef=_2e8+_2d3;
}
_2ef+=_2d3+Math.max(_2f2.length,_2f3.length);
_2e6[this.opt.leftBottom?"l":"r"]=_2ef;
_2e6.t=_2e6.b=size/2;
}else{
if(size){
_2ef=size+_2d3;
}
_2ef+=_2d3+Math.max(_2f2.length,_2f3.length);
_2e6[this.opt.leftBottom?"b":"t"]=_2ef;
if(size){
s=this.scaler;
if(this.labels){
_2e8=df.foldl(df.map(this.labels,function(_2f6){
return dojox.gfx._base._getTextBox(_2f6.text,{font:_2f1}).w;
}),"Math.max(a, b)",0);
}else{
a=gtb(gl(s.major.start,s.major.prec,this.opt),{font:_2f1}).w;
b=gtb(gl(s.major.start+s.major.count*s.major.tick,s.major.prec,this.opt),{font:_2f1}).w;
c=gtb(gl(s.minor.start,s.minor.prec,this.opt),{font:_2f1}).w;
d=gtb(gl(s.minor.start+s.minor.count*s.minor.tick,s.minor.prec,this.opt),{font:_2f1}).w;
_2e8=Math.max(a,b,c,d);
}
_2e6.l=_2e6.r=_2e8/2;
}
}
return _2e6;
},render:function(dim,_2f8){
if(!this.dirty){
return this;
}
var _2f9,stop,_2fb,_2fc,_2fd,_2fe,ta=this.chart.theme.axis,_300="stroke" in this.opt?this.opt.stroke:ta.stroke,_301="majorTick" in this.opt?this.opt.majorTick:ta.majorTick,_302="minorTick" in this.opt?this.opt.minorTick:ta.minorTick,_303="font" in this.opt?this.opt.font:ta.font,_304="fontColor" in this.opt?this.opt.fontColor:ta.fontColor,_305=Math.max(_301.length,_302.length),size=_303?g.normalizedLength(g.splitFontString(_303).size):0;
if(this.vertical){
_2f9={y:dim.height-_2f8.b};
stop={y:_2f8.t};
_2fb={x:0,y:-1};
if(this.opt.leftBottom){
_2f9.x=stop.x=_2f8.l;
_2fc={x:-1,y:0};
_2fe="end";
}else{
_2f9.x=stop.x=dim.width-_2f8.r;
_2fc={x:1,y:0};
_2fe="start";
}
_2fd={x:_2fc.x*(_305+_2d3),y:size*0.4};
}else{
_2f9={x:_2f8.l};
stop={x:dim.width-_2f8.r};
_2fb={x:1,y:0};
_2fe="middle";
if(this.opt.leftBottom){
_2f9.y=stop.y=dim.height-_2f8.b;
_2fc={x:0,y:1};
_2fd={y:_305+_2d3+size};
}else{
_2f9.y=stop.y=_2f8.t;
_2fc={x:0,y:-1};
_2fd={y:-_305-_2d3};
}
_2fd.x=0;
}
this.cleanGroup();
var s=this.group,c=this.scaler,t=this.ticks,_30a,f=lin.getTransformerFromModel(this.scaler),_30c=dojox.gfx.renderer=="canvas",_30d=_30c||this.opt.htmlLabels&&!dojo.isIE&&!dojo.isOpera?"html":"gfx",dx=_2fc.x*_301.length,dy=_2fc.y*_301.length;
s.createLine({x1:_2f9.x,y1:_2f9.y,x2:stop.x,y2:stop.y}).setStroke(_300);
dojo.forEach(t.major,function(tick){
var _311=f(tick.value),elem,x=_2f9.x+_2fb.x*_311,y=_2f9.y+_2fb.y*_311;
s.createLine({x1:x,y1:y,x2:x+dx,y2:y+dy}).setStroke(_301);
if(tick.label){
elem=dc.axis2d.common.createText[_30d](this.chart,s,x+_2fd.x,y+_2fd.y,_2fe,tick.label,_303,_304);
if(_30d=="html"){
this.htmlElements.push(elem);
}
}
},this);
dx=_2fc.x*_302.length;
dy=_2fc.y*_302.length;
_30a=c.minMinorStep<=c.minor.tick*c.scale;
dojo.forEach(t.minor,function(tick){
var _316=f(tick.value),elem,x=_2f9.x+_2fb.x*_316,y=_2f9.y+_2fb.y*_316;
s.createLine({x1:x,y1:y,x2:x+dx,y2:y+dy}).setStroke(_302);
if(_30a&&tick.label){
elem=dc.axis2d.common.createText[_30d](this.chart,s,x+_2fd.x,y+_2fd.y,_2fe,tick.label,_303,_304);
if(_30d=="html"){
this.htmlElements.push(elem);
}
}
},this);
dojo.forEach(t.micro,function(tick){
var _31b=f(tick.value),elem,x=_2f9.x+_2fb.x*_31b,y=_2f9.y+_2fb.y*_31b;
s.createLine({x1:x,y1:y,x2:x+dx,y2:y+dy}).setStroke(_302);
},this);
this.dirty=false;
return this;
}});
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.common"]){
dojo._hasResource["dojox.charting.plot2d.common"]=true;
dojo.provide("dojox.charting.plot2d.common");
(function(){
var df=dojox.lang.functional,dc=dojox.charting.plot2d.common;
dojo.mixin(dojox.charting.plot2d.common,{makeStroke:function(_321){
if(!_321){
return _321;
}
if(typeof _321=="string"||_321 instanceof dojo.Color){
_321={color:_321};
}
return dojox.gfx.makeParameters(dojox.gfx.defaultStroke,_321);
},augmentColor:function(_322,_323){
var t=new dojo.Color(_322),c=new dojo.Color(_323);
c.a=t.a;
return c;
},augmentStroke:function(_326,_327){
var s=dc.makeStroke(_326);
if(s){
s.color=dc.augmentColor(s.color,_327);
}
return s;
},augmentFill:function(fill,_32a){
var fc,c=new dojo.Color(_32a);
if(typeof fill=="string"||fill instanceof dojo.Color){
return dc.augmentColor(fill,_32a);
}
return fill;
},defaultStats:{hmin:Number.POSITIVE_INFINITY,hmax:Number.NEGATIVE_INFINITY,vmin:Number.POSITIVE_INFINITY,vmax:Number.NEGATIVE_INFINITY},collectSimpleStats:function(_32d){
var _32e=dojo.clone(dc.defaultStats);
for(var i=0;i<_32d.length;++i){
var run=_32d[i];
if(!run.data.length){
continue;
}
if(typeof run.data[0]=="number"){
var _331=_32e.vmin,_332=_32e.vmax;
if(!("ymin" in run)||!("ymax" in run)){
dojo.forEach(run.data,function(val,i){
var x=i+1,y=val;
if(isNaN(y)){
y=0;
}
_32e.hmin=Math.min(_32e.hmin,x);
_32e.hmax=Math.max(_32e.hmax,x);
_32e.vmin=Math.min(_32e.vmin,y);
_32e.vmax=Math.max(_32e.vmax,y);
});
}
if("ymin" in run){
_32e.vmin=Math.min(_331,run.ymin);
}
if("ymax" in run){
_32e.vmax=Math.max(_332,run.ymax);
}
}else{
var _337=_32e.hmin,_338=_32e.hmax,_331=_32e.vmin,_332=_32e.vmax;
if(!("xmin" in run)||!("xmax" in run)||!("ymin" in run)||!("ymax" in run)){
dojo.forEach(run.data,function(val,i){
var x=val.x,y=val.y;
if(isNaN(x)){
x=0;
}
if(isNaN(y)){
y=0;
}
_32e.hmin=Math.min(_32e.hmin,x);
_32e.hmax=Math.max(_32e.hmax,x);
_32e.vmin=Math.min(_32e.vmin,y);
_32e.vmax=Math.max(_32e.vmax,y);
});
}
if("xmin" in run){
_32e.hmin=Math.min(_337,run.xmin);
}
if("xmax" in run){
_32e.hmax=Math.max(_338,run.xmax);
}
if("ymin" in run){
_32e.vmin=Math.min(_331,run.ymin);
}
if("ymax" in run){
_32e.vmax=Math.max(_332,run.ymax);
}
}
}
return _32e;
},collectStackedStats:function(_33d){
var _33e=dojo.clone(dc.defaultStats);
if(_33d.length){
_33e.hmin=Math.min(_33e.hmin,1);
_33e.hmax=df.foldl(_33d,"seed, run -> Math.max(seed, run.data.length)",_33e.hmax);
for(var i=0;i<_33e.hmax;++i){
var v=_33d[0].data[i];
if(isNaN(v)){
v=0;
}
_33e.vmin=Math.min(_33e.vmin,v);
for(var j=1;j<_33d.length;++j){
var t=_33d[j].data[i];
if(isNaN(t)){
t=0;
}
v+=t;
}
_33e.vmax=Math.max(_33e.vmax,v);
}
}
return _33e;
},curve:function(a,_344){
var arr=a.slice(0);
if(_344=="x"){
arr[arr.length]=arr[0];
}
var p=dojo.map(arr,function(item,i){
if(i==0){
return "M"+item.x+","+item.y;
}
if(!isNaN(_344)){
var dx=item.x-arr[i-1].x,dy=arr[i-1].y;
return "C"+(item.x-(_344-1)*(dx/_344))+","+dy+" "+(item.x-(dx/_344))+","+item.y+" "+item.x+","+item.y;
}else{
if(_344=="X"||_344=="x"||_344=="S"){
var p0,p1=arr[i-1],p2=arr[i],p3;
var bz1x,bz1y,bz2x,bz2y;
var f=1/6;
if(i==1){
if(_344=="x"){
p0=arr[arr.length-2];
}else{
p0=p1;
}
f=1/3;
}else{
p0=arr[i-2];
}
if(i==(arr.length-1)){
if(_344=="x"){
p3=arr[1];
}else{
p3=p2;
}
f=1/3;
}else{
p3=arr[i+1];
}
var p1p2=Math.sqrt((p2.x-p1.x)*(p2.x-p1.x)+(p2.y-p1.y)*(p2.y-p1.y));
var p0p2=Math.sqrt((p2.x-p0.x)*(p2.x-p0.x)+(p2.y-p0.y)*(p2.y-p0.y));
var p1p3=Math.sqrt((p3.x-p1.x)*(p3.x-p1.x)+(p3.y-p1.y)*(p3.y-p1.y));
var _357=p0p2*f;
var _358=p1p3*f;
if(_357>p1p2/2&&_358>p1p2/2){
_357=p1p2/2;
_358=p1p2/2;
}else{
if(_357>p1p2/2){
_357=p1p2/2;
_358=p1p2/2*p1p3/p0p2;
}else{
if(_358>p1p2/2){
_358=p1p2/2;
_357=p1p2/2*p0p2/p1p3;
}
}
}
if(_344=="S"){
if(p0==p1){
_357=0;
}
if(p2==p3){
_358=0;
}
}
bz1x=p1.x+_357*(p2.x-p0.x)/p0p2;
bz1y=p1.y+_357*(p2.y-p0.y)/p0p2;
bz2x=p2.x-_358*(p3.x-p1.x)/p1p3;
bz2y=p2.y-_358*(p3.y-p1.y)/p1p3;
}
}
return "C"+(bz1x+","+bz1y+" "+bz2x+","+bz2y+" "+p2.x+","+p2.y);
});
return p.join(" ");
}});
})();
}
if(!dojo._hasResource["dojox.charting.scaler.primitive"]){
dojo._hasResource["dojox.charting.scaler.primitive"]=true;
dojo.provide("dojox.charting.scaler.primitive");
dojox.charting.scaler.primitive={buildScaler:function(min,max,span,_35c){
return {bounds:{lower:min,upper:max,from:min,to:max,scale:span/(max-min),span:span},scaler:dojox.charting.scaler.primitive};
},buildTicks:function(_35d,_35e){
return {major:[],minor:[],micro:[]};
},getTransformerFromModel:function(_35f){
var _360=_35f.bounds.from,_361=_35f.bounds.scale;
return function(x){
return (x-_360)*_361;
};
},getTransformerFromPlot:function(_363){
var _364=_363.bounds.from,_365=_363.bounds.scale;
return function(x){
return x/_365+_364;
};
}};
}
if(!dojo._hasResource["dojox.charting.plot2d.Base"]){
dojo._hasResource["dojox.charting.plot2d.Base"]=true;
dojo.provide("dojox.charting.plot2d.Base");
dojo.declare("dojox.charting.plot2d.Base",dojox.charting.Element,{clear:function(){
this.series=[];
this._hAxis=null;
this._vAxis=null;
this.dirty=true;
return this;
},setAxis:function(axis){
if(axis){
this[axis.vertical?"_vAxis":"_hAxis"]=axis;
}
return this;
},addSeries:function(run){
this.series.push(run);
return this;
},calculateAxes:function(dim){
return this;
},isDirty:function(){
return this.dirty||this._hAxis&&this._hAxis.dirty||this._vAxis&&this._vAxis.dirty;
},render:function(dim,_36b){
return this;
},getRequiredColors:function(){
return this.series.length;
},plotEvent:function(o){
},connect:function(_36d,_36e){
this.dirty=true;
return dojo.connect(this,"plotEvent",_36d,_36e);
},events:function(){
var ls=this.plotEvent._listeners;
if(!ls||!ls.length){
return false;
}
for(var i in ls){
if(!(i in Array.prototype)){
return true;
}
}
return false;
},_calc:function(dim,_372){
if(this._hAxis){
if(!this._hAxis.initialized()){
this._hAxis.calculate(_372.hmin,_372.hmax,dim.width);
}
this._hScaler=this._hAxis.getScaler();
}else{
this._hScaler=dojox.charting.scaler.primitive.buildScaler(_372.hmin,_372.hmax,dim.width);
}
if(this._vAxis){
if(!this._vAxis.initialized()){
this._vAxis.calculate(_372.vmin,_372.vmax,dim.height);
}
this._vScaler=this._vAxis.getScaler();
}else{
this._vScaler=dojox.charting.scaler.primitive.buildScaler(_372.vmin,_372.vmax,dim.height);
}
},_connectEvents:function(_373,o){
_373.connect("onmouseover",this,function(e){
o.type="onmouseover";
o.event=e;
this.plotEvent(o);
});
_373.connect("onmouseout",this,function(e){
o.type="onmouseout";
o.event=e;
this.plotEvent(o);
});
_373.connect("onclick",this,function(e){
o.type="onclick";
o.event=e;
this.plotEvent(o);
});
}});
}
if(!dojo._hasResource["dojox.charting.plot2d.Default"]){
dojo._hasResource["dojox.charting.plot2d.Default"]=true;
dojo.provide("dojox.charting.plot2d.Default");
(function(){
var df=dojox.lang.functional,du=dojox.lang.utils,dc=dojox.charting.plot2d.common,_37b=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.Default",dojox.charting.plot2d.Base,{defaultParams:{hAxis:"x",vAxis:"y",lines:true,areas:false,markers:false,shadows:0,tension:0},optionalParams:{},constructor:function(_37c,_37d){
this.opt=dojo.clone(this.defaultParams);
du.updateWithObject(this.opt,_37d);
this.series=[];
this.hAxis=this.opt.hAxis;
this.vAxis=this.opt.vAxis;
},calculateAxes:function(dim){
this._calc(dim,dc.collectSimpleStats(this.series));
return this;
},render:function(dim,_380){
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_37b);
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(item){
item.cleanGroup(s);
});
}
var t=this.chart.theme,_384,_385,_386,_387,_388=this.events();
for(var i=this.series.length-1;i>=0;--i){
var run=this.series[i];
if(!this.dirty&&!run.dirty){
continue;
}
run.cleanGroup();
if(!run.data.length){
run.dirty=false;
continue;
}
var s=run.group,_38b,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler);
if(typeof run.data[0]=="number"){
_38b=dojo.map(run.data,function(v,i){
return {x:ht(i+1)+_380.l,y:dim.height-_380.b-vt(v)};
},this);
}else{
_38b=dojo.map(run.data,function(v,i){
return {x:ht(v.x)+_380.l,y:dim.height-_380.b-vt(v.y)};
},this);
}
if(!run.fill||!run.stroke){
_386=run.dyn.color=new dojo.Color(t.next("color"));
}
var _392=this.opt.tension?dc.curve(_38b,this.opt.tension):"";
if(this.opt.areas){
var fill=run.fill?run.fill:dc.augmentFill(t.series.fill,_386);
var _394=dojo.clone(_38b);
if(this.opt.tension){
var _395="L"+_394[_394.length-1].x+","+(dim.height-_380.b)+" L"+_394[0].x+","+(dim.height-_380.b)+" L"+_394[0].x+","+_394[0].y;
run.dyn.fill=s.createPath(_392+" "+_395).setFill(fill).getFill();
}else{
_394.push({x:_38b[_38b.length-1].x,y:dim.height-_380.b});
_394.push({x:_38b[0].x,y:dim.height-_380.b});
_394.push(_38b[0]);
run.dyn.fill=s.createPolyline(_394).setFill(fill).getFill();
}
}
if(this.opt.lines||this.opt.markers){
_384=run.stroke?dc.makeStroke(run.stroke):dc.augmentStroke(t.series.stroke,_386);
if(run.outline||t.series.outline){
_385=dc.makeStroke(run.outline?run.outline:t.series.outline);
_385.width=2*_385.width+_384.width;
}
}
if(this.opt.markers){
_387=run.dyn.marker=run.marker?run.marker:t.next("marker");
}
var _396=null,_397=null,_398=null;
if(this.opt.shadows&&_384){
var sh=this.opt.shadows,_39a=new dojo.Color([0,0,0,0.3]),_39b=dojo.map(_38b,function(c){
return {x:c.x+sh.dx,y:c.y+sh.dy};
}),_39d=dojo.clone(_385?_385:_384);
_39d.color=_39a;
_39d.width+=sh.dw?sh.dw:0;
if(this.opt.lines){
if(this.opt.tension){
run.dyn.shadow=s.createPath(dc.curve(_39b,this.opt.tension)).setStroke(_39d).getStroke();
}else{
run.dyn.shadow=s.createPolyline(_39b).setStroke(_39d).getStroke();
}
}
if(this.opt.markers){
_398=dojo.map(_39b,function(c){
return s.createPath("M"+c.x+" "+c.y+" "+_387).setStroke(_39d).setFill(_39a);
},this);
}
}
if(this.opt.lines){
if(_385){
if(this.opt.tension){
run.dyn.outline=s.createPath(_392).setStroke(_385).getStroke();
}else{
run.dyn.outline=s.createPolyline(_38b).setStroke(_385).getStroke();
}
}
if(this.opt.tension){
run.dyn.stroke=s.createPath(_392).setStroke(_384).getStroke();
}else{
run.dyn.stroke=s.createPolyline(_38b).setStroke(_384).getStroke();
}
}
if(this.opt.markers){
_396=new Array(_38b.length);
_397=new Array(_38b.length);
dojo.forEach(_38b,function(c,i){
var path="M"+c.x+" "+c.y+" "+_387;
if(_385){
_397[i]=s.createPath(path).setStroke(_385);
}
_396[i]=s.createPath(path).setStroke(_384).setFill(_384.color);
},this);
if(_388){
dojo.forEach(_396,function(s,i){
var o={element:"marker",index:i,run:run,plot:this,hAxis:this.hAxis||null,vAxis:this.vAxis||null,shape:s,outline:_397[i]||null,shadow:_398&&_398[i]||null,cx:_38b[i].x,cy:_38b[i].y};
if(typeof run.data[0]=="number"){
o.x=i+1;
o.y=run.data[i];
}else{
o.x=run.data[i].x;
o.y=run.data[i].y;
}
this._connectEvents(s,o);
},this);
}
}
run.dirty=false;
}
this.dirty=false;
return this;
}});
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.Lines"]){
dojo._hasResource["dojox.charting.plot2d.Lines"]=true;
dojo.provide("dojox.charting.plot2d.Lines");
dojo.declare("dojox.charting.plot2d.Lines",dojox.charting.plot2d.Default,{constructor:function(){
this.opt.lines=true;
}});
}
if(!dojo._hasResource["dojox.charting.plot2d.Areas"]){
dojo._hasResource["dojox.charting.plot2d.Areas"]=true;
dojo.provide("dojox.charting.plot2d.Areas");
dojo.declare("dojox.charting.plot2d.Areas",dojox.charting.plot2d.Default,{constructor:function(){
this.opt.lines=true;
this.opt.areas=true;
}});
}
if(!dojo._hasResource["dojox.charting.plot2d.Markers"]){
dojo._hasResource["dojox.charting.plot2d.Markers"]=true;
dojo.provide("dojox.charting.plot2d.Markers");
dojo.declare("dojox.charting.plot2d.Markers",dojox.charting.plot2d.Default,{constructor:function(){
this.opt.markers=true;
}});
}
if(!dojo._hasResource["dojox.charting.plot2d.MarkersOnly"]){
dojo._hasResource["dojox.charting.plot2d.MarkersOnly"]=true;
dojo.provide("dojox.charting.plot2d.MarkersOnly");
dojo.declare("dojox.charting.plot2d.MarkersOnly",dojox.charting.plot2d.Default,{constructor:function(){
this.opt.lines=false;
this.opt.markers=true;
}});
}
if(!dojo._hasResource["dojox.charting.plot2d.Scatter"]){
dojo._hasResource["dojox.charting.plot2d.Scatter"]=true;
dojo.provide("dojox.charting.plot2d.Scatter");
dojo.declare("dojox.charting.plot2d.Scatter",dojox.charting.plot2d.Default,{constructor:function(){
this.opt.lines=false;
this.opt.markers=true;
}});
}
if(!dojo._hasResource["dojox.lang.functional.sequence"]){
dojo._hasResource["dojox.lang.functional.sequence"]=true;
dojo.provide("dojox.lang.functional.sequence");
(function(){
var d=dojo,df=dojox.lang.functional;
d.mixin(df,{repeat:function(n,f,z,o){
o=o||d.global;
f=df.lambda(f);
var t=new Array(n);
t[0]=z;
for(var i=1;i<n;t[i]=z=f.call(o,z),++i){
}
return t;
},until:function(pr,f,z,o){
o=o||d.global;
f=df.lambda(f);
pr=df.lambda(pr);
var t=[];
for(;!pr.call(o,z);t.push(z),z=f.call(o,z)){
}
return t;
}});
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.Stacked"]){
dojo._hasResource["dojox.charting.plot2d.Stacked"]=true;
dojo.provide("dojox.charting.plot2d.Stacked");
(function(){
var df=dojox.lang.functional,dc=dojox.charting.plot2d.common,_3b4=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.Stacked",dojox.charting.plot2d.Default,{calculateAxes:function(dim){
var _3b6=dc.collectStackedStats(this.series);
this._maxRunLength=_3b6.hmax;
this._calc(dim,_3b6);
return this;
},render:function(dim,_3b8){
var acc=df.repeat(this._maxRunLength,"-> 0",0);
for(var i=0;i<this.series.length;++i){
var run=this.series[i];
for(var j=0;j<run.data.length;++j){
var v=run.data[j];
if(isNaN(v)){
v=0;
}
acc[j]+=v;
}
}
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_3b4);
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(item){
item.cleanGroup(s);
});
}
var t=this.chart.theme,_3c1,_3c2,_3c3,_3c4,_3c5=this.events(),ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler);
for(var i=this.series.length-1;i>=0;--i){
var run=this.series[i];
if(!this.dirty&&!run.dirty){
continue;
}
run.cleanGroup();
var s=run.group,_3c8=dojo.map(acc,function(v,i){
return {x:ht(i+1)+_3b8.l,y:dim.height-_3b8.b-vt(v)};
},this);
if(!run.fill||!run.stroke){
_3c3=new dojo.Color(t.next("color"));
}
var _3cb=this.opt.tension?dc.curve(_3c8,this.opt.tension):"";
if(this.opt.areas){
var _3cc=dojo.clone(_3c8);
var fill=run.fill?run.fill:dc.augmentFill(t.series.fill,_3c3);
if(this.opt.tension){
var p=dc.curve(_3cc,this.opt.tension);
p+=" L"+_3c8[_3c8.length-1].x+","+(dim.height-_3b8.b)+" L"+_3c8[0].x+","+(dim.height-_3b8.b)+" L"+_3c8[0].x+","+_3c8[0].y;
run.dyn.fill=s.createPath(p).setFill(fill).getFill();
}else{
_3cc.push({x:_3c8[_3c8.length-1].x,y:dim.height-_3b8.b});
_3cc.push({x:_3c8[0].x,y:dim.height-_3b8.b});
_3cc.push(_3c8[0]);
run.dyn.fill=s.createPolyline(_3cc).setFill(fill).getFill();
}
}
if(this.opt.lines||this.opt.markers){
_3c1=run.stroke?dc.makeStroke(run.stroke):dc.augmentStroke(t.series.stroke,_3c3);
if(run.outline||t.series.outline){
_3c2=dc.makeStroke(run.outline?run.outline:t.series.outline);
_3c2.width=2*_3c2.width+_3c1.width;
}
}
if(this.opt.markers){
_3c4=run.dyn.marker=run.marker?run.marker:t.next("marker");
}
var _3cf,_3d0,_3d1;
if(this.opt.shadows&&_3c1){
var sh=this.opt.shadows,_3d3=new dojo.Color([0,0,0,0.3]),_3d4=dojo.map(_3c8,function(c){
return {x:c.x+sh.dx,y:c.y+sh.dy};
}),_3d6=dojo.clone(_3c2?_3c2:_3c1);
_3d6.color=_3d3;
_3d6.width+=sh.dw?sh.dw:0;
if(this.opt.lines){
if(this.opt.tension){
run.dyn.shadow=s.createPath(dc.curve(_3d4,this.opt.tension)).setStroke(_3d6).getStroke();
}else{
run.dyn.shadow=s.createPolyline(_3d4).setStroke(_3d6).getStroke();
}
}
if(this.opt.markers){
_3d1=dojo.map(_3d4,function(c){
return s.createPath("M"+c.x+" "+c.y+" "+_3c4).setStroke(_3d6).setFill(_3d3);
},this);
}
}
if(this.opt.lines){
if(_3c2){
if(this.opt.tension){
run.dyn.outline=s.createPath(_3cb).setStroke(_3c2).getStroke();
}else{
run.dyn.outline=s.createPolyline(_3c8).setStroke(_3c2).getStroke();
}
}
if(this.opt.tension){
run.dyn.stroke=s.createPath(_3cb).setStroke(_3c1).getStroke();
}else{
run.dyn.stroke=s.createPolyline(_3c8).setStroke(_3c1).getStroke();
}
}
if(this.opt.markers){
_3cf=new Array(_3c8.length);
_3d0=new Array(_3c8.length);
dojo.forEach(_3c8,function(c,i){
var path="M"+c.x+" "+c.y+" "+_3c4;
if(_3c2){
_3d0[i]=s.createPath(path).setStroke(_3c2);
}
_3cf[i]=s.createPath(path).setStroke(_3c1).setFill(_3c1.color);
},this);
if(_3c5){
dojo.forEach(_3cf,function(s,i){
var o={element:"marker",index:i,run:run,plot:this,hAxis:this.hAxis||null,vAxis:this.vAxis||null,shape:s,outline:_3d0[i]||null,shadow:_3d1&&_3d1[i]||null,cx:_3c8[i].x,cy:_3c8[i].y,x:i+1,y:run.data[i]};
this._connectEvents(s,o);
},this);
}
}
run.dirty=false;
for(var j=0;j<run.data.length;++j){
var v=run.data[j];
if(isNaN(v)){
v=0;
}
acc[j]-=v;
}
}
this.dirty=false;
return this;
}});
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.StackedLines"]){
dojo._hasResource["dojox.charting.plot2d.StackedLines"]=true;
dojo.provide("dojox.charting.plot2d.StackedLines");
dojo.declare("dojox.charting.plot2d.StackedLines",dojox.charting.plot2d.Stacked,{constructor:function(){
this.opt.lines=true;
}});
}
if(!dojo._hasResource["dojox.charting.plot2d.StackedAreas"]){
dojo._hasResource["dojox.charting.plot2d.StackedAreas"]=true;
dojo.provide("dojox.charting.plot2d.StackedAreas");
dojo.declare("dojox.charting.plot2d.StackedAreas",dojox.charting.plot2d.Stacked,{constructor:function(){
this.opt.lines=true;
this.opt.areas=true;
}});
}
if(!dojo._hasResource["dojox.charting.plot2d.Columns"]){
dojo._hasResource["dojox.charting.plot2d.Columns"]=true;
dojo.provide("dojox.charting.plot2d.Columns");
(function(){
var df=dojox.lang.functional,du=dojox.lang.utils,dc=dojox.charting.plot2d.common,_3e1=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.Columns",dojox.charting.plot2d.Base,{defaultParams:{hAxis:"x",vAxis:"y",gap:0,shadows:null},optionalParams:{},constructor:function(_3e2,_3e3){
this.opt=dojo.clone(this.defaultParams);
du.updateWithObject(this.opt,_3e3);
this.series=[];
this.hAxis=this.opt.hAxis;
this.vAxis=this.opt.vAxis;
},calculateAxes:function(dim){
var _3e5=dc.collectSimpleStats(this.series);
_3e5.hmin-=0.5;
_3e5.hmax+=0.5;
this._calc(dim,_3e5);
return this;
},render:function(dim,_3e7){
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_3e1);
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(item){
item.cleanGroup(s);
});
}
var t=this.chart.theme,_3eb,_3ec,fill,f,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler),gap=this.opt.gap<this._hScaler.bounds.scale/3?this.opt.gap:0,_3f2=Math.max(0,this._vScaler.bounds.lower),_3f3=vt(_3f2),xoff=_3e7.l+this._hScaler.bounds.scale*(0.5-this._hScaler.bounds.lower)+gap,yoff=dim.height-_3e7.b-this._vScaler.bounds.scale*(_3f2-this._vScaler.bounds.lower),_3f6=this._hScaler.bounds.scale-2*gap,_3f7=this.events();
for(var i=this.series.length-1;i>=0;--i){
var run=this.series[i];
if(!this.dirty&&!run.dirty){
continue;
}
run.cleanGroup();
var s=run.group;
if(!run.fill||!run.stroke){
_3eb=run.dyn.color=new dojo.Color(t.next("color"));
}
_3ec=run.stroke?run.stroke:dc.augmentStroke(t.series.stroke,_3eb);
fill=run.fill?run.fill:dc.augmentFill(t.series.fill,_3eb);
for(var j=0;j<run.data.length;++j){
var v=run.data[j],vv=vt(v),_3fd=vv-_3f3,h=Math.abs(_3fd);
if(_3f6>=1&&h>=1){
var rect={x:_3e7.l+ht(j+0.5)+gap,y:dim.height-_3e7.b-(v>_3f2?vv:_3f3),width:_3f6,height:h},_400=s.createRect(rect).setFill(fill).setStroke(_3ec);
run.dyn.fill=_400.getFill();
run.dyn.stroke=_400.getStroke();
if(_3f7){
var o={element:"column",index:j,run:run,plot:this,hAxis:this.hAxis||null,vAxis:this.vAxis||null,shape:_400,x:j+0.5,y:v};
this._connectEvents(_400,o);
}
}
}
run.dirty=false;
}
this.dirty=false;
return this;
}});
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.StackedColumns"]){
dojo._hasResource["dojox.charting.plot2d.StackedColumns"]=true;
dojo.provide("dojox.charting.plot2d.StackedColumns");
(function(){
var df=dojox.lang.functional,dc=dojox.charting.plot2d.common,_404=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.StackedColumns",dojox.charting.plot2d.Columns,{calculateAxes:function(dim){
var _406=dc.collectStackedStats(this.series);
this._maxRunLength=_406.hmax;
_406.hmin-=0.5;
_406.hmax+=0.5;
this._calc(dim,_406);
return this;
},render:function(dim,_408){
var acc=df.repeat(this._maxRunLength,"-> 0",0);
for(var i=0;i<this.series.length;++i){
var run=this.series[i];
for(var j=0;j<run.data.length;++j){
var v=run.data[j];
if(isNaN(v)){
v=0;
}
acc[j]+=v;
}
}
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_404);
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(item){
item.cleanGroup(s);
});
}
var t=this.chart.theme,_411,_412,fill,f,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler);
gap=this.opt.gap<this._hScaler.bounds.scale/3?this.opt.gap:0,width=this._hScaler.bounds.scale-2*gap,events=this.events();
for(var i=this.series.length-1;i>=0;--i){
var run=this.series[i];
if(!this.dirty&&!run.dirty){
continue;
}
run.cleanGroup();
var s=run.group;
if(!run.fill||!run.stroke){
_411=run.dyn.color=new dojo.Color(t.next("color"));
}
_412=run.stroke?run.stroke:dc.augmentStroke(t.series.stroke,_411);
fill=run.fill?run.fill:dc.augmentFill(t.series.fill,_411);
for(var j=0;j<acc.length;++j){
var v=acc[j],_417=vt(v);
if(width>=1&&_417>=1){
var _418=s.createRect({x:_408.l+ht(j+0.5)+gap,y:dim.height-_408.b-vt(v),width:width,height:_417}).setFill(fill).setStroke(_412);
run.dyn.fill=_418.getFill();
run.dyn.stroke=_418.getStroke();
if(events){
var o={element:"column",index:j,run:run,plot:this,hAxis:this.hAxis||null,vAxis:this.vAxis||null,shape:_418,x:j+0.5,y:v};
this._connectEvents(_418,o);
}
}
}
run.dirty=false;
for(var j=0;j<run.data.length;++j){
var v=run.data[j];
if(isNaN(v)){
v=0;
}
acc[j]-=v;
}
}
this.dirty=false;
return this;
}});
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.ClusteredColumns"]){
dojo._hasResource["dojox.charting.plot2d.ClusteredColumns"]=true;
dojo.provide("dojox.charting.plot2d.ClusteredColumns");
(function(){
var df=dojox.lang.functional,dc=dojox.charting.plot2d.common,_41c=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.ClusteredColumns",dojox.charting.plot2d.Columns,{render:function(dim,_41e){
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_41c);
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(item){
item.cleanGroup(s);
});
}
var t=this.chart.theme,_422,_423,fill,f,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler),gap=this.opt.gap<this._hScaler.bounds.scale/3?this.opt.gap:0,_429=(this._hScaler.bounds.scale-2*gap)/this.series.length,_42a=Math.max(0,this._vScaler.bounds.lower),_42b=vt(_42a),_42c=_429,_42d=this.events();
for(var i=0;i<this.series.length;++i){
var run=this.series[i],_430=_429*i;
if(!this.dirty&&!run.dirty){
continue;
}
run.cleanGroup();
var s=run.group;
if(!run.fill||!run.stroke){
_422=run.dyn.color=new dojo.Color(t.next("color"));
}
_423=run.stroke?run.stroke:dc.augmentStroke(t.series.stroke,_422);
fill=run.fill?run.fill:dc.augmentFill(t.series.fill,_422);
for(var j=0;j<run.data.length;++j){
var v=run.data[j],vv=vt(v),_434=vv-_42b,h=Math.abs(_434);
if(_42c>=1&&h>=1){
var _436=s.createRect({x:_41e.l+ht(j+0.5)+gap+_430,y:dim.height-_41e.b-(v>_42a?vv:_42b),width:_42c,height:h}).setFill(fill).setStroke(_423);
run.dyn.fill=_436.getFill();
run.dyn.stroke=_436.getStroke();
if(_42d){
var o={element:"column",index:j,run:run,plot:this,hAxis:this.hAxis||null,vAxis:this.vAxis||null,shape:_436,x:j+0.5,y:v};
this._connectEvents(_436,o);
}
}
}
run.dirty=false;
}
this.dirty=false;
return this;
}});
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.Bars"]){
dojo._hasResource["dojox.charting.plot2d.Bars"]=true;
dojo.provide("dojox.charting.plot2d.Bars");
(function(){
var df=dojox.lang.functional,du=dojox.lang.utils,dc=dojox.charting.plot2d.common,_43b=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.Bars",dojox.charting.plot2d.Base,{defaultParams:{hAxis:"x",vAxis:"y",gap:0,shadows:null},optionalParams:{},constructor:function(_43c,_43d){
this.opt=dojo.clone(this.defaultParams);
du.updateWithObject(this.opt,_43d);
this.series=[];
this.hAxis=this.opt.hAxis;
this.vAxis=this.opt.vAxis;
},calculateAxes:function(dim){
var _43f=dc.collectSimpleStats(this.series),t;
_43f.hmin-=0.5;
_43f.hmax+=0.5;
t=_43f.hmin,_43f.hmin=_43f.vmin,_43f.vmin=t;
t=_43f.hmax,_43f.hmax=_43f.vmax,_43f.vmax=t;
this._calc(dim,_43f);
return this;
},render:function(dim,_442){
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_43b);
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(item){
item.cleanGroup(s);
});
}
var t=this.chart.theme,_446,_447,fill,f,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler);
gap=this.opt.gap<this._vScaler.bounds.scale/3?this.opt.gap:0,baseline=Math.max(0,this._hScaler.bounds.lower),baselineWidth=ht(baseline),height=this._vScaler.bounds.scale-2*gap,events=this.events();
for(var i=this.series.length-1;i>=0;--i){
var run=this.series[i];
if(!this.dirty&&!run.dirty){
continue;
}
run.cleanGroup();
var s=run.group;
if(!run.fill||!run.stroke){
_446=run.dyn.color=new dojo.Color(t.next("color"));
}
_447=run.stroke?run.stroke:dc.augmentStroke(t.series.stroke,_446);
fill=run.fill?run.fill:dc.augmentFill(t.series.fill,_446);
for(var j=0;j<run.data.length;++j){
var v=run.data[j],hv=ht(v),_451=hv-baselineWidth,w=Math.abs(_451);
if(w>=1&&height>=1){
var _453=s.createRect({x:_442.l+(v<baseline?hv:baselineWidth),y:dim.height-_442.b-vt(j+1.5)+gap,width:w,height:height}).setFill(fill).setStroke(_447);
run.dyn.fill=_453.getFill();
run.dyn.stroke=_453.getStroke();
if(events){
var o={element:"bar",index:j,run:run,plot:this,hAxis:this.hAxis||null,vAxis:this.vAxis||null,shape:_453,x:v,y:j+1.5};
this._connectEvents(_453,o);
}
}
}
run.dirty=false;
}
this.dirty=false;
return this;
}});
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.StackedBars"]){
dojo._hasResource["dojox.charting.plot2d.StackedBars"]=true;
dojo.provide("dojox.charting.plot2d.StackedBars");
(function(){
var df=dojox.lang.functional,dc=dojox.charting.plot2d.common,_457=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.StackedBars",dojox.charting.plot2d.Bars,{calculateAxes:function(dim){
var _459=dc.collectStackedStats(this.series),t;
this._maxRunLength=_459.hmax;
_459.hmin-=0.5;
_459.hmax+=0.5;
t=_459.hmin,_459.hmin=_459.vmin,_459.vmin=t;
t=_459.hmax,_459.hmax=_459.vmax,_459.vmax=t;
this._calc(dim,_459);
return this;
},render:function(dim,_45c){
var acc=df.repeat(this._maxRunLength,"-> 0",0);
for(var i=0;i<this.series.length;++i){
var run=this.series[i];
for(var j=0;j<run.data.length;++j){
var v=run.data[j];
if(isNaN(v)){
v=0;
}
acc[j]+=v;
}
}
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_457);
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(item){
item.cleanGroup(s);
});
}
var t=this.chart.theme,_465,_466,fill,f,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler);
gap=this.opt.gap<this._vScaler.bounds.scale/3?this.opt.gap:0,height=this._vScaler.bounds.scale-2*gap,events=this.events();
for(var i=this.series.length-1;i>=0;--i){
var run=this.series[i];
if(!this.dirty&&!run.dirty){
continue;
}
run.cleanGroup();
var s=run.group;
if(!run.fill||!run.stroke){
_465=run.dyn.color=new dojo.Color(t.next("color"));
}
_466=run.stroke?run.stroke:dc.augmentStroke(t.series.stroke,_465);
fill=run.fill?run.fill:dc.augmentFill(t.series.fill,_465);
for(var j=0;j<acc.length;++j){
var v=acc[j],_46b=ht(v);
if(_46b>=1&&height>=1){
var _46c=s.createRect({x:_45c.l,y:dim.height-_45c.b-vt(j+1.5)+gap,width:_46b,height:height}).setFill(fill).setStroke(_466);
run.dyn.fill=_46c.getFill();
run.dyn.stroke=_46c.getStroke();
if(events){
var o={element:"bar",index:j,run:run,plot:this,hAxis:this.hAxis||null,vAxis:this.vAxis||null,shape:_46c,x:v,y:j+1.5};
this._connectEvents(_46c,o);
}
}
}
run.dirty=false;
for(var j=0;j<run.data.length;++j){
var v=run.data[j];
if(isNaN(v)){
v=0;
}
acc[j]-=v;
}
}
this.dirty=false;
return this;
}});
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.ClusteredBars"]){
dojo._hasResource["dojox.charting.plot2d.ClusteredBars"]=true;
dojo.provide("dojox.charting.plot2d.ClusteredBars");
(function(){
var df=dojox.lang.functional,dc=dojox.charting.plot2d.common,_470=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.ClusteredBars",dojox.charting.plot2d.Bars,{render:function(dim,_472){
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_470);
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(item){
item.cleanGroup(s);
});
}
var t=this.chart.theme,_476,_477,fill,f,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler);
gap=this.opt.gap<this._vScaler.bounds.scale/3?this.opt.gap:0,thickness=(this._vScaler.bounds.scale-2*gap)/this.series.length,baseline=Math.max(0,this._hScaler.bounds.lower),baselineWidth=ht(baseline),height=thickness,events=this.events();
for(var i=this.series.length-1;i>=0;--i){
var run=this.series[i],_47e=thickness*(this.series.length-i-1);
if(!this.dirty&&!run.dirty){
continue;
}
run.cleanGroup();
var s=run.group;
if(!run.fill||!run.stroke){
_476=run.dyn.color=new dojo.Color(t.next("color"));
}
_477=run.stroke?run.stroke:dc.augmentStroke(t.series.stroke,_476);
fill=run.fill?run.fill:dc.augmentFill(t.series.fill,_476);
for(var j=0;j<run.data.length;++j){
var v=run.data[j],hv=ht(v),_482=hv-baselineWidth,w=Math.abs(_482);
if(w>=1&&height>=1){
var _484=s.createRect({x:_472.l+(v<baseline?hv:baselineWidth),y:dim.height-_472.b-vt(j+1.5)+gap+_47e,width:w,height:height}).setFill(fill).setStroke(_477);
run.dyn.fill=_484.getFill();
run.dyn.stroke=_484.getStroke();
if(events){
var o={element:"bar",index:j,run:run,plot:this,hAxis:this.hAxis||null,vAxis:this.vAxis||null,shape:_484,x:v,y:j+1.5};
this._connectEvents(_484,o);
}
}
}
run.dirty=false;
}
this.dirty=false;
return this;
}});
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.Grid"]){
dojo._hasResource["dojox.charting.plot2d.Grid"]=true;
dojo.provide("dojox.charting.plot2d.Grid");
(function(){
var du=dojox.lang.utils;
dojo.declare("dojox.charting.plot2d.Grid",dojox.charting.Element,{defaultParams:{hAxis:"x",vAxis:"y",hMajorLines:true,hMinorLines:false,vMajorLines:true,vMinorLines:false,hStripes:"none",vStripes:"none"},optionalParams:{},constructor:function(_487,_488){
this.opt=dojo.clone(this.defaultParams);
du.updateWithObject(this.opt,_488);
this.hAxis=this.opt.hAxis;
this.vAxis=this.opt.vAxis;
this.dirty=true;
},clear:function(){
this._hAxis=null;
this._vAxis=null;
this.dirty=true;
return this;
},setAxis:function(axis){
if(axis){
this[axis.vertical?"_vAxis":"_hAxis"]=axis;
}
return this;
},addSeries:function(run){
return this;
},calculateAxes:function(dim){
return this;
},isDirty:function(){
return this.dirty||this._hAxis&&this._hAxis.dirty||this._vAxis&&this._vAxis.dirty;
},getRequiredColors:function(){
return 0;
},render:function(dim,_48d){
this.dirty=this.isDirty();
if(!this.dirty){
return this;
}
this.cleanGroup();
var s=this.group,ta=this.chart.theme.axis,_490=this._vAxis.getTicks(),_491=this._hAxis.getScaler(),_492=this._vAxis.getScaler(),ht=_491.scaler.getTransformerFromModel(_491),vt=_492.scaler.getTransformerFromModel(_492);
if(this.opt.hMinorLines){
dojo.forEach(_490.minor,function(tick){
var y=dim.height-_48d.b-vt(tick.value);
s.createLine({x1:_48d.l,y1:y,x2:dim.width-_48d.r,y2:y}).setStroke(ta.minorTick);
});
}
if(this.opt.hMajorLines){
dojo.forEach(_490.major,function(tick){
var y=dim.height-_48d.b-vt(tick.value);
s.createLine({x1:_48d.l,y1:y,x2:dim.width-_48d.r,y2:y}).setStroke(ta.majorTick);
});
}
_490=this._hAxis.getTicks();
if(this.opt.vMinorLines){
dojo.forEach(_490.minor,function(tick){
var x=_48d.l+ht(tick.value);
s.createLine({x1:x,y1:_48d.t,x2:x,y2:dim.height-_48d.b}).setStroke(ta.minorTick);
});
}
if(this.opt.vMajorLines){
dojo.forEach(_490.major,function(tick){
var x=_48d.l+ht(tick.value);
s.createLine({x1:x,y1:_48d.t,x2:x,y2:dim.height-_48d.b}).setStroke(ta.majorTick);
});
}
this.dirty=false;
return this;
}});
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.Pie"]){
dojo._hasResource["dojox.charting.plot2d.Pie"]=true;
dojo.provide("dojox.charting.plot2d.Pie");
(function(){
var df=dojox.lang.functional,du=dojox.lang.utils,dc=dojox.charting.plot2d.common,da=dojox.charting.axis2d.common,g=dojox.gfx;
dojo.declare("dojox.charting.plot2d.Pie",dojox.charting.Element,{defaultParams:{labels:true,ticks:false,fixed:true,precision:1,labelOffset:20,labelStyle:"default",htmlLabels:true},optionalParams:{font:"",fontColor:"",radius:0},constructor:function(_4a2,_4a3){
this.opt=dojo.clone(this.defaultParams);
du.updateWithObject(this.opt,_4a3);
du.updateWithPattern(this.opt,_4a3,this.optionalParams);
this.run=null;
this.dyn=[];
},clear:function(){
this.dirty=true;
this.dyn=[];
return this;
},setAxis:function(axis){
return this;
},addSeries:function(run){
this.run=run;
return this;
},calculateAxes:function(dim){
return this;
},getRequiredColors:function(){
return this.run?this.run.data.length:0;
},plotEvent:function(o){
},connect:function(_4a8,_4a9){
this.dirty=true;
return dojo.connect(this,"plotEvent",_4a8,_4a9);
},events:function(){
var ls=this.plotEvent._listeners;
if(!ls||!ls.length){
return false;
}
for(var i in ls){
if(!(i in Array.prototype)){
return true;
}
}
return false;
},_connectEvents:function(_4ac,o){
_4ac.connect("onmouseover",this,function(e){
o.type="onmouseover";
o.event=e;
this.plotEvent(o);
});
_4ac.connect("onmouseout",this,function(e){
o.type="onmouseout";
o.event=e;
this.plotEvent(o);
});
_4ac.connect("onclick",this,function(e){
o.type="onclick";
o.event=e;
this.plotEvent(o);
});
},render:function(dim,_4b2){
if(!this.dirty){
return this;
}
this.dirty=false;
this.cleanGroup();
var s=this.group,_4b4,t=this.chart.theme;
var rx=(dim.width-_4b2.l-_4b2.r)/2,ry=(dim.height-_4b2.t-_4b2.b)/2,r=Math.min(rx,ry),_4b9="font" in this.opt?this.opt.font:t.axis.font,size=_4b9?g.normalizedLength(g.splitFontString(_4b9).size):0,_4bb="fontColor" in this.opt?this.opt.fontColor:t.axis.fontColor,_4bc=0,step,sum,_4bf,_4c0,_4c1,_4c2,run=this.run.data,_4c4=this.events();
if(typeof run[0]=="number"){
sum=df.foldl1(run,"+");
_4bf=dojo.map(run,function(x){
return x/sum;
});
if(this.opt.labels){
_4c0=dojo.map(_4bf,function(x){
return this._getLabel(x*100)+"%";
},this);
}
}else{
sum=df.foldl1(run,function(a,b){
return {y:a.y+b.y};
}).y;
_4bf=df.map(run,function(x){
return x.y/sum;
});
if(this.opt.labels){
_4c0=dojo.map(_4bf,function(x,i){
var v=run[i];
return "text" in v?v.text:this._getLabel(x*100)+"%";
},this);
}
}
if(this.opt.labels){
_4c1=df.foldl1(df.map(_4c0,function(_4cd){
return dojox.gfx._base._getTextBox(_4cd,{font:_4b9}).w;
},this),"Math.max(a, b)")/2;
if(this.opt.labelOffset<0){
r=Math.min(rx-2*_4c1,ry-size)+this.opt.labelOffset;
}
_4c2=r-this.opt.labelOffset;
}
if("radius" in this.opt){
r=this.opt.radius;
_4c2=r-this.opt.labelOffset;
}
var _4ce={cx:_4b2.l+rx,cy:_4b2.t+ry,r:r};
this.dyn=[];
if(!this.run||!run.length){
return this;
}
if(run.length==1){
_4b4=new dojo.Color(t.next("color"));
var _4cf=s.createCircle(_4ce).setFill(dc.augmentFill(t.run.fill,_4b4)).setStroke(dc.augmentStroke(t.series.stroke,_4b4));
this.dyn.push({color:_4b4,fill:_4cf.getFill(),stroke:_4cf.getStroke()});
if(this.opt.labels){
var elem=da.createText[this.opt.htmlLabels&&dojox.gfx.renderer!="vml"?"html":"gfx"](this.chart,s,_4ce.cx,_4ce.cy+size/2,"middle","100%",_4b9,_4bb);
if(this.opt.htmlLabels){
this.htmlElements.push(elem);
}
}
return this;
}
dojo.forEach(_4bf,function(x,i){
var end=_4bc+x*2*Math.PI,v=run[i];
if(i+1==_4bf.length){
end=2*Math.PI;
}
var step=end-_4bc,x1=_4ce.cx+r*Math.cos(_4bc),y1=_4ce.cy+r*Math.sin(_4bc),x2=_4ce.cx+r*Math.cos(end),y2=_4ce.cy+r*Math.sin(end);
var _4da,fill,_4dc;
if(typeof v=="object"){
_4da="color" in v?v.color:new dojo.Color(t.next("color"));
fill="fill" in v?v.fill:dc.augmentFill(t.series.fill,_4da);
_4dc="stroke" in v?v.stroke:dc.augmentStroke(t.series.stroke,_4da);
}else{
_4da=new dojo.Color(t.next("color"));
fill=dc.augmentFill(t.series.fill,_4da);
_4dc=dc.augmentStroke(t.series.stroke,_4da);
}
var _4dd=s.createPath({}).moveTo(_4ce.cx,_4ce.cy).lineTo(x1,y1).arcTo(r,r,0,step>Math.PI,true,x2,y2).lineTo(_4ce.cx,_4ce.cy).closePath().setFill(fill).setStroke(_4dc);
this.dyn.push({color:_4da,fill:fill,stroke:_4dc});
if(_4c4){
var o={element:"slice",index:i,run:this.run,plot:this,shape:_4dd,x:i,y:typeof v=="number"?v:v.y,cx:_4ce.cx,cy:_4ce.cy,cr:r};
this._connectEvents(_4dd,o);
}
_4bc=end;
},this);
if(this.opt.labels){
_4bc=0;
dojo.forEach(_4bf,function(_4df,i){
var end=_4bc+_4df*2*Math.PI,v=run[i];
if(i+1==_4bf.length){
end=2*Math.PI;
}
var _4e3=(_4bc+end)/2,x=_4ce.cx+_4c2*Math.cos(_4e3),y=_4ce.cy+_4c2*Math.sin(_4e3)+size/2;
var elem=da.createText[this.opt.htmlLabels&&dojox.gfx.renderer!="vml"?"html":"gfx"](this.chart,s,x,y,"middle",_4c0[i],_4b9,(typeof v=="object"&&"fontColor" in v)?v.fontColor:_4bb);
if(this.opt.htmlLabels){
this.htmlElements.push(elem);
}
_4bc=end;
},this);
}
return this;
},_getLabel:function(_4e7){
return this.opt.fixed?_4e7.toFixed(this.opt.precision):_4e7.toString();
}});
})();
}
if(!dojo._hasResource["dojox.charting.plot2d.Bubble"]){
dojo._hasResource["dojox.charting.plot2d.Bubble"]=true;
dojo.provide("dojox.charting.plot2d.Bubble");
(function(){
var df=dojox.lang.functional,du=dojox.lang.utils,dc=dojox.charting.plot2d.common,_4eb=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.Bubble",dojox.charting.plot2d.Base,{defaultParams:{hAxis:"x",vAxis:"y"},optionalParams:{},constructor:function(_4ec,_4ed){
this.opt=dojo.clone(this.defaultParams);
du.updateWithObject(this.opt,_4ed);
this.series=[];
this.hAxis=this.opt.hAxis;
this.vAxis=this.opt.vAxis;
},calculateAxes:function(dim){
this._calc(dim,dc.collectSimpleStats(this.series));
return this;
},render:function(dim,_4f0){
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_4eb);
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(item){
item.cleanGroup(s);
});
}
var t=this.chart.theme,_4f4,_4f5,_4f6,_4f7,_4f8,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler),_4fb=this.events();
for(var i=this.series.length-1;i>=0;--i){
var run=this.series[i];
if(!this.dirty&&!run.dirty){
continue;
}
run.cleanGroup();
if(!run.data.length){
run.dirty=false;
continue;
}
if(typeof run.data[0]=="number"){
console.warn("dojox.charting.plot2d.Bubble: the data in the following series cannot be rendered as a bubble chart; ",run);
continue;
}
var s=run.group,_4fe=dojo.map(run.data,function(v,i){
return {x:ht(v.x)+_4f0.l,y:dim.height-_4f0.b-vt(v.y),radius:this._vScaler.bounds.scale*(v.size/2)};
},this);
if(run.fill){
_4f6=run.fill;
}else{
if(run.stroke){
_4f6=run.stroke;
}else{
_4f6=run.dyn.color=new dojo.Color(t.next("color"));
}
}
run.dyn.fill=_4f6;
_4f4=run.dyn.stroke=run.stroke?dc.makeStroke(run.stroke):dc.augmentStroke(t.series.stroke,_4f6);
var _501=null,_502=null,_503=null;
if(this.opt.shadows&&_4f4){
var sh=this.opt.shadows,_4f8=new dojo.Color([0,0,0,0.2]),_4f7=dojo.clone(_4f5?_4f5:_4f4);
_4f7.color=_4f8;
_4f7.width+=sh.dw?sh.dw:0;
run.dyn.shadow=_4f7;
shadowMarkers=dojo.map(_4fe,function(item){
var sh=this.opt.shadows;
return s.createCircle({cx:item.x+sh.dx,cy:item.y+sh.dy,r:item.radius}).setStroke(_4f7).setFill(_4f8);
},this);
}
if(run.outline||t.series.outline){
_4f5=dc.makeStroke(run.outline?run.outline:t.series.outline);
_4f5.width=2*_4f5.width+_4f4.width;
run.dyn.outline=_4f5;
_502=dojo.map(_4fe,function(item){
s.createCircle({cx:item.x,cy:item.y,r:item.radius}).setStroke(_4f5);
},this);
}
_501=dojo.map(_4fe,function(item){
return s.createCircle({cx:item.x,cy:item.y,r:item.radius}).setStroke(_4f4).setFill(_4f6);
},this);
if(_4fb){
dojo.forEach(_501,function(s,i){
var o={element:"circle",index:i,run:run,plot:this,hAxis:this.hAxis||null,vAxis:this.vAxis||null,shape:s,outline:_502&&_502[i]||null,shadow:_503&&_503[i]||null,x:run.data[i].x,y:run.data[i].y,r:run.data[i].size/2,cx:_4fe[i].x,cy:_4fe[i].y,cr:_4fe[i].radius};
this._connectEvents(s,o);
},this);
}
run.dirty=false;
}
this.dirty=false;
return this;
}});
})();
}
if(!dojo._hasResource["dojox.charting.Chart2D"]){
dojo._hasResource["dojox.charting.Chart2D"]=true;
dojo.provide("dojox.charting.Chart2D");
(function(){
var df=dojox.lang.functional,dc=dojox.charting,_50e=df.lambda("item.clear()"),_50f=df.lambda("item.purgeGroup()"),_510=df.lambda("item.destroy()"),_511=df.lambda("item.dirty = false"),_512=df.lambda("item.dirty = true");
dojo.declare("dojox.charting.Chart2D",null,{constructor:function(node,_514){
if(!_514){
_514={};
}
this.margins=_514.margins?_514.margins:{l:10,t:10,r:10,b:10};
this.stroke=_514.stroke;
this.fill=_514.fill;
this.theme=null;
this.axes={};
this.stack=[];
this.plots={};
this.series=[];
this.runs={};
this.dirty=true;
this.coords=null;
this.node=dojo.byId(node);
var box=dojo.marginBox(node);
this.surface=dojox.gfx.createSurface(this.node,box.w,box.h);
},destroy:function(){
dojo.forEach(this.series,_510);
dojo.forEach(this.stack,_510);
df.forIn(this.axes,_510);
},getCoords:function(){
if(!this.coords){
this.coords=dojo.coords(this.node,true);
}
return this.coords;
},setTheme:function(_516){
this.theme=_516;
this.dirty=true;
return this;
},addAxis:function(name,_518){
var axis;
if(!_518||!("type" in _518)){
axis=new dc.axis2d.Default(this,_518);
}else{
axis=typeof _518.type=="string"?new dc.axis2d[_518.type](this,_518):new _518.type(this,_518);
}
axis.name=name;
axis.dirty=true;
if(name in this.axes){
this.axes[name].destroy();
}
this.axes[name]=axis;
this.dirty=true;
return this;
},getAxis:function(name){
return this.axes[name];
},addPlot:function(name,_51c){
var plot;
if(!_51c||!("type" in _51c)){
plot=new dc.plot2d.Default(this,_51c);
}else{
plot=typeof _51c.type=="string"?new dc.plot2d[_51c.type](this,_51c):new _51c.type(this,_51c);
}
plot.name=name;
plot.dirty=true;
if(name in this.plots){
this.stack[this.plots[name]].destroy();
this.stack[this.plots[name]]=plot;
}else{
this.plots[name]=this.stack.length;
this.stack.push(plot);
}
this.dirty=true;
return this;
},addSeries:function(name,data,_520){
var run=new dc.Series(this,data,_520);
if(name in this.runs){
this.series[this.runs[name]].destroy();
this.series[this.runs[name]]=run;
}else{
this.runs[name]=this.series.length;
this.series.push(run);
}
run.name=name;
this.dirty=true;
if(!("ymin" in run)&&"min" in run){
run.ymin=run.min;
}
if(!("ymax" in run)&&"max" in run){
run.ymax=run.max;
}
return this;
},updateSeries:function(name,data){
if(name in this.runs){
var run=this.series[this.runs[name]],plot=this.stack[this.plots[run.plot]],axis;
run.data=data;
run.dirty=true;
if(plot.hAxis){
axis=this.axes[plot.hAxis];
if(axis.dependOnData()){
axis.dirty=true;
dojo.forEach(this.stack,function(p){
if(p.hAxis&&p.hAxis==plot.hAxis){
p.dirty=true;
}
});
}
}else{
plot.dirty=true;
}
if(plot.vAxis){
axis=this.axes[plot.vAxis];
if(axis.dependOnData()){
axis.dirty=true;
dojo.forEach(this.stack,function(p){
if(p.vAxis&&p.vAxis==plot.vAxis){
p.dirty=true;
}
});
}
}else{
plot.dirty=true;
}
}
return this;
},resize:function(_529,_52a){
var box;
switch(arguments.length){
case 0:
box=dojo.marginBox(this.node);
break;
case 1:
box=_529;
break;
default:
box={w:_529,h:_52a};
break;
}
dojo.marginBox(this.node,box);
this.surface.setDimensions(box.w,box.h);
this.dirty=true;
this.coords=null;
return this.render();
},getGeometry:function(){
var ret={};
df.forIn(this.axes,function(axis){
if(axis.initialized()){
ret[axis.name]={name:axis.name,vertical:axis.vertical,scaler:axis.scaler,ticks:axis.ticks};
}
});
return ret;
},setAxisWindow:function(name,_52f,_530){
var axis=this.axes[name];
if(axis){
axis.setWindow(_52f,_530);
}
return this;
},setWindow:function(sx,sy,dx,dy){
if(!("plotArea" in this)){
this.calculateGeometry();
}
df.forIn(this.axes,function(axis){
var _537,_538,_539=axis.getScaler().bounds,s=_539.span/(_539.upper-_539.lower);
if(axis.vertical){
_537=sy;
_538=dy/s/_537;
}else{
_537=sx;
_538=dx/s/_537;
}
axis.setWindow(_537,_538);
});
return this;
},calculateGeometry:function(){
if(this.dirty){
return this.fullGeometry();
}
dojo.forEach(this.stack,function(plot){
if(plot.dirty||(plot.hAxis&&this.axes[plot.hAxis].dirty)||(plot.vAxis&&this.axes[plot.vAxis].dirty)){
plot.calculateAxes(this.plotArea);
}
},this);
return this;
},fullGeometry:function(){
this._makeDirty();
dojo.forEach(this.stack,_50e);
if(!this.theme){
this.theme=new dojox.charting.Theme(dojox.charting._def);
}
dojo.forEach(this.series,function(run){
if(!(run.plot in this.plots)){
var plot=new dc.plot2d.Default(this,{});
plot.name=run.plot;
this.plots[run.plot]=this.stack.length;
this.stack.push(plot);
}
this.stack[this.plots[run.plot]].addSeries(run);
},this);
dojo.forEach(this.stack,function(plot){
if(plot.hAxis){
plot.setAxis(this.axes[plot.hAxis]);
}
if(plot.vAxis){
plot.setAxis(this.axes[plot.vAxis]);
}
},this);
var dim=this.dim=this.surface.getDimensions();
dim.width=dojox.gfx.normalizedLength(dim.width);
dim.height=dojox.gfx.normalizedLength(dim.height);
df.forIn(this.axes,_50e);
dojo.forEach(this.stack,function(plot){
plot.calculateAxes(dim);
});
var _541=this.offsets={l:0,r:0,t:0,b:0};
df.forIn(this.axes,function(axis){
df.forIn(axis.getOffsets(),function(o,i){
_541[i]+=o;
});
});
df.forIn(this.margins,function(o,i){
_541[i]+=o;
});
this.plotArea={width:dim.width-_541.l-_541.r,height:dim.height-_541.t-_541.b};
df.forIn(this.axes,_50e);
dojo.forEach(this.stack,function(plot){
plot.calculateAxes(this.plotArea);
},this);
return this;
},render:function(){
if(this.dirty){
return this.fullRender();
}
this.calculateGeometry();
df.forEachRev(this.stack,function(plot){
plot.render(this.dim,this.offsets);
},this);
df.forIn(this.axes,function(axis){
axis.render(this.dim,this.offsets);
},this);
this._makeClean();
if(this.surface.render){
this.surface.render();
}
return this;
},fullRender:function(){
this.fullGeometry();
var _54a=this.offsets,dim=this.dim;
var _54c=df.foldl(this.stack,"z + plot.getRequiredColors()",0);
this.theme.defineColors({num:_54c,cache:false});
dojo.forEach(this.series,_50f);
df.forIn(this.axes,_50f);
dojo.forEach(this.stack,_50f);
this.surface.clear();
var t=this.theme,fill=t.plotarea&&t.plotarea.fill,_54f=t.plotarea&&t.plotarea.stroke;
if(fill){
this.surface.createRect({x:_54a.l,y:_54a.t,width:dim.width-_54a.l-_54a.r,height:dim.height-_54a.t-_54a.b}).setFill(fill);
}
if(_54f){
this.surface.createRect({x:_54a.l,y:_54a.t,width:dim.width-_54a.l-_54a.r-1,height:dim.height-_54a.t-_54a.b-1}).setStroke(_54f);
}
df.foldr(this.stack,function(z,plot){
return plot.render(dim,_54a),0;
},0);
fill=this.fill?this.fill:(t.chart&&t.chart.fill);
_54f=this.stroke?this.stroke:(t.chart&&t.chart.stroke);
if(fill=="inherit"){
var node=this.node,fill=new dojo.Color(dojo.style(node,"backgroundColor"));
while(fill.a==0&&node!=document.documentElement){
fill=new dojo.Color(dojo.style(node,"backgroundColor"));
node=node.parentNode;
}
}
if(fill){
if(_54a.l){
this.surface.createRect({width:_54a.l,height:dim.height+1}).setFill(fill);
}
if(_54a.r){
this.surface.createRect({x:dim.width-_54a.r,width:_54a.r+1,height:dim.height+1}).setFill(fill);
}
if(_54a.t){
this.surface.createRect({width:dim.width+1,height:_54a.t}).setFill(fill);
}
if(_54a.b){
this.surface.createRect({y:dim.height-_54a.b,width:dim.width+1,height:_54a.b+2}).setFill(fill);
}
}
if(_54f){
this.surface.createRect({width:dim.width-1,height:dim.height-1}).setStroke(_54f);
}
df.forIn(this.axes,function(axis){
axis.render(dim,_54a);
});
this._makeClean();
if(this.surface.render){
this.surface.render();
}
return this;
},connectToPlot:function(name,_555,_556){
return name in this.plots?this.stack[this.plots[name]].connect(_555,_556):null;
},_makeClean:function(){
dojo.forEach(this.axes,_511);
dojo.forEach(this.stack,_511);
dojo.forEach(this.series,_511);
this.dirty=false;
},_makeDirty:function(){
dojo.forEach(this.axes,_512);
dojo.forEach(this.stack,_512);
dojo.forEach(this.series,_512);
this.dirty=true;
}});
})();
}
if(!dojo._hasResource["dojox.data.dom"]){
dojo._hasResource["dojox.data.dom"]=true;
dojo.provide("dojox.data.dom");
dojo.experimental("dojox.data.dom");
dojox.data.dom.createDocument=function(str,_558){
var _559=dojo.doc;
if(!_558){
_558="text/xml";
}
if(str&&dojo.trim(str)!==""&&(typeof dojo.global["DOMParser"])!=="undefined"){
var _55a=new DOMParser();
return _55a.parseFromString(str,_558);
}else{
if((typeof dojo.global["ActiveXObject"])!=="undefined"){
var _55b=["MSXML2","Microsoft","MSXML","MSXML3"];
for(var i=0;i<_55b.length;i++){
try{
var doc=new ActiveXObject(_55b[i]+".XMLDOM");
if(str){
if(doc){
doc.async=false;
doc.loadXML(str);
return doc;
}else{
}
}else{
if(doc){
return doc;
}
}
}
catch(e){
}
}
}else{
if((_559.implementation)&&(_559.implementation.createDocument)){
if(str&&dojo.trim(str)!==""){
if(_559.createElement){
var tmp=_559.createElement("xml");
tmp.innerHTML=str;
var _55f=_559.implementation.createDocument("foo","",null);
for(var i=0;i<tmp.childNodes.length;i++){
_55f.importNode(tmp.childNodes.item(i),true);
}
return _55f;
}
}else{
return _559.implementation.createDocument("","",null);
}
}
}
}
return null;
};
dojox.data.dom.textContent=function(node,text){
if(arguments.length>1){
var _562=node.ownerDocument||dojo.doc;
dojox.data.dom.replaceChildren(node,_562.createTextNode(text));
return text;
}else{
if(node.textContent!==undefined){
return node.textContent;
}
var _563="";
if(node==null){
return _563;
}
for(var i=0;i<node.childNodes.length;i++){
switch(node.childNodes[i].nodeType){
case 1:
case 5:
_563+=dojox.data.dom.textContent(node.childNodes[i]);
break;
case 3:
case 2:
case 4:
_563+=node.childNodes[i].nodeValue;
break;
default:
break;
}
}
return _563;
}
};
dojox.data.dom.replaceChildren=function(node,_566){
var _567=[];
if(dojo.isIE){
for(var i=0;i<node.childNodes.length;i++){
_567.push(node.childNodes[i]);
}
}
dojox.data.dom.removeChildren(node);
for(var i=0;i<_567.length;i++){
dojo._destroyElement(_567[i]);
}
if(!dojo.isArray(_566)){
node.appendChild(_566);
}else{
for(var i=0;i<_566.length;i++){
node.appendChild(_566[i]);
}
}
};
dojox.data.dom.removeChildren=function(node){
var _56a=node.childNodes.length;
while(node.hasChildNodes()){
node.removeChild(node.firstChild);
}
return _56a;
};
dojox.data.dom.innerXML=function(node){
if(node.innerXML){
return node.innerXML;
}else{
if(node.xml){
return node.xml;
}else{
if(typeof XMLSerializer!="undefined"){
return (new XMLSerializer()).serializeToString(node);
}
}
}
};
}
if(!dojo._hasResource["dojo.data.util.sorter"]){
dojo._hasResource["dojo.data.util.sorter"]=true;
dojo.provide("dojo.data.util.sorter");
dojo.data.util.sorter.basicComparator=function(a,b){
var ret=0;
if(a>b||typeof a==="undefined"||a===null){
ret=1;
}else{
if(a<b||typeof b==="undefined"||b===null){
ret=-1;
}
}
return ret;
};
dojo.data.util.sorter.createSortFunction=function(_56f,_570){
var _571=[];
function createSortFunction(attr,dir){
return function(_574,_575){
var a=_570.getValue(_574,attr);
var b=_570.getValue(_575,attr);
var _578=null;
if(_570.comparatorMap){
if(typeof attr!=="string"){
attr=_570.getIdentity(attr);
}
_578=_570.comparatorMap[attr]||dojo.data.util.sorter.basicComparator;
}
_578=_578||dojo.data.util.sorter.basicComparator;
return dir*_578(a,b);
};
};
var _579;
for(var i=0;i<_56f.length;i++){
_579=_56f[i];
if(_579.attribute){
var _57b=(_579.descending)?-1:1;
_571.push(createSortFunction(_579.attribute,_57b));
}
}
return function(rowA,rowB){
var i=0;
while(i<_571.length){
var ret=_571[i++](rowA,rowB);
if(ret!==0){
return ret;
}
}
return 0;
};
};
}
if(!dojo._hasResource["dojo.data.util.simpleFetch"]){
dojo._hasResource["dojo.data.util.simpleFetch"]=true;
dojo.provide("dojo.data.util.simpleFetch");
dojo.data.util.simpleFetch.fetch=function(_580){
_580=_580||{};
if(!_580.store){
_580.store=this;
}
var self=this;
var _582=function(_583,_584){
if(_584.onError){
var _585=_584.scope||dojo.global;
_584.onError.call(_585,_583,_584);
}
};
var _586=function(_587,_588){
var _589=_588.abort||null;
var _58a=false;
var _58b=_588.start?_588.start:0;
var _58c=(_588.count&&(_588.count!==Infinity))?(_58b+_588.count):_587.length;
_588.abort=function(){
_58a=true;
if(_589){
_589.call(_588);
}
};
var _58d=_588.scope||dojo.global;
if(!_588.store){
_588.store=self;
}
if(_588.onBegin){
_588.onBegin.call(_58d,_587.length,_588);
}
if(_588.sort){
_587.sort(dojo.data.util.sorter.createSortFunction(_588.sort,self));
}
if(_588.onItem){
for(var i=_58b;(i<_587.length)&&(i<_58c);++i){
var item=_587[i];
if(!_58a){
_588.onItem.call(_58d,item,_588);
}
}
}
if(_588.onComplete&&!_58a){
var _590=null;
if(!_588.onItem){
_590=_587.slice(_58b,_58c);
}
_588.onComplete.call(_58d,_590,_588);
}
};
this._fetchItems(_580,_586,_582);
return _580;
};
}
if(!dojo._hasResource["dojo.data.util.filter"]){
dojo._hasResource["dojo.data.util.filter"]=true;
dojo.provide("dojo.data.util.filter");
dojo.data.util.filter.patternToRegExp=function(_591,_592){
var rxp="^";
var c=null;
for(var i=0;i<_591.length;i++){
c=_591.charAt(i);
switch(c){
case "\\":
rxp+=c;
i++;
rxp+=_591.charAt(i);
break;
case "*":
rxp+=".*";
break;
case "?":
rxp+=".";
break;
case "$":
case "^":
case "/":
case "+":
case ".":
case "|":
case "(":
case ")":
case "{":
case "}":
case "[":
case "]":
rxp+="\\";
default:
rxp+=c;
}
}
rxp+="$";
if(_592){
return new RegExp(rxp,"mi");
}else{
return new RegExp(rxp,"m");
}
};
}
if(!dojo._hasResource["dojox.data.HtmlStore"]){
dojo._hasResource["dojox.data.HtmlStore"]=true;
dojo.provide("dojox.data.HtmlStore");
dojo.declare("dojox.data.HtmlStore",null,{constructor:function(args){
if(args.url){
if(!args.dataId){
throw new Error("dojo.data.HtmlStore: Cannot instantiate using url without an id!");
}
this.url=args.url;
this.dataId=args.dataId;
}else{
if(args.dataId){
this._rootNode=dojo.byId(args.dataId);
this.dataId=this._rootNode.id;
}else{
this._rootNode=dojo.byId(this.dataId);
}
this._indexItems();
}
},url:"",dataId:"",_indexItems:function(){
this._getHeadings();
if(this._rootNode.rows){
if(this._rootNode.tBodies&&this._rootNode.tBodies.length>0){
this._rootNode=this._rootNode.tBodies[0];
}
var i;
for(i=0;i<this._rootNode.rows.length;i++){
this._rootNode.rows[i].store=this;
this._rootNode.rows[i]._ident=i+1;
}
}else{
var c=1;
for(i=0;i<this._rootNode.childNodes.length;i++){
if(this._rootNode.childNodes[i].nodeType===1){
this._rootNode.childNodes[i].store=this;
this._rootNode.childNodes[i]._ident=c;
c++;
}
}
}
},_getHeadings:function(){
this._headings=[];
if(this._rootNode.tHead){
dojo.forEach(this._rootNode.tHead.rows[0].cells,dojo.hitch(this,function(th){
this._headings.push(dojox.data.dom.textContent(th));
}));
}else{
this._headings=["name"];
}
},_getAllItems:function(){
var _59a=[];
var i;
if(this._rootNode.rows){
for(i=0;i<this._rootNode.rows.length;i++){
_59a.push(this._rootNode.rows[i]);
}
}else{
for(i=0;i<this._rootNode.childNodes.length;i++){
if(this._rootNode.childNodes[i].nodeType===1){
_59a.push(this._rootNode.childNodes[i]);
}
}
}
return _59a;
},_assertIsItem:function(item){
if(!this.isItem(item)){
throw new Error("dojo.data.HtmlStore: a function was passed an item argument that was not an item");
}
},_assertIsAttribute:function(_59d){
if(typeof _59d!=="string"){
throw new Error("dojo.data.HtmlStore: a function was passed an attribute argument that was not an attribute name string");
return -1;
}
return dojo.indexOf(this._headings,_59d);
},getValue:function(item,_59f,_5a0){
var _5a1=this.getValues(item,_59f);
return (_5a1.length>0)?_5a1[0]:_5a0;
},getValues:function(item,_5a3){
this._assertIsItem(item);
var _5a4=this._assertIsAttribute(_5a3);
if(_5a4>-1){
if(item.cells){
return [dojox.data.dom.textContent(item.cells[_5a4])];
}else{
return [dojox.data.dom.textContent(item)];
}
}
return [];
},getAttributes:function(item){
this._assertIsItem(item);
var _5a6=[];
for(var i=0;i<this._headings.length;i++){
if(this.hasAttribute(item,this._headings[i])){
_5a6.push(this._headings[i]);
}
}
return _5a6;
},hasAttribute:function(item,_5a9){
return this.getValues(item,_5a9).length>0;
},containsValue:function(item,_5ab,_5ac){
var _5ad=undefined;
if(typeof _5ac==="string"){
_5ad=dojo.data.util.filter.patternToRegExp(_5ac,false);
}
return this._containsValue(item,_5ab,_5ac,_5ad);
},_containsValue:function(item,_5af,_5b0,_5b1){
var _5b2=this.getValues(item,_5af);
for(var i=0;i<_5b2.length;++i){
var _5b4=_5b2[i];
if(typeof _5b4==="string"&&_5b1){
return (_5b4.match(_5b1)!==null);
}else{
if(_5b0===_5b4){
return true;
}
}
}
return false;
},isItem:function(_5b5){
if(_5b5&&_5b5.store&&_5b5.store===this){
return true;
}
return false;
},isItemLoaded:function(_5b6){
return this.isItem(_5b6);
},loadItem:function(_5b7){
this._assertIsItem(_5b7.item);
},_fetchItems:function(_5b8,_5b9,_5ba){
if(this._rootNode){
this._finishFetchItems(_5b8,_5b9,_5ba);
}else{
if(!this.url){
this._rootNode=dojo.byId(this.dataId);
}else{
var _5bb={url:this.url,handleAs:"text"};
var self=this;
var _5bd=dojo.xhrGet(_5bb);
_5bd.addCallback(function(data){
var _5bf=function(node,id){
if(node.id==id){
return node;
}
if(node.childNodes){
for(var i=0;i<node.childNodes.length;i++){
var _5c3=_5bf(node.childNodes[i],id);
if(_5c3){
return _5c3;
}
}
}
return null;
};
var d=document.createElement("div");
d.innerHTML=data;
self._rootNode=_5bf(d,self.dataId);
self._indexItems();
self._finishFetchItems(_5b8,_5b9,_5ba);
});
_5bd.addErrback(function(_5c5){
_5ba(_5c5,_5b8);
});
}
}
},_finishFetchItems:function(_5c6,_5c7,_5c8){
var _5c9=null;
var _5ca=this._getAllItems();
if(_5c6.query){
var _5cb=_5c6.queryOptions?_5c6.queryOptions.ignoreCase:false;
_5c9=[];
var _5cc={};
var key;
var _5ce;
for(key in _5c6.query){
_5ce=_5c6.query[key]+"";
if(typeof _5ce==="string"){
_5cc[key]=dojo.data.util.filter.patternToRegExp(_5ce,_5cb);
}
}
for(var i=0;i<_5ca.length;++i){
var _5d0=true;
var _5d1=_5ca[i];
for(key in _5c6.query){
_5ce=_5c6.query[key]+"";
if(!this._containsValue(_5d1,key,_5ce,_5cc[key])){
_5d0=false;
}
}
if(_5d0){
_5c9.push(_5d1);
}
}
_5c7(_5c9,_5c6);
}else{
if(_5ca.length>0){
_5c9=_5ca.slice(0,_5ca.length);
}
_5c7(_5c9,_5c6);
}
},getFeatures:function(){
return {"dojo.data.api.Read":true,"dojo.data.api.Identity":true};
},close:function(_5d2){
},getLabel:function(item){
if(this.isItem(item)){
if(item.cells){
return "Item #"+this.getIdentity(item);
}else{
return this.getValue(item,"name");
}
}
return undefined;
},getLabelAttributes:function(item){
if(item.cells){
return null;
}else{
return ["name"];
}
},getIdentity:function(item){
this._assertIsItem(item);
if(this.hasAttribute(item,"name")){
return this.getValue(item,"name");
}else{
return item._ident;
}
},getIdentityAttributes:function(item){
return null;
},fetchItemByIdentity:function(_5d7){
var _5d8=_5d7.identity;
var self=this;
var item=null;
var _5db=null;
if(!this._rootNode){
if(!this.url){
this._rootNode=dojo.byId(this.dataId);
this._indexItems();
if(self._rootNode.rows){
item=this._rootNode.rows[_5d8+1];
}else{
for(var i=0;i<self._rootNode.childNodes.length;i++){
if(self._rootNode.childNodes[i].nodeType===1&&_5d8===dojox.data.dom.textContent(self._rootNode.childNodes[i])){
item=self._rootNode.childNodes[i];
}
}
}
if(_5d7.onItem){
_5db=_5d7.scope?_5d7.scope:dojo.global;
_5d7.onItem.call(_5db,item);
}
}else{
var _5dd={url:this.url,handleAs:"text"};
var _5de=dojo.xhrGet(_5dd);
_5de.addCallback(function(data){
var _5e0=function(node,id){
if(node.id==id){
return node;
}
if(node.childNodes){
for(var i=0;i<node.childNodes.length;i++){
var _5e4=_5e0(node.childNodes[i],id);
if(_5e4){
return _5e4;
}
}
}
return null;
};
var d=document.createElement("div");
d.innerHTML=data;
self._rootNode=_5e0(d,self.dataId);
self._indexItems();
if(self._rootNode.rows&&_5d8<=self._rootNode.rows.length){
item=self._rootNode.rows[_5d8-1];
}else{
for(var i=0;i<self._rootNode.childNodes.length;i++){
if(self._rootNode.childNodes[i].nodeType===1&&_5d8===dojox.data.dom.textContent(self._rootNode.childNodes[i])){
item=self._rootNode.childNodes[i];
break;
}
}
}
if(_5d7.onItem){
_5db=_5d7.scope?_5d7.scope:dojo.global;
_5d7.onItem.call(_5db,item);
}
});
_5de.addErrback(function(_5e7){
if(_5d7.onError){
_5db=_5d7.scope?_5d7.scope:dojo.global;
_5d7.onError.call(_5db,_5e7);
}
});
}
}else{
if(this._rootNode.rows[_5d8+1]){
item=this._rootNode.rows[_5d8+1];
if(_5d7.onItem){
_5db=_5d7.scope?_5d7.scope:dojo.global;
_5d7.onItem.call(_5db,item);
}
}
}
}});
dojo.extend(dojox.data.HtmlStore,dojo.data.util.simpleFetch);
}
if(!dojo._hasResource["dojo.fx.easing"]){
dojo._hasResource["dojo.fx.easing"]=true;
dojo.provide("dojo.fx.easing");
dojo.fx.easing={linear:function(n){
return n;
},quadIn:function(n){
return Math.pow(n,2);
},quadOut:function(n){
return n*(n-2)*-1;
},quadInOut:function(n){
n=n*2;
if(n<1){
return Math.pow(n,2)/2;
}
return -1*((--n)*(n-2)-1)/2;
},cubicIn:function(n){
return Math.pow(n,3);
},cubicOut:function(n){
return Math.pow(n-1,3)+1;
},cubicInOut:function(n){
n=n*2;
if(n<1){
return Math.pow(n,3)/2;
}
n-=2;
return (Math.pow(n,3)+2)/2;
},quartIn:function(n){
return Math.pow(n,4);
},quartOut:function(n){
return -1*(Math.pow(n-1,4)-1);
},quartInOut:function(n){
n=n*2;
if(n<1){
return Math.pow(n,4)/2;
}
n-=2;
return -1/2*(Math.pow(n,4)-2);
},quintIn:function(n){
return Math.pow(n,5);
},quintOut:function(n){
return Math.pow(n-1,5)+1;
},quintInOut:function(n){
n=n*2;
if(n<1){
return Math.pow(n,5)/2;
}
n-=2;
return (Math.pow(n,5)+2)/2;
},sineIn:function(n){
return -1*Math.cos(n*(Math.PI/2))+1;
},sineOut:function(n){
return Math.sin(n*(Math.PI/2));
},sineInOut:function(n){
return -1*(Math.cos(Math.PI*n)-1)/2;
},expoIn:function(n){
return (n==0)?0:Math.pow(2,10*(n-1));
},expoOut:function(n){
return (n==1)?1:(-1*Math.pow(2,-10*n)+1);
},expoInOut:function(n){
if(n==0){
return 0;
}
if(n==1){
return 1;
}
n=n*2;
if(n<1){
return Math.pow(2,10*(n-1))/2;
}
--n;
return (-1*Math.pow(2,-10*n)+2)/2;
},circIn:function(n){
return -1*(Math.sqrt(1-Math.pow(n,2))-1);
},circOut:function(n){
n=n-1;
return Math.sqrt(1-Math.pow(n,2));
},circInOut:function(n){
n=n*2;
if(n<1){
return -1/2*(Math.sqrt(1-Math.pow(n,2))-1);
}
n-=2;
return 1/2*(Math.sqrt(1-Math.pow(n,2))+1);
},backIn:function(n){
var s=1.70158;
return Math.pow(n,2)*((s+1)*n-s);
},backOut:function(n){
n=n-1;
var s=1.70158;
return Math.pow(n,2)*((s+1)*n+s)+1;
},backInOut:function(n){
var s=1.70158*1.525;
n=n*2;
if(n<1){
return (Math.pow(n,2)*((s+1)*n-s))/2;
}
n-=2;
return (Math.pow(n,2)*((s+1)*n+s)+2)/2;
},elasticIn:function(n){
if(n==0||n==1){
return n;
}
var p=0.3;
var s=p/4;
n=n-1;
return -1*Math.pow(2,10*n)*Math.sin((n-s)*(2*Math.PI)/p);
},elasticOut:function(n){
if(n==0||n==1){
return n;
}
var p=0.3;
var s=p/4;
return Math.pow(2,-10*n)*Math.sin((n-s)*(2*Math.PI)/p)+1;
},elasticInOut:function(n){
if(n==0){
return 0;
}
n=n*2;
if(n==2){
return 1;
}
var p=0.3*1.5;
var s=p/4;
if(n<1){
n-=1;
return -0.5*(Math.pow(2,10*n)*Math.sin((n-s)*(2*Math.PI)/p));
}
n-=1;
return 0.5*(Math.pow(2,-10*n)*Math.sin((n-s)*(2*Math.PI)/p))+1;
},bounceIn:function(n){
return (1-dojo.fx.easing.bounceOut(1-n));
},bounceOut:function(n){
var s=7.5625;
var p=2.75;
var l;
if(n<(1/p)){
l=s*Math.pow(n,2);
}else{
if(n<(2/p)){
n-=(1.5/p);
l=s*Math.pow(n,2)+0.75;
}else{
if(n<(2.5/p)){
n-=(2.25/p);
l=s*Math.pow(n,2)+0.9375;
}else{
n-=(2.625/p);
l=s*Math.pow(n,2)+0.984375;
}
}
}
return l;
},bounceInOut:function(n){
if(n<0.5){
return dojo.fx.easing.bounceIn(n*2)/2;
}
return (dojo.fx.easing.bounceOut(n*2-1)/2)+0.5;
}};
}
if(!dojo._hasResource["dojox.gfx.fx"]){
dojo._hasResource["dojox.gfx.fx"]=true;
dojo.provide("dojox.gfx.fx");
(function(){
var d=dojo,g=dojox.gfx,m=g.matrix;
var _616=function(_617,end){
this.start=_617,this.end=end;
};
d.extend(_616,{getValue:function(r){
return (this.end-this.start)*r+this.start;
}});
var _61a=function(_61b,end,unit){
this.start=_61b,this.end=end;
this.unit=unit;
};
d.extend(_61a,{getValue:function(r){
return (this.end-this.start)*r+this.start+this.unit;
}});
var _61f=function(_620,end){
this.start=_620,this.end=end;
this.temp=new dojo.Color();
};
d.extend(_61f,{getValue:function(r){
return d.blendColors(this.start,this.end,r,this.temp);
}});
var _623=function(_624){
this.values=_624;
this.length=_624.length;
};
d.extend(_623,{getValue:function(r){
return this.values[Math.min(Math.floor(r*this.length),this.length-1)];
}});
var _626=function(_627,def){
this.values=_627;
this.def=def?def:{};
};
d.extend(_626,{getValue:function(r){
var ret=dojo.clone(this.def);
for(var i in this.values){
ret[i]=this.values[i].getValue(r);
}
return ret;
}});
var _62c=function(_62d,_62e){
this.stack=_62d;
this.original=_62e;
};
d.extend(_62c,{getValue:function(r){
var ret=[];
dojo.forEach(this.stack,function(t){
if(t instanceof m.Matrix2D){
ret.push(t);
return;
}
if(t.name=="original"&&this.original){
ret.push(this.original);
return;
}
if(!(t.name in m)){
return;
}
var f=m[t.name];
if(typeof f!="function"){
ret.push(f);
return;
}
var val=dojo.map(t.start,function(v,i){
return (t.end[i]-v)*r+v;
}),_636=f.apply(m,val);
if(_636 instanceof m.Matrix2D){
ret.push(_636);
}
},this);
return ret;
}});
var _637=new d.Color(0,0,0,0);
var _638=function(prop,obj,name,def){
if(prop.values){
return new _623(prop.values);
}
var _63d,_63e,end;
if(prop.start){
_63e=g.normalizeColor(prop.start);
}else{
_63e=_63d=obj?(name?obj[name]:obj):def;
}
if(prop.end){
end=g.normalizeColor(prop.end);
}else{
if(!_63d){
_63d=obj?(name?obj[name]:obj):def;
}
end=_63d;
}
return new _61f(_63e,end);
};
var _640=function(prop,obj,name,def){
if(prop.values){
return new _623(prop.values);
}
var _645,_646,end;
if(prop.start){
_646=prop.start;
}else{
_646=_645=obj?obj[name]:def;
}
if(prop.end){
end=prop.end;
}else{
if(typeof _645!="number"){
_645=obj?obj[name]:def;
}
end=_645;
}
return new _616(_646,end);
};
g.fx.animateStroke=function(args){
if(!args.easing){
args.easing=d._defaultEasing;
}
var anim=new d._Animation(args),_64a=args.shape,_64b;
d.connect(anim,"beforeBegin",anim,function(){
_64b=_64a.getStroke();
var prop=args.color,_64d={},_64e,_64f,end;
if(prop){
_64d.color=_638(prop,_64b,"color",_637);
}
prop=args.style;
if(prop&&prop.values){
_64d.style=new _623(prop.values);
}
prop=args.width;
if(prop){
_64d.width=_640(prop,_64b,"width",1);
}
prop=args.cap;
if(prop&&prop.values){
_64d.cap=new _623(prop.values);
}
prop=args.join;
if(prop){
if(prop.values){
_64d.join=new _623(prop.values);
}else{
_64f=prop.start?prop.start:(_64b&&_64b.join||0);
end=prop.end?prop.end:(_64b&&_64b.join||0);
if(typeof _64f=="number"&&typeof end=="number"){
_64d.join=new _616(_64f,end);
}
}
}
this.curve=new _626(_64d,_64b);
});
d.connect(anim,"onAnimate",_64a,"setStroke");
return anim;
};
g.fx.animateFill=function(args){
if(!args.easing){
args.easing=d._defaultEasing;
}
var anim=new d._Animation(args),_653=args.shape,fill;
d.connect(anim,"beforeBegin",anim,function(){
fill=_653.getFill();
var prop=args.color,_656={};
if(prop){
this.curve=_638(prop,fill,"",_637);
}
});
d.connect(anim,"onAnimate",_653,"setFill");
return anim;
};
g.fx.animateFont=function(args){
if(!args.easing){
args.easing=d._defaultEasing;
}
var anim=new d._Animation(args),_659=args.shape,font;
d.connect(anim,"beforeBegin",anim,function(){
font=_659.getFont();
var prop=args.style,_65c={},_65d,_65e,end;
if(prop&&prop.values){
_65c.style=new _623(prop.values);
}
prop=args.variant;
if(prop&&prop.values){
_65c.variant=new _623(prop.values);
}
prop=args.weight;
if(prop&&prop.values){
_65c.weight=new _623(prop.values);
}
prop=args.family;
if(prop&&prop.values){
_65c.family=new _623(prop.values);
}
prop=args.size;
if(prop&&prop.unit){
_65e=parseFloat(prop.start?prop.start:(_659.font&&_659.font.size||"0"));
end=parseFloat(prop.end?prop.end:(_659.font&&_659.font.size||"0"));
_65c.size=new _61a(_65e,end,prop.unit);
}
this.curve=new _626(_65c,font);
});
d.connect(anim,"onAnimate",_659,"setFont");
return anim;
};
g.fx.animateTransform=function(args){
if(!args.easing){
args.easing=d._defaultEasing;
}
var anim=new d._Animation(args),_662=args.shape,_663;
d.connect(anim,"beforeBegin",anim,function(){
_663=_662.getTransform();
this.curve=new _62c(args.transform,_663);
});
d.connect(anim,"onAnimate",_662,"setTransform");
return anim;
};
})();
}
if(!dojo._hasResource["dojox.charting.action2d.Base"]){
dojo._hasResource["dojox.charting.action2d.Base"]=true;
dojo.provide("dojox.charting.action2d.Base");
(function(){
var _664=400,_665=dojo.fx.easing.backOut,dfo=dojox.lang.functional.object;
dojo.declare("dojox.charting.action2d.Base",null,{overOutEvents:{onmouseover:1,onmouseout:1},constructor:function(_667,plot,_669){
this.chart=_667;
this.plot=plot?plot:"default";
this.anim={};
if(!_669){
_669={};
}
this.duration=_669.duration?_669.duration:_664;
this.easing=_669.easing?_669.easing:_665;
},connect:function(){
this.handle=this.chart.connectToPlot(this.plot,this,"process");
},disconnect:function(){
if(this.handle){
dojo.disconnect(this.handle);
this.handle=null;
}
},reset:function(){
},destroy:function(){
if(this.handle){
this.disconnect();
}
dfo.forIn(this.anim,function(o){
dfo.forIn(o,function(anim){
anim.action.stop(true);
});
});
this.anim={};
}});
})();
}
if(!dojo._hasResource["dijit._base.focus"]){
dojo._hasResource["dijit._base.focus"]=true;
dojo.provide("dijit._base.focus");
dojo.mixin(dijit,{_curFocus:null,_prevFocus:null,isCollapsed:function(){
var _66c=dojo.doc;
if(_66c.selection){
var s=_66c.selection;
if(s.type=="Text"){
return !s.createRange().htmlText.length;
}else{
return !s.createRange().length;
}
}else{
var _66e=dojo.global;
var _66f=_66e.getSelection();
if(dojo.isString(_66f)){
return !_66f;
}else{
return _66f.isCollapsed||!_66f.toString();
}
}
},getBookmark:function(){
var _670,_671=dojo.doc.selection;
if(_671){
var _672=_671.createRange();
if(_671.type.toUpperCase()=="CONTROL"){
if(_672.length){
_670=[];
var i=0,len=_672.length;
while(i<len){
_670.push(_672.item(i++));
}
}else{
_670=null;
}
}else{
_670=_672.getBookmark();
}
}else{
if(window.getSelection){
_671=dojo.global.getSelection();
if(_671){
_672=_671.getRangeAt(0);
_670=_672.cloneRange();
}
}else{
console.warn("No idea how to store the current selection for this browser!");
}
}
return _670;
},moveToBookmark:function(_675){
var _676=dojo.doc;
if(_676.selection){
var _677;
if(dojo.isArray(_675)){
_677=_676.body.createControlRange();
dojo.forEach(_675,function(n){
_677.addElement(n);
});
}else{
_677=_676.selection.createRange();
_677.moveToBookmark(_675);
}
_677.select();
}else{
var _679=dojo.global.getSelection&&dojo.global.getSelection();
if(_679&&_679.removeAllRanges){
_679.removeAllRanges();
_679.addRange(_675);
}else{
console.warn("No idea how to restore selection for this browser!");
}
}
},getFocus:function(menu,_67b){
return {node:menu&&dojo.isDescendant(dijit._curFocus,menu.domNode)?dijit._prevFocus:dijit._curFocus,bookmark:!dojo.withGlobal(_67b||dojo.global,dijit.isCollapsed)?dojo.withGlobal(_67b||dojo.global,dijit.getBookmark):null,openedForWindow:_67b};
},focus:function(_67c){
if(!_67c){
return;
}
var node="node" in _67c?_67c.node:_67c,_67e=_67c.bookmark,_67f=_67c.openedForWindow;
if(node){
var _680=(node.tagName.toLowerCase()=="iframe")?node.contentWindow:node;
if(_680&&_680.focus){
try{
_680.focus();
}
catch(e){
}
}
dijit._onFocusNode(node);
}
if(_67e&&dojo.withGlobal(_67f||dojo.global,dijit.isCollapsed)){
if(_67f){
_67f.focus();
}
try{
dojo.withGlobal(_67f||dojo.global,dijit.moveToBookmark,null,[_67e]);
}
catch(e){
}
}
},_activeStack:[],registerWin:function(_681){
if(!_681){
_681=window;
}
dojo.connect(_681.document,"onmousedown",function(evt){
dijit._justMouseDowned=true;
setTimeout(function(){
dijit._justMouseDowned=false;
},0);
dijit._onTouchNode(evt.target||evt.srcElement);
});
var body=_681.document.body||_681.document.getElementsByTagName("body")[0];
if(body){
if(dojo.isIE){
body.attachEvent("onactivate",function(evt){
if(evt.srcElement.tagName.toLowerCase()!="body"){
dijit._onFocusNode(evt.srcElement);
}
});
body.attachEvent("ondeactivate",function(evt){
dijit._onBlurNode(evt.srcElement);
});
}else{
body.addEventListener("focus",function(evt){
dijit._onFocusNode(evt.target);
},true);
body.addEventListener("blur",function(evt){
dijit._onBlurNode(evt.target);
},true);
}
}
body=null;
},_onBlurNode:function(node){
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
},_onTouchNode:function(node){
if(dijit._clearActiveWidgetsTimer){
clearTimeout(dijit._clearActiveWidgetsTimer);
delete dijit._clearActiveWidgetsTimer;
}
var _68a=[];
try{
while(node){
if(node.dijitPopupParent){
node=dijit.byId(node.dijitPopupParent).domNode;
}else{
if(node.tagName&&node.tagName.toLowerCase()=="body"){
if(node===dojo.body()){
break;
}
node=dijit.getDocumentWindow(node.ownerDocument).frameElement;
}else{
var id=node.getAttribute&&node.getAttribute("widgetId");
if(id){
_68a.unshift(id);
}
node=node.parentNode;
}
}
}
}
catch(e){
}
dijit._setStack(_68a);
},_onFocusNode:function(node){
if(node&&node.tagName&&node.tagName.toLowerCase()=="body"){
return;
}
dijit._onTouchNode(node);
if(node==dijit._curFocus){
return;
}
if(dijit._curFocus){
dijit._prevFocus=dijit._curFocus;
}
dijit._curFocus=node;
dojo.publish("focusNode",[node]);
},_setStack:function(_68d){
var _68e=dijit._activeStack;
dijit._activeStack=_68d;
for(var _68f=0;_68f<Math.min(_68e.length,_68d.length);_68f++){
if(_68e[_68f]!=_68d[_68f]){
break;
}
}
for(var i=_68e.length-1;i>=_68f;i--){
var _691=dijit.byId(_68e[i]);
if(_691){
_691._focused=false;
_691._hasBeenBlurred=true;
if(_691._onBlur){
_691._onBlur();
}
if(_691._setStateClass){
_691._setStateClass();
}
dojo.publish("widgetBlur",[_691]);
}
}
for(i=_68f;i<_68d.length;i++){
_691=dijit.byId(_68d[i]);
if(_691){
_691._focused=true;
if(_691._onFocus){
_691._onFocus();
}
if(_691._setStateClass){
_691._setStateClass();
}
dojo.publish("widgetFocus",[_691]);
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
},add:function(_692){
if(this._hash[_692.id]){
throw new Error("Tried to register widget with id=="+_692.id+" but that id is already registered");
}
this._hash[_692.id]=_692;
},remove:function(id){
delete this._hash[id];
},forEach:function(func){
for(var id in this._hash){
func(this._hash[id]);
}
},filter:function(_696){
var res=new dijit.WidgetSet();
this.forEach(function(_698){
if(_696(_698)){
res.add(_698);
}
});
return res;
},byId:function(id){
return this._hash[id];
},byClass:function(cls){
return this.filter(function(_69b){
return _69b.declaredClass==cls;
});
}});
dijit.registry=new dijit.WidgetSet();
dijit._widgetTypeCtr={};
dijit.getUniqueId=function(_69c){
var id;
do{
id=_69c+"_"+(_69c in dijit._widgetTypeCtr?++dijit._widgetTypeCtr[_69c]:dijit._widgetTypeCtr[_69c]=0);
}while(dijit.byId(id));
return id;
};
if(dojo.isIE){
dojo.addOnWindowUnload(function(){
dijit.registry.forEach(function(_69e){
_69e.destroy();
});
});
}
dijit.byId=function(id){
return (dojo.isString(id))?dijit.registry.byId(id):id;
};
dijit.byNode=function(node){
return dijit.registry.byId(node.getAttribute("widgetId"));
};
dijit.getEnclosingWidget=function(node){
while(node){
if(node.getAttribute&&node.getAttribute("widgetId")){
return dijit.registry.byId(node.getAttribute("widgetId"));
}
node=node.parentNode;
}
return null;
};
dijit._tabElements={area:true,button:true,input:true,object:true,select:true,textarea:true};
dijit._isElementShown=function(elem){
var _6a3=dojo.style(elem);
return (_6a3.visibility!="hidden")&&(_6a3.visibility!="collapsed")&&(_6a3.display!="none")&&(dojo.attr(elem,"type")!="hidden");
};
dijit.isTabNavigable=function(elem){
if(dojo.hasAttr(elem,"disabled")){
return false;
}
var _6a5=dojo.hasAttr(elem,"tabindex");
var _6a6=dojo.attr(elem,"tabindex");
if(_6a5&&_6a6>=0){
return true;
}
var name=elem.nodeName.toLowerCase();
if(((name=="a"&&dojo.hasAttr(elem,"href"))||dijit._tabElements[name])&&(!_6a5||_6a6>=0)){
return true;
}
return false;
};
dijit._getTabNavigable=function(root){
var _6a9,last,_6ab,_6ac,_6ad,_6ae;
var _6af=function(_6b0){
dojo.query("> *",_6b0).forEach(function(_6b1){
var _6b2=dijit._isElementShown(_6b1);
if(_6b2&&dijit.isTabNavigable(_6b1)){
var _6b3=dojo.attr(_6b1,"tabindex");
if(!dojo.hasAttr(_6b1,"tabindex")||_6b3==0){
if(!_6a9){
_6a9=_6b1;
}
last=_6b1;
}else{
if(_6b3>0){
if(!_6ab||_6b3<_6ac){
_6ac=_6b3;
_6ab=_6b1;
}
if(!_6ad||_6b3>=_6ae){
_6ae=_6b3;
_6ad=_6b1;
}
}
}
}
if(_6b2&&_6b1.nodeName.toUpperCase()!="SELECT"){
_6af(_6b1);
}
});
};
if(dijit._isElementShown(root)){
_6af(root);
}
return {first:_6a9,last:last,lowest:_6ab,highest:_6ad};
};
dijit.getFirstInTabbingOrder=function(root){
var _6b5=dijit._getTabNavigable(dojo.byId(root));
return _6b5.lowest?_6b5.lowest:_6b5.first;
};
dijit.getLastInTabbingOrder=function(root){
var _6b7=dijit._getTabNavigable(dojo.byId(root));
return _6b7.last?_6b7.last:_6b7.highest;
};
dijit.defaultDuration=dojo.config["defaultDuration"]||200;
}
if(!dojo._hasResource["dojo.AdapterRegistry"]){
dojo._hasResource["dojo.AdapterRegistry"]=true;
dojo.provide("dojo.AdapterRegistry");
dojo.AdapterRegistry=function(_6b8){
this.pairs=[];
this.returnWrappers=_6b8||false;
};
dojo.extend(dojo.AdapterRegistry,{register:function(name,_6ba,wrap,_6bc,_6bd){
this.pairs[((_6bd)?"unshift":"push")]([name,_6ba,wrap,_6bc]);
},match:function(){
for(var i=0;i<this.pairs.length;i++){
var pair=this.pairs[i];
if(pair[1].apply(this,arguments)){
if((pair[3])||(this.returnWrappers)){
return pair[2];
}else{
return pair[2].apply(this,arguments);
}
}
}
throw new Error("No match found");
},unregister:function(name){
for(var i=0;i<this.pairs.length;i++){
var pair=this.pairs[i];
if(pair[0]==name){
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
var _6c3=dojo.global;
var _6c4=dojo.doc;
var w=0,h=0;
var de=_6c4.documentElement;
var dew=de.clientWidth,deh=de.clientHeight;
if(dojo.isMozilla){
var minw,minh,maxw,maxh;
var dbw=_6c4.body.clientWidth;
if(dbw>dew){
minw=dew;
maxw=dbw;
}else{
maxw=dew;
minw=dbw;
}
var dbh=_6c4.body.clientHeight;
if(dbh>deh){
minh=deh;
maxh=dbh;
}else{
maxh=deh;
minh=dbh;
}
w=(maxw>_6c3.innerWidth)?minw:maxw;
h=(maxh>_6c3.innerHeight)?minh:maxh;
}else{
if(!dojo.isOpera&&_6c3.innerWidth){
w=_6c3.innerWidth;
h=_6c3.innerHeight;
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
var _6d0=dojo._docScroll();
return {w:w,h:h,l:_6d0.x,t:_6d0.y};
};
dijit.placeOnScreen=function(node,pos,_6d3,_6d4){
var _6d5=dojo.map(_6d3,function(_6d6){
return {corner:_6d6,pos:pos};
});
return dijit._place(node,_6d5);
};
dijit._place=function(node,_6d8,_6d9){
var view=dijit.getViewport();
if(!node.parentNode||String(node.parentNode.tagName).toLowerCase()!="body"){
dojo.body().appendChild(node);
}
var best=null;
dojo.some(_6d8,function(_6dc){
var _6dd=_6dc.corner;
var pos=_6dc.pos;
if(_6d9){
_6d9(node,_6dc.aroundCorner,_6dd);
}
var _6df=node.style;
var _6e0=_6df.display;
var _6e1=_6df.visibility;
_6df.visibility="hidden";
_6df.display="";
var mb=dojo.marginBox(node);
_6df.display=_6e0;
_6df.visibility=_6e1;
var _6e3=(_6dd.charAt(1)=="L"?pos.x:Math.max(view.l,pos.x-mb.w)),_6e4=(_6dd.charAt(0)=="T"?pos.y:Math.max(view.t,pos.y-mb.h)),endX=(_6dd.charAt(1)=="L"?Math.min(view.l+view.w,_6e3+mb.w):pos.x),endY=(_6dd.charAt(0)=="T"?Math.min(view.t+view.h,_6e4+mb.h):pos.y),_6e7=endX-_6e3,_6e8=endY-_6e4,_6e9=(mb.w-_6e7)+(mb.h-_6e8);
if(best==null||_6e9<best.overflow){
best={corner:_6dd,aroundCorner:_6dc.aroundCorner,x:_6e3,y:_6e4,w:_6e7,h:_6e8,overflow:_6e9};
}
return !_6e9;
});
node.style.left=best.x+"px";
node.style.top=best.y+"px";
if(best.overflow&&_6d9){
_6d9(node,best.aroundCorner,best.corner);
}
return best;
};
dijit.placeOnScreenAroundNode=function(node,_6eb,_6ec,_6ed){
_6eb=dojo.byId(_6eb);
var _6ee=_6eb.style.display;
_6eb.style.display="";
var _6ef=_6eb.offsetWidth;
var _6f0=_6eb.offsetHeight;
var _6f1=dojo.coords(_6eb,true);
_6eb.style.display=_6ee;
return dijit._placeOnScreenAroundRect(node,_6f1.x,_6f1.y,_6ef,_6f0,_6ec,_6ed);
};
dijit.placeOnScreenAroundRectangle=function(node,_6f3,_6f4,_6f5){
return dijit._placeOnScreenAroundRect(node,_6f3.x,_6f3.y,_6f3.width,_6f3.height,_6f4,_6f5);
};
dijit._placeOnScreenAroundRect=function(node,x,y,_6f9,_6fa,_6fb,_6fc){
var _6fd=[];
for(var _6fe in _6fb){
_6fd.push({aroundCorner:_6fe,corner:_6fb[_6fe],pos:{x:x+(_6fe.charAt(1)=="L"?0:_6f9),y:y+(_6fe.charAt(0)=="T"?0:_6fa)}});
}
return dijit._place(node,_6fd,_6fc);
};
dijit.placementRegistry=new dojo.AdapterRegistry();
dijit.placementRegistry.register("node",function(n,x){
return typeof x=="object"&&typeof x.offsetWidth!="undefined"&&typeof x.offsetHeight!="undefined";
},dijit.placeOnScreenAroundNode);
dijit.placementRegistry.register("rect",function(n,x){
return typeof x=="object"&&"x" in x&&"y" in x&&"width" in x&&"height" in x;
},dijit.placeOnScreenAroundRectangle);
dijit.placeOnScreenAroundElement=function(node,_704,_705,_706){
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
var _709=[],_70a=1000,_70b=1;
this.prepare=function(node){
dojo.body().appendChild(node);
var s=node.style;
if(s.display=="none"){
s.display="";
}
s.visibility="hidden";
s.position="absolute";
s.top="-9999px";
};
this.open=function(args){
var _70f=args.popup,_710=args.orient||{"BL":"TL","TL":"BL"},_711=args.around,id=(args.around&&args.around.id)?(args.around.id+"_dropdown"):("popup_"+_70b++);
var _713=dojo.doc.createElement("div");
dijit.setWaiRole(_713,"presentation");
_713.id=id;
_713.className="dijitPopup";
_713.style.zIndex=_70a+_709.length;
_713.style.left=_713.style.top="0px";
_713.style.visibility="hidden";
if(args.parent){
_713.dijitPopupParent=args.parent.id;
}
dojo.body().appendChild(_713);
var s=_70f.domNode.style;
s.display="";
s.visibility="";
s.position="";
_713.appendChild(_70f.domNode);
var _715=new dijit.BackgroundIframe(_713);
var best=_711?dijit.placeOnScreenAroundElement(_713,_711,_710,_70f.orient?dojo.hitch(_70f,"orient"):null):dijit.placeOnScreen(_713,args,_710=="R"?["TR","BR","TL","BL"]:["TL","BL","TR","BR"]);
_713.style.visibility="visible";
var _717=[];
var _718=function(){
for(var pi=_709.length-1;pi>0&&_709[pi].parent===_709[pi-1].widget;pi--){
}
return _709[pi];
};
_717.push(dojo.connect(_713,"onkeypress",this,function(evt){
if(evt.charOrCode==dojo.keys.ESCAPE&&args.onCancel){
dojo.stopEvent(evt);
args.onCancel();
}else{
if(evt.charOrCode==dojo.keys.TAB){
dojo.stopEvent(evt);
var _71b=_718();
if(_71b&&_71b.onCancel){
_71b.onCancel();
}
}
}
}));
if(_70f.onCancel){
_717.push(dojo.connect(_70f,"onCancel",null,args.onCancel));
}
_717.push(dojo.connect(_70f,_70f.onExecute?"onExecute":"onChange",null,function(){
var _71c=_718();
if(_71c&&_71c.onExecute){
_71c.onExecute();
}
}));
_709.push({wrapper:_713,iframe:_715,widget:_70f,parent:args.parent,onExecute:args.onExecute,onCancel:args.onCancel,onClose:args.onClose,handlers:_717});
if(_70f.onOpen){
_70f.onOpen(best);
}
return best;
};
this.close=function(_71d){
while(dojo.some(_709,function(elem){
return elem.widget==_71d;
})){
var top=_709.pop(),_720=top.wrapper,_721=top.iframe,_722=top.widget,_723=top.onClose;
if(_722.onClose){
_722.onClose();
}
dojo.forEach(top.handlers,dojo.disconnect);
if(!_722||!_722.domNode){
return;
}
this.prepare(_722.domNode);
_721.destroy();
dojo._destroyElement(_720);
if(_723){
_723();
}
}
};
}();
dijit._frames=new function(){
var _724=[];
this.pop=function(){
var _725;
if(_724.length){
_725=_724.pop();
_725.style.display="";
}else{
if(dojo.isIE){
var html="<iframe src='javascript:\"\"'"+" style='position: absolute; left: 0px; top: 0px;"+"z-index: -1; filter:Alpha(Opacity=\"0\");'>";
_725=dojo.doc.createElement(html);
}else{
_725=dojo.doc.createElement("iframe");
_725.src="javascript:\"\"";
_725.className="dijitBackgroundIframe";
}
_725.tabIndex=-1;
dojo.body().appendChild(_725);
}
return _725;
};
this.push=function(_727){
_727.style.display="";
if(dojo.isIE){
_727.style.removeExpression("width");
_727.style.removeExpression("height");
}
_724.push(_727);
};
}();
if(dojo.isIE<7){
dojo.addOnLoad(function(){
var f=dijit._frames;
dojo.forEach([f.pop()],f.push);
});
}
dijit.BackgroundIframe=function(node){
if(!node.id){
throw new Error("no id");
}
if((dojo.isIE&&dojo.isIE<7)||(dojo.isFF&&dojo.isFF<3&&dojo.hasClass(dojo.body(),"dijit_a11y"))){
var _72a=dijit._frames.pop();
node.appendChild(_72a);
if(dojo.isIE){
_72a.style.setExpression("width",dojo._scopeName+".doc.getElementById('"+node.id+"').offsetWidth");
_72a.style.setExpression("height",dojo._scopeName+".doc.getElementById('"+node.id+"').offsetHeight");
}
this.iframe=_72a;
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
dijit.scrollIntoView=function(node){
node=dojo.byId(node);
var body=node.ownerDocument.body;
var html=body.parentNode;
if(dojo.isFF==2||node==body||node==html){
node.scrollIntoView(false);
return;
}
var rtl=!dojo._isBodyLtr();
var _72f=dojo.doc.compatMode!="BackCompat";
var _730=(_72f&&!dojo.isSafari)?html:body;
function addPseudoAttrs(_731){
var _732=_731.parentNode;
var _733=_731.offsetParent;
if(_733==null){
_731=_730;
_733=html;
_732=null;
}
_731._offsetParent=(_733==body)?_730:_733;
_731._parent=(_732==body)?_730:_732;
_731._start={H:_731.offsetLeft,V:_731.offsetTop};
_731._scroll={H:_731.scrollLeft,V:_731.scrollTop};
_731._renderedSize={H:_731.offsetWidth,V:_731.offsetHeight};
var bp=dojo._getBorderExtents(_731);
_731._borderStart={H:bp.l,V:bp.t};
_731._borderSize={H:bp.w,V:bp.h};
_731._clientSize=(_731._offsetParent==html&&dojo.isSafari&&_72f)?{H:html.clientWidth,V:html.clientHeight}:{H:_731.clientWidth,V:_731.clientHeight};
_731._scrollBarSize={V:null,H:null};
for(var dir in _731._scrollBarSize){
var _736=_731._renderedSize[dir]-_731._clientSize[dir]-_731._borderSize[dir];
_731._scrollBarSize[dir]=(_731._clientSize[dir]>0&&_736>=15&&_736<=17)?_736:0;
}
_731._isScrollable={V:null,H:null};
for(dir in _731._isScrollable){
var _737=dir=="H"?"V":"H";
_731._isScrollable[dir]=_731==_730||_731._scroll[dir]||_731._scrollBarSize[_737];
}
};
var _738=node;
while(_738!=null){
addPseudoAttrs(_738);
var next=_738._parent;
if(next){
next._child=_738;
}
_738=next;
}
for(var dir in _730._renderedSize){
_730._renderedSize[dir]=Math.min(_730._clientSize[dir],_730._renderedSize[dir]);
}
var _73b=node;
while(_73b!=_730){
_738=_73b._parent;
if(_738.tagName=="TD"){
var _73c=_738._parent._parent._parent;
if(_73c._offsetParent==_73b._offsetParent&&_738._offsetParent!=_73b._offsetParent){
_738=_73c;
}
}
var _73d=_73b==_730||(_738._offsetParent!=_73b._offsetParent);
for(dir in _73b._start){
var _73e=dir=="H"?"V":"H";
if(rtl&&dir=="H"&&(dojo.isSafari||dojo.isIE)&&_738._clientSize.H>0){
var _73f=_738.scrollWidth-_738._clientSize.H;
if(_73f>0){
_738._scroll.H-=_73f;
}
}
if(dojo.isIE&&_738._offsetParent.tagName=="TABLE"){
_738._start[dir]-=_738._offsetParent._borderStart[dir];
_738._borderStart[dir]=_738._borderSize[dir]=0;
}
if(_738._clientSize[dir]==0){
_738._renderedSize[dir]=_738._clientSize[dir]=_738._child._clientSize[dir];
if(rtl&&dir=="H"){
_738._start[dir]-=_738._renderedSize[dir];
}
}else{
_738._renderedSize[dir]-=_738._borderSize[dir]+_738._scrollBarSize[dir];
}
_738._start[dir]+=_738._borderStart[dir];
var _740=_73b._start[dir]-(_73d?0:_738._start[dir])-_738._scroll[dir];
var _741=_740+_73b._renderedSize[dir]-_738._renderedSize[dir];
var _742,_743=(dir=="H")?"scrollLeft":"scrollTop";
var _744=(dir=="H"&&rtl);
var _745=_744?-_741:_740;
var _746=_744?-_740:_741;
if(_745<=0){
_742=_745;
}else{
if(_746<=0){
_742=0;
}else{
if(_745<_746){
_742=_745;
}else{
_742=_746;
}
}
}
var _747=0;
if(_742!=0){
var _748=_738[_743];
_738[_743]+=_744?-_742:_742;
_747=_738[_743]-_748;
_740-=_747;
_746-=_744?-_747:_747;
}
_738._renderedSize[dir]=_73b._renderedSize[dir]+_738._scrollBarSize[dir]-((_738._isScrollable[dir]&&_746>0)?_746:0);
_738._start[dir]+=(_740>=0||!_738._isScrollable[dir])?_740:0;
}
_73b=_738;
}
};
}
if(!dojo._hasResource["dijit._base.sniff"]){
dojo._hasResource["dijit._base.sniff"]=true;
dojo.provide("dijit._base.sniff");
(function(){
var d=dojo;
var ie=d.isIE;
var _74b=d.isOpera;
var maj=Math.floor;
var ff=d.isFF;
var _74e=d.boxModel.replace(/-/,"");
var _74f={dj_ie:ie,dj_ie6:maj(ie)==6,dj_ie7:maj(ie)==7,dj_iequirks:ie&&d.isQuirks,dj_opera:_74b,dj_opera8:maj(_74b)==8,dj_opera9:maj(_74b)==9,dj_khtml:d.isKhtml,dj_safari:d.isSafari,dj_gecko:d.isMozilla,dj_ff2:maj(ff)==2,dj_ff3:maj(ff)==3};
_74f["dj_"+_74e]=true;
var html=dojo.doc.documentElement;
for(var p in _74f){
if(_74f[p]){
if(html.className){
html.className+=" "+p;
}else{
html.className=p;
}
}
}
dojo._loaders.unshift(function(){
if(!dojo._isBodyLtr()){
html.className+=" dijitRtl";
for(var p in _74f){
if(_74f[p]){
html.className+=" "+p+"-rtl";
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
},trigger:function(evt,_754,node,_756,obj,_758,_759){
if(obj!=this._obj){
this.stop();
this._initialDelay=_759||500;
this._subsequentDelay=_758||0.9;
this._obj=obj;
this._evt=evt;
this._node=node;
this._currentTimeout=-1;
this._count=-1;
this._callback=dojo.hitch(_754,_756);
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
},addKeyListener:function(node,_75b,_75c,_75d,_75e,_75f){
if(_75b.keyCode){
_75b.charOrCode=_75b.keyCode;
dojo.deprecated("keyCode attribute parameter for dijit.typematic.addKeyListener is deprecated. Use charOrCode instead.","","2.0");
}else{
if(_75b.charCode){
_75b.charOrCode=String.fromCharCode(_75b.charCode);
dojo.deprecated("charCode attribute parameter for dijit.typematic.addKeyListener is deprecated. Use charOrCode instead.","","2.0");
}
}
return [dojo.connect(node,"onkeypress",this,function(evt){
if(evt.charOrCode==_75b.charOrCode&&(_75b.ctrlKey===undefined||_75b.ctrlKey==evt.ctrlKey)&&(_75b.altKey===undefined||_75b.altKey==evt.ctrlKey)&&(_75b.shiftKey===undefined||_75b.shiftKey==evt.ctrlKey)){
dojo.stopEvent(evt);
dijit.typematic.trigger(_75b,_75c,node,_75d,_75b,_75e,_75f);
}else{
if(dijit.typematic._obj==_75b){
dijit.typematic.stop();
}
}
}),dojo.connect(node,"onkeyup",this,function(evt){
if(dijit.typematic._obj==_75b){
dijit.typematic.stop();
}
})];
},addMouseListener:function(node,_763,_764,_765,_766){
var dc=dojo.connect;
return [dc(node,"mousedown",this,function(evt){
dojo.stopEvent(evt);
dijit.typematic.trigger(evt,_763,node,_764,node,_765,_766);
}),dc(node,"mouseup",this,function(evt){
dojo.stopEvent(evt);
dijit.typematic.stop();
}),dc(node,"mouseout",this,function(evt){
dojo.stopEvent(evt);
dijit.typematic.stop();
}),dc(node,"mousemove",this,function(evt){
dojo.stopEvent(evt);
}),dc(node,"dblclick",this,function(evt){
dojo.stopEvent(evt);
if(dojo.isIE){
dijit.typematic.trigger(evt,_763,node,_764,node,_765,_766);
setTimeout(dojo.hitch(this,dijit.typematic.stop),50);
}
})];
},addListener:function(_76d,_76e,_76f,_770,_771,_772,_773){
return this.addKeyListener(_76e,_76f,_770,_771,_772,_773).concat(this.addMouseListener(_76d,_770,_771,_772,_773));
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
var _776=cs.backgroundImage;
var _777=(cs.borderTopColor==cs.borderRightColor)||(_776!=null&&(_776=="none"||_776=="url(invalid-url:)"));
dojo[_777?"addClass":"removeClass"](dojo.body(),"dijit_a11y");
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
var _77a=this.getWaiRole(elem);
if(role){
return (_77a.indexOf(role)>-1);
}else{
return (_77a.length>0);
}
},getWaiRole:function(elem){
return dojo.trim((dojo.attr(elem,"role")||"").replace(this._XhtmlRoles,"").replace("wairole:",""));
},setWaiRole:function(elem,role){
var _77e=(theRole=dojo.attr(elem,"role"))?theRole:"";
if(dojo.isFF<3||!this._XhtmlRoles.test(_77e)){
dojo.attr(elem,"role",dojo.isFF<3?"wairole:"+role:role);
}else{
if((" "+_77e+" ").indexOf(" "+role+" ")<0){
var _77f=dojo.trim(_77e.replace(this._XhtmlRoles,""));
var _780=dojo.trim(_77e.replace(_77f,""));
dojo.attr(elem,"role",_780+(_780?" ":"")+role);
}
}
},removeWaiRole:function(elem,role){
var _783=dojo.attr(elem,"role");
if(!_783){
return;
}
if(role){
var _784=dojo.isFF<3?"wairole:"+role:role;
var t=dojo.trim((" "+_783+" ").replace(" "+_784+" "," "));
dojo.attr(elem,"role",t);
}else{
elem.removeAttribute("role");
}
},hasWaiState:function(elem,_787){
if(dojo.isFF<3){
return elem.hasAttributeNS("http://www.w3.org/2005/07/aaa",_787);
}else{
return elem.hasAttribute?elem.hasAttribute("aria-"+_787):!!elem.getAttribute("aria-"+_787);
}
},getWaiState:function(elem,_789){
if(dojo.isFF<3){
return elem.getAttributeNS("http://www.w3.org/2005/07/aaa",_789);
}else{
var _78a=elem.getAttribute("aria-"+_789);
return _78a?_78a:"";
}
},setWaiState:function(elem,_78c,_78d){
if(dojo.isFF<3){
elem.setAttributeNS("http://www.w3.org/2005/07/aaa","aaa:"+_78c,_78d);
}else{
elem.setAttribute("aria-"+_78c,_78d);
}
},removeWaiState:function(elem,_78f){
if(dojo.isFF<3){
elem.removeAttributeNS("http://www.w3.org/2005/07/aaa",_78f);
}else{
elem.removeAttribute("aria-"+_78f);
}
}});
}
if(!dojo._hasResource["dijit._base"]){
dojo._hasResource["dijit._base"]=true;
dojo.provide("dijit._base");
}
if(!dojo._hasResource["dijit._Widget"]){
dojo._hasResource["dijit._Widget"]=true;
dojo.provide("dijit._Widget");
dojo.require("dijit._base");
dojo.connect(dojo,"connect",function(_790,_791){
if(_790&&dojo.isFunction(_790._onConnect)){
_790._onConnect(_791);
}
});
dijit._connectOnUseEventHandler=function(_792){
};
(function(){
var _793={};
var _794=function(dc){
if(!_793[dc]){
var r=[];
var _797;
var _798=dojo.getObject(dc).prototype;
for(var _799 in _798){
if(dojo.isFunction(_798[_799])&&(_797=_799.match(/^_set([a-zA-Z]*)Attr$/))&&_797[1]){
r.push(_797[1].charAt(0).toLowerCase()+_797[1].substr(1));
}
}
_793[dc]=r;
}
return _793[dc]||[];
};
dojo.declare("dijit._Widget",null,{id:"",lang:"",dir:"","class":"",style:"",title:"",srcNodeRef:null,domNode:null,containerNode:null,attributeMap:{id:"",dir:"",lang:"","class":"",style:"",title:""},_deferredConnects:{onClick:"",onDblClick:"",onKeyDown:"",onKeyPress:"",onKeyUp:"",onMouseMove:"",onMouseDown:"",onMouseOut:"",onMouseOver:"",onMouseLeave:"",onMouseEnter:"",onMouseUp:""},onClick:dijit._connectOnUseEventHandler,onDblClick:dijit._connectOnUseEventHandler,onKeyDown:dijit._connectOnUseEventHandler,onKeyPress:dijit._connectOnUseEventHandler,onKeyUp:dijit._connectOnUseEventHandler,onMouseDown:dijit._connectOnUseEventHandler,onMouseMove:dijit._connectOnUseEventHandler,onMouseOut:dijit._connectOnUseEventHandler,onMouseOver:dijit._connectOnUseEventHandler,onMouseLeave:dijit._connectOnUseEventHandler,onMouseEnter:dijit._connectOnUseEventHandler,onMouseUp:dijit._connectOnUseEventHandler,_blankGif:(dojo.config.blankGif||dojo.moduleUrl("dojo","resources/blank.gif")),postscript:function(_79a,_79b){
this.create(_79a,_79b);
},create:function(_79c,_79d){
this.srcNodeRef=dojo.byId(_79d);
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
if(_79c){
this.params=_79c;
dojo.mixin(this,_79c);
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
var _79f=function(attr,_7a1){
if((_7a1.params&&attr in _7a1.params)||_7a1[attr]){
_7a1.attr(attr,_7a1[attr]);
}
};
for(var attr in this.attributeMap){
_79f(attr,this);
}
dojo.forEach(_794(this.declaredClass),function(a){
if(!(a in this.attributeMap)){
_79f(a,this);
}
},this);
},postMixInProperties:function(){
},buildRendering:function(){
this.domNode=this.srcNodeRef||dojo.doc.createElement("div");
},postCreate:function(){
},startup:function(){
this._started=true;
},destroyRecursive:function(_7a4){
this.destroyDescendants(_7a4);
this.destroy(_7a4);
},destroy:function(_7a5){
this.uninitialize();
dojo.forEach(this._connects,function(_7a6){
dojo.forEach(_7a6,dojo.disconnect);
});
dojo.forEach(this._supportingWidgets||[],function(w){
if(w.destroy){
w.destroy();
}
});
this.destroyRendering(_7a5);
dijit.registry.remove(this.id);
},destroyRendering:function(_7a8){
if(this.bgIframe){
this.bgIframe.destroy(_7a8);
delete this.bgIframe;
}
if(this.domNode){
if(!_7a8){
dojo._destroyElement(this.domNode);
}
delete this.domNode;
}
if(this.srcNodeRef){
if(!_7a8){
dojo._destroyElement(this.srcNodeRef);
}
delete this.srcNodeRef;
}
},destroyDescendants:function(_7a9){
dojo.forEach(this.getDescendants(),function(_7aa){
if(_7aa.destroy){
_7aa.destroy(_7a9);
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
},_onConnect:function(_7ac){
if(_7ac in this._deferredConnects){
var _7ad=this[this._deferredConnects[_7ac]||"domNode"];
this.connect(_7ad,_7ac.toLowerCase(),this[_7ac]);
delete this._deferredConnects[_7ac];
}
},_setClassAttr:function(_7ae){
var _7af=this[this.attributeMap["class"]||"domNode"];
dojo.removeClass(_7af,this["class"]);
this["class"]=_7ae;
dojo.addClass(_7af,_7ae);
},_setStyleAttr:function(_7b0){
var _7b1=this[this.attributeMap["style"]||"domNode"];
if(_7b1.style.cssText){
_7b1.style.cssText+="; "+_7b0;
}else{
_7b1.style.cssText=_7b0;
}
this["style"]=_7b0;
},setAttribute:function(attr,_7b3){
dojo.deprecated(this.declaredClass+"::setAttribute() is deprecated. Use attr() instead.","","2.0");
this.attr(attr,_7b3);
},_attrToDom:function(attr,_7b5){
var _7b6=this.attributeMap[attr];
dojo.forEach(dojo.isArray(_7b6)?_7b6:[_7b6],function(_7b7){
var _7b8=this[_7b7.node||_7b7||"domNode"];
var type=_7b7.type||"attribute";
switch(type){
case "attribute":
if(dojo.isFunction(_7b5)){
_7b5=dojo.hitch(this,_7b5);
}
if(/^on[A-Z][a-zA-Z]*$/.test(attr)){
attr=attr.toLowerCase();
}
dojo.attr(_7b8,attr,_7b5);
break;
case "innerHTML":
_7b8.innerHTML=_7b5;
break;
case "class":
dojo.removeClass(_7b8,this[attr]);
dojo.addClass(_7b8,_7b5);
break;
}
},this);
this[attr]=_7b5;
},attr:function(name,_7bb){
var args=arguments.length;
if(args==1&&!dojo.isString(name)){
for(var x in name){
this.attr(x,name[x]);
}
return this;
}
var _7be=this._getAttrNames(name);
if(args==2){
if(this[_7be.s]){
return this[_7be.s](_7bb)||this;
}else{
if(name in this.attributeMap){
this._attrToDom(name,_7bb);
}
this[name]=_7bb;
}
return this;
}else{
if(this[_7be.g]){
return this[_7be.g]();
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
},nodesWithKeyClick:["input","button"],connect:function(obj,_7c4,_7c5){
var d=dojo;
var dco=d.hitch(d,"connect",obj);
var _7c8=[];
if(_7c4=="ondijitclick"){
if(!this.nodesWithKeyClick[obj.nodeName]){
var m=d.hitch(this,_7c5);
_7c8.push(dco("onkeydown",this,function(e){
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
_7c8.push(dco("onkeypress",this,function(e){
if(e.keyCode==d.keys.ENTER){
return m(e);
}
}));
}
}
_7c4="onclick";
}
_7c8.push(dco(_7c4,this,_7c5));
this._connects.push(_7c8);
return _7c8;
},disconnect:function(_7cd){
for(var i=0;i<this._connects.length;i++){
if(this._connects[i]==_7cd){
dojo.forEach(_7cd,dojo.disconnect);
this._connects.splice(i,1);
return;
}
}
},isLeftToRight:function(){
return dojo._isBodyLtr();
},isFocusable:function(){
return this.focus&&(dojo.style(this.domNode,"display")!="none");
},placeAt:function(_7cf,_7d0){
if(_7cf["declaredClass"]&&_7cf["addChild"]){
_7cf.addChild(this,_7d0);
}else{
dojo.place(this.domNode,_7cf,_7d0);
}
return this;
}});
})();
}
if(!dojo._hasResource["dojo.date.stamp"]){
dojo._hasResource["dojo.date.stamp"]=true;
dojo.provide("dojo.date.stamp");
dojo.date.stamp.fromISOString=function(_7d1,_7d2){
if(!dojo.date.stamp._isoRegExp){
dojo.date.stamp._isoRegExp=/^(?:(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(.\d+)?)?((?:[+-](\d{2}):(\d{2}))|Z)?)?$/;
}
var _7d3=dojo.date.stamp._isoRegExp.exec(_7d1);
var _7d4=null;
if(_7d3){
_7d3.shift();
if(_7d3[1]){
_7d3[1]--;
}
if(_7d3[6]){
_7d3[6]*=1000;
}
if(_7d2){
_7d2=new Date(_7d2);
dojo.map(["FullYear","Month","Date","Hours","Minutes","Seconds","Milliseconds"],function(prop){
return _7d2["get"+prop]();
}).forEach(function(_7d6,_7d7){
if(_7d3[_7d7]===undefined){
_7d3[_7d7]=_7d6;
}
});
}
_7d4=new Date(_7d3[0]||1970,_7d3[1]||0,_7d3[2]||1,_7d3[3]||0,_7d3[4]||0,_7d3[5]||0,_7d3[6]||0);
var _7d8=0;
var _7d9=_7d3[7]&&_7d3[7].charAt(0);
if(_7d9!="Z"){
_7d8=((_7d3[8]||0)*60)+(Number(_7d3[9])||0);
if(_7d9!="-"){
_7d8*=-1;
}
}
if(_7d9){
_7d8-=_7d4.getTimezoneOffset();
}
if(_7d8){
_7d4.setTime(_7d4.getTime()+_7d8*60000);
}
}
return _7d4;
};
dojo.date.stamp.toISOString=function(_7da,_7db){
var _=function(n){
return (n<10)?"0"+n:n;
};
_7db=_7db||{};
var _7de=[];
var _7df=_7db.zulu?"getUTC":"get";
var date="";
if(_7db.selector!="time"){
var year=_7da[_7df+"FullYear"]();
date=["0000".substr((year+"").length)+year,_(_7da[_7df+"Month"]()+1),_(_7da[_7df+"Date"]())].join("-");
}
_7de.push(date);
if(_7db.selector!="date"){
var time=[_(_7da[_7df+"Hours"]()),_(_7da[_7df+"Minutes"]()),_(_7da[_7df+"Seconds"]())].join(":");
var _7e3=_7da[_7df+"Milliseconds"]();
if(_7db.milliseconds){
time+="."+(_7e3<100?"0":"")+_(_7e3);
}
if(_7db.zulu){
time+="Z";
}else{
if(_7db.selector!="time"){
var _7e4=_7da.getTimezoneOffset();
var _7e5=Math.abs(_7e4);
time+=(_7e4>0?"-":"+")+_(Math.floor(_7e5/60))+":"+_(_7e5%60);
}
}
_7de.push(time);
}
return _7de.join("T");
};
}
if(!dojo._hasResource["dojo.parser"]){
dojo._hasResource["dojo.parser"]=true;
dojo.provide("dojo.parser");
dojo.parser=new function(){
var d=dojo;
var _7e7=d._scopeName+"Type";
var qry="["+_7e7+"]";
function val2type(_7e9){
if(d.isString(_7e9)){
return "string";
}
if(typeof _7e9=="number"){
return "number";
}
if(typeof _7e9=="boolean"){
return "boolean";
}
if(d.isFunction(_7e9)){
return "function";
}
if(d.isArray(_7e9)){
return "array";
}
if(_7e9 instanceof Date){
return "date";
}
if(_7e9 instanceof d._Url){
return "url";
}
return "object";
};
function str2obj(_7ea,type){
switch(type){
case "string":
return _7ea;
case "number":
return _7ea.length?Number(_7ea):NaN;
case "boolean":
return typeof _7ea=="boolean"?_7ea:!(_7ea.toLowerCase()=="false");
case "function":
if(d.isFunction(_7ea)){
_7ea=_7ea.toString();
_7ea=d.trim(_7ea.substring(_7ea.indexOf("{")+1,_7ea.length-1));
}
try{
if(_7ea.search(/[^\w\.]+/i)!=-1){
_7ea=d.parser._nameAnonFunc(new Function(_7ea),this);
}
return d.getObject(_7ea,false);
}
catch(e){
return new Function();
}
case "array":
return _7ea?_7ea.split(/\s*,\s*/):[];
case "date":
switch(_7ea){
case "":
return new Date("");
case "now":
return new Date();
default:
return d.date.stamp.fromISOString(_7ea);
}
case "url":
return d.baseUrl+_7ea;
default:
return d.fromJson(_7ea);
}
};
var _7ec={};
function getClassInfo(_7ed){
if(!_7ec[_7ed]){
var cls=d.getObject(_7ed);
if(!d.isFunction(cls)){
throw new Error("Could not load class '"+_7ed+"'. Did you spell the name correctly and use a full path, like 'dijit.form.Button'?");
}
var _7ef=cls.prototype;
var _7f0={};
for(var name in _7ef){
if(name.charAt(0)=="_"){
continue;
}
var _7f2=_7ef[name];
_7f0[name]=val2type(_7f2);
}
_7ec[_7ed]={cls:cls,params:_7f0};
}
return _7ec[_7ed];
};
this._functionFromScript=function(_7f3){
var _7f4="";
var _7f5="";
var _7f6=_7f3.getAttribute("args");
if(_7f6){
d.forEach(_7f6.split(/\s*,\s*/),function(part,idx){
_7f4+="var "+part+" = arguments["+idx+"]; ";
});
}
var _7f9=_7f3.getAttribute("with");
if(_7f9&&_7f9.length){
d.forEach(_7f9.split(/\s*,\s*/),function(part){
_7f4+="with("+part+"){";
_7f5+="}";
});
}
return new Function(_7f4+_7f3.innerHTML+_7f5);
};
this.instantiate=function(_7fb){
var _7fc=[];
d.forEach(_7fb,function(node){
if(!node){
return;
}
var type=node.getAttribute(_7e7);
if((!type)||(!type.length)){
return;
}
var _7ff=getClassInfo(type);
var _800=_7ff.cls;
var ps=_800._noScript||_800.prototype._noScript;
var _802={};
var _803=node.attributes;
for(var name in _7ff.params){
var item=_803.getNamedItem(name);
if(!item||(!item.specified&&(!dojo.isIE||name.toLowerCase()!="value"))){
continue;
}
var _806=item.value;
switch(name){
case "class":
_806=node.className;
break;
case "style":
_806=node.style&&node.style.cssText;
}
var _807=_7ff.params[name];
_802[name]=str2obj(_806,_807);
}
if(!ps){
var _808=[],_809=[];
d.query("> script[type^='dojo/']",node).orphan().forEach(function(_80a){
var _80b=_80a.getAttribute("event"),type=_80a.getAttribute("type"),nf=d.parser._functionFromScript(_80a);
if(_80b){
if(type=="dojo/connect"){
_808.push({event:_80b,func:nf});
}else{
_802[_80b]=nf;
}
}else{
_809.push(nf);
}
});
}
var _80d=_800["markupFactory"];
if(!_80d&&_800["prototype"]){
_80d=_800.prototype["markupFactory"];
}
var _80e=_80d?_80d(_802,node,_800):new _800(_802,node);
_7fc.push(_80e);
var _80f=node.getAttribute("jsId");
if(_80f){
d.setObject(_80f,_80e);
}
if(!ps){
d.forEach(_808,function(_810){
d.connect(_80e,_810.event,null,_810.func);
});
d.forEach(_809,function(func){
func.call(_80e);
});
}
});
d.forEach(_7fc,function(_812){
if(_812&&_812.startup&&!_812._started&&(!_812.getParent||!_812.getParent())){
_812.startup();
}
});
return _7fc;
};
this.parse=function(_813){
var list=d.query(qry,_813);
var _815=this.instantiate(list);
return _815;
};
}();
(function(){
var _816=function(){
if(dojo.config["parseOnLoad"]==true){
dojo.parser.parse();
}
};
if(dojo.exists("dijit.wai.onload")&&(dijit.wai.onload===dojo._loaders[0])){
dojo._loaders.splice(1,0,_816);
}else{
dojo._loaders.unshift(_816);
}
})();
dojo.parser._anonCtr=0;
dojo.parser._anon={};
dojo.parser._nameAnonFunc=function(_817,_818){
var jpn="$joinpoint";
var nso=(_818||dojo.parser._anon);
if(dojo.isIE){
var cn=_817["__dojoNameCache"];
if(cn&&nso[cn]===_817){
return _817["__dojoNameCache"];
}
}
var ret="__"+dojo.parser._anonCtr++;
while(typeof nso[ret]!="undefined"){
ret="__"+dojo.parser._anonCtr++;
}
nso[ret]=_817;
return ret;
};
}
if(!dojo._hasResource["dijit._Templated"]){
dojo._hasResource["dijit._Templated"]=true;
dojo.provide("dijit._Templated");
dojo.declare("dijit._Templated",null,{templateNode:null,templateString:null,templatePath:null,widgetsInTemplate:false,_skipNodeCache:false,_stringRepl:function(tmpl){
var _81e=this.declaredClass,_81f=this;
return dojo.string.substitute(tmpl,this,function(_820,key){
if(key.charAt(0)=="!"){
_820=_81f[key.substr(1)];
}
if(typeof _820=="undefined"){
throw new Error(_81e+" template:"+key);
}
if(!_820){
return "";
}
return key.charAt(0)=="!"?_820:_820.toString().replace(/"/g,"&quot;");
},this);
},buildRendering:function(){
var _822=dijit._Templated.getCachedTemplate(this.templatePath,this.templateString,this._skipNodeCache);
var node;
if(dojo.isString(_822)){
node=dijit._Templated._createNodesFromText(this._stringRepl(_822))[0];
}else{
node=_822.cloneNode(true);
}
this.domNode=node;
this._attachTemplateNodes(node);
var _824=this.srcNodeRef;
if(_824&&_824.parentNode){
_824.parentNode.replaceChild(node,_824);
}
if(this.widgetsInTemplate){
var cw=this._supportingWidgets=dojo.parser.parse(node);
this._attachTemplateNodes(cw,function(n,p){
return n[p];
});
}
this._fillContent(_824);
},_fillContent:function(_828){
var dest=this.containerNode;
if(_828&&dest){
while(_828.hasChildNodes()){
dest.appendChild(_828.firstChild);
}
}
},_attachTemplateNodes:function(_82a,_82b){
_82b=_82b||function(n,p){
return n.getAttribute(p);
};
var _82e=dojo.isArray(_82a)?_82a:(_82a.all||_82a.getElementsByTagName("*"));
var x=dojo.isArray(_82a)?0:-1;
var _830={};
for(;x<_82e.length;x++){
var _831=(x==-1)?_82a:_82e[x];
if(this.widgetsInTemplate&&_82b(_831,"dojoType")){
continue;
}
var _832=_82b(_831,"dojoAttachPoint");
if(_832){
var _833,_834=_832.split(/\s*,\s*/);
while((_833=_834.shift())){
if(dojo.isArray(this[_833])){
this[_833].push(_831);
}else{
this[_833]=_831;
}
}
}
var _835=_82b(_831,"dojoAttachEvent");
if(_835){
var _836,_837=_835.split(/\s*,\s*/);
var trim=dojo.trim;
while((_836=_837.shift())){
if(_836){
var _839=null;
if(_836.indexOf(":")!=-1){
var _83a=_836.split(":");
_836=trim(_83a[0]);
_839=trim(_83a[1]);
}else{
_836=trim(_836);
}
if(!_839){
_839=_836;
}
this.connect(_831,_836,_839);
}
}
}
var role=_82b(_831,"waiRole");
if(role){
dijit.setWaiRole(_831,role);
}
var _83c=_82b(_831,"waiState");
if(_83c){
dojo.forEach(_83c.split(/\s*,\s*/),function(_83d){
if(_83d.indexOf("-")!=-1){
var pair=_83d.split("-");
dijit.setWaiState(_831,pair[0],pair[1]);
}
});
}
}
}});
dijit._Templated._templateCache={};
dijit._Templated.getCachedTemplate=function(_83f,_840,_841){
var _842=dijit._Templated._templateCache;
var key=_840||_83f;
var _844=_842[key];
if(_844){
if(!_844.ownerDocument||_844.ownerDocument==dojo.doc){
return _844;
}
dojo._destroyElement(_844);
}
if(!_840){
_840=dijit._Templated._sanitizeTemplateString(dojo._getText(_83f));
}
_840=dojo.string.trim(_840);
if(_841||_840.match(/\$\{([^\}]+)\}/g)){
return (_842[key]=_840);
}else{
return (_842[key]=dijit._Templated._createNodesFromText(_840)[0]);
}
};
dijit._Templated._sanitizeTemplateString=function(_845){
if(_845){
_845=_845.replace(/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,"");
var _846=_845.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
if(_846){
_845=_846[1];
}
}else{
_845="";
}
return _845;
};
if(dojo.isIE){
dojo.addOnWindowUnload(function(){
var _847=dijit._Templated._templateCache;
for(var key in _847){
var _849=_847[key];
if(!isNaN(_849.nodeType)){
dojo._destroyElement(_849);
}
delete _847[key];
}
});
}
(function(){
var _84a={cell:{re:/^<t[dh][\s\r\n>]/i,pre:"<table><tbody><tr>",post:"</tr></tbody></table>"},row:{re:/^<tr[\s\r\n>]/i,pre:"<table><tbody>",post:"</tbody></table>"},section:{re:/^<(thead|tbody|tfoot)[\s\r\n>]/i,pre:"<table>",post:"</table>"}};
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
var _84d="none";
var _84e=text.replace(/^\s+/,"");
for(var type in _84a){
var map=_84a[type];
if(map.re.test(_84e)){
_84d=type;
text=map.pre+text+map.post;
break;
}
}
tn.innerHTML=text;
if(tn.normalize){
tn.normalize();
}
var tag={cell:"tr",row:"tbody",section:"table"}[_84d];
var _852=(typeof tag!="undefined")?tn.getElementsByTagName(tag)[0]:tn;
var _853=[];
while(_852.firstChild){
_853.push(_852.removeChild(_852.firstChild));
}
tn.innerHTML="";
return _853;
};
})();
dojo.extend(dijit._Widget,{dojoAttachEvent:"",dojoAttachPoint:"",waiRole:"",waiState:""});
}
if(!dojo._hasResource["dijit.Tooltip"]){
dojo._hasResource["dijit.Tooltip"]=true;
dojo.provide("dijit.Tooltip");
dojo.declare("dijit._MasterTooltip",[dijit._Widget,dijit._Templated],{duration:dijit.defaultDuration,templateString:"<div class=\"dijitTooltip dijitTooltipLeft\" id=\"dojoTooltip\">\n\t<div class=\"dijitTooltipContainer dijitTooltipContents\" dojoAttachPoint=\"containerNode\" waiRole='alert'></div>\n\t<div class=\"dijitTooltipConnector\"></div>\n</div>\n",postCreate:function(){
dojo.body().appendChild(this.domNode);
this.bgIframe=new dijit.BackgroundIframe(this.domNode);
this.fadeIn=dojo.fadeIn({node:this.domNode,duration:this.duration,onEnd:dojo.hitch(this,"_onShow")});
this.fadeOut=dojo.fadeOut({node:this.domNode,duration:this.duration,onEnd:dojo.hitch(this,"_onHide")});
},show:function(_854,_855,_856){
if(this.aroundNode&&this.aroundNode===_855){
return;
}
if(this.fadeOut.status()=="playing"){
this._onDeck=arguments;
return;
}
this.containerNode.innerHTML=_854;
this.domNode.style.top=(this.domNode.offsetTop+1)+"px";
var _857={};
var ltr=this.isLeftToRight();
dojo.forEach((_856&&_856.length)?_856:dijit.Tooltip.defaultPosition,function(pos){
switch(pos){
case "after":
_857[ltr?"BR":"BL"]=ltr?"BL":"BR";
break;
case "before":
_857[ltr?"BL":"BR"]=ltr?"BR":"BL";
break;
case "below":
_857[ltr?"BL":"BR"]=ltr?"TL":"TR";
_857[ltr?"BR":"BL"]=ltr?"TR":"TL";
break;
case "above":
default:
_857[ltr?"TL":"TR"]=ltr?"BL":"BR";
_857[ltr?"TR":"TL"]=ltr?"BR":"BL";
break;
}
});
var pos=dijit.placeOnScreenAroundElement(this.domNode,_855,_857,dojo.hitch(this,"orient"));
dojo.style(this.domNode,"opacity",0);
this.fadeIn.play();
this.isShowingNow=true;
this.aroundNode=_855;
},orient:function(node,_85c,_85d){
node.className="dijitTooltip "+{"BL-TL":"dijitTooltipBelow dijitTooltipABLeft","TL-BL":"dijitTooltipAbove dijitTooltipABLeft","BR-TR":"dijitTooltipBelow dijitTooltipABRight","TR-BR":"dijitTooltipAbove dijitTooltipABRight","BR-BL":"dijitTooltipRight","BL-BR":"dijitTooltipLeft"}[_85c+"-"+_85d];
},_onShow:function(){
if(dojo.isIE){
this.domNode.style.filter="";
}
},hide:function(_85e){
if(!this.aroundNode||this.aroundNode!==_85e){
return;
}
if(this._onDeck){
this._onDeck=null;
return;
}
this.fadeIn.stop();
this.isShowingNow=false;
this.aroundNode=null;
this.fadeOut.play();
},_onHide:function(){
this.domNode.style.cssText="";
if(this._onDeck){
this.show.apply(this,this._onDeck);
this._onDeck=null;
}
}});
dijit.showTooltip=function(_85f,_860,_861){
if(!dijit._masterTT){
dijit._masterTT=new dijit._MasterTooltip();
}
return dijit._masterTT.show(_85f,_860,_861);
};
dijit.hideTooltip=function(_862){
if(!dijit._masterTT){
dijit._masterTT=new dijit._MasterTooltip();
}
return dijit._masterTT.hide(_862);
};
dojo.declare("dijit.Tooltip",dijit._Widget,{label:"",showDelay:400,connectId:[],position:[],postCreate:function(){
dojo.addClass(this.domNode,"dijitTooltipData");
this._connectNodes=[];
dojo.forEach(this.connectId,function(id){
var node=dojo.byId(id);
if(node){
this._connectNodes.push(node);
dojo.forEach(["onMouseEnter","onMouseLeave","onFocus","onBlur"],function(_865){
this.connect(node,_865.toLowerCase(),"_"+_865);
},this);
if(dojo.isIE){
node.style.zoom=1;
}
}
},this);
},_onMouseEnter:function(e){
this._onHover(e);
},_onMouseLeave:function(e){
this._onUnHover(e);
},_onFocus:function(e){
this._focus=true;
this._onHover(e);
this.inherited(arguments);
},_onBlur:function(e){
this._focus=false;
this._onUnHover(e);
this.inherited(arguments);
},_onHover:function(e){
if(!this._showTimer){
var _86b=e.target;
this._showTimer=setTimeout(dojo.hitch(this,function(){
this.open(_86b);
}),this.showDelay);
}
},_onUnHover:function(e){
if(this._focus){
return;
}
if(this._showTimer){
clearTimeout(this._showTimer);
delete this._showTimer;
}
this.close();
},open:function(_86d){
_86d=_86d||this._connectNodes[0];
if(!_86d){
return;
}
if(this._showTimer){
clearTimeout(this._showTimer);
delete this._showTimer;
}
dijit.showTooltip(this.label||this.domNode.innerHTML,_86d,this.position);
this._connectNode=_86d;
},close:function(){
dijit.hideTooltip(this._connectNode);
delete this._connectNode;
if(this._showTimer){
clearTimeout(this._showTimer);
delete this._showTimer;
}
},uninitialize:function(){
this.close();
}});
dijit.Tooltip.defaultPosition=["after","before"];
}
if(!dojo._hasResource["dojox.lang.functional.scan"]){
dojo._hasResource["dojox.lang.functional.scan"]=true;
dojo.provide("dojox.lang.functional.scan");
(function(){
var d=dojo,df=dojox.lang.functional,_870={};
d.mixin(df,{scanl:function(a,f,z,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
var t,n;
if(d.isArray(a)){
t=new Array((n=a.length)+1);
t[0]=z;
for(var i=0;i<n;z=f.call(o,z,a[i],i,a),t[++i]=z){
}
}else{
if(typeof a.hasNext=="function"&&typeof a.next=="function"){
t=[z];
for(var i=0;a.hasNext();t.push(z=f.call(o,z,a.next(),i++,a))){
}
}else{
t=[z];
for(var i in a){
if(i in _870){
continue;
}
t.push(z=f.call(o,z,a[i],i,a));
}
}
}
return t;
},scanl1:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
var t,n,z;
if(d.isArray(a)){
t=new Array(n=a.length);
t[0]=z=a[0];
for(var i=1;i<n;t[i]=z=f.call(o,z,a[i],i,a),++i){
}
}else{
if(typeof a.hasNext=="function"&&typeof a.next=="function"){
if(a.hasNext()){
t=[z=a.next()];
for(var i=1;a.hasNext();t.push(z=f.call(o,z,a.next(),i++,a))){
}
}
}else{
var _87f=true;
for(var i in a){
if(i in _870){
continue;
}
if(_87f){
t=[z=a[i]];
_87f=false;
}else{
t.push(z=f.call(o,z,a[i],i,a));
}
}
}
}
return t;
},scanr:function(a,f,z,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
var n=a.length,t=new Array(n+1);
t[n]=z;
for(var i=n;i>0;--i,z=f.call(o,z,a[i],i,a),t[i]=z){
}
return t;
},scanr1:function(a,f,o){
if(typeof a=="string"){
a=a.split("");
}
o=o||d.global;
f=df.lambda(f);
var n=a.length,t=new Array(n),z=a[n-1];
t[n-1]=z;
for(var i=n-1;i>0;--i,z=f.call(o,z,a[i],i,a),t[i]=z){
}
return t;
}});
})();
}
if(!dojo._hasResource["dojox.charting.action2d.Tooltip"]){
dojo._hasResource["dojox.charting.action2d.Tooltip"]=true;
dojo.provide("dojox.charting.action2d.Tooltip");
(function(){
var _88e=function(o){
var t=o.run&&o.run.data&&o.run.data[o.index];
if(t&&typeof t=="object"&&t.tooltip){
return t.tooltip;
}
return o.element=="bar"?o.x:o.y;
};
var df=dojox.lang.functional,pi4=Math.PI/4,pi2=Math.PI/2;
dojo.declare("dojox.charting.action2d.Tooltip",dojox.charting.action2d.Base,{defaultParams:{text:_88e},optionalParams:{},constructor:function(_894,plot,_896){
this.text=_896&&_896.text?_896.text:_88e;
this.connect();
},process:function(o){
if(!o.shape||!(o.type in this.overOutEvents)){
return;
}
if(o.type=="onmouseout"){
dijit.hideTooltip(this.aroundRect);
this.aroundRect=null;
return;
}
var _898={type:"rect"},_899=["after","before"];
switch(o.element){
case "marker":
_898.x=o.cx;
_898.y=o.cy;
_898.width=_898.height=1;
break;
case "circle":
_898.x=o.cx-o.cr;
_898.y=o.cy-o.cr;
_898.width=_898.height=2*o.cr;
break;
case "column":
_899=["above","below"];
case "bar":
_898=dojo.clone(o.shape.getShape());
break;
default:
if(!this.angles){
if(typeof o.run.data[0]=="number"){
this.angles=df.map(df.scanl(o.run.data,"+",0),"* 2 * Math.PI / this",df.foldl(o.run.data,"+",0));
}else{
this.angles=df.map(df.scanl(o.run.data,"a + b.y",0),"* 2 * Math.PI / this",df.foldl(o.run.data,"a + b.y",0));
}
}
var _89a=(this.angles[o.index]+this.angles[o.index+1])/2;
_898.x=o.cx+o.cr*Math.cos(_89a);
_898.y=o.cy+o.cr*Math.sin(_89a);
_898.width=_898.height=1;
if(_89a<pi4){
}else{
if(_89a<pi2+pi4){
_899=["below","above"];
}else{
if(_89a<Math.PI+pi4){
_899=["before","after"];
}else{
if(_89a<2*Math.PI-pi4){
_899=["above","below"];
}
}
}
}
break;
}
var lt=dojo.coords(this.chart.node,true);
_898.x+=lt.x;
_898.y+=lt.y;
_898.x=Math.round(_898.x);
_898.y=Math.round(_898.y);
_898.width=Math.ceil(_898.width);
_898.height=Math.ceil(_898.height);
this.aroundRect=_898;
dijit.showTooltip(this.text(o),this.aroundRect,_899);
}});
})();
}
if(!dojo._hasResource["dojox.charting.action2d.Highlight"]){
dojo._hasResource["dojox.charting.action2d.Highlight"]=true;
dojo.provide("dojox.charting.action2d.Highlight");
(function(){
var _89c=100,_89d=75,_89e=50,c=dojox.color,cc=function(_8a1){
return function(){
return _8a1;
};
},hl=function(_8a3){
var a=new c.Color(_8a3),x=a.toHsl();
if(x.s==0){
x.l=x.l<50?100:0;
}else{
x.s=_89c;
if(x.l<_89e){
x.l=_89d;
}else{
if(x.l>_89d){
x.l=_89e;
}else{
x.l=x.l-_89e>_89d-x.l?_89e:_89d;
}
}
}
return c.fromHsl(x);
};
dojo.declare("dojox.charting.action2d.Highlight",dojox.charting.action2d.Base,{defaultParams:{duration:400,easing:dojo.fx.easing.backOut},optionalParams:{highlight:"red"},constructor:function(_8a6,plot,_8a8){
var a=_8a8&&_8a8.highlight;
this.colorFun=a?(dojo.isFunction(a)?a:cc(a)):hl;
this.connect();
},process:function(o){
if(!o.shape||!(o.type in this.overOutEvents)){
return;
}
var _8ab=o.run.name,_8ac=o.index,anim,_8ae,_8af;
if(_8ab in this.anim){
anim=this.anim[_8ab][_8ac];
}else{
this.anim[_8ab]={};
}
if(anim){
anim.action.stop(true);
}else{
var _8b0=o.shape.getFill();
if(!_8b0||!(_8b0 instanceof dojo.Color)){
return;
}
this.anim[_8ab][_8ac]=anim={start:_8b0,end:this.colorFun(_8b0)};
}
var _8b1=anim.start,end=anim.end;
if(o.type=="onmouseout"){
var t=_8b1;
_8b1=end;
end=t;
}
anim.action=dojox.gfx.fx.animateFill({shape:o.shape,duration:this.duration,easing:this.easing,color:{start:_8b1,end:end}});
if(o.type=="onmouseout"){
dojo.connect(anim.action,"onEnd",this,function(){
if(this.anim[_8ab]){
delete this.anim[_8ab][_8ac];
}
});
}
anim.action.play();
}});
})();
}
if(!dojo._hasResource["dojox.charting.action2d.Magnify"]){
dojo._hasResource["dojox.charting.action2d.Magnify"]=true;
dojo.provide("dojox.charting.action2d.Magnify");
(function(){
var _8b4=2,m=dojox.gfx.matrix,gf=dojox.gfx.fx;
dojo.declare("dojox.charting.action2d.Magnify",dojox.charting.action2d.Base,{defaultParams:{duration:400,easing:dojo.fx.easing.backOut,scale:_8b4},optionalParams:{},constructor:function(_8b7,plot,_8b9){
this.scale=_8b9&&typeof _8b9.scale=="number"?_8b9.scale:_8b4;
this.connect();
},process:function(o){
if(!o.shape||!(o.type in this.overOutEvents)||!("cx" in o)||!("cy" in o)){
return;
}
var _8bb=o.run.name,_8bc=o.index,_8bd=[],anim,init,_8c0;
if(_8bb in this.anim){
anim=this.anim[_8bb][_8bc];
}else{
this.anim[_8bb]={};
}
if(anim){
anim.action.stop(true);
}else{
this.anim[_8bb][_8bc]=anim={};
}
if(o.type=="onmouseover"){
init=m.identity;
_8c0=this.scale;
}else{
init=m.scaleAt(this.scale,o.cx,o.cy);
_8c0=1/this.scale;
}
var _8c1={shape:o.shape,duration:this.duration,easing:this.easing,transform:[{name:"scaleAt",start:[1,o.cx,o.cy],end:[_8c0,o.cx,o.cy]},init]};
if(o.shape){
_8bd.push(gf.animateTransform(_8c1));
}
if(o.oultine){
_8c1.shape=o.outline;
_8bd.push(gf.animateTransform(_8c1));
}
if(o.shadow){
_8c1.shape=o.shadow;
_8bd.push(gf.animateTransform(_8c1));
}
if(!_8bd.length){
delete this.anim[_8bb][_8bc];
return;
}
anim.action=dojo.fx.combine(_8bd);
if(o.type=="onmouseout"){
dojo.connect(anim.action,"onEnd",this,function(){
if(this.anim[_8bb]){
delete this.anim[_8bb][_8bc];
}
});
}
anim.action.play();
}});
})();
}
if(!dojo._hasResource["blowery.charting"]){
dojo._hasResource["blowery.charting"]=true;
dojo.provide("blowery.charting");
}
