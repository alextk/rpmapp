module ActiveRecord
  module Acts
    module Searchable
      def self.included(base)
        base.extend(ClassMethods)
        base.send(:include, InstanceMethods)
      end
      module ClassMethods
        def acts_as_searchable(*searchable_fields)
          cattr_accessor :searchable_fields
          self.searchable_fields = searchable_fields
          self.class_eval do
            # Search the title and body fields for the given string.
            # Start with an empty scope and build on it for each attr.
            # (Allows for easy extraction of searchable fields definition
            # in the future)
            def self.search(q, attributes=[])
              attributes = self.searchable_fields if attributes.blank?
              and_clauses = []
              values = []
              translatable_join = self.respond_to?(:translated_attribute_names) && (self.translated_attribute_names & attributes).length > 0  # note the '&' operator checks for array intersection
              q.split(' ').each do |qs|
                or_clauses = []
                attributes.each do |attr|
                  col = self.columns_hash[attr.to_s]
                  raise ArgumentError.new("Uknown column #{attr}") if col.nil?
                  if col.type == :string
                    tbl_name = translatable_join && self.translated_attribute_names.include?(attr) ? self.translations_table_name : self.table_name #select translations table or regular table
                    or_clauses << "LOWER(#{tbl_name}.#{attr}) LIKE ?"
                    values << "%#{qs.downcase}%"
                  else
                    or_clauses << "LOWER(CAST(#{self.table_name}.#{attr} AS TEXT)) LIKE ?"
                    values << "%#{qs.downcase}%"
                  end
                end
                and_clauses << "(#{or_clauses.join(' or ')})"
              end
              arel = scoped
              if translatable_join
                arel = arel.joins("LEFT JOIN #{self.translations_table_name} on #{self.table_name}.id = #{self.translations_table_name}.#{self.model_name.singular}_id and #{self.translations_table_name}.locale = '#{I18n.locale}'")
              end
              arel.where(and_clauses.join(' and ').to_a + values)
            end         

          end
        end
      end
      module InstanceMethods
      end
    end
  end
end
ActiveRecord::Base.send :include, ActiveRecord::Acts::Searchable