$.ext.Class.namespace("Initializers");


Initializers.fbox = (function(){
  var defaults = {
    base: {
      minWidth: 500,
      maxWidth: 950,
      minHeight: 50,
      fitToView: false,
      wrapCSS:'no-padding',
      helpers: {overlay: {closeClick: false, locked: false}},
      afterShow: function(){  Initializers.initNonLive(this.inner);   }
    }
  };
  defaults.ajax = $.extend({}, defaults.base, {
    type: 'ajax',
    live: true,
    beforeLoad: function() {
      Initializers.fbox.addAntiCacheToHref(this);
    }
  });
  defaults.inline = $.extend({}, defaults.base, {
    type: 'inline'
  });

  return {
    defaults: defaults,

    init: function(container) {
      Initializers.fbox.initFancyForms(container);
      Initializers.fbox.initFancyImages(container);
      Initializers.fbox.initFancyIFrames(container);
    },

    initFancyForms: function(container) {
      $('[data-fancybox-type=ajax]', container).fancybox(Initializers.fbox.defaults.ajax);
    },
    initFancyImages: function(container) {
      $('[data-fancybox-type=image]', container).fancybox($.extend({}, Initializers.fbox.defaults.ajax, {
        type: 'image',
        nextEffect: 'fade',
        prevEffect: 'fade'
      }));
    },
    initFancyIFrames: function(container) {
      $('[data-fancybox-type=iframe]', container).fancybox($.extend({},Initializers.fbox.defaults.ajax, {
        type: 'iframe',
        maxWidth: 1500,
        maxHeight: 800,
        minHeight: 800
      }));
    },

    addAntiCacheToHref: function(fancybox) {
      fancybox.href += (fancybox.href.indexOf('?')==-1 ? '?' : '&') + 'anti_cache='+(new Date()).getTime().toString();
    }
  }
})();
