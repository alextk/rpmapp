QTipIntializer = (function($) {

  var config = {
    inlineTargetSelector: '.tooltipTarget, .qtipTarget',
    ajaxTargetSelect: '.qtipAjax',
    contentSelector: '.tooltipContents, .qtipContents',
    positionsMap: {
      t: 'top',
      l: 'left',
      b: 'bottom',
      c: 'center',
      r: 'right'
    }
  };

  function parsePosition(target) {
    var myPos = null;
    var atPos = null;
    var clsPos = target.attr('class').split(' ').select(
      function(c) {
        return c.startsWith('pos-');
      }).first();
//    var myHorizontalPosition = target.css('direction') == 'rtl' ? 'right' : 'left';
    var myHorizontalPosition = 'center';
    if (clsPos) {
      clsPos = clsPos.replace('pos-', '');
      var arrMyAt = clsPos.split('-');
      myPos = fullPos(arrMyAt[0], 'bottom', myHorizontalPosition);
      atPos = fullPos(arrMyAt[1], 'top', 'center');
    }

    return {
      my: myPos || 'bottom ' + myHorizontalPosition,  // Position my top left...
      at: atPos || 'top center', // at the bottom right of...
      effect: false,
      adjust: {x: 0, method: 'flipinvert'},
      viewport: $('body')
    };
  }

  //recieve string like tl or bl and map it to top left or botto left
  function fullPos(shortPos, default1, default2) {
    var first = shortPos.length > 0 ? config.positionsMap[shortPos.charAt(0)] : null;
    first = first || default1;
    var second = shortPos.length > 1 ? config.positionsMap[shortPos.charAt(1)] : null;
    second = second || default2;
    return first + ' ' + second;
  }

  function showHideConfig(type){
    var cfg = null;
    if(type == 'click'){
      cfg = {
        show: {
          event: 'click'
        },
        hide: {
          event: 'unfocus'
        }
      };
    } else{
      cfg = {};
    }
    return cfg;
  }

  return {

    init: function(container) {
      var touchDevice = $('body').hasClass('touch_device');
      //init inline qtips
      $(config.inlineTargetSelector, container || null).each(function() {
        if(touchDevice) return; //do not initialize hove qtips on touch devices

        var tipContent = jQuery(config.contentSelector, $(this));
        var cls = '';
        if(tipContent.length == 0){
          tipContent = $(this).attr('title');
          if(!tipContent) return; //skip empty contents
        } else{
          cls = 'qtip-initializer'
        }
        var position = parsePosition($(this));

        if (tipContent.length > 0) {
          $(this).qtip({
            content: { text: tipContent },
            position: position,
            style:{
              classes: 'ui-tooltip-help ' + cls,
              tip: {
                corner: true,
                offset: 10 // Give it 5px offset from the side of the tooltip
              }
            }
          });
        }
      });

      //init ajax qtips
      $(config.ajaxTargetSelect, container || null).each(function() {
        var $this = $(this);
        var url = $this.data('ajax_url');
        var loadingText = $this.data('loading_text') || 'Loading...';
        var position = parsePosition($(this));
        var cfg = showHideConfig($this.data('show_hide') || 'click');
        var fetchOnce = $this.data('once');
        if(fetchOnce==undefined) fetchOnce = true;

        if (url) {
          $this.qtip(
            $.extend(cfg, {
              position: position,
              style:{
                classes: 'ui-tooltip-ajax',
                tip: {
                  corner: true,
                  offset: 10 // Give it 5px offset from the side of the tooltip
                }
              },
              content: {
                text: loadingText, // The text to use whilst the AJAX request is loading
                ajax: {
                  once: fetchOnce,
                  url: url, // URL to the local file
                  type: 'GET', // POST or GET
                  data: {} // Data to pass along with your request
                }
              }
            })
          );
        }
      });
    }

  };

})(jQuery);