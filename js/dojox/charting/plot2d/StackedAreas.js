/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.charting.plot2d.StackedAreas"]){
dojo._hasResource["dojox.charting.plot2d.StackedAreas"]=true;
dojo.provide("dojox.charting.plot2d.StackedAreas");
dojo.require("dojox.charting.plot2d.Stacked");
dojo.declare("dojox.charting.plot2d.StackedAreas",dojox.charting.plot2d.Stacked,{constructor:function(){
this.opt.lines=true;
this.opt.areas=true;
}});
}
