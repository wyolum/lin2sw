(function ($, Drupal) {

  $(function() {

    // Configure js on the expert search
    if( $('.expert-search').length > 0 )
    {

      // Initialise the customSelects - make sure the width is 100%
      $('.expert-categories-dropdown').customSelect().css({width: '100%'});

      // Register the onchange event for the product group dropdown (the first drop down)
      registerOnChangeEvents($('#edit-product-group'));

      // IF the expert search is already fully open (when we're on the results page), make sure stuff is initialised.
      if( $('#edit-attributes div.fieldset-wrapper div.form-item').length > 0 ) {

        // Initialise the expert search form
        initiateExpertSearchForm();

        // Register on change events for the other two category drop downs
        registerOnChangeEvents($('#edit-product-category'));
        registerOnChangeEvents($('#edit-product-lineup'));

        // Make sure all the descriptions are showing
        $('.description .count-results').show();
      }

      /**
       * Define callbacks registered in the expert search form from industrial_web_search_expert_search.inc
       * グループ、カテゴリ選択時にAjaxから呼び出される処理
       */
      Drupal.ajax.prototype.commands.expertSearchCategoryCallback = function( ajax, response, status ) {
        // When the group or category field is specified, make sure we initialise the custom select elements of the select we're now creating
        $(ajax.wrapper + ' select.expert-categories-dropdown').customSelect();

        // On this new select item, we need to register some onchange events
        registerOnChangeEvents($(ajax.wrapper + ' select.expert-categories-dropdown'));

        // Check if the count-results are zero, and add a class if they are
        var countResult = parseInt($(ajax.selector).parents('.form-item').find('.description .count-results').children('div').text());
        if (countResult == 0) {
          $(ajax.selector).parents('.form-item').find('.description .count-results').addClass('zero');
          // We also need to display a message to prompt the user to change their search criteria
          $('#categories-fieldset-no-results').show();
        }
        else {
          $(ajax.selector).parents('.form-item').find('.description .count-results').removeClass('zero');
        }
        // Now show the count results
        $(ajax.selector).parents('.form-item').find('.description .count-results').show();
      };

      /**
       * ラインナップ選択時にAjaxから呼び出される処理
       */
      Drupal.ajax.prototype.commands.expertSearchAttributesCallback = function( ajax, response, status ) {

        // This callback is called once we know which line-up item has been selected.
        // Show the description
        $(ajax.selector).parents('.form-item').find('.description .count-results').show();
        var countResult = parseInt($(ajax.selector).parents('.form-item').find('.description .count-results').children('div').text());

        // Check if the count-results are zero, and add a class if they are
        if (countResult == 0) {
          $(ajax.selector).parents('.form-item').find('.description .count-results').addClass('zero');
          $('#categories-fieldset-no-results').show();
        }
        else {
          $(ajax.selector).parents('.form-item').find('.description .count-results').removeClass('zero');
          // We want to initiate some elements in the main body of the search form.
          initiateExpertSearchForm();
        }
      };

      // Ajax処理開始時
      var beforeSend = Drupal.ajax.prototype.beforeSend;
      Drupal.ajax.prototype.beforeSend = function(xmlhttprequest, options) {
        beforeSend.call(this, xmlhttprequest, options);
        disableExpertSearchForm();
      };

      // Ajax処理成功時
      var success = Drupal.ajax.prototype.success;
      Drupal.ajax.prototype.success = function(xmlhttprequest, options) {
        success.call(this, xmlhttprequest, options);
        enableExpertSearchForm();
      };
    }

    // Potential issue with when we're on the results page
    // It seems the Drupal ajax form cannot repopulate the product dropdowns when we're displaying the form on the results page
    // Can't think why this is. Possible solution might be to disable the category drop downs.
    // I've managed to get the onChange events registered above. This is good.
    // The final problem is that when the form is submitted to ajax, to the drupal form API, the form values must be still the old ones, so it returns



    // If there are expert search handles (links which show and hide the expert search form on the results page)
    // then define their behaviour.
    if($('.expert-search-handle').length > 0) {
      $('.expert-search-form-wrapper').slideUp('slow');

      $('.expert-search-handle a').click( function() {
        $('#categories-fieldset-no-results').hide();
        if ($(this).hasClass('open')) {
          // The tab is open, so we should close it.
          // Slide the view pane back up to the top
          $('html, body').animate({
            scrollTop: 0
          }, 500);
          // If this is the close button, close the form and change the link text
          $('.expert-search-form-wrapper').slideUp('slow');
//          $('.expert-search-form-wrapper').switchClass('open', 'closed', 600);
          $(this).removeClass('open');
          $(this).text(Drupal.t('Open filters'));
        }
        else {
          // If this is the open button, open the form and change the link text
          $('.expert-search-form-wrapper').slideDown('slow');
//          $('.expert-search-form-wrapper').switchClass('closed', 'open', 600);
          $(this).addClass('open');
          $(this).text(Drupal.t('Close Filters'));
        }
        return false;
      });
    }

  });

  /**
   * Register an onChange event for the select elements in the expert search form.
   * This onChange event OCCURS BEFORE the drupal form ajax event that populates the select boxes with valid options.
   * This does a few important things:
   *     1. It removes the existing expert search fields. Since we are changing the categories, the fields may be changing also.
   *     2. It hides the descriptions which are used to indicate the number of results that will be returned.
   *     3. It replaces any select options in the levels below this current one with the default empty option (which is specified by the form API as the attribute empty-string)
   *
   * Confusingly, level in this context increases as it goes down, for example:
   * The first drop down has level 1, the second level 2, and the third level 3. But, level 3 is considered BELOW level 2.
   *
   * @param  [jQuery object] selectElement [The select element to add the onChange event to - this is a jQuery object]
   */
  function registerOnChangeEvents(selectElement)
  {
    var max_level = 3;
    // Register an onchange for this element
    selectElement.change(function() {

      // Hide the no results message on the categories fieldset
      $('#categories-fieldset-no-results').hide();

      // Remove the old form, because we will be replacing this.
      $('fieldset.expert-search-attributes').remove();

      var level = parseInt($(this).attr('level'));

      // Hide the description count for this element, it will be shown again on ajax complete
      $(this).parents('.form-item').find('.description .count-results').hide();

      // Increase the level by 1 (to start checking the select boxes below this one)
      // Loop through each select box with a higher level and remove the descriptions and replace the options
      level++;
      while (level <= max_level) {

        // Hide the description count for any element with a level below this one
        $('select.expert-categories-dropdown[level='+level+']').parents('.form-item').find('.description .count-results').hide();

        // Replace the select options of this level with the "Please select message" and trigger an update on the customSelect box
        $('select.expert-categories-dropdown[level='+level+']').html('<option value="" selected="selected">'+$('select.expert-categories-dropdown[level='+level+']').attr('empty-string')+'</option>');
        $('select.expert-categories-dropdown[level='+level+']').trigger('update');

        // Increase level
        level++;
      }
    });
  }

  /**
   * This function initiates some elements in the expert search form.
   * When the form is shown by drupal form API ajax, it will need to be initiated so we can use widgets like jQuery ui slider and customSelect etc
   */
  function initiateExpertSearchForm() {

    $('.expert-search .jquery-multiselect').multiselect({
      minWidth: 650,
      selectedList: 4,
      checkAllText: Drupal.t('Check all'),
      uncheckAllText: Drupal.t('Uncheck all'),
      noneSelectedText: Drupal.t('Please select'),
      selectedText: Drupal.t('# selected'),
      position: {
        my: 'left bottom',
        at: 'left top'
      }
    });

    // Initialise some radio buttons
//    $('input.custom-radio-buttons').screwDefaultButtons({
//      width: 34,
//      height: 34,
//      image: 'url("useImage(radio-icons.png)")',
//    });

    // Initialise the sliders on the form
//    $('.expert-slider').each( function() {
//      var step = parseFloat( $(this).attr('step') );
//      var min = parseFloat( $(this).attr('min') );
//      var max = parseFloat( $(this).attr('max') );
//      var start = parseFloat( $('#'+$(this).attr('rel')+'_slider_start').val() );
//      var end = parseFloat( $('#'+$(this).attr('rel')+'_slider_end').val() );
//      $(this).slider({
//        range: true,
//        step: step,
//        min: min,
//        max: max,
//        values: [start, end],
//        slide: function( event, ui ) {
//          // On slide event: change the values of the text fields
//          $('#'+$(this).attr('rel')+'_slider_start').val( ui.values[0] );
//          $('#'+$(this).attr('rel')+'_slider_end').val( ui.values[1] );
//          // Also update the hidden field value
//          $('.expert-slider-hidden[name='+$(this).attr('rel')+']').val( ui.values[0] + '-' + ui.values[1] );
//        }
//      });
//    });

    // テキストフィールド入力時に、hidden項目の値をセットしなおす
    $('.expert-range-textfield').each(function () {
      $(this).keyup(function (e) {
        var field_name = $(this).attr('rel');
        var min_value = null;
        var max_value = null;
        var id = $(this).attr('id');
        var str = id + " ";
        // idの末尾が_startの場合
        if (str.indexOf("start ") !== -1) {
          min_value = $('#' + id).val();
          max_value = $('#' + id.replace(/start$/, "end")).val();
        }
        // idの末尾が_endの場合
        if (str.indexOf("end ") !== -1) {
          min_value = $('#' + id.replace(/end$/, "start")).val();
          max_value = $('#' + id).val();
        }
        delay(function () {
          // hidden項目に値をセットする
          if (min_value == '' || min_value == null) {
            min_value = 'blank';
          }
          if (max_value == '' || max_value == null) {
            max_value = 'blank';
          }
          // 'min'-'max'の形式でセット
          $('.expert-slider-hidden[name=filter_' + field_name + ']').val(min_value + '-' + max_value);
        }, 800);
      });
    });

    // Define a delay function for when to call a callback function after a specific delay
    var delay = (function () {
      var timer = 0;
      return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
      };
    })();

    $('.expert-search .form-submit').click(function() {
      $('.expert-search .form-submit').bind('click', buttonDisableHandler);
      $('.expert-search-csv-output-wrapper .form-submit').bind('click', buttonDisableHandler);
      $('a').bind('click', linkDisableHandler);
    });
  }

  /**
   * Ajaxエラー対策(フォーム・ボタンを無効化する)
   */
  function disableExpertSearchForm() {
    $('#industrial-web-search-expert-search-form select').attr('disabled', 'disabled');
    $('#industrial-web-search-expert-search-form input').attr('disabled', 'disabled');
    $('#industrial-web-search-expert-search-form button').attr('disabled', 'disabled');
    $('.expert-search .form-submit').attr('disabled', 'disabled');
    $('.expert-search-csv-output-wrapper .form-submit').attr('disabled', 'disabled');

    $('.expert-search-results-wrapper select').attr('disabled', 'disabled');
    $('.expert-search-results-wrapper input').attr('disabled', 'disabled');
    $('.expert-search .form-submit').attr('disabled', 'disabled');
    $('.expert-search-csv-output-wrapper .form-submit').attr('disabled', 'disabled');

    $('.expert-search-csv-output-wrapper select').attr('disabled', 'disabled');
    $('.expert-search-csv-output-wrapper input').attr('disabled', 'disabled');
    $('.expert-search .form-submit').attr('disabled', 'disabled');
    $('.expert-search-csv-output-wrapper .form-submit').attr('disabled', 'disabled');

    $('.ui-multiselect-menu input').attr('disabled', 'disabled');

    $('a').bind('click', linkDisableHandler);
  }

  /**
   * Ajaxエラー対策(フォーム・ボタンを有効化する)
   */
  function enableExpertSearchForm() {
    $('#industrial-web-search-expert-search-form select').removeAttr('disabled');
    $('#industrial-web-search-expert-search-form input').removeAttr('disabled');
    $('#industrial-web-search-expert-search-form button').removeAttr('disabled');
    $('.expert-search .form-submit').removeAttr('disabled');
    $('.expert-search-csv-output-wrapper .form-submit').removeAttr('disabled');

    $('.expert-search-results-wrapper select').removeAttr('disabled');
    $('.expert-search-results-wrapper input').removeAttr('disabled');
    $('.expert-search .form-submit').removeAttr('disabled');
    $('.expert-search-csv-output-wrapper .form-submit').removeAttr('disabled');

    $('.expert-search-csv-output-wrapper select').removeAttr('disabled');
    $('.expert-search-csv-output-wrapper input').removeAttr('disabled');
    $('.expert-search .form-submit').removeAttr('disabled');
    $('.expert-search-csv-output-wrapper .form-submit').removeAttr('disabled');

    $('.ui-multiselect-menu input').removeAttr('disabled');

    $('a').unbind('click', linkDisableHandler);
  }

  /**
   * リンク無効化用ハンドラー
   */
  function linkDisableHandler(e) {
    e.preventDefault();
  }

  /**
   * ボタン無効化用ハンドラー
   */
  function buttonDisableHandler(e) {
    return false;
  }

})(jQuery, Drupal);