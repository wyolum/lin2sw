(function ($) {

  Drupal.behaviors.lang_dropdown = {
    attach: function(context, settings) {

      $('select.lang-dropdown-select-element').change(function() {
        var url_list = Drupal.settings.lang_dropdown_url_list;

        // 選択した値が外部リンクの場合はそちらに遷移する
        for (var i in url_list) {
          if (i == $(this).val()) {
            window.open(url_list[i]);
            return;
          }
        }
// 20140822 ISC-J グローバルトップへ遷移する処理を追加 START
        if ($(this).val() == 'global') {
          var global_url = Drupal.settings.global_url;
          window.location.href = global_url;
          return;
        }
// 20140822 ISC-J グローバルトップへ遷移する処理を追加 END

        // 外部リンクではなかった場合はdrupal内で遷移する
        // @see lang_dropdown.js
        var lang = this.options[this.selectedIndex].value;
        var href = $(this).parents('form').find('input[name="' + lang + '"]').val();
        window.location.href = href;
      });
    }
  }

})(jQuery);