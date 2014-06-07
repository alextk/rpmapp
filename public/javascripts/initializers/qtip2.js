$.ext.Class.namespace("Initializers");

Initializers.qtip = (function($) {

  var user_interactions = {
    click: { //show on click, hide on loss of focus
      show: {
        event: 'click'
      },
      hide: {
        event: 'unfocus'
      }
    },
    hover: {} //default qtip events. show on mouseover, hide on mouseout
  };


  return {
    init: function(container) {
      if($('body').hasClass('touch_device')) return
      $('.qtipTarget', container).each(function() {
        var tipContent = jQuery('.qtipContents', $(this));
        var qtip_config = {
          position: {
            my: 'bottom center',
            at: 'top center',
            effect: false,
            adjust: {x: 0, method: 'flipinvert'},
            viewport: $('body')
          },
          style:{
            tip: {
              corner: true,
              offset: 0
            }
          }
        };
        var ajax_url = $(this).data('url');
        var self = this;
        if(ajax_url) {
          $.extend(true, qtip_config, {
            style: {classes: 'ui-tooltip-ajax'},
            content: {
              text: tipContent.length >  0 ? tipContent.text() : 'Loading...',
              ajax: {
                once: true,
                url: ajax_url,
                complete: function() { $(self).qtip('api').reposition(); }
              }
            }
          });
        } else {
          if(tipContent.length == 0){
            tipContent = $(this).attr('title');
            if(!tipContent) return;
          }
          $.extend(true, qtip_config, {style: {classes: 'ui-tooltip-help'}, content: {text: tipContent}});
        }
        $.extend(true, qtip_config, user_interactions[$(this).data('interaction')] || {});
        $(this).qtip($.extend(true, qtip_config, $(this).data('qtip-options')));
      });
    }

  }
})(jQuery);