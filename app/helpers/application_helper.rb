module ApplicationHelper

  def markdown_html(markdown)
    MarkdownUtils.renderer.render(markdown).html_safe
  end

  def string_if(str, condition)
    condition ? str : ''
  end

  def distance_of_time_in_words_from_now(to_time, now_time = Time.now, include_seconds = false)
    words = distance_of_time_in_words(to_time, now_time, include_seconds)
    if now_time > to_time # happened in past --> use ago
      I18n.t('datetime.in_words.ago', :words => words)
    else # will happen in future --> use in
      I18n.t('datetime.in_words.in', :words => words)
    end
  end

  def distance_of_time_in_words_from_now_qtip(to_time, format = :full)
    from_now_words = distance_of_time_in_words_from_now(to_time)
    content_tag :span, :class => 'qtipTarget' do
      html = from_now_words.html_safe
      html << content_tag(:div, I18n.l(to_time, :format => format), :class => 'qtipContents')
      html
    end
  end

  # display flash message box with design from _flash_message.sass
  # usage1: flash_message(type, message, html_options)
  # usage2: flash_message(type, html_options){ ... }
  # +type+ can be either of: success, error, tip, note, warning
  def flash_message(type, *args, &block)
    message = block_given? ? capture_haml(&block) : args.first
    raise ArgumentError.new("Neither message nor block were given") if message.nil?

    html_options = args.last.is_a?(Hash) ? args.last : {}
    show_close_button = html_options.delete(:close_button) == true
    html_options[:class] = "flash_message #{type.to_s} #{html_options[:class] || ''}"

    content_tag :div, html_options do
      html = ''.html_safe
      html << content_tag(:button, 'x', :class => 'close', 'data-dismiss'=>'alert') if show_close_button
      html << content_tag(:div, message, :class => 'text')
      html
    end
  end

  def bs3_form_for(*args, &block)
    options = args.extract_options!
    options.reverse_merge!({:builder => ActionView::Helpers::B3FormBuilder})
    form_for(*(args << options), &block)
  end

  def link_to_fbox(*args, &block)
    if block_given?
      options      = args.first || {}
      html_options = args.second
      link_to_fbox(capture(&block), options, html_options)
    else
      name         = args[0]
      options      = args[1] || {}
      html_options = args[2] || {}

      url = url_for(options)
      html_options['data-url'] = html_escape(url)
      html_options['data-fbox'] ||= :form

      link_to(name, 'javascript:;', html_options)
    end
  end

  def link_to_fbox2(*args, &block)
    if block_given?
      options      = args.first || {}
      html_options = args.second
      link_to_fbox2(capture(&block), options, html_options)
    else
      name         = args[0]
      options      = args[1] || {}
      html_options = args[2] || {}

      html_options['data-fancybox-type'] ||= 'ajax'
      url = url_for(options)
      if html_options['data-fancybox-type'] == 'ajax' && !(url =~/\.(fbox|popo)(\?|\/?$)/i) #popo link without popo format
        url = url =~ /\?/ ? url.sub('?', '.fbox?') : "#{url}.fbox" #add fbox at end ob path, before query string
      end
      html_options['data-fancybox-href'] = html_escape(url)
      # This class is here so that quotouch js will not initialize fancy box links cause they don't play nice together
      html_options[:class] = "notap #{html_options[:class]}"
      link_to(name, 'javascript:;', html_options)
    end
  end

  def buttons_bar(options = {})
    options = {:spinner_message => nil, :ajax_error_message => 'פעולה נכשלה', :class => ''}.update(options)
    haml_tag 'div.actions', :class => options[:class] do
      haml_tag 'div.buttons' do
        yield
      end
      haml_tag 'div.ajax_error' do
        haml_tag :span, options[:ajax_error_message], :class => 'message vmiddle'
        haml_concat link_to(t('application.try_again'), 'javascript:;', :class => 'blue_link2 vmiddle', :onclick=>"$(this).closest('.actions').removeClass('ajax_error')")
      end
      haml_concat working_spinner(options[:spinner_message])
    end
  end

  def working_spinner(message = nil)
    message = t('application.form.working') if message.blank?
    content_tag :div, :class => 'working_spinner' do
      content_tag :span, message, :class => 'text'
    end
  end

  # renders filter bar with free text search by default. The other content comes from the block
  # sass is included from stylesheets/sass/app/client/_filter_bar
  def filter_bar(options = {}, &block)
    options = {
      :id => ActiveSupport::SecureRandom.hex(5),
      :free_text => {:show => true, :name => 'filter_free_text', :value => ''},
      :filter_id => {:show => false, :name => 'filter_id', :value => ''},
      :more => false,
      :bootstrap => true,
      :icon => true,
      :bar_class => '',
      :manual_submit => false,
      :submit_error_message => 'פעולה נכשלה',
      :submit_via_grid_id => nil, # id of the datagrid that will be used to submit filter form
      :form_options => {:url => '', :method => :get, :remote => true},
    }.deep_merge(options)

    options[:bar_class] += ' with_bootstrap' if options[:bootstrap]
    options[:bar_class] += ' no_icon' unless options[:icon]
    options[:form_options] = {} if options[:submit_via_grid_id].present?
    filter_bar_id = options[:id]

    haml_tag 'div.filter_bar', :class => options[:bar_class], 'data-id' => options[:id], 'data-manual_submit' => options[:manual_submit].to_s, 'data-submit_via_grid_id' => options[:submit_via_grid_id] do
      form_params = options[:form_options].delete(:params)
      str = form_tag options[:form_options].delete(:url), options[:form_options] do
        if form_params.present?
          form_params.each do |name, value|
            haml_concat hidden_field_tag(name, value)
          end
        end

        haml_tag 'div.icon' do
          haml_concat image_tag('blank.gif')
        end

        haml_tag 'div.search_fields' do
          if options[:free_text] && options[:free_text][:show]
            haml_tag 'div.float.free_text' do
              haml_tag 'div.delete'
              haml_concat text_field_tag(options[:free_text][:name], options[:free_text][:value], 'data-current-text' => options[:free_text][:value])
            end
            haml_tag 'div.separator'
          end
          if options[:filter_id] && options[:filter_id][:show]
            haml_tag 'div.float.filter_id' do
              haml_tag 'span.lbl', '#'
              haml_concat text_field_tag(options[:filter_id][:name], options[:filter_id][:value])
            end
            haml_tag 'div.separator'
          end
          block.call if block_given?
          haml_tag 'div.separator'
          haml_tag 'div.float.search_button' do
            cls_submit = options[:bootstrap] ? 'btn btn-inverse btn-medium' : 'button3 grey search'
            haml_concat submit_tag(I18n.t('application.search'), :class => cls_submit)
            if options[:more]
              haml_concat link_to(I18n.t('application.more'), 'javascript:;', :class => 'more_link')
            end
          end
          haml_tag 'div.clear'
          haml_tag 'div.more_container'
        end
        haml_concat working_spinner(I18n.t('application.searching_please_wait'))
        haml_tag 'div.submit_error' do
          haml_tag :span, options[:submit_error_message], :class => 'message vmiddle'
          haml_concat link_to(I18n.t('application.try_again'), 'javascript:;', :class => 'blue_link2 vmiddle')
        end
      end
      haml_concat str
      haml_concat %Q(<script type="text/javascript">$(".filter_bar[data-id=#{filter_bar_id}] .more").appendTo($(".filter_bar .more_container"))</script>) if options[:more]
      haml_concat %Q(<script type="text/javascript">$(".filter_bar[data-id=#{filter_bar_id}]").filterBar({})</script>)
    end
  end
end
