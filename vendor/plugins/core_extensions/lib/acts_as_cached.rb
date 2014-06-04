# Adds acts_as_cached to ActiveRecord.
# syntax:
#   class AdministrationMenu < Menu
#     acts_as_cached do
#       order('parent_id,position ASC').all
#     end
#
# AdministrationMenu.all_cached will get all the AdministrationMenu's records (in the example above ordered by parent_id and position).
# Unless it's the first time querying those records they will be brought from the cache.
# * Note that the cache is Rails.cache which is usually defined in config/application.rb and is set to :memory_store but can also be set to :mem_cache_store
#   or any other caching mechanisim.
# Any change in an AdministrationMenu record will update the cache.

module ActiveRecord
  module Acts
    module Cached
      def self.included(base)
        base.extend(ClassMethods)
        base.send(:include, InstanceMethods)
      end
      module ClassMethods
        def acts_as_cached(&block)
          # keeps a block representing the query (default is all) useful for adding order by.
          cattr_accessor :all_cached_query            
          self.all_cached_query = block if block_given?
          self.class_eval do
            def self.all_cached
              query = lambda{|model| model.all_cached_query.nil? ? model.all : model.all_cached_query.call}
              # in development environment Classes are not cached by default, it's set in Configuration\environments\development.rb
              # => config.cache_classes = false
              # Because classed are loaded on each request a cached entity isn't equal to its equivilent fresh entity (even though they should be).
              # So we call the query each time only in development environment so that the data will still be equal.
              Rails.cache.write("#{self}.all",query.call(self)) if Rails.env=='development'
              Rails.cache.fetch("#{self}.all") { query.call(self)}
            end
          end
        end
      end
      module InstanceMethods
        def after_save; Rails.cache.delete("#{self.class}.all"); end
        def after_destroy; Rails.cache.delete("#{self.class}.all"); end
      end
    end
  end
end
ActiveRecord::Base.send :include, ActiveRecord::Acts::Cached