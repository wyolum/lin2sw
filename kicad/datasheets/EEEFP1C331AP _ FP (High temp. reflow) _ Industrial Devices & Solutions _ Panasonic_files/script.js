











/**
 * @file
 * A JavaScript file for the theme.
 *
 * In order for this JavaScript to be loaded on pages, see the instructions in
 * the README.txt next to this file.
 */

// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - https://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
(function ($, Drupal, window, document, undefined) {


// To understand behaviors, see https://drupal.org/node/756722
$(document).ready( function() {

    // Initiate the shrinking breadcrumbs - if needed
    // $('nav.breadcrumb').jBreadCrumb({
    //     easing:'swing',
    //     previewWidth: 10,
    // });

    // If this is a category page node, and it has an alternative url, then open that alternative url in a new tab
    categoryPageAlternativeUrlCheck();

  $('#header-center-inner-about-products').click( function() {
    var link = $(this).children('a');
    var href = link.attr('href');
    window.open(href, '_blank');
    return false;
  });

	//IE8 fixes
	if( $('html').hasClass( 'lt-ie9' ) ) {

        // Load the ie8 media queries stylesheet
        if (window.screen.availWidth < 1200) {
            $('head').append('<link rel="stylesheet" href="'+Drupal.settings.basePath+'sites/all/themes/industrials/css/ie8-media-query.css" type="text/css">');
        }

        // Add even and odd rows to any field-body-tables
        if ($('.field-name-body table').length > 0) {
            $('.field-name-body table tr:odd').addClass('odd');
            $('.field-name-body table tr:even').addClass('even');
        }

        // Fallback for the HTML5 placeholder element and media queries
		$('[placeholder]').focus(function() {
			var input = $(this);
			if (input.val() == input.attr('placeholder')) {
				input.val('');
				input.removeClass('placeholder');
			}
		}).blur(function() {
			var input = $(this);
			if (input.val() == '' || input.val() == input.attr('placeholder')) {
				input.addClass('placeholder');
				input.val(input.attr('placeholder'));
			}
		}).blur().parents('form').submit(function() {
			$(this).find('[placeholder]').each(function() {
				var input = $(this);
				if (input.val() == input.attr('placeholder')) {
				  input.val('');
				}
			})
		});

		// Hide images in ecatalog tables until they are sized properly (in window.load)
		// 20141202 ISC-J IEで画像が表示されない不具合が出るためコメントアウト start
//		$(".ecatalog-table .image-col img").hide();
		// 20141202 ISC-J IEで画像が表示されない不具合が出るためコメントアウト end
	}

    // Init things
    var views_to_initiate = ['view-id-distributors'];
    viewInitiation(views_to_initiate);

    // Add slide action for category box collections
    $('.slide-down-link-list label').each( function() {
        $(this).click( function() {
            var id = $(this).attr('rel');
            if( $('.slide-down-link-list ul#line-up-'+id+' li').length > 0 ) {
                $('.slide-down-link-list ul#line-up-'+id).slideToggle();
                $(this).parent().toggleClass('closed').toggleClass('open');
            }

        });
    });

    initiate_jcarousels();

    // Initiate the print page button
    $('.print-link').click(function() {
        window.print();
        return false;
    });

	// Initiate the solutions page blobs
	initiateSolutionsPage();

    // Initiate any ajax reset buttons
    if ($('.views-ajax-reset').length > 0) {
        $('.views-ajax-reset').click(function() {

            // Get the parent form and clear it
            var $form = $(this).parents('form');
            $form.clearForm();

            // Simulate a click on the submit button
            $form.find('.views-submit-button input.form-submit').trigger('click');

            return false;
        });
    }

    // Truncate long text in table cells on line-up pages
    if ($(".series-list").length > 0) {
        $(".series-list tbody tr:not(.filter) td").truncatr();
    }

    // Set up the Simple Hierarchical Select boxes
    initShs();

// 20141008 ISC-J Yearのセレクトボックスもカスタムセレクトにする START
    if ($('#edit-year-value-year')[0]) {
      $("#edit-year-value-year").customSelect();
      $(".date-year").css("width", "100px");
    }
// 20141008 ISC-J Yearのセレクトボックスもカスタムセレクトにする END
// 20141104 FAQのセレクトボックスもカスタムセレクトにする START
    if ($('#edit-product-list')[0]) {
      $('#edit-product-list').customSelect();
    }
    if ($('#edit-category-list')[0]) {
      $('#edit-category-list').customSelect();
    }
// 20141104 FAQのセレクトボックスもカスタムセレクトにする START

    // Fix column collections for IE8 because Selectivizr doesn't feel like it.
    $(".column-collection.three-column").find("li:nth-child(3n+1)").css("clear", "left");

    // Override the views reset button
    // Re-apply after any AJAX event
    overrideViewsResetButton();
    $(document).ajaxComplete(overrideViewsResetButton);


    // Apply customSelect to the RoHS/REACH downloads "view"
    $("#block-ecatalog-ecatalog-downloads-list .view-filters .form-select").customSelect();

    var browsebartop,bookmarkbartop;
    var browsebarwidth = 0;
    var browsebartop = 0;
    var windowpercentage = 1;
    var windowObj;
	var barSetting = function(){
		browsebartop = ($('.header-center-scroll').length && !$('.header-center-scroll').hasClass('nofix'))? $('.header-center-scroll').offset().top : 0;
		browsebarHeight = ($('.header-center-scroll').length && !$('.header-center-scroll').hasClass('nofix'))? $('.header-center-scroll').height() : 0;
		bookmarkbarop = $('.bookmark-bar-menu').length ? $('.bookmark-bar-menu').offset().top : 0;
		browsebarwidth = $('.header-center').length ? $('.header-center').width() : 0;
		headerTopDefaultHeight = $('.header-top').length ? $('.header-top').height() : 0;

		if(!jQuery.support.opacity){
			windowObj = $('html');
	    }
		else{
			windowObj = $(window);
		}
	}
	barSetting();

	var navWrapper = 0;

	// browsebar
	if(!$('.header-center-scroll').hasClass('nofix')){
		$(window).on('scroll resize',function(e) {

			adminbarMenuHeight = $("#admin-menu").outerHeight() == null ? 0 : $("#admin-menu").outerHeight();
			navWrapper = $('.header-mega-nav-wrapper').height();

			scrollTop = 0;
			scrollTop = windowObj.scrollTop();

			headerTopHeight = $('.header-top').length ? $('.header-top').height() : 0;

			$('.header-center-scroll').each(function(index, element) {
				if(scrollTop >= browsebartop + (headerTopHeight - headerTopDefaultHeight) - adminbarMenuHeight){
					if (adminbarMenuHeight > 0) {
						$(this).addClass('fixed');
					}
					else{
						$(this).addClass('fix');
					}
				}else{
					$(this).removeClass('fix');
					$(this).removeClass('fixed');
				}
				browsebarwidth = $('.header-center').width();
				$(this).css('width', browsebarwidth);
			});



//			if($('html').scrollTop() >= browsebartop + navWrapper - adminbarMenuHeight){
//				if (adminbarMenuHeight > 0) {
//					$('.header-bottom-test').addClass('fixed');
//				}
//				else{
//					$('.header-bottom-test').addClass('fix');
//				}
//			}else {
//				$('.header-bottom-test').removeClass('fix');
//				$('.header-bottom-test').removeClass('fixed');
//			}
//
//			if ($('html').scrollTop() >= bookmarkbarop + navWrapper - browsebarHeight - adminbarMenuHeight) {
//				$('.bookmark-bar-menu').addClass('fixed');
//			}
//			else{
//				$('.bookmark-bar-menu').removeClass('fixed');
//			}
			//addthis_config.ui_offset_top= $(window).scrollTop();
		});
	}

	$('.header-mega-nav .level-2-wrapper').hide();

// 20150216 ISC-J QRコード押下時にリンク先に遷移しないように修正 START
  if ($('.wechatbarcode')[0]) {
    $('.wechatbarcode').click( function() {
      return false;
    });
  }
// 20150216 ISC-J QRコード押下時にリンク先に遷移しないように修正 END


}); // End document.ready

$(window).load(function(){

    // Initiate the mega nav
    megaNavInitiation();

    // Add a 'lightbox' for large images in line-up tables
    initLineUpImageLightboxes();

    // 20141022 location changed
    // 20141015 AutoHeight Settings
    $('.product-list-region-top-field .d-dropdown-title').autoHeight({});//region top - products > title
    $('.product-list-region-top-field .d-link-title').autoHeight({});//region top - application > title
    $('.d-group-list-block').autoHeight_list({column:4, clear:1});//products > list
    $('.four-column .d-group-list-block .d-group-list-title').autoHeight({});//LP1 > title
    $('.three-column .d-group-list-block .d-group-list-title').autoHeight({});//LP2-2 > title
    $('.three-column .d-group-list').autoHeight({column:3, clear:1});//PL2-2 >list
    $('.d-link-container .views-field-field-title-for-menu').autoHeight({});//application > text link
    $('.d-link-container .views-field-field-description-for-menu').autoHeight({});//application > text link
    $('.d-link-container .views-field-field-link-for-description').autoHeight({});//application > text link
    $('.view-content .views-field-field-description-for-menu').autoHeight({});//design-support > text link
    $('.view-content .views-field-field-link-for-description').autoHeight({});//design-support > text link
    $('.field-name-field-data-sheet-category>.field-items>.field-item').autoHeight({column:3, clear:1});//product-safety-data-sheet
    $('.views-field-field-about-panasonic-1 h2').autoHeight({column:4, clear:1});//about panasonic
    if($('.autoheight-col3')[0]){
        $('.autoheight-col3').autoHeight_colClass({column:3, clear:1});//col3
    }
    if($('.autoheight-col4')[0]){
        $('.autoheight-col4').autoHeight_colClass({column:4, clear:1});//col4
    }
    $('a[href="#qt-category_page_tab-ui-tabs2"]').click(function(){
	setTimeout(function(){
		$('.three-column .d-group-list-block .d-group-list-title').autoHeight({});
		$('.three-column .d-group-list').autoHeight({column:3, clear:1});
    	},100);
    });

    // --end


    // Hacks for IE8
    if ($("html").hasClass("lt-ie9")) {

        // Make images in tables have correct height in IE8
		// 20141202 ISC-J IEで画像が表示されない不具合が出るためコメントアウト start
//      $(".ecatalog-table .image-col img").each(function(){
//
//        // Can't just use naturalWidth and naturalHeight in IE8
//        // Create a new img element and measure that
//        var img = new Image();
//        img.src = this.src;
//
//        // Determine natural aspect ratio of the image
//        var aspectRatio = img.height / img.width;
//
//        // Display the image, then modify the image height based on the display width and aspect ratio
//        $(this).show().height($(this).width() * aspectRatio);
//      });
		// 20141202 ISC-J IEで画像が表示されない不具合が出るためコメントアウト end
    }

    // 20140224 Ajax動作時にもautoheightが適用されるように修正 start
    // Ajax処理成功時
    var success = Drupal.ajax.prototype.success;
    Drupal.ajax.prototype.success = function(xmlhttprequest, options) {
      success.call(this, xmlhttprequest, options);

      // 20141022 location changed
      // 20141015 AutoHeight Settings
      $('.product-list-region-top-field .d-dropdown-title').autoHeight({});//region top - products > title
      $('.product-list-region-top-field .d-link-title').autoHeight({});//region top - application > title
      $('.d-group-list-block').autoHeight_list({column:4, clear:1});//products > list
      $('.four-column .d-group-list-block .d-group-list-title').autoHeight({});//LP1 > title
      $('.three-column .d-group-list-block .d-group-list-title').autoHeight({});//LP2-2 > title
      $('.three-column .d-group-list').autoHeight({column:3, clear:1});//PL2-2 >list
      $('.d-link-container .views-field-field-title-for-menu').autoHeight({});//application > text link
      $('.d-link-container .views-field-field-description-for-menu').autoHeight({});//application > text link
      $('.d-link-container .views-field-field-link-for-description').autoHeight({});//application > text link
      $('.view-content .views-field-field-description-for-menu').autoHeight({});//design-support > text link
      $('.view-content .views-field-field-link-for-description').autoHeight({});//design-support > text link
      $('.field-name-field-data-sheet-category>.field-items>.field-item').autoHeight({column:3, clear:1});//product-safety-data-sheet
      $('.views-field-field-about-panasonic-1 h2').autoHeight({column:4, clear:1});//about panasonic
      if($('.autoheight-col3')[0]){
          $('.autoheight-col3').autoHeight_colClass({column:3, clear:1});//col3
      }
      if($('.autoheight-col4')[0]){
          $('.autoheight-col4').autoHeight_colClass({column:4, clear:1});//col4
      }
      $('a[href="#qt-category_page_tab-ui-tabs2"]').click(function(){
    setTimeout(function(){
      $('.three-column .d-group-list-block .d-group-list-title').autoHeight({});
      $('.three-column .d-group-list').autoHeight({column:3, clear:1});
        },100);
      });

      // --end
    };
    // 20140224 Ajax動作時にもautoheightが適用されるように修正 end
});


function categoryPageAlternativeUrlCheck()
{
    // This functionality depends entirely on the users browser settings.
    if ($('article.node').hasClass('node-category-page')) {
        if ($('article.node div.alternative-url').length > 0) {
            window.open($('article.node div.alternative-url').text(), '_blank');
        }
    }
}

// ドロップダウンメニュー描画処理を排他制御するためのフラグ
var dropDownIsProcessing = false;

/**
 * Function to initiate the mega nav drop down
 * メガドロップダウンの処理を定義する
 */
function megaNavInitiation() {
  var originalWrapperHeight;
  var $activeMenu;
  var $wrapper = $('.header-mega-nav-wrapper');
  var $currentWrapper;
  var search_margin = $('.header-mega-nav .search-form').outerWidth() - 50;

  /*******************************************************
   **** Generic mega drop down functionality
   *******************************************************/

  // dropdownのリンクをクリックした場合の処理(ドロップダウンメニューを開く)
  $('li.dropdown a').click( function() {
    // 処理中はなにもせず戻る
    if (dropDownIsProcessing) {
      return false;
    }
    // 処理中であることをフラグに保持する
    dropDownIsProcessing = true;

    var dropdownClass = $(this).parent().attr('rel');
    $activeMenu = $('#' + dropdownClass + '-mega-nav');
    $currentWrapper = $('#header-' + dropdownClass + '-drop-down');

    // 子の要素がない場合はそのまま遷移する
    var childaElementLength = $('#header-' + dropdownClass + '-drop-down .header-mega-nav .menu-container ul').children('li').length;
    if (childaElementLength > 0) {
      // Work out whether to show a menu and which ones to open/close
      if ($currentWrapper.hasClass('closed') || $activeMenu.hasClass('active') === false) {

        // Hide all currently active mega navs - this hides any active menus that were open
        $('.header-mega-nav').removeClass('active');
        $('.header-mega-nav').hide();

        // Show the mega dropdown relating to the link we've just clicked
        $activeMenu.show();
        $activeMenu.addClass('active');

        // Set the header wrapper height to be the height of the active mega nav we want to show
        $currentWrapper.animate(
          {height: $activeMenu.height()},
          400,
          function(){
            // On completion of the initial animation, store the originalWraperHeight for use later
            originalWrapperHeight = $currentWrapper.height();
            // 処理終了時にフラグを初期化する
            dropDownIsProcessing = false;
          }
        );

        // 全てのドロップダウンメニューを一度閉じる
        $wrapper.css("height", "0px");
        $wrapper.addClass('closed');
        $wrapper.removeClass('open');

        // クリックされたドロップダウンメニューのみ開く
        $currentWrapper.addClass('open');
        $currentWrapper.removeClass('closed');

        // Don't return false so the link isn't actioned
        return false;
      }
      else {
        // If this doesn't have a dropdown that it can find, then just go to the link.
        // Also, if the $activeMenu is already open, then we can go to the link too.
        return true;
      }
    }
    else {
      return true;
    }
  });

  /*******************************************************
   **** Product drop down events - LEVEL 1 (OPENS LEVEL 2)
   *******************************************************/

  // Onclick event for sub menu level 1 items
  $('.product-mega-nav .level-1 li a').click( function() {
    // If this link is already open, then activate the link
    if ($(this).hasClass('open')) {
      return true;
    }

    // Get the mlid of the item we just clicked
    var id = $(this).attr('rel');

    // Get the (soon to be) active level 2 menu ul
    var $activeLevel2 = $('.product-mega-nav .level-2-wrapper ul#level-2-' + id);

    // Make sure all the level-1 items are closed and the level-2 items are hidden
    $activeMenu.find('.level-1 li a.open').removeClass('open');
    $activeMenu.find('.level-1').removeClass('open');
    $activeMenu.find('.level-2-wrapper ul').hide();

    // If the $activeLevel2 exists and contains elements, then we can open it
    if ($activeLevel2.children('li').length > 0) {
//      // Get the search block out of the way by sliding the mega nav left and add a closed class to the search block
//      $activeMenu.children('.menu-container').animate(
//        {'margin-left': '-'+search_margin+'px'}
//      ).find('.search-form').addClass('closed');

      // Show the level-2-wrapper
      $activeMenu.find('.level-2-wrapper').show();

      // Mark the level-1 item as open
      $(this).addClass('open');
      $(this).parents('.level-1').addClass( 'open' );

      // Show the correct level-2 item corresponding to the mlid we've just clicked
      $activeLevel2.show().addClass('open');

      // Autoheight the $wrapper
      autoHeightWrapper($currentWrapper);

      // Return false, so we don't activate the link
      return false;
    }
    else {
      // Make sure we hide the level-2 wrapper
      $activeMenu.find('.level-2-wrapper').hide();

      // Activate the link
      return true;
    }
  });

  /*******************************************************
   **** Contact drop down events - LEVEL 1 (OPENS LEVEL 2)
   *******************************************************/

  // Onclick event for sub menu level 1 items
  $('.contact-mega-nav .level-1 li a').click( function() {
    // If this link is already open, then activate the link
    if ($(this).hasClass('open')) {
      return true;
    }

    // Get the mlid of the item we just clicked
    var id = $(this).attr('rel');

    // Get the (soon to be) active level 2 menu ul
    var $activeLevel2 = $('.contact-mega-nav .level-2-wrapper ul#level-2-' + id);

    // Make sure all the level-1 items are closed and the level-2 items are hidden
    $activeMenu.find('.level-1 li a.open').removeClass('open');
    $activeMenu.find('.level-1').removeClass('open');
    $activeMenu.find('.level-2-wrapper ul').hide();

    // If the $activeLevel2 exists and contains elements, then we can open it
    if ($activeLevel2.children('li').length > 0) {
      // Show the level-2-wrapper
      $activeMenu.find('.level-2-wrapper').show();

      // Mark the level-1 item as open
      $(this).addClass('open');
      $(this).parents('.level-1').addClass( 'open' );

      // Show the correct level-2 item corresponding to the mlid we've just clicked
      $activeLevel2.show().addClass('open');

      // Autoheight the $wrapper
      autoHeightWrapper($currentWrapper);

      // Return false, so we don't activate the link
      return false;
    }
    else {
      // Make sure we hide the level-2 wrapper
      $activeMenu.find('.level-2-wrapper').hide();
      // Activate the link
      return true;
    }
  });

  /*******************************************************
   **** Product drop down events - LEVEL 2 (OPENS LEVEL 3)
   *******************************************************/

  // Onclick event for the submenu level 2 items
  $('.product-mega-nav .level-2 li a').click( function() {
    // If this link is already open, then activate the link
    if ($(this).hasClass('open')) {
      return true;
    }

    // Get the mlid of the item we just clicked
    var id = $(this).attr('rel');

    // Get the (soon to be) active level 3 menu ul
    var $activeLevel3 = $('.product-mega-nav .level-2-wrapper ul#level-3-' + id);

    // Make sure all level-3 items are hidden
    $activeMenu.find('.level-2 li a.open').removeClass('open');
    $activeMenu.find('.level-3').hide();

    // If the $activeLevel3 exists and contains elements, then we can open it
    if ($activeLevel3.children('li').length > 0) {
      // Mark the level-1 item as open
      $(this).addClass('open');

      // Show the active level 3 item
      $activeLevel3.show();

      // Autoheight the $wrapper
      autoHeightWrapper($currentWrapper);

      // Return false, so we don't activate the link
      return false;
    }
    else {
      // Make sure all thr level-3 items are hidden
      $activeMenu.find('.level-3').hide();
      return true;
    }
  });

  // Onclick event for the search open button
  $('.product-mega-nav .search-form a.open_search').click( function() {
    closeMegaNav($activeMenu, true);
    // Autoheight the $wrapper
    autoHeightWrapper($wrapper);
    return false;
  });

  $('.header-mega-nav a.close_button').click( function() {
    $wrapper.animate(
      {height: '0px'},
      function() {
        closeMegaNav($activeMenu, false);
      }
    );
    return false;
  });
}

/**
 * Helper function to automatically expand/shrink the height of $wrapper to the height of it's contents.
 */
function autoHeightWrapper($wrapper)
{
	var currHeight = $wrapper.height();
	$wrapper.css( 'height', 'auto' );
	var autoHeight = $wrapper.height();
	$wrapper.height( currHeight ).animate({
		height: autoHeight
	});
}

function closeMegaNav( $activeMenu, searchTrigger )
{
  // If the close function has been triggered by the search toolbox open link, then only hide some level-2, level-3 items
  // Also, slide the margin back across
  if( searchTrigger ) {
    // Only slide the product menu back to 0
    $activeMenu.children('.product-mega-nav').animate({ 'margin-left': '0px' });
    // Only slide the contact menu back to 0
    $activeMenu.children('.contact-mega-nav').animate({ 'margin-left': '0px' });
  }
  else {
    // Otherwise, we need to close the whole menu
    // Add the right classes to the main wrapper
    $('.header-mega-nav-wrapper').addClass('closed');
    $('.header-mega-nav-wrapper').removeClass('open');
    $('.header-mega-nav-wrapper .open').removeClass('open');
    // Only slide the product menu back to 0
    $activeMenu.children('.product-mega-nav').css( 'margin-left', '0px' );
    // Only slide the contact menu back to 0
    $activeMenu.children('.contact-mega-nav').css( 'margin-left', '0px' );
    $activeMenu.hide();
  }
  $activeMenu.find('.level-2-wrapper').hide();
  $activeMenu.find('.level-3').hide();
  $activeMenu.removeClass('active');
}

function initiate_jcarousels()
{
	if( $('.jcarousel').length > 0 ) {

		$('.jcarousel').each( function() {
			// Make sure the jcarousel is wide enough
			// By setting the width of each one to be equal to the wrapper width * number of items in the list
			$(this).children('ul').width( $(this).width() * $('#'+$(this).attr('id')+' ul li').length );

		});

		// Init the carousel
		$('.jcarousel').jcarousel({
			wrap: 'circular'
		});

		// If the carousel also has a jcarousel-auto class, set up the auto scrolling functionality
		$('.jcarousel.jcarousel-auto').jcarouselAutoscroll({
	        interval: 5000,
	        target: '+=1',
	        autostart: true
	    });

		// Actions for the control buttons
		$('.jcarousel-control-prev')
            .on('jcarouselcontrol:active', function() {
                $(this).removeClass('inactive');
            })
            .on('jcarouselcontrol:inactive', function() {
                $(this).addClass('inactive');
            })
            .jcarouselControl({
                target: '-=1'
            });
        $('.jcarousel-control-next')
            .on('jcarouselcontrol:active', function() {
                $(this).removeClass('inactive');
            })
            .on('jcarouselcontrol:inactive', function() {
                $(this).addClass('inactive');
            })
            .jcarouselControl({
                target: '+=1'
            });

        // Actions for the pagination
        $('.jcarousel-pagination')
        	.on('jcarouselpagination:active', 'a', function() {
			    $(this).removeClass('inactive');
			})
        	.on('jcarouselpagination:inactive', 'a', function() {
                $(this).addClass('inactive');
			})
        	.jcarouselPagination({
		        item: function(page) {
		        	var a_class = ( page == 1 ) ? '' : 'inactive';
		            return '<a class="' + a_class + '" href="#' + page + '">' + page + '</a>';
		        }
		    });

		// Actions for the player
		$('.jcarousel-autocontrol').click( function() {
			if( $(this).hasClass('pause') ) {
				// If this is the pause button, then, well, pause the carousel
				$('.jcarousel.jcarousel-auto').jcarouselAutoscroll('stop');
				$(this).removeClass('pause');
				$(this).addClass('play');
			} else {
				// If this is the play button, start the auto play and scroll 1 element
				// This gives the user a better impression that the scroller has started
				$('.jcarousel.jcarousel-auto').jcarouselAutoscroll('start');
				$('.jcarousel.jcarousel-auto').jcarousel('scroll', '+=1');
				$(this).removeClass('play');
				$(this).addClass('pause');
			}
			return false;
		});
	}
}


// Set up customSelect plugin in downloads view blocks
function viewInitiation(views_to_initiate)
{
	for (var i in views_to_initiate) {
	    var $select = $("."+views_to_initiate[i]+" .form-select");

	    // Have to protect against repeated applications of customSelect() here
	    // When the <select> is used, an AJAX call is made which can cause this code to trigger repeatedly
	    // Only apply customSelect() if it hasn't already been applied
	    if (!$select.hasClass("hasCustomSelect")) {
            var selectWidth = $select.width();
            $select.customSelect();
            if ($('html').hasClass('lt-ie9')) {
                $select.parent().find(".customSelect").css("width", selectWidth+"px");
                $select.css({width: '100%'});
            }
	    }

	    // Also fix any reset buttons
	    $("."+views_to_initiate[i]+" .views-reset-button .form-submit").click(function(event) {
	    	event.preventDefault();
	    	$('form').each(function() {
      			$('form select option').removeAttr('selected');
      			this.reset();
    		});
    		$('.views-submit-button .form-submit').click();
    		return false;
	    });
	}
}

function initiateSolutionsPage()
{
	if ($('.solution-page-image').length > 0) {

		var activeID = $('.solution-page-image .image-wrapper span.blob.active').attr('rel');
		$('.solution-page-content .blob-item#blob-'+activeID).show();
		$('.solution-page-product-categories #prodlist-'+activeID).show();

		$('.solution-page-image .image-wrapper span.blob').each(function(){
			$(this).click(function(){
				var id = $(this).attr('rel');
				$('.solution-page-image .image-wrapper span.blob').removeClass('active');
				$(this).addClass('active');
				$('.solution-page-content .blob-item').hide();
				$('.solution-page-product-categories .item-list-wrapper').hide();
				$('.solution-page-content .blob-item#blob-'+id).show();
				$('.solution-page-product-categories #prodlist-'+id).show();
			})
		});
	}
}


function initLineUpImageLightboxes()
{
    "use strict";

    // Iterate images in series lists
    $(".series-list .image-col img").each(function(){

        // Determine the natural image width
        // Can't use .naturalWidth because IE8 sucks
        var img = new Image()
        img.src = this.src;

        // For images wider than 150px, add the "lightbox" effect
        if (img.width > 150) {

            var $this = $(this);

            // Set cursor: pointer to indicate this image can be interacted with
            $this.css("cursor", "pointer");

            // When the image is clicked, clone it and show it in a jQuery UI dialog box
            // This will be customised to create a lightbox effect
            $this.on("click", function(){

                // Create a clone (setting the cursor to the default, as lightbox images don't respond to clicks)
                var $clone = $(this).clone().css("cursor", "default");

                // Create the dialog and set its options
                var $dialog = $clone.dialog({
                    close: function(){

                        // Re-enable scrolling when the dialog closes
                        $("body").removeClass("no-scroll");
                    },
                    closeText: "",
                    dialogClass: "image-lightbox",
                    draggable: false,
                    hide: {
                        duration: 200,
                        effect: "fade"
                    },
                    modal: true,
                    open: function(){

                        // The overlay should animate in, else it will look wierd
                        // To accomplish this, immediately hide it, then fade it in
                        $(".ui-widget-overlay").hide().fadeIn(200);

                        // Remove the title bar
                        $(".ui-dialog-titlebar").remove();

                        // Add a custom close button
                        // Faster than styling the dialog one
                        var $closeButton = $('<span class="closeBtn">Close</span>');
                        $closeButton.on("click", function(){
                            $dialog.dialog("close");
                        });
                        $(".ui-dialog").append($closeButton);

                        // Prevent scrolling while the dialog is open
                        $("body").addClass("no-scroll");

                        // When the overlay is clicked, the dialog should close
                        $(".ui-widget-overlay").on("click", function(){
                            $dialog.dialog("close");
                        });
                    },
                    resizable: false,
                    show: {
                        duration: 500,
                        effect: "fade"
                    }
                });

            });
        }

    });
}


/**
 * Initialises the Simple Hierarchical Select boxes and functionality
 */
function initShs()
{
    $(document).ajaxComplete(updateCustomSelects);

    // Because of the customSelect() styles, selects will not be removed correctly
    // Listen for change events and do it ourselves
    $(".view-filters").on("change", "select.shs-select", updateCustomSelects);

    // Blunt tool to destroy customSelects and reset them
    function updateCustomSelects()
    {
        // Get rid of the customSelect <span> elements
        $("span.shs-select", ".views-widget-filter-shs_term_node_tid_depth").remove();

        // Reset the <select> elements (remove all customSelect styles and clases), then re-apply customSelect
// 20140728 ISC-J 項目を翻訳する START
//        $("select.shs-select", "#edit-shs-term-node-tid-depth-wrapper").removeClass("hasCustomSelect").attr("style", "").customSelect();
        $("select.shs-select", ".views-widget-filter-shs_term_node_tid_depth")
          .removeClass("hasCustomSelect")
          .attr("style", "")
          .customSelect();
// 20140728 ISC-J 項目を翻訳する END
    }
}


/**
 * Overrides the views reset button behaviour
 * The button is broken (views bug), so we just refresh the page instead,
 * which has essentially the same effect
 */
function overrideViewsResetButton()
{
    var $btn = $(".views-ajax-reset");

    // Remove any other JS handlers on the button
    $btn.off("click");

    // When it is clicked, prevent default behavior and reload the page
    $btn.on("click", function(e){
        e.preventDefault();
        e.stopPropagation();
        location.reload();
    });
}


})(jQuery, Drupal, this, this.document);

jQuery(document).ready(function(){
	//attr > style
	jQuery('.field-type-text-with-summary *[align=left]').css('text-align','left');
	jQuery('.field-type-text-with-summary *[align=center]').css('text-align','center');
	jQuery('.field-type-text-with-summary tr[align=center] td').css('text-align','center');
	jQuery('.field-type-text-with-summary tr[align=middle] td').css('text-align','center');
	jQuery('.field-type-text-with-summary *[align=center] > table').css('margin','auto');
	jQuery('.field-type-text-with-summary *[align=middle] > table').css('margin','auto');
	jQuery('.field-type-text-with-summary *[align=middle]').css('text-align','center');
	jQuery('.field-type-text-with-summary *[align=right]').css('text-align','right');
	jQuery('.field-type-text-with-summary *[valign=top]').css('vertical-align','top');
	jQuery('.field-type-text-with-summary *[valign=middle]').css('vertical-align','middle');
	jQuery('.field-type-text-with-summary *[valign=bottom]').css('vertical-align','bottom');
	jQuery('.field-type-text-with-summary *[valign=baseline]').css('vertical-align','baseline');
	jQuery('.field-type-text-with-summary td img[height!=1]').removeAttr('width');
	jQuery('.field-type-text-with-summary td img[height!=1]').removeAttr('height');

	var wary = [];var wi = 0;jQuery('.field-type-text-with-summary *[width]').each(function() {wary.push(jQuery(this).attr('width')); jQuery(this).width(wary[wi]); wi++;});
	var hary = [];var hi = 0;jQuery('.field-type-text-with-summary *[height]').each(function(){hary.push(jQuery(this).attr('height'));jQuery(this).height(hary[hi]);hi++;});
})

jQuery(function($){
	//ロールオーバー
	$("img.d-rollover").on({
		'mouseenter': function(){
			$(this).attr("src",$(this).attr("src").replace(/^(.+)(\.[a-z]+)$/, "$1-on$2"))
		},
		'mouseleave': function(){
			$(this).attr("src",$(this).attr("src").replace(/^(.+)-on(\.[a-z]+)$/, "$1$2"));
		}
	}).each(function(){
		$("<img>").attr("src",$(this).attr("src").replace(/^(.+)(\.[a-z]+)$/, "$1-on$2"))
	});
})


// related information style
jQuery(function($){
	if($('.ecatalog-related-information')) {
		$('.ecatalog-related-information div[class!="related-information-block"] ul').unwrap();
		$('.ecatalog-related-information > ul li').unwrap();
		$('.ecatalog-related-information > li').wrapAll('<ul class="rifset"></ul>');
		$('.rifset span.ext').remove();
		$('ul.rifset').after('<div class="c-flc"><!-- --></div>');
	}
});

// contact-us > blank
jQuery(function($){
	var thisurl = location.href;
	if (thisurl.indexOf('\/contact-us') == -1) {
		$('a[href]').each(function() {if (this.href.match(new RegExp(/\/contact-us(?!-admin)/))){$(this).attr('target', 'contactus');}})
	}
});


// tabs topmove
jQuery(function($){
	$('a[href *= "#quicktabs-"]').click(function() {window.scrollTo(0,0);})
});


// Anchor Link
jQuery(function($){
	var sadmin = $('.logged-in').length;
	$(window).hashchange(function(){
		if(location.hash){
			var target = location.hash;
			var position = $(target).offset().top;
			position = position - 50;
			if (sadmin > 0){position = position - 30;}
			window.scrollTo(0,position);
		}
	})
	setTimeout(function(){	$(window).hashchange();},1000);
});


/*
 * jQuery hashchange event, v1.4, 2013-11-29
 * https://github.com/georgekosmidis/jquery-hashchange
 */
(function(e,t,n){"$:nomunge";function f(e){e=e||location.href;return"#"+e.replace(/^[^#]*#?(.*)$/,"$1")}var r="hashchange",i=document,s,o=e.event.special,u=i.documentMode,a="on"+r in t&&(u===n||u>7);e.fn[r]=function(e){return e?this.bind(r,e):this.trigger(r)};e.fn[r].delay=50;o[r]=e.extend(o[r],{setup:function(){if(a){return false}e(s.start)},teardown:function(){if(a){return false}e(s.stop)}});s=function(){function p(){var n=f(),i=h(u);if(n!==u){c(u=n,i);e(t).trigger(r)}else if(i!==u){location.href=location.href.replace(/#.*/,"")+i}o=setTimeout(p,e.fn[r].delay)}var s={},o,u=f(),l=function(e){return e},c=l,h=l;s.start=function(){o||p()};s.stop=function(){o&&clearTimeout(o);o=n};var d=function(){var e,t=3,n=document.createElement("div"),r=n.getElementsByTagName("i");while(n.innerHTML="<!--[if gt IE "+ ++t+"]><i></i><![endif]-->",r[0]);return t>4?t:e}();d&&!a&&function(){var t,n;s.start=function(){if(!t){n=e.fn[r].src;n=n&&n+f();t=e('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){n||c(f());p()}).attr("src",n||"javascript:0").insertAfter("body")[0].contentWindow;i.onpropertychange=function(){try{if(event.propertyName==="title"){t.document.title=i.title}}catch(e){}}}};s.stop=l;h=function(){return f(t.location.href)};c=function(n,s){var o=t.document,u=e.fn[r].domain;if(n!==s){o.title=i.title;o.open();u&&o.write('<script>document.domain="'+u+'"</script>');o.close();t.location.hash=n}}}();return s}()})(jQuery,this)


