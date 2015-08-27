/**
 * 要素がcolum個並ぶと改行し、行ごとに高さを揃える
 * 項目が複数個にまたがったときの対策済
 * (ただし、項目の最後の要素にviews-row-lastクラスが必要)
 */
 (function($){
    $.fn.autoHeight_colClass = function(options){
        var op = $.extend({

            column  : 0,
            clear   : 0,
            height  : 'minHeight',
            reset   : '',
            descend : function descend (a,b){ return b-a; }

        },options || {}); // optionsに値があれば上書きする
        var self = $(this);
        var n = 0,
            m = 0,
            l = -1,
            hMax,
            lastElement_flg = false,
            q = 0,
            hList = new Array(),
            hListLine = new Array();
        hListLine[0] = new Array();
        hListLine[0][0] = 0;

        // 要素の高さを取得
        self.each(function(i){
            if (op.reset == 'reset') {
                $(this).removeAttr('style');
            }
            var h = $(this).height();
            hList[i] = h;
            if (op.column > 1) {

                if(lastElement_flg){
                    hListLine[m] = new Array();
                    hListLine[m][n] = 0;
                }
                // op.columnごとの最大値を格納していく
                if (h > hListLine[m][n]) {
                hListLine[m][n] = h;
                }

                q++;
                lastElement_flg = false;
                if($(this).hasClass("views-row-last")) {
                    hListLine[m][n] += '.' + q;
                    q = 0;
                    m++;
                    n = 0;
                    l = i;
                    lastElement_flg = true;
                }
                if ( (i > 0) && (((i-l) % op.column) == 0 )&&(l != i)) {
                    hListLine[m][n] += '.' + q;
                    q = 0;
                    n++;
                    hListLine[m][n] = 0;
                    };
            }
        });

        // 取得した高さの数値を降順に並べ替え
        hList = hList.sort(op.descend);
        hMax = hList[0];


        // 高さの最大値を要素に適用
        var ie6 = typeof window.addEventListener == "undefined" && typeof document.documentElement.style.maxHeight == "undefined";
        if (op.column > 1) {
            var sum = 0;
            var allSum = 0;

            for(var p = 0;p < hListLine.length; p++){
                for (var j=0; j<hListLine[p].length; j++) {
                    for (var k=0; k<hListLine[p][j].split('.')[1] ; k++) {
                        if (ie6) {
                            self.eq(allSum +j*op.column+k).height(parseInt(hListLine[p][j].split('.')[0]));
                        } else {
                            self.eq(allSum +j*op.column+k).css(op.height,parseInt(hListLine[p][j].split('.')[0]));
                        }
                        if (k == 0 && op.clear != 0) {
                            self.eq(allSum +j*op.column+k).css('clear','both');
                        }
                    }
                    sum = j*op.column+k;
                }
                allSum += sum;
            }
        } else {
            if (ie6) {
                self.height(hMax);
            } else {
                self.css(op.height,hMax);
            }
        }
    };
})(jQuery);




 /**
  * 要素がcolum個並ぶと改行し、行ごとに高さを揃える
  */
  (function($){
     $.fn.autoHeight = function(options){
         var op = $.extend({

             column  : 0,
             clear   : 0,
             height  : 'minHeight',
             reset   : '',
             descend : function descend (a,b){ return b-a; }

         },options || {}); // optionsに値があれば上書きする

         var self = $(this);
         var n = 0,
             hMax,
             hList = new Array(),
             hListLine = new Array();
             hListLine[n] = 0;

         // 要素の高さを取得
         self.each(function(i){
             if (op.reset == 'reset') {
                 $(this).removeAttr('style');
             }
             var h = $(this).height();
             hList[i] = h;
             if (op.column > 1) {
                 // op.columnごとの最大値を格納していく
                 if (h > hListLine[n]) {
                     hListLine[n] = h;
                 }
                 if ( (i > 0) && (((i+1) % op.column) == 0) ) {
                     n++;
                     hListLine[n] = 0;
                 };
             }
         });

         // 取得した高さの数値を降順に並べ替え
         hList = hList.sort(op.descend);
         hMax = hList[0];

         // 高さの最大値を要素に適用
         var ie6 = typeof window.addEventListener == "undefined" && typeof document.documentElement.style.maxHeight == "undefined";
         if (op.column > 1) {
             for (var j=0; j<hListLine.length; j++) {
                 for (var k=0; k<op.column; k++) {
                     if (ie6) {
                         self.eq(j*op.column+k).height(hListLine[j]);
                     } else {
                         self.eq(j*op.column+k).css(op.height,hListLine[j]);
                     }
                     if (k == 0 && op.clear != 0) {
                         self.eq(j*op.column+k).css('clear','both');
                     }
                 }
             }
         } else {
             if (ie6) {
                 self.height(hMax);
             } else {
                 self.css(op.height,hMax);
             }
         }
     };
 })(jQuery);



/**
 * 要素がcolum個並ぶと改行し、行ごとに高さを揃える
 * 行の要素が可変のときの対策済み
 */
 (function($){
    $.fn.autoHeight_list = function(options){
        var op = $.extend({

            column  : 0,
            clear   : 0,
            height  : 'minHeight',
            reset   : '',
            descend : function descend (a,b){ return b-a; }

        },options || {}); // optionsに値があれば上書きする
        var self = $(this);
        var n = 0,
            m = 0,
            hMax,
            hList = new Array(),
            hListLine = new Array();
        hListLine[0] = new Array();
        hListLine[0][0] = 0;

        // 要素の高さを取得
        self.each(function(i){
            selector = $(this).children('.d-group-list');
            if (op.reset == 'reset') {
                selector.removeAttr('style');
            }
            var h = (selector.height() != null) ? selector.height() : 0 ;
            hList[i] = h;
            if (op.column > 1) {
                // op.columnごとの最大値を格納していく
                if (h > hListLine[m][n]) {
                    hListLine[m][n] = h;
                }
                if ( (i > 0) && (((i+1) % op.column) == 0 )) {
                    n++;
                    hListLine[m][n] = 0;
                };
            }
        });

        // 取得した高さの数値を降順に並べ替え
        hList = hList.sort(op.descend);
        hMax = hList[0];

        // 高さの最大値を要素に適用
        var ie6 = typeof window.addEventListener == "undefined" && typeof document.documentElement.style.maxHeight == "undefined";
        if (op.column > 1) {
            var sum = 0;
            var allSum = 0;

            for(var p = 0;p < hListLine.length; p++){
                for (var j=0; j<hListLine[p].length; j++) {
                    for (var k=0; k<op.column ; k++) {
                        if (ie6) {
                            self.eq(allSum +j*op.column+k).children('.d-group-list').height(hListLine[p][j]);
                        } else {
                            self.eq(allSum +j*op.column+k).children('.d-group-list').css(op.height,hListLine[p][j]);
                        }
                        if (k == 0 && op.clear != 0) {
                            self.eq(allSum +j*op.column+k).css('clear','both');
                        }
                    }
                    sum = j*op.column+k;
                }
                allSum += sum -1;
            }
        } else {
            if (ie6) {
                self.height(hMax);
            } else {
                self.css(op.height,hMax);
            }
        }
    };
})(jQuery);