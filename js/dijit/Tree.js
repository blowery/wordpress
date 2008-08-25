/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dijit.Tree"]){
dojo._hasResource["dijit.Tree"]=true;
dojo.provide("dijit.Tree");
dojo.require("dojo.fx");
dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit._Container");
dojo.require("dojo.cookie");
dojo.declare("dijit._TreeNode",[dijit._Widget,dijit._Templated,dijit._Container,dijit._Contained],{item:null,isTreeNode:true,label:"",isExpandable:null,isExpanded:false,state:"UNCHECKED",templateString:"<div class=\"dijitTreeNode\" waiRole=\"presentation\"\n\t><div dojoAttachPoint=\"rowNode\" class=\"dijitTreeRow\" waiRole=\"presentation\"\n\t\t><img src=\"${_blankGif}\" alt=\"\" dojoAttachPoint=\"expandoNode\" class=\"dijitTreeExpando\" waiRole=\"presentation\"\n\t\t><span dojoAttachPoint=\"expandoNodeText\" class=\"dijitExpandoText\" waiRole=\"presentation\"\n\t\t></span\n\t\t><span dojoAttachPoint=\"contentNode\" dojoAttachEvent=\"onmouseenter:_onMouseEnter, onmouseleave:_onMouseLeave\"\n\t\t\tclass=\"dijitTreeContent\" waiRole=\"presentation\">\n\t\t\t<img src=\"${_blankGif}\" alt=\"\" dojoAttachPoint=\"iconNode\" class=\"dijitTreeIcon\" waiRole=\"presentation\"\n\t\t\t><span dojoAttachPoint=\"labelNode\" class=\"dijitTreeLabel\" wairole=\"treeitem\" tabindex=\"-1\" waiState=\"selected-false\" dojoAttachEvent=\"onfocus:_onNodeFocus\"></span>\n\t\t</span\n\t></div>\n\t<div dojoAttachPoint=\"containerNode\" class=\"dijitTreeContainer\" waiRole=\"presentation\" style=\"display: none;\"></div>\n</div>\n",postCreate:function(){
this.setLabelNode(this.label);
this._setExpando();
this._updateItemClasses(this.item);
if(this.isExpandable){
dijit.setWaiState(this.labelNode,"expanded",this.isExpanded);
}
},markProcessing:function(){
this.state="LOADING";
this._setExpando(true);
},unmarkProcessing:function(){
this._setExpando(false);
},_updateItemClasses:function(_1){
var _2=this.tree,_3=_2.model;
if(_2._v10Compat&&_1===_3.root){
_1=null;
}
this.iconNode.className="dijitTreeIcon "+_2.getIconClass(_1,this.isExpanded);
this.labelNode.className="dijitTreeLabel "+_2.getLabelClass(_1,this.isExpanded);
},_updateLayout:function(){
var _4=this.getParent();
if(!_4||_4.rowNode.style.display=="none"){
dojo.addClass(this.domNode,"dijitTreeIsRoot");
}else{
dojo.toggleClass(this.domNode,"dijitTreeIsLast",!this.getNextSibling());
}
},_setExpando:function(_5){
var _6=["dijitTreeExpandoLoading","dijitTreeExpandoOpened","dijitTreeExpandoClosed","dijitTreeExpandoLeaf"];
var _7=["*","-","+","*"];
var _8=_5?0:(this.isExpandable?(this.isExpanded?1:2):3);
dojo.forEach(_6,function(s){
dojo.removeClass(this.expandoNode,s);
},this);
dojo.addClass(this.expandoNode,_6[_8]);
this.expandoNodeText.innerHTML=_7[_8];
},expand:function(){
if(this.isExpanded){
return;
}
this._wipeOut&&this._wipeOut.stop();
this.isExpanded=true;
dijit.setWaiState(this.labelNode,"expanded","true");
dijit.setWaiRole(this.containerNode,"group");
this.contentNode.className="dijitTreeContent dijitTreeContentExpanded";
this._setExpando();
this._updateItemClasses(this.item);
if(!this._wipeIn){
this._wipeIn=dojo.fx.wipeIn({node:this.containerNode,duration:dijit.defaultDuration});
}
this._wipeIn.play();
},collapse:function(){
if(!this.isExpanded){
return;
}
this._wipeIn&&this._wipeIn.stop();
this.isExpanded=false;
dijit.setWaiState(this.labelNode,"expanded","false");
this.contentNode.className="dijitTreeContent";
this._setExpando();
this._updateItemClasses(this.item);
if(!this._wipeOut){
this._wipeOut=dojo.fx.wipeOut({node:this.containerNode,duration:dijit.defaultDuration});
}
this._wipeOut.play();
},setLabelNode:function(_a){
this.labelNode.innerHTML="";
this.labelNode.appendChild(dojo.doc.createTextNode(_a));
},setChildItems:function(_b){
var _c=this.tree,_d=_c.model;
this.getChildren().forEach(function(_e){
dijit._Container.prototype.removeChild.call(this,_e);
},this);
this.state="LOADED";
if(_b&&_b.length>0){
this.isExpandable=true;
dojo.forEach(_b,function(_f){
var id=_d.getIdentity(_f),_11=_c._itemNodeMap[id],_12=(_11&&!_11.getParent())?_11:this.tree._createTreeNode({item:_f,tree:_c,isExpandable:_d.mayHaveChildren(_f),label:_c.getLabel(_f)});
this.addChild(_12);
_c._itemNodeMap[id]=_12;
if(this.tree.persist){
if(_c._openedItemIds[id]){
_c._expandNode(_12);
}
}
},this);
dojo.forEach(this.getChildren(),function(_13,idx){
_13._updateLayout();
});
}else{
this.isExpandable=false;
}
if(this._setExpando){
this._setExpando(false);
}
if(this==_c.rootNode){
var fc=this.tree.showRoot?this:this.getChildren()[0],_16=fc?fc.labelNode:this.domNode;
_16.setAttribute("tabIndex","0");
_c.lastFocused=fc;
}
},removeChild:function(_17){
this.inherited(arguments);
var _18=this.getChildren();
if(_18.length==0){
this.isExpandable=false;
this.collapse();
}
dojo.forEach(_18,function(_19){
_19._updateLayout();
});
},makeExpandable:function(){
this.isExpandable=true;
this._setExpando(false);
},_onNodeFocus:function(evt){
var _1b=dijit.getEnclosingWidget(evt.target);
this.tree._onTreeFocus(_1b);
},_onMouseEnter:function(evt){
dojo.addClass(this.contentNode,"dijitTreeNodeHover");
},_onMouseLeave:function(evt){
dojo.removeClass(this.contentNode,"dijitTreeNodeHover");
}});
dojo.declare("dijit.Tree",[dijit._Widget,dijit._Templated],{store:null,model:null,query:null,label:"",showRoot:true,childrenAttr:["children"],openOnClick:false,templateString:"<div class=\"dijitTreeContainer\" waiRole=\"tree\"\n\tdojoAttachEvent=\"onclick:_onClick,onkeypress:_onKeyPress\">\n</div>\n",isExpandable:true,isTree:true,persist:true,dndController:null,dndParams:["onDndDrop","itemCreator","onDndCancel","checkAcceptance","checkItemAcceptance","dragThreshold"],onDndDrop:null,itemCreator:null,onDndCancel:null,checkAcceptance:null,checkItemAcceptance:null,dragThreshold:0,_publish:function(_1e,_1f){
dojo.publish(this.id,[dojo.mixin({tree:this,event:_1e},_1f||{})]);
},postMixInProperties:function(){
this.tree=this;
this._itemNodeMap={};
if(!this.cookieName){
this.cookieName=this.id+"SaveStateCookie";
}
},postCreate:function(){
if(this.persist){
var _20=dojo.cookie(this.cookieName);
this._openedItemIds={};
if(_20){
dojo.forEach(_20.split(","),function(_21){
this._openedItemIds[_21]=true;
},this);
}
}
if(!this.model){
this._store2model();
}
this.connect(this.model,"onChange","_onItemChange");
this.connect(this.model,"onChildrenChange","_onItemChildrenChange");
this.connect(this.model,"onDelete","_onItemDelete");
this._load();
this.inherited(arguments);
if(this.dndController){
if(dojo.isString(this.dndController)){
this.dndController=dojo.getObject(this.dndController);
}
var _22={};
for(var i=0;i<this.dndParams.length;i++){
if(this[this.dndParams[i]]){
_22[this.dndParams[i]]=this[this.dndParams[i]];
}
}
this.dndController=new this.dndController(this,_22);
}
},_store2model:function(){
this._v10Compat=true;
dojo.deprecated("Tree: from version 2.0, should specify a model object rather than a store/query");
var _24={id:this.id+"_ForestStoreModel",store:this.store,query:this.query,childrenAttrs:this.childrenAttr};
if(this.params.mayHaveChildren){
_24.mayHaveChildren=dojo.hitch(this,"mayHaveChildren");
}
if(this.params.getItemChildren){
_24.getChildren=dojo.hitch(this,function(_25,_26,_27){
this.getItemChildren((this._v10Compat&&_25===this.model.root)?null:_25,_26,_27);
});
}
this.model=new dijit.tree.ForestStoreModel(_24);
this.showRoot=Boolean(this.label);
},_load:function(){
this.model.getRoot(dojo.hitch(this,function(_28){
var rn=this.rootNode=this.tree._createTreeNode({item:_28,tree:this,isExpandable:true,label:this.label||this.getLabel(_28)});
if(!this.showRoot){
rn.rowNode.style.display="none";
}
this.domNode.appendChild(rn.domNode);
this._itemNodeMap[this.model.getIdentity(_28)]=rn;
rn._updateLayout();
this._expandNode(rn);
}),function(err){
console.error(this,": error loading root: ",err);
});
},mayHaveChildren:function(_2b){
},getItemChildren:function(_2c,_2d){
},getLabel:function(_2e){
return this.model.getLabel(_2e);
},getIconClass:function(_2f,_30){
return (!_2f||this.model.mayHaveChildren(_2f))?(_30?"dijitFolderOpened":"dijitFolderClosed"):"dijitLeaf";
},getLabelClass:function(_31,_32){
},_onKeyPress:function(e){
if(e.altKey){
return;
}
var dk=dojo.keys;
var _35=dijit.getEnclosingWidget(e.target);
if(!_35){
return;
}
var key=e.charOrCode;
if(typeof key=="string"){
if(!e.altKey&&!e.ctrlKey&&!e.shiftKey&&!e.metaKey){
this._onLetterKeyNav({node:_35,key:key.toLowerCase()});
dojo.stopEvent(e);
}
}else{
var map=this._keyHandlerMap;
if(!map){
map={};
map[dk.ENTER]="_onEnterKey";
map[this.isLeftToRight()?dk.LEFT_ARROW:dk.RIGHT_ARROW]="_onLeftArrow";
map[this.isLeftToRight()?dk.RIGHT_ARROW:dk.LEFT_ARROW]="_onRightArrow";
map[dk.UP_ARROW]="_onUpArrow";
map[dk.DOWN_ARROW]="_onDownArrow";
map[dk.HOME]="_onHomeKey";
map[dk.END]="_onEndKey";
this._keyHandlerMap=map;
}
if(this._keyHandlerMap[key]){
this[this._keyHandlerMap[key]]({node:_35,item:_35.item});
dojo.stopEvent(e);
}
}
},_onEnterKey:function(_38){
this._publish("execute",{item:_38.item,node:_38.node});
this.onClick(_38.item,_38.node);
},_onDownArrow:function(_39){
var _3a=this._getNextNode(_39.node);
if(_3a&&_3a.isTreeNode){
this.focusNode(_3a);
}
},_onUpArrow:function(_3b){
var _3c=_3b.node;
var _3d=_3c.getPreviousSibling();
if(_3d){
_3c=_3d;
while(_3c.isExpandable&&_3c.isExpanded&&_3c.hasChildren()){
var _3e=_3c.getChildren();
_3c=_3e[_3e.length-1];
}
}else{
var _3f=_3c.getParent();
if(!(!this.showRoot&&_3f===this.rootNode)){
_3c=_3f;
}
}
if(_3c&&_3c.isTreeNode){
this.focusNode(_3c);
}
},_onRightArrow:function(_40){
var _41=_40.node;
if(_41.isExpandable&&!_41.isExpanded){
this._expandNode(_41);
}else{
if(_41.hasChildren()){
_41=_41.getChildren()[0];
if(_41&&_41.isTreeNode){
this.focusNode(_41);
}
}
}
},_onLeftArrow:function(_42){
var _43=_42.node;
if(_43.isExpandable&&_43.isExpanded){
this._collapseNode(_43);
}else{
_43=_43.getParent();
if(_43&&_43.isTreeNode){
this.focusNode(_43);
}
}
},_onHomeKey:function(){
var _44=this._getRootOrFirstNode();
if(_44){
this.focusNode(_44);
}
},_onEndKey:function(_45){
var _46=this;
while(_46.isExpanded){
var c=_46.getChildren();
_46=c[c.length-1];
}
if(_46&&_46.isTreeNode){
this.focusNode(_46);
}
},_onLetterKeyNav:function(_48){
var _49=_48.node,_4a=_49,key=_48.key;
do{
_49=this._getNextNode(_49);
if(!_49){
_49=this._getRootOrFirstNode();
}
}while(_49!==_4a&&(_49.label.charAt(0).toLowerCase()!=key));
if(_49&&_49.isTreeNode){
if(_49!==_4a){
this.focusNode(_49);
}
}
},_onClick:function(e){
var _4d=e.target;
var _4e=dijit.getEnclosingWidget(_4d);
if(!_4e||!_4e.isTreeNode){
return;
}
if((this.openOnClick&&_4e.isExpandable)||(_4d==_4e.expandoNode||_4d==_4e.expandoNodeText)){
if(_4e.isExpandable){
this._onExpandoClick({node:_4e});
}
}else{
this._publish("execute",{item:_4e.item,node:_4e});
this.onClick(_4e.item,_4e);
this.focusNode(_4e);
}
dojo.stopEvent(e);
},_onExpandoClick:function(_4f){
var _50=_4f.node;
this.focusNode(_50);
if(_50.isExpanded){
this._collapseNode(_50);
}else{
this._expandNode(_50);
}
},onClick:function(_51,_52){
},onOpen:function(_53,_54){
},onClose:function(_55,_56){
},_getNextNode:function(_57){
if(_57.isExpandable&&_57.isExpanded&&_57.hasChildren()){
return _57.getChildren()[0];
}else{
while(_57&&_57.isTreeNode){
var _58=_57.getNextSibling();
if(_58){
return _58;
}
_57=_57.getParent();
}
return null;
}
},_getRootOrFirstNode:function(){
return this.showRoot?this.rootNode:this.rootNode.getChildren()[0];
},_collapseNode:function(_59){
if(_59.isExpandable){
if(_59.state=="LOADING"){
return;
}
_59.collapse();
this.onClose(_59.item,_59);
if(this.persist&&_59.item){
delete this._openedItemIds[this.model.getIdentity(_59.item)];
this._saveState();
}
}
},_expandNode:function(_5a){
if(!_5a.isExpandable){
return;
}
var _5b=this.model,_5c=_5a.item;
switch(_5a.state){
case "LOADING":
return;
case "UNCHECKED":
_5a.markProcessing();
var _5d=this;
_5b.getChildren(_5c,function(_5e){
_5a.unmarkProcessing();
_5a.setChildItems(_5e);
_5d._expandNode(_5a);
},function(err){
console.error(_5d,": error loading root children: ",err);
});
break;
default:
_5a.expand();
this.onOpen(_5a.item,_5a);
if(this.persist&&_5c){
this._openedItemIds[_5b.getIdentity(_5c)]=true;
this._saveState();
}
}
},blurNode:function(){
var _60=this.lastFocused;
if(!_60){
return;
}
var _61=_60.labelNode;
dojo.removeClass(_61,"dijitTreeLabelFocused");
_61.setAttribute("tabIndex","-1");
dijit.setWaiState(_61,"selected",false);
this.lastFocused=null;
},focusNode:function(_62){
_62.labelNode.focus();
},_onBlur:function(){
this.inherited(arguments);
if(this.lastFocused){
var _63=this.lastFocused.labelNode;
dojo.removeClass(_63,"dijitTreeLabelFocused");
}
},_onTreeFocus:function(_64){
if(_64){
if(_64!=this.lastFocused){
this.blurNode();
}
var _65=_64.labelNode;
_65.setAttribute("tabIndex","0");
dijit.setWaiState(_65,"selected",true);
dojo.addClass(_65,"dijitTreeLabelFocused");
this.lastFocused=_64;
}
},_onItemDelete:function(_66){
var _67=this.model.getIdentity(_66);
var _68=this._itemNodeMap[_67];
if(_68){
var _69=_68.getParent();
if(_69){
_69.removeChild(_68);
}
delete this._itemNodeMap[_67];
_68.destroyRecursive();
}
},_onItemChange:function(_6a){
var _6b=this.model,_6c=_6b.getIdentity(_6a),_6d=this._itemNodeMap[_6c];
if(_6d){
_6d.setLabelNode(this.getLabel(_6a));
_6d._updateItemClasses(_6a);
}
},_onItemChildrenChange:function(_6e,_6f){
var _70=this.model,_71=_70.getIdentity(_6e),_72=this._itemNodeMap[_71];
if(_72){
_72.setChildItems(_6f);
}
},_onItemDelete:function(_73){
var _74=this.model,_75=_74.getIdentity(_73),_76=this._itemNodeMap[_75];
if(_76){
_76.destroyRecursive();
delete this._itemNodeMap[_75];
}
},_saveState:function(){
if(!this.persist){
return;
}
var ary=[];
for(var id in this._openedItemIds){
ary.push(id);
}
dojo.cookie(this.cookieName,ary.join(","));
},destroy:function(){
if(this.rootNode){
this.rootNode.destroyRecursive();
}
if(this.dndController&&!dojo.isString(this.dndController)){
this.dndController.destroy();
}
this.rootNode=null;
this.inherited(arguments);
},destroyRecursive:function(){
this.destroy();
},_createTreeNode:function(_79){
return new dijit._TreeNode(_79);
}});
dojo.declare("dijit.tree.TreeStoreModel",null,{store:null,childrenAttrs:["children"],labelAttr:"",root:null,query:null,constructor:function(_7a){
dojo.mixin(this,_7a);
this.connects=[];
var _7b=this.store;
if(!_7b.getFeatures()["dojo.data.api.Identity"]){
throw new Error("dijit.Tree: store must support dojo.data.Identity");
}
if(_7b.getFeatures()["dojo.data.api.Notification"]){
this.connects=this.connects.concat([dojo.connect(_7b,"onNew",this,"_onNewItem"),dojo.connect(_7b,"onDelete",this,"_onDeleteItem"),dojo.connect(_7b,"onSet",this,"_onSetItem")]);
}
},destroy:function(){
dojo.forEach(this.connects,dojo.disconnect);
},getRoot:function(_7c,_7d){
if(this.root){
_7c(this.root);
}else{
this.store.fetch({query:this.query,onComplete:dojo.hitch(this,function(_7e){
if(_7e.length!=1){
throw new Error(this.declaredClass+": query "+dojo.toJson(this.query)+" returned "+_7e.length+" items, but must return exactly one item");
}
this.root=_7e[0];
_7c(this.root);
}),onError:_7d});
}
},mayHaveChildren:function(_7f){
return dojo.some(this.childrenAttrs,function(_80){
return this.store.hasAttribute(_7f,_80);
},this);
},getChildren:function(_81,_82,_83){
var _84=this.store;
var _85=[];
for(var i=0;i<this.childrenAttrs.length;i++){
var _87=_84.getValues(_81,this.childrenAttrs[i]);
_85=_85.concat(_87);
}
var _88=0;
dojo.forEach(_85,function(_89){
if(!_84.isItemLoaded(_89)){
_88++;
}
});
if(_88==0){
_82(_85);
}else{
var _8a=function _8a(_8b){
if(--_88==0){
_82(_85);
}
};
dojo.forEach(_85,function(_8c){
if(!_84.isItemLoaded(_8c)){
_84.loadItem({item:_8c,onItem:_8a,onError:_83});
}
});
}
},getIdentity:function(_8d){
return this.store.getIdentity(_8d);
},getLabel:function(_8e){
if(this.labelAttr){
return this.store.getValue(_8e,this.labelAttr);
}else{
return this.store.getLabel(_8e);
}
},newItem:function(_8f,_90){
var _91={parent:_90,attribute:this.childrenAttrs[0]};
return this.store.newItem(_8f,_91);
},pasteItem:function(_92,_93,_94,_95){
var _96=this.store,_97=this.childrenAttrs[0];
if(_93){
dojo.forEach(this.childrenAttrs,function(_98){
if(_96.containsValue(_93,_98,_92)){
if(!_95){
var _99=dojo.filter(_96.getValues(_93,_98),function(x){
return x!=_92;
});
_96.setValues(_93,_98,_99);
}
_97=_98;
}
});
}
if(_94){
_96.setValues(_94,_97,_96.getValues(_94,_97).concat(_92));
}
},onChange:function(_9b){
},onChildrenChange:function(_9c,_9d){
},onDelete:function(_9e,_9f){
},_onNewItem:function(_a0,_a1){
if(!_a1){
return;
}
this.getChildren(_a1.item,dojo.hitch(this,function(_a2){
this.onChildrenChange(_a1.item,_a2);
}));
},_onDeleteItem:function(_a3){
this.onDelete(_a3);
},_onSetItem:function(_a4,_a5,_a6,_a7){
if(dojo.indexOf(this.childrenAttrs,_a5)!=-1){
this.getChildren(_a4,dojo.hitch(this,function(_a8){
this.onChildrenChange(_a4,_a8);
}));
}else{
this.onChange(_a4);
}
}});
dojo.declare("dijit.tree.ForestStoreModel",dijit.tree.TreeStoreModel,{rootId:"$root$",rootLabel:"ROOT",query:null,constructor:function(_a9){
this.root={store:this,root:true,id:_a9.rootId,label:_a9.rootLabel,children:_a9.rootChildren};
},mayHaveChildren:function(_aa){
return _aa===this.root||this.inherited(arguments);
},getChildren:function(_ab,_ac,_ad){
if(_ab===this.root){
if(this.root.children){
_ac(this.root.children);
}else{
this.store.fetch({query:this.query,onComplete:dojo.hitch(this,function(_ae){
this.root.children=_ae;
_ac(_ae);
}),onError:_ad});
}
}else{
this.inherited(arguments);
}
},getIdentity:function(_af){
return (_af===this.root)?this.root.id:this.inherited(arguments);
},getLabel:function(_b0){
return (_b0===this.root)?this.root.label:this.inherited(arguments);
},newItem:function(_b1,_b2){
if(_b2===this.root){
this.onNewRootItem(_b1);
return this.store.newItem(_b1);
}else{
return this.inherited(arguments);
}
},onNewRootItem:function(_b3){
},pasteItem:function(_b4,_b5,_b6,_b7){
if(_b5===this.root){
if(!_b7){
this.onLeaveRoot(_b4);
}
}
dijit.tree.TreeStoreModel.prototype.pasteItem.call(this,_b4,_b5===this.root?null:_b5,_b6===this.root?null:_b6);
if(_b6===this.root){
this.onAddToRoot(_b4);
}
},onAddToRoot:function(_b8){

},onLeaveRoot:function(_b9){

},_requeryTop:function(){
var _ba=this.root.children;
this.store.fetch({query:this.query,onComplete:dojo.hitch(this,function(_bb){
this.root.children=_bb;
if(_ba.length!=_bb.length||dojo.some(_ba,function(_bc,idx){
return _bb[idx]!=_bc;
})){
this.onChildrenChange(this.root,_bb);
}
})});
},_onNewItem:function(_be,_bf){
this._requeryTop();
this.inherited(arguments);
},_onDeleteItem:function(_c0){
if(dojo.indexOf(this.root.children,_c0)!=-1){
this._requeryTop();
}
this.inherited(arguments);
}});
}
