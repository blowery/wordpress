/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.grid._Grid"]){
dojo._hasResource["dojox.grid._Grid"]=true;
dojo.provide("dojox.grid._Grid");
dojo.require("dojox.html.metrics");
dojo.require("dojox.grid.util");
dojo.require("dojox.grid._Scroller");
dojo.require("dojox.grid._Layout");
dojo.require("dojox.grid._View");
dojo.require("dojox.grid._ViewManager");
dojo.require("dojox.grid._RowManager");
dojo.require("dojox.grid._FocusManager");
dojo.require("dojox.grid._EditManager");
dojo.require("dojox.grid.Selection");
dojo.require("dojox.grid._RowSelector");
dojo.require("dojox.grid._Events");
dojo.require("dijit.Menu");
dojo.requireLocalization("dijit","loading",null,"nb,da,pt-pt,tr,el,sv,ru,ROOT,es,pl,fi,ja,zh,ko,hu,nl,de,he,zh-tw,ar,pt,fr,cs,it");
dojo.requireLocalization("dojox.grid","grid",null,"ROOT");
(function(){
var _1={cancel:function(_2){
if(_2){
clearTimeout(_2);
}
},jobs:[],job:function(_3,_4,_5){
_1.cancelJob(_3);
var _6=function(){
delete _1.jobs[_3];
_5();
};
_1.jobs[_3]=setTimeout(_6,_4);
},cancelJob:function(_7){
_1.cancel(_1.jobs[_7]);
}};
dojo.declare("dojox.grid._Grid",[dijit._Widget,dijit._Templated,dojox.grid._Events],{templateString:"<div class=\"dojoxGrid\" hidefocus=\"hidefocus\" role=\"wairole:grid\" dojoAttachEvent=\"onmouseout:_mouseOut\">\n\t<div class=\"dojoxGridMasterHeader\" dojoAttachPoint=\"viewsHeaderNode\" tabindex=\"-1\"></div>\n\t<div class=\"dojoxGridMasterView\" dojoAttachPoint=\"viewsNode\"></div>\n\t<div class=\"dojoxGridMasterMessages\" style=\"display: none;\" dojoAttachPoint=\"messagesNode\"></div>\n\t<span dojoAttachPoint=\"lastFocusNode\" tabindex=\"0\"></span>\n</div>\n",classTag:"dojoxGrid",get:function(_8){
},rowCount:5,keepRows:75,rowsPerPage:25,autoWidth:false,autoHeight:"",autoRender:true,defaultHeight:"15em",height:"",structure:"",elasticView:-1,singleClickEdit:false,rowSelector:"",columnReordering:false,headerMenu:null,placeholderLabel:"GridColumns",_click:null,loadingMessage:"<span class='dojoxGridLoading'>${loadingState}</span>",errorMessage:"<span class='dojoxGridError'>${errorState}</span>",noDataMessage:"<span class='dojoxGridNoData'>${noData}</span>",sortInfo:0,themeable:true,_placeholders:null,buildRendering:function(){
this.inherited(arguments);
if(this.get==dojox.grid._Grid.prototype.get){
this.get=null;
}
if(!this.domNode.getAttribute("tabIndex")){
this.domNode.tabIndex="0";
}
this.createScroller();
this.createLayout();
this.createViews();
this.createManagers();
this.createSelection();
dojox.html.metrics.initOnFontResize();
this.connect(dojox.html.metrics,"onFontResize","textSizeChanged");
dojox.grid.util.funnelEvents(this.domNode,this,"doKeyEvent",dojox.grid.util.keyEvents);
this.connect(this,"onShow","renderOnIdle");
},postMixInProperties:function(){
this.inherited(arguments);
var _9=dojo.mixin(dojo.i18n.getLocalization("dijit","loading",this.lang),dojo.i18n.getLocalization("dojox.grid","grid",this.lang));
this.loadingMessage=dojo.string.substitute(this.loadingMessage,_9);
this.errorMessage=dojo.string.substitute(this.errorMessage,_9);
this.noDataMessage=dojo.string.substitute(this.noDataMessage,_9);
this._setAutoHeightAttr(this.autoHeight,true);
},postCreate:function(){
this.styleChanged=this._styleChanged;
this._placeholders=[];
this.setHeaderMenu(this.headerMenu);
this.setStructure(this.structure);
this._click=[];
},destroy:function(){
this.domNode.onReveal=null;
this.domNode.onSizeChange=null;
this.edit.destroy();
delete this.edit;
this.views.destroyViews();
if(this.scroller){
this.scroller.destroy();
delete this.scroller;
}
if(this.focus){
this.focus.destroy();
delete this.focus;
}
if(this.headerMenu&&this._placeholders.length){
dojo.forEach(this._placeholders,function(p){
p.unReplace(true);
});
this.headerMenu.unBindDomNode(this.viewsHeaderNode);
}
this.inherited(arguments);
},_setAutoHeightAttr:function(ah,_c){
if(typeof ah=="string"){
if(!ah||ah=="false"){
ah=false;
}else{
if(ah=="true"){
ah=true;
}else{
ah=window.parseInt(ah,10);
if(isNaN(ah)){
ah=false;
}
if(ah<0){
ah=true;
}else{
if(ah===0){
ah=false;
}
}
}
}
}
this.autoHeight=ah;
if(typeof ah=="boolean"){
this._autoHeight=ah;
}else{
if(typeof ah=="number"){
this._autoHeight=(ah>=this.rowCount);
}else{
this._autoHeight=false;
}
}
if(this._started&&!_c){
this.render();
}
},styleChanged:function(){
this.setStyledClass(this.domNode,"");
},_styleChanged:function(){
this.styleChanged();
this.update();
},textSizeChanged:function(){
setTimeout(dojo.hitch(this,"_textSizeChanged"),1);
},_textSizeChanged:function(){
if(this.domNode){
this.views.forEach(function(v){
v.content.update();
});
this.render();
}
},sizeChange:function(){
_1.job(this.id+"SizeChange",50,dojo.hitch(this,"update"));
},renderOnIdle:function(){
setTimeout(dojo.hitch(this,"render"),1);
},createManagers:function(){
this.rows=new dojox.grid._RowManager(this);
this.focus=new dojox.grid._FocusManager(this);
this.edit=new dojox.grid._EditManager(this);
},createSelection:function(){
this.selection=new dojox.grid.Selection(this);
},createScroller:function(){
this.scroller=new dojox.grid._Scroller();
this.scroller.grid=this;
this.scroller._pageIdPrefix=this.id+"-";
this.scroller.renderRow=dojo.hitch(this,"renderRow");
this.scroller.removeRow=dojo.hitch(this,"rowRemoved");
},createLayout:function(){
this.layout=new dojox.grid._Layout(this);
this.connect(this.layout,"moveColumn","onMoveColumn");
},onMoveColumn:function(){
this.render();
this._resize();
},createViews:function(){
this.views=new dojox.grid._ViewManager(this);
this.views.createView=dojo.hitch(this,"createView");
},createView:function(_e,_f){
var c=dojo.getObject(_e);
var _11=new c({grid:this,index:_f});
this.viewsNode.appendChild(_11.domNode);
this.viewsHeaderNode.appendChild(_11.headerNode);
this.views.addView(_11);
return _11;
},buildViews:function(){
for(var i=0,vs;(vs=this.layout.structure[i]);i++){
this.createView(vs.type||dojox._scopeName+".grid._View",i).setStructure(vs);
}
this.scroller.setContentNodes(this.views.getContentNodes());
},setStructure:function(_14){
var s=_14;
if(s&&dojo.isString(s)){
s=dojo.getObject(s);
}
if(!s){
if(this.layout.structure){
s=this.layout.structure;
}else{
return;
}
}
this.views.destroyViews();
if(s!==this.layout.structure){
this.layout.setStructure(s);
}
this._structureChanged();
},getColumnTogglingItems:function(){
return dojo.map(this.layout.cells,function(_16){
if(!_16.menuItems){
_16.menuItems=[];
}
var _17=this;
var _18=new dijit.CheckedMenuItem({label:_16.name,checked:!_16.hidden,_gridCell:_16,onChange:function(_19){
if(_17.layout.setColumnVisibility(this._gridCell.index,_19)){
var _1a=this._gridCell.menuItems;
if(_1a.length>1){
dojo.forEach(_1a,function(_1b){
if(_1b!==this){
_1b.setAttribute("checked",_19);
}
},this);
}
var _19=dojo.filter(_17.layout.cells,function(c){
if(c.menuItems.length>1){
dojo.forEach(c.menuItems,"item.attr('disabled', false);");
}else{
c.menuItems[0].attr("disabled",false);
}
return !c.hidden;
});
if(_19.length==1){
dojo.forEach(_19[0].menuItems,"item.attr('disabled', true);");
}
}
},destroy:function(){
var _1d=dojo.indexOf(this._gridCell.menuItems,this);
this._gridCell.menuItems.splice(_1d,1);
delete this._gridCell;
dijit.CheckedMenuItem.prototype.destroy.apply(this,arguments);
}});
_16.menuItems.push(_18);
return _18;
},this);
},setHeaderMenu:function(_1e){
if(this._placeholders.length){
dojo.forEach(this._placeholders,function(p){
p.unReplace(true);
});
this._placeholders=[];
}
if(this.headerMenu){
this.headerMenu.unBindDomNode(this.viewsHeaderNode);
}
this.headerMenu=_1e;
if(!_1e){
return;
}
this.headerMenu.bindDomNode(this.viewsHeaderNode);
if(this.headerMenu.getPlaceholders){
this._placeholders=this.headerMenu.getPlaceholders(this.placeholderLabel);
}
},setupHeaderMenu:function(){
if(this._placeholders&&this._placeholders.length){
dojo.forEach(this._placeholders,function(p){
if(p._replaced){
p.unReplace(true);
}
p.replace(this.getColumnTogglingItems());
},this);
}
},_fetch:function(_21){
this.setScrollTop(0);
},getItem:function(_22){
return null;
},showMessage:function(_23){
if(_23){
this.messagesNode.innerHTML=_23;
this.messagesNode.style.display="";
}else{
this.messagesNode.innerHTML="";
this.messagesNode.style.display="none";
}
},_structureChanged:function(){
this.buildViews();
if(this.autoRender&&this._started){
this.render();
}
},hasLayout:function(){
return this.layout.cells.length;
},resize:function(_24){
this._sizeBox=_24;
this._resize();
this.sizeChange();
},_getPadBorder:function(){
this._padBorder=this._padBorder||dojo._getPadBorderExtents(this.domNode);
return this._padBorder;
},_getHeaderHeight:function(){
var vns=this.viewsHeaderNode.style,t=vns.display=="none"?0:this.views.measureHeader();
vns.height=t+"px";
this.views.normalizeHeaderNodeHeight();
return t;
},_resize:function(){
if(!this.domNode.parentNode||this.domNode.parentNode.nodeType!=1||!this.hasLayout()){
return;
}
var _27=this._getPadBorder();
if(this._autoHeight){
this.domNode.style.height="auto";
this.viewsNode.style.height="";
}else{
if(typeof this.autoHeight=="number"){
var h=this._getHeaderHeight();
h+=(this.scroller.averageRowHeight*this.autoHeight);
this.domNode.style.height=h+"px";
}else{
if(this.flex>0){
}else{
if(this.domNode.clientHeight<=_27.h){
if(this.domNode.parentNode==document.body){
this.domNode.style.height=this.defaultHeight;
}else{
if(this.height){
this.domNode.style.height=this.height;
}else{
this.fitTo="parent";
}
}
}
}
}
}
if(this._sizeBox){
dojo.contentBox(this.domNode,this._sizeBox);
}else{
if(this.fitTo=="parent"){
var h=dojo._getContentBox(this.domNode.parentNode).h;
dojo.marginBox(this.domNode,{h:Math.max(0,h)});
}
}
var h=dojo._getContentBox(this.domNode).h;
if(h==0&&!this._autoHeight){
this.viewsHeaderNode.style.display="none";
}else{
this.viewsHeaderNode.style.display="block";
this._getHeaderHeight();
}
this.adaptWidth();
this.adaptHeight();
this.postresize();
},adaptWidth:function(){
var w=this.autoWidth?0:this.domNode.clientWidth||(this.domNode.offsetWidth-this._getPadBorder().w),vw=this.views.arrange(1,w);
this.views.onEach("adaptWidth");
if(this.autoWidth){
this.domNode.style.width=vw+"px";
}
},adaptHeight:function(){
var t=this._getHeaderHeight();
var h=(this._autoHeight?-1:Math.max(this.domNode.clientHeight-t,0)||0);
this.views.onEach("setSize",[0,h]);
this.views.onEach("adaptHeight");
if(!this._autoHeight){
var _2d=0,_2e=0;
var _2f=dojo.filter(this.views.views,function(v){
var has=v.hasHScrollbar();
if(has){
_2d++;
}else{
_2e++;
}
return (!has);
});
if(_2d>0&&_2e>0){
dojo.forEach(_2f,function(v){
v.adaptHeight(true);
});
}
}
if(this.autoHeight===true||h!=-1||(typeof this.autoHeight=="number"&&this.autoHeight>=this.rowCount)){
this.scroller.windowHeight=h;
}else{
this.scroller.windowHeight=Math.max(this.domNode.clientHeight-t,0);
}
},startup:function(){
if(this._started){
return;
}
this.inherited(arguments);
this.render();
},render:function(){
if(!this.domNode){
return;
}
if(!this._started){
return;
}
if(!this.hasLayout()){
this.scroller.init(0,this.keepRows,this.rowsPerPage);
return;
}
this.update=this.defaultUpdate;
this._render();
},_render:function(){
this.scroller.init(this.rowCount,this.keepRows,this.rowsPerPage);
this.prerender();
this.setScrollTop(0);
this.postrender();
},prerender:function(){
this.keepRows=this._autoHeight?0:this.constructor.prototype.keepRows;
this.scroller.setKeepInfo(this.keepRows);
this.views.render();
this._resize();
},postrender:function(){
this.postresize();
this.focus.initFocusView();
dojo.setSelectable(this.domNode,false);
},postresize:function(){
if(this._autoHeight){
var _33=Math.max(this.views.measureContent())+"px";
this.viewsNode.style.height=_33;
}
},renderRow:function(_34,_35){
this.views.renderRow(_34,_35);
},rowRemoved:function(_36){
this.views.rowRemoved(_36);
},invalidated:null,updating:false,beginUpdate:function(){
this.invalidated=[];
this.updating=true;
},endUpdate:function(){
this.updating=false;
var i=this.invalidated,r;
if(i.all){
this.update();
}else{
if(i.rowCount!=undefined){
this.updateRowCount(i.rowCount);
}else{
for(r in i){
this.updateRow(Number(r));
}
}
}
this.invalidated=null;
},defaultUpdate:function(){
if(!this.domNode){
return;
}
if(this.updating){
this.invalidated.all=true;
return;
}
var _39=this.scrollTop;
this.prerender();
this.scroller.invalidateNodes();
this.setScrollTop(_39);
this.postrender();
},update:function(){
this.render();
},updateRow:function(_3a){
_3a=Number(_3a);
if(this.updating){
this.invalidated[_3a]=true;
}else{
this.views.updateRow(_3a);
this.scroller.rowHeightChanged(_3a);
}
},updateRowCount:function(_3b){
if(this.updating){
this.invalidated.rowCount=_3b;
}else{
this.rowCount=_3b;
this._setAutoHeightAttr(this.autoHeight,true);
if(this.layout.cells.length){
this.scroller.updateRowCount(_3b);
}
this._resize();
if(this.layout.cells.length){
this.setScrollTop(this.scrollTop);
}
}
},updateRowStyles:function(_3c){
this.views.updateRowStyles(_3c);
},rowHeightChanged:function(_3d){
this.views.renormalizeRow(_3d);
this.scroller.rowHeightChanged(_3d);
},fastScroll:true,delayScroll:false,scrollRedrawThreshold:(dojo.isIE?100:50),scrollTo:function(_3e){
if(!this.fastScroll){
this.setScrollTop(_3e);
return;
}
var _3f=Math.abs(this.lastScrollTop-_3e);
this.lastScrollTop=_3e;
if(_3f>this.scrollRedrawThreshold||this.delayScroll){
this.delayScroll=true;
this.scrollTop=_3e;
this.views.setScrollTop(_3e);
_1.job("dojoxGridScroll",200,dojo.hitch(this,"finishScrollJob"));
}else{
this.setScrollTop(_3e);
}
},finishScrollJob:function(){
this.delayScroll=false;
this.setScrollTop(this.scrollTop);
},setScrollTop:function(_40){
this.scroller.scroll(this.views.setScrollTop(_40));
},scrollToRow:function(_41){
this.setScrollTop(this.scroller.findScrollTop(_41)+1);
},styleRowNode:function(_42,_43){
if(_43){
this.rows.styleRowNode(_42,_43);
}
},_mouseOut:function(e){
this.rows.setOverRow(-2);
},getCell:function(_45){
return this.layout.cells[_45];
},setCellWidth:function(_46,_47){
this.getCell(_46).unitWidth=_47;
},getCellName:function(_48){
return "Cell "+_48.index;
},canSort:function(_49){
},sort:function(){
},getSortAsc:function(_4a){
_4a=_4a==undefined?this.sortInfo:_4a;
return Boolean(_4a>0);
},getSortIndex:function(_4b){
_4b=_4b==undefined?this.sortInfo:_4b;
return Math.abs(_4b)-1;
},setSortIndex:function(_4c,_4d){
var si=_4c+1;
if(_4d!=undefined){
si*=(_4d?1:-1);
}else{
if(this.getSortIndex()==_4c){
si=-this.sortInfo;
}
}
this.setSortInfo(si);
},setSortInfo:function(_4f){
if(this.canSort(_4f)){
this.sortInfo=_4f;
this.sort();
this.update();
}
},doKeyEvent:function(e){
e.dispatch="do"+e.type;
this.onKeyEvent(e);
},_dispatch:function(m,e){
if(m in this){
return this[m](e);
}
},dispatchKeyEvent:function(e){
this._dispatch(e.dispatch,e);
},dispatchContentEvent:function(e){
this.edit.dispatchEvent(e)||e.sourceView.dispatchContentEvent(e)||this._dispatch(e.dispatch,e);
},dispatchHeaderEvent:function(e){
e.sourceView.dispatchHeaderEvent(e)||this._dispatch("doheader"+e.type,e);
},dokeydown:function(e){
this.onKeyDown(e);
},doclick:function(e){
if(e.cellNode){
this.onCellClick(e);
}else{
this.onRowClick(e);
}
},dodblclick:function(e){
if(e.cellNode){
this.onCellDblClick(e);
}else{
this.onRowDblClick(e);
}
},docontextmenu:function(e){
if(e.cellNode){
this.onCellContextMenu(e);
}else{
this.onRowContextMenu(e);
}
},doheaderclick:function(e){
if(e.cellNode){
this.onHeaderCellClick(e);
}else{
this.onHeaderClick(e);
}
},doheaderdblclick:function(e){
if(e.cellNode){
this.onHeaderCellDblClick(e);
}else{
this.onHeaderDblClick(e);
}
},doheadercontextmenu:function(e){
if(e.cellNode){
this.onHeaderCellContextMenu(e);
}else{
this.onHeaderContextMenu(e);
}
},doStartEdit:function(_5d,_5e){
this.onStartEdit(_5d,_5e);
},doApplyCellEdit:function(_5f,_60,_61){
this.onApplyCellEdit(_5f,_60,_61);
},doCancelEdit:function(_62){
this.onCancelEdit(_62);
},doApplyEdit:function(_63){
this.onApplyEdit(_63);
},addRow:function(){
this.updateRowCount(this.rowCount+1);
},removeSelectedRows:function(){
this.updateRowCount(Math.max(0,this.rowCount-this.selection.getSelected().length));
this.selection.clear();
}});
dojox.grid._Grid.markupFactory=function(_64,_65,_66,_67){
var d=dojo;
var _69=function(n){
var w=d.attr(n,"width")||"auto";
if((w!="auto")&&(w.slice(-2)!="em")&&(w.slice(-1)!="%")){
w=parseInt(w)+"px";
}
return w;
};
if(!_64.structure&&_65.nodeName.toLowerCase()=="table"){
_64.structure=d.query("> colgroup",_65).map(function(cg){
var sv=d.attr(cg,"span");
var v={noscroll:(d.attr(cg,"noscroll")=="true")?true:false,__span:(!!sv?parseInt(sv):1),cells:[]};
if(d.hasAttr(cg,"width")){
v.width=_69(cg);
}
return v;
});
if(!_64.structure.length){
_64.structure.push({__span:Infinity,cells:[]});
}
d.query("thead > tr",_65).forEach(function(tr,_70){
var _71=0;
var _72=0;
var _73;
var _74=null;
d.query("> th",tr).map(function(th){
if(!_74){
_73=0;
_74=_64.structure[0];
}else{
if(_71>=(_73+_74.__span)){
_72++;
_73+=_74.__span;
lastView=_74;
_74=_64.structure[_72];
}
}
var _76={name:d.trim(d.attr(th,"name")||th.innerHTML),colSpan:parseInt(d.attr(th,"colspan")||1,10),type:d.trim(d.attr(th,"cellType")||"")};
_71+=_76.colSpan;
var _77=d.attr(th,"rowspan");
if(_77){
_76.rowSpan=_77;
}
if(d.hasAttr(th,"width")){
_76.width=_69(th);
}
if(d.hasAttr(th,"relWidth")){
_76.relWidth=window.parseInt(dojo.attr(th,"relWidth"),10);
}
if(d.hasAttr(th,"hidden")){
_76.hidden=d.getAttr(th,"hidden")=="true";
}
if(_67){
_67(th,_76);
}
_76.type=_76.type?dojo.getObject(_76.type):dojox.grid.cells.Cell;
if(_76.type&&_76.type.markupFactory){
_76.type.markupFactory(th,_76);
}
if(!_74.cells[_70]){
_74.cells[_70]=[];
}
_74.cells[_70].push(_76);
});
});
}
return new _66(_64,_65);
};
})();
}
