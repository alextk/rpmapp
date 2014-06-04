module RadioBar
  module ActionView
    module Helpers

      def radio_bar_tag(name, options = {})
        raise ArgumentError, "Missing block" unless block_given?
        builder = RadioBar::Builder.new(self, options.update(:name => name.to_s))
        content_tag :span, :class => 'togglebar', 'data-type' => :radio do
          yield builder
        end
      end

    end

    module FormBuilder
      def radio_bar(method, options = {}, &block)
        options = objectify_options({}.merge(options))
        options[:selected] = options[:object].send(method)
        name = "#{@object_name}[#{method.to_s.sub(/\?$/,"")}]"
        @template.radio_bar_tag(name, options, &block)
      end
    end
  end
end