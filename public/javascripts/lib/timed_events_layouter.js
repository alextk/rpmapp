$.ext.Class.namespace('MyRPM.lib');
/**
 * AjaxCalendarView class api
 */
(function($) {

  MyRPM.lib.TimedEventsLayouter = $.ext.Class.create({

    minHeight: 14,
    oneHourHeight: 42,

    initialize: function(timedEvents, blockWidth) {
      this.timedEvents = timedEvents;
      this.blockWidth = blockWidth || 500;
    },

    layout: function(){
      var self = this;
      var lastEventEnding = null;
      var columns = [];

      this.timedEvents.each(function(eventInfo, index) {
        self._calculatePositions(eventInfo);

        if (lastEventEnding !== null && eventInfo.top >= lastEventEnding) {
          self._packEvents(columns);
          columns = [];
          lastEventEnding = null;
        }

        var placed = false;
        for (var i = 0; i < columns.length; i++) {
          var col = columns[ i ];
          if (!self._collidesWith(col[col.length-1], eventInfo) ) {
            col.push(eventInfo);
            placed = true;
            break;
          }
        }

        if (!placed) {
          columns.push([eventInfo]);
        }

        if (lastEventEnding === null || eventInfo.bottom > lastEventEnding) {
          lastEventEnding = eventInfo.bottom;
        }
      });

      if (columns.length > 0) {
        self._packEvents(columns);
      }
    },
    
    _packEvents: function(columns){
      var n = columns.length;
      for (var i = 0; i < n; i++){
        var col = columns[ i ];
        for (var j = 0; j < col.length; j++){
          var eventInfo = col[j];
          if(!eventInfo.layouted_html) eventInfo.layouted_html = eventInfo.html.clone();
          eventInfo.layouted_html.css( 'top', eventInfo.top + 'px');
          eventInfo.layouted_html.css( 'height', eventInfo.height + 'px');
          eventInfo.layouted_html.find('.inside_container').height(eventInfo.height - 1);
          eventInfo.layouted_html.css( 'right', (i / n)*100 + '%' );
          eventInfo.layouted_html.css( 'width', this.blockWidth/n - 1 );
          eventInfo.layouted_html.css( 'width', (100/n - 2) + '%' );
        }
      }
    },

    // return true if e1 collides/overlaps with e2
    _collidesWith: function(e1, e2){
      return e1.bottom > e2.top && e1.top < e2.bottom;
    },
    
    _calculatePositions: function(eventInfo){
      if(eventInfo.positionsCalculated) return;
      eventInfo.height = this._minutesToPx(eventInfo.duration);
      eventInfo.top = this._minutesToPx(eventInfo.starts_at_from_midnight);
      eventInfo.bottom = eventInfo.top + eventInfo.height;
      eventInfo.height = eventInfo.height - 4; // leave space at the bottom (so if next event is at the end of this event, some spacing is visible)
      if(eventInfo.height < this.minHeight) eventInfo.height = this.minHeight;
      eventInfo.positionsCalculated = true;
    },

    _minutesToPx: function(minutes){
      return Math.floor(minutes/60 * this.oneHourHeight);
    }


  });


})(jQuery);
