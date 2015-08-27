(function ($) {

    // Define console for browsers without it
    if (!window.console) {
        window.console = {
            log: function(){}
        };
    }

	$(document).ready( function() {

		// Onchange event for the items per page selector
		$('#edit-items-per-page').change( function( e ) {
			$('#ecatalog-series-list-controls-form').submit();
		});

		// Onclick event for the ecatalog table filter buttons
		// Behaviour should show a tooltip with the filter elements contained within
		$('.ecatalog-table .filter a.filter-button').click( function( e ) {

			// Hide any open filter select elements
			$('.filter-select-element').hide();

			// Define the select element we will want to open
			var selectDivElement = $('.filter-select-element.'+$(this).attr('rel'));

			// Define the mouse positions
			selectDivElement.css({
				top: $(this).position().top - selectDivElement.outerHeight() - 20,
				left: $(this).position().left + ( $(this).outerWidth()/2 ) - ( selectDivElement.outerWidth()/2 )
			});

			// Open the select element
			selectDivElement.show();

		});

		// Close event for some filters
		$('.filter-select-element a.close').click( function() {
			$('.filter-select-element').hide();
			// Also, if the field no longer has a value, display the appropriate button
			var rel = $(this).attr('rel');
			toggleFilterButton(rel);
			return false;
		});

		// Change event for the ecatalog table filter select elements
		$('.filter-select-element select').each( function() {
			$(this).change( function() {

				// Get the value (and make it an array) and the element name
				var val = $(this).val();
				var name = 'filter_' + $(this).attr('name');

				// Populate the hidden field in the filter form and submit the form
				$('#ecatalog-series-filter-form input[name='+name+']').val( JSON.stringify( val ) );

				// Submit the form.
				//$('#ecatalog-series-filter-form').submit();

			});
		});

		// Define an onclick event for the filter select button. This should just hide the overlay and submit the form.
		$('button.filter-select-submit').click( function() {
			$(this).parents('.filter-select-element').hide();

			// On category pages, use a query string rather than form submission
			if ($(".ecatalog-page.category-page").length > 0) {

    			// Don't submit the form - manually set the query string instead
    			var selectedValue = $(".filter-select-element select").val();
    			var queryString = "";

    			// If values were selected, urlencode them and build a query string
    			if (null != selectedValue) {
        			queryString = "?filter_style=" + encodeURIComponent(selectedValue.join(","));
    			}

    			// Reload the page, appending the query string
    			if ($(".ecatalog-page.category-page").length > 0) {
    			  window.location = window.location.pathname + queryString + '#quicktabs-line_up_page_tab=1';
    			}
    			else {
    			  window.location = window.location.pathname + queryString;
    			}

			} else {

			    // Not a category page - just submit the form
    			$('#ecatalog-series-filter-form').submit();
			}
		});

		// Configure the range sliders on the page
		$('.filter-slider').each( function() {
			// Set up some variables for the range sliders.
			// The starting attributes should be in the range finder div's attributes
			// We need to also parse them as floats so jQuery UI slider can do the maths
			var field = $(this).attr('rel');
			var step = parseFloat( $('#slider-'+field).attr('step') );
			var min = parseFloat( $('#slider-'+field).attr('min') );
			var max = parseFloat( $('#slider-'+field).attr('max') );
			var start = parseFloat( $('.filter-slider-value.'+field+' span.lower').text() );
			var end = parseFloat( $('.filter-slider-value.'+field+' span.upper').text() );
			$('#slider-'+field).slider({
				range: true,
				step: step,
				min: min,
				max: max,
				values: [start, end],
				slide: function( event, ui ) {
					// On slide event: change the values of the text fields
					$('.filter-slider-value.'+field+' span.lower').text( ui.values[0] );
					$('.filter-slider-value.'+field+' span.upper').text( ui.values[1] );
				},
				change: function( event, ui ) {
					// On change event: Populate the hidden fields of the filter form
					$('#ecatalog-series-filter-form input[name=filter_'+field+']').val(ui.values[0]+'-'+ui.values[1]);
				}
			});
		});

		// Define an onclick event for any button with the filter-submit class to submit the hidden filter form
		$('button.filter-slider-submit').click( function() {
			var field = $(this).attr('rel');
			var minVal = parseFloat( $('.filter-slider-value.'+field+' span.lower').text() );
			var maxVal = parseFloat( $('.filter-slider-value.'+field+' span.upper').text() );
			$('#ecatalog-series-filter-form input[name=filter_'+field+']').val(minVal+'-'+maxVal);
			$(this).parents('.filter-select-element').hide();
			$('#ecatalog-series-filter-form').submit();
		});

		// Define some multiselects
		if ($('.ecatalog-table .jquery-multiselect').length > 0) {
			$('.ecatalog-table .jquery-multiselect').multiselect({
				minWidth: 225,
				checkAllText: Drupal.t('Check all'),
				uncheckAllText: Drupal.t('Uncheck all'),
				noneSelectedText: Drupal.t('Please select'),
				selectedText: Drupal.t('# selected'),
				position: {
		      		my: 'left bottom',
		      		at: 'left top'
			   	}
			});
		}

		//Configure jcarousels for .jcarousel
		if ($('.model-video .jcarousel').length > 0) {
			$('.model-video .jcarousel').jcarousel({
				scroll: 1,
				wrap: 'circular'
			});
		}


		// Apply the related documents (files) tabs if necessary
		var $tabsWrapper = $(".file-tabs-wrapper");

		// Only apply if there is more than one tab
		if ($tabsWrapper.length > 0 && $(".file-tab").length > 1) {
    		$tabsWrapper.tabs();
		} else {

    		// If there is only one tab, hide the tab titles so only the table will show
    		$(".file-tabs").hide();
		}

	});

	/**
	 * Simple function to display the correct filter button/icon in the ecatalog table filter row
	 * based on whether the user has actually selected a value. This is a simple helper so that if
	 * the use doesn't clock 'GO' then a state is changed.
	 *
	 * @param  [string] rel [The field id]
	 */
	function toggleFilterButton(rel)
	{
		var $valueSelectedButton = $('.filter-button.value-selected[rel='+rel+']');
		var $noValueSelectedButton = $('.filter-button.tight-button[rel='+rel+']');
		if ($('input[name=filter_'+rel+']').val() == 'null' || $('input[name=filter_'+rel+']').val() == '') {
			// If there is no value now for rel in the filter form, then show the normal button
			$valueSelectedButton.removeClass('active');
			$noValueSelectedButton.addClass('active');
		} else {
			// This means there is a value. If the $valueSelectedButton is not visible yet, then show it
			if ($valueSelectedButton.hasClass('active') === false) {
				$valueSelectedButton.addClass('active');
				$noValueSelectedButton.removeClass('active');
			}
		}
	}

})(jQuery);