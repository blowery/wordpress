/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dijit.layout.BorderContainer"]){
dojo._hasResource["dijit.layout.BorderContainer"]=true;
dojo.provide("dijit.layout.BorderContainer");
dojo.require("dijit.layout._LayoutWidget");
dojo.require("dojo.cookie");
dojo.declare("dijit.layout.BorderContainer",dijit.layout._LayoutWidget,{design:"headline",gutters:true,liveSplitters:true,persist:false,baseClass:"dijitBorderContainer",_splitterClass:"dijit.layout._Splitter",postMixInProperties:function(){
if(!this.gutters){
this.baseClass+="NoGutter";
}
this.inherited(arguments);
},postCreate:function(){
this.inherited(arguments);
this._splitters={};
this._splitterThickness={};
},startup:function(){
if(this._started){
return;
}
dojo.forEach(this.getChildren(),this._setupChild,this);
this.inherited(arguments);
},_setupChild:function(_1){
var _2=_1.region;
if(_2){
this.inherited(arguments);
dojo.addClass(_1.domNode,this.baseClass+"Pane");
var _3=this.isLeftToRight();
if(_2=="leading"){
_2=_3?"left":"right";
}
if(_2=="trailing"){
_2=_3?"right":"left";
}
this["_"+_2]=_1.domNode;
this["_"+_2+"Widget"]=_1;
if((_1.splitter||this.gutters)&&!this._splitters[_2]){
var _4=dojo.getObject(_1.splitter?this._splitterClass:"dijit.layout._Gutter");
var _5={left:"right",right:"left",top:"bottom",bottom:"top",leading:"trailing",trailing:"leading"};
var _6=dojo.query("[region="+_5[_1.region]+"]",this.domNode);
var _7=new _4({container:this,child:_1,region:_2,oppNode:_6[0],live:this.liveSplitters});
_7.isSplitter=true;
this._splitters[_2]=_7.domNode;
dojo.place(this._splitters[_2],_1.domNode,"after");
this._computeSplitterThickness(_2);
_7.startup();
}
_1.region=_2;
}
},_computeSplitterThickness:function(_8){
var re=new RegExp("top|bottom");
this._splitterThickness[_8]=dojo.marginBox(this._splitters[_8])[(re.test(_8)?"h":"w")];
},layout:function(){
this._layoutChildren();
},addChild:function(_a,_b){
this.inherited(arguments);
if(this._started){
this._layoutChildren();
}
},removeChild:function(_c){
var _d=_c.region;
var _e=this._splitters[_d];
if(_e){
dijit.byNode(_e).destroy();
delete this._splitters[_d];
delete this._splitterThickness[_d];
}
this.inherited(arguments);
delete this["_"+_d];
delete this["_"+_d+"Widget"];
if(this._started){
this._layoutChildren(_c.region);
}
dojo.removeClass(_c.domNode,this.baseClass+"Pane");
},getChildren:function(){
return dojo.filter(this.inherited(arguments),function(_f){
return !_f.isSplitter;
});
},getSplitter:function(_10){
var _11=this._splitters[_10];
return (_11)?dijit.byNode(_11):null;
},resize:function(_12,_13){
if(!this.cs||!this.pe){
var _14=this.domNode;
this.cs=dojo.getComputedStyle(_14);
this.pe=dojo._getPadExtents(_14,this.cs);
this.pe.r=dojo._toPixelValue(_14,this.cs.paddingRight);
this.pe.b=dojo._toPixelValue(_14,this.cs.paddingBottom);
dojo.style(_14,"padding","0px");
}
this.inherited(arguments);
},_layoutChildren:function(_15){
var _16=(this.design=="sidebar");
var _17=0,_18=0,_19=0,_1a=0;
var _1b={},_1c={},_1d={},_1e={},_1f=(this._center&&this._center.style)||{};
var _20=/left|right/.test(_15);
var cs=this.cs;
var pe=this.pe;
var _23=!_15||(!_20&&!_16);
var _24=!_15||(_20&&_16);
if(this._top){
_1b=_24&&this._top.style;
_17=dojo.marginBox(this._top).h;
}
if(this._left){
_1c=_23&&this._left.style;
_19=dojo.marginBox(this._left).w;
}
if(this._right){
_1d=_23&&this._right.style;
_1a=dojo.marginBox(this._right).w;
}
if(this._bottom){
_1e=_24&&this._bottom.style;
_18=dojo.marginBox(this._bottom).h;
}
var _25=this._splitters;
var _26=_25.top;
var _27=_25.bottom;
var _28=_25.left;
var _29=_25.right;
var _2a=this._splitterThickness;
var _2b=_2a.top||0;
var _2c=_2a.left||0;
var _2d=_2a.right||0;
var _2e=_2a.bottom||0;
if(_2c>50||_2d>50){
setTimeout(dojo.hitch(this,function(){
for(var _2f in this._splitters){
this._computeSplitterThickness(_2f);
}
this._layoutChildren();
}),50);
return false;
}
var _30={left:(_16?_19+_2c:0)+pe.l+"px",right:(_16?_1a+_2d:0)+pe.r+"px"};
if(_26){
dojo.mixin(_26.style,_30);
_26.style.top=_17+pe.t+"px";
}
if(_27){
dojo.mixin(_27.style,_30);
_27.style.bottom=_18+pe.b+"px";
}
_30={top:(_16?0:_17+_2b)+pe.t+"px",bottom:(_16?0:_18+_2e)+pe.b+"px"};
if(_28){
dojo.mixin(_28.style,_30);
_28.style.left=_19+pe.l+"px";
}
if(_29){
dojo.mixin(_29.style,_30);
_29.style.right=_1a+pe.r+"px";
}
dojo.mixin(_1f,{top:pe.t+_17+_2b+"px",left:pe.l+_19+_2c+"px",right:pe.r+_1a+_2d+"px",bottom:pe.b+_18+_2e+"px"});
var _31={top:_16?pe.t+"px":_1f.top,bottom:_16?pe.b+"px":_1f.bottom};
dojo.mixin(_1c,_31);
dojo.mixin(_1d,_31);
_1c.left=pe.l+"px";
_1d.right=pe.r+"px";
_1b.top=pe.t+"px";
_1e.bottom=pe.b+"px";
if(_16){
_1b.left=_1e.left=_19+(this.isLeftToRight()?_2c:0)+pe.l+"px";
_1b.right=_1e.right=_1a+(this.isLeftToRight()?0:_2d)+pe.r+"px";
}else{
_1b.left=_1e.left=pe.l+"px";
_1b.right=_1e.right=pe.r+"px";
}
var _32=this._borderBox.h-pe.t-pe.b;
var _33=_32-(_17+_2b+_18+_2e);
var _34=_16?_32:_33;
var _35=this._borderBox.w-pe.l-pe.r;
var _36=_35-(_19+_2c+_1a+_2d);
var _37=_16?_36:_35;
var dim={top:{w:_37,h:_17},bottom:{w:_37,h:_18},left:{w:_19,h:_34},right:{w:_1a,h:_34},center:{h:_33,w:_36}};
var _39=dojo.isIE||dojo.some(this.getChildren(),function(_3a){
return _3a.domNode.tagName=="TEXTAREA";
});
if(_39){
var _3b=function(_3c,dim){
if(_3c){
(_3c.resize?_3c.resize(dim):dojo.marginBox(_3c.domNode,dim));
}
};
if(_28){
_28.style.height=_34;
}
if(_29){
_29.style.height=_34;
}
_3b(this._leftWidget,{h:_34},dim.left);
_3b(this._rightWidget,{h:_34},dim.right);
if(_26){
_26.style.width=_37;
}
if(_27){
_27.style.width=_37;
}
_3b(this._topWidget,{w:_37},dim.top);
_3b(this._bottomWidget,{w:_37},dim.bottom);
_3b(this._centerWidget,dim.center);
}else{
var _3e={};
if(_15){
_3e[_15]=_3e.center=true;
if(/top|bottom/.test(_15)&&this.design!="sidebar"){
_3e.left=_3e.right=true;
}else{
if(/left|right/.test(_15)&&this.design=="sidebar"){
_3e.top=_3e.bottom=true;
}
}
}
dojo.forEach(this.getChildren(),function(_3f){
if(_3f.resize&&(!_15||_3f.region in _3e)){
_3f.resize(null,dim[_3f.region]);
}
},this);
}
},destroy:function(){
for(region in this._splitters){
var _40=this._splitters[region];
dijit.byNode(_40).destroy();
dojo._destroyElement(_40);
}
delete this._splitters;
delete this._splitterThickness;
this.inherited(arguments);
}});
dojo.extend(dijit._Widget,{region:"",splitter:false,minSize:0,maxSize:Infinity});
dojo.require("dijit._Templated");
dojo.declare("dijit.layout._Splitter",[dijit._Widget,dijit._Templated],{live:true,templateString:"<div class=\"dijitSplitter\" dojoAttachEvent=\"onkeypress:_onKeyPress,onmousedown:_startDrag\" tabIndex=\"0\" waiRole=\"separator\"><div class=\"dijitSplitterThumb\"></div></div>",postCreate:function(){
this.inherited(arguments);
this.horizontal=/top|bottom/.test(this.region);
dojo.addClass(this.domNode,"dijitSplitter"+(this.horizontal?"H":"V"));
this._factor=/top|left/.test(this.region)?1:-1;
this._minSize=this.child.minSize;
this._computeMaxSize();
this.connect(this.container,"layout",dojo.hitch(this,this._computeMaxSize));
this._cookieName=this.container.id+"_"+this.region;
if(this.container.persist){
var _41=dojo.cookie(this._cookieName);
if(_41){
this.child.domNode.style[this.horizontal?"height":"width"]=_41;
}
}
},_computeMaxSize:function(){
var dim=this.horizontal?"h":"w";
var _43=dojo.contentBox(this.container.domNode)[dim]-(this.oppNode?dojo.marginBox(this.oppNode)[dim]:0);
this._maxSize=Math.min(this.child.maxSize,_43);
},_startDrag:function(e){
if(!this.cover){
this.cover=dojo.doc.createElement("div");
dojo.addClass(this.cover,"dijitSplitterCover");
dojo.place(this.cover,this.child.domNode,"after");
}else{
this.cover.style.zIndex=1;
}
if(this.fake){
dojo._destroyElement(this.fake);
}
if(!(this._resize=this.live)){
(this.fake=this.domNode.cloneNode(true)).removeAttribute("id");
dojo.addClass(this.domNode,"dijitSplitterShadow");
dojo.place(this.fake,this.domNode,"after");
}
dojo.addClass(this.domNode,"dijitSplitterActive");
var _45=this._factor,max=this._maxSize,min=this._minSize||10;
var _48=this.horizontal;
var _49=_48?"pageY":"pageX";
var _4a=e[_49];
var _4b=this.domNode.style;
var dim=_48?"h":"w";
var _4d=dojo.marginBox(this.child.domNode)[dim];
var _4e=this.region;
var _4f=parseInt(this.domNode.style[_4e],10);
var _50=this._resize;
var mb={};
var _52=this.child.domNode;
var _53=dojo.hitch(this.container,this.container._layoutChildren);
var de=dojo.doc.body;
this._handlers=(this._handlers||[]).concat([dojo.connect(de,"onmousemove",this._drag=function(e,_56){
var _57=e[_49]-_4a,_58=_45*_57+_4d,_59=Math.max(Math.min(_58,max),min);
if(_50||_56){
mb[dim]=_59;
dojo.marginBox(_52,mb);
_53(_4e);
}
_4b[_4e]=_45*_57+_4f+(_59-_58)+"px";
}),dojo.connect(de,"onmouseup",this,"_stopDrag")]);
dojo.stopEvent(e);
},_stopDrag:function(e){
try{
if(this.cover){
this.cover.style.zIndex=-1;
}
if(this.fake){
dojo._destroyElement(this.fake);
}
dojo.removeClass(this.domNode,"dijitSplitterActive");
dojo.removeClass(this.domNode,"dijitSplitterShadow");
this._drag(e);
this._drag(e,true);
}
finally{
this._cleanupHandlers();
delete this._drag;
}
if(this.container.persist){
dojo.cookie(this._cookieName,this.child.domNode.style[this.horizontal?"height":"width"]);
}
},_cleanupHandlers:function(){
dojo.forEach(this._handlers,dojo.disconnect);
delete this._handlers;
},_onKeyPress:function(e){
this._resize=true;
var _5c=this.horizontal;
var _5d=1;
var dk=dojo.keys;
switch(e.charOrCode){
case _5c?dk.UP_ARROW:dk.LEFT_ARROW:
_5d*=-1;
break;
case _5c?dk.DOWN_ARROW:dk.RIGHT_ARROW:
break;
default:
return;
}
var _5f=dojo.marginBox(this.child.domNode)[_5c?"h":"w"]+this._factor*_5d;
var mb={};
mb[this.horizontal?"h":"w"]=Math.max(Math.min(_5f,this._maxSize),this._minSize);
dojo.marginBox(this.child.domNode,mb);
this.container._layoutChildren(this.region);
dojo.stopEvent(e);
},destroy:function(){
this._cleanupHandlers();
delete this.child;
delete this.container;
delete this.fake;
this.inherited(arguments);
}});
dojo.declare("dijit.layout._Gutter",[dijit._Widget,dijit._Templated],{templateString:"<div class=\"dijitGutter\" waiRole=\"presentation\"></div>",postCreate:function(){
this.horizontal=/top|bottom/.test(this.region);
dojo.addClass(this.domNode,"dijitGutter"+(this.horizontal?"H":"V"));
}});
}
