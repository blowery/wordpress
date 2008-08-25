/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.rpc.OfflineRest"]){
dojo._hasResource["dojox.rpc.OfflineRest"]=true;
dojo.provide("dojox.rpc.OfflineRest");
dojo.require("dojox.off.offline");
dojo.require("dojox.rpc.LocalStorageRest");
dojox.rpc.OfflineRest=dojo.mixin({initialize:function(_1){
dojox.off.ui.appName=_1;
dojox.off.files.slurp();
dojox.off.initialize();
var _2=dojox.rpc.LocalStorageRest;
dojo.connect(dojox.off.sync,"onSync",this,function(_3){
if(_3=="upload"){
_2.sendChanges();
}
if(_3=="download"){
_2.downloadChanges();
dojox.off.sync.finishedDownloading();
}
});
}},dojox.rpc.LocalStorageRest);
}
