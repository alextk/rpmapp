module RadioBar
  class Builder

    def initialize(tpl, options)
      @tpl = tpl
      @options = options
    end

    # usage
    # rb.item :val1, 'text1'
    # rb.item :val2, 'text2', :title => 'puki', :class => 'zkui'
    # rb.item :val1, :title => 'puki', :class => 'zkui' do
    #   =t('.text1')
    # rb.item :val1 do
    #   =t('.text1')
    def item(value, *args)
      value = value.to_s
      label_text = nil
      item_options = {}

      if args.length > 0
        if args.first.is_a?(String)
          label_text = args.first
        end
        item_options = args.last if args.last.is_a?(Hash)
      end

      name = @options[:name]
      id = "#{name.delete("]").gsub('[','_')}_#{value}"
      id = "#{@options[:id_prefix]}_#{id}" if @options[:id_prefix].present?
      html = @tpl.tag(:input, :type => :radio, :name => name, :id => id, :value => value, :checked => @options[:selected].to_s==value ? 'checked' : nil)

      label_class = value
      label_class << ' ' << item_options[:class] if item_options[:class].present?
      label_options = {:for => id, :class => label_class}
      label_options[:title] = item_options[:title] if item_options[:title].present?


      if block_given?
        lbl_html = @tpl.content_tag :label, label_options do
          yield
        end
      elsif label_text.present?
        lbl_html = @tpl.content_tag :label, label_text, label_options
      else
        raise ArgumentError, "Neither block nor label_text were given"
      end
      html << lbl_html
      html
    end

  end
end