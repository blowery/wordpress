/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.grid._Scroller"]){
dojo._hasResource["dojox.grid._Scroller"]=true;
dojo.provide("dojox.grid._Scroller");
(function(){
var _1=function(_2){
var i=0,n,p=_2.parentNode;
while((n=p.childNodes[i++])){
if(n==_2){
return i-1;
}
}
return -1;
};
var _6=function(_7){
if(!_7){
return;
}
var _8=function(_9){
return _9.domNode&&dojo.isDescendant(_9.domNode,_7,true);
};
var ws=dijit.registry.filter(_8);
for(var i=0,w;(w=ws[i]);i++){
w.destroy();
}
delete ws;
};
var _d=function(_e){
var _f=dojo.byId(_e);
return (_f&&_f.tagName?_f.tagName.toLowerCase():"");
};
var _10=function(_11,_12){
var _13=[];
var i=0,n;
while((n=_11.childNodes[i++])){
if(_d(n)==_12){
_13.push(n);
}
}
return _13;
};
var _16=function(_17){
return _10(_17,"div");
};
dojo.declare("dojox.grid._Scroller",null,{constructor:function(_18){
this.setContentNodes(_18);
this.pageHeights=[];
this.pageNodes=[];
this.stack=[];
},rowCount:0,defaultRowHeight:32,keepRows:100,contentNode:null,scrollboxNode:null,defaultPageHeight:0,keepPages:10,pageCount:0,windowHeight:0,firstVisibleRow:0,lastVisibleRow:0,averageRowHeight:0,page:0,pageTop:0,init:function(_19,_1a,_1b){
switch(arguments.length){
case 3:
this.rowsPerPage=_1b;
case 2:
this.keepRows=_1a;
case 1:
this.rowCount=_19;
}
this.defaultPageHeight=this.defaultRowHeight*this.rowsPerPage;
this.pageCount=this._getPageCount(this.rowCount,this.rowsPerPage);
this.setKeepInfo(this.keepRows);
this.invalidate();
if(this.scrollboxNode){
this.scrollboxNode.scrollTop=0;
this.scroll(0);
this.scrollboxNode.onscroll=dojo.hitch(this,"onscroll");
}
},_getPageCount:function(_1c,_1d){
return _1c?(Math.ceil(_1c/_1d)||1):0;
},destroy:function(){
this.invalidateNodes();
delete this.contentNodes;
delete this.contentNode;
delete this.scrollboxNode;
},setKeepInfo:function(_1e){
this.keepRows=_1e;
this.keepPages=!this.keepRows?this.keepRows:Math.max(Math.ceil(this.keepRows/this.rowsPerPage),2);
},setContentNodes:function(_1f){
this.contentNodes=_1f;
this.colCount=(this.contentNodes?this.contentNodes.length:0);
this.pageNodes=[];
for(var i=0;i<this.colCount;i++){
this.pageNodes[i]=[];
}
},getDefaultNodes:function(){
return this.pageNodes[0]||[];
},invalidate:function(){
this.invalidateNodes();
this.pageHeights=[];
this.height=(this.pageCount?(this.pageCount-1)*this.defaultPageHeight+this.calcLastPageHeight():0);
this.resize();
},updateRowCount:function(_21){
this.invalidateNodes();
this.rowCount=_21;
var _22=this.pageCount;
this.pageCount=this._getPageCount(this.rowCount,this.rowsPerPage);
if(this.pageCount<_22){
for(var i=_22-1;i>=this.pageCount;i--){
this.height-=this.getPageHeight(i);
delete this.pageHeights[i];
}
}else{
if(this.pageCount>_22){
this.height+=this.defaultPageHeight*(this.pageCount-_22-1)+this.calcLastPageHeight();
}
}
this.resize();
},pageExists:function(_24){
return Boolean(this.getDefaultPageNode(_24));
},measurePage:function(_25){
return this.getDefaultPageNode(_25).offsetHeight;
},positionPage:function(_26,_27){
for(var i=0;i<this.colCount;i++){
this.pageNodes[i][_26].style.top=_27+"px";
}
},repositionPages:function(_29){
var _2a=this.getDefaultNodes();
var _2b=0;
for(var i=0;i<this.stack.length;i++){
_2b=Math.max(this.stack[i],_2b);
}
var n=_2a[_29];
var y=(n?this.getPageNodePosition(n)+this.getPageHeight(_29):0);
for(var p=_29+1;p<=_2b;p++){
n=_2a[p];
if(n){
if(this.getPageNodePosition(n)==y){
return;
}
this.positionPage(p,y);
}
y+=this.getPageHeight(p);
}
},installPage:function(_30){
for(var i=0;i<this.colCount;i++){
this.contentNodes[i].appendChild(this.pageNodes[i][_30]);
}
},preparePage:function(_32,_33,_34){
var p=(_34?this.popPage():null);
for(var i=0;i<this.colCount;i++){
var _37=this.pageNodes[i];
var _38=(p===null?this.createPageNode():this.invalidatePageNode(p,_37));
_38.pageIndex=_32;
_38.id=(this._pageIdPrefix||"")+"page-"+_32;
_37[_32]=_38;
}
},renderPage:function(_39){
var _3a=[];
for(var i=0;i<this.colCount;i++){
_3a[i]=this.pageNodes[i][_39];
}
for(var i=0,j=_39*this.rowsPerPage;(i<this.rowsPerPage)&&(j<this.rowCount);i++,j++){
this.renderRow(j,_3a);
}
},removePage:function(_3d){
for(var i=0,j=_3d*this.rowsPerPage;i<this.rowsPerPage;i++,j++){
this.removeRow(j);
}
},destroyPage:function(_40){
for(var i=0;i<this.colCount;i++){
dojo._destroyElement(this.invalidatePageNode(_40,this.pageNodes[i]));
}
},pacify:function(_42){
},pacifying:false,pacifyTicks:200,setPacifying:function(_43){
if(this.pacifying!=_43){
this.pacifying=_43;
this.pacify(this.pacifying);
}
},startPacify:function(){
this.startPacifyTicks=new Date().getTime();
},doPacify:function(){
var _44=(new Date().getTime()-this.startPacifyTicks)>this.pacifyTicks;
this.setPacifying(true);
this.startPacify();
return _44;
},endPacify:function(){
this.setPacifying(false);
},resize:function(){
if(this.scrollboxNode){
this.windowHeight=this.scrollboxNode.clientHeight;
}
for(var i=0;i<this.colCount;i++){
dojox.grid.util.setStyleHeightPx(this.contentNodes[i],this.height);
}
this.needPage(this.page,this.pageTop);
var _46=(this.page<this.pageCount-1)?this.rowsPerPage:(this.rowCount%this.rowsPerPage);
var _47=this.getPageHeight(this.page);
this.averageRowHeight=(_47>0&&_46>0)?(_47/_46):0;
this.defaultRowHeight=this.averageRowHeight||dojox.grid._Scroller.prototype.defaultRowHeight;
this.defaultPageHeight=this.defaultRowHeight*this.rowsPerPage;
},calcLastPageHeight:function(){
if(!this.pageCount){
return 0;
}
var _48=this.pageCount-1;
var _49=((this.rowCount%this.rowsPerPage)||(this.rowsPerPage))*this.defaultRowHeight;
this.pageHeights[_48]=_49;
return _49;
},updateContentHeight:function(_4a){
this.height+=_4a;
this.resize();
},updatePageHeight:function(_4b){
if(this.pageExists(_4b)){
var oh=this.getPageHeight(_4b);
var h=(this.measurePage(_4b))||(oh);
this.pageHeights[_4b]=h;
if((h)&&(oh!=h)){
this.updateContentHeight(h-oh);
this.repositionPages(_4b);
}
}
},rowHeightChanged:function(_4e){
this.updatePageHeight(Math.floor(_4e/this.rowsPerPage));
},invalidateNodes:function(){
while(this.stack.length){
this.destroyPage(this.popPage());
}
},createPageNode:function(){
var p=document.createElement("div");
p.style.position="absolute";
p.style[dojo._isBodyLtr()?"left":"right"]="0";
return p;
},getPageHeight:function(_50){
var ph=this.pageHeights[_50];
return (ph!==undefined?ph:this.defaultPageHeight);
},pushPage:function(_52){
return this.stack.push(_52);
},popPage:function(){
return this.stack.shift();
},findPage:function(_53){
var i=0,h=0;
for(var ph=0;i<this.pageCount;i++,h+=ph){
ph=this.getPageHeight(i);
if(h+ph>=_53){
break;
}
}
this.page=i;
this.pageTop=h;
},buildPage:function(_57,_58,_59){
this.preparePage(_57,_58);
this.positionPage(_57,_59);
this.installPage(_57);
this.renderPage(_57);
this.pushPage(_57);
},needPage:function(_5a,_5b){
var h=this.getPageHeight(_5a),oh=h;
if(!this.pageExists(_5a)){
this.buildPage(_5a,this.keepPages&&(this.stack.length>=this.keepPages),_5b);
h=this.measurePage(_5a)||h;
this.pageHeights[_5a]=h;
if(h&&(oh!=h)){
this.updateContentHeight(h-oh);
}
}else{
this.positionPage(_5a,_5b);
}
return h;
},onscroll:function(){
this.scroll(this.scrollboxNode.scrollTop);
},scroll:function(_5e){
this.grid.scrollTop=_5e;
if(this.colCount){
this.startPacify();
this.findPage(_5e);
var h=this.height;
var b=this.getScrollBottom(_5e);
for(var p=this.page,y=this.pageTop;(p<this.pageCount)&&((b<0)||(y<b));p++){
y+=this.needPage(p,y);
}
this.firstVisibleRow=this.getFirstVisibleRow(this.page,this.pageTop,_5e);
this.lastVisibleRow=this.getLastVisibleRow(p-1,y,b);
if(h!=this.height){
this.repositionPages(p-1);
}
this.endPacify();
}
},getScrollBottom:function(_63){
return (this.windowHeight>=0?_63+this.windowHeight:-1);
},processNodeEvent:function(e,_65){
var t=e.target;
while(t&&(t!=_65)&&t.parentNode&&(t.parentNode.parentNode!=_65)){
t=t.parentNode;
}
if(!t||!t.parentNode||(t.parentNode.parentNode!=_65)){
return false;
}
var _67=t.parentNode;
e.topRowIndex=_67.pageIndex*this.rowsPerPage;
e.rowIndex=e.topRowIndex+_1(t);
e.rowTarget=t;
return true;
},processEvent:function(e){
return this.processNodeEvent(e,this.contentNode);
},renderRow:function(_69,_6a){
},removeRow:function(_6b){
},getDefaultPageNode:function(_6c){
return this.getDefaultNodes()[_6c];
},positionPageNode:function(_6d,_6e){
},getPageNodePosition:function(_6f){
return _6f.offsetTop;
},invalidatePageNode:function(_70,_71){
var p=_71[_70];
if(p){
delete _71[_70];
this.removePage(_70,p);
_6(p);
p.innerHTML="";
}
return p;
},getPageRow:function(_73){
return _73*this.rowsPerPage;
},getLastPageRow:function(_74){
return Math.min(this.rowCount,this.getPageRow(_74+1))-1;
},getFirstVisibleRow:function(_75,_76,_77){
if(!this.pageExists(_75)){
return 0;
}
var row=this.getPageRow(_75);
var _79=this.getDefaultNodes();
var _7a=_16(_79[_75]);
for(var i=0,l=_7a.length;i<l&&_76<_77;i++,row++){
_76+=_7a[i].offsetHeight;
}
return (row?row-1:row);
},getLastVisibleRow:function(_7d,_7e,_7f){
if(!this.pageExists(_7d)){
return 0;
}
var _80=this.getDefaultNodes();
var row=this.getLastPageRow(_7d);
var _82=_16(_80[_7d]);
for(var i=_82.length-1;i>=0&&_7e>_7f;i--,row--){
_7e-=_82[i].offsetHeight;
}
return row+1;
},findTopRow:function(_84){
var _85=this.getDefaultNodes();
var _86=_16(_85[this.page]);
for(var i=0,l=_86.length,t=this.pageTop,h;i<l;i++){
h=_86[i].offsetHeight;
t+=h;
if(t>=_84){
this.offset=h-(t-_84);
return i+this.page*this.rowsPerPage;
}
}
return -1;
},findScrollTop:function(_8b){
var _8c=Math.floor(_8b/this.rowsPerPage);
var t=0;
for(var i=0;i<_8c;i++){
t+=this.getPageHeight(i);
}
this.pageTop=t;
this.needPage(_8c,this.pageTop);
var _8f=this.getDefaultNodes();
var _90=_16(_8f[_8c]);
var r=_8b-this.rowsPerPage*_8c;
for(var i=0,l=_90.length;i<l&&i<r;i++){
t+=_90[i].offsetHeight;
}
return t;
},dummy:0});
})();
}
