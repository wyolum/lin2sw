(function($){

    "use strict";

    // Plugin settings
    var settings = {
        maxTextLength: 200
    };

    // Follow the popular naming convention of giving JS tools stupid names
    $.fn.truncatr = function(){

        // Add a click handler for truncatr toggle links
        $("body").on("click", ".truncatr-toggle", toggleText);

        // Maintain chainability
        return this.each(function(){

            var $this = $(this);

            // Skip excluded content
            if ($this.hasClass("truncatr-exclude")) {

                // jQuery.each() equivalent of continue
                return true;
            }

            // We only want to operate on plain text longer than the maxTextLength setting
            // .text().length will be 0 if the element contains HTML
            if ($this.text().length > settings.maxTextLength) {

                // Fix the widths of table cells to stop them resizing when text visibility is toggled
                // 20140216 ISC-J 一部のLP3-2を表示時にレイアウトが崩れる対応 start
                // (display:noneが指定されているときはwidthが取れないので幅の固定は行わない)
//                if ($this.prop("tagName") === "TD") {
                if ($this.prop("tagName") === "TD" && $this.width() != 0) {
                  $this.css("width", $this.width());
                }
                // 20140216 ISC-J 一部のLP3-2を表示時にレイアウトが崩れる対応 end

                // Store the original text
                var origText = $this.html();

                // Truncate the new text (ending on a word bounary)
                var truncatedText = $this.html().substr(0, settings.maxTextLength);
                var lastSpace = truncatedText.lastIndexOf(" ");
                // 20150108 ISC-J 日本語対応 start
                // 英語の場合は単語の間隔で区切るために半角スペースの位置で切る処理
                // 日本語の場合半角スペースはないのでlastSpaceは-1になる
//              truncatedText = truncatedText.substr(0, lastSpace);
                if (lastSpace != -1) {
                  truncatedText = truncatedText.substr(0, lastSpace);
                }
                else {
                  // 半角スペースがなかった場合、区切ろうとしている場所がHTMLタグ中かどうか判定してタグ中なら開始タグで区切る
                  var tag_start = truncatedText.lastIndexOf("<");
                  var tag_end = truncatedText.lastIndexOf(">");
                  if (tag_start > tag_end && tag_start != -1) {
                    lastSpace = tag_start;
                    truncatedText = truncatedText.substr(0, lastSpace);
                  }
                }
                // 20150108 ISC-J 日本語対応 end

                // Start building the HTML string, starting with the truncated text
                var htmlStr = '<span>' + truncatedText + '</span>';

                // Add the ellipsis
                htmlStr+= '<span class="truncatr-ellipsis">&hellip;</span>';

                // Add the overflow text and the toggle button

                // 20150108 ISC-J 日本語対応 start
//                htmlStr += '<span class="truncatr-hidden">' + origText.substr(lastSpace) + '</span>';
                if (lastSpace != -1) {
                  htmlStr += '<span class="truncatr-hidden">' + origText.substr(lastSpace) + '</span>';
                }
                else {
                  htmlStr += '<span class="truncatr-hidden">' + origText.substr(settings.maxTextLength) + '</span>';
                }
                // 20140108 ISC-J 日本語対応 end

                htmlStr += '<br><span><a class="truncatr-toggle">' + Drupal.t("Show More") + '<a></span>';

                // Set the element's HTML, then hide the overflow text
                $this.html(htmlStr);
                $this.find(".truncatr-hidden").hide();
            }
        });
    };

    // Show or hide the full text
    function toggleText()
    {
        // Get the container of the text
        var $container = $(this).parent().parent();

        // Hide the ellipsis, show the full text
        $container.find(".truncatr-ellipsis").toggle();
        $container.find(".truncatr-hidden").toggle();

        // Toggle the link text
        if ($container.find(".truncatr-toggle").text() === Drupal.t("Show More")) {
            $container.find(".truncatr-toggle").text(Drupal.t("Show Less"));
        } else {
            $container.find(".truncatr-toggle").text(Drupal.t("Show More"));
        }
    }

})(jQuery);