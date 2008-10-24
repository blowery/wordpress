(function($){

adminMenu = {
		
	init : function() {
		$('#adminmenu a').attr('tabindex', '10');
		$('#adminmenu div.wp-menu-toggle').click( function() { return adminMenu.toggle( $(this).siblings('ul') ); } );
		$('#adminmenu li.wp-has-submenu img.wp-menu-image').dblclick( function() { adminMenu.fold(); } );

		$('.wp-menu-separator').click(function(){
			if ( $('#adminmenu').hasClass('folded') ) {
				adminMenu.fold(1);
				setUserSetting( 'mfold', 'o' );
			} else {
				adminMenu.fold();
				setUserSetting( 'mfold', 'f' );
			}
		});

		if ( 'o' == getUserSetting( 'mfold' ) ) {
			$('#adminmenu li.wp-has-submenu').each(function(i, e) {
				var v = getUserSetting( 'm'+i );
				if ( $(e).hasClass('wp-has-current-submenu') ) return true; // leave the current parent open
	
				if ( 'o' == v ) $(e).addClass('wp-menu-open');
				else if ( 'c' == v ) $(e).removeClass('wp-menu-open');	
			});
		} else {
			this.fold();
		}
	},

	toggle : function(ul, effect) {
		if ( !effect )
			effect = 'slideToggle';

		ul[effect](150).parent().toggleClass( 'wp-menu-open' );

		$('#adminmenu li.wp-has-submenu').each(function(i, e) {
			var v = $(e).hasClass('wp-menu-open') ? 'o' : 'c';
			setUserSetting( 'm'+i, v );
		});

		return false;
	},
	
	fold : function(off) {
		if (off) {
			if ( $.browser.msie && $.browser.version.charAt(0) == 6 )
				$('#wpbody-content').css('marginLeft', '180px');
			$('#adminmenu').removeClass('folded');
			$('#adminmenu li.wp-submenu-head').hide();
			$('#adminmenu a.wp-has-submenu, #adminmenu div.wp-menu-toggle').show();
			$('#adminmenu li.wp-has-submenu').unbind().css('width', '');
			$('#adminmenu li.wp-has-submenu img.wp-menu-image').unbind().dblclick( function() { adminMenu.fold(); } );
		} else {
			$('#adminmenu').addClass('folded');
			$('#adminmenu a.wp-has-submenu, #adminmenu .wp-submenu, #adminmenu div.wp-menu-toggle').hide();
			$('#adminmenu li.wp-submenu-head').show();
			$('#adminmenu li.wp-has-submenu img.wp-menu-image').unbind().dblclick( function() { window.location = $(this).siblings('a.wp-has-submenu')[0].href; } );
			if ( $.browser.msie && $.browser.version.charAt(0) == 6 )
				$('#wpbody-content').css('marginLeft', '60px');
			$('#adminmenu li.wp-has-submenu').css({'width':'28px'}).hoverIntent({
				over: function(){ $(this).find('.wp-submenu').show(); },
				out: function(){ $(this).find('.wp-submenu').hide(); },
				timeout: 220,
				sensitivity: 8,
				interval: 100
			});
		}
	}
};

$(document).ready(function(){
	adminMenu.init();

	$('#favorite-inside').width($('#favorite-actions').width()-4);
	$('#favorite-toggle, #favorite-inside').bind( 'mouseenter', function(){$('#favorite-inside').removeClass('slideUp').addClass('slideDown'); setTimeout(function(){if ( $('#favorite-inside').hasClass('slideDown') ) { $('#favorite-inside').slideDown(100); $('#favorite-first').addClass('slide-down'); }}, 200) } );

	$('#favorite-toggle, #favorite-inside').bind( 'mouseleave', function(){$('#favorite-inside').removeClass('slideDown').addClass('slideUp'); setTimeout(function(){if ( $('#favorite-inside').hasClass('slideUp') ) { $('#favorite-inside').slideUp(100, function(){ $('#favorite-first').removeClass('slide-down'); } ); }}, 300) } );
});
})(jQuery);
