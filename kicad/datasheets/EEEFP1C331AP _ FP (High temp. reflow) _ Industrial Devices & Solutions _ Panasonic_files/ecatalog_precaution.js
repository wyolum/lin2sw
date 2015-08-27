(function ($) {

  $('document').ready(function() {
    var layer_div = $('<div>');
    layer_div.attr('id', 'precaution-layer');
    layer_div.css({
      backgroundColor: '#EEE',
      opacity: '0.7',
      zIndex: '1000',
      position: 'absolute',
      top: '0px',
      left: '0px'
    });
    $('body').append(layer_div);

    $('#precaution-popup, #footer-popup').click(function() {
      $(this).blur();

      var width = $(window).width();
      var height = $(document).height();
      var scroll = $(document).scrollTop();
      var window_height = $(window).height();

      $('#precaution-layer').css('width', width);
      $('#precaution-layer').css('height', height);
      $('#precaution-layer').css('visibility', 'visible');

      var template = Drupal.settings.ecatalog_precaution.template;

      var return_button_wrap_div = $('<div class="precaution-button-back"></div>');
      return_button_wrap_div.css('textAlign', 'center');
      var return_button = $('<input type="button" value="' + Drupal.t('Back') + '">');
      return_button_wrap_div.append(return_button);

      var overlay_div = $('<div>');
      overlay_div.attr('id', 'precaution-overlay');

      overlay_div.css('backgroundColor', '#FFF');
      overlay_div.css('position', 'absolute');
      overlay_div.css('top', scroll + window_height * 0.1);
      overlay_div.css('left', width * 0.5 - width * 0.4);
      overlay_div.css('width', width * 0.8);
      overlay_div.css('zIndex', '2000');
      overlay_div.css('max-height', window_height * 0.8);
      overlay_div.css('overflow', 'auto');

      overlay_div.append(template);
      overlay_div.append(return_button_wrap_div);

      $('body').append(overlay_div);

      return_button.click(function() {
        $('#precaution-layer').css('visibility', 'hidden');
        $('#precaution-overlay').remove();
      });

      $(window).scroll(function() {
        var scroll = $(window).scrollTop();
        var window_height = $(window).height();

        $('#precaution-overlay').css('top', scroll + window_height * 0.1);
      });

      $(window).resize(function() {
        var width = $(document).width();
        var height = $(document).height();
        var scroll = $(document).scrollTop();
        var window_width = $(window).width();
        var window_height = $(window).height();

        $('#precaution-layer').css('width', width);
        $('#precaution-layer').css('height', height);

        $('#precaution-overlay').css('top', scroll + window_height * 0.1);
        $('#precaution-overlay').css('left', window_width * 0.5 - window_width * 0.4);
        $('#precaution-overlay').css('width', window_width * 0.8);
        $('#precaution-overlay').css('overflow', 'auto');
        $('#precaution-overlay').css('max-height', window_height * 0.8);
      });

      return false;
    });
  });

})(jQuery);