(function($) {

  $.fn.filterBar = function(options) {
    if (options == 'api') {
      return this.data('filterBar');
    } else if(options == 'destroy'){
      this.data('filterBar').destroy();
      this.removeData('filterBar');
    } else{
      return this.each(function() {
        var $this = $(this);
        if ($.type(options) === "object" && typeof $this.data('filterBar') == 'undefined') {
          var clazz = $.fn.filterBar.classes.FilterBar;
          $this.data('filterBar', new clazz($this, $.extend(true, {}, $.fn.filterBar.defaults, options, {rtl: $this.css('direction') == 'rtl'})));
        }
      });
    }
  };

  $.fn.filterBar.classes = {};

  $.fn.filterBar.defaults = {
  };

  /**
   * Progress bar class api
   */
  var FilterBarClass = function() {
    this.initialize.apply(this, arguments);
  };

  $.extend(FilterBarClass.prototype, {

    initialize: function(target, options) {
      this.options = options;
      this.el = target;
      this.options.manual_submit = this.el.data('manual_submit');
      this.options.submit_via_grid_id = this.el.data('submit_via_grid_id');

      this._initEvents();
    },

    serializeForm: function(){
      return this.form().toJSON();
    },

    form: function(){
      return this.el.find('form');
    },

    toggleSearching: function(value){
      this.form().toggleClass('working', value);
    },

    performSearch: function(){
      this.toggleSearching(true);
      this.el.trigger('performSearch');
    },

    onSearchCompleted: function(){
      this.toggleSearching(false);
    },

    _initFreeTextInput: function(){
      var self = this;

      var divFreeText = this.el.find('div.free_text');
      var inputFreeText = divFreeText.find('input');

      //init clear text button
      divFreeText.find('div.delete').click(function(){
        inputFreeText.val('');
        inputFreeText.focus();
      });

      //submit form when enter key is pressed inside free text input
      inputFreeText.on('keydown', function(e){
        if(e.which == $.Event.Keys.ENTER){
          self.form().submit();
        }
      });
    },

    _initEvents: function(){
      var self = this;

      this._initFreeTextInput();

      this.form().find('>div.icon').click(function(){
        self.form().submit();
      });

      this.el.find('a.more_link').click(function(){
        self.el.find('.search_fields').toggleClass('with_more');
      });

      this.form().on('submit', function(e){
        if(self.form().hasClass('working') || self.form().hasClass('submit_error')){ //prevent submits while aready searching or error occured
          e.preventDefault();
          return false;
        }

        if(self.options.manual_submit || self.options.submit_via_grid_id){
          e.preventDefault();
        }

        try{
          self.performSearch();
        }
        catch(error){
          self.el.trigger('performSearchError', {error: error});
        }

        if(self.options.manual_submit || self.options.submit_via_grid_id){
          return false;
        } else {
          return true;
        }
      });

      if(self.options.submit_via_grid_id){
        self.el.on('performSearch', function(){
          var grid = $.datagrid.helpers.findAPI(self.options.submit_via_grid_id);
          var params = self.serializeForm();
          grid.performFilter(params, {complete: function(){ self.onSearchCompleted(); } });
        });
      }

      self.el.on('performSearchError', function(event, data){
        if(typeof(window.console) != 'undefined' && window.console != null){
          console.error(data.error.stack);
        }
        self.toggleSearching(false);
        self.form().addClass('submit_error');
      });

      self.el.find('.submit_error a').on('click', function(){
        self.form().removeClass('submit_error');
      });
    }

  });

  $.fn.filterBar.classes.FilterBar = FilterBarClass;

})(jQuery);
