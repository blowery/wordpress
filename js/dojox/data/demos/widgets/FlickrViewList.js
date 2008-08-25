/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

	http://dojotoolkit.org/license

*/


if(!dojo._hasResource["dojox.data.demos.widgets.FlickrViewList"]){
dojo._hasResource["dojox.data.demos.widgets.FlickrViewList"]=true;
dojo.provide("dojox.data.demos.widgets.FlickrViewList");
dojo.require("dojox.dtl._Templated");
dojo.require("dijit._Widget");
dojo.declare("dojox.data.demos.widgets.FlickrViewList",[dijit._Widget,dojox.dtl._Templated],{store:null,items:null,templateString:"{% load dojox.dtl.contrib.data %}\n{% bind_data items to store as flickr %}\n<div dojoAttachPoint=\"list\">\n\t{% for item in flickr %}\n\t<div style=\"display: inline-block; align: top;\">\n\t\t<h5>{{ item.title }}</h5>\n\t\t<a href=\"{{ item.link }}\" style=\"border: none;\">\n\t\t\t<img src=\"{{ item.imageUrlMedium }}\">\n\t\t</a>\n\t\t<p>{{ item.author }}</p>\n\n\t\t<!--\n\t\t<img src=\"{{ item.imageUrl }}\">\n\t\t<p>{{ item.imageUrl }}</p>\n\t\t<img src=\"{{ item.imageUrlSmall }}\">\n\t\t-->\n\t</div>\n\t{% endfor %}\n</div>\n\n",fetch:function(_1){
_1.onComplete=dojo.hitch(this,"onComplete");
_1.onError=dojo.hitch(this,"onError");
return this.store.fetch(_1);
},onError:function(){

this.items=[];
this.render();
},onComplete:function(_2,_3){
this.items=_2||[];
this.render();
}});
}
