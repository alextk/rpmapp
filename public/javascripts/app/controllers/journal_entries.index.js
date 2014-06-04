$.ext.Class.namespace('MyRPM.controllers');

MyRPM.controllers.JournalEntriesGridViewController = $.ext.Class.create('MyRPM.controllers.JournalEntriesGridViewController', {

  initialize: function(config) {
    var self = this;
    this.initialConfig = config || {};
    jQuery.extend(this, this.initialConfig);

    this._initEvents();
  },

  _initEvents: function(){
    var self = this;

    //init new journal entry datepicker
    $('.btn.new_journal_entry input[name=new_journal_entry_date]').datepicker(jQuery.extend({}, jQuery.datepicker.regional['he-IL'], {
      showOtherMonths: true,
      selectOtherMonths: true,
      dateFormat: 'yy-mm-dd',
      beforeShow: function (input, inst) {
        window.setTimeout(function () {
          inst.dpDiv.position({
            my: 'center top',
            at: 'center bottom',
            of: $(input).closest('.btn')
          });
        }, 1);
      },
      onSelect: function(dateText, inst){
        $.fancybox(
          $.extend({
              href: $(this).closest('.btn').data('url'),
              ajax: {
                data: $.param({date: dateText, format: 'fbox'})
              }
            },
            FancyBoxInitalizer.config.forms.fancybox
          )
        );
      }
    })).closest('.btn').on('click', function(){
      $(this).find('input').datepicker('show');
    });

  }

});
