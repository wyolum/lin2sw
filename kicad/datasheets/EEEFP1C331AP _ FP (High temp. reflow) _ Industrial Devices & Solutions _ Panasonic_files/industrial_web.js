(function ($) {

    // Doc ready
	$(function() {

        //Configure the area/country links lightbox
        if ($('#area-country-menu').length > 0) {
            initiateAreaCountryLightbox();
        }

        //Configure the eval kits list sliders
        if ($('.evaluation-kits-list ul li').length > 0) {
            initiateEvaluationKitsLists();
        }

        // Only initiate the custom select on items that are on the frontend - we don't want this on admin pages
        // - which is a possibility with the views module - as you can preview the view.
        if ($('select.custom_select_dropdown').parents('body').hasClass('page-admin') == false ) {
          // 20141105 ISC-J LP4レイアウト崩れ修正 start
//            $('select.custom_select_dropdown').customSelect().css({width: '100%'});;
          $('select.custom_select_dropdown').customSelect();
          // 20141105 ISC-J LP4レイアウト崩れ修正 end
        }

        var maxDistributorHeight = 0;
        $('.distributor_container').each( function() {
            if ($(this).height()>maxDistributorHeight)
                maxDistributorHeight = $(this).height();
        });
        setTimeout(function(){$('.distributor_container').height(maxDistributorHeight);},200);
        //console.log(maxDistributorHeight);


		// Dynamically work out the width of the video breakout box
		var width = $('.breakout_box.videos').width();
		$('.breakout_box.videos li').each( function() {
			$(this).width( width );
			$(this).children('iframe').width( width );
			$(this).children('iframe').height( $(this).height() );
		});

	});

    // Drupal callback for ajax views - this is invoked when the view is called
    // Its job is to re-initialise the custom selects when the ajax request has replaced them.
    if (Drupal.ajax != undefined) {
        Drupal.ajax.prototype.commands.viewsCustomAjaxCallback = function( ajax, response, status ) {
            if( $('select.custom_select_dropdown').parents('body').hasClass('page-admin') == false ) {
                $('select.custom_select_dropdown').customSelect();
            }
        };
    }

    // Initiate the area/country menu dropdown in the footer
    function initiateAreaCountryLightbox()
    {
        // Initial height of the footer
        var initFooterHeight = $('#footer').height();

        // Define the onclick event for the
        $('li.area-country-link a').click(function() {

            // Initialise the tabs and set it to update the height based on the active tab every time a tab is activated
            $('#area-country-menu').tabs({
                activate: function(event, ui) {
// 20150421 ISC-J フッターの空白部分の高さ調整 start
// 高さの動的変化処理をコメントアウト
//                    $('#footer').height(initFooterHeight + $('#area-country-menu').height());
// 20150421 ISC-J フッターの空白部分の高さ調整 end
                }
            });

            if ($(this).hasClass('active')) {
// 20140901 ISC-J ヘッダにメニューを追加 START
                $('#block-industrial_web-industrial_web-area-country-menu').css('border-top', '0px solid #7c7c7c');
                $('#block-industrial_web-industrial_web-area-country-menu').css('border-bottom', '0px solid #7c7c7c');
// 20140901 ISC-J ヘッダにメニューを追加 END
                $('#area-country-menu').slideUp(400);
                $('#footer').animate({
// 20150421 ISC-J フッターの空白部分の高さ調整 start
// 高さの動的変化処理をコメントアウト
//                    'height': initFooterHeight
// 20150421 ISC-J フッターの空白部分の高さ調整 end
                }, 400);
                $(this).removeClass('active');
            } else {
// 20140901 ISC-J ヘッダにメニューを追加 START
                $('#block-industrial_web-industrial_web-area-country-menu').css('border-top', '1px solid #7c7c7c');
                $('#block-industrial_web-industrial_web-area-country-menu').css('border-bottom', '1px solid #7c7c7c');
// 20140901 ISC-J ヘッダにメニューを追加 END

// 20150421 ISC-J フッターの空白部分の高さ調整 start
// 高さの動的変化処理をコメントアウト
//                $('#footer').height(initFooterHeight + $('#area-country-menu').height());
// 20150421 ISC-J フッターの空白部分の高さ調整 end
                $(this).addClass('active');
                $('#area-country-menu').slideDown();
            }
            return false;
        });
    }

    // Initiate the eval kits accordion
    function initiateEvaluationKitsLists()
    {
        $('.evaluation-kits-list ul li a.title').each(function() {
            $(this).click(function() {
                var rel = $(this).attr('rel');
                if ($('.evaluation-kits-list ul li div#'+rel).parent().hasClass('open') == false) {
                    $('.evaluation-kits-list ul li .details').parent().removeClass('open');
                    $('.evaluation-kits-list ul li .details').slideUp();
                    $('.evaluation-kits-list ul li div#'+rel).slideDown();
                    $('.evaluation-kits-list ul li div#'+rel).parent().addClass('open');
                } else {
                    // If we're clicking on one that is already open, then just close it up again
                    $('.evaluation-kits-list ul li .details').parent().removeClass('open');
                    $('.evaluation-kits-list ul li .details').slideUp();
                }
                return false;
            });
        });
    }

})(jQuery, Drupal)