FancyBoxInitalizer = {

  config: {
    images: {
      selector: ".fancyImage",
      fancybox: {
        hideOnContentClick: true
      }
    },

    youtube: {
      selector: ".fancyYoutube",
      fancybox: {
        type: 'iframe',
        overlayShow : true,
        centerOnScroll : true,
        speedIn : 100,
        speedOut : 50,
        width : 640,
        height : 480
      }
    },

    forms: {
      selector: ".fancyForm",
      fancybox: {
        hideOnContentClick: false,
        hideOnOverlayClick: false,
        showNavArrows: false,
        titleShow: false,
        padding: 0
      }
    }
  },

  init: function(container) {
    FancyBoxInitalizer.initFancyImages(container);
    FancyBoxInitalizer.initFancyYoutube(container);
    FancyBoxInitalizer.initFancyForms(container);
  },

  initFancyForms: function(container) {
    FancyBoxInitalizer._initFromConfig(container, FancyBoxInitalizer.config.forms);
  },

  initFancyImages: function(container) {
    FancyBoxInitalizer._initFromConfig(container, FancyBoxInitalizer.config.images);
  },

  initFancyYoutube: function(container) {
    FancyBoxInitalizer._initFromConfig(container, FancyBoxInitalizer.config.youtube);
  },

  invokeOnComplete: function(func) {
    FancyBoxInitalizer.onCompleteInvoker.invoke(func);
  },

  focusInputOnComplete: function(){
    var fboxContent = $('#fancybox-content');
    if(fboxContent.find('form.noFocus').length > 0) return; //no focus on the whole form

    var input = fboxContent.find('input.autoFocus'); //find input with autoFocus field
    if(input.length == 0) input = fboxContent.find('input[type=text]:not(.noFocus,.hasDatepicker):first');
    input.focus();
  },

  _initFromConfig: function(container, config){
    $(config.selector, container).fancybox(config.fancybox);
  },

  liveInit: function(){
    $(document).off('.fbox-api');
    $(document).on('click.fbox-api', 'a[data-fbox]', function(){
      var $this = $(this);
      var url = $this.data('url');
      if(!url || url.length == 0) throw "data-url must be present";

      var cfg = {};
      if($this.data('fbox') == 'form'){
        cfg = FancyBoxInitalizer.config.forms.fancybox;
        url = FancyBoxInitalizer.ensureFboxUrlFormat(url);
      }
      else if($this.data('fbox') == 'image') cfg = FancyBoxInitalizer.config.images.fancybox;
      else if($this.data('fbox') == 'youtube') cfg = FancyBoxInitalizer.config.youtube.fancybox;

      $.fancybox(
        $.extend({ href: url }, cfg) //must use extend so the original FancyBoxInitalizer.config won't be changed (create cfg copy)
      );
    });
  },

  ensureFboxUrlFormat: function(url){
    if(!(url.match(/[^./]+.fbox\?/g)) && !(url.match(/[^./]+.fbox$/g))){ //if url does not end with .fbox or contains .fbox? we need to add it manually
      if(url.indexOf('?') == -1) { //url does not contain parameters, just add .fbox suffix
        url += '.fbox';
      } else { //add .fbox before ?
        url = url.replace('?', '.fbox?');
      }
    }
    url += (url.indexOf('?')==-1 ? '?' : '&') + 'anti_cache='+(new Date()).getTime().toString(); //add anti caching shit voodoo because sometimes ajax get requests are not fired because browser thinks they're cached
    return url;
  },

  allowOverflow: function() {
    $('div.fbox').parent().css('overflow', 'visible');
    $('div.fbox').closest('#fancybox-content').css('overflow', 'visible');
  }

};


(function($) {

  var OnCompleteInvokerClass = function() {
    this.initialize.apply(this, arguments);
  };

  $.extend(OnCompleteInvokerClass.prototype, {

    busy: false,
    func: null,

    initialize: function() {

    },

    invoke: function(func) {
      if (!this.busy) func();
      this.func = func;
    },

    generateFancyboxCallbacks: function() {
      var self = this;
      return {
        onStart: function() {
          self.busy = true;
        },
        onComplete: function(currentArray, currentIndex, currentOpts) {
          self.busy = false;
          if (self.func != null) {
            self.func();
            self.func = null;
          }
          QTipIntializer.init($('#fancybox-content'));
          ToggleBarInitalizer.init($('#fancybox-content'));
          FancyBoxInitalizer.focusInputOnComplete();
          $('#fancybox-wrap').off('mousewheel.fb');
        }
      }
    }

  });

  FancyBoxInitalizer.onCompleteInvoker = new OnCompleteInvokerClass();
  $.extend(FancyBoxInitalizer.config.forms.fancybox, FancyBoxInitalizer.onCompleteInvoker.generateFancyboxCallbacks());

  FancyBoxInitalizer.liveInit();

}(jQuery));
