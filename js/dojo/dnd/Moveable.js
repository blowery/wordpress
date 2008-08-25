/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojo.dnd.Moveable"]){
dojo._hasResource["dojo.dnd.Moveable"]=true;
dojo.provide("dojo.dnd.Moveable");
dojo.require("dojo.dnd.Mover");
dojo.declare("dojo.dnd.Moveable",null,{handle:"",delay:0,skip:false,constructor:function(_1,_2){
this.node=dojo.byId(_1);
if(!_2){
_2={};
}
this.handle=_2.handle?dojo.byId(_2.handle):null;
if(!this.handle){
this.handle=this.node;
}
this.delay=_2.delay>0?_2.delay:0;
this.skip=_2.skip;
this.mover=_2.mover?_2.mover:dojo.dnd.Mover;
this.events=[dojo.connect(this.handle,"onmousedown",this,"onMouseDown"),dojo.connect(this.handle,"ondragstart",this,"onSelectStart"),dojo.connect(this.handle,"onselectstart",this,"onSelectStart")];
},markupFactory:function(_3,_4){
return new dojo.dnd.Moveable(_4,_3);
},destroy:function(){
dojo.forEach(this.events,dojo.disconnect);
this.events=this.node=this.handle=null;
},onMouseDown:function(e){
if(this.skip&&dojo.dnd.isFormElement(e)){
return;
}
if(this.delay){
this.events.push(dojo.connect(this.handle,"onmousemove",this,"onMouseMove"));
this.events.push(dojo.connect(this.handle,"onmouseup",this,"onMouseUp"));
this._lastX=e.pageX;
this._lastY=e.pageY;
}else{
this.onDragDetected(e);
}
dojo.stopEvent(e);
},onMouseMove:function(e){
if(Math.abs(e.pageX-this._lastX)>this.delay||Math.abs(e.pageY-this._lastY)>this.delay){
this.onMouseUp(e);
this.onDragDetected(e);
}
dojo.stopEvent(e);
},onMouseUp:function(e){
dojo.disconnect(this.events.pop());
dojo.disconnect(this.events.pop());
dojo.stopEvent(e);
},onSelectStart:function(e){
if(!this.skip||!dojo.dnd.isFormElement(e)){
dojo.stopEvent(e);
}
},onDragDetected:function(e){
new this.mover(this.node,e,this);
},onMoveStart:function(_a){
dojo.publish("/dnd/move/start",[_a]);
dojo.addClass(dojo.body(),"dojoMove");
dojo.addClass(this.node,"dojoMoveItem");
},onMoveStop:function(_b){
dojo.publish("/dnd/move/stop",[_b]);
dojo.removeClass(dojo.body(),"dojoMove");
dojo.removeClass(this.node,"dojoMoveItem");
},onFirstMove:function(_c){
},onMove:function(_d,_e){
this.onMoving(_d,_e);
var s=_d.node.style;
s.left=_e.l+"px";
s.top=_e.t+"px";
this.onMoved(_d,_e);
},onMoving:function(_10,_11){
},onMoved:function(_12,_13){
}});
}
