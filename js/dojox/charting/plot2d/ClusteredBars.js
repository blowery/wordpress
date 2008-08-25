/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.charting.plot2d.ClusteredBars"]){
dojo._hasResource["dojox.charting.plot2d.ClusteredBars"]=true;
dojo.provide("dojox.charting.plot2d.ClusteredBars");
dojo.require("dojox.charting.plot2d.common");
dojo.require("dojox.charting.plot2d.Bars");
dojo.require("dojox.lang.functional");
dojo.require("dojox.lang.functional.reversed");
(function(){
var df=dojox.lang.functional,dc=dojox.charting.plot2d.common,_3=df.lambda("item.purgeGroup()");
dojo.declare("dojox.charting.plot2d.ClusteredBars",dojox.charting.plot2d.Bars,{render:function(_4,_5){
this.dirty=this.isDirty();
if(this.dirty){
dojo.forEach(this.series,_3);
this.cleanGroup();
var s=this.group;
df.forEachRev(this.series,function(_7){
_7.cleanGroup(s);
});
}
var t=this.chart.theme,_9,_a,_b,f,ht=this._hScaler.scaler.getTransformerFromModel(this._hScaler),vt=this._vScaler.scaler.getTransformerFromModel(this._vScaler);
gap=this.opt.gap<this._vScaler.bounds.scale/3?this.opt.gap:0,thickness=(this._vScaler.bounds.scale-2*gap)/this.series.length,baseline=Math.max(0,this._hScaler.bounds.lower),baselineWidth=ht(baseline),height=thickness,events=this.events();
for(var i=this.series.length-1;i>=0;--i){
var run=this.series[i],_11=thickness*(this.series.length-i-1);
if(!this.dirty&&!run.dirty){
continue;
}
run.cleanGroup();
var s=run.group;
if(!run.fill||!run.stroke){
_9=run.dyn.color=new dojo.Color(t.next("color"));
}
_a=run.stroke?run.stroke:dc.augmentStroke(t.series.stroke,_9);
_b=run.fill?run.fill:dc.augmentFill(t.series.fill,_9);
for(var j=0;j<run.data.length;++j){
var v=run.data[j],hv=ht(v),_15=hv-baselineWidth,w=Math.abs(_15);
if(w>=1&&height>=1){
var _17=s.createRect({x:_5.l+(v<baseline?hv:baselineWidth),y:_4.height-_5.b-vt(j+1.5)+gap+_11,width:w,height:height}).setFill(_b).setStroke(_a);
run.dyn.fill=_17.getFill();
run.dyn.stroke=_17.getStroke();
if(events){
var o={element:"bar",index:j,run:run,plot:this,hAxis:this.hAxis||null,vAxis:this.vAxis||null,shape:_17,x:v,y:j+1.5};
this._connectEvents(_17,o);
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
