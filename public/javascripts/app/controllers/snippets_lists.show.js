$.ext.Class.namespace('MyRPM.controllers');

MyRPM.controllers.SnippetsListsShowController = $.ext.Class.create('MyRPM.controllers.SnippetsListsShowController', {

  initialize: function(config) {
    var self = this;
    this.initialConfig = config || {};
    jQuery.extend(this, this.initialConfig);

    this._initEvents();
  },

  _initEvents: function(){
    var self = this;

    //init go to date datepicker
    $('.plans_nav .btn input[name=go_to_date]').datepicker(jQuery.extend({}, jQuery.datepicker.regional['he-IL'], {
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
        window.location = $(this).closest('.btn').data('url').replace('__0__', dateText);
      }
    })).closest('.btn').on('click', function(){
      $(this).find('input').datepicker('show');
    });

    //init sorting rpm blocks
    $('.box .snippets_list').sortable({
      items: '>.snippet',
      placeholder: 'ui-sortable-placeholder',
      handle: 'i.icon-move',
      helper: function(event, item){
        return $('<div class="ui-sortable-helper"></div>').html(item.find('div.info .outcome').clone());
      },
      update: function(event, ui){
        var ids = $(this).find('.snippet').map(function(){ return $(this).data('id') }).toArray();
        $.ajax({
          url: $(this).data('update_positions_url'),
          type: 'post',
          dataType: 'script',
          data: $.param({ids: ids})
        });
      }
    });

    //init show/hide rpm block actions
    $('div.snippets_list').on('click', '.snippet', function(e){
      var target = $(e.target);
      if(target.closest('.btn, .collapsible').length>0) return;
      $(this).closest('.snippet').toggleClass('show_collapsible').hasClass('show_collapsible');
    });
  }

});
