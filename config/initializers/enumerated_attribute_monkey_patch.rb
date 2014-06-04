module EnumeratedAttribute
  module Integrations

    module ActiveRecord

      module ClassMethods
        private

        # we put it in initializers because models with enum attributes are loaded and use this stupid gem, so the patch must be here
        def define_enumerated_attribute_new_method
          class_eval do
            class << self
              unless method_defined?(:new_without_enumerated_attribute)
                alias_method :new_without_enumerated_attribute, :new
                def new(*args, &block)
                  result = new_without_enumerated_attribute(*args, &block)
                  params = (!args.empty? && args.first.instance_of?(Hash)) ? args.first : {}
                  params.each { |k, v| result.write_enumerated_attribute(k, result[k.to_s]) if self.has_enumerated_attribute?(k.to_s) }
                  result.initialize_enumerated_attributes(true)
                  yield result if block_given?
                  result
                end
              end
              unless private_method_defined?(:method_missing_without_enumerated_attribute)
                define_chained_method(:method_missing, :enumerated_attribute) do |method_id, *arguments|
                  arguments = arguments.map{|arg| arg.is_a?(Symbol) ? arg.to_s : arg }
                  method_missing_without_enumerated_attribute(method_id, *arguments)
                end
              end
            end
          end
        end
      end
    end
  end
end