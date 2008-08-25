/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.data.demos.widgets.PicasaView"]){
dojo._hasResource["dojox.data.demos.widgets.PicasaView"]=true;
dojo.provide("dojox.data.demos.widgets.PicasaView");
dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.declare("dojox.data.demos.widgets.PicasaView",[dijit._Widget,dijit._Templated],{templateString:"<table class=\"picasaView\">\n\t<tbody>\n\t\t<tr class=\"picasaTitle\">\n\t\t\t<td>\n\t\t\t\t<b>\n\t\t\t\t\tTitle:\n\t\t\t\t</b>\n\t\t\t</td>\n\t\t\t<td dojoAttachPoint=\"titleNode\">\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>\n\t\t\t\t<b>\n\t\t\t\t\tAuthor:\n\t\t\t\t</b>\n\t\t\t</td>\n\t\t\t<td dojoAttachPoint=\"authorNode\">\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td colspan=\"2\">\n\t\t\t\t<b>\n\t\t\t\t\tSummary:\n\t\t\t\t</b>\n\t\t\t\t<span class=\"picasaSummary\" dojoAttachPoint=\"descriptionNode\"></span>\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td dojoAttachPoint=\"imageNode\" colspan=\"2\">\n\t\t\t</td>\n\t\t</tr>\n\t</tbody>\n</table>\n\n",titleNode:null,descriptionNode:null,imageNode:null,authorNode:null,title:"",author:"",imageUrl:"",iconUrl:"",postCreate:function(){
this.titleNode.appendChild(document.createTextNode(this.title));
this.authorNode.appendChild(document.createTextNode(this.author));
this.descriptionNode.appendChild(document.createTextNode(this.description));
var _1=document.createElement("a");
_1.setAttribute("href",this.imageUrl);
_1.setAttribute("target","_blank");
var _2=document.createElement("img");
_2.setAttribute("src",this.iconUrl);
_1.appendChild(_2);
this.imageNode.appendChild(_1);
}});
}
