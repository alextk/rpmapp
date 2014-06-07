$.ext.Class.namespace('MyRPM.controllers');

MyRPM.controllers.JournalEntriesDayViewController = $.ext.Class.create('MyRPM.controllers.JournalEntriesDayViewController', {

  initialize: function(config) {
    var self = this;
    this.initialConfig = config || {};
    jQuery.extend(this, this.initialConfig);

    this._initEvents();
  },

  _initEvents: function(){
    var self = this;
    //init cancel button in new form
    $('div.add_journal_entry').on('click', '.form_placeholder [data-action=hide_new_form]', function(){ self.hideNewForm(); });
    $(document).on('click', '.edit_view form [data-action=hide_form]', function(e){ self.hideForm(e); });


    //init show/hide rpm block actions
    $(document).on('click touchend', '.journal_entry', function(e){
      var target = $(e.target);
      if(target.closest('.description, .btn, .dropdown').length > 0) return;
      $(this).closest('.journal_entry').toggleClass('show_description');
    });
  },

  hideForm: function(e){
    $(e.target).closest('.edit_view').hide();
    $(e.target).closest('.journal_entry').find('.show_view').show();
  },

  loadNewForm: function(formHtml){
    this.loadForm($('.journal_entries_list .journal_entry.new'), formHtml);
  },

  loadEditForm: function(id, formHtml){
    this.loadForm($('.journal_entries_list .journal_entry[data-id={0}]'.format(id)), formHtml);
  },

  loadForm: function(divJE, formHtml){
    var self = this;
    divJE.find('.show_view').hide();
    divJE.find('.edit_view').html(formHtml).show();
    divJE.find('form [name*=journal_entry_category_id]').on('change', function(){
      var categoryId = $(this).val();
      var form = $(this).closest('form');
      form.find('.category_icon_and_desc').hide().filter('[data-category_id={0}]'.format(categoryId)).show();
      var nameValue = form.find('input[name*=name]').val().strip();
      if(nameValue == '' || Object.keys(self.defaultEntryNames).collect(function(c){ return self.defaultEntryNames[c] }).include(nameValue)) form.find('input[name*=name]').val(self.defaultEntryNames[categoryId]);
      form.find('.category_guiding_questions').hide().filter('[data-category_id={0}]'.format(categoryId)).show();
    }).filter(':checked').trigger('change');

    Initializers.initNonLive(divJE.find('.edit_view'));
  },

  onAjaxJournalEntryCreated: function(jeHtml){
    var divNewJE = $('.journal_entries_list .journal_entry.new');
    divNewJE.before(jeHtml);
    divNewJE.find('.edit_view form [data-action=hide_form]').trigger('click');
  },

  onAjaxJournalEntryUpdated: function(id, jeHtml){
    $('.journal_entries_list .journal_entry[data-id={0}]'.format(id)).replaceWith(jeHtml);
  },

  onAjaxJournalEntryDestroyed: function(id){
    $('.journal_entries_list .journal_entry[data-id={0}]'.format(id)).remove();
  }

});
