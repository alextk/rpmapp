TextExpanderInitializer = {

  init: function(container) {
    $('.see_more_text', container).each(function(){
      $(this).expander({
        slicePoint: $(this).data('slice_length') || 50,
        expandText: iPlan.i18n.read_more,
        userCollapseText: iPlan.i18n.read_less,
        expandEffect: 'show',
        expandSpeed: 0,
        collapseEffect: 'hide',
        collapseSpeed: 0
      });
    });
  }
};
