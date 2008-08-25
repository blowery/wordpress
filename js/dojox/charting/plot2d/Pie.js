/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.charting.plot2d.Pie"]){
dojo._hasResource["dojox.charting.plot2d.Pie"]=true;
dojo.provide("dojox.charting.plot2d.Pie");
dojo.require("dojox.charting.Element");
dojo.require("dojox.charting.axis2d.common");
dojo.require("dojox.charting.plot2d.common");
dojo.require("dojox.lang.functional");
dojo.require("dojox.gfx");
(function(){
var df=dojox.lang.functional,du=dojox.lang.utils,dc=dojox.charting.plot2d.common,da=dojox.charting.axis2d.common,g=dojox.gfx;
dojo.declare("dojox.charting.plot2d.Pie",dojox.charting.Element,{defaultParams:{labels:true,ticks:false,fixed:true,precision:1,labelOffset:20,labelStyle:"default",htmlLabels:true},optionalParams:{font:"",fontColor:"",radius:0},constructor:function(_6,_7){
this.opt=dojo.clone(this.defaultParams);
du.updateWithObject(this.opt,_7);
du.updateWithPattern(this.opt,_7,this.optionalParams);
this.run=null;
this.dyn=[];
},clear:function(){
this.dirty=true;
this.dyn=[];
return this;
},setAxis:function(_8){
return this;
},addSeries:function(_9){
this.run=_9;
return this;
},calculateAxes:function(_a){
return this;
},getRequiredColors:function(){
return this.run?this.run.data.length:0;
},plotEvent:function(o){
},connect:function(_c,_d){
this.dirty=true;
return dojo.connect(this,"plotEvent",_c,_d);
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
},_connectEvents:function(_10,o){
_10.connect("onmouseover",this,function(e){
o.type="onmouseover";
o.event=e;
this.plotEvent(o);
});
_10.connect("onmouseout",this,function(e){
o.type="onmouseout";
o.event=e;
this.plotEvent(o);
});
_10.connect("onclick",this,function(e){
o.type="onclick";
o.event=e;
this.plotEvent(o);
});
},render:function(dim,_16){
if(!this.dirty){
return this;
}
this.dirty=false;
this.cleanGroup();
var s=this.group,_18,t=this.chart.theme;
var rx=(dim.width-_16.l-_16.r)/2,ry=(dim.height-_16.t-_16.b)/2,r=Math.min(rx,ry),_1d="font" in this.opt?this.opt.font:t.axis.font,_1e=_1d?g.normalizedLength(g.splitFontString(_1d).size):0,_1f="fontColor" in this.opt?this.opt.fontColor:t.axis.fontColor,_20=0,_21,sum,_23,_24,_25,_26,run=this.run.data,_28=this.events();
if(typeof run[0]=="number"){
sum=df.foldl1(run,"+");
_23=dojo.map(run,function(x){
return x/sum;
});
if(this.opt.labels){
_24=dojo.map(_23,function(x){
return this._getLabel(x*100)+"%";
},this);
}
}else{
sum=df.foldl1(run,function(a,b){
return {y:a.y+b.y};
}).y;
_23=df.map(run,function(x){
return x.y/sum;
});
if(this.opt.labels){
_24=dojo.map(_23,function(x,i){
var v=run[i];
return "text" in v?v.text:this._getLabel(x*100)+"%";
},this);
}
}
if(this.opt.labels){
_25=df.foldl1(df.map(_24,function(_31){
return dojox.gfx._base._getTextBox(_31,{font:_1d}).w;
},this),"Math.max(a, b)")/2;
if(this.opt.labelOffset<0){
r=Math.min(rx-2*_25,ry-_1e)+this.opt.labelOffset;
}
_26=r-this.opt.labelOffset;
}
if("radius" in this.opt){
r=this.opt.radius;
_26=r-this.opt.labelOffset;
}
var _32={cx:_16.l+rx,cy:_16.t+ry,r:r};
this.dyn=[];
if(!this.run||!run.length){
return this;
}
if(run.length==1){
_18=new dojo.Color(t.next("color"));
var _33=s.createCircle(_32).setFill(dc.augmentFill(t.run.fill,_18)).setStroke(dc.augmentStroke(t.series.stroke,_18));
this.dyn.push({color:_18,fill:_33.getFill(),stroke:_33.getStroke()});
if(this.opt.labels){
var _34=da.createText[this.opt.htmlLabels&&dojox.gfx.renderer!="vml"?"html":"gfx"](this.chart,s,_32.cx,_32.cy+_1e/2,"middle","100%",_1d,_1f);
if(this.opt.htmlLabels){
this.htmlElements.push(_34);
}
}
return this;
}
dojo.forEach(_23,function(x,i){
var end=_20+x*2*Math.PI,v=run[i];
if(i+1==_23.length){
end=2*Math.PI;
}
var _39=end-_20,x1=_32.cx+r*Math.cos(_20),y1=_32.cy+r*Math.sin(_20),x2=_32.cx+r*Math.cos(end),y2=_32.cy+r*Math.sin(end);
var _3e,_3f,_40;
if(typeof v=="object"){
_3e="color" in v?v.color:new dojo.Color(t.next("color"));
_3f="fill" in v?v.fill:dc.augmentFill(t.series.fill,_3e);
_40="stroke" in v?v.stroke:dc.augmentStroke(t.series.stroke,_3e);
}else{
_3e=new dojo.Color(t.next("color"));
_3f=dc.augmentFill(t.series.fill,_3e);
_40=dc.augmentStroke(t.series.stroke,_3e);
}
var _41=s.createPath({}).moveTo(_32.cx,_32.cy).lineTo(x1,y1).arcTo(r,r,0,_39>Math.PI,true,x2,y2).lineTo(_32.cx,_32.cy).closePath().setFill(_3f).setStroke(_40);
this.dyn.push({color:_3e,fill:_3f,stroke:_40});
if(_28){
var o={element:"slice",index:i,run:this.run,plot:this,shape:_41,x:i,y:typeof v=="number"?v:v.y,cx:_32.cx,cy:_32.cy,cr:r};
this._connectEvents(_41,o);
}
_20=end;
},this);
if(this.opt.labels){
_20=0;
dojo.forEach(_23,function(_43,i){
var end=_20+_43*2*Math.PI,v=run[i];
if(i+1==_23.length){
end=2*Math.PI;
}
var _47=(_20+end)/2,x=_32.cx+_26*Math.cos(_47),y=_32.cy+_26*Math.sin(_47)+_1e/2;
var _4a=da.createText[this.opt.htmlLabels&&dojox.gfx.renderer!="vml"?"html":"gfx"](this.chart,s,x,y,"middle",_24[i],_1d,(typeof v=="object"&&"fontColor" in v)?v.fontColor:_1f);
if(this.opt.htmlLabels){
this.htmlElements.push(_4a);
}
_20=end;
},this);
}
return this;
},_getLabel:function(_4b){
return this.opt.fixed?_4b.toFixed(this.opt.precision):_4b.toString();
}});
})();
}
