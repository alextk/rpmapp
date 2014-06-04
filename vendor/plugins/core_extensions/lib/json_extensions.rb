#json extension add two options to to_json hash:
# :exclude_root (boolean) - if true, the root will be excluded from returned string
# :strip_? (boolean) - if true, all attributes that contain "?" in their name, will be replaced to be without "?"
module ActiveRecord #:nodoc:
  # = Active Record Serialization
  module Serialization

    #in this method we handle :exclude_root option
      def as_json(options)
        options ||= {}
        if options[:exclude_root]
          options[:root] = 'my_root'
        end
        result = super(options)
        result = result[options[:root]] if options[:exclude_root]
        result
      end

      #alias_method :serializable_hash_old, :serializable_hash

      #in this method we perform strip of "?" in attribute names
#      def serializable_hash(options)
#        options ||= {}
#        result = super(options)
#        if options[:strip_?]
#          result.keys.select { |key| key.to_s.include?("?") }.each do |key|
#            result[key.to_s.gsub('?', '')] = result[key]
#          end
#        end
#        result
#      end

  end
end
