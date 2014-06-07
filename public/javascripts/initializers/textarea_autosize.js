$.ext.Class.namespace("Initializers");

Initializers.textarea_autosize = (function($) {

  return {
    init: function(container) {
      $('textarea.autosize', container).each(function() {
        $(this).autosize();
      });
    }

  }
})(jQuery);