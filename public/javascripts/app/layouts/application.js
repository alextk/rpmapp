FancyBoxInitalizer.liveInit();

FancyBoxInitalizer.reloadCurrentPage = function(){
  var fboxHTML = '<div class="tcenter" style="padding: 20px">נא להמתין...</div>';
  if($('#fancybox-content').is(':visible')){
    $('div.fbox').replaceWith(fboxHTML);
  } else {
    $.fancybox(
      $.extend({ content: fboxHTML }, FancyBoxInitalizer.config.forms.fancybox)
    );
  }
  window.location.reload();
};

jQuery(document).ready(function(){
  QTipIntializer.init();
  ToggleBarInitalizer.init();
});


//init goto date picker button
$(document).ready(function(){
  $('.btn input[name=go_to_date]').datepicker(jQuery.extend({}, jQuery.datepicker.regional['he-IL'], {
    showOtherMonths: true,
    selectOtherMonths: true,
    dateFormat: 'yy-mm-dd',
    beforeShow: function (input, inst) {
      window.setTimeout(function() {
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

});