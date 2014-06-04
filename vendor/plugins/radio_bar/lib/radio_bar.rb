#puts "load #{__FILE__}"

%w(builder   helpers).each do |file_name|
  require_dependency File.join(File.dirname(__FILE__), 'radio_bar', file_name)
end

module RadioBar

end

# AjaxCalendar
::ActionView::Base.send(:include, RadioBar::ActionView::Helpers)
::ActionView::Helpers::FormBuilder.send :include, RadioBar::ActionView::FormBuilder