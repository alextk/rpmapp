$.ext.Class.namespace('MyRPM.controllers');

MyRPM.controllers.WeeklyPlansDayViewController = $.ext.Class.create('MyRPM.controllers.WeeklyPlansDayViewController', {

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
    $('.box .rpm_block_assocs').sortable({
      items: '>.rpm_block_assoc',
      placeholder: 'ui-sortable-placeholder',
      handle: 'i.icon-move',
      helper: function(event, item){
        return $('<div class="ui-sortable-helper"></div>').html(item.find('div.info .outcome').clone());
      },
      update: function(event, ui){
        var ids = $(this).find('.rpm_block_assoc').map(function(){ return $(this).data('id') }).toArray();
        $.ajax({
          url: $(this).data('update_positions_url'),
          type: 'post',
          dataType: 'script',
          data: $.param({ids: ids})
        });
      }
    });

    //init show/hide rpm block actions
    $(document).on('click', '.rpm_block_assoc', function(e){
      var target = $(e.target);
      if(target.closest('.actions, .btn, .dropdown, .completion_status').length > 0) return;
      $(this).closest('.rpm_block_assoc').toggleClass('show_actions').hasClass('show_actions');
    });

    //complete/uncomplete rpm block
    $(document).on('click', '.rpm_block_assoc .info .completion_status', function(e){
      $.ajax({
        url: $(this).data('url'),
        type: 'post',
        dataType: 'script',
        data: $.param({completed: !$(this).closest('.rpm_block_assoc').data('completed')})
      });
    });
  },

  onAjaxRpmBlockCompletionChanged: function(rpmBlockId, completed){
    $('div.rpm_block_assoc[data-rpm_block_id={0}]'.format(rpmBlockId)).attr('data-completed', completed).data('completed', completed);
  },

  onAjaxRpmBlockAssocsDestroyed: function(rpmBlockAssocIdsArray){
    var self = this;
    rpmBlockAssocIdsArray.each(function(id){
      self.onAjaxRpmBlockAssocDestroyed(id);
    });
  },

  onAjaxRpmBlockAssocDestroyed: function(rpmBlockAssocId){
    $('div.rpm_block_assoc[data-id={0}]'.format(rpmBlockAssocId)).remove();
  }

});
