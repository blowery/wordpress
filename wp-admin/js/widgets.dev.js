
var wpWidgets;
(function($) {

wpWidgets = {
	init : function() {
        var rem;
		$('h3.sidebar-name').click(function(){
            var c = $(this).siblings('.widgets-sortables');
			if ( c.is(':visible') ) {
				c.hide().sortable('disable');
			} else {
				c.show().sortable('enable').sortable('refresh');
			}
			$(this).siblings('#widget-list').toggle();
        });
        this.addEvents();

        $('#widget-list .widget').draggable({
			connectToSortable: '.widgets-sortables',
			handle: '.widget-title',
			distance: 2,
			helper: 'clone',
			zIndex: 5,
			start: function() {
				wpWidgets.fixWebkit(1);
			},
			stop: function(e,ui) {
				if ( rem )
					$(rem).hide();
				rem = '';
				wpWidgets.fixWebkit();
			}
		});

        $('.widgets-sortables').sortable({
			placeholder: 'widget-placeholder',
			connectWith: '.widgets-sortables',
			items: '.widget',
			handle: '.widget-title',
			cursor: 'move',
			distance: 2,
			opacity: 0.65,
			start: function(e,ui) {
				wpWidgets.fixWebkit(1);
				ui.item.find('.widget-inside').hide();
				ui.item.css({'marginLeft':'','width':''});
			},
			stop: function(e,ui) {
				var add = ui.item.find('input.add_new').val(), n = ui.item.find('input.multi_number').val(), id = ui.item.attr('id'), sb = $(this).parent().attr('id');
				ui.item.css({'marginLeft':'','width':''});

				if ( add ) {
					if ( 'multi' == add ) {
						ui.item.html( ui.item.html().replace(/<[^<>]+>/g, function(m){ return m.replace(/__i__/g, n); }) );
						ui.item.attr( 'id', id.replace(/__i__/g, n) );
						n++;
						$('li#' + id).find('input.multi_number').val(n);
					} else if ( 'single' == add ) {
						ui.item.attr( 'id', 'new-' + id );
						rem = 'li#' + id;
					}
					wpWidgets.addEvents(ui.item);
					wpWidgets.save( ui.item.find('form').serializeArray(), sb, 0, 0 );
					ui.item.find('input.add_new').val('');
					ui.item.find('a.widget-action').click();
				}
				wpWidgets.saveOrder(sb);
				wpWidgets.fixWebkit();
			},
			receive: function(e,ui) {
				if ( !$(this).is(':visible') )
					$(this).sortable('cancel');
			}

		}).not(':visible').sortable('disable');
	},

	saveOrder : function(sb) {
		$('#' + sb + ' .ajax-feedback').css('visibility', 'visible');

		var a = {
			action: 'widgets-order',
			savewidgets: $('#_wpnonce_widgets').val(),
			sidebars: []
		};

		$('.widgets-sortables').each( function() {
			a['sidebars[' + $(this).parent().attr('id') + ']'] = $(this).sortable('toArray').join(',');
		});

		$.post( ajaxurl, a, function() {
			$('.ajax-feedback').css('visibility', 'hidden');
		});
	},

	save : function(data, sb, del, t) {
		$('#' + sb + ' .ajax-feedback').css('visibility', 'visible');

		var a = {
			action: 'save-widget',
			savewidgets: $('#_wpnonce_widgets').val(),
			sidebar: sb
		};

		if ( del )
			a['delete_widget'] = 1;

		$.map(data, function(n,i){ a[n.name] = n.value; });

		$.post( ajaxurl, a, function(r){
			var id;
			$('.ajax-feedback').css('visibility', 'hidden');
			if ( !t )
				return;

			if ( del ) {
				$(t).parents('li.widget').slideUp('normal', function(){ $(this).remove(); });
				if ( !a.widget_number ) {
					id = a['widget-id'];
					$('#available-widgets .widget-id').each(function(){
						if ( $(this).val() == id )
							$(this).parents('li.widget').show();
					});
				}
			} else {
				$(t).parents('.widget-inside').slideUp('normal', function(){ $(this).parents('li.widget').css({'width':'','marginLeft':''}); });
			}
		});
	},

    fixWebkit : function(n) {
        n = n ? 'none' : '';
        $('body').css({
			WebkitUserSelect: n,
			KhtmlUserSelect: n
		});
    },

    addEvents : function(sc) {
		sc = sc || document;
		$('a.widget-action', sc).click(function(){
            var w = parseInt( $(this).parents('.widget').find('.widget-width').val(), 10 ), css = {}, inside = $(this).parents('.widget-top').siblings('.widget-inside');
			if ( inside.is(':hidden') ) {
				if ( w > 270 && inside.parents('.widgets-sortables').length ) {
					css['width'] = w + 30 + 'px';
					if ( inside.parents('.widget-liquid-right').length )
						css['marginLeft'] = 270 - w + 'px';
					inside.parents('.widget').css(css);
				}
				inside.slideDown('normal');
			} else {
				inside.slideUp('normal', function(){ inside.parents('.widget').css({'width':'','marginLeft':''}); });
			}
            return false;
        });
        $('.widget-control-save', sc).click(function(){
			wpWidgets.save( $(this).parents('form').serializeArray(), $(this).parents('.widgets-holder-wrap').attr('id'), 0, this );
			return false;
		});
		$('.widget-control-remove', sc).click(function(){
			wpWidgets.save( $(this).parents('form').serializeArray(), $(this).parents('.widgets-holder-wrap').attr('id'), 1, this );
			return false;
		});
	}

};
$(document).ready(function(){wpWidgets.init();});

})(jQuery);
