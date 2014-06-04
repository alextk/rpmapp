$.ext.Class.namespace('MyRPM.controllers');

MyRPM.controllers.DailyPlansDayViewController = $.ext.Class.create('MyRPM.controllers.DailyPlansDayViewController', {

  initialize: function(config) {
    var self = this;
    this.initialConfig = config || {};
    jQuery.extend(this, this.initialConfig);

    this._initEvents();
    this._initTimeCommitmentQtip();
    this.layoutTimedEvents();

    this.pxHourHeight = $('.day_view_schedule_table .scroll_wrapper .marker_wrapper').height();
    $('.day_view_schedule_table .scroll_wrapper').scrollTop(8 * this.pxHourHeight); //scroll to reveal 08:00
  },

  _initEvents: function(){
    var self = this;
    //init sidebar tabs
    $('.sidebar .tabbable .nav.nav-tabs li a').on('click', function(){
      var activeTab = $(this).data('tab');
      $(this).closest('.tabbable').find('.tab-content .tab-pane').each(function(){ $(this).toggleClass('active', $(this).data('tab') == activeTab); });
      $(this).closest('.tabbable').find('.nav.nav-tabs li').each(function(){ $(this).toggleClass('active', $(this).find('a[data-tab]').data('tab') == activeTab); });
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

    //init schedule button to load new schedule into qtip and position it beside the button
    $(document).on('click', '.rpm_block_assoc .info .btn.schedule_rpm_block', function(e){
      self._showNewTimeCommitmentQtip($(this));
    });

    //show rpm block schedule qtip when clicked on it inside qtip
    $(document).on('click', '.day_view_schedule_table .scroll_wrapper', function(e){
      if($(e.target).closest('td.col_day_contents, td.hours_markers').length == 0) return;
      var eventBox = $(e.target).closest('.event_box');
      if(eventBox.length > 0){
        //self._showEditTimeCommitmentQtip(eventBox.data('id'), eventBox.data('edit_url'), e);
        self._showEditTimeCommitmentQtip(eventBox, e);
      }
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

  _showNewTimeCommitmentQtip: function(btn){
    var loadingHtml = $('.day_view_schedule_table .time_commitment_qtip_loading_template').clone().html();
    this.qtipTimeCommitment.set('content.text', $('<div class="time_commitment_qtip"></div>').attr('data-id', 'new').html(loadingHtml));
    this.qtipTimeCommitment.set('position.target', btn);
    this.qtipTimeCommitment.show();


    $.ajax({
      url: btn.data('url'),
      type: 'get',
      dataType: 'script'
    });
  },

  _showEditTimeCommitmentQtip: function(timeCommitmentBox, e){
    var loadingHtml = $('.day_view_schedule_table .time_commitment_qtip_loading_template').clone().html();
    this.qtipTimeCommitment.set('content.text', $('<div class="time_commitment_qtip"></div>').attr('data-id', timeCommitmentBox.data('id')).html(loadingHtml));
    this.qtipTimeCommitment.set('position.target', timeCommitmentBox);
    this.qtipTimeCommitment.show();

    $.ajax({
      url: timeCommitmentBox.data('edit_url'),
      type: 'get',
      dataType: 'script'
    });
  },

  hideTimeCommitmentQtip: function(){
    this.qtipTimeCommitment.hide();
  },

  onAjaxTimeCommitmentQtipContentsLoaded: function(timeCommitmentId, html){
    $('.ui-tooltip div.time_commitment_qtip[data-id={0}]'.format(timeCommitmentId)).html(html);
    this.qtipTimeCommitment.redraw().reposition();
  },

  onAjaxNewTimeCommitmentCreated: function(commitmentId, newContents){
    this.hideTimeCommitmentQtip();
    $('.day_view_schedule_table td.col_day_contents .event_boxes_abs').append(newContents);
    this.layoutTimedEvents();
  },

  onAjaxTimeCommitmentUpdated: function(commitmentId, newContents){
    this.hideTimeCommitmentQtip();
    $('.day_view_schedule_table td.col_day_contents .event_boxes_abs .event_box[data-id={0}]'.format(commitmentId)).replaceWith(newContents);
    this.layoutTimedEvents();
  },

  onAjaxTimeCommitmentDestroyed: function(commitmentId){
    this.hideTimeCommitmentQtip();
    $('.day_view_schedule_table td.col_day_contents .event_boxes_abs .event_box[data-id={0}]'.format(commitmentId)).remove();
    this.layoutTimedEvents();
  },

  onAjaxRpmBlockAssocsDestroyed: function(rpmBlockAssocIdsArray){
    var self = this;
    rpmBlockAssocIdsArray.each(function(id){
      self.onAjaxRpmBlockAssocDestroyed(id);
    });
  },

  onAjaxRpmBlockAssocDestroyed: function(rpmBlockAssocId){
    $('div.rpm_block_assoc[data-id={0}]'.format(rpmBlockAssocId)).remove();
    $('.day_view_schedule_table td.col_day_contents .event_boxes_abs .event_box[data-rpm_block_assoc_id={0}]'.format(rpmBlockAssocId)).remove();
    this.layoutTimedEvents();
  },

  onAjaxRpmBlockCompletionChanged: function(rpmBlockId, completed){
    $('div.rpm_block_assoc[data-rpm_block_id={0}]'.format(rpmBlockId)).attr('data-completed', completed).data('completed', completed);
  },

  _initTimeCommitmentQtip: function(){
    this.qtipTimeCommitment = $('<div class="time_commitment_qtip_holder" style="display: none;"></div>').appendTo($('.day_view_schedule_table')).qtip({
      content: 'kak dela?',
      position: {
        my: 'top center',
        at: 'bottom center',
        effect: false
      },
      show: {
        event: false,
        effect: false
      },
      hide: {
        event: 'unfocus',
        effect: false
      },
      style:{
        classes: 'ui-tooltip-ajax',
        tip: {
          corner: true,
          width: 10,
          height: 10
        }
      }
    }).qtip('api');
  },

  layoutTimedEvents: function(){
    var visibleTimedEvents = [];
    $('.day_view_schedule_table .scroll_wrapper td.col_day_contents .event_boxes_abs .event_box').each(function(){
      var eventInfo = {
        html: $(this),
        duration: $(this).data('duration_in_minutes'),
        starts_at_from_midnight: $(this).data('start_at_from_midnight_in_minutes')
      };
      visibleTimedEvents.push(eventInfo);
    });
    var dayViewLayouter = new MyRPM.lib.TimedEventsLayouter(visibleTimedEvents);
    dayViewLayouter.layout();
    var htmlTimed = $('<div></div>');
    visibleTimedEvents.each(function(de){ htmlTimed.append(de.layouted_html); });
    $('.day_view_schedule_table .scroll_wrapper td.col_day_contents .event_boxes_abs').html(htmlTimed.html());
  }

});
