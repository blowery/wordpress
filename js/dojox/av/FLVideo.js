/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.av.FLVideo"]){
dojo._hasResource["dojox.av.FLVideo"]=true;
dojo.provide("dojox.av.FLVideo");
dojo.experimental("dojox.av.FLVideo");
dojo.require("dijit._Widget");
dojo.require("dojox.embed.Flash");
dojo.declare("dojox.av.FLVideo",[dijit._Widget],{videoUrl:"",initialVolume:1,autoPlay:false,id:"",isDebug:false,domNode:null,_flashObject:null,_flashMovie:null,_swfPath:dojo.moduleUrl("dojox.av","resources/video.swf"),postMixInProperties:function(){

this._subs=[];
this._cons=[];
this.videoUrl=this._normalizeUrl(this.videoUrl);
this.initialVolume=this._normalizeVolume(this.initialVolume);
},postCreate:function(){
var _1={path:this._swfPath.uri,width:"100%",height:"100%",params:{allowFullScreen:true},vars:{videoUrl:this.videoUrl,id:this.id,autoPlay:this.autoPlay,volume:this.initialVolume,isDebug:this.isDebug}};
this._sub("stageClick","onClick");
this._sub("stageSized","onSwfSized");
this._sub("mediaStatus","onStatus");
this._sub("mediaMeta","onMetaData");
this._sub("mediaError","onVideoError");
this._sub("mediaStart","onVideoStart");
this._sub("mediaEnd","onVideoEnd");
this._flashObject=new dojox.embed.Flash(_1,this.domNode);
this._flashObject.onLoad=dojo.hitch(this,"onLoad");
},togglePause:function(){

this._flashMovie.togglePause();
},play:function(_2){
this._flashMovie.play(this._normalizeUrl(_2));
},pause:function(){
this._flashMovie.pause();
},seek:function(_3){

this._flashMovie.seek(_3);
},setVolume:function(_4){
this._flashMovie.setVolume(this._normalizeVolume(_4));
},getTime:function(){
return this._flashMovie.getTime();
},getLoaded:function(){
return this._flashMovie.getLoaded();
},getVolume:function(){
return this._flashMovie.getVolume();
},onLoad:function(_5){
this._flashMovie=_5;
},onClick:function(_6){

},onSwfSized:function(_7){
},onStatus:function(_8,_9){
},onMetaData:function(_a,_b){
console.warn("META:",_a,_b);
},onVideoStart:function(_c){
console.warn("onVideoStart:",_c);
},onVideoEnd:function(_d){
console.warn("onVideoEnd:",_d);
},onVideoError:function(_e,_f){
console.warn("ERROR-"+_e.type.toUpperCase()+":",_e.info.code," - URL:",_f);
},_normalizeUrl:function(_10){
if(_10&&_10.toLowerCase().indexOf("http")<0){
var loc=window.location.href.split("/");
loc.pop();
loc=loc.join("/")+"/";
_10=loc+_10;
}
return _10;
},_normalizeVolume:function(vol){
if(vol>1){
while(vol>1){
vol*=0.1;
}
}
return vol;
},_sub:function(_13,_14){
dojo.subscribe(this.id+"/"+_13,this,_14);
},destroy:function(){
if(!this._flashMovie){
this._cons.push(dojo.connect(this,"onLoad",this,"destroy"));
return;
}
dojo.forEach(this._subs,function(s){
dojo.unsubscribe(s);
});
dojo.forEach(this._cons,function(c){
dojo.disconnect(c);
});
this._flashObject.destroy();
}});
}
