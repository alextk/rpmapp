# extensions to the i18n module with DataBase backend and couple of changes to the default Chaining.
module I18n
  module Backend
    # This module will be included in the Simple backend.
    module ChainedCache
      include Cache

      protected
        # Change the default behavior of fetch in the cache module (that will be included in the Simple and Database backends).
        # When it comes to MissingTranslationData we just raise an exception and don't keep any notes about
        # the missing translation because the translation can still be found in another chained backend (DataBase backend).
#        def fetch(*args, &block)
#          result = I18n.cache_store.fetch(cache_key(*args), &block)
#          raise result if result.is_a?(Exception)
#          result = result.dup if result.frozen?
#          result
#        rescue MissingTranslationData => exception
#          raise exception
#        end

        def fetch_storing_missing_translation_exception(cache_key, &block)
          fetch_ignoring_procs(cache_key, &block)
          rescue MissingTranslationData => exception
          #I18n.cache_store.write(cache_key, exception)
          raise exception
        end

        # Change the key for all default English translations (for example ActiveRecord's translations)
        # to include country sym.
        # The change is from :en to :'en-US'
        def init_translations
          super
          return if @translations[:"en-US"].nil?
          @translations[:"en-US"].merge!(@translations[:en]) { |key, v1, v2| v1 }
          @translations.delete(:en)
        end
    end
    class Chain
      # Default store translation in Chain class stores the translation in the first chained backend (which is Simple backend),
      # this change make it store the translation in the last backend (DataBase backend).
      def store_translations(locale, data, options = {})
        backends.last.store_translations(locale, data, options = {})
      end
      # Add a method to get all the translations from all chained backends.
      def translations
        backends.map { |backend| backend.send(:translations) }.flatten.uniq
      end
    end

    # A new DataBase backend based on the ActiveRecord backend.
    class DataBase < ActiveRecord

      def store_translations(locale,data,options={})
        key = data.keys.first
        value = data[key]
        t = Translation.find_or_create_by_locale_and_key(locale.to_s,key.to_s)
        t.value = value
        t.save
      end

      protected
        # Change default lookup method to store translation in the Data base if not found.
        def lookup(locale, key, scope = [], options = {})
          key = normalize_flat_keys(locale, key, scope, options[:separator])
          result = Translation.locale(locale).lookup(key).all

          if result.empty?
            Language.all_cached.each { |l|
              locale = l.locale
              store_translations(locale,key=>nil)
            }
            return nil
          elsif result.first.key == key
            result.first.value
          else
            chop_range = (key.size + FLATTEN_SEPARATOR.size)..-1
            result = result.inject({}) do |hash, r|
              hash[r.key.slice(chop_range)] = r.value
              hash
            end
            result.deep_symbolize_keys
          end
        end

        def translations()
          # The backend doesn't contain all the translations... you will have to query the DB for that,
          # this method is only implemented to support the translation function in the Chain class.
          return {}
        end
    end
  end
end
#I18n::Backend::Simple.send(:include, I18n::Backend::ChainedCache)
#I18n::Backend::Simple.send :include, I18n::Backend::Fast
#I18n::Backend::Simple.send :include, I18n::Backend::InterpolationCompiler

#I18n::Backend::DataBase.send(:include, I18n::Backend::ChainedCache)
# Chain the default backend and the DataBase backend.
# Note that DataBase backend must come last because missing translations are stored in the last backend.
#I18n.backend=I18n::Backend::Chain.new(I18n.backend,I18n::Backend::DataBase.new)