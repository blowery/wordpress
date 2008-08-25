/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.xml.Script"]){
dojo._hasResource["dojox.xml.Script"]=true;
dojo.provide("dojox.xml.Script");
dojo.require("dojo.parser");
dojo.require("dojox.xml.widgetParser");
dojo.declare("dojox.xml.Script",null,{constructor:function(_1,_2){
dojo.parser.instantiate(dojox.xml.widgetParser._processScript(_2));
}});
}
