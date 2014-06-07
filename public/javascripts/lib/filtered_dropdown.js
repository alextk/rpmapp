
jQuery(document).ready(function(){

  jQuery('body').on('click', '.dropdown-menu [data-provides=filter]', function(e) {
    e.stopPropagation();
  });
  jQuery('body').on('keyup', '.dropdown-menu [data-provides=filter]', function(e) {
    var value = $(this).val();
    var e2h = {e: 'ק',r:'ר', t:'א', y:'ט', u:'ו', i:'ן', o:'ם', p:'פ', a:'ש', s:'ד', d:'ג', f:'כ', g:'ע', h:'י', j:'ח', k:'ל', l:'ך', z:'ז', x:'ס', c:'ב', v:'ה', b:'נ', n:'מ', m:'צ'};
    if(value.match(/[a-zA-Z]/)) {
      var hebrew = jQuery.map( value.split(''), function(e){ return e2h[e]  }).join('');
      var query = new RegExp( value + '|' + hebrew , 'i');
    } else {
      var query = new RegExp( value , 'i');
    }

    $(this).closest('.dropdown-menu').find('.filterable').each(function(){
      element = $(this);
      element.toggle( query.test(element.text()) );
    });
  });

  jQuery('body').on('click', '.dropdown-menu[data-update] a', function(e) {
    var dropdown = $(this).closest('.dropdown-menu');
    var field = dropdown.data('update');
    $(field).val( $(this).data('value') );
    $(field).change();
    dropdown.parent().find('.dropdown-toggle .dropdown-label').html( $(this).html() );
  });

  jQuery('body').on('focus', '.dropdown-toggle', function(e) {
    var enclosing = $(this).parent();
    // the filter isn't visible when event fires
    setTimeout(function() { enclosing.find('[name=filter]').focus(); }, 200)
  });
  jQuery('body').on('keydown', '.dropdown-menu li :focus', function(e) {
    if(e.which == 40 || e.which == 38) {
      var func = e.which == 40 ? 'next' : 'prev';
      var next = $(this).parent()[func]();
      while(next.length > 0 && (next.is('.divider') || !next.is(':visible'))) { next = next[func]()  }
      next.find('a').focus();
      e.preventDefault();
    } else if(e.which == 13) {
      $(this).click()
    }
  });
});