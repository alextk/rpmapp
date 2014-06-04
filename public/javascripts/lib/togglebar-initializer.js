ToggleBarInitalizer = {

  init: function(container) {
    if(arguments.length == 0) container = $(document);
    if(!(container instanceof jQuery)) container = $(container);
    container.find('.togglebar').each(function(){
      var spanToggleBar = $(this);
      spanToggleBar.toggleBar({radio: $(this).data('type') == 'radio'});
    });
  }

};