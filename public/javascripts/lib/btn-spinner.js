$.ext.Class.namespace("iPlan.ui.util");

iPlan.ui.util.btnSpinner = (function($) {

  var createSpinner = function(element, $spinnerIcon) {
    var width = element.outerWidth();
    var height = element.outerHeight();

    // Create the spinner
    var spinner = $('<div class="btn-spinner"></div>').css({'line-height': height+'px', 'font-size': (height / 2)+'px', 'color': element.css('color'),
      'opacity' : '0.6', 'z-index': 9999, 'width': width+'px', 'text-align': 'center', 'position': 'absolute'});

    // Create spinner icon (used to be fontawesome)
    var spinnerIconHeight = height*0.5;
    if(!$spinnerIcon) $spinnerIcon = $('<div class="btn-spinner-icon"></div>')
    $spinnerIcon.css({'width' : spinnerIconHeight+'px', 'height': spinnerIconHeight+'px', 'top': ((height-spinnerIconHeight)/2) + 'px'});
    if (element.hasClass('btn-default')) $spinnerIcon.addClass('dark');
    spinner.append($spinnerIcon);

    // Append spinner above the submit button
    spinner.css({'left': element.position().left + 'px', 'top': element.position().top + 'px'});
    return spinner.insertBefore(element);
  };

  var showErrorTooltip = function(element, type) {
    var errorMessages = {
      'timeout' : element.data('ajax_timeout_message') || 'עושה רושם שישנה בעיה בחיבור האינטרנט, אנא נסו שנית',
      'default': element.data('ajax_error_message') || 'אירעה שגיאה בביצוע פעולה'
    }
    $('<div class="qtip_error_holder"></div>').appendTo(element.closest('div')).qtip($.extend(true, {},{
      content: {
        text: errorMessages[type] || errorMessages['default']
      },
      position: {
        target: element,
        my: 'bottom center',
        at: 'top center',
        adjust: {
         method: 'shift'
        },
        viewport: $('body')
      },
      show: {
        event: false
      },
      hide: {
        event: 'unfocus'
      },
      style:{
        classes: 'ui-tooltip-error'
      }

    },element.data('qtip-options') || {})).qtip('api').show();
  };

  var hideButtonOrLinkContent = function(elem) {
    if(elem.is('input')) {
      //it's a submit button, do ugly voodoo so it won't change size when we hide the content.
      var width = elem.outerWidth();
      var height = elem.outerHeight();
      // This used for pressing enter multiple times and sets the input's original width cause we are removing the value
      elem.data('OriginalValue', elem.val());
      elem.val('').outerWidth(width + 'px').outerHeight(height + 'px');
    } else if (elem.is('a')) hideLinkContent(elem);
  };
  var showButtonOrLinkContent = function(elem) {
    if(elem.is('input')) elem.val(elem.data('OriginalValue'));
    else if(elem.is('a')) showLinkContent(elem);
  };

  var hideLinkContent = function(link) {
    return link.wrapInner('<span></span>').find('> span').css('visibility', 'hidden');
  };

  var showLinkContent = function(link) {
    link.html( link.find('> span').html() );
  };

  $(document).on('ajax:before', '.btn[data-remote=true]:not([data-spin-on-submit=false]), .btn-group:not([data-spin-on-submit=false]) .dropdown-menu a[data-remote=true]', function() {
    //where ajax events are triggered
    var trigger_element = $(this);
    //find the button to show the spinner on
    if($(this).is('.btn')) {
      var button = $(this);
    } else {
      var button = $(this).closest('.btn-group').find('[data-toggle=dropdown]');
    }

    // disable the button and show the spinner
    button.prop('disabled', true).addClass('disabled');
    hideButtonOrLinkContent(button);
    var spinner = createSpinner(button);

    //on complete callback restore disabled buttons and remove spinner. show an error if needed
    trigger_element.one('ajax:complete', function(){
      button.prop('disabled', false).removeClass('disabled');
      showButtonOrLinkContent(button);
      spinner.remove();
    });
    trigger_element.one('ajax:error', function(){
      showErrorTooltip(button);
    });
  });
  // listen for submit event on forms and replace submit button with spinner and disable buttons that have css class disable_on_submit
  $(document).on('submit', 'form', function() {
    var form = $(this);
    //first disable buttons in form that should be disabled
    var buttons = form.find('input[type=submit], .disable_on_submit');
    buttons.prop('disabled', true).addClass('disabled');

    // now find submit buttons
    var btnSubmit = form.find('[data-spin-on-submit=true]').first();
    if (btnSubmit.length == 0) btnSubmit = $(this).find('input[type=submit]:not([data-spin-on-submit=false])').first();
    if (btnSubmit.length == 0) return;


    var spinner = createSpinner(btnSubmit);
    hideButtonOrLinkContent(btnSubmit);
    if(btnSubmit.is('input')) {
      //it's a submit button, do ugly voodoo so it won't change size when we hide the content.
      var width = btnSubmit.outerWidth();
      var height = btnSubmit.outerHeight();
      // This used for pressing enter multiple times and sets the input's original width cause we are removing the value
      btnSubmit.data('OriginalValue', btnSubmit.val());
      btnSubmit.val('').outerWidth(width + 'px').outerHeight(height + 'px');
    } else if (btnSubmit.is('a')) hideLinkContent(btnSubmit);


    // if ajax, on complete callback restore disabled buttons and remove spinner. show an error if needed
    if(form.data('remote')) {
      form.one('ajax:complete', function(){
        spinner.remove();
        showButtonOrLinkContent(btnSubmit);
        buttons.prop('disabled', false).removeClass('disabled');
      });
      form.one('ajax:error', function(e, xhr, options) {
        showErrorTooltip(btnSubmit, xhr.statusText);
      });
    }
  });

  return {
    createSpinner: createSpinner,
    showErrorTooltip: showErrorTooltip,
    hideButtonOrLinkContent: hideButtonOrLinkContent,
    showButtonOrLinkContent: showButtonOrLinkContent
  }
})(jQuery);