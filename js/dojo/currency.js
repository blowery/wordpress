/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojo.currency"]){
dojo._hasResource["dojo.currency"]=true;
dojo.provide("dojo.currency");
dojo.require("dojo.number");
dojo.require("dojo.i18n");
dojo.requireLocalization("dojo.cldr","currency",null,"en-us,es,en,ja,ROOT,zh,ko,en-au,de,zh-tw,pt,fr,en-ca,it");
dojo.require("dojo.cldr.monetary");
dojo.currency._mixInDefaults=function(_1){
_1=_1||{};
_1.type="currency";
var _2=dojo.i18n.getLocalization("dojo.cldr","currency",_1.locale)||{};
var _3=_1.currency;
var _4=dojo.cldr.monetary.getData(_3);
dojo.forEach(["displayName","symbol","group","decimal"],function(_5){
_4[_5]=_2[_3+"_"+_5];
});
_4.fractional=[true,false];
return dojo.mixin(_4,_1);
};
dojo.currency.format=function(_6,_7){
return dojo.number.format(_6,dojo.currency._mixInDefaults(_7));
};
dojo.currency.regexp=function(_8){
return dojo.number.regexp(dojo.currency._mixInDefaults(_8));
};
dojo.currency.parse=function(_9,_a){
return dojo.number.parse(_9,dojo.currency._mixInDefaults(_a));
};
}
