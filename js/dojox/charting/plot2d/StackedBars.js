/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.charting.plot2d.StackedBars"]){
dojo._hasResource["dojox.charting.plot2d.StackedBars"]=true;
dojo.provide("dojox.charting.plot2d.StackedBars");
dojo.require("dojox.charting.plot2d.common");
dojo.require("dojox.charting.plot2d.Bars");
dojo.require("dojox.lang.functional");
dojo.require("dojox.lang.functional.reversed");
(function(){
var df=dojox.lang.functional,dc=dojox.charting.plot2d.common,_3=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.StackedBars",dojox.charting.plot2d.Bars,{calculateAxes:function(_4){
var _5=dc.collectStackedStats(this.series),t;
this._maxRunLength=_5.hmax;
_5.hmin-=0.5;
_5.hmax+=0.5;
t=_5.hmin,_5.hmin=_5.vmin,_5.vmin=t;
t=_5.hmax,_5.hmax=_5.vmax,_5.vmax=t;
this._calc(_4,_5);
return this;
},render:function(_7,_8){
var _9=df.repeat(this._maxRunLength,"-> 0",0);
for(var i=0;i<this.series.length;++i){
var _b=this.series[i];
for(var j=0;j<_b.data.length;++j){
var v=_b.data[j];
if(isNaN(v)){
v=0;
}
_9[j]+=v;
}
}
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_3);
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(_f){
_f.cleanGroup(s);
});
}
var t=this.chart.theme,_11,_12,_13,f,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler);
gap=this.opt.gap<this._vScaler.bounds.scale/3?this.opt.gap:0,height=this._vScaler.bounds.scale-2*gap,events=this.events();
for(var i=this.series.length-1;i>=0;--i){
var _b=this.series[i];
if(!this.dirty&&!_b.dirty){
continue;
}
_b.cleanGroup();
var s=_b.group;
if(!_b.fill||!_b.stroke){
_11=_b.dyn.color=new dojo.Color(t.next("color"));
}
_12=_b.stroke?_b.stroke:dc.augmentStroke(t.series.stroke,_11);
_13=_b.fill?_b.fill:dc.augmentFill(t.series.fill,_11);
for(var j=0;j<_9.length;++j){
var v=_9[j],_17=ht(v);
if(_17>=1&&height>=1){
var _18=s.createRect({x:_8.l,y:_7.height-_8.b-vt(j+1.5)+gap,width:_17,height:height}).setFill(_13).setStroke(_12);
_b.dyn.fill=_18.getFill();
_b.dyn.stroke=_18.getStroke();
if(events){
var o={element:"bar",index:j,run:_b,plot:this,hAxis:this.hAxis||null,vAxis:this.vAxis||null,shape:_18,x:v,y:j+1.5};
this._connectEvents(_18,o);
}
}
}
_b.dirty=false;
for(var j=0;j<_b.data.length;++j){
var v=_b.data[j];
if(isNaN(v)){
v=0;
}
_9[j]-=v;
}
}
this.dirty=false;
return this;
}});
})();
}
