$.ext.Class.namespace('MyRPM.controllers');

MyRPM.controllers.JournalEntriesMonthViewController = $.ext.Class.create('MyRPM.controllers.JournalEntriesMonthViewController', {

  initialize: function(config) {
    var self = this;
    this.initialConfig = config || {};
    jQuery.extend(this, this.initialConfig);

    this._initEvents();
  },

  _initEvents: function(){
    var self = this;
    $('div.calendar_month_view').on('click', 'table.month_view tr.week td.day', function(){
      $.fancybox(
        $.extend({
            href: self.urls.day_view,
            ajax: {
              data: $.param({date: $(this).data('date'), format: 'fbox'})
            }
          },
          FancyBoxInitalizer.config.forms.fancybox
        )
      );
    });
  },

  onAddedMMA: function(date){
    $('div.calendar_month_view table.month_view tr.week td.day[data-date={0}]'.format(date)).removeClass('with_mma without_mma').addClass('with_mma');
  },

  onRemovedMMA: function(date){
    $('div.calendar_month_view table.month_view tr.week td.day[data-date={0}]'.format(date)).removeClass('with_mma without_mma').addClass('without_mma');
  }

});
