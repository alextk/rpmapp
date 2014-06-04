(function($) {

  $(document).on('ajax:beforeSend', 'form[data-remote=true]', function(){
    var $self = $(this);
    // This code is so ugly because of ie 8.
    // Ie 8 form submission doesn't work if you add class to div action before the form is submitted.
    $self.addClass('working');
    setTimeout(function() {
      $self.find('div.actions').addClass('working');
    },0);
  });

  $(document).on('ajax:complete', 'form[data-remote=true]', function(){
    $(this).removeClass('working').find('div.actions').removeClass('working');
  });

  $(document).on('ajax:error', 'form[data-remote=true]', function(){
    $(this).addClass('ajaxError').find('div.actions').addClass('ajax_error');
  });

  $(document).on('submit', 'form:not([data-remote=true])', function(){
    var $self = $(this);
    // This code is so ugly because of ie 8.
    // Ie 8 form submission doesn't work if you add class to div action before the form is submitted.
    $self.addClass('working');
    setTimeout(function() {
      $self.find('div.actions').addClass('working');
    },0);
  });

})(jQuery);