/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.charting.scaler.primitive"]){
dojo._hasResource["dojox.charting.scaler.primitive"]=true;
dojo.provide("dojox.charting.scaler.primitive");
dojox.charting.scaler.primitive={buildScaler:function(_1,_2,_3,_4){
return {bounds:{lower:_1,upper:_2,from:_1,to:_2,scale:_3/(_2-_1),span:_3},scaler:dojox.charting.scaler.primitive};
},buildTicks:function(_5,_6){
return {major:[],minor:[],micro:[]};
},getTransformerFromModel:function(_7){
var _8=_7.bounds.from,_9=_7.bounds.scale;
return function(x){
return (x-_8)*_9;
};
},getTransformerFromPlot:function(_b){
var _c=_b.bounds.from,_d=_b.bounds.scale;
return function(x){
return x/_d+_c;
};
}};
}
